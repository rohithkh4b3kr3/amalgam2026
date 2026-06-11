export const FEST_DATE = new Date("2026-08-14T09:00:00+05:30");
export const FEST_NAME = "AMALGAM 2026";
export const FEST_TAGLINE = "Where Elements Unite";
export const FEST_SUBTITLE = "IIT Madras · Department of Metallurgical & Materials Engineering";

export type Category = "competition" | "workshop" | "talk" | "ceremony" | "cultural";

export interface Event {
  id: string;
  title: string;
  day: 1 | 2 | 3;
  time: string;
  endTime: string;
  venue: string;
  category: Category;
  description: string;
}

export interface Speaker {
  id: string;
  name: string;
  designation: string;
  organization: string;
  talkTitle: string;
  day: 1 | 2 | 3;
  time: string;
  bio: string;
  photo?: string;
}

export interface Workshop {
  id: string;
  title: string;
  description: string;
  day: 1 | 2 | 3;
  time: string;
  endTime: string;
  venue: string;
  capacity: number;
  registered: number;
  prerequisites: string;
  instructors: string;
}

export interface Competition {
  id: string;
  title: string;
  description: string;
  eligibility: string;
  teamSize: string;
  prize: string;
  firstPrize: string;
  secondPrize: string;
  thirdPrize: string;
  registrationDeadline: string;
  rounds: string[];
  domain: string;
}

export const EVENTS: Event[] = [
  // Day 1
  { id: "e1", title: "Inauguration & Opening Ceremony", day: 1, time: "09:00", endTime: "10:00", venue: "MME Auditorium", category: "ceremony", description: "Grand opening of AMALGAM 2026 with lamp lighting, welcome address by HoD, and cultural performance." },
  { id: "e2", title: "Keynote: High Entropy Alloys — The Next Frontier", day: 1, time: "10:15", endTime: "11:30", venue: "MME Auditorium", category: "talk", description: "Exploring the revolutionary potential of multi-principal element alloys in modern engineering." },
  { id: "e3", title: "Workshop: XRD & Crystal Structure Analysis", day: 1, time: "09:30", endTime: "13:00", venue: "Materials Characterization Lab", category: "workshop", description: "Hands-on session on X-ray diffraction principles, sample preparation, and peak analysis using HighScore Plus." },
  { id: "e4", title: "Materials Alchemy — Heats Round", day: 1, time: "11:00", endTime: "13:00", venue: "Seminar Hall A", category: "competition", description: "Preliminary round of the flagship materials science quiz with rapid-fire and buzzer rounds." },
  { id: "e5", title: "Workshop: Electron Microscopy (SEM/TEM)", day: 1, time: "14:00", endTime: "18:00", venue: "FESEM Lab, MME", category: "workshop", description: "Observe microstructures at nanoscale resolution. Learn imaging, EDS analysis, and sample preparation techniques." },
  { id: "e6", title: "Case Catalyst — Problem Statement Release", day: 1, time: "15:00", endTime: "15:30", venue: "Seminar Hall B", category: "competition", description: "Industry case study challenge kick-off. Teams receive real-world materials engineering problem statements." },
  { id: "e7", title: "Speakers Panel: Sustainable Materials for Green Industry", day: 1, time: "16:00", endTime: "17:30", venue: "MME Auditorium", category: "talk", description: "Panel discussion on green steel, bio-materials, and circular economy approaches in materials engineering." },
  { id: "e8", title: "Cultural Night & Networking", day: 1, time: "19:00", endTime: "22:00", venue: "Open Air Theatre", category: "cultural", description: "Musical performances, bonfire, food stalls, and networking session for students and industry guests." },

  // Day 2
  { id: "e9", title: "Keynote: Materials for Space Applications", day: 2, time: "09:00", endTime: "10:15", venue: "MME Auditorium", category: "talk", description: "From heat shields to satellite structures — the materials science powering India's space missions." },
  { id: "e10", title: "Workshop: Computational Materials Design (DFT)", day: 2, time: "09:30", endTime: "13:00", venue: "Computer Lab, MME", category: "workshop", description: "Introduction to Density Functional Theory using VASP/Quantum ESPRESSO. Simulate electronic structure of materials." },
  { id: "e11", title: "Forge Masters — Build Round", day: 2, time: "10:00", endTime: "14:00", venue: "Materials Processing Lab", category: "competition", description: "Physical model building competition. Teams design and fabricate a structural component from provided raw materials." },
  { id: "e12", title: "Surface Analysis Challenge — Finals", day: 2, time: "11:00", endTime: "14:00", venue: "Corrosion Lab, MME", category: "competition", description: "Identify unknown alloy samples using characterization tools. Final scoring based on accuracy and methodology." },
  { id: "e13", title: "Workshop: 3D Metal Printing (LPBF)", day: 2, time: "14:00", endTime: "18:00", venue: "AM Lab, MME", category: "workshop", description: "Design-to-part session on Laser Powder Bed Fusion. Process parameters, support strategies, and post-processing." },
  { id: "e14", title: "Materials Alchemy — Grand Finals", day: 2, time: "15:00", endTime: "17:00", venue: "MME Auditorium", category: "competition", description: "Top 8 teams battle in the ultimate materials science quiz finale with live scoring and audience participation." },
  { id: "e15", title: "Case Catalyst — Presentation Round", day: 2, time: "15:00", endTime: "18:00", venue: "Seminar Hall A", category: "competition", description: "Teams present their industry case study solutions to a panel of judges from academia and industry." },

  // Day 3
  { id: "e16", title: "Keynote: Quantum Materials — Computing with Matter", day: 3, time: "09:00", endTime: "10:15", venue: "MME Auditorium", category: "talk", description: "Topological insulators, superconductors, and quantum sensing materials reshaping next-generation technology." },
  { id: "e17", title: "Workshop: Corrosion Testing & Electrochemical Analysis", day: 3, time: "09:30", endTime: "13:00", venue: "Corrosion Lab, MME", category: "workshop", description: "Potentiodynamic polarization curves, EIS spectroscopy, and corrosion rate calculation hands-on workshop." },
  { id: "e18", title: "Green Steel Innovation — Paper Presentation", day: 3, time: "10:00", endTime: "13:00", venue: "Seminar Hall B", category: "competition", description: "Present innovative research on sustainable steel manufacturing, low-carbon processes, or green materials solutions." },
  { id: "e19", title: "Forge Masters — Showcase & Judging", day: 3, time: "11:00", endTime: "13:00", venue: "MME Open Lab", category: "competition", description: "Final showcase of fabricated models. Judged on structural integrity, innovation, and manufacturing efficiency." },
  { id: "e20", title: "Award Ceremony & Prize Distribution", day: 3, time: "14:00", endTime: "15:30", venue: "MME Auditorium", category: "ceremony", description: "Recognition of winners across all competitions, best workshop participants, and outstanding contributions." },
  { id: "e21", title: "Valedictory & Closing Ceremony", day: 3, time: "15:30", endTime: "17:00", venue: "MME Auditorium", category: "ceremony", description: "Closing address, reflection on AMALGAM 2026, and the grand farewell of a spectacular three-day fest." },
];

