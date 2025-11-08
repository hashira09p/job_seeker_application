import React from 'react'
import { Button } from "@/components/ui/button"
import { Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import logoImage from '@/assets/logo.png'
import { io } from "socket.io-client"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { LogOut, User, FileText, Bell, X, Calendar, MapPin, Building } from 'lucide-react'

function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [userName, setUserName] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [hasNewApplications, setHasNewApplications] = useState(false)
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [hasAutoShown, setHasAutoShown] = useState(false)
  const [notificationCount, setNotificationCount] = useState(0)
  const socketRef = useRef(null)
  const URL = "http://localhost:3000"

  // Initialize socket connection and user authentication
  useEffect(() => {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("userData")
    
    // If no token or already connected, return early
    if (!token || socketRef.current) {
      return
    }
    
    setIsLoggedIn(true)
    
    if (userData) {
      try {
        const user = JSON.parse(userData)
        setUserName(user.name || user.email || 'User')
      } catch (error) {
        console.error('Error parsing user data:', error)
        setUserName('User')
      }
    } else {
      setUserName('User')
    }
    
    // Initialize socket connection ONLY if not already connected
    console.log("🔄 Creating new socket connection...")
    const newSocket = io(URL, {
      transports: ['websocket', 'polling'],
      upgrade: true,
      forceNew: false
    })
    
    socketRef.current = newSocket
    
    // Socket event listeners
    newSocket.on("connect", () => {
      console.log("✅ Connected to server with ID:", newSocket.id)
    })

    newSocket.on("disconnect", (reason) => {
      console.log("❌ Disconnected from server:", reason)
    })

    newSocket.on("connect_error", (error) => {
      console.log("🔌 Connection error:", error)
    })

    // Listen for application status updates from backend
    newSocket.on("applicationStatusUpdated", (data) => {
      console.log("📨 Received status update from backend:", data)
      
      // Create new notification for application status update
      const newNotification = {
        id: Date.now() + Math.random(),
        type: 'application_update',
        title: getNotificationTitle(data.status),
        message: getNotificationMessage(data.jobTitle, data.company, data.status),
        timestamp: new Date(),
        jobTitle: data.jobTitle,
        company: data.company,
        status: data.status,
        read: false,
        applicationId: data.applicationId,
        userId: data.userId
      }

      // Add to notifications at the TOP (newest first)
      setNotifications(prev => {
        const updatedNotifications = [newNotification, ...prev]
        console.log("📝 New notification added. Total:", updatedNotifications.length)
        return updatedNotifications
      })
      
      // Increment notification count and show badge
      setNotificationCount(prev => prev + 1)
      setHasNewApplications(true)
      
      // Auto-show modal for important status updates
      if (['shortlisted', 'hired', 'rejected'].includes(data.status)) {
        setIsNotificationModalOpen(true)
      }
    })

    // Load existing notifications from localStorage
    loadExistingNotifications()

    // Cleanup socket connection on unmount
    return () => {
      console.log("🧹 Cleaning up socket connection...")
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current = null
      }
    }
  }, [])

  // Load existing notifications from localStorage
  const loadExistingNotifications = () => {
    const savedNotifications = localStorage.getItem('userNotifications')
    if (savedNotifications) {
      try {
        const parsedNotifications = JSON.parse(savedNotifications)
        // Filter only application updates and convert timestamp strings to Date objects
        // Sort by timestamp descending (newest first)
        const applicationNotifications = parsedNotifications
          .filter(notif => notif.type === 'application_update')
          .map(notif => ({
            ...notif,
            timestamp: new Date(notif.timestamp)
          }))
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        
        setNotifications(applicationNotifications)
        
        // Check if there are any unread notifications
        const unreadCount = applicationNotifications.filter(notif => !notif.read).length
        setNotificationCount(unreadCount)
        setHasNewApplications(unreadCount > 0)
        console.log("📂 Loaded notifications. Unread count:", unreadCount)
      } catch (error) {
        console.error('Error loading notifications:', error)
      }
    }
  }

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    if (isLoggedIn && notifications.length > 0) {
      localStorage.setItem('userNotifications', JSON.stringify(notifications))
    }
  }, [notifications, isLoggedIn])

  // Auto-show notification modal on page refresh if there are new notifications
  useEffect(() => {
    if (isLoggedIn && hasNewApplications && !hasAutoShown && notifications.length > 0) {
      const timer = setTimeout(() => {
        setIsNotificationModalOpen(true)
        setHasAutoShown(true)
        sessionStorage.setItem('notificationAutoShown', 'true')
      }, 1000)
      
      return () => clearTimeout(timer)
    }
  }, [isLoggedIn, hasNewApplications, hasAutoShown, notifications])

  // Check sessionStorage on component mount
  useEffect(() => {
    const wasAutoShown = sessionStorage.getItem('notificationAutoShown')
    if (wasAutoShown) {
      setHasAutoShown(true)
    }
  }, [])

  // Get notification title based on status
  const getNotificationTitle = (status) => {
    const titleMap = {
      pending: 'Application Submitted',
      under_review: 'Application Under Review',
      shortlisted: 'Application Shortlisted!',
      hired: 'Congratulations! You\'re Hired!',
      rejected: 'Application Update'
    }
    return titleMap[status] || 'Application Status Updated'
  }

  // Get notification message based on status
  const getNotificationMessage = (jobTitle, company, status) => {
    const messageMap = {
      pending: `Your application for ${jobTitle} at ${company} has been submitted successfully.`,
      under_review: `Your application for ${jobTitle} at ${company} is now under review.`,
      shortlisted: `Congratulations! Your application for ${jobTitle} at ${company} has been shortlisted for the next stage.`,
      hired: `Congratulations! You have been hired for the ${jobTitle} position at ${company}. Welcome to the team!`,
      rejected: `Thank you for your interest. Your application for ${jobTitle} at ${company} has been carefully reviewed.`
    }
    return messageMap[status] || `Your application for ${jobTitle} at ${company} has been updated.`
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const handleLogout = () => {
    // Disconnect socket
    if (socketRef.current) {
      console.log("🚪 Disconnecting socket on logout")
      socketRef.current.disconnect()
      socketRef.current = null
    }
    
    // Clear all user data from localStorage
    localStorage.removeItem("token")
    localStorage.removeItem("userData")
    localStorage.removeItem("userNotifications")
    sessionStorage.removeItem('notificationAutoShown')
    
    // Reset state
    setIsLoggedIn(false)
    setUserName('')
    setHasNewApplications(false)
    setNotifications([])
    setNotificationCount(0)
    setHasAutoShown(false)
    
    // Close mobile menu if open
    setIsMobileMenuOpen(false)
    
    // Redirect to home page
    window.location.href = '/'
  }

  const handleBellClick = () => {
    // Mark all notifications as read when user clicks the bell
    const updatedNotifications = notifications.map(notif => ({ ...notif, read: true }))
    setNotifications(updatedNotifications)
    setHasNewApplications(false)
    setNotificationCount(0)
    console.log("All notifications marked as read")
    
    // Open notification modal
    setIsNotificationModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsNotificationModalOpen(false)
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-800' },
      under_review: { label: 'Under Review', className: 'bg-blue-100 text-blue-800' },
      shortlisted: { label: 'Shortlisted', className: 'bg-green-100 text-green-800' },
      hired: { label: 'Hired', className: 'bg-emerald-100 text-emerald-800' },
      rejected: { label: 'Rejected', className: 'bg-red-100 text-red-800' }
    }

    const config = statusConfig[status] || statusConfig.pending

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.className}`}>
        {config.label}
      </span>
    )
  }

  // Helper function for notification background colors based on status
  const getNotificationBackground = (status) => {
    const backgroundMap = {
      shortlisted: 'bg-green-50 border-green-200',
      hired: 'bg-emerald-50 border-emerald-200',
      rejected: 'bg-red-50 border-red-200',
      pending: 'bg-blue-50 border-blue-200',
      under_review: 'bg-blue-50 border-blue-200'
    }
    return backgroundMap[status] || 'bg-blue-50 border-blue-200'
  }

  const formatTimeAgo = (timestamp) => {
    const now = new Date()
    const diffInSeconds = Math.floor((now - timestamp) / 1000)
    
    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    return `${Math.floor(diffInSeconds / 86400)}d ago`
  }

  // Handle notification click - navigate to applied jobs
  const handleNotificationClick = (notification) => {
    // Mark this notification as read
    const updatedNotifications = notifications.map(notif => 
      notif.id === notification.id ? { ...notif, read: true } : notif
    )
    setNotifications(updatedNotifications)
    
    // Update notification count
    const newUnreadCount = updatedNotifications.filter(n => !n.read).length
    setNotificationCount(newUnreadCount)
    setHasNewApplications(newUnreadCount > 0)
    
    handleCloseModal()
    // Navigate to applied jobs page
    window.location.href = '/applied-jobs'
  }

  // Clear all notifications
  const handleClearAll = () => {
    setNotifications([])
    setHasNewApplications(false)
    setNotificationCount(0)
    localStorage.removeItem('userNotifications')
    console.log("All notifications cleared")
  }

  // Mark single notification as read
  const markAsRead = (notificationId, e) => {
    e.stopPropagation() // Prevent triggering the notification click
    const updatedNotifications = notifications.map(notif => 
      notif.id === notificationId ? { ...notif, read: true } : notif
    )
    setNotifications(updatedNotifications)
    
    const newUnreadCount = updatedNotifications.filter(n => !n.read).length
    setNotificationCount(newUnreadCount)
    setHasNewApplications(newUnreadCount > 0)
    console.log("Notification marked as read. Unread count:", newUnreadCount)
  }

  return (
    <nav className="bg-card/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Navigation Menu */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
              <img
                src={logoImage}
                alt="Una sa Trabaho Logo"
                className="w-12 h-12 mr-2 object-contain"
              />
              <span className="text-lg font-bold text-primary hidden sm:block">
                Una sa Trabaho
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link to="/jobs">
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Jobs
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/job-fairs">
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Job Fairs
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/companies">
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Companies
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/upload-resume">
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Upload Resume
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                {/* Applied Jobs Menu Item */}
                {isLoggedIn && (
                  <NavigationMenuItem>
                    <Link to="/applied-jobs">
                      <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Applied Jobs
                        </div>
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                )}
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Services</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-4 w-[400px] md:w-[500px] lg:w-[600px]">
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <Link
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                            to="/peso"
                          >
                            <div className="mb-2 mt-4 text-lg font-medium">
                              PESO Services
                            </div>
                            <p className="text-sm leading-tight text-muted-foreground">
                              Public Employment Service Office - Your gateway to employment opportunities and career guidance.
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <ListItem to="/about" title="About Us">
                        Learn about the PESO Employment Information System and our mission.
                      </ListItem>
                      <ListItem to="/users-guide" title="User Guide">
                        Step-by-step guides for using our platform effectively.
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Desktop Navigation - Conditional rendering based on login status */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                {/* Bell Icon with Notification Count */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative p-2 text-muted-foreground hover:text-primary hover:bg-primary/5"
                  onClick={handleBellClick}
                >
                  <Bell className="h-5 w-5" />
                  {notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center animate-pulse">
                      {notificationCount > 9 ? '9+' : notificationCount}
                    </span>
                  )}
                </Button>
                
                <div className="flex items-center space-x-2 bg-primary/10 px-3 py-2 rounded-lg">
                  <User className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-primary">
                    {userName}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-muted-foreground hover:text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="text-muted-foreground hover:text-primary hover:bg-primary/5">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button>
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
              className="p-2 relative"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              {isLoggedIn && notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-white text-xs flex items-center justify-center animate-pulse">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-card/95 backdrop-blur-md">
            <div className="px-4 py-4 space-y-4">
              <div className="space-y-3">
                <Link
                  to="/jobs"
                  className="block text-muted-foreground hover:text-primary transition-colors font-medium py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Jobs
                </Link>
                <Link
                  to="/job-fairs"
                  className="block text-muted-foreground hover:text-primary transition-colors font-medium py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Job Fairs
                </Link>
                <Link
                  to="/companies"
                  className="block text-muted-foreground hover:text-primary transition-colors font-medium py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Companies
                </Link>
                <Link
                  to="/upload-resume"
                  className="block text-muted-foreground hover:text-primary transition-colors font-medium py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Upload Resume
                </Link>

                {/* Applied Jobs in Mobile Menu */}
                {isLoggedIn && (
                  <Link
                    to="/applied-jobs"
                    className="block text-muted-foreground hover:text-primary transition-colors font-medium py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Applied Jobs
                      {notificationCount > 0 && (
                        <span className="w-3 h-3 bg-red-500 rounded-full text-white text-xs flex items-center justify-center animate-pulse">
                          {notificationCount > 9 ? '9+' : notificationCount}
                        </span>
                      )}
                    </div>
                  </Link>
                )}

                <div className="pt-2 border-t border-border">
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Services
                  </div>
                  <Link
                    to="/peso"
                    className="block text-muted-foreground hover:text-primary transition-colors font-medium py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    PESO Services
                  </Link>
                  <Link
                    to="/about"
                    className="block text-muted-foreground hover:text-primary transition-colors font-medium py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    About Us
                  </Link>
                  <Link
                    to="/users-guide"
                    className="block text-muted-foreground hover:text-primary transition-colors font-medium py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    User Guide
                  </Link>
                </div>
              </div>

              {/* Mobile Navigation - Conditional rendering based on login status */}
              <div className="pt-4 border-t border-border space-y-3">
                {isLoggedIn ? (
                  <>
                    {/* Mobile Bell Icon */}
                    <Button
                      variant="ghost"
                      className="w-full text-muted-foreground hover:text-primary hover:bg-primary/5"
                      onClick={() => {
                        handleBellClick()
                        setIsMobileMenuOpen(false)
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4" />
                        Notifications
                        {notificationCount > 0 && (
                          <span className="w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center animate-pulse">
                            {notificationCount > 9 ? '9+' : notificationCount}
                          </span>
                        )}
                      </div>
                    </Button>

                    <div className="flex items-center space-x-2 bg-primary/10 px-3 py-2 rounded-lg mb-3">
                      <User className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium text-primary">
                        {userName}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      className="w-full text-muted-foreground hover:text-red-600 hover:bg-red-50"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full text-muted-foreground hover:text-primary hover:bg-primary/5">
                        Login
                      </Button>
                    </Link>
                    <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button className="w-full">
                        Sign Up
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Notification Modal */}
      {/* Notification Modal */}
<Dialog open={isNotificationModalOpen} onOpenChange={setIsNotificationModalOpen}>
  <DialogContent className="sm:max-w-md">
    <DialogHeader>
      <DialogTitle className="flex items-center justify-between">
        <span className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Application Updates
          {notifications.length > 0 && (
            <span className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-1">
              {notifications.length}
            </span>
          )}
        </span>
        <div className="flex items-center gap-2">
          {notifications.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              className="text-xs text-muted-foreground hover:text-red-600"
            >
              Clear All
            </Button>
          )}
        </div>
      </DialogTitle>
      <DialogDescription>
        Your recent application status updates ({notifications.length} total, {notificationCount} unread)
      </DialogDescription>
    </DialogHeader>
    
    <div className="mt-4 space-y-3 max-h-96 overflow-y-auto">
      {notifications.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No application updates</p>
          <p className="text-sm mt-2">You'll be notified when your application status changes</p>
        </div>
      ) : (
        notifications.map((notification, index) => (
          <div
            key={notification.id}
            className={`p-4 rounded-lg border cursor-pointer ${
              notification.read 
                ? 'bg-gray-50 border-gray-200' 
                : getNotificationBackground(notification.status)
            } hover:shadow-md transition-shadow`}
            onClick={() => handleNotificationClick(notification)}
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-semibold text-sm">{notification.title}</h4>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {formatTimeAgo(notification.timestamp)}
                </span>
                {!notification.read && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0"
                    onClick={(e) => markAsRead(notification.id, e)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground mb-3">
              {notification.message}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs">
                <Building className="h-3 w-3" />
                <span className="font-medium">{notification.company}</span>
                <span>•</span>
                <span>{notification.jobTitle}</span>
              </div>
              {getStatusBadge(notification.status)}
            </div>
            
            {!notification.read && (
              <div className="mt-2 flex justify-end">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  New
                </span>
              </div>
            )}
          </div>
        ))
      )}
    </div>
    
    <div className="mt-4 flex justify-between items-center">
      <div className="text-xs text-muted-foreground">
        {notificationCount} unread of {notifications.length} total
      </div>
      <Button asChild variant="outline" size="sm">
        <Link to="/applied-jobs" onClick={handleCloseModal}>
          View All Applications
        </Link>
      </Button>
    </div>
  </DialogContent>
</Dialog>
    </nav>
  )
}

const ListItem = React.forwardRef(({ className, title, children, to, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
          to={to}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"

export default Navigation