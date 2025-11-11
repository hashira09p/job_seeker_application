import {
    Search,
    MapPin,
    Briefcase,
    Building2,
    Clock,
    DollarSign,
    Calendar,
    FileText,
    CheckCircle,
    XCircle,
    Clock4,
    Eye,
    Download,
    Mail,
    User,
    RefreshCw,
    Filter,
    X,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";

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

function AppliedJobsPage() {
    const [appliedJobs, setAppliedJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [companyFilter, setCompanyFilter] = useState("all");
    const [locationFilter, setLocationFilter] = useState("all");
    const [jobTypeFilter, setJobTypeFilter] = useState("all");
    const [dateFilter, setDateFilter] = useState("all");
    const [salaryFilter, setSalaryFilter] = useState("all");
    const [showFilters, setShowFilters] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [socket, setSocket] = useState(null);
    const [lastUpdate, setLastUpdate] = useState(null);
    const [debugInfo, setDebugInfo] = useState("");
    const [recentlyUpdated, setRecentlyUpdated] = useState(new Set());
    const URL = "http://localhost:3000";

    // Filter options
    const statusOptions = [
        { value: "all", label: "All Status" },
        { value: "submitted", label: "Submitted" },
        { value: "under_review", label: "Under Review" },
        { value: "shortlisted", label: "Shortlisted" },
        { value: "accepted", label: "Accepted" },
        { value: "rejected", label: "Rejected" },
        { value: "hired", label: "Hired" },
    ];

    const dateOptions = [
        { value: "all", label: "Any Time" },
        { value: "today", label: "Today" },
        { value: "week", label: "This Week" },
        { value: "month", label: "This Month" },
        { value: "3months", label: "Last 3 Months" },
    ];

    const salaryOptions = [
        { value: "all", label: "Any Salary" },
        { value: "0-20000", label: "Up to ₱20,000" },
        { value: "20000-40000", label: "₱20,000 - ₱40,000" },
        { value: "40000-60000", label: "₱40,000 - ₱60,000" },
        { value: "60000-80000", label: "₱60,000 - ₱80,000" },
        { value: "80000+", label: "₱80,000+" },
    ];

    // Helper function to get user ID from token
    const getUserIdFromToken = () => {
        const token = localStorage.getItem("token");
        if (!token) return null;
        
        try {
            const tokenPayload = JSON.parse(atob(token.split('.')[1]));
            return tokenPayload.id;
        } catch (e) {
            console.error("Error decoding token:", e);
            return null;
        }
    };

    // Initialize socket connection for real-time updates
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.log("No token found, skipping socket connection");
            return;
        }

        console.log("🔄 Initializing socket connection for Applied Jobs...");
        const newSocket = io(URL, {
            transports: ['websocket', 'polling'],
            auth: {
                token: token
            }
        });

        newSocket.on("connect", () => {
            console.log("✅ Connected to server from Applied Jobs");
            setDebugInfo(prev => prev + " • Socket connected");
            
            // Join a room for application updates
            const userId = getUserIdFromToken();
            if (userId) {
                newSocket.emit("joinApplicationRoom", { userId });
            }
        });

        newSocket.on("disconnect", (reason) => {
            console.log("❌ Disconnected from server:", reason);
            setDebugInfo(prev => prev + ` • Socket disconnected: ${reason}`);
        });

        newSocket.on("connect_error", (error) => {
            console.log("❌ Socket connection error:", error);
            setDebugInfo(prev => prev + ` • Connection error: ${error.message}`);
        });

        // Listen for application status updates
        newSocket.on("applicationStatusUpdated", (data) => {
            console.log("📨 Real-time status update received:", data);
            handleRealTimeStatusUpdate(data);
        });

        // Listen for new application notifications
        newSocket.on("newApplication", (data) => {
            console.log("📨 New application received:", data);
            setDebugInfo(prev => prev + ` • New application: ${data.jobTitle}`);
            // Reload applications to get the new one
            loadAppliedJobs();
        });

        setSocket(newSocket);

        return () => {
            if (newSocket) {
                console.log("🧹 Cleaning up socket connection");
                newSocket.disconnect();
            }
        };
    }, []);

    // Handle real-time status updates
    const handleRealTimeStatusUpdate = (updateData) => {
        console.log("📨 Real-time status update received:", updateData);
        
        // Add to recently updated for animation
        const updateId = updateData.applicationId || updateData.id;
        setRecentlyUpdated(prev => new Set(prev).add(updateId));
        
        // Remove from recently updated after animation
        setTimeout(() => {
            setRecentlyUpdated(prev => {
                const newSet = new Set(prev);
                newSet.delete(updateId);
                return newSet;
            });
        }, 3000); // 3 second animation
        
        setAppliedJobs(prevApplications => {
            const updatedApplications = prevApplications.map(app => {
                // Check multiple possible ID fields to match the application
                if (app.id === updateData.applicationId || 
                    app.applicationId === updateData.applicationId ||
                    app.job?.id === updateData.jobId ||
                    app.id === updateData.id) {
                    
                    console.log(`🔄 Updating application ${app.id} status from ${app.status} to ${updateData.status}`);
                    
                    const updatedApp = {
                        ...app,
                        status: updateData.status,
                        updatedAt: updateData.updatedAt || new Date().toISOString()
                    };
                    
                    console.log("Updated application:", updatedApp);
                    return updatedApp;
                }
                return app;
            });

            return updatedApplications;
        });

        // Also update filtered jobs
        setFilteredJobs(prevFiltered => 
            prevFiltered.map(app => {
                if (app.id === updateData.applicationId || 
                    app.applicationId === updateData.applicationId ||
                    app.job?.id === updateData.jobId ||
                    app.id === updateData.id) {
                    return {
                        ...app,
                        status: updateData.status,
                        updatedAt: updateData.updatedAt || new Date().toISOString()
                    };
                }
                return app;
            })
        );

        // Update selected application if it's the one being viewed
        if (selectedApplication && 
            (selectedApplication.id === updateData.applicationId || 
             selectedApplication.applicationId === updateData.applicationId ||
             selectedApplication.job?.id === updateData.jobId ||
             selectedApplication.id === updateData.id)) {
            setSelectedApplication(prev => ({
                ...prev,
                status: updateData.status,
                updatedAt: updateData.updatedAt || new Date().toISOString()
            }));
        }

        setLastUpdate(new Date());
        setDebugInfo(prev => prev + ` • Status updated: ${updateData.status}`);
    };

    // Test function for real-time updates
    const testStatusUpdate = () => {
        if (appliedJobs.length === 0) {
            setDebugInfo("❌ No applications to test with");
            return;
        }
        
        // Simulate a status update for testing
        const testUpdate = {
            applicationId: appliedJobs[0]?.id,
            status: appliedJobs[0]?.status === "under_review" ? "shortlisted" : "under_review",
            updatedAt: new Date().toISOString()
        };
        handleRealTimeStatusUpdate(testUpdate);
    };

    useEffect(() => {
        loadAppliedJobs();
    }, []);

    useEffect(() => {
        filterApplications();
    }, [appliedJobs, searchQuery, statusFilter, companyFilter, locationFilter, jobTypeFilter, dateFilter, salaryFilter]);

    const loadAppliedJobs = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            
            if (!token) {
                const debugMsg = "❌ No authentication token found in localStorage";
                console.error(debugMsg);
                setDebugInfo(debugMsg);
                setLoading(false);
                return;
            }

            console.log("📡 Fetching applied jobs from API...");
            
            // Decode token to check user info
            try {
                const tokenPayload = JSON.parse(atob(token.split('.')[1]));
                console.log("👤 User from token:", tokenPayload);
                setDebugInfo(`User ID: ${tokenPayload.id}`);
            } catch (e) {
                console.log("Could not decode token:", e);
                setDebugInfo("Token format error");
            }

            const response = await axios.get(`${URL}/applied-jobs`, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                timeout: 10000
            });

            console.log("✅ API Response status:", response.status);
            console.log("✅ API Response data:", response.data);
            
            if (response.data.userApplications && response.data.userApplications.length > 0) {
                console.log(`🎉 Found ${response.data.userApplications.length} applications from backend`);
                
                // Transform the data based on your actual backend structure
                const transformedApplications = response.data.userApplications.map((app) => {
                    console.log("Raw application data:", app);
                    console.log("Application ID from backend:", app.id);
                    
                    return {
                        id: app.id, // This is the Applicants table ID - the one we need to delete
                        applicationId: app.id, // Same as id, for compatibility
                        job: {
                            id: app.JobPosting?.id || app.jobId,
                            title: app.JobPosting?.title || "Job Title",
                            company: {
                                name: app.JobPosting?.company?.name || "Company Name",
                                industry: app.JobPosting?.company?.industry || "Industry"
                            },
                            location: app.JobPosting?.location || "Location",
                            type: app.JobPosting?.type || "Full-time",
                            salaryMin: app.JobPosting?.salaryMin || 0,
                            salaryMax: app.JobPosting?.salaryMax || 0,
                            description: app.JobPosting?.description || "Job description",
                            status: app.JobPosting?.status || "active",
                            createdAt: app.JobPosting?.createdAt || new Date().toISOString()
                        },
                        applicationDate: app.applicationDate || app.createdAt || new Date().toISOString(),
                        status: app.status || "submitted",
                        coverLetter: app.coverLetter || "",
                        resume: {
                            fileName: app.resumeFileName || "resume.pdf",
                            docType: app.docType || "Resume"
                        }
                    };
                });
                
                console.log("📦 Transformed applications:", transformedApplications);
                setAppliedJobs(transformedApplications);
                setFilteredJobs(transformedApplications);
                setDebugInfo(`✅ Loaded ${transformedApplications.length} applications from backend`);
            } else {
                console.log("ℹ️ No applications found in backend response");
                setAppliedJobs([]);
                setFilteredJobs([]);
                setDebugInfo("ℹ️ No applications found for this user in database");
            }
        } catch (error) {
            console.error("❌ Error loading applied jobs:", error);
            
            let errorMessage = "Unknown error occurred";
            if (error.response) {
                console.error("Response status:", error.response.status);
                console.error("Response data:", error.response.data);
                errorMessage = `API Error: ${error.response.status} - ${error.response.data?.message || 'No message'}`;
            } else if (error.request) {
                console.error("No response received:", error.request);
                errorMessage = "No response from server - check if backend is running";
            } else {
                console.error("Request setup error:", error.message);
                errorMessage = `Request error: ${error.message}`;
            }
            
            setDebugInfo(`❌ ${errorMessage}`);
            setAppliedJobs([]);
            setFilteredJobs([]);
        } finally {
            setLoading(false);
        }
    };

    const filterApplications = () => {
        let filtered = [...appliedJobs];

        // Search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (application) =>
                    application.job.title?.toLowerCase().includes(query) ||
                    application.job.company?.name?.toLowerCase().includes(query) ||
                    application.job.location?.toLowerCase().includes(query)
            );
        }

        // Status filter
        if (statusFilter !== "all") {
            filtered = filtered.filter((application) => application.status === statusFilter);
        }

        // Company filter
        if (companyFilter !== "all") {
            filtered = filtered.filter((application) => 
                application.job.company?.name === companyFilter
            );
        }

        // Location filter
        if (locationFilter !== "all") {
            filtered = filtered.filter((application) => 
                application.job.location === locationFilter
            );
        }

        // Job Type filter
        if (jobTypeFilter !== "all") {
            filtered = filtered.filter((application) => 
                application.job.type === jobTypeFilter
            );
        }

        // Date filter
        if (dateFilter !== "all") {
            const now = new Date();
            filtered = filtered.filter((application) => {
                const applicationDate = new Date(application.applicationDate);
                
                switch (dateFilter) {
                    case "today":
                        return applicationDate.toDateString() === now.toDateString();
                    case "week":
                        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                        return applicationDate >= weekAgo;
                    case "month":
                        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                        return applicationDate >= monthAgo;
                    case "3months":
                        const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
                        return applicationDate >= threeMonthsAgo;
                    default:
                        return true;
                }
            });
        }

        // Salary filter
        if (salaryFilter !== "all") {
            filtered = filtered.filter((application) => {
                const salaryMin = application.job.salaryMin || 0;
                const salaryMax = application.job.salaryMax || 0;
                const avgSalary = (salaryMin + salaryMax) / 2;
                
                switch (salaryFilter) {
                    case "0-20000":
                        return avgSalary <= 20000;
                    case "20000-40000":
                        return avgSalary >= 20000 && avgSalary <= 40000;
                    case "40000-60000":
                        return avgSalary >= 40000 && avgSalary <= 60000;
                    case "60000-80000":
                        return avgSalary >= 60000 && avgSalary <= 80000;
                    case "80000+":
                        return avgSalary >= 80000;
                    default:
                        return true;
                }
            });
        }

        setFilteredJobs(filtered);
    };

    // Get unique values for dynamic filters
    const getUniqueCompanies = () => {
        const companies = [...new Set(appliedJobs.map(app => app.job.company?.name).filter(Boolean))];
        return [
            { value: "all", label: "All Companies" },
            ...companies.map(company => ({ value: company, label: company }))
        ];
    };

    const getUniqueLocations = () => {
        const locations = [...new Set(appliedJobs.map(app => app.job.location).filter(Boolean))];
        return [
            { value: "all", label: "All Locations" },
            ...locations.map(location => ({ value: location, label: location }))
        ];
    };

    const getUniqueJobTypes = () => {
        const jobTypes = [...new Set(appliedJobs.map(app => app.job.type).filter(Boolean))];
        return [
            { value: "all", label: "All Job Types" },
            ...jobTypes.map(type => ({ value: type, label: type }))
        ];
    };

    const handleSearchChange = (value) => {
        setSearchQuery(value);
    };

    const handleViewDetails = (application) => {
        setSelectedApplication(application);
        setIsDrawerOpen(true);
    };

    const clearAllFilters = () => {
        setSearchQuery("");
        setStatusFilter("all");
        setCompanyFilter("all");
        setLocationFilter("all");
        setJobTypeFilter("all");
        setDateFilter("all");
        setSalaryFilter("all");
    };

    const getActiveFilterCount = () => {
        let count = 0;
        if (statusFilter !== "all") count++;
        if (companyFilter !== "all") count++;
        if (locationFilter !== "all") count++;
        if (jobTypeFilter !== "all") count++;
        if (dateFilter !== "all") count++;
        if (salaryFilter !== "all") count++;
        return count;
    };

    const getStatusBadge = (status, applicationId) => {
        const statusConfig = {
            submitted: { label: "Submitted", color: "bg-blue-100 text-blue-800 border-blue-200" },
            under_review: { label: "Under Review", color: "bg-amber-100 text-amber-800 border-amber-200" },
            shortlisted: { label: "Shortlisted", color: "bg-purple-100 text-purple-800 border-purple-200" },
            accepted: { label: "Accepted", color: "bg-green-100 text-green-800 border-green-200" },
            rejected: { label: "Rejected", color: "bg-red-100 text-red-800 border-red-200" },
            hired: { label: "Hired", color: "bg-emerald-100 text-emerald-800 border-emerald-200" },
        };

        const config = statusConfig[status] || statusConfig.submitted;
        const isRecentlyUpdated = recentlyUpdated.has(applicationId);

        return (
            <Badge 
                variant="outline" 
                className={`${config.color} font-medium transition-all duration-500 ${
                    isRecentlyUpdated ? 'animate-pulse ring-2 ring-opacity-50 ring-current scale-110' : ''
                }`}
            >
                {config.label}
                {isRecentlyUpdated && (
                    <span className="ml-1 text-xs">🔄</span>
                )}
            </Badge>
        );
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "submitted":
                return <FileText className="h-4 w-4" />;
            case "under_review":
                return <Clock4 className="h-4 w-4" />;
            case "shortlisted":
                return <CheckCircle className="h-4 w-4 text-purple-600" />;
            case "accepted":
                return <CheckCircle className="h-4 w-4 text-green-600" />;
            case "rejected":
                return <XCircle className="h-4 w-4 text-red-600" />;
            case "hired":
                return <CheckCircle className="h-4 w-4 text-emerald-600" />;
            default:
                return <FileText className="h-4 w-4" />;
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

    const formatDateTime = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatTimeAgo = (date) => {
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);
        
        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        return `${Math.floor(diffInSeconds / 86400)}d ago`;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navigation />
            <Breadcrumb />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Debug Information */}
                <Card className="mb-4 border-blue-200 bg-blue-50">
                    <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="font-semibold text-blue-800 flex items-center gap-2">
                                    Application Status
                                    {socket?.connected && (
                                        <span className="flex items-center gap-1 text-sm font-normal text-green-700">
                                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                            Live Updates
                                        </span>
                                    )}
                                </h3>
                                <p className="text-sm text-blue-700">{debugInfo}</p>
                                {lastUpdate && (
                                    <p className="text-xs text-blue-600 mt-1">
                                        Last update: {formatTimeAgo(lastUpdate)} ({formatDateTime(lastUpdate)})
                                    </p>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <Button 
                                    onClick={loadAppliedJobs} 
                                    variant="outline" 
                                    size="sm"
                                    className="border-blue-300 text-blue-700"
                                >
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    Refresh
                                </Button>
                                <Button 
                                    onClick={testStatusUpdate} 
                                    variant="outline" 
                                    size="sm"
                                    className="border-green-300 text-green-700"
                                    disabled={appliedJobs.length === 0}
                                >
                                    Test Status Update
                                </Button>
                                {!socket?.connected && (
                                    <Button 
                                        onClick={() => socket?.connect()} 
                                        variant="outline" 
                                        size="sm"
                                        className="border-red-300 text-red-700"
                                    >
                                        Reconnect
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Hero Section */}
                <div className="text-center mb-12">
                    <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FileText className="h-10 w-10 text-green-600" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">My Job Applications</h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Track all your job applications and their current status in one place
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card className="border-0 shadow-md bg-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Applications</p>
                                    <p className="text-2xl font-bold text-gray-900">{appliedJobs.length}</p>
                                </div>
                                <div className="bg-blue-100 p-3 rounded-full">
                                    <FileText className="h-6 w-6 text-blue-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-md bg-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Under Review</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {appliedJobs.filter(app => app.status === 'under_review').length}
                                    </p>
                                </div>
                                <div className="bg-amber-100 p-3 rounded-full">
                                    <Clock4 className="h-6 w-6 text-amber-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-md bg-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Shortlisted</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {appliedJobs.filter(app => app.status === 'shortlisted').length}
                                    </p>
                                </div>
                                <div className="bg-purple-100 p-3 rounded-full">
                                    <CheckCircle className="h-6 w-6 text-purple-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-md bg-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Active Filters</p>
                                    <p className="text-2xl font-bold text-gray-900">{getActiveFilterCount()}</p>
                                </div>
                                <div className="bg-green-100 p-3 rounded-full">
                                    <Filter className="h-6 w-6 text-green-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Search and Filters */}
                <Card className="shadow-lg border-0 mb-8 bg-white">
                    <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
                        <CardTitle className="flex items-center justify-between text-xl text-gray-800">
                            <div className="flex items-center gap-2">
                                <Search className="h-5 w-5 text-green-600" />
                                Filter Applications
                            </div>
                            <div className="flex items-center gap-2">
                                {getActiveFilterCount() > 0 && (
                                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                                        {getActiveFilterCount()} active
                                    </Badge>
                                )}
                                <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="flex items-center gap-2"
                                >
                                    <Filter className="h-4 w-4" />
                                    {showFilters ? 'Hide Filters' : 'Show Filters'}
                                </Button>
                            </div>
                        </CardTitle>
                        <CardDescription>
                            {appliedJobs.length} total applications • {filteredJobs.length} filtered • Real-time updates enabled
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                        {/* Main Search */}
                        <div className="flex flex-col lg:flex-row gap-4 mb-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <Input
                                    type="text"
                                    placeholder="Search by job title, company, or location"
                                    className="pl-10 h-12 border-2 border-gray-200 focus:border-green-500"
                                    value={searchQuery}
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                />
                            </div>
                            <div className="w-full lg:w-64">
                                <Combobox
                                    options={statusOptions}
                                    value={statusFilter}
                                    onValueChange={setStatusFilter}
                                    placeholder="Filter by status"
                                    className="h-12 border-2 border-gray-200 focus:border-green-500"
                                />
                            </div>
                        </div>

                        {/* Advanced Filters */}
                        {showFilters && (
                            <div className="border-t border-gray-200 pt-4">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="font-semibold text-gray-700">Advanced Filters</h4>
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        onClick={clearAllFilters}
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                        <X className="h-4 w-4 mr-1" />
                                        Clear All
                                    </Button>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {/* Company Filter */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                                        <Combobox
                                            options={getUniqueCompanies()}
                                            value={companyFilter}
                                            onValueChange={setCompanyFilter}
                                            placeholder="All Companies"
                                            className="h-10"
                                        />
                                    </div>

                                    {/* Location Filter */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                                        <Combobox
                                            options={getUniqueLocations()}
                                            value={locationFilter}
                                            onValueChange={setLocationFilter}
                                            placeholder="All Locations"
                                            className="h-10"
                                        />
                                    </div>

                                    {/* Job Type Filter */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
                                        <Combobox
                                            options={getUniqueJobTypes()}
                                            value={jobTypeFilter}
                                            onValueChange={setJobTypeFilter}
                                            placeholder="All Job Types"
                                            className="h-10"
                                        />
                                    </div>

                                    {/* Date Filter */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Application Date</label>
                                        <Combobox
                                            options={dateOptions}
                                            value={dateFilter}
                                            onValueChange={setDateFilter}
                                            placeholder="Any Time"
                                            className="h-10"
                                        />
                                    </div>

                                    {/* Salary Filter */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Salary Range</label>
                                        <Combobox
                                            options={salaryOptions}
                                            value={salaryFilter}
                                            onValueChange={setSalaryFilter}
                                            placeholder="Any Salary"
                                            className="h-10"
                                        />
                                    </div>
                                </div>

                                {/* Active Filters Display */}
                                {getActiveFilterCount() > 0 && (
                                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                        <p className="text-sm font-medium text-gray-700 mb-2">Active Filters:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {statusFilter !== "all" && (
                                                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                                    Status: {statusOptions.find(opt => opt.value === statusFilter)?.label}
                                                </Badge>
                                            )}
                                            {companyFilter !== "all" && (
                                                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                                                    Company: {companyFilter}
                                                </Badge>
                                            )}
                                            {locationFilter !== "all" && (
                                                <Badge variant="secondary" className="bg-green-100 text-green-800">
                                                    Location: {locationFilter}
                                                </Badge>
                                            )}
                                            {jobTypeFilter !== "all" && (
                                                <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                                                    Job Type: {jobTypeFilter}
                                                </Badge>
                                            )}
                                            {dateFilter !== "all" && (
                                                <Badge variant="secondary" className="bg-red-100 text-red-800">
                                                    Date: {dateOptions.find(opt => opt.value === dateFilter)?.label}
                                                </Badge>
                                            )}
                                            {salaryFilter !== "all" && (
                                                <Badge variant="secondary" className="bg-indigo-100 text-indigo-800">
                                                    Salary: {salaryOptions.find(opt => opt.value === salaryFilter)?.label}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Applications List */}
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-gray-900">
                            {filteredJobs.length} Application{filteredJobs.length !== 1 ? "s" : ""} Found
                        </h2>
                        {searchQuery && (
                            <p className="text-gray-600">Results for "{searchQuery}"</p>
                        )}
                    </div>

                    {loading ? (
                        <div className="space-y-4">
                            {[...Array(3)].map((_, i) => (
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
                        <Card className="border-0 shadow-md text-center py-12">
                            <CardContent>
                                <div className="max-w-md mx-auto">
                                    <FileText className="h-20 w-20 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-2xl font-semibold text-gray-700 mb-3">
                                        {appliedJobs.length === 0 ? "No Applications Yet" : "No Matching Applications"}
                                    </h3>
                                    <p className="text-gray-600 mb-6 text-lg">
                                        {appliedJobs.length === 0 
                                            ? "You haven't applied to any jobs yet. Start browsing available positions and submit your applications!" 
                                            : "No applications match your current filters. Try adjusting your search criteria."
                                        }
                                    </p>
                                    {appliedJobs.length === 0 && (
                                        <Button asChild className="bg-green-600 hover:bg-green-700 text-white h-12 px-6 text-lg shadow-md">
                                            <Link to="/jobs">
                                                <Briefcase className="h-5 w-5 mr-2" />
                                                Browse Available Jobs
                                            </Link>
                                        </Button>
                                    )}
                                    {appliedJobs.length > 0 && (
                                        <Button 
                                            onClick={clearAllFilters}
                                            variant="outline" 
                                            className="h-12 px-6 text-lg border-gray-300"
                                        >
                                            Clear All Filters
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {filteredJobs.map((application) => (
                                <Card 
                                    key={application.id} 
                                    className="hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-200 hover:border-green-300 group"
                                    onClick={() => handleViewDetails(application)}
                                >
                                    <CardContent className="p-6">
                                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                                            <div className="flex-1">
                                                <div className="flex items-start justify-between mb-3">
                                                    <h3 className="text-xl font-bold text-gray-900">{application.job.title}</h3>
                                                    {getStatusBadge(application.status, application.id || application.applicationId)}
                                                </div>
                                                
                                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                                                    <div className="flex items-center gap-2">
                                                        <Building2 className="h-4 w-4" />
                                                        <span className="font-medium">{application.job.company?.name}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="h-4 w-4" />
                                                        <span>{application.job.location}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="h-4 w-4" />
                                                        <span>{application.job.type}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                            <div className="flex items-center gap-2 text-lg font-bold text-green-600">
                                                <DollarSign className="h-5 w-5" />
                                                <span>{formatSalary(application.job)}</span>
                                            </div>
                                            
                                            <div className="flex flex-wrap items-center gap-2">
                                                <div className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full flex items-center gap-2">
                                                    <Calendar className="h-4 w-4" />
                                                    <span>Applied {formatDate(application.applicationDate)}</span>
                                                </div>
                                                <Button 
                                                    variant="outline" 
                                                    size="sm" 
                                                    className="flex items-center gap-2 border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleViewDetails(application);
                                                    }}
                                                >
                                                    <Eye className="h-4 w-4" />
                                                    View Details
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Application Details Drawer */}
            <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                <DrawerContent className="border-0 max-h-[90vh]">
                    <div className="mx-auto w-full max-w-4xl h-full flex flex-col bg-white rounded-t-2xl overflow-hidden">
                        <DrawerHeader className="flex-shrink-0 bg-gradient-to-r from-green-50 to-emerald-50 border-b p-6">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <DrawerTitle className="text-2xl font-bold text-gray-900 mb-2">
                                        {selectedApplication?.job.title}
                                    </DrawerTitle>
                                    <DrawerDescription className="text-gray-600">
                                        <div className="flex flex-wrap gap-4 mt-2">
                                            <div className="flex items-center gap-2">
                                                <Building2 className="h-4 w-4" />
                                                <span className="font-medium">{selectedApplication?.job.company?.name}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <MapPin className="h-4 w-4" />
                                                <span>{selectedApplication?.job.location}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {getStatusIcon(selectedApplication?.status)}
                                                {selectedApplication && getStatusBadge(selectedApplication.status, selectedApplication.id || selectedApplication.applicationId)}
                                            </div>
                                        </div>
                                    </DrawerDescription>
                                </div>
                            </div>
                        </DrawerHeader>

                        <div className="flex-1 overflow-y-auto px-6 py-4">
                            {selectedApplication && (
                                <div className="space-y-6 pb-6">
                                    {/* Application Overview */}
                                    <Card className="border border-gray-200 shadow-sm">
                                        <CardHeader className="bg-green-50 border-b">
                                            <CardTitle className="flex items-center gap-2 text-gray-800">
                                                <FileText className="h-5 w-5 text-green-600" />
                                                Application Overview
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-3">
                                                    <div className="flex justify-between items-center py-1 border-b border-gray-100">
                                                        <span className="text-gray-600">Application ID:</span>
                                                        <span className="font-medium text-gray-900">{selectedApplication.applicationId}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center py-1 border-b border-gray-100">
                                                        <span className="text-gray-600">Applied Date:</span>
                                                        <span className="font-medium text-gray-900">
                                                            {formatDateTime(selectedApplication.applicationDate)}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between items-center py-1 border-b border-gray-100">
                                                        <span className="text-gray-600">Job Type:</span>
                                                        <span className="font-medium text-gray-900">{selectedApplication.job.type}</span>
                                                    </div>
                                                </div>
                                                <div className="space-y-3">
                                                    <div className="flex justify-between items-center py-1 border-b border-gray-100">
                                                        <span className="text-gray-600">Salary Range:</span>
                                                        <span className="font-medium text-green-600">{formatSalary(selectedApplication.job)}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center py-1 border-b border-gray-100">
                                                        <span className="text-gray-600">Industry:</span>
                                                        <span className="font-medium text-gray-900">
                                                            {selectedApplication.job.company?.industry || "Not specified"}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between items-center py-1">
                                                        <span className="text-gray-600">Job Posted:</span>
                                                        <span className="font-medium text-gray-900">
                                                            {formatDate(selectedApplication.job.createdAt)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Submitted Documents */}
                                    <Card className="border border-gray-200 shadow-sm">
                                        <CardHeader className="bg-green-50 border-b">
                                            <CardTitle className="flex items-center gap-2 text-gray-800">
                                                <FileText className="h-5 w-5 text-green-600" />
                                                Submitted Documents
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-4">
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200">
                                                    <div className="flex items-center gap-3">
                                                        <FileText className="h-8 w-8 text-green-600" />
                                                        <div>
                                                            <p className="font-medium text-gray-900">
                                                                {selectedApplication.resume.fileName}
                                                            </p>
                                                            <p className="text-sm text-gray-600">
                                                                {selectedApplication.resume.docType} • Submitted on {formatDate(selectedApplication.applicationDate)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <Button variant="outline" size="sm" className="border-gray-300">
                                                        <Download className="h-4 w-4 mr-2" />
                                                        Download
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Cover Letter */}
                                    {selectedApplication.coverLetter && (
                                        <Card className="border border-gray-200 shadow-sm">
                                            <CardHeader className="bg-green-50 border-b">
                                                <CardTitle className="flex items-center gap-2 text-gray-800">
                                                    <Mail className="h-5 w-5 text-green-600" />
                                                    Your Cover Letter
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-4">
                                                <p className="whitespace-pre-wrap text-gray-700 leading-relaxed bg-gray-50 p-4 rounded border">
                                                    {selectedApplication.coverLetter}
                                                </p>
                                            </CardContent>
                                        </Card>
                                    )}

                                    {/* Job Description */}
                                    <Card className="border border-gray-200 shadow-sm">
                                        <CardHeader className="bg-green-50 border-b">
                                            <CardTitle className="text-gray-800">Job Description</CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-4">
                                            <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                                                {selectedApplication.job.description}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </div>
                            )}
                        </div>

                        {/* Fixed Button Section */}
                        <div className="flex-shrink-0 border-t bg-white p-6 shadow-lg">
                            <div className="flex flex-col sm:flex-row gap-3">
                                <Button 
                                    className="flex-1 h-12 text-lg bg-green-600 hover:bg-green-700 text-white shadow-md"
                                    asChild
                                >
                                    <Link to="/jobs">
                                        <Briefcase className="h-5 w-5 mr-2" />
                                        Browse More Jobs
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </DrawerContent>
            </Drawer>

            <Footer />
        </div>
    );
}

export default AppliedJobsPage;