export const SPEAKERS: Speaker[] = [
  {
    id: "s1",
    name: "Prof. Rajesh Kumar",
    designation: "Professor & Head",
    organization: "IIT Madras, MME",
    talkTitle: "High Entropy Alloys — The Next Frontier",
    day: 1,
    time: "10:15",
    bio: "Prof. Kumar leads the Advanced Alloys Research Group at IIT Madras with 20+ years of expertise in multi-principal element alloys and their industrial applications. His work has been cited over 8,000 times globally.",
  },
  {
    id: "s2",
    name: "Dr. Priya Shankar",
    designation: "Scientist G",
    organization: "DRDO, Hyderabad",
    talkTitle: "Lightweight Armor: Materials at the Edge",
    day: 1,
    time: "16:00",
    bio: "Dr. Shankar has developed breakthrough composite and ceramic armor systems for the Indian armed forces. She holds 12 patents and is a recipient of the DRDO Technology Award.",
  },
  {
    id: "s3",
    name: "Mr. Arun Bose",
    designation: "Chief Materials Officer",
    organization: "Tata Steel, Jamshedpur",
    talkTitle: "Sustainable Steelmaking in the Net-Zero Era",
    day: 1,
    time: "16:45",
    bio: "Mr. Bose leads Tata Steel's materials innovation and decarbonization initiatives, overseeing a portfolio of green hydrogen-based steelmaking projects with potential to eliminate 5 MT of CO₂ annually.",
  },
  {
    id: "s4",
    name: "Dr. Meera Iyer",
    designation: "Project Director, GSLV",
    organization: "ISRO, Thiruvananthapuram",
    talkTitle: "Materials for Space: From Launchpad to Orbit",
    day: 2,
    time: "09:00",
    bio: "Dr. Iyer oversaw materials selection and qualification for ISRO's GSLV Mark III and the Gaganyaan human spaceflight program. Her work on refractory alloys and thermal protection systems is internationally recognized.",
  },
  {
    id: "s5",
    name: "Prof. Vikram Nair",
    designation: "Professor, Materials Research Centre",
    organization: "Indian Institute of Science, Bangalore",
    talkTitle: "Quantum Materials: Computing with Matter",
    day: 3,
    time: "09:00",
    bio: "Prof. Nair is a leading theorist in topological quantum materials and strongly correlated electron systems. He recently discovered a new class of magnetic topological insulators, published in Nature Materials.",
  },
];

