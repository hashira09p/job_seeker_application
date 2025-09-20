import { Link, useLocation } from 'react-router-dom'
import { Home, ChevronRight } from 'lucide-react'

function Breadcrumb() {
  const location = useLocation()
  
  const breadcrumbMap = {
    '/login': 'Login',
    '/signup': 'Sign Up',
    '/peso': 'PESO',
    '/about': 'About',
    '/users-guide': 'Users Guide',
    '/job-fairs': 'Schedule of Job Fairs',
    '/jobs': 'Jobs',
    '/companies': 'Companies'
  }
  
  const currentPage = breadcrumbMap[location.pathname] || 'Page'
  
  if (location.pathname === '/') {
    return null
  }
  
  return (
    <div className="bg-white border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center text-sm text-muted-foreground">
          <Link 
            to="/" 
            className="flex items-center hover:text-primary transition-colors"
          >
            <Home className="h-4 w-4 mr-1" />
            Home
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-foreground font-medium">{currentPage}</span>
        </div>
      </div>
    </div>
  )
}

export default Breadcrumb

