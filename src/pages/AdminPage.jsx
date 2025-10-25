import React, { useState } from 'react'
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
  UserPlus, 
  Briefcase, 
  FileText, 
  TrendingUp, 
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Calendar,
  Mail,
  Clock,
  Building,
  DollarSign,
  BarChart3,
  Settings,
  Shield,
  Database,
  Server,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  MoreVertical,
  Download,
  RefreshCw,
  LogOut
} from 'lucide-react'

function AdminPage() {
  const [activeView, setActiveView] = useState('dashboard')
  const [selectedItem, setSelectedItem] = useState(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const sidebarItems = [
    {
      title: "Dashboard",
      icon: BarChart3,
      view: "dashboard",
      badge: null
    },
    {
      title: "User Management",
      icon: Users,
      view: "users",
      badge: "14"
    },
    {
      title: "Job Management",
      icon: Briefcase,
      view: "jobs",
      badge: "5"
    },
    {
      title: "Applications",
      icon: FileText,
      view: "applicants",
      badge: "118"
    },
    {
      title: "System",
      icon: Server,
      view: "system",
      badge: null
    },
    {
      title: "Security",
      icon: Shield,
      view: "security",
      badge: null
    }
  ]

  const users = [
    { id: 1, name: 'Joshua Dee Tulali', email: 'joshua.tulali@unasatrabaho.com', role: 'Admin', status: 'active', joinDate: '2025-01-15', lastLogin: '2025-01-20 14:30' },
    { id: 2, name: 'Aerean Nicole Flores', email: 'aerean.flores@unasatrabaho.com', role: 'Moderator', status: 'active', joinDate: '2025-01-10', lastLogin: '2025-01-19 09:15' },
    { id: 3, name: 'Ryan Cunnanan', email: 'ryan.cunnanan@unasatrabaho.com', role: 'User', status: 'suspended', joinDate: '2025-01-05', lastLogin: '2025-01-15 11:20' },
    { id: 4, name: 'Seth Ongotan', email: 'seth.ongotan@unasatrabaho.com', role: 'User', status: 'active', joinDate: '2025-01-12', lastLogin: '2025-01-20 16:45' },
    { id: 5, name: 'Maria Santos', email: 'maria.santos@unasatrabaho.com', role: 'User', status: 'pending', joinDate: '2025-01-18', lastLogin: '2025-01-18 10:00' },
  ]

  const jobs = [
    { id: 1, title: 'Senior Software Engineer', company: 'Globe Telecom', applicants: 25, status: 'active', postedDate: '2025-01-15', salary: '₱65,000 - ₱85,000', views: 324 },
    { id: 2, title: 'Marketing Specialist', company: 'Jollibee Foods Corporation', applicants: 18, status: 'active', postedDate: '2025-01-12', salary: '₱35,000 - ₱50,000', views: 287 },
    { id: 3, title: 'Customer Service Representative', company: 'BPO Solutions Inc.', applicants: 32, status: 'closed', postedDate: '2025-01-08', salary: '₱25,000 - ₱35,000', views: 512 },
    { id: 4, title: 'Senior Accountant', company: 'SM Investments Corporation', applicants: 15, status: 'active', postedDate: '2025-01-16', salary: '₱40,000 - ₱55,000', views: 198 },
    { id: 5, title: 'Registered Nurse', company: 'St. Luke\'s Medical Center', applicants: 28, status: 'active', postedDate: '2025-01-14', salary: '₱30,000 - ₱45,000', views: 376 },
  ]

  const systemStats = {
    totalUsers: 14,
    activeUsers: 12,
    totalJobs: 5,
    activeJobs: 4,
    totalApplications: 118,
    systemUptime: '99.9%',
    responseTime: '128ms',
    serverLoad: '24%'
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  const handleRowClick = (item, type) => {
    setSelectedItem({ ...item, type })
    setIsDrawerOpen(true)
  }

  const getStatusBadge = (status) => {
    const variants = {
      active: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      inactive: 'bg-gray-100 text-gray-800 border-gray-200',
      pending: 'bg-amber-100 text-amber-800 border-amber-200',
      suspended: 'bg-red-100 text-red-800 border-red-200',
      closed: 'bg-slate-100 text-slate-800 border-slate-200'
    }
    return <Badge variant="outline" className={`${variants[status]} font-medium`}>{status}</Badge>
  }

  const getRoleBadge = (role) => {
    const variants = {
      Admin: 'bg-purple-100 text-purple-800 border-purple-200',
      Moderator: 'bg-blue-100 text-blue-800 border-blue-200',
      User: 'bg-gray-100 text-gray-800 border-gray-200'
    }
    return <Badge variant="outline" className={`${variants[role]} font-medium`}>{role}</Badge>
  }

  const usersColumns = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => <div className="font-mono text-sm">{row.getValue("id")}</div>,
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.getValue("name")}</div>
          <div className="text-sm text-muted-foreground">{row.original.email}</div>
        </div>
      ),
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => getRoleBadge(row.getValue("role")),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => getStatusBadge(row.getValue("status")),
    },
    {
      accessorKey: "joinDate",
      header: "Join Date",
    },
    {
      accessorKey: "lastLogin",
      header: "Last Login",
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-1">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-blue-50">
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-green-50">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-red-50">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  const jobsColumns = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => <div className="font-mono text-sm">{row.getValue("id")}</div>,
    },
    {
      accessorKey: "title",
      header: "Job Title",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.getValue("title")}</div>
          <div className="text-sm text-muted-foreground">{row.original.company}</div>
        </div>
      ),
    },
    {
      accessorKey: "applicants",
      header: "Applicants",
      cell: ({ row }) => (
        <div className="text-center font-medium">
          {row.getValue("applicants")}
        </div>
      ),
    },
    {
      accessorKey: "views",
      header: "Views",
      cell: ({ row }) => (
        <div className="text-center text-muted-foreground">
          {row.original.views}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => getStatusBadge(row.getValue("status")),
    },
    {
      accessorKey: "postedDate",
      header: "Posted",
    },
    {
      accessorKey: "salary",
      header: "Salary",
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-1">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-blue-50">
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-green-50">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-red-50">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return renderDashboard()
      case 'users':
        return renderUsersTable()
      case 'jobs':
        return renderJobsTable()
      case 'applicants':
        return renderApplicantsView()
      case 'system':
        return renderSystemView()
      case 'security':
        return renderSecurityView()
      default:
        return renderDashboard()
    }
  }

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">Total Users</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{systemStats.totalUsers}</div>
            <div className="flex items-center gap-1 text-xs">
              <CheckCircle className="h-3 w-3 text-emerald-600" />
              <span className="text-blue-700">{systemStats.activeUsers} active</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900">Job Postings</CardTitle>
            <Briefcase className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{systemStats.totalJobs}</div>
            <div className="flex items-center gap-1 text-xs">
              <Activity className="h-3 w-3 text-emerald-600" />
              <span className="text-green-700">{systemStats.activeJobs} active</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-900">Applications</CardTitle>
            <FileText className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">{systemStats.totalApplications}</div>
            <p className="text-xs text-purple-700">
              Across all job postings
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-900">System Health</CardTitle>
            <Server className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">{systemStats.systemUptime}</div>
            <p className="text-xs text-orange-700">
              Uptime • {systemStats.responseTime} avg
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent User Activity</CardTitle>
              <CardDescription>Latest user logins and actions</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.slice(0, 4).map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-medium">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-sm">{user.name}</div>
                      <div className="text-xs text-muted-foreground">Last login: {user.lastLogin}</div>
                    </div>
                  </div>
                  {getStatusBadge(user.status)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Job Posting Analytics</CardTitle>
              <CardDescription>Performance metrics for job listings</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              Export
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {jobs.slice(0, 4).map((job) => (
                <div key={job.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{job.title}</div>
                    <div className="text-xs text-muted-foreground">{job.company}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-sm">{job.applicants} applicants</div>
                    <div className="text-xs text-muted-foreground">{job.views} views</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderUsersTable = () => (
    <Card className="border-0 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>User Management</CardTitle>
          <CardDescription>Manage all user accounts and permissions</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={usersColumns}
          data={users}
          searchKey="name"
          searchPlaceholder="Search users by name or email..."
          onRowClick={(user) => handleRowClick(user, 'user')}
        />
      </CardContent>
    </Card>
  )

  const renderJobsTable = () => (
    <Card className="border-0 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Job Management</CardTitle>
          <CardDescription>Manage job postings and monitor performance</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm" className="bg-green-600 hover:bg-green-700">
            <Briefcase className="h-4 w-4 mr-2" />
            Post Job
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={jobsColumns}
          data={jobs}
          searchKey="title"
          searchPlaceholder="Search jobs by title or company..."
          onRowClick={(job) => handleRowClick(job, 'job')}
        />
      </CardContent>
    </Card>
  )

  const renderApplicantsView = () => (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle>Application Management</CardTitle>
        <CardDescription>Review and manage all job applications</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Application Dashboard</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Comprehensive application management system with advanced filtering, 
            status tracking, and communication tools.
          </p>
          <Button className="mt-4 bg-blue-600 hover:bg-blue-700">
            Configure Application Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  const renderSystemView = () => (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle>System Monitoring</CardTitle>
        <CardDescription>Real-time system performance and health metrics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Server Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Uptime</span>
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700">{systemStats.systemUptime}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Response Time</span>
                <span className="font-mono">{systemStats.responseTime}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Server Load</span>
                <span className="font-mono">{systemStats.serverLoad}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Database</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Connection</span>
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700">Healthy</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Total Records</span>
                <span className="font-mono">24.5K</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Cache Hit Rate</span>
                <span className="font-mono">98.2%</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  )

  const renderSecurityView = () => (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle>Security Dashboard</CardTitle>
        <CardDescription>Monitor security events and configure access controls</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Security Management</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Advanced security controls, audit logs, and threat detection systems 
            to protect your platform and user data.
          </p>
          <Button className="mt-4 bg-purple-600 hover:bg-purple-700">
            Access Security Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-slate-50">
        <Sidebar className="border-r bg-white shadow-sm">
          <SidebarHeader className="border-b px-6 py-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 w-10 h-10 rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <h2 className="font-bold text-lg">Admin Console</h2>
                <p className="text-white/70 text-xs">CareerConnect v2.1</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Administration</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {sidebarItems.map((item) => (
                    <SidebarMenuItem key={item.view}>
                      <SidebarMenuButton
                        onClick={() => setActiveView(item.view)}
                        isActive={activeView === item.view}
                        className="hover:bg-slate-100 transition-colors data-[active=true]:bg-blue-50 data-[active=true]:text-blue-700 data-[active=true]:border-r-2 data-[active=true]:border-blue-600"
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                        {item.badge && (
                          <Badge variant="secondary" className="ml-auto bg-slate-200 text-slate-700">
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
          
          <SidebarFooter className="border-t px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-10 h-10 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">JT</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Joshua Tulali</p>
                <p className="text-xs text-muted-foreground">Super Administrator</p>
              </div>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-red-50">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>
        
        <div className="flex-1 flex flex-col">
          <div className="bg-white border-b border-slate-200 shadow-sm">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <SidebarTrigger className="lg:hidden" />
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900 capitalize">{activeView}</h1>
                    <p className="text-slate-600 text-sm">
                      {activeView === 'dashboard' && 'Platform overview and key metrics'}
                      {activeView === 'users' && 'User account management and permissions'}
                      {activeView === 'jobs' && 'Job posting management and analytics'}
                      {activeView === 'applicants' && 'Application review and processing'}
                      {activeView === 'system' && 'System performance and monitoring'}
                      {activeView === 'security' && 'Security controls and audit logs'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <Input
                      placeholder="Search..."
                      className="pl-10 w-48 lg:w-64 border-slate-300"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 p-6">
            {renderContent()}
          </div>
        </div>

        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <DrawerContent>
            <div className="mx-auto w-full max-w-2xl">
              <DrawerHeader className="border-b">
                <DrawerTitle className="flex items-center gap-2">
                  {selectedItem?.type === 'user' ? (
                    <>
                      <Users className="h-5 w-5 text-blue-600" />
                      User Details
                    </>
                  ) : (
                    <>
                      <Briefcase className="h-5 w-5 text-green-600" />
                      Job Details
                    </>
                  )}
                </DrawerTitle>
                <DrawerDescription>
                  {selectedItem?.type === 'user' 
                    ? `Detailed information for ${selectedItem?.name}` 
                    : `Complete details for ${selectedItem?.title}`
                  }
                </DrawerDescription>
              </DrawerHeader>
              
              <div className="p-6">
                {selectedItem?.type === 'user' ? (
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-lg">
                          {selectedItem?.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold">{selectedItem?.name}</h3>
                        <p className="text-muted-foreground">{selectedItem?.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {getRoleBadge(selectedItem?.role)}
                          {getStatusBadge(selectedItem?.status)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 p-3 rounded-lg border">
                          <Mail className="h-4 w-4 text-blue-600" />
                          <div>
                            <p className="text-sm font-medium">Email Address</p>
                            <p className="text-sm text-muted-foreground">{selectedItem?.email}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 p-3 rounded-lg border">
                          <Calendar className="h-4 w-4 text-green-600" />
                          <div>
                            <p className="text-sm font-medium">Join Date</p>
                            <p className="text-sm text-muted-foreground">{selectedItem?.joinDate}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 p-3 rounded-lg border">
                          <Clock className="h-4 w-4 text-purple-600" />
                          <div>
                            <p className="text-sm font-medium">Last Login</p>
                            <p className="text-sm text-muted-foreground">{selectedItem?.lastLogin}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 p-3 rounded-lg border">
                          <Activity className="h-4 w-4 text-orange-600" />
                          <div>
                            <p className="text-sm font-medium">Account Status</p>
                            <p className="text-sm text-muted-foreground">
                              {selectedItem?.status === 'active' ? 'Active and verified' : 'Requires attention'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                        <Briefcase className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold">{selectedItem?.title}</h3>
                        <p className="text-muted-foreground">{selectedItem?.company}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {getStatusBadge(selectedItem?.status)}
                          <Badge variant="outline" className="bg-blue-50 text-blue-700">
                            {selectedItem?.applicants} applicants
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 p-3 rounded-lg border">
                          <Building className="h-4 w-4 text-blue-600" />
                          <div>
                            <p className="text-sm font-medium">Company</p>
                            <p className="text-sm text-muted-foreground">{selectedItem?.company}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 p-3 rounded-lg border">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          <div>
                            <p className="text-sm font-medium">Salary Range</p>
                            <p className="text-sm text-muted-foreground">{selectedItem?.salary}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 p-3 rounded-lg border">
                          <Users className="h-4 w-4 text-purple-600" />
                          <div>
                            <p className="text-sm font-medium">Applicants</p>
                            <p className="text-sm text-muted-foreground">{selectedItem?.applicants} total</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 p-3 rounded-lg border">
                          <Calendar className="h-4 w-4 text-orange-600" />
                          <div>
                            <p className="text-sm font-medium">Posted Date</p>
                            <p className="text-sm text-muted-foreground">{selectedItem?.postedDate}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <DrawerFooter className="border-t">
                <div className="flex gap-3 w-full">
                  <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit {selectedItem?.type}
                  </Button>
                  {selectedItem?.type === 'user' && (
                    <Button variant="outline" className="flex-1 border-red-300 text-red-700 hover:bg-red-50">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Deactivate User
                    </Button>
                  )}
                  {selectedItem?.type === 'job' && (
                    <Button variant="outline" className="flex-1 border-green-300 text-green-700 hover:bg-green-50">
                      <Eye className="h-4 w-4 mr-2" />
                      View Applications
                    </Button>
                  )}
                </div>
                <DrawerClose asChild>
                  <Button variant="outline" className="w-full border-slate-300">
                    Close Details
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </SidebarProvider>
  )
}

export default AdminPage