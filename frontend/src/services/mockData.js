/**
 * High-quality offline / cross-PC mock dataset.
 * Guarantees that any PC or browser can log in as Admin and run the entire
 * SmartDriving platform even when no local database or backend is running.
 */

export const mockAdminUser = {
  id: 1,
  name: 'Sarah Mitchell (Administrator)',
  email: 'admin@smartdriving.com.au',
  phone: '1300 138 626',
  role: 'admin',
  is_admin: true,
  customer_profile: null,
};

export const mockCustomerUser = {
  id: 2,
  name: 'Oliver Taylor',
  email: 'learner@smartdriving.com.au',
  phone: '+61 423 456 789',
  role: 'customer',
  is_admin: false,
  customer_profile: {
    licence_type: 'learner',
    suburb: 'Adelaide',
    postcode: '5000',
  },
};

export const mockServices = [
  { id: 1, name: 'VORT Driving Test', default_price: '240.00', duration_minutes: 90, description: 'Official South Australia Vehicle On Road Test' },
  { id: 2, name: 'PreVORT Warmup + VORT Test Bundle', default_price: '340.00', duration_minutes: 150, description: '1-hr warm-up lesson followed immediately by the official VORT test' },
  { id: 3, name: 'Standard Driving Lesson (60 Mins)', default_price: '85.00', duration_minutes: 60, description: 'Single 1-hour personalized driving lesson' },
  { id: 4, name: 'Double Driving Lesson (120 Mins)', default_price: '160.00', duration_minutes: 120, description: 'Intensive 2-hour dual-session for rapid skill progression' },
  { id: 5, name: 'First Lesson & Skill Assessment ($99 Special)', default_price: '99.00', duration_minutes: 90, description: 'Comprehensive introductory lesson & official VORT readiness assessment' },
];

export const mockLocations = [
  { id: 1, name: 'Adelaide CBD', postcode: '5000', state: 'SA', is_test_centre: 0 },
  { id: 2, name: 'Thebarton Hub & Test Centre', postcode: '5031', state: 'SA', is_test_centre: 1, test_centre_name: 'Thebarton DIT Testing Hub' },
  { id: 3, name: 'Norwood', postcode: '5067', state: 'SA', is_test_centre: 0 },
  { id: 4, name: 'Campbelltown', postcode: '5074', state: 'SA', is_test_centre: 0 },
  { id: 5, name: 'Port Adelaide Test Centre', postcode: '5015', state: 'SA', is_test_centre: 1, test_centre_name: 'Port Adelaide Maritime DIT Hub' },
  { id: 6, name: 'Glenelg', postcode: '5045', state: 'SA', is_test_centre: 0 },
  { id: 7, name: 'Prospect', postcode: '5082', state: 'SA', is_test_centre: 0 },
  { id: 8, name: 'Golden Grove', postcode: '5125', state: 'SA', is_test_centre: 0 },
  { id: 9, name: 'Marion Regional Centre', postcode: '5043', state: 'SA', is_test_centre: 1, test_centre_name: 'Marion DIT Centre' },
  { id: 10, name: 'Mawson Lakes', postcode: '5095', state: 'SA', is_test_centre: 0 },
];

export const mockPackages = [
  {
    id: 1,
    name: 'Kickstarter 5-Hour Package',
    slug: 'kickstarter-5h',
    current_price: '399.00',
    original_price: '425.00',
    lesson_count: 5,
    lesson_hours: '5.00',
    short_description: 'Ideal foundation pack for beginners mastering car control & Adelaide roads.',
    is_featured: 0,
    includes_vort: 0,
  },
  {
    id: 2,
    name: 'Confidence Builder 10-Hour Package',
    slug: 'confidence-builder-10h',
    current_price: '760.00',
    original_price: '850.00',
    lesson_count: 10,
    lesson_hours: '10.00',
    short_description: 'Most popular pack covering all 5 VORT slow-speed manoeuvres and highway merges.',
    is_featured: 1,
    includes_vort: 0,
  },
  {
    id: 3,
    name: 'VORT Complete Pass Bundle',
    slug: 'vort-complete-pass-bundle',
    current_price: '590.00',
    original_price: '665.00',
    lesson_count: 6,
    lesson_hours: '6.00',
    short_description: 'Includes 5 training lessons + 1-hour pre-VORT warmup + official VORT test.',
    is_featured: 1,
    includes_vort: 1,
  },
  {
    id: 4,
    name: 'Comprehensive 20-Hour Mastery',
    slug: 'mastery-20h',
    current_price: '1480.00',
    original_price: '1700.00',
    lesson_count: 20,
    lesson_hours: '20.00',
    short_description: 'Zero to Solo complete driving education for nervous or international conversion drivers.',
    is_featured: 0,
    includes_vort: 1,
  },
];

