"""
Itinerary / Route Optimisation Service — TSP/VRP per destination day-plan.

Strategy:
  1. Build a pairwise travel-time matrix using haversine distance
     (assume average travel speed of 30 km/h in Indian cities/towns).
  2. Primary solver: Google OR-Tools VRP with time-window constraints.
  3. Fallback (auto): nearest-neighbour + 2-opt when OR-Tools is unavailable
     or fails — behaviour is transparent to callers.

Time-window constraints:
  - Each attraction has openHour / closeHour.
  - Visit cannot start before openHour or finish after closeHour.
  - A max-hours-per-day budget (default 8 h) is enforced.
  - When total time exceeds one day the solver splits across multiple days.
"""

import json, math, logging
from typing import Optional
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)

# Average travel speed assumption: 30 km/h (urban/semi-urban India)
AVG_SPEED_KMH = 30.0
EARTH_RADIUS_KM = 6371.0


# ── Haversine ─────────────────────────────────────────────────────────────────
def _haversine_km(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    """Great-circle distance in kilometres."""
    rl1, rl2 = math.radians(lat1), math.radians(lat2)
    dlat = math.radians(lat2 - lat1)
    dlng = math.radians(lng2 - lng1)
    a = math.sin(dlat / 2) ** 2 + math.cos(rl1) * math.cos(rl2) * math.sin(dlng / 2) ** 2
    return 2 * EARTH_RADIUS_KM * math.asin(math.sqrt(a))


def _travel_mins(lat1: float, lng1: float, lat2: float, lng2: float) -> int:
    km = _haversine_km(lat1, lng1, lat2, lng2)
    return max(5, int(km / AVG_SPEED_KMH * 60))


def _time_to_mins(t: str) -> int:
    """'09:30' → 9*60+30 = 570"""
    h, m = t.split(":")
    return int(h) * 60 + int(m)


def _mins_to_time(base_iso: str, extra_mins: int) -> str:
    """Given a base datetime ISO string, add extra_mins and return HH:MM."""
    dt = datetime.fromisoformat(base_iso) + timedelta(minutes=extra_mins)
    return dt.strftime("%H:%M")


# ── Distance/travel-time matrix builder ───────────────────────────────────────
def _build_matrix(attractions: list[dict]) -> list[list[int]]:
    n = len(attractions)
    mat = [[0] * n for _ in range(n)]
    for i in range(n):
        for j in range(n):
            if i != j:
                mat[i][j] = _travel_mins(
                    attractions[i]["lat"], attractions[i]["lng"],
                    attractions[j]["lat"], attractions[j]["lng"],
                )
    return mat


# ── OR-Tools VRP solver ────────────────────────────────────────────────────────
def _solve_ortools(
    attractions: list[dict],
    travel_mat: list[list[int]],
    max_hours_per_day: float,
    start_time_str: str,
    category_preferences: Optional[list[str]],
) -> list[list[int]]:
    """
    Returns a list of day-routes, where each element is an ordered list of
    attraction indices for that day.  Raises RuntimeError on failure.
    """
    from ortools.constraint_solver import routing_enums_pb2, pywrapcp  # noqa: PLC0415

    # Filter by category preference if given
    candidates = list(range(len(attractions)))
    if category_preferences:
        preferred = [
            i for i, a in enumerate(attractions)
            if a.get("category") in category_preferences
        ]
        candidates = preferred if preferred else candidates

    n = len(candidates)
    if n == 0:
        return []

    # Map candidate index → original index
    cand_attrs = [attractions[c] for c in candidates]
    cand_mat = [
        [travel_mat[candidates[i]][candidates[j]] for j in range(n)]
        for i in range(n)
    ]

    # OR-Tools manager: 1 vehicle, depot = virtual node (index n)
    manager = pywrapcp.RoutingIndexManager(n, 1, 0)
    routing = pywrapcp.RoutingModel(manager)

    # Transit callback
    def transit_cb(from_idx, to_idx):
        fi = manager.IndexToNode(from_idx)
        ti = manager.IndexToNode(to_idx)
        return cand_mat[fi][ti]

    transit_id = routing.RegisterTransitCallback(transit_cb)
    routing.SetArcCostEvaluatorOfAllVehicles(transit_id)

    # Time dimension
    max_mins = int(max_hours_per_day * 60)
    routing.AddDimension(transit_id, 30, max_mins * len(attractions), False, "Time")
    time_dim = routing.GetDimensionOrDie("Time")

    # Add time-window constraints per node
    start_mins = _time_to_mins(start_time_str)
    for i, attr in enumerate(cand_attrs):
        idx = manager.NodeToIndex(i)
        open_m  = _time_to_mins(attr.get("openHour",  "08:00")) - start_mins
        close_m = _time_to_mins(attr.get("closeHour", "20:00")) - start_mins + 1
        open_m  = max(0, open_m)
        close_m = max(open_m + 30, close_m)
        time_dim.CumulVar(idx).SetRange(open_m, close_m)

    search_params = pywrapcp.DefaultRoutingSearchParameters()
    search_params.first_solution_strategy = (
        routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC
    )
    search_params.time_limit.seconds = 10

    solution = routing.SolveWithParameters(search_params)
    if not solution:
        raise RuntimeError("OR-Tools found no solution")

    # Extract route (single vehicle)
    route_indices: list[int] = []
    idx = routing.Start(0)
    while not routing.IsEnd(idx):
        node = manager.IndexToNode(idx)
        route_indices.append(candidates[node])
        idx = solution.Value(routing.NextVar(idx))

    # Split into days by time budget
    return _split_into_days(route_indices, attractions, travel_mat,
                             max_hours_per_day, start_time_str)


# ── Nearest-neighbour + 2-opt fallback ────────────────────────────────────────
def _solve_2opt(
    attractions: list[dict],
    travel_mat: list[list[int]],
    max_hours_per_day: float,
    start_time_str: str,
    category_preferences: Optional[list[str]],
) -> list[list[int]]:
    candidates = list(range(len(attractions)))
    if category_preferences:
        preferred = [i for i, a in enumerate(attractions)
                     if a.get("category") in category_preferences]
        candidates = preferred if preferred else candidates

    if not candidates:
        return []

    # Nearest-neighbour starting from index 0
    unvisited = set(candidates)
    route = [candidates[0]]
    unvisited.discard(candidates[0])
    while unvisited:
        last = route[-1]
        nxt = min(unvisited, key=lambda j: travel_mat[last][j])
        route.append(nxt)
        unvisited.discard(nxt)

    # 2-opt improvement
    improved = True
    while improved:
        improved = False
        for i in range(1, len(route) - 1):
            for j in range(i + 1, len(route)):
                old = travel_mat[route[i - 1]][route[i]] + travel_mat[route[j - 1]][route[j]] if j < len(route) - 1 else travel_mat[route[i - 1]][route[i]]
                new = travel_mat[route[i - 1]][route[j - 1]] + travel_mat[route[i]][route[j]] if j < len(route) - 1 else travel_mat[route[i - 1]][route[j - 1]]
                if new < old:
                    route[i:j] = route[i:j][::-1]
                    improved = True

    return _split_into_days(route, attractions, travel_mat, max_hours_per_day, start_time_str)


# ── Day-splitter ──────────────────────────────────────────────────────────────
def _split_into_days(
    order: list[int],
    attractions: list[dict],
    travel_mat: list[list[int]],
    max_hours_per_day: float,
    start_time_str: str,
) -> list[list[int]]:
    """Split a flat ordered route into day-buckets based on time budget."""
    max_mins = int(max_hours_per_day * 60)
    start_m = _time_to_mins(start_time_str)
    days: list[list[int]] = []
    current_day: list[int] = []
    elapsed = 0

    for i, idx in enumerate(order):
        attr = attractions[idx]
        duration = attr.get("avgVisitDurationMins", 60)
        travel = travel_mat[current_day[-1]][idx] if current_day else 0
        slot = travel + duration

        # Check open/close feasibility
        arrival = start_m + elapsed + travel
        open_m  = _time_to_mins(attr.get("openHour",  "08:00"))
        close_m = _time_to_mins(attr.get("closeHour", "20:00"))
        if arrival < open_m:
            slot += (open_m - arrival)  # wait time
            arrival = open_m

        if elapsed + slot > max_mins or (arrival + duration) > close_m:
            if current_day:
                days.append(current_day)
            current_day = [idx]
            elapsed = travel + duration
        else:
            current_day.append(idx)
            elapsed += slot

    if current_day:
        days.append(current_day)
    return days


# ── Timestamped stop builder ──────────────────────────────────────────────────
def _build_timestamped_itinerary(
    day_routes: list[list[int]],
    attractions: list[dict],
    travel_mat: list[list[int]],
    start_time_str: str,
) -> list[dict]:
    """Convert day-route index lists into human-readable timestamped dicts."""
    all_days = []
    for day_no, route in enumerate(day_routes, start=1):
        current_min = _time_to_mins(start_time_str)
        stops = []
        total_travel = 0
        total_cost = 0

        for i, idx in enumerate(route):
            attr = attractions[idx]
            travel = travel_mat[route[i - 1]][idx] if i > 0 else 0
            total_travel += travel
            # Wait until open if needed
            open_m = _time_to_mins(attr.get("openHour", "08:00"))
            if current_min + travel < open_m:
                current_min = open_m - travel
            arrival_m = current_min + travel
            departure_m = arrival_m + attr.get("avgVisitDurationMins", 60)
            cost = attr.get("estimatedCost", 0)
            total_cost += cost

            def fmt(m: int) -> str:
                return f"{m // 60:02d}:{m % 60:02d}"

            stops.append({
                "order": i + 1,
                "attractionId": attr["id"],
                "name": attr["name"],
                "category": attr.get("category", ""),
                "indoorOutdoor": attr.get("indoorOutdoor", "outdoor"),
                "arrivalTime": fmt(arrival_m),
                "departureTime": fmt(departure_m),
                "visitDurationMins": attr.get("avgVisitDurationMins", 60),
                "travelFromPrevMins": travel,
                "estimatedCost": cost,
                "lat": attr["lat"],
                "lng": attr["lng"],
            })
            current_min = departure_m

        all_days.append({
            "day": day_no,
            "stops": stops,
            "totalTravelMins": total_travel,
            "totalVisitMins": sum(s["visitDurationMins"] for s in stops),
            "totalCost": total_cost,
            "finishTime": fmt(current_min) if stops else "N/A",
        })
    return all_days


def fmt(m: int) -> str:
    return f"{m // 60:02d}:{m % 60:02d}"


# ── Public entry point ────────────────────────────────────────────────────────
class ItineraryService:
    def __init__(self, data_path: str):
        with open(data_path, encoding="utf-8") as f:
            raw: list[dict] = json.load(f)
        # Index by destinationId
        self._by_dest: dict[str, list[dict]] = {}
        for a in raw:
            did = a["destinationId"]
            self._by_dest.setdefault(did, []).append(a)
        logger.info("Itinerary service loaded %d attractions across %d destinations",
                    len(raw), len(self._by_dest))

    def optimise(
        self,
        destination_id: str,
        num_days: int = 1,
        start_time: str = "09:00",
        max_hours_per_day: float = 8.0,
        category_preferences: Optional[list[str]] = None,
    ) -> dict:
        attractions = self._by_dest.get(destination_id, [])
        if not attractions:
            return {
                "destinationId": destination_id,
                "solver": "none",
                "warning": "No attractions found for this destination",
                "days": [],
            }

        mat = _build_matrix(attractions)

        # Try OR-Tools first, fall back gracefully
        solver_used = "ortools"
        try:
            day_routes = _solve_ortools(attractions, mat, max_hours_per_day,
                                        start_time, category_preferences)
            logger.debug("OR-Tools solver succeeded")
        except Exception as e:
            logger.warning("OR-Tools unavailable/failed (%s) — using 2-opt fallback", e)
            solver_used = "2opt_heuristic"
            day_routes = _solve_2opt(attractions, mat, max_hours_per_day,
                                     start_time, category_preferences)

        # Trim to requested number of days
        day_routes = day_routes[:num_days]

        timestamped = _build_timestamped_itinerary(day_routes, attractions, mat, start_time)

        return {
            "destinationId": destination_id,
            "solver": solver_used,
            "numDays": len(timestamped),
            "maxHoursPerDay": max_hours_per_day,
            "startTime": start_time,
            "days": timestamped,
            "grandTotalCost": sum(d["totalCost"] for d in timestamped),
            "grandTotalTravelMins": sum(d["totalTravelMins"] for d in timestamped),
        }

    def destination_exists(self, destination_id: str) -> bool:
        return destination_id in self._by_dest
