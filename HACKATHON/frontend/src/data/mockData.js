// =============================================================================
// Campus Complaint Management System - Central Mock Data Store
// Multi-College Support (5 Selected Institutions), Indian Locations & IST Timestamps
// =============================================================================

export const SYSTEM_INFO = {
  systemName: 'Campus Complaint Management System',
  tagline: 'Smart Infrastructure & Facilities Resolution Portal',
  supportEmail: 'support@campuscomplaint.edu.in'
};

// Supported 5 Colleges
export const COLLEGES = [
  { 
    id: 'klh-university', 
    name: 'KLH University (K L Deemed to be University)', 
    shortName: 'KLH University', 
    code: 'KLH', 
    city: 'Hyderabad, Telangana',
    banner: 'Deemed to be University • Hyderabad'
  },
  { 
    id: 'iit-delhi', 
    name: 'Indian Institute of Technology (IIT) Delhi', 
    shortName: 'IIT Delhi', 
    code: 'IITD', 
    city: 'Hauz Khas, New Delhi',
    banner: 'Institute of Eminence • New Delhi'
  },
  { 
    id: 'nit-warangal', 
    name: 'National Institute of Technology (NIT) Warangal', 
    shortName: 'NIT Warangal', 
    code: 'NITW', 
    city: 'Warangal, Telangana',
    banner: 'National Importance • Warangal'
  },
  { 
    id: 'dtu', 
    name: 'Delhi Technological University (DTU)', 
    shortName: 'DTU', 
    code: 'DTU', 
    city: 'Rohini, New Delhi',
    banner: 'State Technological University • Delhi'
  },
  { 
    id: 'vit-vellore', 
    name: 'Vellore Institute of Technology (VIT)', 
    shortName: 'VIT Vellore', 
    code: 'VIT', 
    city: 'Vellore, Tamil Nadu',
    banner: 'Deemed University • Vellore'
  }
];

export const DEPARTMENTS = [
  { id: 1, name: 'Electrical & Power Infrastructure', code: 'ELEC', head: 'Er. Sandeep Joshi', phone: '+91 98765 43210', email: 'elec.maint@campus.edu.in' },
  { id: 2, name: 'Campus IT & High-Speed Network', code: 'NETW', head: 'Prof. R. Venkataraman', phone: '+91 98765 43211', email: 'it.support@campus.edu.in' },
  { id: 3, name: 'Water Supply & Public Health (PHE)', code: 'PLUM', head: 'Mr. Kailash Mehra', phone: '+91 98765 43212', email: 'water.works@campus.edu.in' },
  { id: 4, name: 'Campus Hostel Administration', code: 'HOST', head: 'Dr. Anita Desai', phone: '+91 98765 43213', email: 'hostels@campus.edu.in' },
  { id: 5, name: 'Campus Housekeeping & Sanitation', code: 'CLEAN', head: 'Mrs. Geeta Patel', phone: '+91 98765 43214', email: 'sanitation@campus.edu.in' },
  { id: 6, name: 'Civil Maintenance & Carpentry', code: 'FURN', head: 'Mr. Manoj Sharma', phone: '+91 98765 43215', email: 'estate.civil@campus.edu.in' },
  { id: 7, name: 'Campus Safety & Physical Security', code: 'SEC', head: 'Col. Devendra Singh', phone: '+91 98765 43216', email: 'security@campus.edu.in' },
];

export const CATEGORIES = [
  { id: 1, name: 'Electrical', departmentId: 1, slaHours: 4, icon: 'Zap', description: 'Power outage, sparks, switchboard, ceiling fans, AC failure, MCB trip' },
  { id: 2, name: 'Internet/Network', departmentId: 2, slaHours: 3, icon: 'Wifi', description: 'Campus Wi-Fi, LAN ethernet ports, LMS portal access, slow bandwidth' },
  { id: 3, name: 'Plumbing', departmentId: 3, slaHours: 6, icon: 'Droplets', description: 'Pipeline leakage, tap overflow, flush cistern, low pressure, water cooler' },
  { id: 4, name: 'Hostel', departmentId: 4, slaHours: 12, icon: 'Home', description: 'Hostel room amenities, hot water geyser, mess hygiene, mosquito screens' },
  { id: 5, name: 'Cleanliness', departmentId: 5, slaHours: 4, icon: 'Sparkles', description: 'Washroom sanitation, corridor swept, classroom dustbins, garbage clearance' },
  { id: 6, name: 'Furniture', departmentId: 6, slaHours: 24, icon: 'Armchair', description: 'Classroom benches, lecture chairs, whiteboards, podiums, door locks' },
  { id: 7, name: 'Security', departmentId: 7, slaHours: 1, icon: 'ShieldAlert', description: 'Emergency fire exit, CCTV failure, perimeter illumination, gate security' },
];

