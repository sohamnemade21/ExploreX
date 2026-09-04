import { GoogleGenAI } from '@google/genai';
import { db } from '../db';
import { ENV } from '../config/env';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'model' | 'system';
  content: string;
}

export interface TripContext {
  destination?: string;
  destinationId?: string;
  durationDays?: number;
  budget?: number | string;
  travelersCount?: number;
  travelStyle?: string;
  interests?: string[];
  currentItinerary?: any;
  activeWeatherAlert?: string;
}

export interface ChatAssistantResponse {
  reply: string;
  suggestions: string[];
  grounding: {
    sources: string[];
    mlServiceAvailable: boolean;
    provider: 'openai' | 'gemini' | 'algorithmic-catalog';
  };
}

/**
 * Universal Indian & Global Travel Knowledge Base for grounded fallbacks
 */
const UNIVERSAL_TRAVEL_KNOWLEDGE: Record<string, {
  name: string;
  stateOrRegion: string;
  description: string;
  highlights: string[];
  famousFood: string[];
  handicrafts: string[];
  bestMonths: string;
  startingPrice: number;
  capacityLoad: number;
  lessCrowdedAlt: string;
}> = {
  goa: {
    name: 'Goa',
    stateOrRegion: 'Goa, India',
    description: 'Famed for sun-drenched Arabian Sea coastlines, UNESCO Indo-Portuguese heritage cathedrals, spice plantations, and vibrant beach shacks.',
    highlights: ['Fort Aguada & Lighthouse', 'Old Goa Basilica of Bom Jesus', 'Palolem & Butterfly Beach', 'Sahakari Spice Plantation', 'Dudhsagar Waterfalls'],
    famousFood: ['Goan Fish Curry Thali', 'Pork Vindaloo / Mushroom Xacuti', 'Bebinca Layered Cake', 'Poi Bread with Chorizo'],
    handicrafts: ['Azulejos hand-painted ceramic tiles', 'Coconut shell craft', 'Terracotta pottery'],
    bestMonths: 'November to March',
    startingPrice: 6500,
    capacityLoad: 80,
    lessCrowdedAlt: 'Sindhudurg & Tarkarli (60% lower crowds, pristine coral waters)'
  },
  manali: {
    name: 'Manali & Kullu Valley',
    stateOrRegion: 'Himachal Pradesh, India',
    description: 'High-altitude Himalayan valley nestled along the Beas River, gateway to snow passes, ancient cedar forests, and adventure trails.',
    highlights: ['Solang Valley & Rohtang Pass', 'Hadimba Devi Cedar Temple', 'Old Manali Apple Orchards', 'Jogini Waterfall Hike', 'Vashisht Thermal Hot Springs'],
    famousFood: ['Himachali Siddu with Ghee', 'Dhaam festive platter', 'Kullu Trout Fish', 'Babru flatbread'],
    handicrafts: ['Kullu Woolen Shawls', 'Chamba Rumal embroidery', 'Pattu blankets'],
    bestMonths: 'October to June',
    startingPrice: 7500,
    capacityLoad: 85,
    lessCrowdedAlt: 'Tirthan Valley & Jibhi (82% lower crowds, tranquil trout streams)'
  },
  jaipur: {
    name: 'Jaipur (The Pink City)',
    stateOrRegion: 'Rajasthan, India',
    description: 'UNESCO World Heritage royal capital showcasing pink sandstone forts, astronomical marvels, and opulent Rajput palace architecture.',
    highlights: ['Amber Fort & Elephant Corridor', 'Hawa Mahal (Palace of Winds)', 'City Palace & Chandra Mahal', 'Jantar Mantar Observatory', 'Nahargarh Fort Sunset Viewpoint'],
    famousFood: ['Dal Baati Churma with Ghee', 'Pyaaz Kachori', 'Laal Maas', 'Ghevar Sweet from LMB'],
    handicrafts: ['Blue Pottery', 'Sanganeri Hand Block Prints', 'Kundan & Meenakari Jewellery', 'Mojari Leather Juttis'],
    bestMonths: 'October to March',
    startingPrice: 5800,
    capacityLoad: 75,
    lessCrowdedAlt: 'Bundi & Shekhawati (Intact frescoed havelis with minimal tourist crowds)'
  },
  mumbai: {
    name: 'Mumbai',
    stateOrRegion: 'Maharashtra, India',
    description: 'India’s bustling financial capital and historic port city, featuring Victorian Gothic UNESCO architecture, Marine Drive, and street food corridors.',
    highlights: ['Gateway of India & Colaba Causeway', 'Marine Drive Sunset Promenade', 'Elephanta Caves UNESCO Island', 'Chhatrapati Shivaji Maharaj Terminus (CSMT)', 'Bandra Heritage Villages'],
    famousFood: ['Vada Pav & Pav Bhaji', 'Bombay Duck Fry', 'Parsi Bun Maska & Irani Chai', 'Khao Galli Kebab Trails'],
    handicrafts: ['Dharavi leather goods', 'Zari hand embroidery', 'Koli fishing artefacts'],
    bestMonths: 'November to February',
    startingPrice: 6000,
    capacityLoad: 85,
    lessCrowdedAlt: 'Alibaug & Murud-Janjira (Coastal island sea forts and quiet beaches)'
  },
  pune: {
    name: 'Pune',
    stateOrRegion: 'Maharashtra, India',
    description: 'Cultural capital of Maharashtra blending Maratha imperial history, Sahyadri hill forts, Peshwa heritage, and culinary trails.',
    highlights: ['Shaniwar Wada Palace Fort', 'Sinhagad Fort Mountain Vista', 'Aga Khan Palace Gandhian Memorial', 'Raja Dinkar Kelkar Museum', 'Dagadusheth Halwai Temple'],
    famousFood: ['Puneri Spicy Misal Pav (Bedekar/Katairrurr)', 'Bakharwadi from Chitale Bandhu', 'Puran Poli with Ghee', 'Mastani Ice Cream Drink'],
    handicrafts: ['Tambat brass and copper beaten vessels', 'Paithani silk sarees', 'Kolhapuri chappals'],
    bestMonths: 'October to March',
    startingPrice: 5500,
    capacityLoad: 60,
    lessCrowdedAlt: 'Kaas Plateau & Satara (UNESCO Valley of Flowers and Chalkewadi windmills)'
  },
  kerala: {
    name: 'Kerala (Kochi, Munnar, Alleppey)',
    stateOrRegion: 'Kerala, India',
    description: 'God’s Own Country renowned for tranquil backwaters, houseboats, misty tea plantations of Munnar, and spice trading history in Fort Kochi.',
    highlights: ['Alleppey Backwater Houseboat Cruise', 'Munnar Eravikulam Tea Gardens', 'Fort Kochi Chinese Fishing Nets & Mattancherry Palace', 'Periyar Wildlife Sanctuary', 'Varkala Cliff Beach'],
    famousFood: ['Kerala Sadhya on Banana Leaf', 'Appam with Stew & Egg Roast', 'Karimeen Pollichathu (Pearl Spot Fish)', 'Malabar Biryani & Banana Chips'],
    handicrafts: ['Aranmula metal mirrors', 'Kathakali wooden masks', 'Coir and bamboo craft'],
    bestMonths: 'September to March',
    startingPrice: 7200,
    capacityLoad: 65,
    lessCrowdedAlt: 'Wayanad Rainforest & Bekal Fort (Lush treehouses and quiet coastal forts)'
  },
  varanasi: {
    name: 'Varanasi (Kashi)',
    stateOrRegion: 'Uttar Pradesh, India',
    description: 'One of the world’s oldest living cities on the banks of the sacred Ganges, celebrated for evening Ganga Aarti, ghats, and spiritual heritage.',
    highlights: ['Dashashwamedh Ghat Evening Aarti', 'Kashi Vishwanath Temple Corridor', 'Assi Ghat Sunrise Boat Ride', 'Sarnath Buddhist Enlightenment Stupa', 'Manikarnika Heritage Ghat Walk'],
    famousFood: ['Banarasi Paan', 'Kachori Sabzi & Jalebi Breakfast', 'Malaiyo Saffron Froth Sweet', 'Tamatar Chaat'],
    handicrafts: ['Banarasi Handloom Silk Sarees (GI Tag)', 'Wooden lacquered toys', 'Gulabi Meenakari pink enamel work'],
    bestMonths: 'October to March',
    startingPrice: 4800,
    capacityLoad: 90,
    lessCrowdedAlt: 'Chunar Fort & Vindhyachal (Riverfront rock fortress and quiet sacred hills)'
  },
  kashmir: {
    name: 'Kashmir (Srinagar, Gulmarg, Pahalgam)',
    stateOrRegion: 'Jammu & Kashmir, India',
    description: 'Paradise on Earth renowned for Dal Lake houseboats, Mughal gardens, Gulmarg Gondola snow peaks, and Betaab Valley meadows.',
    highlights: ['Dal Lake Shikara Ride & Floating Market', 'Gulmarg High-Altitude Gondola', 'Pahalgam Aru & Betaab Valley', 'Nishat & Shalimar Mughal Terraces', 'Old Srinagar Jamia Masjid Heritage Walk'],
    famousFood: ['Kashmiri Wazwan (Rogan Josh, Gushtaba, Rista)', 'Kahwa Saffron Green Tea with Almonds', 'Modur Pulao', 'Noon Chai with Tsot bread'],
    handicrafts: ['Pashmina and Kani Shawls (GI Tag)', 'Papier-mâché decorative boxes', 'Walnut wood hand-carvings', 'Hand-knotted silk carpets'],
    bestMonths: 'April to October (Spring/Summer) or Dec to Feb (Snow)',
    startingPrice: 9500,
    capacityLoad: 75,
    lessCrowdedAlt: 'Gurez Valley & Doodhpathri (Untouched meadows with zero mass tourism)'
  },
  hampi: {
    name: 'Hampi & Coorg',
    stateOrRegion: 'Karnataka, India',
    description: 'UNESCO World Heritage boulder ruins of the Vijayanagara Empire paired with the lush coffee plantation hills of Kodagu (Coorg).',
    highlights: ['Virupaksha Temple & Hampi Bazaar', 'Vittala Temple Stone Chariot & Musical Pillars', 'Matanga Hill Sunrise Panorama', 'Coorg Organic Coffee & Spice Estates', 'Abbey Falls & Talacauvery Sanctuary'],
    famousFood: ['Bisi Bele Bath & Benne Dosa', 'Coorg Pandi Curry with Kadambuttu rice balls', 'Bamboo Shoot Curry', 'Filter Coffee'],
    handicrafts: ['Channapatna wooden toys', 'Bidriware silver inlaid metal craft', 'Mysore Silk'],
    bestMonths: 'October to March',
    startingPrice: 5900,
    capacityLoad: 50,
    lessCrowdedAlt: 'Badami, Aihole & Pattadakal (Rock-cut Chalukyan cave temples with low footfall)'
  },
  ladakh: {
    name: 'Ladakh (Leh, Nubra, Pangong)',
    stateOrRegion: 'Ladakh, India',
    description: 'High-altitude cold desert surrounded by the Karakoram and Zanskar ranges, Buddhist monasteries, crystal blue lakes, and dramatic mountain passes.',
    highlights: ['Pangong Tso Crystal Blue Lake', 'Nubra Valley Hunder Sand Dunes & Bactrian Camels', 'Khardung La High Mountain Pass', 'Thiksey & Hemis Monasteries', 'Magnetic Hill & Sangam Confluence'],
    famousFood: ['Tibetan Thukpa noodle soup', 'Steamed Momos with fiery chutney', 'Butter Tea (Gur Gur)', 'Skyu traditional stew'],
    handicrafts: ['Ladakhi Pashmina wool', 'Tibetan prayer wheels and Thangka scrolls', 'Hand-carved wooden Choktse tables'],
    bestMonths: 'May to September',
    startingPrice: 12000,
    capacityLoad: 70,
    lessCrowdedAlt: 'Zanskar Valley & Turtuk Village (Balti cultural villages and remote glaciers)'
  },
  rishikesh: {
    name: 'Rishikesh & Haridwar',
    stateOrRegion: 'Uttarakhand, India',
    description: 'Yoga Capital of the World along the sacred Ganges river, famed for river rafting, suspension bridges, ashrams, and Ganga Aarti.',
    highlights: ['Laxman Jhula & Ram Jhula Ghats', 'River Rafting & Cliff Jumping at Shivpuri', 'Beatles Ashram (Chaurasi Kutia)', 'Triveni Ghat Evening Aarti', 'Neelkanth Mahadev Temple Hike'],
    famousFood: ['Ayurvedic Sattvic Thali', 'Aloo Puri with Halwa at Chotiwala', 'Himalayan Herbal Teas', 'Fresh Jalebi & Rabri'],
    handicrafts: ['Handcrafted wooden prayer beads (Rudraksha)', 'Ayurvedic oils and essential extracts', 'Brass pooja vessels'],
    bestMonths: 'September to May',
    startingPrice: 4500,
    capacityLoad: 75,
    lessCrowdedAlt: 'Chopta & Tungnath (Highest Shiva temple in the world with alpine meadows)'
  },
  udaipur: {
    name: 'Udaipur (City of Lakes)',
    stateOrRegion: 'Rajasthan, India',
    description: 'Romantic royal lake city featuring floating white palaces, Mewar fortresses, marble havelis, and sunset boat rides on Lake Pichola.',
    highlights: ['City Palace Complex & Crystal Gallery', 'Lake Pichola Sunset Boat Cruise', 'Jag Mandir Island Palace', 'Saheliyon-ki-Bari Marble Fountains', 'Sajjangarh Monsoon Palace Ridge'],
    famousFood: ['Mewari Dal Baati', 'Gatte ki Sabzi', 'Ker Sangri desert beans', 'Kulhad Milk with Dry Fruits'],
    handicrafts: ['Pichwai paintings', 'Miniature Rajput paintings on silk', 'Embroidered leather juttis'],
    bestMonths: 'October to March',
    startingPrice: 6200,
    capacityLoad: 75,
    lessCrowdedAlt: 'Kumbhalgarh & Ranakpur (Great Wall of India fortress and 1444-pillar Jain temple)'
  },
  sindhudurg: {
    name: 'Sindhudurg & Tarkarli',
    stateOrRegion: 'Maharashtra, India',
    description: 'Pristine Konkan coastal paradise with sea fortresses, clear scuba diving waters, virgin white sand beaches, and authentic Malvani seafood.',
    highlights: ['Sindhudurg Sea Fort (built by Chhatrapati Shivaji Maharaj)', 'Tarkarli Beach Scuba & Coral Snorkeling', 'Karli River Backwater Cruise & Dolphin Spotting', 'Devbagh Beach Sand Spit', 'Dhamapur Lake & Lotus Sanctuary'],
    famousFood: ['Malvani Surmai / Pomfret Rava Fry', 'Kombdi Vade (Chicken curry with fried rice-lentil puris)', 'Solkadhi refreshing kokum-coconut drink', 'Cashew Nut Curry (Olya Kaju Chi Usal)'],
    handicrafts: ['Sawantwadi Lacquer Wooden Toys (GI Tag)', 'Handmade Cashew delicacies', 'Konkan Mango/Kokum preserves'],
    bestMonths: 'October to April',
    startingPrice: 4200,
    capacityLoad: 30,
    lessCrowdedAlt: 'Redi Beach & Yashwantgad (Ancient secluded sea fortress on Goa-Konkan border)'
  },
  chettinad: {
    name: 'Chettinad (Karaikudi)',
    stateOrRegion: 'Tamil Nadu, India',
    description: 'Historic merchant realm famed for palatial 100-room heritage mansions, Athangudi handmade tiles, antique markets, and world-renowned peppery cuisine.',
    highlights: ['Chettinad Heritage Mansions (Kanadukathan)', 'Athangudi Handmade Tile Artisans Workshop', 'Karaikudi Antique Market Street', 'Kundrakudi Murugan Rock Temple', 'Thirumayam Chola Rock Fort'],
    famousFood: ['Chettinad Pepper Chicken', 'Vella Paniyaram sweet snack', 'Kandarappam dessert', 'Traditional 20-course Banana Leaf Feast'],
    handicrafts: ['Athangudi Handmade Cement Tiles (GI Tag)', 'Kottan palm leaf woven baskets', 'Kandangi Cotton Sarees'],
    bestMonths: 'October to March',
    startingPrice: 4500,
    capacityLoad: 25,
    lessCrowdedAlt: 'Tranquebar (Tharangambadi) — Danish coastal heritage town'
  },
  tirthan: {
    name: 'Tirthan Valley & Jibhi',
    stateOrRegion: 'Himachal Pradesh, India',
    description: 'Serene mountain valley along the Tirthan river at the edge of the UNESCO Great Himalayan National Park, ideal for trout fishing and pine forest walks.',
    highlights: ['Great Himalayan National Park Trekking', 'Jalori Pass & Serolsar Lake Hike', 'Chehni Kothi 1500-year-old Timber Tower Temple', 'Choie Waterfall Nature Walk', 'Trout Angling on Tirthan River'],
    famousFood: ['Fresh Brown Trout Fry with Herbs', 'Himachali Siddu with Walnut Chutney', 'Himalayan Apricot Jam', 'Wild Herb Teas'],
    handicrafts: ['Kathkuni timber architecture woodwork', 'Pattu handwoven woolens', 'Himalayan pine cone craft'],
    bestMonths: 'March to June & Sept to November',
    startingPrice: 5200,
    capacityLoad: 20,
    lessCrowdedAlt: 'Sainj Valley & Shangarh Meadows (Mythological rolling green golf meadows)'
  },
  raghurajpur: {
    name: 'Raghurajpur Heritage Craft Village',
    stateOrRegion: 'Odisha, India',
    description: 'Centuries-old heritage village near Puri where every home is an active artisan studio preserving Pattachitra scroll painting, palm leaf engraving, and Gotipua dance.',
    highlights: ['Master Pattachitra Artisan Workshops', 'Palm Leaf Manuscript Engraving Demonstrations', 'Gotipua Traditional Gurukul Dance Academy', 'Puri Jagannath Temple Pilgrimage (12km away)', 'Konark Sun Temple UNESCO World Heritage Site'],
    famousFood: ['Chhena Poda (Smoked cottage cheese cake)', 'Khaja sweet pastry from Puri Anand Bazaar', 'Dalma lentil-vegetable stew with rice', 'Macha Besara (Mustard fish curry)'],
    handicrafts: ['Pattachitra Cloth & Silk Paintings (GI Tag)', 'Tala Pattachitra (Palm Leaf Engraving)', 'Cow dung and paper mache toys', 'Stone carvings from Lalitgiri'],
    bestMonths: 'October to March',
    startingPrice: 3800,
    capacityLoad: 25,
    lessCrowdedAlt: 'Pipili Applique Crafts Village & Chilika Lake Mangalajodi bird sanctuary'
  }
};

