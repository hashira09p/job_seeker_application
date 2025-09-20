import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Link } from 'react-router-dom'
import { Search, Building2, Users, Briefcase, TrendingUp, Target, BookOpen, LogIn, ArrowRight } from 'lucide-react'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Find Your Dream Job
            <span className="text-primary"> Today</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Connect with top employers and discover opportunities that match your skills and aspirations. 
            Your next career move starts here.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex flex-col sm:flex-row gap-4 p-2 bg-card rounded-lg shadow-lg border">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Job title, keywords, or company"
                  className="pl-10"
                />
              </div>
              <Button className="px-8 py-3">
                Search Jobs
              </Button>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link to="/signup">
              <Button size="lg" className="px-8 py-4 text-lg">
                Get Started
              </Button>
            </Link>
            <Link to="/upload-resume">
              <Button size="lg" variant="outline" className="px-8 py-4 text-lg">
                Upload Resume for Job Matches
              </Button>
            </Link>
            <Link to="/jobs">
              <Button size="lg" variant="outline" className="px-8 py-4 text-lg">
                Browse Jobs
              </Button>
            </Link>
          </div>



          {/* Top Vacancies and Skills Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {/* Top Vacancies Card */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Top Vacancies for Applicants
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors">
                    <p className="text-sm font-medium text-foreground">Accountant (General)</p>
                  </div>
                  <div className="p-3 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors">
                    <p className="text-sm font-medium text-foreground">Customer Service Assistant</p>
                  </div>
                  <div className="p-3 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors">
                    <p className="text-sm font-medium text-foreground">Production Worker</p>
                  </div>
                  <div className="p-3 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors">
                    <p className="text-sm font-medium text-foreground">Pharmacist I (Gov)</p>
                  </div>
                  <div className="p-3 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors">
                    <p className="text-sm font-medium text-foreground">Call Center Agent</p>
                  </div>
                  <div className="p-3 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors">
                    <p className="text-sm font-medium text-foreground">Production Machine Operator</p>
                  </div>
                  <div className="p-3 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors">
                    <p className="text-sm font-medium text-foreground">Domestic Helper</p>
                  </div>
                  <div className="p-3 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors">
                    <p className="text-sm font-medium text-foreground">Laborer</p>
                  </div>
                  <div className="p-3 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors">
                    <p className="text-sm font-medium text-foreground">Service Crew</p>
                  </div>
                  <div className="p-3 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors">
                    <p className="text-sm font-medium text-foreground">Quality Assurance Inspector</p>
                  </div>
                  <div className="p-3 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors">
                    <p className="text-sm font-medium text-foreground">Cashier</p>
                  </div>
                  <div className="p-3 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors">
                    <p className="text-sm font-medium text-foreground">Laborer (Gov)</p>
                  </div>
                  <div className="p-3 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors">
                    <p className="text-sm font-medium text-foreground">Production Assistant</p>
                  </div>
                  <div className="p-3 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors">
                    <p className="text-sm font-medium text-foreground">Sales Clerk</p>
                  </div>
                  <div className="p-3 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors">
                    <p className="text-sm font-medium text-foreground">Utility Worker</p>
                  </div>
                  <div className="p-3 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors">
                    <p className="text-sm font-medium text-foreground">Production Helper</p>
                  </div>
                  <div className="p-3 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors">
                    <p className="text-sm font-medium text-foreground">Office Clerk</p>
                  </div>
                  <div className="p-3 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors">
                    <p className="text-sm font-medium text-foreground">Merchandiser</p>
                  </div>
                  <div className="p-3 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors">
                    <p className="text-sm font-medium text-foreground">Administration Services Aide</p>
                  </div>
                  <div className="p-3 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors">
                    <p className="text-sm font-medium text-foreground">Staff Nurse</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Skills Card */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Top Skills for Employers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors">
                    <p className="text-sm font-medium text-foreground">Laborer</p>
                  </div>
                  <div className="p-3 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors">
                    <p className="text-sm font-medium text-foreground">Production Worker</p>
                  </div>
                  <div className="p-3 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors">
                    <p className="text-sm font-medium text-foreground">Office Clerk</p>
                  </div>
                  <div className="p-3 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors">
                    <p className="text-sm font-medium text-foreground">Service Crew</p>
                  </div>
                  <div className="p-3 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors">
                    <p className="text-sm font-medium text-foreground">Cashier</p>
                  </div>
                  <div className="p-3 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors">
                    <p className="text-sm font-medium text-foreground">Call Center Agent</p>
                  </div>
                  <div className="p-3 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors">
                    <p className="text-sm font-medium text-foreground">Saleslady</p>
                  </div>
                  <div className="p-3 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors">
                    <p className="text-sm font-medium text-foreground">Data Encoder</p>
                  </div>
                  <div className="p-3 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors">
                    <p className="text-sm font-medium text-foreground">Street Sweeper</p>
                  </div>
                  <div className="p-3 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors">
                    <p className="text-sm font-medium text-foreground">Housekeeper (Private)</p>
                  </div>
                  <div className="p-3 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors">
                    <p className="text-sm font-medium text-foreground">Administrative Clerk</p>
                  </div>
                  <div className="p-3 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors">
                    <p className="text-sm font-medium text-foreground">Utility Worker</p>
                  </div>
                  <div className="p-3 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors">
                    <p className="text-sm font-medium text-foreground">Sales Clerk</p>
                  </div>
                  <div className="p-3 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors">
                    <p className="text-sm font-medium text-foreground">Administration Services Aide</p>
                  </div>
                  <div className="p-3 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors">
                    <p className="text-sm font-medium text-foreground">Gardener</p>
                  </div>
                  <div className="p-3 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors">
                    <p className="text-sm font-medium text-foreground">Bagger</p>
                  </div>
                  <div className="p-3 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors">
                    <p className="text-sm font-medium text-foreground">Customer Service Assistant</p>
                  </div>
                  <div className="p-3 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors">
                    <p className="text-sm font-medium text-foreground">Merchandiser</p>
                  </div>
                  <div className="p-3 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors">
                    <p className="text-sm font-medium text-foreground">Administrative Assistant</p>
                  </div>
                  <div className="p-3 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors">
                    <p className="text-sm font-medium text-foreground">Domestic Helper</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* User's Guide Section */}
          <div className="mb-16">
            <Card className="shadow-lg border-0 bg-gradient-to-r from-primary/5 to-primary/10">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <div className="bg-primary/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="h-8 w-8 text-primary" />
                  </div>
                  <h2 className="text-3xl font-bold text-foreground mb-4">
                    New to Una sa Trabaho?
                  </h2>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Get started quickly with our comprehensive User's Guide. Learn how to search jobs, explore companies, and make the most of our platform.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                      <LogIn className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">Account Setup</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Learn how to create an account and set up your profile for success.
                    </p>
                    <Badge variant="secondary" className="text-xs">
                      Quick Start
                    </Badge>
                  </div>

                  <div className="text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">Job Search</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Master the art of finding and applying to the perfect job opportunities.
                    </p>
                    <Badge variant="secondary" className="text-xs">
                      Essential
                    </Badge>
                  </div>

                  <div className="text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Building2 className="h-6 w-6 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">Company Research</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Discover how to research companies and find your ideal workplace.
                    </p>
                    <Badge variant="secondary" className="text-xs">
                      Advanced
                    </Badge>
                  </div>
                </div>

                <div className="text-center">
                  <Link to="/users-guide">
                    <Button 
                      size="lg" 
                      className="px-8 py-4 text-lg hover:bg-[#1c1c1c] transition-colors"
                    >
                      <BookOpen className="h-5 w-5 mr-2" />
                      Explore User's Guide
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>


        </div>
      </div>

      <Footer />
    </div>
  )
}

export default LandingPage