export const mockInstructors = [
  {
    id: 1,
    name: 'Marcus Vance',
    email: 'marcus.vance@smartdriving.com.au',
    phone: '0412 888 101',
    is_examiner: 1,
    car_transmission: 'auto',
    car_model: '2024 Toyota Corolla Hybrid (Dual Control)',
    base_hourly_rate: '85.00',
    vort_test_rate: '220.00',
    is_active: 1,
    bio: 'Accredited Senior VORT Examiner with over 14 years testing experience across Adelaide suburbs.',
  },
  {
    id: 2,
    name: 'Elena Rostova',
    email: 'elena.rostova@smartdriving.com.au',
    phone: '0412 888 102',
    is_examiner: 1,
    car_transmission: 'auto',
    car_model: '2024 Hyundai i30 N-Line (Dual Control)',
    base_hourly_rate: '85.00',
    vort_test_rate: '220.00',
    is_active: 1,
    bio: 'Patient female instructor specializing in first-time nervous learners and overseas licence conversions.',
  },
  {
    id: 3,
    name: 'David Chen',
    email: 'david.chen@smartdriving.com.au',
    phone: '0412 888 103',
    is_examiner: 1,
    car_transmission: 'auto',
    car_model: '2023 Mazda 3 Astina (Dual Control)',
    base_hourly_rate: '85.00',
    vort_test_rate: '220.00',
    is_active: 1,
    bio: 'Fluent in English and Mandarin. High first-time pass rate for VORT tests in Port Adelaide and Thebarton.',
  },
  {
    id: 4,
    name: 'Liam O\'Connor',
    email: 'liam.oconnor@smartdriving.com.au',
    phone: '0412 888 104',
    is_examiner: 0,
    car_transmission: 'both',
    car_model: '2023 Volkswagen Golf Dual Control (Manual & Auto)',
    base_hourly_rate: '90.00',
    vort_test_rate: '230.00',
    is_active: 1,
    bio: 'Manual driving specialist. Master clutch control, hill starts, and smooth gear transitions.',
  },
];

export const mockTestimonials = [
  {
    id: 1,
    name: 'Manpreet Kaur',
    suburb: 'Clearview, SA',
    rating: 5,
    feedback: 'My instructor told me to book with his examiner but they were booked out for weeks. I found SmartDriving and booked my VORT test for 5 days later. Passed first go!',
    test_type: 'VORT Test Passed (First Attempt)',
    instructor_name: 'Marcus Vance',
  },
  {
    id: 2,
    name: 'Gajel Patel',
    suburb: 'Kilkenny, SA',
    rating: 5,
    feedback: 'I was looking around to book a test directly and most schools I called didn’t have someone who spoke Hindi. Satish was really easy to book with and passed smoothly.',
    test_type: 'VORT Test Passed',
    instructor_name: 'David Chen',
  },
  {
    id: 3,
    name: 'Priyanka Sharma',
    suburb: 'Adelaide CBD',
    rating: 5,
    feedback: 'I was looking for a female examiner but I called around and couldn\'t find anyone for a month. On SmartDriving, I found a slot for the following weekend and passed!',
    test_type: 'P1 Licence Achieved',
    instructor_name: 'Elena Rostova',
  },
  {
    id: 4,
    name: 'Leon Henderson',
    suburb: 'Henley Beach, SA',
    rating: 5,
    feedback: 'Got quotes from schools around me quoting $450+. Had a look on SmartDriving, compared prices, and got the warm-up + test bundle for $340. Top service!',
    test_type: 'Warmup + VORT Test Passed',
    instructor_name: 'Marcus Vance',
  },
];

export const mockFaqs = [
  {
    id: 1,
    category: 'vort',
    question: 'What is the Vehicle On Road Test (VORT) in South Australia?',
    answer: 'The VORT is a practical driving assessment conducted by an Authorised Examiner to determine whether you qualify for your P1 Provisional licence in SA. It tests 5 slow-speed manoeuvres followed by a comprehensive road drive.',
  },
  {
    id: 2,
    category: 'vort',
    question: 'Why should I include the PreVORT Warmup before my VORT test?',
    answer: 'A 1-hour pre-test warmup lesson right before your official test helps settle test anxiety, gives you immediate feedback on road rules and blind spots in the test area, and lets you use the instructor’s dual-control car.',
  },
  {
    id: 3,
    category: 'vort',
    question: 'Can I use my own vehicle for the VORT test?',
    answer: 'Yes, provided your vehicle is fully registered, roadworthy, clean, has working dual mirrors, and meets SA Department for Infrastructure and Transport (DIT) road test requirements.',
  },
  {
    id: 4,
    category: 'lessons',
    question: 'Do you pick me up from home, school, or work?',
    answer: 'Yes! Driving lessons include free pickup and drop-off within the instructor\'s supported Adelaide metropolitan suburbs. For official VORT tests, candidates meet at the registered testing hub.',
  },
];