/**
 * System prompt generator with rich ExploreX grounding data
 */
function buildSystemPrompt(tripContext?: TripContext, userContext?: { name?: string; budget?: string; vibes?: string[] }): string {
  const destinations = db.getDestinations();
  
  const catalogSummary = destinations.map(d => {
    const vibes = Array.isArray(d.vibe) ? d.vibe.join(', ') : 'Travel';
    const temp = d.currentWeather?.tempC ?? 27;
    const cond = d.currentWeather?.condition ?? 'Pleasant';
    const safety = d.safetyScore?.overall ?? 85;
    const price = d.startingPrice ? d.startingPrice.toLocaleString('en-IN') : '5,000';
    return `- ${d.name} (${d.state ? `${d.state}, India` : d.country || 'India'}): Starting ₹${price}, Vibes: ${vibes}, Weather: ${temp}°C ${cond}, Safety: ${safety}/100, Tier: ${d.tierCategory || 'General'}, Impact Score: ${d.localEconomy?.localImpactScore || 85}%, Overcrowded: ${d.isOvertouristed ? 'Yes' : 'No'}`;
  }).join('\n');

  let activeDestInfo = '';
  if (tripContext?.destinationId) {
    const d = db.getDestinationById(tripContext.destinationId);
    if (d) {
      const bestM = Array.isArray(d.bestMonths) ? d.bestMonths.join(', ') : 'All Year';
      const hlights = Array.isArray(d.highlights) ? d.highlights.join(', ') : (d.vibe || []).join(', ');
      activeDestInfo = `Active Selected Destination:\n- Name: ${d.name}\n- State/Region: ${d.state || d.stateOrRegion || ''}\n- Best Months: ${bestM}\n- Starting Price: ₹${d.startingPrice || 5000}\n- Rating: ${d.rating || 4.8}★\n- Highlights: ${hlights}\n- Local Economy: ${d.localEconomy?.craftTradition || 'Rich artisan heritage'}\n`;
    }
  }

  let itinerarySummary = '';
  if (tripContext?.currentItinerary && tripContext.currentItinerary.days) {
    itinerarySummary = `Active User Itinerary for ${tripContext.currentItinerary.destination || 'Trip'}:\n`;
    tripContext.currentItinerary.days.forEach((day: any) => {
      const activities = [...(day.morning || []), ...(day.afternoon || []), ...(day.evening || [])]
        .map((a: any) => `${a.startTime || ''} ${a.name} (${a.category || 'Activity'})`)
        .join(', ');
      itinerarySummary += `- Day ${day.dayNumber}: ${activities || 'Free exploration'}\n`;
    });
  }

  return `You are "ExploreX Travel Assistant", an elite conversational AI travel consultant and India & global tourism specialist.

Your Core Capabilities:
1. Universal Travel Expertise: You possess encyclopedic knowledge of ALL travel destinations across India (North, South, East, West, Northeast, Himalayas, Konkan, Rajasthan, Kerala, Kashmir, Goa, Hampi, Ladakh, etc.) and international destinations.
2. Grounded Database & Authentic Culture: You prioritize real destinations in the ExploreX catalog and universal geography. Provide exact INR (₹) prices, authentic local dishes (GI tagged), regional crafts, time-of-day crowd tips, and weather-aware advice.
3. Multi-turn Conversational Intelligence: Maintain conversation context across questions, remember user preferences mentioned previously, and deliver warm, concise, and structured answers formatted in clean Markdown.
4. Proactive Guidance:
   - If the user's request lacks important details (e.g. number of days, budget, group type, or travel month), ask 1-2 focused clarifying questions while still providing an initial recommendation.
   - If the user asks for less crowded or offbeat places, leverage ExploreX's Demand Balancer to recommend hidden gems over congested tourist hubs.
   - If the user asks about weather-related disruptions or rain, provide practical indoor/covered alternatives and clear travel tips.
5. Strict Off-Topic Redirection: If the user asks about non-travel topics (e.g. coding, math homework, general trivia unrelated to destinations, politics), politely and warmly redirect them back to travel planning and tourism assistance.

Active ExploreX Destination Catalog:
${catalogSummary}

${activeDestInfo ? activeDestInfo : ''}
${itinerarySummary ? itinerarySummary : ''}
${tripContext?.activeWeatherAlert ? `Live Weather Alert for Trip: ${tripContext.activeWeatherAlert}` : ''}
${userContext?.name ? `User Profile: Name: ${userContext.name}, Budget: ${userContext.budget || 'moderate'}, Preferences: ${(userContext.vibes || []).join(', ')}` : ''}

Response Rules:
- Format response with clear Markdown headers, bullet points, and bold key terms.
- Keep responses concise, direct, and actionable (avoid fluff).
- Always quote prices in Indian Rupees (₹).
- End your response with a natural next step or question when appropriate.`;
}