// Seed Users for Authentication: Exactly 2 Students, 2 Faculty, 1 Admin, 2 Staff
export const SEED_USERS = [
  // --- 2 Student Accounts ---
  {
    id: 101,
    name: 'Aarav Sharma',
    role: 'STUDENT',
    roleLabel: 'Student (3rd Year, CSE)',
    email: 'aarav.sharma@campus.edu.in',
    password: 'Password@123',
    idNumber: '2023-CS-10142',
    department: 'Computer Science & Engineering',
    collegeId: 'klh-university',
    avatar: 'AS'
  },
  {
    id: 102,
    name: 'Priya Patel',
    role: 'STUDENT',
    roleLabel: 'Student (2nd Year, ECE)',
    email: 'priya.patel@campus.edu.in',
    password: 'Password@123',
    idNumber: '2024-EC-20411',
    department: 'Electronics & Communication Engg',
    collegeId: 'klh-university',
    avatar: 'PP'
  },

  // --- 2 Faculty Accounts ---
  {
    id: 103,
    name: 'Prof. K. Raghavan',
    role: 'FACULTY',
    roleLabel: 'Professor & Head of Department',
    email: 'prof.raghavan@campus.edu.in',
    password: 'Password@123',
    idNumber: 'FAC-CSE-001',
    department: 'Computer Science & Engineering',
    collegeId: 'klh-university',
    avatar: 'KR'
  },
  {
    id: 104,
    name: 'Dr. Meenakshi Sundaram',
    role: 'FACULTY',
    roleLabel: 'Associate Professor',
    email: 'dr.meenakshi@campus.edu.in',
    password: 'Password@123',
    idNumber: 'FAC-ECE-014',
    department: 'Electronics & Communication Engg',
    collegeId: 'klh-university',
    avatar: 'MS'
  },

  // --- Administrator Account ---
  {
    id: 201,
    name: 'Dr. Sunita Rao',
    role: 'ADMIN',
    roleLabel: 'Dean of Campus Infrastructure & Estate',
    email: 'admin@campus.edu.in',
    password: 'Admin@123',
    idNumber: 'ADM-CENTRAL-01',
    department: 'Central Estate Administration',
    collegeId: 'klh-university',
    avatar: 'SR'
  },

  // --- Maintenance Staff Accounts ---
  {
    id: 301,
    name: 'Rajesh Kumar',
    role: 'STAFF',
    roleLabel: 'Senior Electrical Technician',
    email: 'rajesh.kumar@campus.edu.in',
    password: 'Staff@123',
    idNumber: 'TECH-ELEC-4102',
    department: 'Electrical Maintenance',
    collegeId: 'klh-university',
    avatar: 'RK'
  },
  {
    id: 302,
    name: 'Amit Verma',
    role: 'STAFF',
    roleLabel: 'Network Systems Engineer',
    email: 'amit.verma@campus.edu.in',
    password: 'Staff@123',
    idNumber: 'TECH-NETW-4103',
    department: 'Campus IT & High-Speed Network',
    collegeId: 'klh-university',
    avatar: 'AV'
  }
];

