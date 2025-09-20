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
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
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
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Building,
  DollarSign,
  Clock,
  BarChart3,
  Settings,
  Home,
  Menu
} from 'lucide-react'


function AdminPage() {
  const [activeView, setActiveView] = useState('dashboard')
  const [selectedItem, setSelectedItem] = useState(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const sidebarItems = [
    {
      title: "Dashboard",
      icon: BarChart3,
      view: "dashboard"
    },
    {
      title: "Users",
      icon: Users,
      view: "users"
    },
    {
      title: "Jobs",
      icon: Briefcase,
      view: "jobs"
    },
    {
      title: "Applicants",
      icon: FileText,
      view: "applicants"
    },
    {
      title: "Settings",
      icon: Settings,
      view: "settings"
    }
  ]

  const users = [
    { id: 1, name: 'Joshua Dee Tulali', email: 'joshua.tulali@unasatrabaho.com', status: 'active', joinDate: '2025-01-15', lastLogin: '2025-01-20' },
    { id: 2, name: 'Aerean Nicole Flores', email: 'aerean.flores@unasatrabaho.com', status: 'active', joinDate: '2025-01-10', lastLogin: '2025-01-19' },
    { id: 3, name: 'Ryan Cunnanan', email: 'ryan.cunnanan@unasatrabaho.com', status: 'inactive', joinDate: '2025-01-05', lastLogin: '2025-01-15' },
    { id: 4, name: 'Seth Ongotan', email: 'seth.ongotan@unasatrabaho.com', status: 'active', joinDate: '2025-01-12', lastLogin: '2025-01-20' },
    { id: 5, name: 'Joshua Dee Tulali', email: 'joshua.tulali2@unasatrabaho.com', status: 'pending', joinDate: '2025-01-18', lastLogin: '2025-01-18' },
  ]

  const jobs = [
    { id: 1, title: 'Software Engineer', company: 'Globe Telecom', applicants: 25, status: 'active', postedDate: '2025-01-15', salary: '₱65,000 - ₱85,000' },
    { id: 2, title: 'Marketing Specialist', company: 'Jollibee Foods Corporation', applicants: 18, status: 'active', postedDate: '2025-01-12', salary: '₱35,000 - ₱50,000' },
    { id: 3, title: 'Customer Service Representative', company: 'BPO Solutions Inc.', applicants: 32, status: 'closed', postedDate: '2025-01-08', salary: '₱25,000 - ₱35,000' },
    { id: 4, title: 'Accountant', company: 'SM Investments Corporation', applicants: 15, status: 'active', postedDate: '2025-01-16', salary: '₱40,000 - ₱55,000' },
    { id: 5, title: 'Nurse', company: 'St. Luke\'s Medical Center', applicants: 28, status: 'active', postedDate: '2025-01-14', salary: '₱30,000 - ₱45,000' },
  ]

  const stats = {
    totalLogins: 12,
    totalSignups: 14,
    totalJobs: 5,
    totalApplicants: 4
  }

  const handleRowClick = (item, type) => {
    setSelectedItem({ ...item, type })
    setIsDrawerOpen(true)
  }

  const getStatusBadge = (status) => {
    const variants = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      pending: 'bg-yellow-100 text-yellow-800',
      closed: 'bg-red-100 text-red-800'
    }
    return <Badge className={variants[status]}>{status}</Badge>
  }

  const usersColumns = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => <div className="font-medium">{row.getValue("id")}</div>,
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
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
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
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
      cell: ({ row }) => <div className="font-medium">{row.getValue("id")}</div>,
    },
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "company",
      header: "Company",
    },
    {
      accessorKey: "applicants",
      header: "Applicants",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => getStatusBadge(row.getValue("status")),
    },
    {
      accessorKey: "postedDate",
      header: "Posted Date",
    },
    {
      accessorKey: "salary",
      header: "Salary",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
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
      case 'settings':
        return renderSettingsView()
      default:
        return renderDashboard()
    }
  }

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-lg border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Logins</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLogins.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+9%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Signups</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSignups.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+8%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jobs Posted</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalJobs.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+15%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applicants</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalApplicants.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+22%</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle>User Activity</CardTitle>
            <CardDescription>Login and signup trends over the last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Chart visualization will be implemented here</p>
                <p className="text-sm text-muted-foreground">User activity over time</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle>Job Postings & Applications</CardTitle>
            <CardDescription>Job posting and application statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg">
              <div className="text-center">
                <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Chart visualization will be implemented here</p>
                <p className="text-sm text-muted-foreground">Jobs vs Applications</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderUsersTable = () => (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle>Users Management</CardTitle>
        <CardDescription>Manage user accounts and permissions</CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={usersColumns}
          data={users}
          searchKey="name"
          searchPlaceholder="Search users..."
          onRowClick={(user) => handleRowClick(user, 'user')}
        />
      </CardContent>
    </Card>
  )

  const renderJobsTable = () => (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle>Jobs Management</CardTitle>
        <CardDescription>Manage job postings and applications</CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={jobsColumns}
          data={jobs}
          searchKey="title"
          searchPlaceholder="Search jobs..."
          onRowClick={(job) => handleRowClick(job, 'job')}
        />
      </CardContent>
    </Card>
  )

  const renderApplicantsView = () => (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle>Applicants Management</CardTitle>
        <CardDescription>View and manage job applications</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Applicants Management</h3>
          <p className="text-muted-foreground">Applicant management features will be implemented here</p>
        </div>
      </CardContent>
    </Card>
  )

  const renderSettingsView = () => (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <CardDescription>Configure system settings and preferences</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">System Settings</h3>
          <p className="text-muted-foreground">Settings panel will be implemented here</p>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full" style={{ backgroundColor: '#f9f9f9' }}>
        <Sidebar className="border-r bg-white shadow-sm">
          <SidebarHeader className="border-b px-6 py-4">
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 w-8 h-8 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold text-lg">Admin Panel</h2>
                <p className="text-xs text-muted-foreground">Management Dashboard</p>
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
                <Users className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Joshua Dee Tulali</p>
                <p className="text-xs text-muted-foreground">joshua.tulali@unasatrabaho.com</p>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>
        
        <div className="flex-1 flex flex-col">
          
          <div className="flex-1 flex flex-col">
            <div className="bg-white border-b border-border">
              <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <SidebarTrigger className="lg:hidden" />
                    <div>
                      <h1 className="text-2xl font-bold text-foreground capitalize">{activeView}</h1>
                      <p className="text-muted-foreground text-sm">
                        {activeView === 'dashboard' && 'Overview of platform statistics and metrics'}
                        {activeView === 'users' && 'Manage user accounts and permissions'}
                        {activeView === 'jobs' && 'Manage job postings and applications'}
                        {activeView === 'applicants' && 'View and manage job applications'}
                        {activeView === 'settings' && 'Configure system settings and preferences'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="relative hidden md:block">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder="Search..."
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

            <div className="flex-1 p-6">
              {renderContent()}
            </div>
          </div>
        </div>

      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent>
          <div className="mx-auto w-full max-w-2xl">
            <DrawerHeader>
              <DrawerTitle>
                {selectedItem?.type === 'user' ? 'User Details' : 'Job Details'}
              </DrawerTitle>
              <DrawerDescription>
                {selectedItem?.type === 'user' 
                  ? `Viewing details for ${selectedItem?.name}` 
                  : `Viewing details for ${selectedItem?.title}`
                }
              </DrawerDescription>
            </DrawerHeader>
            <div className="p-6">
              {selectedItem?.type === 'user' ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{selectedItem?.name}</h3>
                      <p className="text-muted-foreground">{selectedItem?.email}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Email:</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{selectedItem?.email}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Join Date:</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{selectedItem?.joinDate}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Last Login:</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{selectedItem?.lastLogin}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Status:</span>
                      </div>
                      {getStatusBadge(selectedItem?.status)}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">User Activity</h4>
                    <p className="text-sm text-muted-foreground">
                      This user has been active on the platform and has applied to several job postings. 
                      Their profile is complete and verified.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                      <Briefcase className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{selectedItem?.title}</h3>
                      <p className="text-muted-foreground">{selectedItem?.company}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Company:</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{selectedItem?.company}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Salary Range:</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{selectedItem?.salary}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Applicants:</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{selectedItem?.applicants}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Posted Date:</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{selectedItem?.postedDate}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Job Description</h4>
                    <p className="text-sm text-muted-foreground">
                      This is a detailed job description for the {selectedItem?.title} position at {selectedItem?.company}. 
                      The role requires specific skills and experience. The company offers competitive benefits and 
                      opportunities for growth.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Application Status</h4>
                    <p className="text-sm text-muted-foreground">
                      This job posting has received {selectedItem?.applicants} applications and is currently 
                      {selectedItem?.status === 'active' ? ' accepting new applications' : ' closed for applications'}.
                    </p>
                  </div>
                </div>
              )}
            </div>
            <DrawerFooter>
              <div className="flex gap-2">
                <Button className="flex-1 hover:bg-[#1c1c1c] transition-colors">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit {selectedItem?.type === 'user' ? 'User' : 'Job'}
                </Button>
                {selectedItem?.type === 'user' && (
                  <Button variant="outline" className="flex-1 hover:bg-red-600 hover:text-white transition-colors">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Deactivate
                  </Button>
                )}
                {selectedItem?.type === 'job' && (
                  <Button variant="outline" className="flex-1 hover:bg-yellow-600 hover:text-white transition-colors">
                    <Eye className="h-4 w-4 mr-2" />
                    View Applications
                  </Button>
                )}
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

      </div>
    </SidebarProvider>
  )
}

export default AdminPage