/**
 * Call OpenAI Chat Completions API
 */
async function callOpenAI(
  apiKey: string,
  messages: Array<{ role: string; content: string }>,
  systemPrompt: string
): Promise<string> {
  const formattedMessages = [
    { role: 'system', content: systemPrompt },
    ...messages.map(m => ({
      role: m.role === 'assistant' || m.role === 'model' ? 'assistant' : 'user',
      content: m.content
    }))
  ];

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: formattedMessages,
      temperature: 0.6,
      max_tokens: 1200
    })
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`OpenAI API error (${res.status}): ${errText}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || 'I am ready to help you plan your travel across India and beyond!';
}

/**
 * Call Gemini API as secondary fallback
 */
async function callGemini(
  apiKey: string,
  messages: Array<{ role: string; content: string }>,
  systemPrompt: string
): Promise<string> {
  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
  });

  const historyText = messages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n\n');
  const fullPrompt = `${systemPrompt}\n\nCONVERSATION HISTORY:\n${historyText}\n\nProvide the next helpful ASSISTANT response:`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: fullPrompt,
    config: {
      temperature: 0.6,
      maxOutputTokens: 1200
    }
  });

  return response.text || 'I am here to assist with your travel plans!';
}

/**
 * Generate contextual dynamic suggestions based on message & destination
 */
function generateFollowUpSuggestions(message: string, reply: string, destinationId?: string): string[] {
  const lower = (message + ' ' + reply).toLowerCase();
  const suggestions: string[] = [];

  if (lower.includes('goa')) {
    suggestions.push('Find peaceful beaches in South Goa');
    suggestions.push('What should I do in Goa if it rains?');
    suggestions.push('Top local Goan culinary experiences');
    suggestions.push('Plan a 4-day heritage & beach itinerary');
  } else if (lower.includes('manali') || lower.includes('himachal') || lower.includes('kullu')) {
    suggestions.push('Less crowded alternatives to Manali (Tirthan Valley)');
    suggestions.push('Packing tips & current weather for Manali');
    suggestions.push('3-day scenic snow & valley itinerary');
    suggestions.push('Authentic Himachali food (Siddu & Dhaam)');
  } else if (lower.includes('jaipur') || lower.includes('rajasthan')) {
    suggestions.push('Best time to visit Amber Fort with low crowds');
    suggestions.push('Handicrafts & blue pottery shopping in Jaipur');
    suggestions.push('Budget breakdown for 3 days in Jaipur');
    suggestions.push('Dal Baati Churma & street food trail');
  } else if (lower.includes('kerala') || lower.includes('kochi') || lower.includes('munnar') || lower.includes('alleppey')) {
    suggestions.push('Best backwater houseboat cruise in Alleppey');
    suggestions.push('3-day tea gardens & hill station plan in Munnar');
    suggestions.push('Authentic Kerala Sadhya & seafood spots');
    suggestions.push('Offbeat rainforest treehouses in Wayanad');
  } else if (lower.includes('varanasi') || lower.includes('kashi')) {
    suggestions.push('Best ghats for morning boat sunrise');
    suggestions.push('Timing and VIP booking for Ganga Aarti');
    suggestions.push('Famous Banarasi Paan & Chaat walking tour');
    suggestions.push('Silk weaving workshops in Varanasi');
  } else if (lower.includes('kashmir') || lower.includes('srinagar') || lower.includes('gulmarg')) {
    suggestions.push('How to book Gulmarg Gondola Phase 2?');
    suggestions.push('Pashmina shopping guide to avoid fakes');
    suggestions.push('4-day scenic Kashmir valley itinerary');
    suggestions.push('Less crowded valleys (Gurez & Doodhpathri)');
  } else if (lower.includes('ladakh') || lower.includes('leh') || lower.includes('pangong')) {
    suggestions.push('Acclimatization tips for high altitude in Leh');
    suggestions.push('Nubra Valley vs Pangong Tso itinerary');
    suggestions.push('Permit requirements for Ladakh travel');
    suggestions.push('Best monasteries to visit in Ladakh');
  } else if (lower.includes('mumbai')) {
    suggestions.push('1-day heritage walk in South Mumbai');
    suggestions.push('Best street food trail in Mumbai (Khao Galli)');
    suggestions.push('Offbeat weekend getaways from Mumbai');
    suggestions.push('Elephanta Caves ferry and timing tips');
  } else if (lower.includes('pune')) {
    suggestions.push('What are less crowded spots near Pune?');
    suggestions.push('Suggest authentic Maharashtrian food in Pune');
    suggestions.push('Plan a 2-day heritage itinerary for Pune');
    suggestions.push('Best Sahyadri hill forts for monsoon trek');
  } else if (lower.includes('hampi') || lower.includes('coorg')) {
    suggestions.push('2-day boulder ruins & sunset points in Hampi');
    suggestions.push('Coffee estate homestays in Coorg');
    suggestions.push('Pandi Curry & traditional Kodava cuisine');
  } else if (lower.includes('sindhudurg') || lower.includes('tarkarli')) {
    suggestions.push('Scuba diving & water sports in Tarkarli');
    suggestions.push('Sindhudurg Sea Fort boat timing');
    suggestions.push('Authentic Malvani Thali & Solkadhi');
  } else if (lower.includes('chettinad')) {
    suggestions.push('Heritage mansion stays in Chettinad');
    suggestions.push('Athangudi handmade tile factory tour');
    suggestions.push('Traditional 20-course Chettinad feast');
  } else if (lower.includes('rishikesh')) {
    suggestions.push('Best rapids for Ganga river rafting');
    suggestions.push('Beatles Ashram visit & photography tips');
    suggestions.push('Peaceful yoga ashram stays in Rishikesh');
  } else if (lower.includes('udaipur')) {
    suggestions.push('Lake Pichola sunset boat ride guide');
    suggestions.push('City Palace museum vs Jag Mandir');
    suggestions.push('Best rooftop restaurants with lake view');
  } else {
    suggestions.push('Plan a 3-day itinerary for my trip');
    suggestions.push('Find less crowded hidden gems');
    suggestions.push('What should I do if it rains?');
    suggestions.push('Suggest authentic local food & GI crafts');
  }

  return suggestions.slice(0, 4);
}

/**
 * Universal Grounded Fallback Engine for all Indian and Global Places
 */
function generateGroundedFallbackReply(
  message: string,
  history: ChatMessage[],
  tripContext?: TripContext
): string {
  const lower = message.toLowerCase();
  const destinations = db.getDestinations();

  // Check off-topic
  const isOffTopic = (
    (lower.includes('python') || lower.includes('javascript') || lower.includes('react') || lower.includes('code') || lower.includes('calculate') || lower.includes('formula') || lower.includes('math problem')) &&
    !lower.includes('tour') && !lower.includes('travel') && !lower.includes('trip') && !lower.includes('vacation')
  );

  if (isOffTopic) {
    return `### 🧭 ExploreX Travel Assistant\n\nI specialize specifically in **travel planning, destination discovery, day-by-day itineraries, live weather alerts, cultural experiences, and sustainable demand balancing**.\n\nHow can I help you plan your next trip or vacation? Feel free to ask about:\n- 🗺️ Custom itineraries for **any city, state, or region**\n- 🌦️ Live weather and rain-proof travel plans\n- 🌿 Offbeat hidden gems with low crowds\n- 🍛 Authentic regional foods and GI-tagged handicrafts\n- 💰 Realistic budgets and transport guidance`;
  }

  // 1. Check Universal Travel Knowledge Base
  for (const [key, info] of Object.entries(UNIVERSAL_TRAVEL_KNOWLEDGE)) {
    if (lower.includes(key) || (key.includes(' ') && key.split(' ').some(k => lower.includes(k)))) {
      return `### 📍 Exploring ${info.name} (${info.stateOrRegion})\n\n` +
        `**Overview:** ${info.description}\n\n` +
        `**⭐ Must-Visit Highlights:**\n` +
        info.highlights.map(h => `- ${h}`).join('\n') + `\n\n` +
        `**🍛 Authentic Regional Food:** ${info.famousFood.join(', ')}\n` +
        `**🛍️ GI-Tagged Crafts & Souvenirs:** ${info.handicrafts.join(', ')}\n\n` +
        `**🌦️ Best Time to Visit:** **${info.bestMonths}**\n` +
        `**💰 Estimated Daily Budget:** Starting from **₹${info.startingPrice.toLocaleString('en-IN')}** per person.\n\n` +
        `**🌿 Demand Balancer Note:** Current tourist capacity load is ~**${info.capacityLoad}%**. ${info.capacityLoad > 70 ? `⚠️ High footfall — consider our lesser-known alternative: **${info.lessCrowdedAlt}**.` : '✨ Optimal crowd levels for peaceful exploration.'}\n\n` +
        `Would you like me to generate a complete day-by-day itinerary or check live Open-Meteo weather forecasts for ${info.name}?`;
    }
  }

  // 2. Check Database Catalog
  const matchedDest = destinations.find(d => 
    lower.includes(d.name.toLowerCase()) || 
    (d.state && lower.includes(d.state.toLowerCase())) ||
    (d.stateOrRegion && lower.includes(d.stateOrRegion.toLowerCase()))
  );

  if (matchedDest) {
    const hlights = Array.isArray(matchedDest.highlights) ? matchedDest.highlights : Array.isArray(matchedDest.vibe) ? matchedDest.vibe : ['Heritage', 'Culture'];
    const bestM = Array.isArray(matchedDest.bestMonths) ? matchedDest.bestMonths.join(', ') : 'October to March';
    const temp = matchedDest.currentWeather?.tempC ?? 27;
    const cond = matchedDest.currentWeather?.condition ?? 'Pleasant';
    const price = matchedDest.startingPrice ? matchedDest.startingPrice.toLocaleString('en-IN') : '5,000';

    return `### 📍 Exploring ${matchedDest.name} (${matchedDest.state || matchedDest.stateOrRegion || 'India'})\n\n` +
      `**Overview:** ${matchedDest.description || 'Rich destination with remarkable heritage and scenic beauty.'}\n\n` +
      `**⭐ Key Highlights:**\n` +
      hlights.map(h => `- ${h}`).join('\n') + `\n\n` +
      `**🌦️ Weather & Season:** Currently ${temp}°C, ${cond}. Best months to visit: **${bestM}**.\n\n` +
      `**💰 Estimated Budget:** Starting from **₹${price}** per person.\n\n` +
      `**🌿 Sustainable Demand Balancer Note:** Capacity utilization is currently at **${matchedDest.currentCapacityLoadPct || 45}%** (${matchedDest.isOvertouristed ? 'High crowd surge' : 'Optimal travel conditions'}).\n\n` +
      `Would you like me to generate a tailored day-by-day itinerary or check live weather forecasts for ${matchedDest.name}?`;
  }

  if (lower.includes('rain') || lower.includes('weather')) {
    return `### 🌧️ Rain-Proof Travel Strategies\n\nWhen exploring during wet weather or monsoon spells across India, we recommend:\n\n1. **Indoor Cultural Heritage:** Visit state museums, royal palaces, covered art galleries, and historic halls.\n2. **Artisanal & Culinary Workshops:** Engage in indoor cooking sessions, pottery masterclasses, and spice/tea tastings.\n3. **Covered Heritage Bazaars:** Explore sheltered arcades for GI-tagged handicrafts.\n4. **Flexible Transit:** Utilize ExploreX Chauffeured Cabs for direct door-to-door transit to avoid rain delays.\n\nTell me which destination you are heading to (e.g., Goa, Manali, Jaipur, Kerala, Kashmir, Varanasi), and I will pull the live Open-Meteo hourly forecast for you!`;
  }

  if (lower.includes('less crowded') || lower.includes('hidden gem') || lower.includes('offbeat')) {
    return `### 🌿 ExploreX Top Hidden Gems (Low Crowds & High Cultural Retention)\n\n` +
      `1. **Sindhudurg & Tarkarli (Maharashtra):** Pristine Konkan coastal forts, scuba diving, and authentic Malvani cuisine (65% lower crowds than popular coastal hubs).\n` +
      `2. **Chettinad (Tamil Nadu):** 19th-century heritage mansions, Athangudi handmade tile workshops, and legendary 20-course feasts.\n` +
      `3. **Tirthan Valley & Jibhi (Himachal Pradesh):** Serene trout streams, Great Himalayan National Park trails, and traditional wooden homestays (82% lower crowds than Manali).\n` +
      `4. **Raghurajpur (Odisha):** Heritage crafts village where every household preserves master Pattachitra art and Palm leaf engraving.\n` +
      `5. **Zanskar Valley (Ladakh):** Untouched high-altitude glacier valleys and ancient cliffside monasteries.\n\n` +
      `Which type of destination (beaches, mountains, heritage, or spiritual) would you like to explore?`;
  }

  // Generic universal answer inviting user to ask about any place
  return `### 🇮🇳 Welcome to ExploreX Universal Travel Assistant\n\nI can help you plan trips to **any destination in India or around the world**! Tell me which place you have in mind or what kind of trip you want to take.\n\n**Popular Destinations I Can Plan For You:**\n- 🏖️ **Goa, Kerala, Sindhudurg, Andaman** — Coastal beaches, backwaters, and scuba diving\n- 🏔️ **Manali, Kashmir, Ladakh, Rishikesh, Tirthan** — Snow valleys, mountain passes, and Himalayan trails\n- 🏰 **Jaipur, Udaipur, Hampi, Varanasi, Pune, Mumbai** — Royal forts, palaces, ghats, and heritage corridors\n- 🌿 **Chettinad, Raghurajpur, Meghalaya, Coorg** — Offbeat cultural crafts and nature retreats\n\n**Try asking:**\n- *"Plan a 4-day trip to Goa with peaceful beaches and good food"*\n- *"What should I visit in Manali if I want to avoid crowded spots?"*\n- *"What is the best 3-day itinerary for Jaipur?"*\n- *"Suggest budget travel options for Kerala in December"*`;
}

