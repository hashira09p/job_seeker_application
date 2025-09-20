import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Combobox } from "@/components/ui/combobox"
import * as React from "react"
import { Link } from 'react-router-dom'
import { Search, MapPin, Building2, Filter, Star, Users, Globe, Award, ArrowRight } from 'lucide-react'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Breadcrumb from '@/components/Breadcrumb'

function CompaniesPage() {
  const [industry, setIndustry] = React.useState("")
  const [companySize, setCompanySize] = React.useState("")
  const [companyType, setCompanyType] = React.useState("")
  const [workArrangement, setWorkArrangement] = React.useState("")
  const [sortBy, setSortBy] = React.useState("name")

  const industryOptions = [
    { value: "technology", label: "Technology" },
    { value: "healthcare", label: "Healthcare" },
    { value: "finance", label: "Finance & Banking" },
    { value: "education", label: "Education" },
    { value: "manufacturing", label: "Manufacturing" },
    { value: "retail", label: "Retail & E-commerce" },
    { value: "hospitality", label: "Hospitality & Tourism" },
    { value: "telecommunications", label: "Telecommunications" },
    { value: "energy", label: "Energy & Utilities" }
  ]

  const companySizeOptions = [
    { value: "startup", label: "Startup (1-50)" },
    { value: "small", label: "Small (51-200)" },
    { value: "medium", label: "Medium (201-1000)" },
    { value: "large", label: "Large (1001-5000)" },
    { value: "enterprise", label: "Enterprise (5000+)" }
  ]

  const companyTypeOptions = [
    { value: "private", label: "Private Company" },
    { value: "public", label: "Public Company" },
    { value: "government", label: "Government" },
    { value: "nonprofit", label: "Non-Profit" },
    { value: "multinational", label: "Multinational" }
  ]

  const workArrangementOptions = [
    { value: "onsite", label: "On-site" },
    { value: "hybrid", label: "Hybrid" },
    { value: "remote", label: "Remote" },
    { value: "flexible", label: "Flexible" }
  ]

  const sortOptions = [
    { value: "name", label: "Name A-Z" },
    { value: "name-desc", label: "Name Z-A" },
    { value: "rating", label: "Highest Rated" },
    { value: "size", label: "Largest" },
    { value: "jobs", label: "Most Job Openings" }
  ]

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f9f9f9' }}>
      <Navigation />
      <Breadcrumb />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Building2 className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Discover Top Companies
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore leading companies across the Philippines and find your perfect workplace
          </p>
        </div>

        <Card className="shadow-lg border-0 mb-16">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" />
              Search Companies
            </CardTitle>
            <CardDescription>
              Find companies that match your career goals and values
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-8">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Company name, industry, or keywords"
                    className="pl-10 h-12 text-lg"
                  />
                </div>
                <div className="flex-1 relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Location, city, or region"
                    className="pl-10 h-12 text-lg"
                  />
                </div>
                <Button className="h-12 px-8 text-lg hover:bg-[#1c1c1c] transition-colors">
                  Search Companies
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

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Company Size</label>
                  <Combobox
                    options={companySizeOptions}
                    value={companySize}
                    onValueChange={setCompanySize}
                    placeholder="All Sizes"
                    searchPlaceholder="Search company sizes..."
                    className="h-12"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Company Type</label>
                  <Combobox
                    options={companyTypeOptions}
                    value={companyType}
                    onValueChange={setCompanyType}
                    placeholder="All Types"
                    searchPlaceholder="Search company types..."
                    className="h-12"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Work Arrangement</label>
                  <Combobox
                    options={workArrangementOptions}
                    value={workArrangement}
                    onValueChange={setWorkArrangement}
                    placeholder="All Arrangements"
                    searchPlaceholder="Search work arrangements..."
                    className="h-12"
                  />
                </div>
              </div>

              <div className="mt-6">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="cursor-pointer hover:bg-[#1c1c1c] hover:text-white transition-colors">
                    Career
                  </Badge>
                  <Badge variant="secondary" className="cursor-pointer hover:bg-[#1c1c1c] hover:text-white transition-colors">
                    Best Places to Work
                  </Badge>
                  <Badge variant="secondary" className="cursor-pointer hover:bg-[#1c1c1c] hover:text-white transition-colors">
                    Remote-Friendly
                  </Badge>
                  <Badge variant="secondary" className="cursor-pointer hover:bg-[#1c1c1c] hover:text-white transition-colors">
                    Startup
                  </Badge>
                  <Badge variant="secondary" className="cursor-pointer hover:bg-[#1c1c1c] hover:text-white transition-colors">
                    Hybrid
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Featured Companies</h2>
              <p className="text-muted-foreground">Showing 0 results</p>
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

          <Card className="shadow-lg border-0">
            <CardContent className="pt-12 pb-12">
              <div className="text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building2 className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">No Companies Found</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Try adjusting your search criteria or filters to find more companies. 
                  New companies are added regularly!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    variant="outline" 
                    className="hover:bg-[#1c1c1c] hover:text-white transition-colors"
                    onClick={() => window.location.reload()}
                  >
                    Clear Filters
                  </Button>
                  <Button 
                    className="hover:bg-[#1c1c1c] transition-colors"
                  >
                    Browse All Companies
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Popular Industries</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow cursor-pointer hover:bg-[#1c1c1c] hover:text-white group">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center group-hover:bg-white/20">
                    <Building2 className="h-6 w-6 text-primary group-hover:text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold group-hover:text-white">Technology</h3>
                    <p className="text-sm text-muted-foreground group-hover:text-gray-300">Software, IT, Digital</p>
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
                    <p className="text-sm text-muted-foreground group-hover:text-gray-300">Medical, Pharma, Biotech</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow cursor-pointer hover:bg-[#1c1c1c] hover:text-white group">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center group-hover:bg-white/20">
                    <Globe className="h-6 w-6 text-primary group-hover:text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold group-hover:text-white">Finance</h3>
                    <p className="text-sm text-muted-foreground group-hover:text-gray-300">Banking, Insurance, Fintech</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow cursor-pointer hover:bg-[#1c1c1c] hover:text-white group">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center group-hover:bg-white/20">
                    <Users className="h-6 w-6 text-primary group-hover:text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold group-hover:text-white">BPO & Call Centers</h3>
                    <p className="text-sm text-muted-foreground group-hover:text-gray-300">Customer Service, Support</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow cursor-pointer hover:bg-[#1c1c1c] hover:text-white group">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center group-hover:bg-white/20">
                    <Award className="h-6 w-6 text-primary group-hover:text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold group-hover:text-white">Manufacturing</h3>
                    <p className="text-sm text-muted-foreground group-hover:text-gray-300">Production, Engineering</p>
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
                    <h3 className="font-semibold group-hover:text-white">Real Estate</h3>
                    <p className="text-sm text-muted-foreground group-hover:text-gray-300">Property, Construction</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Why Choose These Companies?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="shadow-lg border-0 text-center">
              <CardContent className="p-6">
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Top Rated</h3>
                <p className="text-sm text-muted-foreground">
                  Companies with high employee satisfaction ratings
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 text-center">
              <CardContent className="p-6">
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Career Growth</h3>
                <p className="text-sm text-muted-foreground">
                  Opportunities for advancement and skill development
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 text-center">
              <CardContent className="p-6">
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Great Benefits</h3>
                <p className="text-sm text-muted-foreground">
                  Competitive salaries and comprehensive benefits packages
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 text-center">
              <CardContent className="p-6">
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Work-Life Balance</h3>
                <p className="text-sm text-muted-foreground">
                  Flexible work arrangements and supportive culture
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="text-center mt-16">
          <Card className="shadow-lg border-0 bg-primary/5">
            <CardContent className="pt-8 pb-8">
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Ready to Join a Great Company?
              </h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Create your profile, upload your resume, and start connecting with top companies across the Philippines.
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
                <Link to="/jobs">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="px-8 py-4 text-lg hover:bg-[#1c1c1c] hover:text-white transition-colors"
                  >
                    Browse Jobs
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default CompaniesPage