export const WORKSHOPS: Workshop[] = [
  {
    id: "w1",
    title: "XRD & Crystal Structure Analysis",
    description: "Master the fundamentals of X-ray diffraction for materials characterization. Learn Bragg's law, diffractometer operation, peak identification, Rietveld refinement, and phase quantification using HighScore Plus software.",
    day: 1,
    time: "09:30",
    endTime: "13:00",
    venue: "Materials Characterization Lab, MME",
    capacity: 20,
    registered: 17,
    prerequisites: "Basic knowledge of crystallography",
    instructors: "Dr. Anand Raju, Post-doctoral Researcher",
  },
  {
    id: "w2",
    title: "Electron Microscopy: SEM & TEM",
    description: "Hands-on session with the FESEM and TEM instruments at MME. Covers sample preparation, imaging modes, EDS elemental analysis, diffraction contrast, and high-resolution imaging of nanoscale microstructures.",
    day: 1,
    time: "14:00",
    endTime: "18:00",
    venue: "FESEM Lab, MME Block B",
    capacity: 15,
    registered: 12,
    prerequisites: "Familiarity with materials microstructure",
    instructors: "Mr. Suresh Babu, Lab Manager & PhD Scholar",
  },
  {
    id: "w3",
    title: "Computational Materials Design (DFT)",
    description: "Introduction to first-principles calculations for materials property prediction. Run actual DFT simulations using Quantum ESPRESSO to compute band structures, density of states, and formation energies.",
    day: 2,
    time: "09:30",
    endTime: "13:00",
    venue: "Computer Lab, MME",
    capacity: 25,
    registered: 25,
    prerequisites: "Basic quantum mechanics & Linux command line",
    instructors: "Dr. Karthik Sundaram, Assistant Professor",
  },
  {
    id: "w4",
    title: "3D Metal Printing: Design to Part",
    description: "End-to-end session on Laser Powder Bed Fusion (L-PBF) additive manufacturing. Design a component in CAD, simulate the build, set process parameters, and observe the actual printing process.",
    day: 2,
    time: "14:00",
    endTime: "18:00",
    venue: "Additive Manufacturing Lab, MME",
    capacity: 18,
    registered: 14,
    prerequisites: "Basic CAD knowledge preferred",
    instructors: "Dr. Lakshmi Priya, SERB Project Investigator",
  },
  {
    id: "w5",
    title: "Corrosion Testing & Electrochemical Analysis",
    description: "Learn potentiodynamic polarization, electrochemical impedance spectroscopy (EIS), and linear polarization resistance techniques. Analyze real corrosion data and quantify corrosion rates using Tafel extrapolation.",
    day: 3,
    time: "09:30",
    endTime: "13:00",
    venue: "Electrochemistry & Corrosion Lab, MME",
    capacity: 20,
    registered: 9,
    prerequisites: "Basic electrochemistry concepts",
    instructors: "Prof. Ramesh Govindan, Associate Professor",
  },
];

