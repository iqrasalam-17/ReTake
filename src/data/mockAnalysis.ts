import { AnalysisResult } from '../types/analysis';

export const MOCK_ANALYSIS_RESULT: AnalysisResult = {
  productionScore: 78,
  status: "MOSTLY READY",
  scenes: [
    {
      sceneNumber: 1,
      heading: "INT. SARAH'S APARTMENT - MORNING",
      timeOfDay: "MORNING",
      location: "SARAH'S APARTMENT",
      characters: ["SARAH"],
      wardrobe: ["Distressed olive leather jacket", "Dark jeans"],
      props: ["Cracked iPhone 13", "Black encrypted flash drive", "Analog wall clock"],
      pageCount: "1.2 pages"
    },
    {
      sceneNumber: 2,
      heading: "EXT. DOWNTOWN 4TH STREET - AFTERNOON",
      timeOfDay: "AFTERNOON",
      location: "DOWNTOWN 4TH STREET",
      characters: ["SARAH", "UNMARKED SEDAN DRIVER (BG)"],
      wardrobe: ["Beige trench coat (CONFLICT)"],
      props: ["Uncracked silver iPhone (CONFLICT)", "Encrypted flash drive"],
      pageCount: "0.8 pages"
    },
    {
      sceneNumber: 3,
      heading: "INT. SARAH'S APARTMENT - NIGHT",
      timeOfDay: "NIGHT",
      location: "SARAH'S APARTMENT",
      characters: ["SARAH"],
      wardrobe: ["Distressed olive leather jacket"],
      props: ["Cracked iPhone 13", "Ransacked dossiers"],
      pageCount: "1.0 pages"
    },
    {
      sceneNumber: 4,
      heading: "INT. METRO COFFEE SHOP - AFTERNOON",
      timeOfDay: "AFTERNOON",
      location: "METRO COFFEE SHOP",
      characters: ["SARAH", "MARCUS"],
      wardrobe: ["Distressed olive leather jacket", "Marcus tailored charcoal suit"],
      props: ["Vintage gold watch", "Coffee cups", "Dossier envelope"],
      pageCount: "1.5 pages"
    },
    {
      sceneNumber: 5,
      heading: "EXT. HIGH-RISE ROOFTOP - SUNSET",
      timeOfDay: "SUNSET (GOLDEN HOUR)",
      location: "HIGH-RISE ROOFTOP",
      characters: ["SARAH", "SHADOWY CONTACT"],
      wardrobe: ["Distressed olive leather jacket", "Contact dark trench coat"],
      props: ["Black encrypted flash drive", "Tactical case"],
      pageCount: "1.4 pages"
    }
  ],
  risks: [
    {
      id: "risk-1",
      title: "WARDROBE CONTINUITY RUPTURE (SARAH'S JACKET)",
      severity: "CRITICAL",
      category: "CONTINUITY",
      extracted: "Scene 1 specifies 'distressed olive leather jacket', Scene 2 abruptly switches to 'beige trench coat' on same narrative morning/afternoon transit, then Scene 3 reverts to 'olive leather jacket' without narrative justification for costume change.",
      inferred: "Scenes 1, 2, and 3 represent an unbroken 6-hour narrative chase. An unplanned wardrobe swap between exterior and ransacked interior destroys verisimilitude on cut.",
      risk: "Costly continuity reshoot or awkward ADR line insertion to explain spontaneous wardrobe change.",
      recommendation: "Standardize wardrobe to Olive Leather Jacket across Scenes 1-3. Reserve beige trench coat strictly for Scene 4 if narrative disguise was intended."
    },
    {
      id: "risk-2",
      title: "HERO PROP DISCREPANCY (IPHONE STATE)",
      severity: "HIGH",
      category: "CONTINUITY",
      extracted: "Scene 1 and Scene 3 explicitly establish Sarah's phone as a 'cracked black iPhone 13'. Scene 2 script calls for 'an uncracked new iPhone with silver casing'.",
      inferred: "Prop department may source two distinct hero phones or secondary backup units with non-matching screen conditions.",
      risk: "Glaring macro insert mismatch in edit bay when Sarah checks incoming call on 4th Street compared to dialing in apartment.",
      recommendation: "Lock master hero prop as 'Cracked iPhone 13' across script breakdown notes. Mark duplicate hero backup with matching screen fracture decal."
    },
    {
      id: "risk-3",
      title: "ACTOR CUTOFF VS. NATURAL SUNSET WINDOW (COLLISION)",
      severity: "CRITICAL",
      category: "SCHEDULE",
      extracted: "User constraints state Sarah has a hard union cutoff on Day 2 at 3:00 PM. Scene 5 requires natural sunset exterior on high-rise rooftop.",
      inferred: "Parallel Search confirms official nautical twilight and sunset in Los Angeles occurs at 6:47 PM. Shooting rooftop with Sarah at 6:47 PM violates union availability by 3 hours 47 minutes.",
      risk: "Production shutdown, punitive union turnaround overtime penalties ($18,500+ estimated), or shooting rooftop without principal cast.",
      recommendation: "Swap day allocation: Shoot Scene 5 (Rooftop sunset) on Day 1 where Sarah has full evening availability. Re-cluster Apartment (Scenes 1 & 3) on Day 1 morning/afternoon, or secure Sarah day-rate extension for Day 2 sunset."
    },
    {
      id: "risk-4",
      title: "ROOFTOP HIGH-RISE WIND & SOUND PERMIT LIMIT",
      severity: "MEDIUM",
      category: "LOGISTICS",
      extracted: "Scene 5 takes place EXT. HIGH-RISE ROOFTOP with delicate whispering dialogue and loose paper props.",
      inferred: "Parallel Search indicates average 18-24 kt gust wind velocity above 30 floors at 18:00 hrs. City film office requires safety harness rigging inspections 4 hours prior to camera roll.",
      risk: "Boom audio unusable due to wind noise; loose papers blowing off edge causing safety violation.",
      recommendation: "Pre-rig high-wind windjammers (Deadcat/Rycote) + lavalier body mics; secure synthetic prop documents with monofilament pins."
    }
  ],
  continuityIssues: [
    {
      id: "cont-1",
      type: "WARDROBE",
      title: "Sarah's Coat Discontinuity across Chase Sequence",
      description: "Scene 1 (Apartment Morning) uses Olive Leather Jacket -> Scene 2 (Street Afternoon) uses Beige Trench Coat -> Scene 3 (Apartment Night) returns to Olive Leather Jacket.",
      scenesInvolved: [1, 2, 3],
      fix: "Standardize wardrobe to Olive Leather Jacket or establish Sarah grabbing trench from coat rack in Scene 1."
    },
    {
      id: "cont-2",
      type: "PROP",
      title: "Hero Cellphone Condition & Finish Mismatch",
      description: "Black cracked iPhone 13 (Scene 1) vs Silver uncracked iPhone (Scene 2) vs Black cracked iPhone 13 (Scene 3).",
      scenesInvolved: [1, 2, 3],
      fix: "Ensure Props Master prepares two identical cracked black handsets."
    },
    {
      id: "cont-3",
      type: "STATE",
      title: "Encrypted Flash Drive Placement Conflict",
      description: "In Scene 1 Sarah places flash drive in left pocket of leather jacket; in Scene 2 she wears a trench coat without internal breast pocket.",
      scenesInvolved: [1, 2],
      fix: "Specify exterior pocket placement in script notes for script supervisor."
    }
  ],
  locationIntel: [
    {
      locationName: "DOWNTOWN HIGH-RISE ROOFTOP (SCENE 5)",
      sunsetTime: "6:47 PM PST",
      goldenHourWindow: "5:52 PM - 6:38 PM PST",
      weatherNote: "Clear skies, 64°F, wind gusts 16-22 mph at elevation",
      permitInfo: "Commercial filming permit approved (Zone 4). Rooftop safety tie-offs required for crew within 10ft of parapet.",
      searchSource: "Grounded via Parallel Web Search (NOAA & FilmLA Filming Permitting API)",
      distanceNote: "14.2 miles from Stage A (approx 35 min transport in peak traffic)"
    },
    {
      locationName: "SARAH'S APARTMENT / STAGE B (SCENES 1 & 3)",
      sunsetTime: "N/A (Interior Controlled)",
      goldenHourWindow: "Continuous interior lighting required",
      weatherNote: "Soundstage climate-controlled environment",
      permitInfo: "Soundstage rental day 1 lock-in. 12-hour turnaround required before Day 2 strike.",
      searchSource: "Stage management specifications & union agreement",
      distanceNote: "Primary base camp & catering footprint"
    },
    {
      locationName: "METRO COFFEE SHOP (SCENE 4)",
      sunsetTime: "6:47 PM PST",
      goldenHourWindow: "Interior window bounce optimal 10:00 AM - 1:00 PM",
      weatherNote: "Clear, street parking restrictions on north curb",
      permitInfo: "Cafe buy-out permit active 06:00 - 13:00 only. Strict turnover at 1:30 PM for cafe evening reopening.",
      searchSource: "Location contract ledger + municipal curb parking dataset",
      distanceNote: "3.1 miles from Downtown high-rise"
    }
  ],
  currentPlan: {
    hours: 12,
    setupSwitches: 6,
    riskCount: 4
  },
  optimizedPlan: {
    hours: 9,
    setupSwitches: 2,
    hoursSaved: 3
  },
  optimizedShootingOrder: [
    {
      order: 1,
      sceneNumber: 1,
      heading: "INT. SARAH'S APARTMENT - MORNING",
      day: 1,
      reason: "Start at primary apartment base. Rig daylight lighting once for Scene 1."
    },
    {
      order: 2,
      sceneNumber: 3,
      heading: "INT. SARAH'S APARTMENT - NIGHT",
      day: 1,
      reason: "Shoot Scene 3 immediately after Scene 1 in same location! Swap from day to night lighting without tearing down camera package. Saves 3.5 hours of location moves."
    },
    {
      order: 3,
      sceneNumber: 5,
      heading: "EXT. HIGH-RISE ROOFTOP - SUNSET",
      day: 1,
      reason: "Moved from Day 2 to Day 1 evening. Sarah has full availability until wrap on Day 1, ensuring crew captures natural 6:47 PM sunset without union penalty."
    },
    {
      order: 4,
      sceneNumber: 4,
      heading: "INT. METRO COFFEE SHOP - AFTERNOON (MORNING CALL)",
      day: 2,
      reason: "Call 07:00 AM at cafe before public buy-out expires at 13:00. Sarah & Marcus dialogue block."
    },
    {
      order: 5,
      sceneNumber: 2,
      heading: "EXT. DOWNTOWN 4TH STREET - AFTERNOON",
      day: 2,
      reason: "Walking distance from Metro Coffee Shop. Wrap Sarah at 14:15 PM, 45 minutes ahead of her 15:00 union cutoff."
    }
  ],
  blueprints: [
    {
      day: 1,
      targetHours: "08:00 - 19:30 (11.5 hrs with meal)",
      locations: ["Stage B / Sarah's Apartment", "Downtown High-Rise Rooftop"],
      scenes: [1, 3, 5],
      cast: ["Sarah (All Day)", "Shadowy Contact (Call 17:00)"],
      keyWardrobe: ["Distressed Olive Leather Jacket (Verified)", "Contact Dark Coat"],
      keyProps: ["Cracked iPhone 13 #1", "Black encrypted flash drive", "Ransacked dossiers", "Tactical case"],
      notes: "Clustered apartment interiors back-to-back. Fast afternoon company move to Rooftop at 16:30 for sunset safety lock."
    },
    {
      day: 2,
      targetHours: "07:00 - 15:00 (8.0 hrs wrap)",
      locations: ["Metro Coffee Shop (Arts District)", "Downtown 4th Street Exterior"],
      scenes: [4, 2],
      cast: ["Sarah (Hard wrap 14:45)", "Marcus (Wrap 12:30)", "Sedan Stunt Driver"],
      keyWardrobe: ["Distressed Olive Leather Jacket (Continuity locked)", "Marcus Charcoal Suit"],
      keyProps: ["Cracked iPhone 13 #2", "Vintage gold watch", "Dossier envelope", "Unmarked black sedan"],
      notes: "Zero turnaround conflict. Sarah safely off the clock before 15:00 PM cutoff. Avoided $18.5k in overtime penalties."
    }
  ]
};