/**
 * Main Travel Assistant Entrypoint
 */
export async function askTravelAssistant(params: {
  message: string;
  history?: Array<{ role: 'user' | 'assistant' | 'model'; content?: string; text?: string; parts?: Array<{ text: string }> }>;
  tripContext?: TripContext;
  destinationId?: string;
  userContext?: { name?: string; budget?: string; vibes?: string[] };
}): Promise<ChatAssistantResponse> {
  const { message, tripContext, destinationId, userContext } = params;

  // Normalize conversation history
  const normalizedHistory: ChatMessage[] = (params.history || []).map(h => {
    let content = h.content || h.text || '';
    if (!content && h.parts && Array.isArray(h.parts)) {
      content = h.parts.map(p => p.text).join('\n');
    }
    const role: 'user' | 'assistant' = (h.role === 'user') ? 'user' : 'assistant';
    return { role, content };
  });

  // Append current message
  const conversationMessages: ChatMessage[] = [
    ...normalizedHistory,
    { role: 'user', content: message }
  ];

  const systemPrompt = buildSystemPrompt(
    { ...tripContext, destinationId: destinationId || tripContext?.destinationId },
    userContext
  );

  const openaiKey = ENV.OPENAI_API_KEY;
  const geminiKey = ENV.GEMINI_API_KEY;

  // 1. Try OpenAI if API key is present
  if (openaiKey && !openaiKey.includes('your_') && !openaiKey.includes('placeholder')) {
    try {
      const reply = await callOpenAI(openaiKey, conversationMessages, systemPrompt);
      const suggestions = generateFollowUpSuggestions(message, reply, destinationId);
      return {
        reply,
        suggestions,
        grounding: {
          sources: ['ExploreX Global Travel Knowledge', 'OpenAI GPT-4o Engine', 'Open-Meteo Weather'],
          mlServiceAvailable: true,
          provider: 'openai'
        }
      };
    } catch (err: any) {
      console.warn('OpenAI API call failed, attempting fallback:', err.message);
    }
  }

  // 2. Try Gemini fallback if configured
  if (geminiKey && !geminiKey.includes('your_gemini')) {
    try {
      const reply = await callGemini(geminiKey, conversationMessages, systemPrompt);
      const suggestions = generateFollowUpSuggestions(message, reply, destinationId);
      return {
        reply,
        suggestions,
        grounding: {
          sources: ['ExploreX Global Travel Knowledge', 'Gemini AI Engine', 'Open-Meteo Weather'],
          mlServiceAvailable: true,
          provider: 'gemini'
        }
      };
    } catch (err: any) {
      console.warn('Gemini AI call failed, attempting grounded fallback:', err.message);
    }
  }

  // 3. High-quality Grounded Universal Deterministic Fallback
  const reply = generateGroundedFallbackReply(message, conversationMessages, tripContext);
  const suggestions = generateFollowUpSuggestions(message, reply, destinationId);

  return {
    reply,
    suggestions,
    grounding: {
      sources: ['ExploreX Universal Knowledge Engine', 'India Tourism Knowledge Base'],
      mlServiceAvailable: false,
      provider: 'algorithmic-catalog'
    }
  };
}
