import React, { useState, useEffect} from 'react';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/ui/data-table";
import {
  Select, SelectTrigger, SelectContent, SelectItem, SelectValue
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter,
  DrawerHeader, DrawerTitle, DrawerTrigger
} from "@/components/ui/drawer";
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton,
  SidebarMenuItem, SidebarProvider, SidebarTrigger
} from "@/components/ui/sidebar";
import {
  ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent
} from "@/components/ui/chart";
import {
  Users, UserPlus, Briefcase, BriefcaseMedical, FileText, TrendingUp, Search,
  Filter, MoreHorizontal, Eye, Edit, Trash2, Calendar, Mail, Phone, MapPin,
  Building, DollarSign, Clock, BarChart3, Settings, Home, Menu, Download, Star,
  Target, Award, CheckCircle, XCircle, Clock3, UserCheck, UserX, MessageSquare,
  ExternalLink, Upload, Sparkles, AlertCircle, ArrowLeft, Plus, LogOut
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

function CompanyDashboardPage() {
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isEditJobOpen, setIsEditJobOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const navigate = useNavigate();
  const URL = "http://localhost:3000";

  // Form validation states
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Resume Parser states
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [extractedSkills, setExtractedSkills] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [parsedData, setParsedData] = useState(null);
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  
  const [createJobPosting, setCreateJobPosting] = useState({
    title: "",
    description: "",
    location: "",
    type: "",
    salaryMin: "",
    salaryMax: ""
  });

  // Job postings state
  const [jobPostings, setJobPostings] = useState([]);
  // Real applicants state
  const [applicants, setApplicants] = useState([]);
  // Applicants for selected job
  const [jobApplicants, setJobApplicants] = useState([]);

  // Search state for job applicants view - ONLY search remains
  const [searchTerm, setSearchTerm] = useState('');

  // Logout function
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('token');
      navigate('/');
    }
  };

  // Form validation
  const validateForm = (formData) => {
    const errors = {};
    
    if (!formData.title?.trim()) errors.title = "Job title is required";
    if (!formData.description?.trim()) errors.description = "Job description is required";
    if (!formData.location?.trim()) errors.location = "Location is required";
    if (!formData.type?.trim()) errors.type = "Job type is required";
    if (!formData.salaryMin) errors.salaryMin = "Minimum salary is required";
    if (!formData.salaryMax) errors.salaryMax = "Maximum salary is required";
    
    if (formData.salaryMin && formData.salaryMax) {
      if (parseInt(formData.salaryMin) > parseInt(formData.salaryMax)) {
        errors.salaryRange = "Minimum salary cannot be higher than maximum salary";
      }
      if (parseInt(formData.salaryMin) < 0 || parseInt(formData.salaryMax) < 0) {
        errors.salaryNegative = "Salary cannot be negative";
      }
    }

    return errors;
  };

  // Update applicant status function - FIXED
  const updateApplicantStatus = async (applicantId, newStatus) => {
    const token = localStorage.getItem("token");
    console.log("Updating applicant:", applicantId, "to status:", newStatus);
    
    try {
      const result = await axios.patch(
        `${URL}/applicants/${applicantId}`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      console.log("Status updated successfully:", result.data);
      return true;
    } catch (err) {
      console.log("Error updating applicant status:", err.message);
      alert("Error updating applicant status. Please try again.");
      return false;
    }
  };

  // FIXED: Handle status update with proper ID comparison
  const handleStatusUpdate = async (newStatus) => {
    if (!selectedApplicant) return;

    // Use applicantId if available, otherwise fall back to userID or id
    const applicantId = selectedApplicant.applicantId || selectedApplicant.id || selectedApplicant.userID;
    
    const success = await updateApplicantStatus(applicantId, newStatus);
    
    if (success) {
      // Update the applicant status in local state - use the same ID logic
      const updatedApplicants = applicants.map(applicant => {
        const currentApplicantId = applicant.applicantId || applicant.id || applicant.userID;
        return currentApplicantId === applicantId 
          ? { ...applicant, status: newStatus }
          : applicant;
      });
      setApplicants(updatedApplicants);

      // Update job applicants if we're in the job applicants view
      if (selectedJob) {
        const updatedJobApplicants = jobApplicants.map(applicant => {
          const currentApplicantId = applicant.applicantId || applicant.id || applicant.userID;
          return currentApplicantId === applicantId
            ? { ...applicant, status: newStatus }
            : applicant;
        });
        setJobApplicants(updatedJobApplicants);
      }

      // Update the selected applicant in the drawer
      setSelectedApplicant(prev => prev ? { ...prev, status: newStatus } : null);
      
      alert(`Applicant status updated to ${newStatus}`);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCreateJobPosting({
      ...createJobPosting,
      [name]: value
    });
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const errors = validateForm(createJobPosting);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setIsSubmitting(false);
      return;
    }

    const token = localStorage.getItem("token");
    try {
      const result = await axios.post(`${URL}/jobPostingSubmit`, {
        title: createJobPosting.title,
        description: createJobPosting.description,
        location: createJobPosting.location,
        type: createJobPosting.type,
        salaryMin: createJobPosting.salaryMin,
        salaryMax: createJobPosting.salaryMax
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert("Job post created successfully! Please standby and wait for the admin's approval before it is officially posted on the Job Seeker side.");

      if (result.data && result.data.job) {
        setJobPostings(prev => [...prev, result.data.job]);
      } else {
        const newJob = {
          id: Date.now(),
          title: createJobPosting.title,
          location: createJobPosting.location,
          type: createJobPosting.type,
          status: 'active',
          salaryMin: createJobPosting.salaryMin,
          salaryMax: createJobPosting.salaryMax,
          createdAt: new Date().toISOString().split('T')[0],
          applicants: []
        };
        setJobPostings(prev => [...prev, newJob]);
      }
      
      // Reset form
      setCreateJobPosting({
        title: "",
        description: "",
        location: "",
        type: "",
        salaryMin: "",
        salaryMax: ""
      });
      setFormErrors({});
      
    } catch (err) {
      alert("Error creating job posting. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/")
        return;
      }

      try{
        const result = await axios.get(`${URL}/companyDashboard`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log("Backend response:", result.data);
        
        if(result.data.role == "JobSeeker"){
          navigate("/")
        }else{
          setUser(result.data);
          setJobPostings(result.data.jobPostings || []);
          
          // FIXED: Properly extract applicants from jobPostings
          const allApplicants = result.data.jobPostings?.flatMap(job => 
            (job.applicants || []).map(applicant => ({
              ...applicant,
              applicantId: applicant.id || applicant.applicantId, // Use consistent ID
              jobId: job.id,
              position: job.title,
              // Ensure all required fields have fallbacks
              name: applicant.name || 'Unknown Applicant',
              email: applicant.email || '',
              status: applicant.status || 'pending',
              // Use createdAt from database for applied date
              appliedDate: applicant.createdAt ? new Date(applicant.createdAt).toLocaleDateString() : 'Not specified',
              createdAt: applicant.createdAt || applicant.appliedDate || new Date().toISOString()
            }))
          ) || [];
          
          console.log("Extracted applicants:", allApplicants);
          setApplicants(allApplicants);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        navigate("/login")
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [navigate]);

  // Add debug effect to check data flow
  useEffect(() => {
    console.log("Job Postings:", jobPostings);
    console.log("Applicants:", applicants);
    console.log("Stats:", stats);
  }, [jobPostings, applicants]);

  // Fetch applicants for a specific job from backend - FIXED
  const fetchJobApplicants = async (jobId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`${URL}/jobPostings/${jobId}/applicants`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Ensure each applicant has a consistent ID
      const applicantsWithIds = (response.data.applicants || []).map(applicant => ({
        ...applicant,
        applicantId: applicant.id, // Store the applicant ID consistently
        jobId: jobId,
        position: response.data.job?.title || selectedJob?.title || "",
        // Use createdAt from database for applied date
        appliedDate: applicant.createdAt ? new Date(applicant.createdAt).toLocaleDateString() : 'Not specified'
      }));

      return applicantsWithIds;
    } catch (error) {
      console.error("Error fetching job applicants:", error);
      return [];
    }
  };

  // Download the Applicants Resume
  const handleDownloadResume = async (applicant) => {
    const token = localStorage.getItem("token");
    console.log(applicant.Document?.id)

    const applicantDocumentId = applicant.Document?.id;
    
    if (!applicantDocumentId) {
      console.error('No document ID found for applicant:', applicant);
      alert('Resume document not found for this applicant');
      return;
    }

    try {
      const response = await axios.get(`${URL}/applicants/resume/${applicantDocumentId}`, {
        headers: { 
          Authorization: `Bearer ${token}` 
        },
        responseType: 'blob'
      });

      const contentDisposition = response.headers['content-disposition'];
      let fileName = `${applicant.name.replace(/\s+/g, '_')}_resume`;
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          fileName = filenameMatch[1];
        }
      }

      const contentType = response.headers['content-type'];
      if (!fileName.includes('.') && contentType) {
        if (contentType.includes('pdf')) {
          fileName += '.pdf';
        } else if (contentType.includes('word') || contentType.includes('docx')) {
          fileName += '.docx';
        } else if (contentType.includes('msword')) {
          fileName += '.doc';
        }
      }

      const blob = new Blob([response.data], { 
        type: contentType || 'application/octet-stream'
      });
    
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
    
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    
      console.log('Resume downloaded successfully:', fileName);
    
    } catch (error) {
      console.error('Error downloading resume:', error);
    
      if (error.response?.status === 404) {
        alert(`Resume not found for ${applicant.name}`);
      } else if (error.response?.status === 500) {
        alert('Server error while downloading resume. Please try again.');
      } else if (error.response?.status === 401) {
        alert('Authentication failed. Please log in again.');
      } else {
        alert('Error downloading resume. Please try again.');
      }
    }
  };

  // Calculate statistics based on real data - IMPROVED
  const stats = {
    totalJobs: jobPostings.length,
    totalApplicants: applicants.length,
    pendingApplications: applicants.filter(a => a.status === 'pending' || !a.status).length,
    shortlistedCandidates: applicants.filter(a => a.status === 'shortlisted').length,
    interviewedCandidates: applicants.filter(a => a.status === 'interviewed').length,
    hiredCandidates: applicants.filter(a => a.status === 'hired').length,
    rejectedCandidates: applicants.filter(a => a.status === 'rejected').length,
    pendingJobPostings: jobPostings.filter(job => !job.reviewed || job.status === 'pending').length
  }

  // Chart data based on real applicants
  const applicationStatusData = [
    { name: 'Pending', value: stats.pendingApplications, fill: '#fbbf24' },
    { name: 'Shortlisted', value: stats.shortlistedCandidates, fill: '#3b82f6' },
    { name: 'Interviewed', value: stats.interviewedCandidates, fill: '#8b5cf6' },
    { name: 'Hired', value: stats.hiredCandidates, fill: '#10b981' },
    { name: 'Rejected', value: stats.rejectedCandidates, fill: '#ef4444' }
  ]

  // Job performance data based on real applicants
  const jobPerformanceData = jobPostings.map(job => {
    const jobApplicants = applicants.filter(app => app.jobId === job.id);
    return {
      name: job.title,
      applications: jobApplicants.length
    };
  }).sort((a, b) => b.applications - a.applications).slice(0, 3);

  const chartConfig = {
    value: {
      label: "Applications",
      color: "hsl(var(--primary))",
    },
    applications: {
      label: "Applications",
      color: "hsl(var(--primary))",
    }
  }

  const sidebarItems = [
    {
      title: "Dashboard",
      icon: BarChart3,
      view: "dashboard"
    },
    {
      title: "Job Postings",
      icon: Briefcase,
      view: "jobs"
    },
    {
      title: "Resume Parser",
      icon: Target,
      view: "resume-parser"
    },
    {
      title: "Create Job Posting",
      icon: Plus,
      view: "create-job-posting"
    }
  ]

  // Job posting management functions
  const handleEditJob = async (jobId, updatedData) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(`${URL}/jobPostings/${jobId}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Job updated successfully");
      return true;
    } catch (err) {
      console.log("Error updating job:", err);
      alert("Error updating job posting. Please try again.");
      return false;
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job posting?')) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`${URL}/jobPostings/${jobId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert("Job deleted successfully");
        return true;
      } catch (err) {
        console.log("Error deleting job:", err);
        alert("Error deleting job posting. Please try again.");
        return false;
      }
    }
    return false;
  };

  // Column definitions for job postings table
  const jobPostingsColumns = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => <div className="font-medium">#{row.getValue("id")}</div>,
    },
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "location",
      header: "Location",
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => {
        const type = row.getValue("type");
        return (
          <Badge variant="secondary" className="capitalize">
            {type || 'Not specified'}
          </Badge>
        );
      },
    },
    {
      accessorKey: "applicants",
      header: "Applicants",
      cell: ({ row }) => {
        const jobApplicants = applicants.filter(app => app.jobId === row.original.id);
        return (
          <div 
            className="cursor-pointer hover:text-primary hover:underline font-medium"
            onClick={() => handleViewJobApplicants(row.original)}
          >
            {jobApplicants.length} applicants
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => getStatusBadge(row.getValue("status")),
    },
    {
      accessorKey: "reviewed",
      header: "Reviewed",
      cell: ({ row }) => (
        <Badge 
          variant="outline" 
          className={row.getValue("reviewed") ? 'bg-green-50 text-green-700 border-green-200' : 'bg-amber-50 text-amber-700 border-amber-200'}
        >
          {row.getValue("reviewed") ? 'Yes' : 'No'}
        </Badge>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Posted Date",
      cell: ({ row }) => {
        const date = row.getValue("createdAt");
        return <div>{date ? new Date(date).toLocaleDateString() : 'Not specified'}</div>;
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const job = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 w-8 p-0 hover:bg-blue-50 border-blue-200"
              onClick={() => handleEditJobClick(job)}
              title="Edit Job"
            >
              <Edit className="h-4 w-4 text-blue-600" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 w-8 p-0 hover:bg-red-50 border-red-200"
              onClick={() => handleDeleteJobClick(job.id)}
              title="Delete Job"
            >
              <Trash2 className="h-4 w-4 text-red-600" />
            </Button>
          </div>
        );
      },
    },
  ];

  // Column definitions for applicants table
  const applicantsColumns = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "position",
      header: "Position",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status")
        return (
          <div className="flex items-center gap-2">
            {getStatusIcon(status)}
            {getStatusBadge(status)}
          </div>
        )
      },
    },
    {
      accessorKey: "appliedDate",
      header: "Applied Date",
      cell: ({ row }) => {
        const appliedDate = row.getValue("appliedDate");
        return <div>{appliedDate || 'Not specified'}</div>;
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 w-8 p-0 hover:bg-green-50 border-green-200"
            onClick={() => handleApplicantClick(row.original)}
            title="View Applicant"
          >
            <Eye className="h-4 w-4 text-green-600" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 w-8 p-0 hover:bg-blue-50 border-blue-200"
            onClick={() => handleDownloadResume(row.original)}
            title="Download Resume"
            disabled={!row.original.Document?.id}
          >
            <Download className="h-4 w-4 text-blue-600" />
          </Button>
        </div>
      ),
    },
  ];

  // Handler functions
  const handleEditJobClick = (job) => {
    setEditingJob(job);
    setIsEditJobOpen(true);
  };

  const handleDeleteJobClick = async (jobId) => {
    const success = await handleDeleteJob(jobId);
    if (success) {
      setJobPostings(prev => prev.filter(job => job.id !== jobId));
      setApplicants(prev => prev.filter(app => app.jobId !== jobId));
    }
  };

  // FIXED: Handle view job applicants with consistent IDs
  const handleViewJobApplicants = async (job) => {
    setSelectedJob(job);
    const jobApplicantsData = await fetchJobApplicants(job.id);

    console.log("Job applicants data:", jobApplicantsData);
    setJobApplicants(jobApplicantsData);
    setActiveView('job-applicants');
  };

  const handleUpdateJob = async (updatedJob) => {
    const success = await handleEditJob(updatedJob.id, updatedJob);
    if (success) {
      setJobPostings(prev => prev.map(job => 
        job.id === updatedJob.id ? updatedJob : job
      ));
      setIsEditJobOpen(false);
      setEditingJob(null);
    }
  };

  const handleApplicantClick = (applicant) => {
    setSelectedApplicant(applicant)
    setIsDrawerOpen(true)
  }

  const handleBackToJobs = () => {
    setSelectedJob(null);
    setJobApplicants([]);
    setActiveView('jobs');
  };

  // Resume Parser functions
  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      setUploadedFile(file)
      setIsUploading(true)
      setUploadProgress(0)
      
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval)
            setIsUploading(false)
            analyzeResume(file)
            return 100
          }
          return prev + 10
        })
      }, 200)
    }
  }

  const analyzeResume = async (file) => {
    setIsAnalyzing(true)
    
    setTimeout(() => {
      const mockSkills = [
        "React", "JavaScript", "Node.js", "Python", "TypeScript", 
        "AWS", "Docker", "Git", "MongoDB", "PostgreSQL", "CSS", "HTML",
        "Project Management", "Team Leadership", "Agile", "Scrum"
      ]
      
      const mockParsedData = {
        name: "Joshua Dee Tulali",
        email: "joshua.tulali@email.com",
        phone: "+63 9151 68 0095",
        experience: "5 years",
        education: "BS Computer Science",
        skills: mockSkills,
        summary: "Experienced software engineer with 5 years of experience in full-stack development.",
        workExperience: [
          {
            company: "TechCorp Philippines",
            position: "Senior Software Engineer",
            duration: "2022 - Present",
            description: "Led development of web applications using React and Node.js"
          }
        ]
      }
      
      setExtractedSkills(mockSkills)
      setParsedData(mockParsedData)
      setAnalysisComplete(true)
      setIsAnalyzing(false)
    }, 3000)
  }

  const removeFile = () => {
    setUploadedFile(null)
    setUploadProgress(0)
    setExtractedSkills([])
    setParsedData(null)
    setAnalysisComplete(false)
  }

  const getStatusBadge = (status) => {
    const variants = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      shortlisted: 'bg-blue-100 text-blue-800 border-blue-200',
      interviewed: 'bg-purple-100 text-purple-800 border-purple-200',
      hired: 'bg-green-100 text-green-800 border-green-200',
      rejected: 'bg-red-100 text-red-800 border-red-200',
      active: 'bg-green-100 text-green-800 border-green-200',
      closed: 'bg-gray-100 text-gray-800 border-gray-200'
    }
    return <Badge className={`${variants[status]} capitalize border`}>{status}</Badge>
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock3 className="h-4 w-4 text-yellow-600" />
      case 'shortlisted': return <UserCheck className="h-4 w-4 text-blue-600" />
      case 'interviewed': return <MessageSquare className="h-4 w-4 text-purple-600" />
      case 'hired': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'rejected': return <XCircle className="h-4 w-4 text-red-600" />
      default: return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  // Filter applicants based on search criteria only
  const filteredApplicants = jobApplicants.filter(applicant => {
    const matchesSearch = !searchTerm || 
      applicant.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.position?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return renderDashboard()
      case 'jobs':
        return renderJobsTable()
      case 'job-applicants':
        return renderJobApplicantsTable()
      case 'resume-parser':
        return renderResumeParser()
      case 'create-job-posting':
        return renderCreateJobPosting()
      default:
        return renderDashboard()
    }
  }

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Welcome back, {user.fullName || 'HR Manager'}!</h2>
              <p className="text-blue-100">Here's what's happening with your hiring pipeline today.</p>
            </div>
            <div className="bg-white/20 p-3 rounded-full">
              <TrendingUp className="h-8 w-8" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Card key={item} className="shadow-lg border-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalJobs}</div>
                <p className="text-xs text-muted-foreground">
                  {jobPostings.filter(job => job.status === 'active').length} active
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Applicants</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalApplicants}</div>
                <p className="text-xs text-muted-foreground">
                  Across all job postings
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Shortlisted</CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.shortlistedCandidates}</div>
                <p className="text-xs text-muted-foreground">
                  Ready for interviews
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Additional Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Job Postings</CardTitle>
                <AlertCircle className="h-4 w-4 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-600">{stats.pendingJobPostings}</div>
                <p className="text-xs text-muted-foreground">
                  Awaiting admin approval
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rejected Applicants</CardTitle>
                <XCircle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{stats.rejectedCandidates}</div>
                <p className="text-xs text-muted-foreground">
                  Not selected for position
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Hired Candidates</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.hiredCandidates}</div>
                <p className="text-xs text-muted-foreground">
                  Successfully hired
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle>Application Status Overview</CardTitle>
                <CardDescription>Distribution of applications by status</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-64">
                  <PieChart>
                    <Pie
                      data={applicationStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {applicationStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle>Top Performing Jobs</CardTitle>
                <CardDescription>Jobs with highest application rates</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-64">
                  <BarChart data={jobPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 12 }}
                      tickLine={{ stroke: 'hsl(var(--muted-foreground))' }}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      tickLine={{ stroke: 'hsl(var(--muted-foreground))' }}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar 
                      dataKey="applications" 
                      fill="var(--color-applications)" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ChartContainer>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  {jobPerformanceData.map((job, index) => (
                    <div key={index} className="p-2 bg-blue-50 rounded">
                      <div className="text-sm font-bold text-blue-600">{job.applications}</div>
                      <div className="text-xs text-blue-600 truncate">{job.name}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Applications */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle>Recent Applications</CardTitle>
              <CardDescription>Latest applications that need your attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {applicants.slice(0, 3).map((applicant) => (
                  <div key={applicant.applicantId || applicant.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{applicant.name}</h4>
                        <p className="text-sm text-muted-foreground">{applicant.position}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(applicant.status)}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleApplicantClick(applicant)}
                        className="hover:bg-blue-50 border-blue-200"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </div>
                  </div>
                ))}
                {applicants.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No applicants yet</p>
                    <Button 
                      onClick={() => setActiveView('create-job-posting')}
                      className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Job Posting
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )

  const renderJobsTable = () => (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Job Postings Management</CardTitle>
            <CardDescription>Manage your job postings and view application statistics</CardDescription>
          </div>
          <Button 
            onClick={() => setActiveView('create-job-posting')}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New Job
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={jobPostingsColumns}
          data={jobPostings}
          searchKey="title"
          searchPlaceholder="Search job postings..."
        />
        {jobPostings.length === 0 && (
          <div className="text-center py-12">
            <Briefcase className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold mb-2">No Job Postings Yet</h3>
            <p className="text-muted-foreground mb-4">Create your first job posting to start receiving applications</p>
            <Button 
              onClick={() => setActiveView('create-job-posting')}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Job Posting
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )

  const renderJobApplicantsTable = () => {
    if (!selectedJob) return null;

    return (
      <div className="space-y-6">
        {/* Job Info Header */}
        <Card className="shadow-lg border-0 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedJob.title}</h2>
                <p className="text-gray-600 mt-1">{selectedJob.description}</p>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{selectedJob.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Briefcase className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{selectedJob.type}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      ₱{selectedJob.salaryMin} - ₱{selectedJob.salaryMax}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-blue-600">{jobApplicants.length}</div>
                <div className="text-sm text-gray-600">Total Applicants</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Applicants Table with Search Only */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Applicants</CardTitle>
                <CardDescription>
                  Manage applications for this position
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  onClick={handleBackToJobs}
                  className="flex items-center gap-2 border-gray-300 hover:bg-gray-50"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Jobs
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Search Control Only - No other filters */}
            <div className="mb-6">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search applicants by name, email, or position..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Applicants Table */}
            <DataTable
              columns={applicantsColumns}
              data={filteredApplicants}
              searchKey="name"
              searchPlaceholder="Search applicants..."
              onRowClick={(applicant) => handleApplicantClick(applicant)}
              pagination={true}
              pageSize={10}
            />
            {filteredApplicants.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-semibold mb-2">
                  {jobApplicants.length === 0 ? 'No Applicants Yet' : 'No Matching Applicants'}
                </h3>
                <p className="text-muted-foreground">
                  {jobApplicants.length === 0 
                    ? 'No one has applied to this job posting yet.' 
                    : 'Try adjusting your search terms.'
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  const renderResumeParser = () => (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" />
            Resume Parser
          </CardTitle>
          <CardDescription>
            Upload a resume to extract skills, experience, and qualifications automatically
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!uploadedFile ? (
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 text-center hover:border-primary/50 transition-colors cursor-pointer">
              <Input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
                id="resume-parser-upload"
              />
              <label htmlFor="resume-parser-upload" className="cursor-pointer">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Choose a resume file to parse
                </h3>
                <p className="text-muted-foreground mb-6">
                  Drag and drop your resume here, or click to browse files
                </p>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Upload className="h-4 w-4 mr-2" />
                  Choose File
                </Button>
                <p className="text-sm text-muted-foreground mt-4">
                  Supported formats: PDF, DOC, DOCX (Max 10MB)
                </p>
              </label>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Upload Progress */}
              {isUploading && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">Uploading...</span>
                    <span className="text-sm text-muted-foreground">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* File Info */}
              {uploadedFile && !isUploading && (
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 w-10 h-10 rounded-lg flex items-center justify-center">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{uploadedFile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={removeFile} className="hover:bg-red-50 border-red-200">
                      <Trash2 className="h-4 w-4 mr-2 text-red-600" />
                      Remove
                    </Button>
                  </div>
                </div>
              )}

              {/* Analysis Status */}
              {isAnalyzing && (
                <div className="text-center py-8">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="h-8 w-8 text-primary animate-pulse" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Analyzing Resume
                  </h3>
                  <p className="text-muted-foreground">
                   Extracting skills and experience from the resume...
                  </p>
                </div>
              )}

              {/* Analysis Complete */}
              {analysisComplete && (
                <div className="text-center py-8">
                  <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Analysis Complete!
                  </h3>
                  <p className="text-muted-foreground">
                    Successfully extracted {extractedSkills.length} skills and parsed resume data.
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Extracted Skills */}
      {extractedSkills.length > 0 && (
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Extracted Skills
            </CardTitle>
            <CardDescription>
              Skills and technologies identified from the resume
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {extractedSkills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-sm bg-blue-50 text-blue-700 border-blue-200">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Parsed Data */}
      {parsedData && (
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-primary" />
              Parsed Resume Data
            </CardTitle>
            <CardDescription>
              Complete information extracted from the resume
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Name:</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{parsedData.name}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Email:</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{parsedData.email}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Phone:</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{parsedData.phone}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Experience:</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{parsedData.experience}</p>
                </div>
              </div>

              {/* Education */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Education:</span>
                </div>
                <p className="text-sm text-muted-foreground">{parsedData.education}</p>
              </div>

              {/* Summary */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Professional Summary:</span>
                </div>
                <p className="text-sm text-muted-foreground">{parsedData.summary}</p>
              </div>

              {/* Work Experience */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Work Experience:</span>
                </div>
                <div className="space-y-3">
                  {parsedData.workExperience.map((job, index) => (
                    <div key={index} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{job.position}</h4>
                        <span className="text-xs text-muted-foreground">{job.duration}</span>
                      </div>
                      <p className="text-sm font-medium text-primary mb-1">{job.company}</p>
                      <p className="text-sm text-muted-foreground">{job.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )

  const renderCreateJobPosting = () => {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" />
              Create New Job Posting
            </CardTitle>
            <CardDescription>
              Fill in the details below to create a new job posting
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Job Title *</label>
                  <Input
                    type="text"
                    name="title"
                    placeholder="e.g. Software Engineer"
                    required
                    onChange={handleChange}
                    value={createJobPosting.title}
                    className={formErrors.title ? "border-red-500 bg-red-50" : ""}
                  />
                  {formErrors.title && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {formErrors.title}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Location *</label>
                  <Input
                    type="text"
                    name="location"
                    onChange={handleChange}
                    value={createJobPosting.location}
                    placeholder="e.g. Manila, Remote"
                    className={formErrors.location ? "border-red-500 bg-red-50" : ""}
                  />
                  {formErrors.location && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {formErrors.location}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Job Description *</label>
                <Textarea
                  name="description"
                  placeholder="Describe the job responsibilities, requirements, and what you're looking for in a candidate..."
                  required
                  onChange={handleChange}
                  value={createJobPosting.description}
                  rows={6}
                  className={formErrors.description ? "border-red-500 bg-red-50" : ""}
                />
                {formErrors.description && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {formErrors.description}
                    </p>
                  )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Job Type *</label>
                  <Select 
                    value={createJobPosting.type} 
                    onValueChange={(value) => {
                      setCreateJobPosting({...createJobPosting, type: value});
                      if (formErrors.type) {
                        setFormErrors({...formErrors, type: ''});
                      }
                    }}
                  >
                    <SelectTrigger className={formErrors.type ? "border-red-500 bg-red-50" : ""}>
                      <SelectValue placeholder="Select job type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                      <SelectItem value="Remote">Remote</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                      <SelectItem value="Internship">Internship</SelectItem>
                      <SelectItem value="Freelance">Freelance</SelectItem>
                    </SelectContent>
                  </Select>
                  {formErrors.type && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {formErrors.type}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Salary Range *</label>
                  <div className="flex gap-2">
                    <div className="w-full">
                      <Input
                        type="number"
                        name="salaryMin"
                        placeholder="₱30,000"
                        onChange={handleChange}
                        value={createJobPosting.salaryMin}
                        className={`w-full ${
                          formErrors.salaryMin || formErrors.salaryRange ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                        min="0"
                      />
                    </div>
                    <span className="self-center text-muted-foreground">to</span>
                    <div className="w-full">
                      <Input
                        type="number"
                        name="salaryMax"
                        placeholder="₱50,000"
                        onChange={handleChange}
                        value={createJobPosting.salaryMax}
                        className={`w-full ${
                          formErrors.salaryMax || formErrors.salaryRange ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                        min="0"
                      />
                    </div>
                  </div>
                  
                  {formErrors.salaryMin && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {formErrors.salaryMin}
                    </p>
                  )}
                  {formErrors.salaryMax && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {formErrors.salaryMax}
                    </p>
                  )}
                  {formErrors.salaryRange && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {formErrors.salaryRange}
                    </p>
                  )}
                  
                  {createJobPosting.salaryMin && createJobPosting.salaryMax && 
                   parseInt(createJobPosting.salaryMin) <= parseInt(createJobPosting.salaryMax) && 
                   !formErrors.salaryRange && (
                    <p className="text-green-500 text-sm flex items-center gap-1">
                      <CheckCircle className="h-4 w-4" />
                      Valid salary range
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={() => setActiveView('jobs')}
                  className="flex-1 border-gray-300 hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isSubmitting ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Posting...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Post Job
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  const renderEditJobForm = () => {
    if (!editingJob) return null;

    return (
      <Drawer open={isEditJobOpen} onOpenChange={setIsEditJobOpen}>
        <DrawerContent className="max-h-[90vh] flex flex-col">
          {/* Fixed header */}
          <DrawerHeader className="px-6 pt-6 pb-4 flex-shrink-0 border-b">
            <DrawerTitle className="text-2xl font-bold">Edit Job Posting</DrawerTitle>
            <DrawerDescription className="text-lg">
              Update the job posting details
            </DrawerDescription>
          </DrawerHeader>
          
          {/* Scrollable content area */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Job Title */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Job Title</label>
                <Input
                  value={editingJob.title || ''}
                  onChange={(e) => setEditingJob({...editingJob, title: e.target.value})}
                  placeholder="Software Engineer"
                  required
                  className="text-base p-3"
                />
              </div>

              {/* Location */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Location</label>
                <Input
                  value={editingJob.location || ''}
                  onChange={(e) => setEditingJob({...editingJob, location: e.target.value})}
                  placeholder="Manila"
                  required
                  className="text-base p-3"
                />
              </div>

              {/* Job Type and Status - In one row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <label className="text-sm font-medium">Job Type</label>
                  <Select 
                    value={editingJob.type || ''}
                    onValueChange={(value) => setEditingJob({...editingJob, type: value})}
                    required
                  >
                    <SelectTrigger className="text-base p-3 h-auto">
                      <SelectValue placeholder="Remote" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Remote">Remote</SelectItem>
                      <SelectItem value="On-site">On-site</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-3">
                  <label className="text-sm font-medium">Status</label>
                  <Select 
                    value={editingJob.status || 'active'}
                    onValueChange={(value) => setEditingJob({...editingJob, status: value})}
                    required
                  >
                    <SelectTrigger className="text-base p-3 h-auto">
                      <SelectValue placeholder="Active" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Min and Max Salary - In one row with labels below */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Salary Range</label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Input
                      type="number"
                      value={editingJob.salaryMin || ''}
                      onChange={(e) => setEditingJob({...editingJob, salaryMin: e.target.value})}
                      placeholder="3000"
                      required
                      className="text-base p-3"
                    />
                    <p className="text-xs text-gray-500 text-center">Min Salary</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Input
                      type="number"
                      value={editingJob.salaryMax || ''}
                      onChange={(e) => setEditingJob({...editingJob, salaryMax: e.target.value})}
                      placeholder="4000"
                      required
                      className="text-base p-3"
                    />
                    <p className="text-xs text-gray-500 text-center">Max Salary</p>
                  </div>
                </div>

                {editingJob.salaryMin && editingJob.salaryMax && 
                 parseInt(editingJob.salaryMin) > parseInt(editingJob.salaryMax) && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    Min salary cannot be higher than max salary
                  </p>
                )}
              </div>

              {/* Job Description */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Job Description</label>
                <Textarea
                  value={editingJob.description || 'Entry Level Software Engineer'}
                  onChange={(e) => setEditingJob({...editingJob, description: e.target.value})}
                  placeholder="Describe the job responsibilities and requirements..."
                  rows={4}
                  className="text-base p-3 resize-none"
                />
              </div>
            </div>
          </div>
          
          {/* Fixed footer with buttons - always visible */}
          <DrawerFooter className="px-6 pb-6 pt-4 border-t bg-white flex-shrink-0">
            <div className="flex gap-3 w-full">
              <Button 
                onClick={() => handleUpdateJob(editingJob)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white h-12 text-base"
                disabled={editingJob.salaryMin && editingJob.salaryMax && 
                         parseInt(editingJob.salaryMin) > parseInt(editingJob.salaryMax)}
              >
                Save Changes
              </Button>
              <Button 
                variant="outline"
                onClick={() => setIsEditJobOpen(false)}
                className="flex-1 h-12 text-base border-gray-300 hover:bg-gray-50"
              >
                Cancel
              </Button>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <Sidebar className="border-r bg-white shadow-sm">
          <SidebarHeader className="border-b px-6 py-4">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 w-8 h-8 rounded-lg flex items-center justify-center">
                <Building className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-lg">Company Dashboard</h2>
                <p className="text-xs text-muted-foreground">{user.company || 'Your Company'}</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {sidebarItems.map((item) => (
                    <SidebarMenuItem key={item.view}>
                      <SidebarMenuButton
                        onClick={() => setActiveView(item.view)}
                        isActive={activeView === item.view}
                        className="hover:bg-blue-50 hover:text-blue-600 transition-colors data-[active=true]:bg-blue-50 data-[active=true]:text-blue-600"
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          
          <SidebarFooter className="border-t px-6 py-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{user.fullName || 'HR Manager'}</p>
                  <p className="text-xs text-muted-foreground">Company Account</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                size="sm"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>
        
        <div className="flex-1 flex flex-col">
          {/* Main Content Area */}
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 shadow-sm">
              <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <SidebarTrigger className="lg:hidden" />
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900 capitalize">
                        {activeView.replace('-', ' ')}
                      </h1>
                      <p className="text-gray-600 text-sm">
                        {activeView === 'dashboard' && 'Overview of your hiring pipeline and statistics'}
                        {activeView === 'jobs' && 'Manage your job postings and view application statistics'}
                        {activeView === 'job-applicants' && `Applicants for ${selectedJob?.title}`}
                        {activeView === 'resume-parser' && 'Upload and parse resumes to extract skills and qualifications'}
                        {activeView === 'create-job-posting' && 'Create a new job posting to attract candidates'}
                      </p>
                    </div>
                  </div>
                  {/* REMOVED search and filter from global header */}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-6">
              {renderContent()}
            </div>
          </div>
        </div>

        {/* Drawer for Applicant Details */}
        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <DrawerContent>
            <div className="mx-auto w-full max-w-4xl">
              <DrawerHeader>
                <DrawerTitle>Applicant Profile</DrawerTitle>
                <DrawerDescription>
                  Detailed view of {selectedApplicant?.name}'s application
                </DrawerDescription>
              </DrawerHeader>
              <div className="p-6">
                {selectedApplicant && (
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="h-8 w-8 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold">{selectedApplicant.name}</h3>
                        <p className="text-muted-foreground">{selectedApplicant.position}</p>
                        <div className="flex items-center gap-2 mt-2">
                          {getStatusBadge(selectedApplicant.status)}
                        </div>
                      </div>
                    </div>
                    
                    {/* Contact Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Email:</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{selectedApplicant.email}</p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Phone:</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{selectedApplicant.phone || 'Not provided'}</p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Applied Date:</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {selectedApplicant.appliedDate || 'Not specified'}
                        </p>
                      </div>
                    </div>

                    {/* Skills Section */}
                    {selectedApplicant.skills && selectedApplicant.skills.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium flex items-center gap-2">
                          <Target className="h-4 w-4" />
                          Skills & Technologies
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedApplicant.skills.map((skill, index) => (
                            <Badge key={index} variant="secondary" className="text-sm bg-blue-50 text-blue-700 border-blue-200">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Education */}
                    {selectedApplicant.education && (
                      <div className="space-y-2">
                        <h4 className="font-medium flex items-center gap-2">
                          <Award className="h-4 w-4" />
                          Education
                        </h4>
                        <p className="text-sm text-muted-foreground">{selectedApplicant.education}</p>
                      </div>
                    )}

                    {/* Notes */}
                    {selectedApplicant.notes && (
                      <div className="space-y-2">
                        <h4 className="font-medium flex items-center gap-2">
                          <MessageSquare className="h-4 w-4" />
                          Notes
                        </h4>
                        <p className="text-sm text-muted-foreground">{selectedApplicant.notes}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <DrawerFooter>
                <div className="flex gap-2">
                  <Button 
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => {
                      console.log("Hiring applicant:", selectedApplicant);
                      handleStatusUpdate('hired');
                    }}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Hire Candidate
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 border-blue-200 hover:bg-blue-50 text-blue-700" 
                    onClick={() => {
                      console.log("Shortlisting applicant:", selectedApplicant);
                      handleStatusUpdate('shortlisted');
                    }}
                  >
                    <UserCheck className="h-4 w-4 mr-2" />
                    Shortlist
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 border-red-200 hover:bg-red-50 text-red-700" 
                    onClick={() => {
                      console.log("Rejecting applicant:", selectedApplicant);
                      handleStatusUpdate('rejected');
                    }}
                  >
                    <UserX className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1 border-gray-300 hover:bg-gray-50"
                    onClick={() => selectedApplicant && handleDownloadResume(selectedApplicant)}
                    disabled={!selectedApplicant?.Document?.id}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Resume
                  </Button>
                </div>
                <DrawerClose asChild>
                  <Button variant="outline" className="w-full border-gray-300 hover:bg-gray-50">
                    Close
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </div>
          </DrawerContent>
        </Drawer>

        {/* Edit Job Drawer */}
        {renderEditJobForm()}
      </div>
    </SidebarProvider>
  );
}

export default CompanyDashboardPage;