export const COMPETITIONS: Competition[] = [
  {
    id: "c1",
    title: "Materials Alchemy",
    description: "The flagship quiz of AMALGAM. Test your mastery of materials science spanning metallurgy, polymers, ceramics, composites, and cutting-edge materials research. Features rapid-fire, visual identification, and buzzer rounds.",
    eligibility: "B.Tech / M.Tech / M.S. / Ph.D. students from any discipline",
    teamSize: "2 members",
    prize: "Total prize pool ₹25,000",
    firstPrize: "₹12,000 + Trophies + Certificates",
    secondPrize: "₹7,000 + Trophies + Certificates",
    thirdPrize: "₹4,000 + Certificates",
    registrationDeadline: "August 10, 2026",
    rounds: ["Online Screening (MCQ, 30 min)", "Written Heats (Day 1)", "Grand Finals (Day 2)"],
    domain: "Materials Science & Engineering",
  },
  {
    id: "c2",
    title: "Forge Masters",
    description: "A hands-on fabrication challenge where teams design and manufacture a load-bearing component from provided raw materials and basic tools. Judged on structural performance, design creativity, and weight efficiency.",
    eligibility: "B.Tech / Diploma students with basic workshop experience",
    teamSize: "3 members",
    prize: "Total prize pool ₹20,000",
    firstPrize: "₹10,000 + Championship Trophy",
    secondPrize: "₹6,000 + Trophy",
    thirdPrize: "₹3,000 + Certificate",
    registrationDeadline: "August 8, 2026",
    rounds: ["Design Submission (online, before Day 2)", "Build Round (Day 2)", "Load Testing & Showcase (Day 3)"],
    domain: "Manufacturing & Design",
  },
  {
    id: "c3",
    title: "Case Catalyst",
    description: "An industry-sponsored case study competition where teams tackle real materials engineering challenges presented by industry partners. Requires technical analysis, cost modelling, and actionable recommendations.",
    eligibility: "Final year B.Tech, M.Tech, and MBA students",
    teamSize: "3-4 members",
    prize: "Total prize pool ₹30,000",
    firstPrize: "₹15,000 + Industry Mentorship Opportunity",
    secondPrize: "₹9,000 + Certificates",
    thirdPrize: "₹5,000 + Certificates",
    registrationDeadline: "August 12, 2026",
    rounds: ["Problem Statement Release (Day 1, 3 PM)", "Submission Deadline (Day 2, 9 AM)", "Presentations (Day 2, 3-6 PM)"],
    domain: "Industry & Business",
  },
  {
    id: "c4",
    title: "Surface Analysis Challenge",
    description: "Teams are given unknown material samples and must identify the alloy system, microstructure, and key properties using available characterization equipment. Tests practical lab skills and materials intuition.",
    eligibility: "M.Tech / Ph.D. / Senior B.Tech (3rd & 4th year) students",
    teamSize: "2 members",
    prize: "Total prize pool ₹15,000",
    firstPrize: "₹8,000 + Certificates",
    secondPrize: "₹5,000 + Certificates",
    thirdPrize: "₹2,000 + Certificates",
    registrationDeadline: "August 10, 2026",
    rounds: ["Equipment Orientation (Day 1)", "Analysis Round (Day 2, 11 AM–2 PM)", "Results & Awards (Day 2)"],
    domain: "Characterization",
  },
  {
    id: "c5",
    title: "Green Steel Innovation",
    description: "A paper presentation and idea pitching competition focused on decarbonizing steel and metals production. Present novel approaches to green hydrogen reduction, electrolysis, or circular economy strategies.",
    eligibility: "All UG/PG/PhD students; interdisciplinary teams encouraged",
    teamSize: "1-3 members",
    prize: "Total prize pool ₹18,000",
    firstPrize: "₹9,000 + Publication Opportunity in Dept. Journal",
    secondPrize: "₹6,000 + Certificates",
    thirdPrize: "₹3,000 + Certificates",
    registrationDeadline: "July 30, 2026 (abstract); August 7, 2026 (full paper)",
    rounds: ["Abstract Submission", "Full Paper Submission", "Presentation (Day 3, 10 AM–1 PM)"],
    domain: "Sustainability",
  },
];

export const CATEGORY_COLORS: Record<Category, { bg: string; text: string; border: string }> = {
  competition: { bg: "bg-[rgba(255,107,0,0.15)]",  text: "text-[#FF6B00]",  border: "border-[rgba(255,107,0,0.4)]"  },
  workshop:    { bg: "bg-[rgba(255,184,0,0.12)]",  text: "text-[#FFB800]",  border: "border-[rgba(255,184,0,0.35)]" },
  talk:        { bg: "bg-[rgba(232,220,200,0.1)]", text: "text-[#E8DCC8]",  border: "border-[rgba(232,220,200,0.3)]"},
  ceremony:    { bg: "bg-[rgba(255,154,0,0.15)]",  text: "text-[#FF9A00]",  border: "border-[rgba(255,154,0,0.4)]"  },
  cultural:    { bg: "bg-[rgba(200,184,152,0.12)]",text: "text-[#C8B898]",  border: "border-[rgba(200,184,152,0.3)]"},
};
