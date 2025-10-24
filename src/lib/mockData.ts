// Mock data matching Xano backend structure with Data Realism Protocol™
// Edge cases: long strings, special characters, international names, varied timestamps

// Mock users for different role types
export const mockUsers = {
  company_admin: {
    id: 'usr_001',
    email: 'admin@company.com',
    name: 'Sarah Johnson',
    role: 'company_admin',
    company_id: 'cmp_001',
    permissions: ['job:read', 'job:create', 'job:update', 'customer:read', 'customer:create', 'inventory:read', 'inventory:create'],
    created_at: '2024-01-15T08:30:00Z',
  },
  technician: {
    id: 'usr_002',
    email: 'tech@company.com',
    name: 'Mike Rodriguez',
    role: 'technician',
    company_id: 'cmp_001',
    permissions: ['job:read', 'job:update', 'inventory:read'],
    created_at: '2024-02-20T09:15:00Z',
  },
  system_admin: {
    id: 'usr_003',
    email: 'sysadmin@autopilot.com',
    name: 'Alex Thompson',
    role: 'system_admin',
    company_id: null,
    permissions: ['company:read', 'company:create', 'company:update', 'company:delete', 'system:manage'],
    created_at: '2023-01-01T00:00:00Z',
  }
};

// Default user for demo (Company Admin)
export const mockUser = mockUsers.company_admin;

export const mockCompanies = [
  {
    id: 'cmp_001',
    name: 'Jörg O\'Malley HVAC Services',
    phone: '+1 (555) 123-4567',
    email: 'info@jorg-hvac.com',
    address: '123 Main St, Suite 500',
    city: 'San Francisco',
    state: 'CA',
    zip: '94102',
    status: 'active',
    total_jobs: 45,
    revenue: 12450000, // $124,500.00 in cents
    created_at: '2023-06-12T10:15:00Z',
  },
  {
    id: 'cmp_002',
    name: 'Dr. Eleanor Vance Medical Equipment Co.',
    phone: '+1 (555) 987-6543',
    email: 'contact@vance-medical.com',
    address: '456 Oak Avenue, Building C 🏢',
    city: 'New York',
    state: 'NY',
    zip: '10001',
    status: 'active',
    total_jobs: 128,
    revenue: 45670000,
    created_at: '2022-03-22T14:30:00Z',
  },
  {
    id: 'cmp_003',
    name: 'Jean-Luc D\'Angelo & Associés',
    phone: '+33 1 42 86 82 00',
    email: 'contact@dangelo.fr',
    address: '789 Rue de la Paix, très très très très très très longue adresse avec beaucoup de caractères spéciaux',
    city: 'Paris',
    state: 'IDF',
    zip: '75002',
    status: 'pending',
    total_jobs: 12,
    revenue: 2340000,
    created_at: '2024-09-01T09:00:00Z',
  },
];

export const mockJobs = [
  {
    id: 'job_001',
    company_id: 'cmp_001',
    company_name: 'Jörg O\'Malley HVAC Services',
    customer_id: 'cus_001',
    customer_name: 'Sarah Johnson',
    title: 'Emergency HVAC Repair - Commercial Building',
    description: 'Central air conditioning system failure in 50,000 sq ft office building. Requires immediate attention.',
    status: 'in_progress',
    priority: 'high',
    scheduled_date: '2025-10-24T09:00:00Z',
    estimated_value: 850000,
    assigned_to: 'John Smith',
    location: '123 Business Plaza, SF, CA',
    created_at: '2025-10-23T14:30:00Z',
  },
  {
    id: 'job_002',
    company_id: 'cmp_002',
    company_name: 'Dr. Eleanor Vance Medical Equipment Co.',
    customer_id: 'cus_002',
    customer_name: 'Michael Chen',
    title: 'Routine Maintenance - MRI Machine 🔧',
    description: 'Quarterly preventive maintenance for Siemens Magnetom MRI scanner.',
    status: 'scheduled',
    priority: 'medium',
    scheduled_date: '2025-10-28T13:00:00Z',
    estimated_value: 450000,
    assigned_to: 'Emily Rodriguez',
    location: 'Mount Sinai Hospital, NY',
    created_at: '2025-10-20T10:15:00Z',
  },
  {
    id: 'job_003',
    company_id: 'cmp_001',
    company_name: 'Jörg O\'Malley HVAC Services',
    customer_id: 'cus_003',
    customer_name: 'Владимир Петров',
    title: 'New Installation - Heat Pump System with très très très très très longue description qui contient beaucoup de caractères',
    description: 'Install new energy-efficient heat pump system in 3,500 sq ft residential property. Customer has specific requirements for noise levels and energy efficiency ratings.',
    status: 'quoted',
    priority: 'low',
    scheduled_date: '2025-11-05T08:00:00Z',
    estimated_value: 1200000,
    assigned_to: 'David Kim',
    location: '456 Residential Lane, Oakland, CA',
    created_at: '2025-10-15T16:45:00Z',
  },
];