export const AGENT_STAGES = [
  {
    id: 1,
    code: "AGENT-01",
    name: "SCRIPT SUPERVISOR",
    description: "Extracts scenes, characters, locations, props, wardrobe.",
    liveStatus: "Extracting 5 scenes, 3 locations, 4 characters, 12 props..."
  },
  {
    id: 2,
    code: "AGENT-02",
    name: "CONTINUITY DETECTIVE",
    description: "Hunts wardrobe, prop, and story-state conflicts.",
    liveStatus: "Cross-referencing wardrobe continuity & hero prop states..."
  },
  {
    id: 3,
    code: "AGENT-03",
    name: "LOGISTICS ENGINE",
    description: "Clusters locations, eliminates avoidable movement.",
    liveStatus: "Computing transit matrices and soundstage turnarounds..."
  },
  {
    id: 4,
    code: "AGENT-04",
    name: "SCHEDULE ENGINE",
    description: "Aligns actor windows, sunset times, and shoot days.",
    liveStatus: "Evaluating union cutoff limits vs natural lighting windows..."
  },
  {
    id: 5,
    code: "AGENT-05",
    name: "LOCATION SCOUT",
    description: "Grounds decisions in real-world data via Parallel Web Search.",
    liveStatus: "Querying Parallel Search for sunset times in Los Angeles (6:47 PM)..."
  },
  {
    id: 6,
    code: "AGENT-06",
    name: "RISK DETECTIVE",
    description: "Adversarially asks: 'How could this production fail?'",
    liveStatus: "Stress-testing edge cases: overtime, wind shear, permit expiration..."
  },
  {
    id: 7,
    code: "AGENT-07",
    name: "PRODUCTION SUPERVISOR",
    description: "Synthesizes the final production blueprint.",
    liveStatus: "Compiling 3-hour optimization savings and production health index..."
  }
];