export const STAFF_MEMBERS = [
  { id: 301, name: 'Rajesh Kumar', departmentId: 1, role: 'Senior Electrician', activeTasks: 2, phone: '+91 94123 45671', email: 'rajesh.kumar@campus.edu.in' },
  { id: 302, name: 'Amit Verma', departmentId: 2, role: 'Network Systems Engineer', activeTasks: 1, phone: '+91 94123 45672', email: 'amit.verma@campus.edu.in' },
  { id: 303, name: 'Ramesh Yadav', departmentId: 3, role: 'Head Plumber', activeTasks: 2, phone: '+91 94123 45673', email: 'ramesh.yadav@campus.edu.in' },
  { id: 304, name: 'Surendra Pal', departmentId: 4, role: 'Hostel Resident Officer', activeTasks: 1, phone: '+91 94123 45674', email: 'surendra.pal@campus.edu.in' },
  { id: 305, name: 'Sunil Shinde', departmentId: 5, role: 'Sanitation Inspector', activeTasks: 0, phone: '+91 94123 45675', email: 'sunil.shinde@campus.edu.in' },
  { id: 306, name: 'Vikas Gupta', departmentId: 6, role: 'Estate Carpenter', activeTasks: 1, phone: '+91 94123 45676', email: 'vikas.gupta@campus.edu.in' }
];

