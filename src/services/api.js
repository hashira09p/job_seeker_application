class ApiService {
    constructor() {
        this.token = localStorage.getItem('token');
    }

    setToken(token) {
        this.token = token;
        localStorage.setItem('token', token);
    }

    removeToken() {
        this.token = null;
        localStorage.removeItem('token');
    }

    async delay(ms = 500) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async login(email, password) {
        await this.delay();
        if (email && password) {
            const mockToken = 'mock-jwt-token-' + Date.now();
            this.setToken(mockToken);
            
            const adminNames = [
                'Joshua Dee Tulali',
                'Aerean Nicole Flores', 
                'Ryan Cunnanan',
                'Seth Ongotan'
            ];
            const randomName = adminNames[Math.floor(Math.random() * adminNames.length)];
            
            return {
                success: true,
                token: mockToken,
                user: {
                    id: 1,
                    email: email,
                    name: randomName,
                    role: 'admin'
                }
            };
        }
        throw new Error('Invalid credentials');
    }

    async register(userData) {
        await this.delay();
       
        return {
            success: true,
            message: 'Registration successful',
            user: {
                id: Date.now(),
                name: userData.name || 'Joshua Dee Tulali', // Default to one of the specified names
                email: userData.email,
                role: 'user'
            }
        };
    }

  
    async getJobs(params = {}) {
        await this.delay();
       
        const mockJobs = [
            {
                id: 1,
                title: 'Software Engineer',
                company_name: 'Globe Telecom',
                location: 'Taguig City, Metro Manila',
                salary_min: 65000,
                salary_max: 85000,
                job_type: 'Full-time',
                description: 'Join Globe Telecom as a Software Engineer and work on cutting-edge telecommunications solutions. You will be responsible for developing and maintaining software systems that serve millions of Filipino customers.',
                requirements: ['Java', 'Spring Boot', 'Microservices', 'AWS', 'Agile'],
                posted_date: '2025-01-15',
                is_urgent: false,
                is_remote: true
            },
            {
                id: 2,
                title: 'Customer Service Representative',
                company_name: 'BPO Solutions Inc.',
                location: 'Cebu City, Cebu',
                salary_min: 25000,
                salary_max: 35000,
                job_type: 'Full-time',
                description: 'Provide excellent customer service to international clients. Handle inquiries, resolve issues, and ensure customer satisfaction in a fast-paced BPO environment.',
                requirements: ['English Communication', 'Customer Service', 'Computer Skills', 'Night Shift Ready'],
                posted_date: '2025-01-14',
                is_urgent: true,
                is_remote: false
            },
            {
                id: 3,
                title: 'Marketing Specialist',
                company_name: 'Jollibee Foods Corporation',
                location: 'Quezon City, Metro Manila',
                salary_min: 35000,
                salary_max: 50000,
                job_type: 'Full-time',
                description: 'Drive marketing campaigns for the Philippines\' favorite fast-food chain. Create engaging content, manage social media, and develop strategies to reach Filipino families nationwide.',
                requirements: ['Digital Marketing', 'Social Media Management', 'Content Creation', 'Analytics'],
                posted_date: '2025-01-13',
                is_urgent: false,
                is_remote: false
            },
            {
                id: 4,
                title: 'Nurse',
                company_name: 'St. Luke\'s Medical Center',
                location: 'Taguig City, Metro Manila',
                salary_min: 30000,
                salary_max: 45000,
                job_type: 'Full-time',
                description: 'Provide compassionate patient care at one of the Philippines\' leading medical centers. Work with a team of healthcare professionals to deliver world-class medical services.',
                requirements: ['BSN Degree', 'PRC License', 'BLS Certification', '2+ Years Experience'],
                posted_date: '2025-01-12',
                is_urgent: true,
                is_remote: false
            },
            {
                id: 5,
                title: 'Accountant',
                company_name: 'SM Investments Corporation',
                location: 'Pasay City, Metro Manila',
                salary_min: 40000,
                salary_max: 55000,
                job_type: 'Full-time',
                description: 'Join the finance team of one of the Philippines\' largest conglomerates. Handle financial reporting, tax compliance, and support business operations across various industries.',
                requirements: ['CPA License', 'SAP Knowledge', 'Excel Advanced', '3+ Years Experience'],
                posted_date: '2025-01-11',
                is_urgent: false,
                is_remote: true
            },
            {
                id: 6,
                title: 'Teacher - Mathematics',
                company_name: 'Ateneo de Manila University',
                location: 'Quezon City, Metro Manila',
                salary_min: 45000,
                salary_max: 60000,
                job_type: 'Part-time',
                description: 'Educate the next generation of Filipino leaders in mathematics. Develop curriculum, conduct research, and mentor students at one of the country\'s premier universities.',
                requirements: ['Master\'s Degree in Math', 'Teaching Experience', 'Research Background', 'Passion for Education'],
                posted_date: '2025-01-10',
                is_urgent: false,
                is_remote: false
            }
        ];
        return { 
            jobs: mockJobs, 
            total: mockJobs.length,
            pagination: {
                total_jobs: mockJobs.length,
                current_page: 1,
                total_pages: 1,
                per_page: 20
            }
        };
    }

    async getJob(id) {
        await this.delay();
        const mockJob = {
            id: parseInt(id),
            title: 'Software Engineer',
            company_name: 'Globe Telecom',
            location: 'Taguig City, Metro Manila',
            salary_min: 65000,
            salary_max: 85000,
            job_type: 'Full-time',
            description: 'Join Globe Telecom as a Software Engineer and work on cutting-edge telecommunications solutions. You will be responsible for developing and maintaining software systems that serve millions of Filipino customers across the archipelago.',
            requirements: ['Java', 'Spring Boot', 'Microservices', 'AWS', 'Agile', 'Git', 'Docker'],
            responsibilities: [
                'Develop and maintain telecommunications software systems',
                'Implement microservices architecture for scalable solutions',
                'Collaborate with cross-functional teams including network engineers',
                'Ensure system reliability and performance for millions of users',
                'Participate in agile development processes'
            ],
            benefits: [
                'HMO coverage for employee and dependents',
                '13th month pay and performance bonuses',
                'Flexible working arrangements',
                'Professional development opportunities',
                'Transportation allowance',
                'Meal allowance'
            ],
            posted_date: '2025-01-15',
            is_urgent: false,
            is_remote: true
        };
        return mockJob;
    }

   
    async getCompanies(params = {}) {
        await this.delay();
        const mockCompanies = [
            {
                id: 1,
                name: 'Globe Telecom',
                industry: 'Telecommunications',
                size: '10,000+ employees',
                location: 'Taguig City, Metro Manila',
                description: 'Leading telecommunications company in the Philippines, providing mobile, broadband, and digital services to millions of Filipinos nationwide.',
                logo: '/api/placeholder/100/100'
            },
            {
                id: 2,
                name: 'Jollibee Foods Corporation',
                industry: 'Food & Beverage',
                size: '5,000+ employees',
                location: 'Quezon City, Metro Manila',
                description: 'The Philippines\' largest fast-food chain, serving Filipino families with delicious meals and creating joyful experiences across the country.',
                logo: '/api/placeholder/100/100'
            },
            {
                id: 3,
                name: 'SM Investments Corporation',
                industry: 'Retail & Real Estate',
                size: '15,000+ employees',
                location: 'Pasay City, Metro Manila',
                description: 'One of the Philippines\' largest conglomerates, operating shopping malls, retail stores, and real estate developments across the archipelago.',
                logo: '/api/placeholder/100/100'
            },
            {
                id: 4,
                name: 'BPO Solutions Inc.',
                industry: 'Business Process Outsourcing',
                size: '2,000+ employees',
                location: 'Cebu City, Cebu',
                description: 'Leading BPO company providing customer service, technical support, and back-office solutions to international clients.',
                logo: '/api/placeholder/100/100'
            },
            {
                id: 5,
                name: 'St. Luke\'s Medical Center',
                industry: 'Healthcare',
                size: '3,000+ employees',
                location: 'Taguig City, Metro Manila',
                description: 'Premier medical center in the Philippines, providing world-class healthcare services and medical excellence to Filipino families.',
                logo: '/api/placeholder/100/100'
            },
            {
                id: 6,
                name: 'Ateneo de Manila University',
                industry: 'Education',
                size: '1,500+ employees',
                location: 'Quezon City, Metro Manila',
                description: 'Leading private university in the Philippines, committed to academic excellence and forming leaders for the nation.',
                logo: '/api/placeholder/100/100'
            }
        ];
        return { companies: mockCompanies, total: mockCompanies.length };
    }

   
    async applyForJob(jobId, applicationData) {
        await this.delay();
       
        return {
            success: true,
            message: 'Application submitted successfully',
            application_id: Date.now()
        };
    }

    
    async getJobFairs() {
        await this.delay();
        const mockJobFairs = [
            {
                id: 1,
                name: 'Philippine Tech Career Fair 2025',
                date: '2025-02-15',
                location: 'SMX Convention Center, Pasay City',
                description: 'Join the biggest technology career fair in the Philippines. Connect with leading tech companies, startups, and BPO firms looking for talented Filipino professionals.',
                companies: ['Globe Telecom', 'BPO Solutions Inc.', 'SM Investments Corporation']
            },
            {
                id: 2,
                name: 'Healthcare & Education Job Fair',
                date: '2025-03-20',
                location: 'World Trade Center, Pasay City',
                description: 'Explore career opportunities in healthcare and education sectors. Meet with hospitals, schools, and educational institutions across the Philippines.',
                companies: ['St. Luke\'s Medical Center', 'Ateneo de Manila University', 'Jollibee Foods Corporation']
            },
            {
                id: 3,
                name: 'Cebu Business Process Outsourcing Expo',
                date: '2025-04-10',
                location: 'Cebu Business Park, Cebu City',
                description: 'Discover exciting BPO career opportunities in the Queen City of the South. Connect with top outsourcing companies and explore various roles.',
                companies: ['BPO Solutions Inc.', 'Globe Telecom', 'SM Investments Corporation']
            }
        ];
        return { job_fairs: mockJobFairs };
    }
}

export default new ApiService();
