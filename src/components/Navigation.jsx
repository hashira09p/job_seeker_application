import React from 'react'
import { Button } from "@/components/ui/button"
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import logoImage from '@/assets/logo.png'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"
import { LogOut, User } from 'lucide-react'

function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [userName, setUserName] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Check if user is logged in and get user info
  useEffect(() => {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("userData")
    
    if (token) {
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
    } else {
      setIsLoggedIn(false)
      setUserName('')
    }
  }, [])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const handleLogout = () => {
    // Clear all user data from localStorage
    localStorage.removeItem("token")
    localStorage.removeItem("userData")
    
    // Reset state
    setIsLoggedIn(false)
    setUserName('')
    
    // Close mobile menu if open
    setIsMobileMenuOpen(false)
    
    // Redirect to home page
    window.location.href = '/'
  }

  return (
    <nav className="bg-card/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
              <img
                src={logoImage}
                alt="Una sa Trabaho Logo"
                className="w-12 h-12 mr-2 object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
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
              className="p-2"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          </div>
        </div>

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