export const mockDashboardStats = {
  status: 'success',
  stats: {
    total_revenue: '4,850.00',
    month_revenue: '1,280.00',
    upcoming_bookings: 8,
    total_bookings: 42,
    active_instructors: 6,
    registered_customers: 34,
    pending_enquiries: 2,
  },
  recent_bookings: [
    {
      id: 101,
      booking_reference: 'BK-2026-7891',
      customer: { name: 'Oliver Taylor', email: 'oliver.taylor@example.com' },
      instructor: { name: 'David Chen' },
      service_type: { name: 'First Lesson & Skill Assessment ($99 Special)' },
      booking_status: 'confirmed',
    },
    {
      id: 102,
      booking_reference: 'BK-2026-7892',
      customer: { name: 'Priyanka Sharma', email: 'priyanka@example.com' },
      instructor: { name: 'Elena Rostova' },
      service_type: { name: 'Pre-VORT Warmup + Official Test Package' },
      booking_status: 'confirmed',
    },
    {
      id: 103,
      booking_reference: 'BK-2026-7893',
      customer: { name: 'Liam Chen', email: 'liam.chen@example.com' },
      instructor: { name: 'Marcus Vance' },
      service_type: { name: '5-Lesson Confidence Booster Pack' },
      booking_status: 'pending',
    },
  ],
  recent_logs: [
    {
      id: 1,
      action: 'booking_created',
      entity_type: 'Booking',
      entity_id: 103,
      user: { name: 'Oliver Taylor' },
      created_at: new Date().toISOString(),
    },
    {
      id: 2,
      action: 'payment_received',
      entity_type: 'Payment',
      entity_id: 88,
      user: { name: 'System / Stripe' },
      created_at: new Date(Date.now() - 3600000).toISOString(),
    },
  ],
};

export const mockBookings = [
  {
    id: 101,
    booking_reference: 'BK-2026-7891',
    customer: { name: 'Oliver Taylor', email: 'oliver.taylor@example.com', phone: '0412 345 678' },
    instructor: { name: 'David Chen' },
    service_type: { name: 'First Lesson & Skill Assessment ($99 Special)' },
    booking_status: 'confirmed',
    start_time: '2026-11-15 10:00:00',
    total_price: '99.00',
  },
  {
    id: 102,
    booking_reference: 'BK-2026-7892',
    customer: { name: 'Priyanka Sharma', email: 'priyanka@example.com', phone: '0423 456 789' },
    instructor: { name: 'Elena Rostova' },
    service_type: { name: 'Pre-VORT Warmup + Official Test Package' },
    booking_status: 'confirmed',
    start_time: '2026-11-16 13:30:00',
    total_price: '340.00',
  },
  {
    id: 103,
    booking_reference: 'BK-2026-7893',
    customer: { name: 'Liam Chen', email: 'liam.chen@example.com', phone: '0434 567 890' },
    instructor: { name: 'Marcus Vance' },
    service_type: { name: '5-Lesson Confidence Booster Pack' },
    booking_status: 'pending',
    start_time: '2026-11-18 09:00:00',
    total_price: '399.00',
  },
];

export const mockCustomers = [
  {
    id: 1,
    name: 'Oliver Taylor',
    email: 'learner@smartdriving.com.au',
    phone: '0412 345 678',
    is_active: 1,
    customer_profile: { licence_type: 'learner', suburb: 'Adelaide', postcode: '5000' },
    bookings_count: 3,
  },
  {
    id: 2,
    name: 'Priyanka Sharma',
    email: 'priyanka@example.com',
    phone: '0423 456 789',
    is_active: 1,
    customer_profile: { licence_type: 'provisional_1', suburb: 'Thebarton', postcode: '5031' },
    bookings_count: 1,
  },
  {
    id: 3,
    name: 'Charlotte Davis',
    email: 'charlotte.davis@example.com',
    phone: '0434 567 890',
    is_active: 1,
    customer_profile: { licence_type: 'learner', suburb: 'Glenelg', postcode: '5045' },
    bookings_count: 2,
  },
];

export const mockSettings = [
  { id: 1, key: 'company_name', value: 'MB & HB GROUP PTY LTD trading as A1 Smart Driving', description: 'Business Legal Name' },
  { id: 2, key: 'company_abn', value: '92 662 509 720', description: 'Australian Business Number (ABN)' },
  { id: 3, key: 'contact_email', value: 'enquiries@a1smartdriving.com.au', description: 'Platform Support Email' },
  { id: 4, key: 'contact_phone', value: '0430 580 111', description: 'Support Hotline' },
  { id: 5, key: 'business_location', value: 'Adelaide, South Australia', description: 'Operating Location' },
  { id: 6, key: 'first_lesson_promo_price', value: '99', description: 'Special First Lesson Price ($ AUD)' },
];

