import Booth from '../models/Booth.js';
import Exhibitor from '../models/Exhibitor.js';
import Session from '../models/Session.js';
import Expo from '../models/Expo.js';

export const handleAIChat = async (req, res, next) => {
  try {
    const { message, context = {} } = req.body;
    if (!message) {
      return res.status(400).json({ message: 'Prompt message is required' });
    }

    const lower = message.toLowerCase().trim();

    // Fetch live database snapshot for context
    const [booths, exhibitors, sessions, expos] = await Promise.all([
      Booth.find().populate('exhibitorId'),
      Exhibitor.find(),
      Session.find().populate('speakerId'),
      Expo.find()
    ]);

    // Check if real Gemini key is configured
    const apiKey = process.env.AI_API_KEY;
    if (apiKey && apiKey !== 'mock_key_for_demo' && apiKey !== 'your_gemini_api_key_here') {
      try {
        const dbContextSummary = `
EventSphere Live Convention Center & Expo Complex Context:
Building: 4-Story Mega Convention Complex with Exterior Plaza, Multi-level Parking, EV Charging, Helipad, and Rooftop Billboards.
Floors:
- Level 0 (Ground Floor): Main Exhibition Hall, Arena Keynote Stage, South Main Entrance.
- Level 1 (1st Floor): Innovation Showcase & Autonomous Robotics Pavilion.
- Level 2 (2nd Floor): Executive Meeting Suites & Startup Pitch Alley.
- Level 3 (VIP Sky Floor): Skyline Glass Terrace, VIP Investor Suites & Sky Dining.
Parking: 3-Level Automated Garage, 450 Bays, EV Superchargers.
Exhibitors: ${JSON.stringify(exhibitors.map(ex => ({ name: ex.companyName, category: ex.category, booth: ex.boothNumber })))}
Booths: ${JSON.stringify(booths.map(b => ({ number: b.boothNumber, status: b.status, company: b.companyName })))}
Sessions: ${JSON.stringify(sessions.map(s => ({ title: s.title, time: `${s.startTime}-${s.endTime}`, speaker: s.speakerName })))}
`;

        const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `You are EventSphere Smart AI Concierge. Speak fluently in conversational English or Roman Urdu depending on the user. Provide helpful, structured, concise answers:\n${dbContextSummary}\n\nUser Message: ${message}`
              }]
            }]
          })
        });

        const geminiData = await geminiRes.json();
        if (geminiData.candidates && geminiData.candidates[0]?.content?.parts[0]?.text) {
          return res.json({ 
            response: geminiData.candidates[0].content.parts[0].text,
            actions: []
          });
        }
      } catch (err) {
        console.error('[Gemini API fallback]:', err.message);
      }
    }

    // Comprehensive Ultra-Flexible NLP Matching Engine (English + Roman Urdu + Slang)
    let reply = "";
    let actions = [];

    // 1. PARKING & VEHICLES ("parking", "car", "gadi", "valet", "ev charging")
    if (lower.includes("park") || lower.includes("car") || lower.includes("gadi") || lower.includes("gaari") || lower.includes("valet") || lower.includes("ev charge")) {
      reply = `🅿️ **EventSphere Parking Plaza & Valet Services**:\n\n` +
        `• **Location**: East Wing of Convention Complex.\n` +
        `• **Capacity**: 3-Level Automated Garage with 450+ Available Bays.\n` +
        `• **Features**: ⚡ EV Supercharging Stations, VIP Valet Drop-off & Fast-Pass QR Barrier Gates.\n` +
        `• **Fee**: Free for Registered Delegates & VIP Badge Holders.\n\n` +
        `Would you like to inspect the Parking Plaza in 3D?`;
      actions = [
        { label: '🚗 View Parking Plaza in 3D', type: 'VIEW_EXTERIOR' },
        { label: '🎫 Open VIP Fast-Pass', type: 'OPEN_BADGE' }
      ];
    }

    // 2. EXTERIOR BUILDING / COMPLEX / HELIPAD ("building", "complex", "bahar", "exterior", "helipad", "rooftop")
    else if (lower.includes("exterior") || lower.includes("bahar") || lower.includes("outer") || lower.includes("helipad") || lower.includes("roof") || (lower.includes("complex") && !lower.includes("schedule"))) {
      reply = `🏛️ **EventSphere Convention Center & Expo Complex**:\n\n` +
        `• **Architectural Design**: Curved futuristic glass podium with illuminated structural ribs.\n` +
        `• **Key Highlights**:\n` +
        `  - Grand Entrance Plaza with Water Reflection Fountain.\n` +
        `  - Rooftop 3D Digital LED Signboard ("EVENTSPHERE EXPO CENTER").\n` +
        `  - VIP Helipad for Executive Aviation Transfers.\n` +
        `  - Multi-Level Parking Plaza with 450 EV Bays.\n\n` +
        `You can toggle to the 3D Exterior Complex View anytime!`;
      actions = [
        { label: '🏛️ Switch to 3D Exterior View', type: 'VIEW_EXTERIOR' },
        { label: '🏢 Enter Indoor Floors', type: 'VIEW_INDOOR' }
      ];
    }

    // 3. MULTI-FLOOR BUILDING / ELEVATOR ("floor", "manzil", "level", "vip floor", "ground")
    else if (lower.includes("floor") || lower.includes("manzil") || lower.includes("level") || lower.includes("elevator") || lower.includes("lift") || lower.includes("ground")) {
      if (lower.includes("vip") || lower.includes("3") || lower.includes("terrace") || lower.includes("sky")) {
        reply = `👑 **VIP Sky Floor (Level 3)**:\n` +
          `• **Features**: Private Investor Lounges, Skyline Glass Terrace, VIP Dining & Executive Meeting Suites.\n` +
          `• **Access**: VIP Pass QR verification.`;
        actions = [
          { label: '🛗 Take Elevator to VIP Floor', type: 'CHANGE_FLOOR', floorId: 'floor-vip' },
          { label: '🎫 View VIP Pass', type: 'OPEN_BADGE' }
        ];
      } else if (lower.includes("1") || lower.includes("first") || lower.includes("robot") || lower.includes("innovation")) {
        reply = `🚀 **1st Floor (Level 1 - Innovation Showcase)**:\n` +
          `• **Features**: Autonomous Robotics Demonstrations, AI Startups & Interactive Workshop Pods.`;
        actions = [
          { label: '🛗 Go to 1st Floor in 3D', type: 'CHANGE_FLOOR', floorId: 'floor-1' }
        ];
      } else if (lower.includes("2") || lower.includes("second") || lower.includes("pitch") || lower.includes("suite")) {
        reply = `💼 **2nd Floor (Level 2 - Executive Suites & Startup Alley)**:\n` +
          `• **Features**: B2B Deal Rooms, Investor Pitch Stage, Private Executive Boardrooms.`;
        actions = [
          { label: '🛗 Go to 2nd Floor in 3D', type: 'CHANGE_FLOOR', floorId: 'floor-2' }
        ];
      } else {
        reply = `🏢 **Convention Center 4-Story Building Structure**:\n` +
          `• **Level 0 (Ground Floor)**: Main Exhibition Hall, Keynote Arena Stage, South Main Entrance.\n` +
          `• **Level 1 (1st Floor)**: Innovation Showcase & Robotics Pavilion.\n` +
          `• **Level 2 (2nd Floor)**: Executive Meeting Suites & Startup Pitch Alley.\n` +
          `• **Level 3 (VIP Sky Floor)**: Investor Lounges, Skyline Terrace & Sky Barista.\n\n` +
          `Choose which floor you'd like to explore in 3D:`;
        actions = [
          { label: '🛗 Ground Floor (Main Arena)', type: 'CHANGE_FLOOR', floorId: 'floor-0' },
          { label: '🛗 1st Floor (Robotics)', type: 'CHANGE_FLOOR', floorId: 'floor-1' },
          { label: '🛗 VIP Sky Floor', type: 'CHANGE_FLOOR', floorId: 'floor-vip' }
        ];
      }
    }

    // 4. TECH / AI / ROBOTICS / COMPANIES ("tech", "company", "companies", "exhibitor", "ai")
    else if (lower.includes("tech") || lower.includes("company") || lower.includes("companies") || lower.includes("exhibitor") || lower.includes("ai") || lower.includes("robot") || lower.includes("software")) {
      const techExhibitors = exhibitors.filter(e => 
        (e.category && (e.category.toLowerCase().includes("tech") || e.category.toLowerCase().includes("ai") || e.category.toLowerCase().includes("software"))) ||
        (e.description && (e.description.toLowerCase().includes("tech") || e.description.toLowerCase().includes("ai")))
      );

      reply = `🚀 **Featured Tech & AI Exhibitors at EventSphere**:\n\n` + 
        (techExhibitors.length > 0 
          ? techExhibitors.map(e => `• **${e.companyName}** (Booth **${e.boothNumber}**)\n  *${e.description ? e.description.slice(0, 85) + '...' : e.category}*`).join('\n\n')
          : `• **TechCorp Global** (Booth A12)\n• **Quantum Byte Solutions** (Booth B04)\n• **CyberShield Security** (Booth B10)`) +
        `\n\n💡 *Tip: Click below to teleport directly in 3D!*`;
      
      actions = [
        { label: '📍 Teleport to Booth A12', type: 'TELEPORT_BOOTH', boothNumber: 'A12' },
        { label: '📍 Teleport to Booth B04', type: 'TELEPORT_BOOTH', boothNumber: 'B04' },
        { label: '🏢 View All Exhibitors', type: 'NAVIGATE_PAGE', url: '/exhibitors' }
      ];
    }

    // 5. SPECIFIC BOOTH SEARCH ("booth a01", "where is", "kahan", "locate", "rasta")
    else if (lower.includes("booth") || lower.includes("where is") || lower.includes("locate") || lower.includes("kahan") || lower.includes("rasta") || lower.includes("direction")) {
      const boothMatch = booths.find(b => lower.includes(b.boothNumber.toLowerCase()));
      
      if (boothMatch) {
        reply = `📍 **Booth ${boothMatch.boothNumber} Information**:\n` +
          `• **Company**: ${boothMatch.companyName || 'Available for Reservation'}\n` +
          `• **Status**: ${boothMatch.status}\n` +
          `• **Sector**: Sector ${boothMatch.boothNumber.charAt(0)} (Ground Floor)\n\n` +
          `Would you like to navigate directly to Booth ${boothMatch.boothNumber}?`;
        actions = [
          { label: `📍 Locate Booth ${boothMatch.boothNumber} in 3D`, type: 'TELEPORT_BOOTH', boothNumber: boothMatch.boothNumber, position: boothMatch.position },
          { label: `🧭 Start Navigation to ${boothMatch.boothNumber}`, type: 'NAVIGATE_BOOTH', booth: boothMatch }
        ];
      } else {
        reply = `📍 **Exhibition Hall Directory**:\n` +
          `• **Sector A**: North Wing (AI & Robotics)\n` +
          `• **Sector B**: East Wing (Cloud & Cybersecurity)\n` +
          `• **Sector C**: West Wing (Enterprise B2B)\n` +
          `• **Sector D**: South Gallery (Startups)\n\n` +
          `Aap kisi bhi booth ka number (e.g. *A01*, *A12*, *B04*) bata sakte hain instant 3D teleport ke liye!`;
      }
    }

    // 6. SCHEDULE & SESSIONS ("schedule", "time", "routine", "plan", "10 am", "speaker", "session")
    else if (lower.includes("schedule") || lower.includes("time") || lower.includes("routine") || lower.includes("plan") || lower.includes("speaker") || lower.includes("session") || lower.includes("timing")) {
      reply = `🗓️ **Today's Featured Keynote & Workshop Schedule**:\n\n` +
        `1️⃣ **10:00 AM - 11:30 AM**: Keynote - *Future of Generative AI & Autonomous Agents* (Main Arena Stage)\n\n` +
        `2️⃣ **11:30 AM - 01:00 PM**: Expo Hall VIP Booth Exploration & B2B Matchmaking\n\n` +
        `3️⃣ **01:00 PM - 01:45 PM**: Executive Lunch Break (Executive Lounge & Cafe)\n\n` +
        `4️⃣ **02:00 PM - 03:30 PM**: Workshop - *Cloud Native Microservices Architecture* (Stage 2)\n\n` +
        `5️⃣ **03:30 PM - 04:30 PM**: Closing Panel - *Global Tech Frontiers 2026* (Main Stage)`;
      
      actions = [
        { label: '📅 Full Interactive Schedule', type: 'NAVIGATE_PAGE', url: '/schedule' },
        { label: '🎤 Meet Keynote Speakers', type: 'NAVIGATE_PAGE', url: '/speakers' }
      ];
    }

    // 7. FOOD & CAFE ("food", "cafe", "khana", "coffee", "lunch", "restaurant")
    else if (lower.includes("food") || lower.includes("cafe") || lower.includes("khana") || lower.includes("coffee") || lower.includes("lunch") || lower.includes("tea")) {
      reply = `☕ **Food & Refreshment Lounges**:\n\n` +
        `• **Executive Lounge & Barista Cafe**: Ground Floor (North East). Espresso, snacks, buffet.\n` +
        `• **VIP Sky Dining Terrace**: Level 3 (VIP Sky Floor) with skyline view.\n` +
        `• **Fast Snack Kiosks**: Sector B & Sector D corridors.`;
      actions = [
        { label: '🧭 Navigate to Executive Cafe', type: 'TELEPORT_FACILITY', name: 'Executive Cafe' }
      ];
    }

    // 8. TICKET / PASS / VIP ("ticket", "pass", "badge", "register", "price")
    else if (lower.includes("ticket") || lower.includes("pass") || lower.includes("badge") || lower.includes("register") || lower.includes("price") || lower.includes("fees")) {
      reply = `🎫 **EventSphere Digital Pass & VIP Registration**:\n\n` +
        `• **General Admission**: Full access to Ground Floor & 1st Floor Expo.\n` +
        `• **VIP All-Access Pass**: Access to all 4 floors, VIP Sky Lounge, Parking Plaza fast-pass, and keynote front-row seats.\n\n` +
        `Aap apna 3D Holographic VIP Pass abhi inspect kar sakte hain!`;
      actions = [
        { label: '🎫 View 3D Holographic Pass', type: 'OPEN_BADGE' },
        { label: '✨ Register New Attendee', type: 'NAVIGATE_PAGE', url: '/register' }
      ];
    }

    // 9. GENERAL / GREETINGS / CHAT ("hello", "hi", "salam", "kaise ho", "kya haal", "help", "who are you")
    else {
      reply = `👋 **Assalam-o-Alaikum! Welcome to EventSphere AI Concierge!**\n\n` +
        `Main aapki kisi bhi tarah madad kar sakta hoon:\n` +
        `• 🏛️ **3D Exterior & Parking** (*"Parking plaza dikhao", "Building exterior kaisa hai?"*)\n` +
        `• 🏢 **4-Story Multi-Floor Building** (*"VIP floor par kya hai?", "1st floor par le chalo"*)\n` +
        `• 🏪 **Exhibitors & Booths** (*"Which tech companies are here?", "Where is booth A12?"*)\n` +
        `• 🗓️ **Day Planning & Schedule** (*"Plan my day from 10 AM to 4 PM"*)\n` +
        `• 🎫 **Digital Passes & Fast-Pass** (*"Show my VIP badge"*)\n\n` +
        `Aap Urdu ya English mein jo chahein pooch sakte hain!`;

      actions = [
        { label: '🏛️ View Exterior & Parking 3D', type: 'VIEW_EXTERIOR' },
        { label: '🏢 Explore Building Floors', type: 'CHANGE_FLOOR', floorId: 'floor-0' },
        { label: '🚀 Explore Tech Exhibitors', type: 'QUERY_SUGGESTION', query: 'Which tech companies are available?' },
        { label: '🗓️ Plan My Schedule (10AM-4PM)', type: 'QUERY_SUGGESTION', query: 'Plan my day from 10 AM to 4 PM' }
      ];
    }

    return res.json({ response: reply, actions });
  } catch (error) {
    next(error);
  }
};
