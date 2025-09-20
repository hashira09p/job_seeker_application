import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Combobox } from "@/components/ui/combobox"
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import * as React from "react"
import { Link } from 'react-router-dom'
import { Search, MapPin, Briefcase, Filter, Star, Building2, Clock, DollarSign, ArrowRight, Mail, Phone, Users, Calendar, FileText, Award, Heart, Share2, GripHorizontal, Maximize2, Minimize2, ChevronUp } from 'lucide-react'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Breadcrumb from '@/components/Breadcrumb'
import ApiService from '@/services/api'

function JobsPage() {
  const [jobType, setJobType] = React.useState("")
  const [experienceLevel, setExperienceLevel] = React.useState("")
  const [salaryRange, setSalaryRange] = React.useState("")
  const [industry, setIndustry] = React.useState("")
  const [sortBy, setSortBy] = React.useState("latest")
  const [allJobs, setAllJobs] = React.useState([])
  const [filteredJobs, setFilteredJobs] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [locationQuery, setLocationQuery] = React.useState("")
  const [pagination, setPagination] = React.useState({})
  const [selectedJob, setSelectedJob] = React.useState(null)
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false)
  const [drawerHeight, setDrawerHeight] = React.useState(85)
  const [showScrollTop, setShowScrollTop] = React.useState(false)
  const scrollContainerRef = React.useRef(null)
  const searchTimeoutRef = React.useRef(null)
  const locationTimeoutRef = React.useRef(null)

  const jobTypeOptions = [
    { value: "full-time", label: "Full Time" },
    { value: "part-time", label: "Part Time" },
    { value: "contract", label: "Contract" },
    { value: "internship", label: "Internship" },
    { value: "freelance", label: "Freelance" }
  ]

  const experienceLevelOptions = [
    { value: "entry", label: "Entry Level" },
    { value: "mid", label: "Mid Level" },
    { value: "senior", label: "Senior Level" },
    { value: "executive", label: "Executive" }
  ]

  const salaryRangeOptions = [
    { value: "0-20000", label: "₱0 - ₱20,000" },
    { value: "20000-40000", label: "₱20,000 - ₱40,000" },
    { value: "40000-60000", label: "₱40,000 - ₱60,000" },
    { value: "60000-80000", label: "₱60,000 - ₱80,000" },
    { value: "80000+", label: "₱80,000+" }
  ]

  const industryOptions = [
    { value: "technology", label: "Technology" },
    { value: "healthcare", label: "Healthcare" },
    { value: "finance", label: "Finance" },
    { value: "education", label: "Education" },
    { value: "manufacturing", label: "Manufacturing" },
    { value: "retail", label: "Retail" },
    { value: "hospitality", label: "Hospitality" }
  ]

  const sortOptions = [
    { value: "latest", label: "Latest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "salary-high", label: "Highest Salary" },
    { value: "salary-low", label: "Lowest Salary" }
  ]

  React.useEffect(() => {
    loadAllJobs()
  }, [])

  const loadAllJobs = async () => {
    try {
      setLoading(true)
      const response = await ApiService.getJobs({})
      setAllJobs(response.jobs || [])
      setFilteredJobs(response.jobs || [])
      setPagination(response.pagination || {})
    } catch (error) {
      console.error('Error loading jobs:', error)
      setAllJobs([])
      setFilteredJobs([])
      setPagination({})
    } finally {
      setLoading(false)
    }
  }

  const filterJobs = React.useCallback(() => {
    let filtered = [...allJobs]

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(query) ||
        job.company_name.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query) ||
        job.requirements.some(req => req.toLowerCase().includes(query))
      )
    }

    if (locationQuery.trim()) {
      const location = locationQuery.toLowerCase()
      filtered = filtered.filter(job => 
        job.location.toLowerCase().includes(location)
      )
    }

    if (jobType) {
      filtered = filtered.filter(job => 
        job.job_type.toLowerCase() === jobType.toLowerCase()
      )
    }

    if (experienceLevel) {
      filtered = filtered.filter(job => {
        const salary = (job.salary_min + job.salary_max) / 2
        switch (experienceLevel) {
          case 'entry':
            return salary <= 30000
          case 'mid':
            return salary > 30000 && salary <= 60000
          case 'senior':
            return salary > 60000 && salary <= 100000
          case 'executive':
            return salary > 100000
          default:
            return true
        }
      })
    }

    if (salaryRange) {
      filtered = filtered.filter(job => {
        const [min, max] = salaryRange.split('-').map(s => parseInt(s.replace(/[^\d]/g, '')))
        switch (salaryRange) {
          case '0-20000':
            return job.salary_max <= 20000
          case '20000-40000':
            return job.salary_min >= 20000 && job.salary_max <= 40000
          case '40000-60000':
            return job.salary_min >= 40000 && job.salary_max <= 60000
          case '60000-80000':
            return job.salary_min >= 60000 && job.salary_max <= 80000
          case '80000+':
            return job.salary_min >= 80000
          default:
            return true
        }
      })
    }

    if (industry) {
      filtered = filtered.filter(job => {
        const company = job.company_name.toLowerCase()
        switch (industry) {
          case 'technology':
            return company.includes('globe') || company.includes('tech')
          case 'healthcare':
            return company.includes('medical') || company.includes('hospital')
          case 'finance':
            return company.includes('sm') || company.includes('investment')
          case 'education':
            return company.includes('university') || company.includes('school')
          case 'manufacturing':
            return company.includes('manufacturing') || company.includes('production')
          case 'retail':
            return company.includes('retail') || company.includes('store')
          case 'hospitality':
            return company.includes('hotel') || company.includes('restaurant')
          default:
            return true
        }
      })
    }

    switch (sortBy) {
      case 'latest':
        filtered.sort((a, b) => new Date(b.posted_date) - new Date(a.posted_date))
        break
      case 'oldest':
        filtered.sort((a, b) => new Date(a.posted_date) - new Date(b.posted_date))
        break
      case 'salary-high':
        filtered.sort((a, b) => b.salary_max - a.salary_max)
        break
      case 'salary-low':
        filtered.sort((a, b) => a.salary_min - b.salary_min)
        break
      default:
        break
    }

    setFilteredJobs(filtered)
    setPagination({
      total_jobs: filtered.length,
      current_page: 1,
      total_pages: 1,
      per_page: filtered.length
    })
  }, [allJobs, searchQuery, locationQuery, jobType, experienceLevel, salaryRange, industry, sortBy])

  React.useEffect(() => {
    filterJobs()
  }, [filterJobs])

  const handleSearchChange = (value) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }
    searchTimeoutRef.current = setTimeout(() => {
      setSearchQuery(value)
    }, 300)
  }

  const handleLocationChange = (value) => {
    if (locationTimeoutRef.current) {
      clearTimeout(locationTimeoutRef.current)
    }
    locationTimeoutRef.current = setTimeout(() => {
      setLocationQuery(value)
    }, 300)
  }

  const handleSearch = () => {
  }

  const handleViewDetails = (job) => {
    setSelectedJob(job)
    setIsDrawerOpen(true)
  }

  const handleResizeDrawer = (newHeight) => {
    setDrawerHeight(Math.max(30, Math.min(95, newHeight)))
  }

  const toggleDrawerSize = () => {
    setDrawerHeight(drawerHeight === 85 ? 50 : 85)
  }

  const scrollToTop = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleScroll = (e) => {
    setShowScrollTop(e.target.scrollTop > 100)
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f9f9f9' }}>
      <Navigation />
      <Breadcrumb />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Briefcase className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Find Your Dream Job
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover thousands of job opportunities across the Philippines and connect with top employers
          </p>
        </div>

        <Card className="shadow-lg border-0 mb-16">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" />
              Search Jobs
            </CardTitle>
            <CardDescription>
              Find the perfect job that matches your skills and preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-8">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Job title, keywords, or company name"
                    className="pl-10 h-12 text-lg"
                    defaultValue={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                  />
                </div>
                <div className="flex-1 relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Location, city, or region"
                    className="pl-10 h-12 text-lg"
                    defaultValue={locationQuery}
                    onChange={(e) => handleLocationChange(e.target.value)}
                  />
                </div>
                <Button 
                  className="h-12 px-8 text-lg hover:bg-[#1c1c1c] transition-colors"
                  onClick={handleSearch}
                  disabled={loading}
                >
                  {loading ? 'Loading...' : 'Search'}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>

            <div className="border-t pt-6">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Advanced Filters</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Job Type</label>
                  <Combobox
                    options={jobTypeOptions}
                    value={jobType}
                    onValueChange={setJobType}
                    placeholder="All Job Types"
                    searchPlaceholder="Search job types..."
                    className="h-12"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Experience Level</label>
                  <Combobox
                    options={experienceLevelOptions}
                    value={experienceLevel}
                    onValueChange={setExperienceLevel}
                    placeholder="All Levels"
                    searchPlaceholder="Search experience levels..."
                    className="h-12"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Salary Range</label>
                  <Combobox
                    options={salaryRangeOptions}
                    value={salaryRange}
                    onValueChange={setSalaryRange}
                    placeholder="Any Salary"
                    searchPlaceholder="Search salary ranges..."
                    className="h-12"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Industry</label>
                  <Combobox
                    options={industryOptions}
                    value={industry}
                    onValueChange={setIndustry}
                    placeholder="All Industries"
                    searchPlaceholder="Search industries..."
                    className="h-12"
                  />
                </div>
              </div>

              <div className="mt-6">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="cursor-pointer hover:bg-[#1c1c1c] hover:text-white transition-colors">
                    Remote Work
                  </Badge>
                  <Badge variant="secondary" className="cursor-pointer hover:bg-[#1c1c1c] hover:text-white transition-colors">
                    Urgent Hiring
                  </Badge>
                  <Badge variant="secondary" className="cursor-pointer hover:bg-[#1c1c1c] hover:text-white transition-colors">
                    Fresh Graduates
                  </Badge>
                  <Badge variant="secondary" className="cursor-pointer hover:bg-[#1c1c1c] hover:text-white transition-colors">
                    Work from Home
                  </Badge>
                  <Badge variant="secondary" className="cursor-pointer hover:bg-[#1c1c1c] hover:text-white transition-colors">
                    Government Jobs
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Latest Job Openings</h2>
              <p className="text-muted-foreground">
                {loading ? 'Loading...' : `Showing ${filteredJobs.length} results`}
                {(searchQuery || locationQuery || jobType || experienceLevel || salaryRange || industry) && (
                  <span className="ml-2 text-green-600 text-sm font-medium">• Real-time filtered</span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-full sm:w-48">
                <Combobox
                  options={sortOptions}
                  value={sortBy}
                  onValueChange={setSortBy}
                  placeholder="Sort by"
                  searchPlaceholder="Search sort options..."
                  className="h-10"
                />
              </div>
            </div>
          </div>

          {loading ? (
            <Card className="shadow-lg border-0">
              <CardContent className="pt-12 pb-12">
                <div className="text-center">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Briefcase className="h-8 w-8 text-primary animate-pulse" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Loading Jobs...</h3>
                  <p className="text-muted-foreground">Please wait while we fetch the latest job opportunities.</p>
                </div>
              </CardContent>
            </Card>
          ) : filteredJobs.length === 0 ? (
            <Card className="shadow-lg border-0">
              <CardContent className="pt-12 pb-12">
                <div className="text-center">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Briefcase className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">No Jobs Found</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Try adjusting your search criteria or filters to find more job opportunities. 
                    New jobs are added daily!
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button 
                      variant="outline" 
                      className="hover:bg-[#1c1c1c] hover:text-white transition-colors"
                      onClick={() => {
                        setSearchQuery('')
                        setLocationQuery('')
                        setJobType('')
                        setExperienceLevel('')
                        setSalaryRange('')
                        setIndustry('')
                        setSortBy('latest')
                      }}
                    >
                      Clear Filters
                    </Button>
                    <Button 
                      className="hover:bg-[#1c1c1c] transition-colors"
                      onClick={() => {
                        setSearchQuery('')
                        setLocationQuery('')
                        setJobType('')
                        setExperienceLevel('')
                        setSalaryRange('')
                        setIndustry('')
                        setSortBy('latest')
                      }}
                    >
                      Browse All Jobs
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <Card key={job.id} className="shadow-lg border-0 hover:shadow-xl transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-foreground">{job.title}</h3>
                          {job.is_urgent && (
                            <Badge className="bg-red-100 text-red-800">Urgent</Badge>
                          )}
                          {job.is_remote && (
                            <Badge className="bg-green-100 text-green-800">Remote</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground mb-2">
                          <Building2 className="h-4 w-4" />
                          <span>{job.company_name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground mb-2">
                          <MapPin className="h-4 w-4" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{job.job_type}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            <span>₱{job.salary_min?.toLocaleString()} - ₱{job.salary_max?.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button 
                          className="hover:bg-[#1c1c1c] transition-colors"
                          onClick={() => handleViewDetails(job)}
                        >
                          View Details
                        </Button>
                        <Button variant="outline" className="hover:bg-[#1c1c1c] hover:text-white transition-colors">
                          Apply Now
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Popular Job Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow cursor-pointer hover:bg-[#1c1c1c] hover:text-white group">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center group-hover:bg-white/20">
                    <Building2 className="h-6 w-6 text-primary group-hover:text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold group-hover:text-white">Technology</h3>
                    <p className="text-sm text-muted-foreground group-hover:text-gray-300">Software, IT, Data</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow cursor-pointer hover:bg-[#1c1c1c] hover:text-white group">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center group-hover:bg-white/20">
                    <Star className="h-6 w-6 text-primary group-hover:text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold group-hover:text-white">Healthcare</h3>
                    <p className="text-sm text-muted-foreground group-hover:text-gray-300">Medical, Nursing, Pharma</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow cursor-pointer hover:bg-[#1c1c1c] hover:text-white group">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center group-hover:bg-white/20">
                    <DollarSign className="h-6 w-6 text-primary group-hover:text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold group-hover:text-white">Finance</h3>
                    <p className="text-sm text-muted-foreground group-hover:text-gray-300">Banking, Accounting</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow cursor-pointer hover:bg-[#1c1c1c] hover:text-white group">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center group-hover:bg-white/20">
                    <Clock className="h-6 w-6 text-primary group-hover:text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold group-hover:text-white">Customer Service</h3>
                    <p className="text-sm text-muted-foreground group-hover:text-gray-300">Support, Sales, BPO</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow cursor-pointer hover:bg-[#1c1c1c] hover:text-white group">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center group-hover:bg-white/20">
                    <MapPin className="h-6 w-6 text-primary group-hover:text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold group-hover:text-white">Education</h3>
                    <p className="text-sm text-muted-foreground group-hover:text-gray-300">Teaching, Training</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow cursor-pointer hover:bg-[#1c1c1c] hover:text-white group">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center group-hover:bg-white/20">
                    <Briefcase className="h-6 w-6 text-primary group-hover:text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold group-hover:text-white">Manufacturing</h3>
                    <p className="text-sm text-muted-foreground group-hover:text-gray-300">Production, Engineering</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="text-center mt-16">
          <Card className="shadow-lg border-0 bg-primary/5">
            <CardContent className="pt-8 pb-8">
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Ready to Find Your Next Career?
              </h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Create your profile, upload your resume, and start applying to thousands of job opportunities across the Philippines.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/signup">
                  <Button 
                    size="lg" 
                    className="px-8 py-4 text-lg hover:bg-[#1c1c1c] transition-colors"
                  >
                    Create Account
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
                <Link to="/upload-resume">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="px-8 py-4 text-lg hover:bg-[#1c1c1c] hover:text-white transition-colors"
                  >
                    Upload Resume for Job Matches
                  </Button>
                </Link>
                <Link to="/">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="px-8 py-4 text-lg hover:bg-[#1c1c1c] hover:text-white transition-colors"
                  >
                    Back to Home
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent 
          className="transition-all duration-300 ease-in-out"
          style={{ height: `${drawerHeight}vh` }}
        >
          <div className="flex items-center justify-center py-2 border-b bg-muted/30 cursor-row-resize">
            <div className="flex items-center gap-2">
              <GripHorizontal className="h-4 w-4 text-muted-foreground" />
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleResizeDrawer(drawerHeight - 10)}
                  className="h-6 w-6 p-0 hover:bg-muted"
                >
                  <Minimize2 className="h-3 w-3" />
                </Button>
                <span className="text-xs text-muted-foreground px-2 min-w-[3rem] text-center">
                  {drawerHeight}%
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleResizeDrawer(drawerHeight + 10)}
                  className="h-6 w-6 p-0 hover:bg-muted"
                >
                  <Maximize2 className="h-3 w-3" />
                </Button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleDrawerSize}
                className="h-6 px-2 text-xs hover:bg-muted"
              >
                {drawerHeight === 85 ? 'Minimize' : 'Maximize'}
              </Button>
            </div>
          </div>

          <div className="mx-auto w-full max-w-4xl flex flex-col h-full">
            <DrawerHeader className="text-center flex-shrink-0">
              <DrawerTitle className="text-2xl font-bold">{selectedJob?.title}</DrawerTitle>
              <DrawerDescription className="text-lg">
                {selectedJob?.company_name} • {selectedJob?.location}
              </DrawerDescription>
            </DrawerHeader>
            
            {selectedJob && (
              <>
                <div 
                  ref={scrollContainerRef}
                  className="flex-1 overflow-y-auto px-4 space-y-6 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent relative"
                  onScroll={handleScroll}
                >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="text-sm text-muted-foreground">Salary Range</p>
                          <p className="font-semibold">₱{selectedJob.salary_min?.toLocaleString()} - ₱{selectedJob.salary_max?.toLocaleString()}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="text-sm text-muted-foreground">Job Type</p>
                          <p className="font-semibold">{selectedJob.job_type}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-purple-600" />
                        <div>
                          <p className="text-sm text-muted-foreground">Posted</p>
                          <p className="font-semibold">{new Date(selectedJob.posted_date).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Job Description
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {selectedJob.description}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      Requirements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {selectedJob.requirements?.map((req, index) => (
                        <Badge key={index} variant="secondary" className="text-sm">
                          {req}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Contact Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <Mail className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="text-sm text-muted-foreground">HR Email</p>
                          <p className="font-medium">hr@{selectedJob.company_name.toLowerCase().replace(/\s+/g, '')}.com</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <Phone className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="text-sm text-muted-foreground">Contact Number</p>
                          <p className="font-medium">+63 2 8XXX XXXX</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <Building2 className="h-5 w-5 text-purple-600" />
                      <div>
                        <p className="text-sm text-muted-foreground">Office Address</p>
                        <p className="font-medium">{selectedJob.location}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      About {selectedJob.company_name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {selectedJob.company_name} is a leading company in the Philippines, committed to providing excellent 
                      career opportunities for talented professionals. We offer competitive compensation, comprehensive 
                      benefits, and a supportive work environment that fosters growth and development.
                    </p>
                  </CardContent>
                </Card>

                  {showScrollTop && (
                    <div className="fixed bottom-20 right-6 z-50">
                      <Button
                        onClick={scrollToTop}
                        size="sm"
                        className="rounded-full shadow-lg hover:bg-[#1c1c1c] transition-colors"
                      >
                        <ChevronUp className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>

                <div className="flex-shrink-0 border-t bg-background px-4 py-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button className="flex-1 hover:bg-[#1c1c1c] transition-colors">
                      <Mail className="h-4 w-4 mr-2" />
                      Apply via Email
                    </Button>
                    <Button variant="outline" className="flex-1 hover:bg-[#1c1c1c] hover:text-white transition-colors">
                      <Heart className="h-4 w-4 mr-2" />
                      Save Job
                    </Button>
                    <Button variant="outline" className="flex-1 hover:bg-[#1c1c1c] hover:text-white transition-colors">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </DrawerContent>
      </Drawer>

      <Footer />
    </div>
  )
}

export default JobsPage

