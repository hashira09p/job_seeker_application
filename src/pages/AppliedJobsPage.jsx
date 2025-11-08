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
    ArrowRight,
    Download,
    Mail,
    Phone,
    User,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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

function AppliedJobsPage() {
    const [appliedJobs, setAppliedJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const URL = "http://localhost:3000";

    // Sample data for demonstration
    const sampleAppliedJobs = [
        {
            id: 1,
            applicationId: "APP-001",
            job: {
                id: 101,
                title: "Senior Frontend Developer",
                company: {
                    name: "TechCorp Philippines",
                    industry: "Technology"
                },
                location: "Manila",
                type: "Full-time",
                salaryMin: 60000,
                salaryMax: 90000,
                description: "We are looking for an experienced Frontend Developer to join our growing team...",
                status: "active",
                createdAt: "2024-01-15T00:00:00.000Z"
            },
            applicationDate: "2024-01-20T10:30:00.000Z",
            status: "submitted",
            coverLetter: "I am very interested in this position and believe my skills align perfectly with your requirements...",
            resume: {
                fileName: "john_doe_resume.pdf",
                docType: "Resume"
            }
        },
        {
            id: 2,
            applicationId: "APP-002",
            job: {
                id: 102,
                title: "Product Manager",
                company: {
                    name: "Innovate Solutions Inc",
                    industry: "Software"
                },
                location: "Cebu",
                type: "Full-time",
                salaryMin: 70000,
                salaryMax: 100000,
                description: "Join our product team to drive innovation and deliver exceptional user experiences...",
                status: "active",
                createdAt: "2024-01-10T00:00:00.000Z"
            },
            applicationDate: "2024-01-18T14:20:00.000Z",
            status: "under_review",
            coverLetter: "With 5 years of product management experience, I am excited about the opportunity to contribute to your team...",
            resume: {
                fileName: "john_doe_updated_resume.pdf",
                docType: "Resume"
            }
        },
        {
            id: 3,
            applicationId: "APP-003",
            job: {
                id: 103,
                title: "UX/UI Designer",
                company: {
                    name: "Creative Studio Co",
                    industry: "Design"
                },
                location: "Remote",
                type: "Contract",
                salaryMin: 45000,
                salaryMax: 65000,
                description: "We need a creative UX/UI Designer to help us build beautiful and functional interfaces...",
                status: "active",
                createdAt: "2024-01-05T00:00:00.000Z"
            },
            applicationDate: "2024-01-12T09:15:00.000Z",
            status: "accepted",
            coverLetter: "As a passionate designer with a strong portfolio, I would love to bring my skills to your creative team...",
            resume: {
                fileName: "john_doe_design_portfolio.pdf",
                docType: "Portfolio"
            }
        },
        {
            id: 4,
            applicationId: "APP-004",
            job: {
                id: 104,
                title: "Backend Engineer",
                company: {
                    name: "DataSystems Ltd",
                    industry: "Technology"
                },
                location: "Taguig",
                type: "Full-time",
                salaryMin: 65000,
                salaryMax: 95000,
                description: "Looking for a skilled Backend Engineer to work on our scalable systems...",
                status: "active",
                createdAt: "2024-01-08T00:00:00.000Z"
            },
            applicationDate: "2024-01-25T16:45:00.000Z",
            status: "rejected",
            coverLetter: "I have extensive experience in backend development and am excited about this opportunity...",
            resume: {
                fileName: "john_doe_technical_resume.pdf",
                docType: "Resume"
            }
        },
        {
            id: 5,
            applicationId: "APP-005",
            job: {
                id: 105,
                title: "Marketing Specialist",
                company: {
                    name: "Growth Marketing Agency",
                    industry: "Marketing"
                },
                location: "Quezon City",
                type: "Part-time",
                salaryMin: 30000,
                salaryMax: 40000,
                description: "Join our dynamic marketing team to drive brand awareness and customer engagement...",
                status: "active",
                createdAt: "2024-01-20T00:00:00.000Z"
            },
            applicationDate: "2024-01-28T11:20:00.000Z",
            status: "submitted",
            coverLetter: "With my background in digital marketing, I believe I can help your team achieve its goals...",
            resume: {
                fileName: "john_doe_marketing_cv.pdf",
                docType: "CV"
            }
        }
    ];

    const statusOptions = [
        { value: "all", label: "All Applications" },
        { value: "submitted", label: "Submitted" },
        { value: "under_review", label: "Under Review" },
        { value: "accepted", label: "Accepted" },
        { value: "rejected", label: "Rejected" },
    ];

    const sortOptions = [
        { value: "latest", label: "Latest First" },
        { value: "oldest", label: "Oldest First" },
        { value: "company", label: "Company Name" },
        { value: "job_title", label: "Job Title" },
    ];

    useEffect(() => {
        loadAppliedJobs();
    }, []);

    useEffect(() => {
        filterApplications();
    }, [appliedJobs, searchQuery, statusFilter]);

    const loadAppliedJobs = async () => {
        try {
            setLoading(true);
            // For now, using sample data. Replace with actual API call later:
            // const response = await axios.get(`${URL}/user/applications`, {
            //     headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            // });
            // setAppliedJobs(response.data.applications || []);
            
            setAppliedJobs(sampleAppliedJobs);
            setFilteredJobs(sampleAppliedJobs);
        } catch (error) {
            console.error("Error loading applied jobs:", error);
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

        setFilteredJobs(filtered);
    };

    const handleSearchChange = (value) => {
        setSearchQuery(value);
    };

    const handleViewDetails = (application) => {
        setSelectedApplication(application);
        setIsDrawerOpen(true);
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            submitted: { label: "Submitted", color: "bg-blue-100 text-blue-800 border-blue-200" },
            under_review: { label: "Under Review", color: "bg-amber-100 text-amber-800 border-amber-200" },
            accepted: { label: "Accepted", color: "bg-green-100 text-green-800 border-green-200" },
            rejected: { label: "Rejected", color: "bg-red-100 text-red-800 border-red-200" },
        };

        const config = statusConfig[status] || statusConfig.submitted;

        return (
            <Badge variant="outline" className={`${config.color} font-medium`}>
                {config.label}
            </Badge>
        );
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "submitted":
                return <FileText className="h-4 w-4" />;
            case "under_review":
                return <Clock4 className="h-4 w-4" />;
            case "accepted":
                return <CheckCircle className="h-4 w-4" />;
            case "rejected":
                return <XCircle className="h-4 w-4" />;
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

    return (
        <div className="min-h-screen bg-gray-50">
            <Navigation />
            <Breadcrumb />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                                    <p className="text-sm font-medium text-gray-600">Accepted</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {appliedJobs.filter(app => app.status === 'accepted').length}
                                    </p>
                                </div>
                                <div className="bg-green-100 p-3 rounded-full">
                                    <CheckCircle className="h-6 w-6 text-green-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-md bg-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Recent Applications</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {appliedJobs.filter(app => 
                                            new Date(app.applicationDate) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                                        ).length}
                                    </p>
                                </div>
                                <div className="bg-purple-100 p-3 rounded-full">
                                    <Calendar className="h-6 w-6 text-purple-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Search and Filters */}
                <Card className="shadow-lg border-0 mb-8 bg-white">
                    <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
                        <CardTitle className="flex items-center gap-2 text-xl text-gray-800">
                            <Search className="h-5 w-5 text-green-600" />
                            Filter Applications
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <Input
                                    type="text"
                                    placeholder="Search by job title, company, or location"
                                    className="pl-10 h-12 border-2 border-gray-200 focus:border-green-500"
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
                                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                    {appliedJobs.length === 0 ? "No applications yet" : "No matching applications found"}
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    {appliedJobs.length === 0 
                                        ? "Start applying to jobs to see them here!" 
                                        : "Try adjusting your search criteria to see more results."
                                    }
                                </p>
                                {appliedJobs.length === 0 && (
                                    <Button asChild className="bg-green-600 hover:bg-green-700 text-white">
                                        <Link to="/jobs">
                                            <Briefcase className="h-4 w-4 mr-2" />
                                            Browse Jobs
                                        </Link>
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {filteredJobs.map((application) => (
                                <Card 
                                    key={application.id} 
                                    className="hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-200 hover:border-green-300"
                                    onClick={() => handleViewDetails(application)}
                                >
                                    <CardContent className="p-6">
                                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                                            <div className="flex-1">
                                                <div className="flex items-start justify-between mb-3">
                                                    <h3 className="text-xl font-bold text-gray-900">{application.job.title}</h3>
                                                    {getStatusBadge(application.status)}
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

                                                {application.job.company?.industry && (
                                                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                                                        <span>Industry: {application.job.company.industry}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                            <div className="flex items-center gap-2 text-lg font-bold text-green-600">
                                                <DollarSign className="h-5 w-5" />
                                                <span>{formatSalary(application.job)}</span>
                                            </div>
                                            
                                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                                <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full">
                                                    <Calendar className="h-4 w-4" />
                                                    <span>Applied {formatDate(application.applicationDate)}</span>
                                                </div>
                                                <Button 
                                                    variant="outline" 
                                                    size="sm" 
                                                    className="flex items-center gap-2"
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
                                                {getStatusBadge(selectedApplication?.status)}
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
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button 
                                    className="flex-1 h-14 text-lg bg-green-600 hover:bg-green-700 text-white shadow-md"
                                    asChild
                                >
                                    <Link to="/jobs">
                                        <Briefcase className="h-5 w-5 mr-2" />
                                        Browse More Jobs
                                    </Link>
                                </Button>
                                <Button 
                                    variant="outline" 
                                    size="lg" 
                                    className="h-14 border-gray-300 text-gray-700 hover:bg-gray-50"
                                    asChild
                                >
                                    <Link to="/profile">
                                        <User className="h-5 w-5 mr-2" />
                                        Update Profile
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