export const mockCustomers = [
  {
    id: 'cus_001',
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    phone: '+1 (555) 234-5678',
    company: 'Tech Startup Inc.',
    total_jobs: 8,
    lifetime_value: 2340000,
    last_contact: '2025-10-23T14:30:00Z',
  },
  {
    id: 'cus_002',
    name: 'Michael Chen',
    email: 'mchen@hospital.org',
    phone: '+1 (555) 345-6789',
    company: 'Mount Sinai Hospital',
    total_jobs: 15,
    lifetime_value: 5670000,
    last_contact: '2025-10-20T10:15:00Z',
  },
  {
    id: 'cus_003',
    name: 'Владимир Петров',
    email: 'vladimir.petrov@email.ru',
    phone: '+7 495 123-45-67',
    company: 'Personal Residence',
    total_jobs: 3,
    lifetime_value: 1200000,
    last_contact: '2025-10-15T16:45:00Z',
  },
];

export const mockCalls = [
  {
    id: 'call_001',
    customer_id: 'cus_001',
    customer_name: 'Sarah Johnson',
    type: 'inbound',
    status: 'completed',
    duration: 480, // seconds
    notes: 'Customer reported HVAC emergency. Created job_001.',
    created_at: '2025-10-23T14:00:00Z',
  },
  {
    id: 'call_002',
    customer_id: 'cus_002',
    customer_name: 'Michael Chen',
    type: 'outbound',
    status: 'completed',
    duration: 320,
    notes: 'Confirmed appointment for quarterly maintenance.',
    created_at: '2025-10-20T09:30:00Z',
  },
];

export const mockAppointments = [
  {
    id: 'apt_001',
    job_id: 'job_001',
    customer_name: 'Sarah Johnson',
    title: 'Emergency HVAC Repair',
    start_time: '2025-10-24T09:00:00Z',
    end_time: '2025-10-24T12:00:00Z',
    status: 'confirmed',
    technician: 'John Smith',
  },
  {
    id: 'apt_002',
    job_id: 'job_002',
    customer_name: 'Michael Chen',
    title: 'Routine Maintenance - MRI Machine',
    start_time: '2025-10-28T13:00:00Z',
    end_time: '2025-10-28T16:00:00Z',
    status: 'scheduled',
    technician: 'Emily Rodriguez',
  },
];

export const mockInventory = [
  {
    id: 'inv_001',
    part_number: 'HVAC-FILTER-001',
    name: 'Commercial Air Filter 20x25x4',
    quantity: 45,
    unit_price: 3500, // $35.00
    category: 'Filters',
    location: 'Warehouse A',
    reorder_level: 20,
  },
  {
    id: 'inv_002',
    part_number: 'MRI-COIL-PREMIUM',
    name: 'MRI Head Coil Assembly',
    quantity: 3,
    unit_price: 12500000, // $125,000.00
    category: 'Medical Equipment',
    location: 'Secure Storage',
    reorder_level: 2,
  },
];

export const mockArticles = [
  {
    id: 'art_001',
    title: 'HVAC Emergency Response Protocol',
    category: 'Procedures',
    author: 'John Smith',
    views: 234,
    comments: 12,
    last_updated: '2025-09-15T10:30:00Z',
  },
  {
    id: 'art_002',
    title: 'MRI Machine Preventive Maintenance Checklist ✓',
    category: 'Maintenance',
    author: 'Emily Rodriguez',
    views: 567,
    comments: 23,
    last_updated: '2025-08-22T14:15:00Z',
  },
];

export const mockStats = {
  total_companies: 47,
  active_jobs: 23,
  pending_appointments: 8,
  total_revenue: 4567890000, // $45,678,900.00
  monthly_revenue: 3456000, // $34,560.00
  jobs_this_month: 12,
  jobs_completed: 156,
  customer_satisfaction: 4.7,
};
