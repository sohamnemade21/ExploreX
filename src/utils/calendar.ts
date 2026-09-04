/**
 * Generates and triggers download of an .ics Calendar File for travel bookings
 */
export function downloadCalendarEvent(payload: {
  title: string;
  description: string;
  location: string;
  startDate: string; // YYYY-MM-DD
  endDate?: string;   // YYYY-MM-DD
  pnr?: string;
}) {
  const start = payload.startDate.replace(/-/g, '');
  const end = payload.endDate ? payload.endDate.replace(/-/g, '') : start;
  
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//ExploreX Travel Platform//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `SUMMARY:${payload.title}`,
    `DESCRIPTION:${payload.description} (Ref: ${payload.pnr || 'N/A'})`,
    `LOCATION:${payload.location}`,
    `DTSTART;VALUE=DATE:${start}`,
    `DTEND;VALUE=DATE:${end}`,
    `STATUS:CONFIRMED`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${payload.title.replace(/[^a-zA-Z0-9]/g, '_')}_itinerary.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
