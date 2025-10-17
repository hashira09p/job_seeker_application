import React, { useState, useEffect } from 'react';
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
  ExternalLink, Upload, Sparkles, AlertCircle, ArrowLeft
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

  // Resume Parser states
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [extractedSkills, setExtractedSkills] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [parsedData, setParsedData] = useState(null);
  const [user, setUser] = useState({});
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

  const handleChange = (e) => {
    setCreateJobPosting({
      ...createJobPosting,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    console.log(user.companyID)
    try {
      const result = await axios.post(`${URL}/jobPostingSubmit`, {
        title: createJobPosting.title,
        description: createJobPosting.description,
        location: createJobPosting.location,
        type: createJobPosting.type,
        salaryMin: createJobPosting.salaryMin,
        salaryMax: createJobPosting.salaryMax
      },
      {headers: { Authorization: `Bearer ${token}` }
        });
      alert("Save success");

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
      setCreateJobPosting({
        title: "",
        description: "",
        location: "",
        type: "",
        salaryMin: "",
        salaryMax: ""
      });
    } catch (err) {
      alert("Error creating job posting. Please try again.");
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
          
          const allApplicants = result.data.jobPostings?.flatMap(job => 
            job.applicants?.map(applicant => ({
              ...applicant,
              jobId: job.id,
              position: job.title
            })) || []
          ) || [];
          
          console.log("Extracted applicants:", allApplicants);
          setApplicants(allApplicants);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Error loading dashboard data");
      }
    }
    fetchData();
  }, [navigate]);

  // Fetch applicants for a specific job from backend
  const fetchJobApplicants = async (jobId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`${URL}/jobPostings/${jobId}/applicants`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.applicants || [];
    } catch (error) {
      console.error("Error fetching job applicants:", error);
      return [];
    }
  };

  // Calculate statistics based on real data
  const stats = {
    totalJobs: jobPostings.length,
    totalApplicants: applicants.length,
    pendingApplications: applicants.filter(a => a.status === 'pending').length,
    shortlistedCandidates: applicants.filter(a => a.status === 'shortlisted').length,
    interviewedCandidates: applicants.filter(a => a.status === 'interviewed').length,
    hiredCandidates: applicants.filter(a => a.status === 'hired').length
  }

  // Chart data based on real applicants
  const applicationStatusData = [
    { name: 'Pending', value: stats.pendingApplications, fill: '#fbbf24' },
    { name: 'Shortlisted', value: stats.shortlistedCandidates, fill: '#3b82f6' },
    { name: 'Interviewed', value: stats.interviewedCandidates, fill: '#8b5cf6' },
    { name: 'Hired', value: stats.hiredCandidates, fill: '#10b981' },
    { name: 'Rejected', value: applicants.filter(a => a.status === 'rejected').length, fill: '#ef4444' }
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
      icon: BriefcaseMedical,
      view: "create-job-posting"
    },
    {
      title: "Settings",
      icon: Settings,
      view: "settings"
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
      cell: ({ row }) => <div className="font-medium">{row.getValue("id")}</div>,
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
      accessorKey: "createdAt",
      header: "Posted Date",
      cell: ({ row }) => {
        const date = row.getValue("createdAt");
        return <div>{date ? new Date(date).toLocaleDateString() : 'Not specified'}</div>;
      },
    },
    {
      accessorKey: "salaryMin",
      header: "Minimum Salary",
      cell: ({ row }) => <div>₱{row.getValue("salaryMin")?.toLocaleString()}</div>,
    },
    {
      accessorKey: "salaryMax",
      header: "Maximum Salary",
      cell: ({ row }) => <div>₱{row.getValue("salaryMax")?.toLocaleString()}</div>,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const job = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0"
              onClick={() => handleEditJobClick(job)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
              onClick={() => handleDeleteJobClick(job.id)}
            >
              <Trash2 className="h-4 w-4" />
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
    accessorKey: "createdAt", // This maps to the createdAt field from database
    header: "Applied Date",
    cell: ({ row }) => {
      const createdAt = row.getValue("createdAt");
      return <div>{createdAt ? new Date(createdAt).toLocaleDateString() : 'Not specified'}</div>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0"
          onClick={() => handleApplicantClick(row.original)}
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Download className="h-4 w-4" />
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

  const handleViewJobApplicants = async (job) => {
    setSelectedJob(job);
    
    // Fetch applicants for this specific job from backend
    const jobApplicantsData = await fetchJobApplicants(job.id);
    
    // Map the data to match the expected format
    const formattedApplicants = jobApplicantsData.map(applicant => ({
      ...applicant,
      jobId: job.id,
      position: job.title
    }));
    
    setJobApplicants(formattedApplicants);
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
      pending: 'bg-yellow-100 text-yellow-800',
      shortlisted: 'bg-blue-100 text-blue-800',
      interviewed: 'bg-purple-100 text-purple-800',
      hired: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      active: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800'
    }
    return <Badge className={variants[status]}>{status}</Badge>
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock3 className="h-4 w-4" />
      case 'shortlisted': return <UserCheck className="h-4 w-4" />
      case 'interviewed': return <MessageSquare className="h-4 w-4" />
      case 'hired': return <CheckCircle className="h-4 w-4" />
      case 'rejected': return <XCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

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
      case 'settings':
        return renderSettingsView()
      case 'create-job-posting':
        return renderCreateJobPosting()
      default:
        return renderDashboard()
    }
  }

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-lg border-0">
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

        <Card className="shadow-lg border-0">
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

        <Card className="shadow-lg border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingApplications}</div>
            <p className="text-xs text-muted-foreground">
              Need immediate attention
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0">
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
              <div key={applicant.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
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
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                </div>
              </div>
            ))}
            {applicants.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No applicants yet
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderJobsTable = () => (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle>Job Postings Management</CardTitle>
        <CardDescription>Manage your job postings and view application statistics</CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={jobPostingsColumns}
          data={jobPostings}
          searchKey="title"
          searchPlaceholder="Search job postings..."
          onRowClick={(job) => handleViewJobApplicants(job)}
        />
      </CardContent>
    </Card>
  )

  const renderJobApplicantsTable = () => {
    if (!selectedJob) return null;

    return (
      <Card className="shadow-lg border-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Applicants for {selectedJob.title}</CardTitle>
              <CardDescription>
                {jobApplicants.length} applicants for this position
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              onClick={handleBackToJobs}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Jobs
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={applicantsColumns}
            data={jobApplicants}
            searchKey="name"
            searchPlaceholder="Search applicants..."
            onRowClick={(applicant) => handleApplicantClick(applicant)}
            pagination={true}
            pageSize={10}
          />
          {jobApplicants.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No applicants for this job yet
            </div>
          )}
        </CardContent>
      </Card>
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
            Upload a resume to extract skills, experience, and qualifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!uploadedFile ? (
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 text-center hover:border-primary/50 transition-colors">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Choose a resume file to parse
              </h3>
              <p className="text-muted-foreground mb-6">
                Drag and drop your resume here, or click to browse files
              </p>
              <Input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
                id="resume-parser-upload"
              />
              <Button asChild>
                <label htmlFor="resume-parser-upload" className="cursor-pointer">
                  <Upload className="h-4 w-4 mr-2" />
                  Choose File
                </label>
              </Button>
              <p className="text-sm text-muted-foreground mt-4">
                Supported formats: PDF, DOC, DOCX (Max 10MB)
              </p>
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
                    <Button variant="outline" size="sm" onClick={removeFile}>
                      <Trash2 className="h-4 w-4 mr-2" />
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
                <Badge key={index} variant="secondary" className="text-sm">
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
                    <div key={index} className="p-3 border rounded-lg">
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
      <form className="space-y-6 p-4 max-w-lg mx-auto" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium mb-2">Job Title</label>
          <input
            type="text"
            name="title"
            placeholder="e.g. Software Engineer"
            required
            onChange={handleChange}
            value={createJobPosting.title}
            className="w-full border rounded p-2"
          />
        </div>
 
        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <Textarea
            name="description"
            placeholder="Write job description here..."
            required
            onChange={handleChange}
            value={createJobPosting.description}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Location</label>
          <input
            type="text"
            name="location"
            onChange={handleChange}
            value={createJobPosting.location}
            placeholder="e.g. Manila, Remote"
            className="w-full border rounded p-2"
          />
        </div>
  
        <div>
          <label className="block text-sm font-medium mb-2">Job Type</label>
          <select name="type" className="w-full border rounded p-2" required onChange={handleChange} value={createJobPosting.type}>
            <option value="">Select job type</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Remote">Remote</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
            <option value="Freelance">Freelance</option>
          </select>
        </div>
  
        <div>
          <label className="block text-sm font-medium mb-2">Salary Range</label>
          <div className="flex gap-2">
            <div className="w-full">
              <input
                type="number"
                name="salaryMin"
                placeholder="₱30,000"
                onChange={handleChange}
                value={createJobPosting.salaryMin}
                className={`w-full border rounded p-2 ${
                  createJobPosting.salaryMin && createJobPosting.salaryMax && 
                  parseInt(createJobPosting.salaryMin) > parseInt(createJobPosting.salaryMax) 
                    ? 'border-red-500 bg-red-50' 
                    : 'border-gray-300'
                }`}
                min="0"
              />
            </div>
            <span className="self-center">-</span>
            <div className="w-full">
              <input
                type="number"
                name="salaryMax"
                placeholder="₱50,000"
                onChange={handleChange}
                value={createJobPosting.salaryMax}
                className={`w-full border rounded p-2 ${
                  createJobPosting.salaryMin && createJobPosting.salaryMax && 
                  parseInt(createJobPosting.salaryMin) > parseInt(createJobPosting.salaryMax) 
                    ? 'border-red-500 bg-red-50' 
                    : 'border-gray-300'
                }`}
                min="0"
              />
            </div>
          </div>
          
          {createJobPosting.salaryMin && createJobPosting.salaryMax && 
           parseInt(createJobPosting.salaryMin) > parseInt(createJobPosting.salaryMax) && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              Minimum salary cannot be higher than maximum salary
            </p>
          )}
          
          {createJobPosting.salaryMin && createJobPosting.salaryMax && 
           parseInt(createJobPosting.salaryMin) <= parseInt(createJobPosting.salaryMax) && (
            <p className="text-green-500 text-sm mt-1 flex items-center gap-1">
              <CheckCircle className="h-4 w-4" />
              Valid salary range
            </p>
          )}
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
          Post Job
        </button>
      </form>
    )
  }

  const renderSettingsView = () => (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle>Company Settings</CardTitle>
        <CardDescription>Configure your company profile and hiring preferences</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Company Settings</h3>
          <p className="text-muted-foreground">Settings panel will be implemented here</p>
        </div>
      </CardContent>
    </Card>
  )

  const renderEditJobForm = () => {
  if (!editingJob) return null;

  return (
    <Drawer open={isEditJobOpen} onOpenChange={setIsEditJobOpen}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-2xl">
          <DrawerHeader>
            <DrawerTitle>Edit Job Posting</DrawerTitle>
            <DrawerDescription>
              Update the job posting details
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-6">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Job Title</label>
                  <Input
                    value={editingJob.title || ''}
                    onChange={(e) => setEditingJob({...editingJob, title: e.target.value})}
                    placeholder="e.g. Software Engineer"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Location</label>
                  <Input
                    value={editingJob.location || ''}
                    onChange={(e) => setEditingJob({...editingJob, location: e.target.value})}
                    placeholder="e.g. Manila, Remote"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Job Type</label>
                  <Select 
                    value={editingJob.type || ''}
                    onValueChange={(value) => setEditingJob({...editingJob, type: value})}
                    required
                  >
                    <SelectTrigger>
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
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select 
                    value={editingJob.status || 'active'}
                    onValueChange={(value) => setEditingJob({...editingJob, status: value})}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Minimum Salary</label>
                  <Input
                    type="number"
                    value={editingJob.salaryMin || ''}
                    onChange={(e) => setEditingJob({...editingJob, salaryMin: e.target.value})}
                    placeholder="₱30,000"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Maximum Salary</label>
                  <Input
                    type="number"
                    value={editingJob.salaryMax || ''}
                    onChange={(e) => setEditingJob({...editingJob, salaryMax: e.target.value})}
                    placeholder="₱50,000"
                    required
                  />
                </div>
              </div>

              {editingJob.salaryMin && editingJob.salaryMax && 
               parseInt(editingJob.salaryMin) > parseInt(editingJob.salaryMax) && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  Minimum salary cannot be higher than maximum salary
                </p>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">Job Description</label>
                <Textarea
                  value={editingJob.description || ''}
                  onChange={(e) => setEditingJob({...editingJob, description: e.target.value})}
                  placeholder="Describe the job responsibilities and requirements..."
                  rows={6}
                />
              </div>
            </form>
          </div>
          <DrawerFooter>
            <div className="flex gap-2">
              <Button 
                onClick={() => handleUpdateJob(editingJob)}
                disabled={editingJob.salaryMin && editingJob.salaryMax && 
                         parseInt(editingJob.salaryMin) > parseInt(editingJob.salaryMax)}
                className="flex-1 hover:bg-[#1c1c1c] transition-colors"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Update Job
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsEditJobOpen(false);
                  setEditingJob(null);
                }}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full" style={{ backgroundColor: '#f9f9f9' }}>
        <Sidebar className="border-r bg-white shadow-sm">
          <SidebarHeader className="border-b px-6 py-4">
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 w-8 h-8 rounded-lg flex items-center justify-center">
                <Building className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold text-lg">Company Dashboard</h2>
                <p className="text-xs text-muted-foreground">{user.company}</p>
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
                        className="hover:bg-[#1c1c1c] hover:text-white transition-colors"
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
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 w-8 h-8 rounded-full flex items-center justify-center">
                <Building className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{user.fullName}</p>
                <p className="text-xs text-muted-foreground">HR Manager</p>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>
        
        <div className="flex-1 flex flex-col">
          {/* Main Content Area */}
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="bg-white border-b border-border">
              <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <SidebarTrigger className="lg:hidden" />
                    <div>
                      <h1 className="text-2xl font-bold text-foreground capitalize">{activeView.replace('-', ' ')}</h1>
                      <p className="text-muted-foreground text-sm">
                        {activeView === 'dashboard' && 'Overview of your hiring pipeline and statistics'}
                        {activeView === 'jobs' && 'Manage your job postings and view application statistics'}
                        {activeView === 'job-applicants' && `Applicants for ${selectedJob?.title}`}
                        {activeView === 'resume-parser' && 'Upload and parse resumes to extract skills and qualifications'}
                        {activeView === 'settings' && 'Configure your company profile and hiring preferences'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="relative hidden md:block">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder="Search applicants..."
                        className="pl-10 w-48 lg:w-64"
                      />
                    </div>
                    <Button className="hover:bg-[#1c1c1c] transition-colors">
                      <Filter className="h-4 w-4 mr-2" />
                      Filters
                    </Button>
                  </div>
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
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                        <Users className="h-8 w-8 text-primary" />
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
                        <p className="text-sm text-muted-foreground">{selectedApplicant.appliedDate || 'Not specified'}</p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Experience:</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{selectedApplicant.experience || 'Not specified'}</p>
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
                            <Badge key={index} variant="secondary" className="text-sm">
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
                  <Button className="flex-1 hover:bg-[#1c1c1c] transition-colors">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Schedule Interview
                  </Button>
                  <Button variant="outline" className="flex-1 hover:bg-green-600 hover:text-white transition-colors">
                    <UserCheck className="h-4 w-4 mr-2" />
                    Shortlist
                  </Button>
                  <Button variant="outline" className="flex-1 hover:bg-red-600 hover:text-white transition-colors">
                    <UserX className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 hover:bg-[#1c1c1c] hover:text-white transition-colors">
                    <Download className="h-4 w-4 mr-2" />
                    Download Resume
                  </Button>
                </div>
                <DrawerClose asChild>
                  <Button variant="outline" className="w-full hover:bg-[#1c1c1c] hover:text-white transition-colors">
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