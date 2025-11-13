import React, { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { DataTable } from "@/components/ui/data-table"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { 
  Users, 
  Briefcase, 
  FileText, 
  Search,
  Eye,
  Edit,
  Building,
  BarChart3,
  Shield,
  Database,
  Server,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Download,
  RefreshCw,
  LogOut,
  User,
  FileX,
  ChartBar,
  Cog,
  Bell,
  HelpCircle,
  Menu,
  MoreHorizontal,
  Clock,
  X
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import io from 'socket.io-client'

function AdminPage() {
  const [activeView, setActiveView] = useState('dashboard')
  const [selectedItem, setSelectedItem] = useState(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [adminUser, setAdminUser] = useState(null)
  const [employersDocuments, setEmployersDocuments] = useState([])
  const [jobPostings, setJobPostings] = useState([])
  const navigate = useNavigate()
  const URL = "http://localhost:4000";
  
  // Socket reference
  const socketRef = useRef(null);
  
  // Notification states
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Initialize Socket Connection
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    // Initialize socket connection
    socketRef.current = io("http://localhost:3000", {
      auth: {
        token: token
      },
      transports: ['websocket', 'polling']
    });

    // Socket event listeners
    socketRef.current.on('connect', () => {
      console.log('Connected to admin server via WebSocket');
    });

    socketRef.current.on('disconnect', () => {
      console.log('Disconnected from admin server');
    });

    // Listen for new employer registrations from your backend
    socketRef.current.on('newEmployerRegistration', (data) => {
      console.log('New employer registration received:', data);
      
      // Add notification for new employer
      addNotification({
        id: Date.now() + Math.random(), // Unique ID
        title: "New Employer Registration",
        message: `${data.companyName || data.employerName} has registered and requires approval`,
        type: "employer",
        read: false,
        createdAt: new Date().toISOString(),
        employerId: data.employerId,
        companyName: data.companyName || data.employerName
      });
      
      // Refresh data to get the new employer
      fetchData();
    });

    // Listen for job posting submissions
    socketRef.current.on('newJobPosting', (data) => {
      console.log('New job posting received:', data);
      
      addNotification({
        id: Date.now() + Math.random(),
        title: "New Job Posting",
        message: `New job "${data.jobTitle}" posted by ${data.companyName}`,
        type: "job",
        read: false,
        createdAt: new Date().toISOString(),
        jobId: data.jobId,
        companyName: data.companyName
      });
      
      fetchData();
    });

    // Listen for other admin-related events
    socketRef.current.on('employerApproved', (data) => {
      console.log('Employer approved:', data);
      addNotification({
        id: Date.now() + Math.random(),
        title: "Employer Approved",
        message: `${data.companyName} has been approved and can now post jobs`,
        type: "approval",
        read: false,
        createdAt: new Date().toISOString(),
        employerId: data.employerId
      });
    });

    socketRef.current.on('employerRejected', (data) => {
      console.log('Employer rejected:', data);
      addNotification({
        id: Date.now() + Math.random(),
        title: "Employer Rejected",
        message: `${data.companyName} registration was rejected`,
        type: "alert",
        read: false,
        createdAt: new Date().toISOString(),
        employerId: data.employerId
      });
    });

    // Cleanup on component unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  // Add notification to state
  const addNotification = (notification) => {
    setNotifications(prev => [notification, ...prev]);
    setUnreadCount(prev => prev + 1);
    
    // Show browser notification if permitted
    if (Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        tag: 'admin-notification'
      });
    }
    
    // Auto-hide notification after 5 seconds
    setTimeout(() => {
      setShowNotifications(false);
    }, 5000);
  };

  // Request browser notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  // Mark all as read
  const markAllAsRead = async () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
    setUnreadCount(0);
  };

  // Toggle notifications dropdown
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications && unreadCount > 0) {
      markAllAsRead();
    }
  };

  // Handle notification click (navigate to relevant page)
  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    setShowNotifications(false);

    switch (notification.type) {
      case 'employer':
        setActiveView('employers');
        // Optional: Scroll to or highlight the specific employer
        break;
      case 'job':
        setActiveView('jobs');
        break;
      case 'approval':
      case 'alert':
        setActiveView('employers');
        break;
      default:
        break;
    }
  };

  // Format notification time
  const formatNotificationTime = (createdAt) => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffInMinutes = Math.floor((now - created) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'employer':
        return <Users className="h-4 w-4 text-blue-500" />;
      case 'job':
        return <Briefcase className="h-4 w-4 text-green-500" />;
      case 'approval':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'alert':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  // Get notification badge color based on type
  const getNotificationBadge = (type) => {
    switch (type) {
      case 'employer':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'job':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'approval':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'alert':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Check if user is authenticated and fetch data
  const fetchData = async () => {
    const token = localStorage.getItem('adminToken')
    
    if (!token) {
      navigate('/admin-login')
      return
    }

    try {
      const response = await axios.get(`${URL}/fetchData`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (response.data.success) {
        setAdminUser(response.data.currentAdmin)
        // Handle both possible field names from backend
        setEmployersDocuments(response.data.employersDocuments || response.data.employeesDocuments || [])
        
        // Process job postings with applicant counts
        const processedJobPostings = (response.data.jobPostings || []).map(job => ({
          ...job,
          // Get applicant count from the included applicants data
          applicantCount: job.applicants ? job.applicants.length : 0
        }))
        setJobPostings(processedJobPostings)
      }
    } catch (err) {
      console.log('Error fetching admin data:', err.message)
      localStorage.removeItem('adminToken')
      navigate('/admin-login')
    }
  }

  useEffect(() => {
    fetchData()
  }, [navigate])

  const handleLogout = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    navigate('/admin-login')
  }

  // Function to update job review status
  const updateJobReviewStatus = async (jobId, reviewedStatus) => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await axios.patch(`${URL}/updateJobReview/${jobId}`, {
        reviewed: reviewedStatus
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (response.data.success) {
        setJobPostings(prevJobs => 
          prevJobs.map(job => 
            job.id === jobId ? { ...job, reviewed: reviewedStatus } : job
          )
        )
        return true
      }
    } catch (err) {
      console.log('Error updating job review status:', err.message)
      return false
    }
  }

  // Function to update employer approval status
  const updateEmployerApproval = async (employerId, approvalStatus) => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await axios.patch(`${URL}/updateEmployerApproval/${employerId}`, {
        approved: approvalStatus
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (response.data.success) {
        setEmployersDocuments(prevEmployers => 
          prevEmployers.map(employerDoc => 
            employerDoc.user?.id === employerId 
              ? { 
                  ...employerDoc, 
                  user: { ...employerDoc.user, approved: approvalStatus } 
                } 
              : employerDoc
          )
        )
        return true
      }
    } catch (err) {
      console.log('Error updating employer approval status:', err.message)
      return false
    }
  }

  // Function to download employer document
  const downloadEmployerDocument = async (documentId, employerName) => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await axios.get(`${URL}/download-document/${documentId}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      })
      
      const blob = new Blob([response.data])
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      
      // Get filename from content-disposition header or generate one
      let filename = response.headers['content-disposition'] 
        ? response.headers['content-disposition'].split('filename=')[1]?.replace(/"/g, '')
        : `${employerName}_document`
      
      // If no extension in filename, try to detect from content type or add default
      if (!filename.includes('.')) {
        const contentType = response.headers['content-type']
        const extension = getFileExtensionFromContentType(contentType)
        filename = `${filename}${extension}`
      }
      
      link.setAttribute('download', filename)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      
    } catch (err) {
      console.log('Error downloading document:', err.message)
      alert('Error downloading document. Please try again.')
    }
  }

  // Helper function to determine file extension from content type
  const getFileExtensionFromContentType = (contentType) => {
    const extensionMap = {
      // Documents
      'application/pdf': '.pdf',
      'application/msword': '.doc',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
      'application/vnd.ms-excel': '.xls',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
      'application/vnd.ms-powerpoint': '.ppt',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': '.pptx',
      'text/plain': '.txt',
      'text/csv': '.csv',
      
      // Images
      'image/jpeg': '.jpg',
      'image/jpg': '.jpg',
      'image/png': '.png',
      'image/gif': '.gif',
      'image/webp': '.webp',
      'image/svg+xml': '.svg',
      
      // Archives
      'application/zip': '.zip',
      'application/x-rar-compressed': '.rar',
      
      // Default fallback
      'application/octet-stream': '.bin'
    }
    
    return extensionMap[contentType?.toLowerCase()] || '.bin'
  }

  const sidebarItems = [
    {
      title: "Dashboard",
      icon: ChartBar,
      view: "dashboard",
      badge: null
    },
    {
      title: "Employer Management",
      icon: Users,
      view: "employers",
      badge: employersDocuments.length.toString()
    },
    {
      title: "Job Management",
      icon: Briefcase,
      view: "jobs",
      badge: jobPostings.length.toString()
    },
    {
      title: "System Settings",
      icon: Cog,
      view: "system",
      badge: null
    }
  ]

  // Calculate system stats based on real data
  const systemStats = {
    totalUsers: 14,
    activeUsers: 12,
    totalEmployers: employersDocuments.length,
    activeEmployers: employersDocuments.filter(emp => emp.user?.status === 'active').length,
    totalJobs: jobPostings.length,
    activeJobs: jobPostings.filter(job => job.status === 'active').length,
    pendingReviewJobs: jobPostings.filter(job => !job.reviewed).length,
    pendingApprovals: employersDocuments.filter(emp => !emp.user?.approved || emp.user?.approved === 'underReview').length,
    systemUptime: '99.9%',
    responseTime: '128ms',
    serverLoad: '24%',
    totalApplicants: jobPostings.reduce((total, job) => total + (job.applicantCount || 0), 0)
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await fetchData()
    } catch (err) {
      console.log('Error refreshing data:', err.message)
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleRowClick = (item, type) => {
    if (type === 'employer') {
      const fullEmployerData = employersDocuments.find(emp => 
        emp.user?.id === item.id || emp.id === item.id
      );
      setSelectedItem({ ...fullEmployerData, type });
    } else {
      const fullJobData = jobPostings.find(job => job.id === item.id);
      setSelectedItem({ ...fullJobData, type });
    }
    setIsDrawerOpen(true);
  };

  const getStatusBadge = (status) => {
    const variants = {
      active: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      inactive: 'bg-gray-100 text-gray-800 border-gray-200',
      pending: 'bg-amber-100 text-amber-800 border-amber-200',
      suspended: 'bg-red-100 text-red-800 border-red-200',
      closed: 'bg-slate-100 text-slate-800 border-slate-200',
      draft: 'bg-gray-100 text-gray-800 border-gray-200',
      Internship: 'bg-blue-100 text-blue-800 border-blue-200',
      FullTime: 'bg-green-100 text-green-800 border-green-200',
      PartTime: 'bg-purple-100 text-purple-800 border-purple-200',
      Contract: 'bg-orange-100 text-orange-800 border-orange-200'
    }
    
    const displayStatus = status === 'Internship' ? 'Internship' : 
                         status === 'FullTime' ? 'Full Time' :
                         status === 'PartTime' ? 'Part Time' :
                         status === 'Contract' ? 'Contract' : status;
    
    return <Badge variant="outline" className={`${variants[status] || 'bg-gray-100 text-gray-800 border-gray-200'} font-medium text-xs`}>
      {displayStatus}
    </Badge>
  }

  const getApprovalBadge = (approved) => {
    const variants = {
      pass: 'bg-green-100 text-green-800 border-green-200',
      underReview: 'bg-amber-100 text-amber-800 border-amber-200',
      rejected: 'bg-red-100 text-red-800 border-red-200',
      null: 'bg-gray-100 text-gray-800 border-gray-200'
    }
    
    const status = approved || 'null'
    const displayText = approved === 'pass' ? 'Approved' : 
                       approved === 'underReview' ? 'Under Review' : 
                       approved === 'rejected' ? 'Rejected' : 'Pending'
    
    return <Badge variant="outline" className={`${variants[status]} font-medium text-xs`}>{displayText}</Badge>
  }

  const getDocumentBadge = (hasDocument) => {
    if (hasDocument) {
      return (
        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 text-xs">
          <FileText className="h-3 w-3 mr-1" />
          Document Submitted
        </Badge>
      )
    } else {
      return (
        <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200 text-xs">
          <FileX className="h-3 w-3 mr-1" />
          No Document
        </Badge>
      )
    }
  }

  const getDisplayName = () => {
    if (!adminUser) return 'Administrator'
    if (adminUser.fullName) return adminUser.fullName
    if (adminUser.name) return adminUser.name
    if (adminUser.firstName && adminUser.lastName) return `${adminUser.firstName} ${adminUser.lastName}`
    if (adminUser.firstName) return adminUser.firstName
    if (adminUser.email) return adminUser.email.split('@')[0]
    return 'Administrator'
  }

  const getDisplayEmail = () => {
    if (!adminUser) return 'admin@careerconnect.com'
    if (adminUser.email) return adminUser.email
    return 'admin@careerconnect.com'
  }

  // Format employer documents data for the table
  const formatEmployersForTable = () => {
    return employersDocuments.map(employerDoc => ({
      id: employerDoc.user?.id || employerDoc.id,
      documentId: employerDoc.id,
      name: employerDoc.user?.fullName || `${employerDoc.user?.firstName} ${employerDoc.user?.lastName}` || 'N/A',
      email: employerDoc.user?.email || 'N/A',
      status: employerDoc.user?.status || 'active',
      approved: employerDoc.user?.approved,
      joinDate: employerDoc.createdAt ? new Date(employerDoc.createdAt).toLocaleDateString() : 'N/A',
      lastLogin: employerDoc.user?.lastLogin || 'Never',
      hasDocument: true,
      documentStatus: 'submitted',
      rawData: employerDoc
    }))
  }

  // Format job postings data for the table
  const formatJobPostingsForTable = () => {
    return jobPostings.map(job => ({
      id: job.id,
      title: job.title || 'No Title',
      description: job.description || 'No description',
      location: job.location || 'N/A',
      type: job.type || 'N/A',
      companyID: job.companyID || 'N/A',
      companyName: job.company?.name || 'Unknown Company',
      industry: job.company?.industry || 'N/A',
      position: job.position || 'N/A',
      salary: job.salaryMin && job.salaryMax ? `₱${job.salaryMin.toLocaleString()} - ₱${job.salaryMax.toLocaleString()}` : 'Not specified',
      status: job.status || 'draft',
      reviewed: job.reviewed ? 'Yes' : 'No',
      postedDate: job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'N/A',
      updatedAt: job.updatedAt ? new Date(job.updatedAt).toLocaleDateString() : 'N/A',
      applicants: job.applicantCount || 0, // Use the actual applicant count from backend
      views: Math.floor(Math.random() * 500),
      rawData: job
    }))
  }

  const employersColumns = [
    {
      accessorKey: "name",
      header: "Company / Contact",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <Building className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="font-semibold text-gray-900">{row.getValue("name")}</div>
            <div className="text-sm text-gray-500">{row.original.email}</div>
            <div className="mt-1">
              {getDocumentBadge(row.original.hasDocument)}
            </div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "approved",
      header: "Approval Status",
      cell: ({ row }) => getApprovalBadge(row.getValue("approved")),
    },
    {
      accessorKey: "joinDate",
      header: "Registration Date",
      cell: ({ row }) => (
        <div className="text-sm">
          <div className="font-medium text-gray-900">{row.getValue("joinDate")}</div>
          <div className="text-gray-500">Last login: {row.original.lastLogin}</div>
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const [isDropdownOpen, setIsDropdownOpen] = useState(false);

        return (
          <div className="flex items-center justify-end gap-2">
            {/* Download Document Button */}
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 px-2 hover:bg-blue-50 text-blue-600 border-blue-200"
              onClick={(e) => {
                e.stopPropagation()
                downloadEmployerDocument(row.original.documentId, row.original.name)
              }}
              title="Download Document"
            >
              <Download className="h-4 w-4" />
            </Button>
            
            {/* View Details Button */}
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 px-2 hover:bg-gray-50 text-gray-600 border-gray-200"
              onClick={() => handleRowClick(row.original, 'employer')}
              title="View Details"
            >
              <Eye className="h-4 w-4" />
            </Button>
            
            {/* Approval Status Dropdown */}
            <div className="relative">
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 px-2 hover:bg-green-50 text-green-600 border-green-200"
                title="Change Approval Status"
                onClick={(e) => {
                  e.stopPropagation()
                  setIsDropdownOpen(!isDropdownOpen)
                }}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
              
              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div 
                  className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-50"
                  onMouseLeave={() => setIsDropdownOpen(false)}
                >
                  <div className="p-2 space-y-1">
                    <div className="px-3 py-1 text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Change Status
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-green-700 hover:bg-green-50"
                      onClick={async (e) => {
                        e.stopPropagation()
                        await updateEmployerApproval(row.original.id, 'pass')
                        setIsDropdownOpen(false)
                      }}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-amber-700 hover:bg-amber-50"
                      onClick={async (e) => {
                        e.stopPropagation()
                        await updateEmployerApproval(row.original.id, 'underReview')
                        setIsDropdownOpen(false)
                      }}
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      Under Review
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-red-700 hover:bg-red-50"
                      onClick={async (e) => {
                        e.stopPropagation()
                        await updateEmployerApproval(row.original.id, 'rejected')
                        setIsDropdownOpen(false)
                      }}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )
      },
    },
  ]

  const jobsColumns = [
    {
      accessorKey: "title",
      header: "Job Details",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
            <Briefcase className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="font-semibold text-gray-900">{row.getValue("title")}</div>
            <div className="text-sm text-gray-500">{row.original.companyName}</div>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200 text-xs">
                {row.original.type}
              </Badge>
              <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200 text-xs">
                {row.original.applicants} applicants
              </Badge>
            </div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "location",
      header: "Location",
      cell: ({ row }) => (
        <div className="text-sm text-gray-900">{row.getValue("location")}</div>
      ),
    },
    {
      accessorKey: "salary",
      header: "Salary",
      cell: ({ row }) => (
        <div className="text-sm font-medium text-gray-900">{row.getValue("salary")}</div>
      ),
    },
    {
      accessorKey: "applicants",
      header: "Applicants",
      cell: ({ row }) => (
        <div className="text-center">
          <div className="text-sm font-bold text-gray-900">{row.getValue("applicants")}</div>
          <div className="text-xs text-gray-500">applicants</div>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <div className="space-y-1">
          {getStatusBadge(row.getValue("status"))}
          <Badge 
            variant="outline" 
            className={row.original.reviewed === 'Yes' ? 'bg-green-100 text-green-800 border-green-200 text-xs' : 'bg-amber-100 text-amber-800 border-amber-200 text-xs'}
          >
            {row.original.reviewed === 'Yes' ? 'Reviewed' : 'Pending Review'}
          </Badge>
        </div>
      ),
    },
    {
      accessorKey: "postedDate",
      header: "Posted Date",
      cell: ({ row }) => (
        <div className="text-sm text-gray-900">{row.getValue("postedDate")}</div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-1">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 w-8 p-0 hover:bg-gray-50 text-gray-600 border-gray-200"
            onClick={() => handleRowClick(row.original, 'job')}
          >
            <Eye className="h-4 w-4" />
          </Button>
          {row.original.reviewed === 'No' ? (
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 w-8 p-0 hover:bg-green-50 text-green-600 border-green-200"
              onClick={async (e) => {
                e.stopPropagation()
                await updateJobReviewStatus(row.original.id, true)
              }}
            >
              <CheckCircle className="h-4 w-4" />
            </Button>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 w-8 p-0 hover:bg-amber-50 text-amber-600 border-amber-200"
              onClick={async (e) => {
                e.stopPropagation()
                await updateJobReviewStatus(row.original.id, false)
              }}
            >
              <Clock className="h-4 w-4" />
            </Button>
          )}
        </div>
      ),
    },
  ]

  // Render different views based on activeView
  const renderMainContent = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                <p className="text-gray-600">Welcome back, here's what's happening today.</p>
              </div>
              <Button onClick={handleRefresh} disabled={isRefreshing} className="bg-blue-600 hover:bg-blue-700">
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh Data
              </Button>
            </div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Employers</CardTitle>
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{systemStats.totalEmployers}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      {systemStats.activeEmployers} active
                    </Badge>
                    <Badge variant="secondary" className="bg-amber-100 text-amber-700">
                      {systemStats.pendingApprovals} pending
                    </Badge>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Job Postings</CardTitle>
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <Briefcase className="h-4 w-4 text-green-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{systemStats.totalJobs}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      {systemStats.activeJobs} active
                    </Badge>
                    <Badge variant="secondary" className="bg-amber-100 text-amber-700">
                      {systemStats.pendingReviewJobs} pending
                    </Badge>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Applicants</CardTitle>
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Users className="h-4 w-4 text-purple-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{systemStats.totalApplicants}</div>
                  <p className="text-xs text-gray-500 mt-1">
                    Across all job postings
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">System Health</CardTitle>
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Activity className="h-4 w-4 text-orange-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{systemStats.systemUptime}</div>
                  <p className="text-xs text-gray-500 mt-1">
                    Response: {systemStats.responseTime} • Load: {systemStats.serverLoad}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader className="bg-gray-50 border-b">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    Pending Actions
                  </CardTitle>
                  <CardDescription>Items requiring your attention</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-amber-600" />
                      <div>
                        <p className="font-medium text-amber-900">Employer Approvals</p>
                        <p className="text-sm text-amber-700">{systemStats.pendingApprovals} pending review</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setActiveView('employers')}>
                      Review
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Briefcase className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-blue-900">Job Reviews</p>
                        <p className="text-sm text-blue-700">{systemStats.pendingReviewJobs} awaiting review</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setActiveView('jobs')}>
                      Review
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )
      
      case 'employers':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Employer Management</h1>
                <p className="text-gray-600">Manage employer accounts and review documents</p>
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input placeholder="Search employers..." className="pl-10 w-64 border-gray-300" />
                </div>
                <Button onClick={handleRefresh} disabled={isRefreshing} variant="outline" className="border-gray-300">
                  <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
            </div>
            
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="bg-gray-50 border-b">
                <CardTitle className="text-lg">Employers Directory</CardTitle>
                <CardDescription>
                  {employersDocuments.length} registered employers • {systemStats.pendingApprovals} pending approval
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <DataTable 
                  columns={employersColumns} 
                  data={formatEmployersForTable()}
                  onRowClick={(row) => handleRowClick(row.original, 'employer')}
                />
              </CardContent>
            </Card>
          </div>
        )
      
      case 'jobs':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Job Management</h1>
                <p className="text-gray-600">Review and manage all job postings</p>
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input placeholder="Search jobs..." className="pl-10 w-64 border-gray-300" />
                </div>
                <Button onClick={handleRefresh} disabled={isRefreshing} variant="outline" className="border-gray-300">
                  <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
            </div>
            
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="bg-gray-50 border-b">
                <CardTitle className="text-lg">Job Postings</CardTitle>
                <CardDescription>
                  {jobPostings.length} total jobs • {systemStats.pendingReviewJobs} awaiting review • {systemStats.totalApplicants} total applicants
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <DataTable 
                  columns={jobsColumns} 
                  data={formatJobPostingsForTable()}
                  onRowClick={(row) => handleRowClick(row.original, 'job')}
                />
              </CardContent>
            </Card>
          </div>
        )
      
      case 'system':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
              <p className="text-gray-600">Monitor system performance and configuration</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader className="bg-gray-50 border-b">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Server className="h-5 w-5 text-blue-500" />
                    System Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
                      <label className="text-sm font-medium text-gray-500">Uptime</label>
                      <p className="text-lg font-semibold text-gray-900">{systemStats.systemUptime}</p>
                    </div>
                    <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
                      <label className="text-sm font-medium text-gray-500">Response Time</label>
                      <p className="text-lg font-semibold text-gray-900">{systemStats.responseTime}</p>
                    </div>
                    <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
                      <label className="text-sm font-medium text-gray-500">Server Load</label>
                      <p className="text-lg font-semibold text-gray-900">{systemStats.serverLoad}</p>
                    </div>
                    <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
                      <label className="text-sm font-medium text-gray-500">Active Connections</label>
                      <p className="text-lg font-semibold text-gray-900">24</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 shadow-sm">
                <CardHeader className="bg-gray-50 border-b">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Database className="h-5 w-5 text-green-500" />
                    Database Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">Total Records</span>
                      <Badge variant="secondary">{systemStats.totalUsers + systemStats.totalJobs}</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">Cache Hit Rate</span>
                      <Badge variant="secondary">98.2%</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">Last Backup</span>
                      <Badge variant="secondary">2 hours ago</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )
      
      default:
        return <div>Select a view from the sidebar</div>
    }
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50/50">
        {/* Sidebar */}
        <Sidebar className="border-r border-gray-200 bg-white shadow-sm">
          <SidebarHeader className="border-b border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-sm">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-lg font-bold text-gray-900">CareerConnect</span>
                <p className="text-xs text-gray-500 font-medium">Admin Panel</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-4">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {sidebarItems.map((item) => (
                    <SidebarMenuItem key={item.view}>
                      <SidebarMenuButton
                        isActive={activeView === item.view}
                        onClick={() => setActiveView(item.view)}
                        className={`w-full justify-start gap-3 px-3 py-3 rounded-lg transition-all ${
                          activeView === item.view 
                            ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm' 
                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 border border-transparent'
                        }`}
                      >
                        <item.icon className="h-4 w-4" />
                        <span className="font-medium">{item.title}</span>
                        {item.badge && (
                          <Badge variant="secondary" className="ml-auto bg-blue-100 text-blue-700 text-xs">
                            {item.badge}
                          </Badge>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          
          <SidebarFooter className="p-4 border-t border-gray-200">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={handleLogout}
                  className="w-full justify-start gap-3 px-3 py-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-700 border border-transparent hover:border-red-200 transition-all"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="font-medium">Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        
        {/* Main Content */}
        <main className="flex-1 p-8 overflow-auto">
          {/* Top Navigation Bar */}
          <div className="flex items-center justify-between mb-8 p-6 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Menu className="h-5 w-5 text-gray-600" />
              </SidebarTrigger>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600">Welcome back, {getDisplayName()}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Notifications Bell */}
              <div className="relative">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="relative p-2 text-gray-500 hover:text-gray-700"
                  onClick={toggleNotifications}
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                  )}
                </Button>
                
                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 top-12 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50 animate-in fade-in-0 zoom-in-95">
                    <div className="p-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg text-gray-900">Notifications</h3>
                        <div className="flex items-center gap-2">
                          {unreadCount > 0 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={markAllAsRead}
                              className="text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 flex items-center gap-1"
                            >
                              <CheckCircle className="h-3 w-3" />
                              Mark all as read
                            </Button>
                          )}
                          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                            {unreadCount} unread
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length > 0 ? (
                        <div className="divide-y divide-gray-100">
                          {notifications.map((notification) => (
                            <div
                              key={notification.id}
                              className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                                !notification.read ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                              }`}
                              onClick={() => handleNotificationClick(notification)}
                            >
                              <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 mt-0.5">
                                  {getNotificationIcon(notification.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-2">
                                    <p className="font-medium text-sm text-gray-900">
                                      {notification.title}
                                    </p>
                                    <Badge 
                                      variant="secondary" 
                                      className={`text-xs ${getNotificationBadge(notification.type)}`}
                                    >
                                      {notification.type}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-gray-600 mt-1">
                                    {notification.message}
                                  </p>
                                  <p className="text-xs text-gray-400 mt-2">
                                    {formatNotificationTime(notification.createdAt)}
                                  </p>
                                </div>
                                {!notification.read && (
                                  <div className="flex-shrink-0">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-8 text-center">
                          <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                          <p className="text-gray-500 text-sm">No notifications yet</p>
                          <p className="text-gray-400 text-xs mt-1">
                            You'll be notified about new employers and job postings
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-3 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                      <div className="flex items-center justify-between">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowNotifications(false)}
                          className="text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 flex items-center gap-1"
                        >
                          <X className="h-4 w-4" />
                          Close
                        </Button>
                        {notifications.length > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setNotifications([])}
                            className="text-sm text-red-600 hover:text-red-800 hover:bg-red-50 flex items-center gap-1"
                          >
                            <X className="h-4 w-4" />
                            Clear All
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <Button variant="ghost" size="sm" className="p-2 text-gray-500 hover:text-gray-700">
                <HelpCircle className="h-5 w-5" />
              </Button>
              
              <div className="w-px h-6 bg-gray-300"></div>
              
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{getDisplayName()}</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center shadow-sm">
                  <User className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Content Area */}
          <div className="bg-transparent">
            {renderMainContent()}
          </div>
        </main>
        
        {/* Drawer for item details */}
        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <DrawerContent className="max-h-[80vh] border border-gray-200">
            <DrawerHeader className="bg-gray-50 border-b border-gray-200">
              <DrawerTitle className="text-lg">
                {selectedItem?.type === 'employer' ? 'Employer Details' : 'Job Details'}
              </DrawerTitle>
              <DrawerDescription>
                View detailed information about this {selectedItem?.type}
              </DrawerDescription>
            </DrawerHeader>
            <div className="p-6 overflow-y-auto">
              {selectedItem?.type === 'employer' ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Company Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Company Name</label>
                          <p className="font-medium">{selectedItem.user?.fullName || `${selectedItem.user?.firstName} ${selectedItem.user?.lastName}` || 'N/A'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Email</label>
                          <p className="font-medium">{selectedItem.user?.email || 'N/A'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Approval Status</label>
                          <p>{getApprovalBadge(selectedItem.user?.approved)}</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Document Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Document Status</label>
                          <p>{getDocumentBadge(true)}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Submitted Date</label>
                          <p className="font-medium">
                            {selectedItem.createdAt ? new Date(selectedItem.createdAt).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                        <Button 
                          onClick={() => downloadEmployerDocument(selectedItem.id, selectedItem.user?.fullName)}
                          className="w-full"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download Document
                        </Button>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Approval Actions</CardTitle>
                      <CardDescription>
                        Change the approval status of this employer
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          className="flex-1 text-green-700 border-green-200 hover:bg-green-50"
                          onClick={async () => {
                            const success = await updateEmployerApproval(selectedItem.user?.id, 'pass');
                            if (success) {
                              setIsDrawerOpen(false);
                            }
                          }}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1 text-amber-700 border-amber-200 hover:bg-amber-50"
                          onClick={async () => {
                            const success = await updateEmployerApproval(selectedItem.user?.id, 'underReview');
                            if (success) {
                              setIsDrawerOpen(false);
                            }
                          }}
                        >
                          <Clock className="h-4 w-4 mr-2" />
                          Under Review
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1 text-red-700 border-red-200 hover:bg-red-50"
                          onClick={async () => {
                            const success = await updateEmployerApproval(selectedItem.user?.id, 'rejected');
                            if (success) {
                              setIsDrawerOpen(false);
                            }
                          }}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : selectedItem?.type === 'job' ? (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Job Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Job Title</label>
                          <p className="font-medium">{selectedItem.title || 'N/A'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Company</label>
                          <p className="font-medium">{selectedItem.company?.name || 'N/A'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Location</label>
                          <p className="font-medium">{selectedItem.location || 'N/A'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Job Type</label>
                          <p>{getStatusBadge(selectedItem.type || 'N/A')}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Salary</label>
                          <p className="font-medium">
                            {selectedItem.salaryMin && selectedItem.salaryMax 
                              ? `₱${selectedItem.salaryMin.toLocaleString()} - ₱${selectedItem.salaryMax.toLocaleString()}`
                              : 'Not specified'
                            }
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Status</label>
                          <p>{getStatusBadge(selectedItem.status || 'draft')}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Applicants</label>
                          <p className="font-medium">{selectedItem.applicantCount || 0} applicants</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Reviewed</label>
                          <p>
                            <Badge 
                              variant="outline" 
                              className={selectedItem.reviewed ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}
                            >
                              {selectedItem.reviewed ? 'Yes' : 'No'}
                            </Badge>
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Posted Date</label>
                          <p className="font-medium">
                            {selectedItem.createdAt ? new Date(selectedItem.createdAt).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                      </div>
                      
                      {selectedItem.description && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Description</label>
                          <p className="mt-1 text-sm">{selectedItem.description}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Job Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col gap-2">
                        {!selectedItem.reviewed ? (
                          <Button
                            onClick={async () => {
                              const success = await updateJobReviewStatus(selectedItem.id, true);
                              if (success) {
                                setIsDrawerOpen(false);
                              }
                            }}
                            className="flex-1 bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve & Mark as Reviewed
                          </Button>
                        ) : (
                          <Button
                            onClick={async () => {
                              const success = await updateJobReviewStatus(selectedItem.id, false);
                              if (success) {
                                setIsDrawerOpen(false);
                              }
                            }}
                            variant="outline"
                            className="flex-1 text-amber-700 border-amber-200 hover:bg-amber-50"
                          >
                            <Clock className="h-4 w-4 mr-2" />
                            Mark as Pending Review
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No data available</p>
                </div>
              )}
            </div>
            
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="outline">Close</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    </SidebarProvider>
  )
}

export default AdminPage