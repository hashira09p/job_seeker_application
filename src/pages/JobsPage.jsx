import {
    Search,
    MapPin,
    Briefcase,
    Filter,
    Star,
    Building2,
    Clock,
    DollarSign,
    ArrowRight,
    Mail,
    Phone,
    Users,
    Calendar,
    FileText,
    Award,
    Heart,
    Share2,
    GripHorizontal,
    Maximize2,
    Minimize2,
    ChevronUp,
    ChevronLeft,
    ChevronRight,
    Upload,
    X,
    File,
    User,
    MailIcon,
    CheckCircle,
    Check,
} from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Combobox } from "@/components/ui/combobox";
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";

function JobsPage() {
    const [jobType, setJobType] = useState("");
    const [salaryMin, setSalaryMin] = useState("");
    const [salaryMax, setSalaryMax] = useState("");
    const [industry, setIndustry] = useState("");
    const [sortBy, setSortBy] = useState("latest");
    const [allJobs, setAllJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [displayedJobs, setDisplayedJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [locationQuery, setLocationQuery] = useState("");
    const [selectedJob, setSelectedJob] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [drawerHeight, setDrawerHeight] = useState(85);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const scrollContainerRef = useRef(null);
    const searchTimeoutRef = useRef(null);
    const locationTimeoutRef = useRef(null);
    const URL = "http://localhost:3000";
    const navigate = useNavigate();
    const token = localStorage.getItem("token")

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [jobsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    // Application state
    const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false);
    const [applicationForm, setApplicationForm] = useState({
        fullName: "",
        email: "",
        phone: "",
        coverLetter: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Resume selection state
    const [userResumes, setUserResumes] = useState([]);
    const [selectedResumeId, setSelectedResumeId] = useState("");
    const [isLoadingResumes, setIsLoadingResumes] = useState(false);
    const [resumeError, setResumeError] = useState("");

    // No resume popup state
    const [showNoResumePopup, setShowNoResumePopup] = useState(false);

    // Applied jobs tracking state
    const [appliedJobIds, setAppliedJobIds] = useState(new Set());
    const [isLoadingAppliedJobs, setIsLoadingAppliedJobs] = useState(false);
    // Applied jobs state - NEW: Track which jobs user has applied to
    const [appliedJobIds, setAppliedJobIds] = useState(new Set());

    // Dynamic options from backend data
    const [jobTypeOptions, setJobTypeOptions] = useState([]);
    const [industryOptions, setIndustryOptions] = useState([]);
    const [locationOptions, setLocationOptions] = useState([]);

    const salaryMinOptions = [
        { value: "0", label: "₱0" },
        { value: "10000", label: "₱10,000" },
        { value: "20000", label: "₱20,000" },
        { value: "30000", label: "₱30,000" },
        { value: "40000", label: "₱40,000" },
        { value: "50000", label: "₱50,000" },
        { value: "60000", label: "₱60,000" },
        { value: "70000", label: "₱70,000" },
        { value: "80000", label: "₱80,000" },
        { value: "90000", label: "₱90,000" },
        { value: "100000", label: "₱100,000" },
    ];

    const salaryMaxOptions = [
        { value: "10000", label: "₱10,000" },
        { value: "20000", label: "₱20,000" },
        { value: "30000", label: "₱30,000" },
        { value: "40000", label: "₱40,000" },
        { value: "50000", label: "₱50,000" },
        { value: "60000", label: "₱60,000" },
        { value: "70000", label: "₱70,000" },
        { value: "80000", label: "₱80,000" },
        { value: "90000", label: "₱90,000" },
        { value: "100000", label: "₱100,000" },
        { value: "150000", label: "₱150,000" },
        { value: "200000", label: "₱200,000" },
        { value: "250000", label: "₱250,000" },
        { value: "300000", label: "₱300,000" },
        { value: "500000", label: "₱500,000" },
    ];

    const sortOptions = [
        { value: "latest", label: "Latest First" },
        { value: "oldest", label: "Oldest First" },
        { value: "salary-high", label: "Highest Salary" },
        { value: "salary-low", label: "Lowest Salary" },
    ];

    // Check if user is logged in
    const isUserLoggedIn = () => {
        const token = localStorage.getItem("token");
        return !!token;
    };

    // Get current user info from token
    const getCurrentUser = () => {
        const token = localStorage.getItem("token");
        if (!token) return null;
        
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload;
        } catch (error) {
            console.error('Error decoding token:', error);
            return null;
        }
    };

    // NEW: Check if job is applied by current user
    const isJobApplied = (jobId) => {
        return appliedJobIds.has(jobId);
    };

    useEffect(() => {
        loadAllJobs();
    }, []);

    useEffect(() => {
        if (isUserLoggedIn()) {
            loadAppliedJobIds();
        }
    }, []);

    useEffect(() => {
        // Update pagination when filtered jobs change
        const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
        setTotalPages(totalPages);
        setCurrentPage(1); // Reset to first page when filters change
        updateDisplayedJobs();
    }, [filteredJobs]);

    useEffect(() => {
        updateDisplayedJobs();
    }, [currentPage, filteredJobs]);

    const loadAllJobs = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${URL}/jobs`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("Backend response:", response.data);
            const jobs = response.data.jobPosting || [];
            const applicants = response.data.applicants || [];
            
            setAllJobs(jobs);
            setFilteredJobs(jobs);

            // NEW: Extract applied job IDs from applicants data
            const currentUser = getCurrentUser();
            const appliedIds = new Set();
            
            if (currentUser && applicants.length > 0) {
                applicants.forEach(applicant => {
                    // Check if this application belongs to current user
                    // Try different possible field names for user ID
                    const applicantUserId = applicant.userID || applicant.userId || applicant.usertD;
                    
                    if (parseInt(applicantUserId) === parseInt(currentUser.id)) {
                        // Try different possible field names for job posting ID
                        const jobId = applicant.JobPostingld || applicant.jobPostingID || applicant.jobPostingId;
                        if (jobId) {
                            appliedIds.add(parseInt(jobId));
                            console.log(`Current user applied to job ID: ${jobId}`);
                        }
                    }
                });
            }

            console.log("Applied job IDs:", appliedIds);
            setAppliedJobIds(appliedIds);

            // Extract unique values from backend data for dropdowns
            extractDropdownOptions(jobs);
        } catch (error) {
            console.error("Error loading jobs:", error);
            setAllJobs([]);
            setFilteredJobs([]);
            setAppliedJobIds(new Set());
        } finally {
            setLoading(false);
        }
    };

    // Function to fetch applied job IDs
    const loadAppliedJobIds = async () => {
        try {
            setIsLoadingAppliedJobs(true);
            const token = localStorage.getItem("token");
            
            const response = await axios.get(`${URL}/applied-jobs`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.userApplications) {
                const appliedIds = new Set(
                    response.data.userApplications.map(app => app.JobPosting?.id || app.jobId)
                );
                setAppliedJobIds(appliedIds);
            }
        } catch (error) {
            console.error("Error loading applied jobs:", error);
        } finally {
            setIsLoadingAppliedJobs(false);
        }
    };

    // Check if user has already applied to a job
    const hasApplied = (jobId) => {
        return appliedJobIds.has(jobId);
    };

    // Fetch user's resumes when apply dialog opens
    const fetchUserResumes = async () => {
        if (!isUserLoggedIn()) return;

        try {
            setIsLoadingResumes(true);
            setResumeError("");
            const token = localStorage.getItem("token");
            
            const response = await axios.get(`${URL}/getResume`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.log("Fetched user resumes:", response.data);

            if (response.data && response.data.documents) {
                const documents = Array.isArray(response.data.documents) 
                    ? response.data.documents 
                    : [response.data.documents];
                
                // Filter documents where deletedAt is null and are PDF/DOC/DOCX
                const activeResumes = documents.filter(doc => 
                    doc.deletedAt === null && 
                    doc.fileName && 
                    (doc.fileName.toLowerCase().endsWith('.pdf') || 
                     doc.fileName.toLowerCase().endsWith('.doc') || 
                     doc.fileName.toLowerCase().endsWith('.docx'))
                );

                const formattedResumes = activeResumes.map(doc => ({
                    id: doc.id,
                    fileName: doc.fileName,
                    docType: doc.docType || 'Resume',
                    uploadedAt: doc.createdAt
                }));

                setUserResumes(formattedResumes);
                
                // Auto-select the first resume if available
                if (formattedResumes.length > 0) {
                    setSelectedResumeId(formattedResumes[0].id);
                }

                return formattedResumes.length > 0; // Return true if resumes exist
            }
            return false; // Return false if no resumes
        } catch (error) {
            console.error('Error fetching user resumes:', error);
            setResumeError('Failed to load your resumes. Please try again.');
            return false;
        } finally {
            setIsLoadingResumes(false);
        }
    };

    const extractDropdownOptions = (jobs) => {
        // Extract unique job types
        const uniqueJobTypes = [...new Set(jobs.map((job) => job.type).filter(Boolean))];
        const jobTypeOptions = uniqueJobTypes.map((type) => ({
            value: type,
            label: type,
        }));
        setJobTypeOptions(jobTypeOptions);
        console.log("Job Types from backend:", jobTypeOptions);

        // Extract ALL unique industries from company data - including null/undefined
        const allIndustries = jobs.map((job) => job.company?.industry);
        console.log("All industries raw:", allIndustries);

        // Filter out null/undefined/empty values and get unique industries
        const uniqueIndustries = [
            ...new Set(allIndustries.filter((industry) => industry !== null && industry !== undefined && industry !== "")),
        ];

        const industryOptions = uniqueIndustries.map((industry) => ({
            value: industry,
            label: industry,
        }));
        setIndustryOptions(industryOptions);
        console.log("Industries from backend:", industryOptions);

        // Extract unique locations
        const uniqueLocations = [...new Set(jobs.map((job) => job.location).filter(Boolean))];
        const locationOptions = uniqueLocations.map((location) => ({
            value: location,
            label: location,
        }));
        setLocationOptions(locationOptions);
        console.log("Locations from backend:", locationOptions);
    };

    const updateDisplayedJobs = () => {
        const startIndex = (currentPage - 1) * jobsPerPage;
        const endIndex = startIndex + jobsPerPage;
        setDisplayedJobs(filteredJobs.slice(startIndex, endIndex));
    };

    const filterJobs = useCallback(() => {
        let filtered = [...allJobs];

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (job) =>
                    job.title?.toLowerCase().includes(query) ||
                    job.description?.toLowerCase().includes(query) ||
                    job.company?.name?.toLowerCase().includes(query)
            );
        }

        if (locationQuery.trim()) {
            const location = locationQuery.toLowerCase();
            filtered = filtered.filter((job) => job.location?.toLowerCase().includes(location));
        }

        if (jobType) {
            filtered = filtered.filter((job) => job.type?.toLowerCase() === jobType.toLowerCase());
        }

        // Separate salaryMin filter
        if (salaryMin) {
            const minSalaryValue = parseInt(salaryMin);
            filtered = filtered.filter((job) => {
                const jobSalaryMin = job.salaryMin || 0;
                return jobSalaryMin >= minSalaryValue;
            });
        }

        // Separate salaryMax filter
        if (salaryMax) {
            const maxSalaryValue = parseInt(salaryMax);
            filtered = filtered.filter((job) => {
                const jobSalaryMax = job.salaryMax || 0;
                // If job has no max salary, don't filter it out
                if (jobSalaryMax === 0) return true;
                return jobSalaryMax <= maxSalaryValue;
            });
        }

        // Combined salary range filter (both min and max)
        if (salaryMin && salaryMax) {
            const minSalaryValue = parseInt(salaryMin);
            const maxSalaryValue = parseInt(salaryMax);
            filtered = filtered.filter((job) => {
                const jobSalaryMin = job.salaryMin || 0;
                const jobSalaryMax = job.salaryMax || 0;

                // Check if job salary range overlaps with selected range
                return jobSalaryMin <= maxSalaryValue && (jobSalaryMax === 0 || jobSalaryMax >= minSalaryValue);
            });
        }

        if (industry) {
            filtered = filtered.filter(
                (job) => job.company?.industry?.toLowerCase() === industry.toLowerCase()
            );
        }

        switch (sortBy) {
            case "latest":
                filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
                break;
            case "oldest":
                filtered.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
                break;
            case "salary-high":
                filtered.sort((a, b) => {
                    const avgSalaryA = ((a.salaryMin || 0) + (a.salaryMax || 0)) / 2;
                    const avgSalaryB = ((b.salaryMin || 0) + (b.salaryMax || 0)) / 2;
                    return avgSalaryB - avgSalaryA;
                });
                break;
            case "salary-low":
                filtered.sort((a, b) => {
                    const avgSalaryA = ((a.salaryMin || 0) + (a.salaryMax || 0)) / 2;
                    const avgSalaryB = ((b.salaryMin || 0) + (b.salaryMax || 0)) / 2;
                    return avgSalaryA - avgSalaryB;
                });
                break;
            default:
                break;
        }

        setFilteredJobs(filtered);
    }, [allJobs, searchQuery, locationQuery, jobType, salaryMin, salaryMax, industry, sortBy]);

    useEffect(() => {
        filterJobs();
    }, [filterJobs]);

    const handleSearchChange = (value) => {
        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
        searchTimeoutRef.current = setTimeout(() => setSearchQuery(value), 300);
    };

    const handleLocationChange = (value) => {
        if (locationTimeoutRef.current) clearTimeout(locationTimeoutRef.current);
        locationTimeoutRef.current = setTimeout(() => setLocationQuery(value), 300);
    };

    const handleSearch = () => {
        filterJobs();
    };

    const handleViewDetails = (job) => {
        setSelectedJob(job);
        setIsDrawerOpen(true);
    };

    const toggleDrawerSize = () => {
        setDrawerHeight(drawerHeight === 85 ? 50 : 85);
    };

    const scrollToTop = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const handleScroll = (e) => {
        setShowScrollTop(e.target.scrollTop > 100);
    };

    const clearAllFilters = () => {
        setSearchQuery("");
        setLocationQuery("");
        setJobType("");
        setSalaryMin("");
        setSalaryMax("");
        setIndustry("");
        setSortBy("latest");
        setCurrentPage(1);
        const searchInput = document.querySelector('input[placeholder*="Job title"]');
        const locationInput = document.querySelector('input[placeholder*="Location"]');
        if (searchInput) searchInput.value = "";
        if (locationInput) locationInput.value = "";
    };

    // Application functions
    const handleApplyNow = async () => {
        // Check if user is logged in
        if (!isUserLoggedIn()) {
            alert("Please log in or register first to apply for jobs.");
            navigate("/login"); // Redirect to login page
            return;
        }

        // NEW: Check if already applied to this job
        if (selectedJob && isJobApplied(selectedJob.id)) {
            alert("You have already applied to this job.");
            return;
        }

        // Fetch user's resumes first
        const hasResumes = await fetchUserResumes();
        
        // Check if user has any resumes uploaded
        if (!hasResumes && !isLoadingResumes) {
            // Show the no resume popup instead of the application dialog
            setShowNoResumePopup(true);
            return;
        }

        // If user has resumes, open the application dialog
        setIsApplyDialogOpen(true);
    };

    const handleInputChange = (field, value) => {
        setApplicationForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSubmitApplication = async () => {
        // Check if user is logged in (double check)
        if (!isUserLoggedIn()) {
            alert("Please log in or register first to apply for jobs.");
            navigate("/login");
            return;
        }

        // NEW: Check if already applied to this job
        if (selectedJob && isJobApplied(selectedJob.id)) {
            alert("You have already applied to this job.");
            setIsApplyDialogOpen(false);
            return;
        }

        // Check if resume is selected
        if (!selectedResumeId) {
            alert("Please select a resume to submit with your application.");
            return;
        }

        // Basic validation
        if (!applicationForm.fullName.trim()) {
            alert("Please enter your full name");
            return;
        }

        if (!applicationForm.email.trim()) {
            alert("Please enter your email");
            return;
        }

        setIsSubmitting(true);

        try {
            const applicationData = {
                fullName: applicationForm.fullName,
                email: applicationForm.email,
                phone: applicationForm.phone,
                coverLetter: applicationForm.coverLetter,
                jobPostingID: selectedJob.id,
                resumeId: selectedResumeId, // Include the selected resume ID
            };

            const token = localStorage.getItem("token");

            console.log("Submitting application...");
            const result = await axios.post(`${URL}/application-submit`, applicationData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Add job ID to applied jobs set
            // NEW: Add the job to applied jobs after successful submission
            setAppliedJobIds(prev => new Set([...prev, selectedJob.id]));

            // Reset form
            setApplicationForm({
                fullName: "",
                email: "",
                phone: "",
                coverLetter: "",
            });
            setSelectedResumeId("");
            setIsApplyDialogOpen(false);

            // Show success message
            alert(`Application submitted successfully for ${selectedJob.title} at ${selectedJob.company?.name || "the company"}!`);
        } catch (error) {
            console.error("Error submitting application:", error);
            if (error.response?.status === 401) {
                alert("Your session has expired. Please log in again.");
                localStorage.removeItem("token");
                navigate("/login");
            } else {
                alert(error.response?.data?.message ?? "An error occurred while submitting the application.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle upload resume from popup
    const handleUploadResume = () => {
        setShowNoResumePopup(false);
        navigate("/upload-resume");
    };

    // Handle cancel from popup
    const handleCancelUpload = () => {
        setShowNoResumePopup(false);
    };

    // Pagination functions
    const goToPage = (pageNumber) => {
        setCurrentPage(pageNumber);
        scrollToTop();
    };

    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
            scrollToTop();
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
            scrollToTop();
        }
    };

    const formatSalary = (job) => {
        if (job.salaryMin && job.salaryMax) {
            return `₱${job.salaryMin.toLocaleString()} - ₱${job.salaryMax.toLocaleString()}`;
        } else if (job.salaryMin) {
            return `₱${job.salaryMin.toLocaleString()}+`;
        } else if (job.salaryMax) {
            return `Up to ₱${job.salaryMax.toLocaleString()}`;
        }
        return "Salary not specified";
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    // Generate page numbers for pagination
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            const startPage = Math.max(1, currentPage - 2);
            const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

            for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
            }
        }

        return pages;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navigation />
            <Breadcrumb />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Hero Section */}
                <div className="text-center mb-12">
                    <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Briefcase className="h-10 w-10 text-blue-600" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Find Your Dream Job</h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
                        Discover thousands of job opportunities across the Philippines and connect with top employers
                    </p>
                    {!isUserLoggedIn() && (
                        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg max-w-2xl mx-auto">
                            <p className="text-yellow-800 font-medium">
                                🔒 Please <Link to="/login" className="underline hover:text-yellow-900 text-blue-600">log in</Link> or{" "}
                                <Link to="/signup" className="underline hover:text-yellow-900 text-blue-600">register</Link> to apply for jobs
                            </p>
                        </div>
                    )}
                </div>

                {/* Search Card */}
                <Card className="shadow-lg border-0 mb-12 bg-white">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                        <CardTitle className="flex items-center gap-2 text-2xl text-gray-800">
                            <Search className="h-6 w-6 text-blue-600" />
                            Search Jobs
                        </CardTitle>
                        <CardDescription className="text-gray-600 text-lg">
                            Find the perfect job that matches your skills and preferences
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                        {/* Main Search Row */}
                        <div className="mb-6">
                            <div className="flex flex-col lg:flex-row gap-4">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    <Input
                                        type="text"
                                        placeholder="Job title, keywords, or company name"
                                        className="pl-10 h-14 text-lg border-2 border-gray-200 focus:border-blue-500 transition-colors"
                                        onChange={(e) => handleSearchChange(e.target.value)}
                                    />
                                </div>
                                <div className="flex-1 relative">
                                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    <Combobox
                                        options={locationOptions}
                                        value={locationQuery}
                                        onValueChange={setLocationQuery}
                                        placeholder="All Locations"
                                        searchPlaceholder="Search locations..."
                                        className="h-14 border-2 border-gray-200 focus:border-blue-500"
                                    />
                                </div>
                                <Button 
                                    className="h-14 px-8 text-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-md"
                                    onClick={handleSearch} 
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Loading...
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            Search
                                            <ArrowRight className="h-4 w-4" />
                                        </div>
                                    )}
                                </Button>
                            </div>
                        </div>

                        {/* Advanced Filters */}
                        <div className="border-t border-gray-200 pt-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <Filter className="h-5 w-5 text-gray-600" />
                                    <span className="text-lg font-semibold text-gray-700">Advanced Filters</span>
                                </div>
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={clearAllFilters} 
                                    className="text-blue-600 border-blue-200 hover:bg-blue-50"
                                >
                                    Clear All
                                </Button>
                            </div>

                            {/* Filter Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Job Type</label>
                                    <Combobox
                                        options={jobTypeOptions}
                                        value={jobType}
                                        onValueChange={setJobType}
                                        placeholder="All Job Types"
                                        searchPlaceholder="Search job types..."
                                        className="h-12 border-gray-200 focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Minimum Salary</label>
                                    <Combobox
                                        options={salaryMinOptions}
                                        value={salaryMin}
                                        onValueChange={setSalaryMin}
                                        placeholder="Any Minimum"
                                        searchPlaceholder="Search min salary..."
                                        className="h-12 border-gray-200 focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Maximum Salary</label>
                                    <Combobox
                                        options={salaryMaxOptions}
                                        value={salaryMax}
                                        onValueChange={setSalaryMax}
                                        placeholder="Any Maximum"
                                        searchPlaceholder="Search max salary..."
                                        className="h-12 border-gray-200 focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Industry</label>
                                    <Combobox
                                        options={industryOptions}
                                        value={industry}
                                        onValueChange={setIndustry}
                                        placeholder="All Industries"
                                        searchPlaceholder="Search industries..."
                                        className="h-12 border-gray-200 focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            {/* Quick Filters */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">Quick Filters</label>
                                <div className="flex flex-wrap gap-3">
                                    <Badge 
                                        variant="secondary" 
                                        className="cursor-pointer bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-700 border border-gray-300 transition-colors px-4 py-2"
                                    >
                                        Remote Work
                                    </Badge>
                                    <Badge 
                                        variant="secondary" 
                                        className="cursor-pointer bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-700 border border-gray-300 transition-colors px-4 py-2"
                                    >
                                        Urgent Hiring
                                    </Badge>
                                    <Badge 
                                        variant="secondary" 
                                        className="cursor-pointer bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-700 border border-gray-300 transition-colors px-4 py-2"
                                    >
                                        Fresh Graduates
                                    </Badge>
                                    <Badge 
                                        variant="secondary" 
                                        className="cursor-pointer bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-700 border border-gray-300 transition-colors px-4 py-2"
                                    >
                                        Work from Home
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Results Section */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Filters Sidebar */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-24 shadow-md border-0">
                            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                                <CardTitle className="text-xl text-gray-800">Sort By</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4">
                                <div className="space-y-2">
                                    {sortOptions.map((option) => (
                                        <button
                                            key={option.value}
                                            className={`w-full text-left px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                                                sortBy === option.value 
                                                    ? "bg-blue-600 text-white shadow-md" 
                                                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-700 border border-gray-200"
                                            }`}
                                            onClick={() => setSortBy(option.value)}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Jobs List */}
                    <div className="lg:col-span-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {filteredJobs.length} Job{filteredJobs.length !== 1 ? "s" : ""} Found
                                </h2>
                                {searchQuery && (
                                    <p className="text-gray-600 mt-1">Results for "{searchQuery}"</p>
                                )}
                                {(salaryMin || salaryMax) && (
                                    <p className="text-gray-600 mt-1">
                                        Salary range: {salaryMin ? `₱${parseInt(salaryMin).toLocaleString()}+` : "Any min"} -{" "}
                                        {salaryMax ? `Up to ₱${parseInt(salaryMax).toLocaleString()}` : "Any max"}
                                    </p>
                                )}
                                <p className="text-sm text-gray-500 mt-1">
                                    Showing {displayedJobs.length} of {filteredJobs.length} jobs
                                </p>
                            </div>
                        </div>

                        {loading ? (
                            <div className="space-y-4">
                                {[...Array(5)].map((_, i) => (
                                    <Card key={i} className="animate-pulse border-0 shadow-sm">
                                        <CardContent className="p-6">
                                            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                                            <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                                            <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                                            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : filteredJobs.length === 0 ? (
                            <Card className="border-0 shadow-md">
                                <CardContent className="p-12 text-center">
                                    <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No jobs found</h3>
                                    <p className="text-gray-600 mb-6">Try adjusting your search criteria or clear filters to see more results.</p>
                                    <Button 
                                        onClick={clearAllFilters}
                                        className="bg-blue-600 hover:bg-blue-700 text-white"
                                    >
                                        Clear All Filters
                                    </Button>
                                </CardContent>
                            </Card>
                        ) : (
                            <>
                                <div className="space-y-4 mb-8">
                                    {displayedJobs.map((job) => (
                                        <Card 
                                            key={job.id} 
                                            className={`hover:shadow-lg transition-all duration-300 cursor-pointer border ${
                                                isUserLoggedIn() && hasApplied(job.id)
                                                    ? 'border-green-300 bg-green-50/30 hover:border-green-400'
                                                    : 'border-gray-200 hover:border-blue-300'
                                            }`}
                                            onClick={() => handleViewDetails(job)}
                                        >
                                            <CardContent className="p-6">
                                                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                                                    <div className="flex-1">
                                                        <div className="flex items-start gap-3 mb-2">
                                                            <h3 className="text-xl font-bold text-gray-900 flex-1">{job.title}</h3>
                                                            <div className="flex items-center gap-2">
                                                                <Badge 
                                                                    variant={job.status === "active" ? "default" : "secondary"} 
                                                                    className={`${
                                                                        job.status === "active" 
                                                                            ? "bg-green-100 text-green-800 border-green-200" 
                                                                            : "bg-gray-100 text-gray-800 border-gray-200"
                                                                    }`}
                                                                >
                                                                    {job.status}
                                                                </Badge>
                                                                {isUserLoggedIn() && hasApplied(job.id) && (
                                                                    <Badge className="bg-green-100 text-green-800 border-green-200 font-semibold">
                                                                        <CheckCircle className="h-3 w-3 mr-1" />
                                                                        Applied
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                                                            <div className="flex items-center gap-2">
                                                                <Building2 className="h-4 w-4" />
                                                                <span>{job.company?.name || "Company"}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <MapPin className="h-4 w-4" />
                                                                <span>{job.location}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <Clock className="h-4 w-4" />
                                                                <span>{job.type}</span>
                                                            </div>
                                                        </div>
                                                        {job.company?.industry && (
                                                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                                                                <span>Industry: {job.company.industry}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col items-end gap-2">
                                                        <Badge 
                                                            variant={job.status === "active" ? "default" : "secondary"} 
                                                            className={`ml-2 ${
                                                                job.status === "active" 
                                                                    ? "bg-green-100 text-green-800 border-green-200" 
                                                                    : "bg-gray-100 text-gray-800 border-gray-200"
                                                            }`}
                                                        >
                                                            {job.status}
                                                        </Badge>
                                                        {/* NEW: Show Applied badge if user has applied */}
                                                        {isJobApplied(job.id) && (
                                                            <Badge className="bg-green-100 text-green-800 border-green-200">
                                                                Applied
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>

                                                <p className="text-gray-700 mb-4 line-clamp-2 leading-relaxed">{job.description}</p>

                                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                                    <div className="flex items-center gap-2 text-lg font-bold text-blue-600">
                                                        <DollarSign className="h-5 w-5" />
                                                        <span>{formatSalary(job)}</span>
                                                    </div>
                                                    <div className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                                                        Posted {formatDate(job.createdAt)}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="flex justify-center items-center space-x-2 mt-8">
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            onClick={prevPage} 
                                            disabled={currentPage === 1}
                                            className="border-gray-300 text-gray-700 hover:bg-gray-50"
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </Button>

                                        {getPageNumbers().map((page) => (
                                            <Button 
                                                key={page} 
                                                variant={currentPage === page ? "default" : "outline"} 
                                                size="sm" 
                                                onClick={() => goToPage(page)}
                                                className={currentPage === page 
                                                    ? "bg-blue-600 text-white" 
                                                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                                                }
                                            >
                                                {page}
                                            </Button>
                                        ))}

                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            onClick={nextPage} 
                                            disabled={currentPage === totalPages}
                                            className="border-gray-300 text-gray-700 hover:bg-gray-50"
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Job Details Drawer */}
            <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                <DrawerContent style={{ height: `${drawerHeight}vh` }} className="border-0">
                    <div className="mx-auto w-full max-w-4xl h-full flex flex-col bg-white rounded-t-2xl overflow-hidden">
                        <DrawerHeader className={`flex-shrink-0 border-b p-6 ${
                            isUserLoggedIn() && selectedJob && hasApplied(selectedJob.id)
                                ? 'bg-gradient-to-r from-green-50 to-emerald-50'
                                : 'bg-gradient-to-r from-blue-50 to-indigo-50'
                        }`}>
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-start gap-3 mb-2">
                                        <DrawerTitle className="text-2xl font-bold text-gray-900 flex-1">
                                            {selectedJob?.title}
                                        </DrawerTitle>
                                        {isUserLoggedIn() && selectedJob && hasApplied(selectedJob.id) && (
                                            <Badge className="bg-green-100 text-green-800 border-green-300 font-semibold px-3 py-1">
                                                <CheckCircle className="h-4 w-4 mr-1" />
                                                Applied
                                            </Badge>
                                        )}
                                    </div>
                                    <DrawerDescription className="text-gray-600">
                                        <div className="flex flex-wrap gap-4 mt-2">
                                            <div className="flex items-center gap-2">
                                                <Building2 className="h-4 w-4" />
                                                <span className="font-medium">{selectedJob?.company?.name || "Company"}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <MapPin className="h-4 w-4" />
                                                <span>{selectedJob?.location}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock className="h-4 w-4" />
                                                <span>{selectedJob?.type}</span>
                                            </div>
                                        </div>
                                    </DrawerDescription>
                                </div>
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={toggleDrawerSize}
                                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                                >
                                    {drawerHeight === 85 ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                                </Button>
                            </div>
                        </DrawerHeader>

                        {/* Scrollable Content Area */}
                        <div className="flex-1 overflow-hidden">
                            <div className="h-full overflow-y-auto px-6 py-4">
                                {selectedJob && (
                                    <div className="space-y-6 pb-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <Card className="border border-gray-200 shadow-sm">
                                                <CardHeader className="bg-blue-50 border-b">
                                                    <CardTitle className="flex items-center gap-2 text-gray-800">
                                                        <DollarSign className="h-5 w-5 text-blue-600" />
                                                        Salary Information
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent className="p-4">
                                                    <div className="text-2xl font-bold text-blue-600">{formatSalary(selectedJob)}</div>
                                                    <div className="text-sm text-gray-600 mt-2">
                                                        Minimum: ₱{selectedJob.salaryMin?.toLocaleString() || "Not specified"}
                                                    </div>
                                                    <div className="text-sm text-gray-600">
                                                        Maximum: ₱{selectedJob.salaryMax?.toLocaleString() || "Not specified"}
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            <Card className="border border-gray-200 shadow-sm">
                                                <CardHeader className="bg-blue-50 border-b">
                                                    <CardTitle className="flex items-center gap-2 text-gray-800">
                                                        <FileText className="h-5 w-5 text-blue-600" />
                                                        Job Details
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent className="p-4">
                                                    <div className="space-y-3">
                                                        <div className="flex justify-between items-center py-1 border-b border-gray-100">
                                                            <span className="text-gray-600">Type:</span>
                                                            <span className="font-medium text-gray-900">{selectedJob.type}</span>
                                                        </div>
                                                        <div className="flex justify-between items-center py-1 border-b border-gray-100">
                                                            <span className="text-gray-600">Industry:</span>
                                                            <span className="font-medium text-gray-900">{selectedJob.company?.industry || "Not specified"}</span>
                                                        </div>
                                                        <div className="flex justify-between items-center py-1 border-b border-gray-100">
                                                            <span className="text-gray-600">Status:</span>
                                                            <Badge 
                                                                variant={selectedJob.status === "active" ? "default" : "secondary"}
                                                                className={selectedJob.status === "active" 
                                                                    ? "bg-green-100 text-green-800 border-green-200" 
                                                                    : "bg-gray-100 text-gray-800 border-gray-200"
                                                                }
                                                            >
                                                                {selectedJob.status}
                                                            </Badge>
                                                        </div>
                                                        <div className="flex justify-between items-center py-1">
                                                            <span className="text-gray-600">Posted:</span>
                                                            <span className="font-medium text-gray-900">{formatDate(selectedJob.createdAt)}</span>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>

                                        <Card className="border border-gray-200 shadow-sm">
                                            <CardHeader className="bg-blue-50 border-b">
                                                <CardTitle className="text-gray-800">Job Description</CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-6">
                                                <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">{selectedJob.description}</p>
                                            </CardContent>
                                        </Card>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Fixed Button Section */}
                        <div className="flex-shrink-0 border-t bg-white p-6 shadow-lg">
                            {selectedJob && (
                                <>
                                    {isUserLoggedIn() ? (
                                        hasApplied(selectedJob.id) ? (
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg shadow-sm">
                                                    <CheckCircle className="h-6 w-6 text-green-600" />
                                                    <div className="text-center">
                                                        <p className="text-green-900 font-semibold text-lg">
                                                            Application Submitted Successfully!
                                                        </p>
                                                        <p className="text-green-700 text-sm mt-1">
                                                            You have already applied to this position
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col sm:flex-row gap-3">
                                                    <Button 
                                                        size="lg" 
                                                        className="flex-1 h-12 bg-green-600 hover:bg-green-700 text-white shadow-md"
                                                        asChild
                                                    >
                                                        <Link to="/applied-jobs">
                                                            <FileText className="h-5 w-5 mr-2" />
                                                            View Application Status
                                                        </Link>
                                                    </Button>
                                                    <Button 
                                                        variant="outline" 
                                                        size="lg" 
                                                        className="h-12 border-gray-300 text-gray-700 hover:bg-gray-50"
                                                        asChild
                                                    >
                                                        <Link to="/jobs">
                                                            <Briefcase className="h-5 w-5 mr-2" />
                                                            Browse More Jobs
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col sm:flex-row gap-4">
                                                <Button 
                                                    className="flex-1 h-14 text-lg bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                                                    onClick={handleApplyNow}
                                                >
                                                    Apply Now
                                                    <ArrowRight className="h-5 w-5 ml-2" />
                                                </Button>
                                                <Button variant="outline" size="lg" className="h-14 border-gray-300 text-gray-700 hover:bg-gray-50">
                                                    <Heart className="h-5 w-5 mr-2" />
                                                    Save
                                                </Button>
                                                <Button variant="outline" size="lg" className="h-14 border-gray-300 text-gray-700 hover:bg-gray-50">
                                                    <Share2 className="h-5 w-5 mr-2" />
                                                    Share
                                                </Button>
                                            </div>
                                        )
                                    ) : (
                                    <div className="flex flex-col sm:flex-row gap-4 mb-4">
                                        {/* NEW: Show Applied button if already applied, otherwise Show Apply Now */}
                                        {isJobApplied(selectedJob.id) ? (
                                            <Button 
                                                className="flex-1 h-14 text-lg bg-green-600 hover:bg-green-700 text-white shadow-md cursor-not-allowed"
                                                disabled
                                            >
                                                <Check className="h-5 w-5 mr-2" />
                                                Applied
                                            </Button>
                                        ) : (
                                            <Button 
                                                className="flex-1 h-14 text-lg bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                                                onClick={handleApplyNow} 
                                                disabled={!isUserLoggedIn()}
                                            >
                                                Apply Now
                                                <ArrowRight className="h-5 w-5 ml-2" />
                                            </Button>
                                        )}
                                        <Button variant="outline" size="lg" className="h-14 border-gray-300 text-gray-700 hover:bg-gray-50">
                                            <Heart className="h-5 w-5 mr-2" />
                                            Save
                                        </Button>
                                        <Button variant="outline" size="lg" className="h-14 border-gray-300 text-gray-700 hover:bg-gray-50">
                                            <Share2 className="h-5 w-5 mr-2" />
                                            Share
                                        </Button>
                                    </div>
                                    {!isUserLoggedIn() && !isJobApplied(selectedJob.id) && (
                                        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                            <p className="text-yellow-800 text-center">
                                                🔒 You need to <Link to="/login" className="underline font-medium text-blue-600">log in</Link> or{" "}
                                                <Link to="/signup" className="underline font-medium text-blue-600">register</Link> to apply for this job
                                            </p>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </DrawerContent>
            </Drawer>

            {/* No Resume Popup Dialog */}
            <Dialog open={showNoResumePopup} onOpenChange={setShowNoResumePopup}>
                <DialogContent className="max-w-md border-0 shadow-xl">
                    <DialogHeader className="text-center">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
                            <FileText className="h-6 w-6 text-yellow-600" />
                        </div>
                        <DialogTitle className="text-xl text-gray-900">No Resume Found</DialogTitle>
                        <DialogDescription className="text-gray-600 mt-2">
                            You need to upload a resume before applying for jobs. Would you like to upload a resume now?
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter className="flex flex-col sm:flex-row gap-3 mt-6">
                        <Button 
                            variant="outline" 
                            onClick={handleCancelUpload}
                            className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 h-12"
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleUploadResume}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white h-12"
                        >
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Resume
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Application Dialog - Compact Design */}
            <Dialog open={isApplyDialogOpen} onOpenChange={setIsApplyDialogOpen}>
                <DialogContent className="max-w-lg border-0 shadow-xl">
                    <DialogHeader className="border-b p-4">
                        <DialogTitle className="flex items-center gap-2 text-lg text-gray-800">
                            <FileText className="h-5 w-5 text-blue-600" />
                            Apply for {selectedJob?.title}
                        </DialogTitle>
                        <DialogDescription className="text-gray-600 text-sm">
                            Submit your application for {selectedJob?.title} at {selectedJob?.company?.name || "the company"}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4 px-4 max-h-[60vh] overflow-y-auto">
                        {/* Resume Selection - Compact */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-semibold flex items-center gap-2 text-gray-800">
                                <FileText className="h-4 w-4 text-blue-600" />
                                Select Resume
                            </h3>

                            {isLoadingResumes ? (
                                <div className="p-3 text-center bg-gray-50 rounded border border-gray-200">
                                    <div className="h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                                    <p className="text-gray-600 text-xs">Loading your resumes...</p>
                                </div>
                            ) : resumeError ? (
                                <div className="p-3 bg-red-50 border border-red-200 rounded text-xs">
                                    <p className="text-red-700">{resumeError}</p>
                                </div>
                            ) : userResumes.length === 0 ? (
                                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded text-center">
                                    <FileText className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                                    <p className="text-yellow-700 text-xs mb-3">
                                        You haven't uploaded any resumes yet.
                                    </p>
                                    <Button 
                                        size="sm" 
                                        onClick={() => {
                                            setIsApplyDialogOpen(false);
                                            navigate("/upload-resume");
                                        }}
                                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-8"
                                    >
                                        <Upload className="h-3 w-3 mr-1" />
                                        Upload Resume
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <p className="text-gray-600 text-xs">
                                        Select which resume to submit:
                                    </p>
                                    <div className="space-y-2 max-h-32 overflow-y-auto">
                                        {userResumes.map((resume) => (
                                            <div
                                                key={resume.id}
                                                className={`p-2 border rounded cursor-pointer transition-all duration-200 text-xs ${
                                                    selectedResumeId === resume.id
                                                        ? "border-blue-500 bg-blue-50"
                                                        : "border-gray-200 hover:border-blue-300"
                                                }`}
                                                onClick={() => setSelectedResumeId(resume.id)}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-3 h-3 rounded-full border flex items-center justify-center ${
                                                        selectedResumeId === resume.id
                                                            ? "border-blue-500 bg-blue-500"
                                                            : "border-gray-400"
                                                    }`}>
                                                        {selectedResumeId === resume.id && (
                                                            <div className="w-1 h-1 bg-white rounded-full"></div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-medium text-gray-900 truncate">{resume.fileName}</p>
                                                        <div className="flex items-center gap-2 text-gray-500 mt-0.5">
                                                            <span className="bg-gray-100 px-1 py-0.5 rounded text-xs">{resume.docType}</span>
                                                            <span className="text-xs">Uploaded {formatDate(resume.uploadedAt)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {!selectedResumeId && userResumes.length > 0 && (
                                        <p className="text-red-500 text-xs flex items-center gap-1">
                                            <X className="h-3 w-3" />
                                            Please select a resume
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Personal Information - Compact */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-semibold flex items-center gap-2 text-gray-800">
                                <User className="h-4 w-4 text-blue-600" />
                                Personal Information
                            </h3>

                            <div className="grid grid-cols-1 gap-3">
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-700">Full Name *</label>
                                    <Input
                                        placeholder="Enter your full name"
                                        value={applicationForm.fullName}
                                        onChange={(e) => handleInputChange("fullName", e.target.value)}
                                        className="h-9 text-sm border border-gray-300 focus:border-blue-500"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-700">Email *</label>
                                    <Input
                                        type="email"
                                        placeholder="Enter your email"
                                        value={applicationForm.email}
                                        onChange={(e) => handleInputChange("email", e.target.value)}
                                        className="h-9 text-sm border border-gray-300 focus:border-blue-500"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-700">Phone Number</label>
                                    <Input
                                        type="tel"
                                        placeholder="Enter your phone number"
                                        value={applicationForm.phone}
                                        onChange={(e) => handleInputChange("phone", e.target.value)}
                                        className="h-9 text-sm border border-gray-300 focus:border-blue-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Cover Letter - Compact */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-semibold flex items-center gap-2 text-gray-800">
                                <MailIcon className="h-4 w-4 text-blue-600" />
                                Cover Letter (Optional)
                            </h3>

                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-700">Tell us why you're a good fit</label>
                                <textarea
                                    placeholder="Write your cover letter here..."
                                    rows={3}
                                    className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none resize-none"
                                    value={applicationForm.coverLetter}
                                    onChange={(e) => handleInputChange("coverLetter", e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="border-t p-4">
                        <Button 
                            variant="outline" 
                            onClick={() => setIsApplyDialogOpen(false)} 
                            disabled={isSubmitting}
                            className="h-9 px-4 text-sm border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleSubmitApplication} 
                            disabled={isSubmitting || !applicationForm.fullName || !applicationForm.email || !selectedResumeId}
                            className="h-9 px-4 text-sm bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <div className="flex items-center gap-2">
                                    <div className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Submitting...
                                </div>
                            ) : (
                                "Submit Application"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Footer />
        </div>
    );
}

export default JobsPage;