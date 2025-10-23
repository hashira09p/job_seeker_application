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

    useEffect(() => {
        loadAllJobs();
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
            const response = await axios.get(`${URL}/jobs`);
            console.log("Backend response:", response.data);
            const jobs = response.data.jobPosting || [];
            setAllJobs(jobs);
            setFilteredJobs(jobs);

            // Extract unique values from backend data for dropdowns
            extractDropdownOptions(jobs);
        } catch (error) {
            console.error("Error loading jobs:", error);
            setAllJobs([]);
            setFilteredJobs([]);
        } finally {
            setLoading(false);
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
    const handleApplyNow = () => {
        // Check if user is logged in
        if (!isUserLoggedIn()) {
            alert("Please log in or register first to apply for jobs.");
            navigate("/login"); // Redirect to login page
            return;
        }

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
            };

            const token = localStorage.getItem("token");

            console.log("Submitting application...");
            const result = await axios.post(`${URL}/application-submit`, applicationData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Reset form
            setApplicationForm({
                fullName: "",
                email: "",
                phone: "",
                coverLetter: "",
            });
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
        <div className="min-h-screen" style={{ backgroundColor: "#f9f9f9" }}>
            <Navigation />
            <Breadcrumb />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center mb-16">
                    <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Briefcase className="h-10 w-10 text-primary" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Find Your Dream Job</h1>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                        Discover thousands of job opportunities across the Philippines and connect with top employers
                    </p>
                    {!isUserLoggedIn() && (
                        <div className="mt-6 p-4 bg-yellow-100 border border-yellow-300 rounded-lg max-w-2xl mx-auto">
                            <p className="text-yellow-800 font-medium">
                                🔒 Please <Link to="/login" className="underline hover:text-yellow-900">log in</Link> or{" "}
                                <Link to="/signup" className="underline hover:text-yellow-900">register</Link> to apply for jobs
                            </p>
                        </div>
                    )}
                </div>

                <Card className="shadow-lg border-0 mb-16">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Search className="h-5 w-5 text-primary" />
                            Search Jobs
                        </CardTitle>
                        <CardDescription>Find the perfect job that matches your skills and preferences</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-8">
                            <div className="flex flex-col lg:flex-row gap-4">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                                    <Input
                                        type="text"
                                        placeholder="Job title, keywords, or company name"
                                        className="pl-10 h-12 text-lg"
                                        onChange={(e) => handleSearchChange(e.target.value)}
                                    />
                                </div>
                                <div className="flex-1 relative">
                                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                                    <Combobox
                                        options={locationOptions}
                                        value={locationQuery}
                                        onValueChange={setLocationQuery}
                                        placeholder="All Locations"
                                        searchPlaceholder="Search locations..."
                                        className="h-12"
                                    />
                                </div>
                                <Button className="h-12 px-8 text-lg hover:bg-[#1c1c1c] transition-colors" onClick={handleSearch} disabled={loading}>
                                    {loading ? "Loading..." : "Search"}
                                    <ArrowRight className="h-4 w-4 ml-2" />
                                </Button>
                            </div>
                        </div>

                        <div className="border-t pt-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <Filter className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm font-medium text-muted-foreground">Advanced Filters</span>
                                </div>
                                <Button variant="outline" size="sm" onClick={clearAllFilters} className="text-xs">
                                    Clear All
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">Job Type</label>
                                    <Combobox
                                        options={jobTypeOptions}
                                        value={jobType}
                                        onValueChange={setJobType}
                                        placeholder="All Job Types"
                                        searchPlaceholder="Search job types..."
                                        className="h-12"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">Minimum Salary</label>
                                    <Combobox
                                        options={salaryMinOptions}
                                        value={salaryMin}
                                        onValueChange={setSalaryMin}
                                        placeholder="Any Minimum"
                                        searchPlaceholder="Search min salary..."
                                        className="h-12"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">Maximum Salary</label>
                                    <Combobox
                                        options={salaryMaxOptions}
                                        value={salaryMax}
                                        onValueChange={setSalaryMax}
                                        placeholder="Any Maximum"
                                        searchPlaceholder="Search max salary..."
                                        className="h-12"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">Industry</label>
                                    <Combobox
                                        options={industryOptions}
                                        value={industry}
                                        onValueChange={setIndustry}
                                        placeholder="All Industries"
                                        searchPlaceholder="Search industries..."
                                        className="h-12"
                                    />
                                </div>
                            </div>

                            <div className="mt-6">
                                <div className="flex flex-wrap gap-2">
                                    <Badge variant="secondary" className="cursor-pointer hover:bg-[#1c1c1c] hover:text-white transition-colors">
                                        Remote Work
                                    </Badge>
                                    <Badge variant="secondary" className="cursor-pointer hover:bg-[#1c1c1c] hover:text-white transition-colors">
                                        Urgent Hiring
                                    </Badge>
                                    <Badge variant="secondary" className="cursor-pointer hover:bg-[#1c1c1c] hover:text-white transition-colors">
                                        Fresh Graduates
                                    </Badge>
                                    <Badge variant="secondary" className="cursor-pointer hover:bg-[#1c1c1c] hover:text-white transition-colors">
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
                        <Card className="sticky top-24">
                            <CardHeader>
                                <CardTitle className="text-lg">Sort By</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {sortOptions.map((option) => (
                                        <button
                                            key={option.value}
                                            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                                                sortBy === option.value ? "bg-primary text-primary-foreground" : "hover:bg-muted"
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
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-foreground">
                                    {filteredJobs.length} Job{filteredJobs.length !== 1 ? "s" : ""} Found
                                </h2>
                                {searchQuery && <p className="text-muted-foreground mt-1">Results for "{searchQuery}"</p>}
                                {(salaryMin || salaryMax) && (
                                    <p className="text-muted-foreground mt-1">
                                        Salary range: {salaryMin ? `₱${parseInt(salaryMin).toLocaleString()}+` : "Any min"} -{" "}
                                        {salaryMax ? `Up to ₱${parseInt(salaryMax).toLocaleString()}` : "Any max"}
                                    </p>
                                )}
                                <p className="text-sm text-muted-foreground">Showing {displayedJobs.length} of {filteredJobs.length} jobs</p>
                            </div>
                        </div>

                        {loading ? (
                            <div className="space-y-4">
                                {[...Array(5)].map((_, i) => (
                                    <Card key={i} className="animate-pulse">
                                        <CardContent className="p-6">
                                            <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
                                            <div className="h-3 bg-muted rounded w-1/2 mb-2"></div>
                                            <div className="h-3 bg-muted rounded w-2/3"></div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : filteredJobs.length === 0 ? (
                            <Card>
                                <CardContent className="p-12 text-center">
                                    <Briefcase className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold mb-2">No jobs found</h3>
                                    <p className="text-muted-foreground mb-4">Try adjusting your search criteria or clear filters to see more results.</p>
                                    <Button onClick={clearAllFilters}>Clear All Filters</Button>
                                </CardContent>
                            </Card>
                        ) : (
                            <>
                                <div className="space-y-4 mb-8">
                                    {displayedJobs.map((job) => (
                                        <Card key={job.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                                            <CardContent className="p-6" onClick={() => handleViewDetails(job)}>
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <h3 className="text-xl font-semibold text-foreground mb-2">{job.title}</h3>
                                                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                                                            <div className="flex items-center gap-1">
                                                                <Building2 className="h-4 w-4" />
                                                                <span>{job.company?.name || "Company"}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <MapPin className="h-4 w-4" />
                                                                <span>{job.location}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <Clock className="h-4 w-4" />
                                                                <span>{job.type}</span>
                                                            </div>
                                                        </div>
                                                        {job.company?.industry && (
                                                            <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                                                                <span>Industry: {job.company.industry}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <Badge variant={job.status === "active" ? "default" : "secondary"} className="ml-2">
                                                        {job.status}
                                                    </Badge>
                                                </div>

                                                <p className="text-foreground mb-4 line-clamp-2">{job.description}</p>

                                                <div className="flex justify-between items-center">
                                                    <div className="flex items-center gap-1 text-lg font-semibold text-primary">
                                                        <DollarSign className="h-4 w-4" />
                                                        <span>{formatSalary(job)}</span>
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">Posted {formatDate(job.createdAt)}</div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="flex justify-center items-center space-x-2 mt-8">
                                        <Button variant="outline" size="sm" onClick={prevPage} disabled={currentPage === 1}>
                                            <ChevronLeft className="h-4 w-4" />
                                        </Button>

                                        {getPageNumbers().map((page) => (
                                            <Button key={page} variant={currentPage === page ? "default" : "outline"} size="sm" onClick={() => goToPage(page)}>
                                                {page}
                                            </Button>
                                        ))}

                                        <Button variant="outline" size="sm" onClick={nextPage} disabled={currentPage === totalPages}>
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
                <DrawerContent style={{ height: `${drawerHeight}vh` }}>
                    <div className="mx-auto w-full max-w-4xl h-full flex flex-col">
                        <DrawerHeader className="flex-shrink-0">
                            <div className="flex justify-between items-start">
                                <div>
                                    <DrawerTitle className="text-2xl">{selectedJob?.title}</DrawerTitle>
                                    <DrawerDescription>
                                        <div className="flex flex-wrap gap-4 mt-2">
                                            <div className="flex items-center gap-1">
                                                <Building2 className="h-4 w-4" />
                                                <span>{selectedJob?.company?.name || "Company"}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <MapPin className="h-4 w-4" />
                                                <span>{selectedJob?.location}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Clock className="h-4 w-4" />
                                                <span>{selectedJob?.type}</span>
                                            </div>
                                        </div>
                                    </DrawerDescription>
                                </div>
                                <Button variant="outline" size="sm" onClick={toggleDrawerSize}>
                                    {drawerHeight === 85 ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                                </Button>
                            </div>
                        </DrawerHeader>

                        {/* Scrollable Content Area */}
                        <div className="flex-1 overflow-hidden">
                            <div className="h-full overflow-y-auto px-4">
                                {selectedJob && (
                                    <div className="space-y-6 pb-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <Card>
                                                <CardHeader>
                                                    <CardTitle className="flex items-center gap-2">
                                                        <DollarSign className="h-5 w-5" />
                                                        Salary Information
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="text-2xl font-bold text-primary">{formatSalary(selectedJob)}</div>
                                                    <div className="text-sm text-muted-foreground mt-2">
                                                        Minimum: ₱{selectedJob.salaryMin?.toLocaleString() || "Not specified"}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        Maximum: ₱{selectedJob.salaryMax?.toLocaleString() || "Not specified"}
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            <Card>
                                                <CardHeader>
                                                    <CardTitle className="flex items-center gap-2">
                                                        <FileText className="h-5 w-5" />
                                                        Job Details
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="space-y-2">
                                                        <div className="flex justify-between">
                                                            <span className="text-muted-foreground">Type:</span>
                                                            <span className="font-medium">{selectedJob.type}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-muted-foreground">Industry:</span>
                                                            <span className="font-medium">{selectedJob.company?.industry || "Not specified"}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-muted-foreground">Status:</span>
                                                            <Badge variant={selectedJob.status === "active" ? "default" : "secondary"}>
                                                                {selectedJob.status}
                                                            </Badge>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-muted-foreground">Posted:</span>
                                                            <span className="font-medium">{formatDate(selectedJob.createdAt)}</span>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>

                                        <Card>
                                            <CardHeader>
                                                <CardTitle>Job Description</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="whitespace-pre-wrap">{selectedJob.description}</p>
                                            </CardContent>
                                        </Card>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Fixed Button Section */}
                        <div className="flex-shrink-0 border-t bg-background p-4">
                            {selectedJob && (
                                <>
                                    <div className="flex gap-4 mb-4">
                                        <Button className="flex-1" onClick={handleApplyNow} disabled={!isUserLoggedIn()} size="lg">
                                            Apply Now
                                            <ArrowRight className="h-4 w-4 ml-2" />
                                        </Button>
                                        <Button variant="outline" size="lg">
                                            <Heart className="h-4 w-4 mr-2" />
                                            Save
                                        </Button>
                                        <Button variant="outline" size="lg">
                                            <Share2 className="h-4 w-4 mr-2" />
                                            Share
                                        </Button>
                                    </div>
                                    {!isUserLoggedIn() && (
                                        <div className="p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
                                            <p className="text-yellow-800 text-sm text-center">
                                                🔒 You need to <Link to="/login" className="underline font-medium">log in</Link> or{" "}
                                                <Link to="/signup" className="underline font-medium">register</Link> to apply for this job
                                            </p>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </DrawerContent>
            </Drawer>

            {/* Application Dialog */}
            <Dialog open={isApplyDialogOpen} onOpenChange={setIsApplyDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Apply for {selectedJob?.title}
                        </DialogTitle>
                        <DialogDescription>
                            Submit your application for {selectedJob?.title} at {selectedJob?.company?.name || "the company"}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 py-4">
                        {/* Personal Information */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <User className="h-4 w-4" />
                                Personal Information
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Full Name *</label>
                                    <Input
                                        placeholder="Enter your full name"
                                        value={applicationForm.fullName}
                                        onChange={(e) => handleInputChange("fullName", e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Email *</label>
                                    <Input
                                        type="email"
                                        placeholder="Enter your email"
                                        value={applicationForm.email}
                                        onChange={(e) => handleInputChange("email", e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Phone Number</label>
                                <Input
                                    type="tel"
                                    placeholder="Enter your phone number"
                                    value={applicationForm.phone}
                                    onChange={(e) => handleInputChange("phone", e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Cover Letter */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <MailIcon className="h-4 w-4" />
                                Cover Letter (Optional)
                            </h3>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Tell us why you're a good fit for this position</label>
                                <textarea
                                    placeholder="Write your cover letter here..."
                                    rows={4}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    value={applicationForm.coverLetter}
                                    onChange={(e) => handleInputChange("coverLetter", e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsApplyDialogOpen(false)} disabled={isSubmitting}>
                            Cancel
                        </Button>
                        <Button onClick={handleSubmitApplication} disabled={isSubmitting || !applicationForm.fullName || !applicationForm.email}>
                            {isSubmitting ? (
                                <>
                                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                    Submitting...
                                </>
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