// Initial complaints distributed across the 2 students and 2 faculty
export const INITIAL_COMPLAINTS = [
  // Complaint 1 - Filed by Aarav Sharma (Student 1) - IN PROGRESS
  {
    id: 1,
    collegeId: 'klh-university',
    trackingNumber: 'CCMS-2026-0819',
    title: 'Severe short circuit and sparks from main distribution box in R&D IoT Lab 302',
    description: 'During the afternoon practical lab session, intense sparks and pungent burnt plastic smell started coming from the main 3-phase switchboard. The primary MCB tripped. Students evacuated immediately.',
    category: 'Electrical',
    categoryId: 1,
    location: 'R&D Academic Complex, Level 3, Room 302 (IoT & Robotics Lab)',
    priority: 'CRITICAL',
    aiSuggestedPriority: 'CRITICAL',
    aiConfidenceScore: 0.96,
    aiHazardKeywords: ['short circuit', 'sparks', 'burnt plastic', 'switchboard'],
    status: 'IN_PROGRESS',
    complainantId: 101,
    complainantName: 'Aarav Sharma',
    complainantEmail: 'aarav.sharma@campus.edu.in',
    createdAt: '30 Oct 2026, 09:15 AM IST',
    updatedAt: '30 Oct 2026, 10:45 AM IST',
    assignedToId: 301,
    assignedToName: 'Rajesh Kumar',
    attachmentUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
    attachmentName: 'charred_breaker_box.jpg',
    history: [
      { id: 1, timestamp: '30 Oct 2026, 09:15 AM IST', from: null, to: 'SUBMITTED', actor: 'Aarav Sharma (Student)', remarks: 'Complaint registered online with AI urgency detection.' },
      { id: 2, timestamp: '30 Oct 2026, 09:30 AM IST', from: 'SUBMITTED', to: 'ASSIGNED', actor: 'Dr. Sunita Rao (Dean Infra)', remarks: 'Urgent priority dispatch to Rajesh Kumar (Senior Electrician).' },
      { id: 3, timestamp: '30 Oct 2026, 10:45 AM IST', from: 'ASSIGNED', to: 'IN_PROGRESS', actor: 'Rajesh Kumar (Senior Electrician)', remarks: 'Reached site with replacement 32A MCB, copper wiring harness, and multimeter. Isolated main feed.' }
    ]
  },

  // Complaint 2 - Filed by Aarav Sharma (Student 1) - RESOLVED (ready for student feedback/reopen!)
  {
    id: 2,
    collegeId: 'klh-university',
    trackingNumber: 'CCMS-2026-0815',
    title: 'Broken drafting table and sharp steel edge in Mechanical CAD Lab 202',
    description: 'Bench #14 in CAD Lab 202 had a fractured wooden surface with exposed steel rivets. Repaired by estate carpenter.',
    category: 'Furniture',
    categoryId: 6,
    location: 'Mechanical Engineering Block, 2nd Floor, CAD Lab 202',
    priority: 'MEDIUM',
    aiSuggestedPriority: 'MEDIUM',
    aiConfidenceScore: 0.89,
    aiHazardKeywords: ['broken desk', 'sharp steel edge'],
    status: 'RESOLVED',
    complainantId: 101,
    complainantName: 'Aarav Sharma',
    complainantEmail: 'aarav.sharma@campus.edu.in',
    createdAt: '29 Oct 2026, 10:00 AM IST',
    updatedAt: '29 Oct 2026, 04:30 PM IST',
    assignedToId: 306,
    assignedToName: 'Vikas Gupta',
    resolutionRemarks: 'Replaced damaged top board with pre-laminated panel and sanded all metal edges. Firmly bolted to floor.',
    attachmentUrl: null,
    attachmentName: null,
    feedback: null,
    history: [
      { id: 1, timestamp: '29 Oct 2026, 10:00 AM IST', from: null, to: 'SUBMITTED', actor: 'Aarav Sharma (Student)', remarks: 'Logged complaint.' },
      { id: 2, timestamp: '29 Oct 2026, 11:15 AM IST', from: 'SUBMITTED', to: 'ASSIGNED', actor: 'Dr. Sunita Rao (Admin)', remarks: 'Assigned to Vikas Gupta (Estate Carpenter).' },
      { id: 3, timestamp: '29 Oct 2026, 02:00 PM IST', from: 'ASSIGNED', to: 'IN_PROGRESS', actor: 'Vikas Gupta (Staff)', remarks: 'Fetched replacement wood panel from Central Workshop.' },
      { id: 4, timestamp: '29 Oct 2026, 04:30 PM IST', from: 'IN_PROGRESS', to: 'RESOLVED', actor: 'Vikas Gupta (Staff)', remarks: 'Repaired and polished bench #14. Ready for complainant confirmation.' }
    ]
  },

  // Complaint 3 - Filed by Priya Patel (Student 2) - ASSIGNED
  {
    id: 3,
    collegeId: 'klh-university',
    trackingNumber: 'CCMS-2026-0820',
    title: 'High-Density Wi-Fi Access Point offline in Central Library 2nd Floor',
    description: 'The Cisco access point on the second-floor reference reading hall is showing an amber LED error code and devices cannot connect to the campus Wi-Fi network. Students preparing for semester examinations are facing difficulties.',
    category: 'Internet/Network',
    categoryId: 2,
    location: 'Central University Library & Knowledge Centre, 2nd Floor Reference Hall',
    priority: 'HIGH',
    aiSuggestedPriority: 'HIGH',
    aiConfidenceScore: 0.92,
    aiHazardKeywords: ['wifi', 'access point', 'network', 'offline'],
    status: 'ASSIGNED',
    complainantId: 102,
    complainantName: 'Priya Patel',
    complainantEmail: 'priya.patel@campus.edu.in',
    createdAt: '30 Oct 2026, 11:00 AM IST',
    updatedAt: '30 Oct 2026, 11:20 AM IST',
    assignedToId: 302,
    assignedToName: 'Amit Verma',
    attachmentUrl: null,
    attachmentName: null,
    history: [
      { id: 1, timestamp: '30 Oct 2026, 11:00 AM IST', from: null, to: 'SUBMITTED', actor: 'Priya Patel (Student)', remarks: 'Complaint registered.' },
      { id: 2, timestamp: '30 Oct 2026, 11:20 AM IST', from: 'SUBMITTED', to: 'ASSIGNED', actor: 'Dr. Sunita Rao (Dean Infra)', remarks: 'Dispatched to Amit Verma (Network Systems Engineer).' }
    ]
  },

  // Complaint 4 - Filed by Prof. K. Raghavan (Faculty 1) - IN PROGRESS
  {
    id: 4,
    collegeId: 'klh-university',
    trackingNumber: 'CCMS-2026-0810',
    title: 'Ceiling projector lamp flicker and HDMI matrix failure in Seminar Hall 101',
    description: 'During departmental guest lecture, the primary Epson high-lumen ceiling projector started intermittent blackouts. The wall-mounted HDMI transmitter switch is overheated.',
    category: 'Electrical',
    categoryId: 1,
    location: 'Department of Computer Science & Engineering, Ground Floor, Seminar Hall 101',
    priority: 'HIGH',
    aiSuggestedPriority: 'HIGH',
    aiConfidenceScore: 0.91,
    aiHazardKeywords: ['projector', 'flicker', 'hdmi', 'blackout'],
    status: 'IN_PROGRESS',
    complainantId: 103,
    complainantName: 'Prof. K. Raghavan',
    complainantEmail: 'prof.raghavan@campus.edu.in',
    createdAt: '28 Oct 2026, 02:30 PM IST',
    updatedAt: '28 Oct 2026, 04:15 PM IST',
    assignedToId: 301,
    assignedToName: 'Rajesh Kumar',
    attachmentUrl: null,
    attachmentName: null,
    history: [
      { id: 1, timestamp: '28 Oct 2026, 02:30 PM IST', from: null, to: 'SUBMITTED', actor: 'Prof. K. Raghavan (Faculty)', remarks: 'Faculty complaint registered for upcoming syndicate seminar.' },
      { id: 2, timestamp: '28 Oct 2026, 03:00 PM IST', from: 'SUBMITTED', to: 'ASSIGNED', actor: 'Dr. Sunita Rao (Admin)', remarks: 'Assigned to Rajesh Kumar (Senior Electrician).' },
      { id: 3, timestamp: '28 Oct 2026, 04:15 PM IST', from: 'ASSIGNED', to: 'IN_PROGRESS', actor: 'Rajesh Kumar (Senior Electrician)', remarks: 'Testing HDMI matrix switch and lamp module.' }
    ]
  },

  // Complaint 5 - Filed by Dr. Meenakshi Sundaram (Faculty 2) - CLOSED
  {
    id: 5,
    collegeId: 'klh-university',
    trackingNumber: 'CCMS-2026-0808',
    title: 'Faulty laboratory air conditioning causing equipment temperature alarm in VLSI Lab',
    description: 'The 2-ton cassette AC unit in the VLSI and Embedded Systems laboratory stopped cooling. Room temperature restored to 21°C.',
    category: 'Electrical',
    categoryId: 1,
    location: 'ECE Department Building, 1st Floor, Room 108 (VLSI Research Lab)',
    priority: 'HIGH',
    aiSuggestedPriority: 'HIGH',
    aiConfidenceScore: 0.93,
    aiHazardKeywords: ['ac failure', 'temperature alarm', 'cooling'],
    status: 'CLOSED',
    complainantId: 104,
    complainantName: 'Dr. Meenakshi Sundaram',
    complainantEmail: 'dr.meenakshi@campus.edu.in',
    createdAt: '27 Oct 2026, 11:30 AM IST',
    updatedAt: '28 Oct 2026, 01:00 PM IST',
    assignedToId: 301,
    assignedToName: 'Rajesh Kumar',
    resolutionRemarks: 'Cleaned condenser coil and recharged refrigerant gas (R410A). Room temperature restored to 21°C.',
    feedback: {
      rating: 5,
      comments: 'Prompt response by technician. Critical FPGA test boards were safeguarded without damage.',
      submittedAt: '28 Oct 2026, 02:00 PM IST'
    },
    history: [
      { id: 1, timestamp: '27 Oct 2026, 11:30 AM IST', from: null, to: 'SUBMITTED', actor: 'Dr. Meenakshi Sundaram (Faculty)', remarks: 'Urgent lab cooling request.' },
      { id: 2, timestamp: '27 Oct 2026, 11:45 AM IST', from: 'SUBMITTED', to: 'ASSIGNED', actor: 'Dr. Sunita Rao (Admin)', remarks: 'Dispatched to Electrical.' },
      { id: 3, timestamp: '27 Oct 2026, 01:15 PM IST', from: 'ASSIGNED', to: 'IN_PROGRESS', actor: 'Rajesh Kumar (Staff)', remarks: 'Investigating compressor unit.' },
      { id: 4, timestamp: '28 Oct 2026, 01:00 PM IST', from: 'IN_PROGRESS', to: 'RESOLVED', actor: 'Rajesh Kumar (Staff)', remarks: 'Recharged gas and verified cooling.' },
      { id: 5, timestamp: '28 Oct 2026, 02:00 PM IST', from: 'RESOLVED', to: 'CLOSED', actor: 'Dr. Meenakshi Sundaram (Faculty)', remarks: 'Verified and rated 5 stars.' }
    ]
  }
];
