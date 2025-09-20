import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Link } from 'react-router-dom'
import { Calendar, MapPin, Users, ArrowRight } from 'lucide-react'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Breadcrumb from '@/components/Breadcrumb'

function JobFairsPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f9f9f9' }}>
      <Navigation />
      <Breadcrumb />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Calendar className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Schedule of Job Fairs
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover upcoming job fairs across the Philippines and connect with top employers
          </p>
        </div>

        <div className="space-y-16">
          
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Regional Job Fair Schedules
              </CardTitle>
              <CardDescription>
                Job fairs organized by region across the Philippines
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer hover:bg-[#1c1c1c] hover:text-white group">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold group-hover:text-white">Region 1</h4>
                    <Badge variant="secondary" className="group-hover:bg-white group-hover:text-[#1c1c1c]">
                      Ilocos Region
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground group-hover:text-gray-300">
                    Job fairs in Ilocos Norte, Ilocos Sur, La Union, and Pangasinan
                  </p>
                  <div className="mt-3 flex items-center text-xs text-muted-foreground group-hover:text-gray-400">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>Monthly schedules available</span>
                  </div>
                </div>

                <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer hover:bg-[#1c1c1c] hover:text-white group">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold group-hover:text-white">Region 2</h4>
                    <Badge variant="secondary" className="group-hover:bg-white group-hover:text-[#1c1c1c]">
                      Cagayan Valley
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground group-hover:text-gray-300">
                    Job fairs in Batanes, Cagayan, Isabela, Nueva Vizcaya, and Quirino
                  </p>
                  <div className="mt-3 flex items-center text-xs text-muted-foreground group-hover:text-gray-400">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>Monthly schedules available</span>
                  </div>
                </div>

                <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer hover:bg-[#1c1c1c] hover:text-white group">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold group-hover:text-white">Region 3</h4>
                    <Badge variant="secondary" className="group-hover:bg-white group-hover:text-[#1c1c1c]">
                      Central Luzon
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground group-hover:text-gray-300">
                    Job fairs in Aurora, Bataan, Bulacan, Nueva Ecija, Pampanga, Tarlac, and Zambales
                  </p>
                  <div className="mt-3 flex items-center text-xs text-muted-foreground group-hover:text-gray-400">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>Monthly schedules available</span>
                  </div>
                </div>

                <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer hover:bg-[#1c1c1c] hover:text-white group">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold group-hover:text-white">Region 4-A</h4>
                    <Badge variant="secondary" className="group-hover:bg-white group-hover:text-[#1c1c1c]">
                      CALABARZON
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground group-hover:text-gray-300">
                    Job fairs in Cavite, Laguna, Batangas, Rizal, and Quezon
                  </p>
                  <div className="mt-3 flex items-center text-xs text-muted-foreground group-hover:text-gray-400">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>Monthly schedules available</span>
                  </div>
                </div>

                <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer hover:bg-[#1c1c1c] hover:text-white group">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold group-hover:text-white">Region 7</h4>
                    <Badge variant="secondary" className="group-hover:bg-white group-hover:text-[#1c1c1c]">
                      Central Visayas
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground group-hover:text-gray-300">
                    Job fairs in Bohol, Cebu, Negros Oriental, and Siquijor
                  </p>
                  <div className="mt-3 flex items-center text-xs text-muted-foreground group-hover:text-gray-400">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>Monthly schedules available</span>
                  </div>
                </div>

                <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer hover:bg-[#1c1c1c] hover:text-white group">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold group-hover:text-white">Region 9</h4>
                    <Badge variant="secondary" className="group-hover:bg-white group-hover:text-[#1c1c1c]">
                      Zamboanga Peninsula
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground group-hover:text-gray-300">
                    Job fairs in Zamboanga del Norte, Zamboanga del Sur, and Zamboanga Sibugay
                  </p>
                  <div className="mt-3 flex items-center text-xs text-muted-foreground group-hover:text-gray-400">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>Monthly schedules available</span>
                  </div>
                </div>

                <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer hover:bg-[#1c1c1c] hover:text-white group">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold group-hover:text-white">Region 10</h4>
                    <Badge variant="secondary" className="group-hover:bg-white group-hover:text-[#1c1c1c]">
                      Northern Mindanao
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground group-hover:text-gray-300">
                    Job fairs in Bukidnon, Camiguin, Lanao del Norte, Misamis Occidental, and Misamis Oriental
                  </p>
                  <div className="mt-3 flex items-center text-xs text-muted-foreground group-hover:text-gray-400">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>Monthly schedules available</span>
                  </div>
                </div>

                <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer hover:bg-[#1c1c1c] hover:text-white group">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold group-hover:text-white">Region 11</h4>
                    <Badge variant="secondary" className="group-hover:bg-white group-hover:text-[#1c1c1c]">
                      Davao Region
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground group-hover:text-gray-300">
                    Job fairs in Davao del Norte, Davao del Sur, Davao Occidental, and Davao Oriental
                  </p>
                  <div className="mt-3 flex items-center text-xs text-muted-foreground group-hover:text-gray-400">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>Monthly schedules available</span>
                  </div>
                </div>

                <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer hover:bg-[#1c1c1c] hover:text-white group">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold group-hover:text-white">Region 12</h4>
                    <Badge variant="secondary" className="group-hover:bg-white group-hover:text-[#1c1c1c]">
                      SOCCSKSARGEN
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground group-hover:text-gray-300">
                    Job fairs in Cotabato, Sarangani, South Cotabato, and Sultan Kudarat
                  </p>
                  <div className="mt-3 flex items-center text-xs text-muted-foreground group-hover:text-gray-400">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>Monthly schedules available</span>
                  </div>
                </div>

                <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer hover:bg-[#1c1c1c] hover:text-white group">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold group-hover:text-white">Region 13</h4>
                    <Badge variant="secondary" className="group-hover:bg-white group-hover:text-[#1c1c1c]">
                      Caraga
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground group-hover:text-gray-300">
                    Job fairs in Agusan del Norte, Agusan del Sur, Dinagat Islands, and Surigao del Norte
                  </p>
                  <div className="mt-3 flex items-center text-xs text-muted-foreground group-hover:text-gray-400">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>Monthly schedules available</span>
                  </div>
                </div>

                <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer hover:bg-[#1c1c1c] hover:text-white group">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold group-hover:text-white">NCR</h4>
                    <Badge variant="secondary" className="group-hover:bg-white group-hover:text-[#1c1c1c]">
                      National Capital Region
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground group-hover:text-gray-300">
                    Job fairs across Metro Manila and surrounding areas
                  </p>
                  <div className="mt-3 flex items-center text-xs text-muted-foreground group-hover:text-gray-400">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>Weekly schedules available</span>
                  </div>
                </div>

                <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer hover:bg-[#1c1c1c] hover:text-white group">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold group-hover:text-white">CAR</h4>
                    <Badge variant="secondary" className="group-hover:bg-white group-hover:text-[#1c1c1c]">
                      Cordillera Administrative Region
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground group-hover:text-gray-300">
                    Job fairs in Abra, Apayao, Benguet, Ifugao, Kalinga, and Mountain Province
                  </p>
                  <div className="mt-3 flex items-center text-xs text-muted-foreground group-hover:text-gray-400">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>Monthly schedules available</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Regional Job Fair Schedules (By Month)
              </CardTitle>
              <CardDescription>
                Browse job fairs organized by month for better planning
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer hover:bg-[#1c1c1c] hover:text-white group">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold group-hover:text-white">March 2025</h4>
                    <Badge variant="secondary" className="group-hover:bg-white group-hover:text-[#1c1c1c]">
                      15 Events
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground group-hover:text-gray-300 mb-3">
                    Spring job fairs across all regions
                  </p>
                  <div className="flex items-center text-xs text-muted-foreground group-hover:text-gray-400">
                    <Users className="h-3 w-3 mr-1" />
                    <span>Expected: 5,000+ attendees</span>
                  </div>
                </div>

                <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer hover:bg-[#1c1c1c] hover:text-white group">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold group-hover:text-white">April 2025</h4>
                    <Badge variant="secondary" className="group-hover:bg-white group-hover:text-[#1c1c1c]">
                      18 Events
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground group-hover:text-gray-300 mb-3">
                    Pre-graduation job fairs and career expos
                  </p>
                  <div className="flex items-center text-xs text-muted-foreground group-hover:text-gray-400">
                    <Users className="h-3 w-3 mr-1" />
                    <span>Expected: 8,000+ attendees</span>
                  </div>
                </div>

                <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer hover:bg-[#1c1c1c] hover:text-white group">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold group-hover:text-white">May 2025</h4>
                    <Badge variant="secondary" className="group-hover:bg-white group-hover:text-[#1c1c1c]">
                      22 Events
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground group-hover:text-gray-300 mb-3">
                    Graduation season job fairs and recruitment drives
                  </p>
                  <div className="flex items-center text-xs text-muted-foreground group-hover:text-gray-400">
                    <Users className="h-3 w-3 mr-1" />
                    <span>Expected: 12,000+ attendees</span>
                  </div>
                </div>

                <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer hover:bg-[#1c1c1c] hover:text-white group">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold group-hover:text-white">June 2025</h4>
                    <Badge variant="secondary" className="group-hover:bg-white group-hover:text-[#1c1c1c]">
                      20 Events
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground group-hover:text-gray-300 mb-3">
                    Mid-year career fairs and industry-specific events
                  </p>
                  <div className="flex items-center text-xs text-muted-foreground group-hover:text-gray-400">
                    <Users className="h-3 w-3 mr-1" />
                    <span>Expected: 10,000+ attendees</span>
                  </div>
                </div>

                <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer hover:bg-[#1c1c1c] hover:text-white group">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold group-hover:text-white">July 2025</h4>
                    <Badge variant="secondary" className="group-hover:bg-white group-hover:text-[#1c1c1c]">
                      16 Events
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground group-hover:text-gray-300 mb-3">
                    Summer job fairs and internship opportunities
                  </p>
                  <div className="flex items-center text-xs text-muted-foreground group-hover:text-gray-400">
                    <Users className="h-3 w-3 mr-1" />
                    <span>Expected: 6,000+ attendees</span>
                  </div>
                </div>

                <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer hover:bg-[#1c1c1c] hover:text-white group">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold group-hover:text-white">August 2025</h4>
                    <Badge variant="secondary" className="group-hover:bg-white group-hover:text-[#1c1c1c]">
                      19 Events
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground group-hover:text-gray-300 mb-3">
                    Back-to-school job fairs and part-time opportunities
                  </p>
                  <div className="flex items-center text-xs text-muted-foreground group-hover:text-gray-400">
                    <Users className="h-3 w-3 mr-1" />
                    <span>Expected: 7,000+ attendees</span>
                  </div>
                </div>

                <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer hover:bg-[#1c1c1c] hover:text-white group">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold group-hover:text-white">September 2025</h4>
                    <Badge variant="secondary" className="group-hover:bg-white group-hover:text-[#1c1c1c]">
                      17 Events
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground group-hover:text-gray-300 mb-3">
                    Fall recruitment season and industry expos
                  </p>
                  <div className="flex items-center text-xs text-muted-foreground group-hover:text-gray-400">
                    <Users className="h-3 w-3 mr-1" />
                    <span>Expected: 9,000+ attendees</span>
                  </div>
                </div>

                <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer hover:bg-[#1c1c1c] hover:text-white group">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold group-hover:text-white">October 2025</h4>
                    <Badge variant="secondary" className="group-hover:bg-white group-hover:text-[#1c1c1c]">
                      21 Events
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground group-hover:text-gray-300 mb-3">
                    Career development fairs and professional networking
                  </p>
                  <div className="flex items-center text-xs text-muted-foreground group-hover:text-gray-400">
                    <Users className="h-3 w-3 mr-1" />
                    <span>Expected: 11,000+ attendees</span>
                  </div>
                </div>

                <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer hover:bg-[#1c1c1c] hover:text-white group">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold group-hover:text-white">November 2025</h4>
                    <Badge variant="secondary" className="group-hover:bg-white group-hover:text-[#1c1c1c]">
                      14 Events
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground group-hover:text-gray-300 mb-3">
                    Year-end job fairs and holiday season opportunities
                  </p>
                  <div className="flex items-center text-xs text-muted-foreground group-hover:text-gray-400">
                    <Users className="h-3 w-3 mr-1" />
                    <span>Expected: 5,500+ attendees</span>
                  </div>
                </div>

                <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer hover:bg-[#1c1c1c] hover:text-white group">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold group-hover:text-white">December 2025</h4>
                    <Badge variant="secondary" className="group-hover:bg-white group-hover:text-[#1c1c1c]">
                      12 Events
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground group-hover:text-gray-300 mb-3">
                    Holiday job fairs and year-end recruitment
                  </p>
                  <div className="flex items-center text-xs text-muted-foreground group-hover:text-gray-400">
                    <Users className="h-3 w-3 mr-1" />
                    <span>Expected: 4,000+ attendees</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Quick Actions
              </CardTitle>
              <CardDescription>
                Get started with job fair participation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">Register for Job Fairs</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Sign up to attend upcoming job fairs in your area
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full hover:bg-[#1c1c1c] hover:text-white transition-colors"
                  >
                    Register Now
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
                
                <div className="text-center p-6 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">Find Nearest Location</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Discover job fairs happening near your location
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full hover:bg-[#1c1c1c] hover:text-white transition-colors"
                  >
                    Search Location
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
                
                <div className="text-center p-6 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">Employer Registration</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Register your company to participate in job fairs
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full hover:bg-[#1c1c1c] hover:text-white transition-colors"
                  >
                    Register Company
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <Card className="shadow-lg border-0 bg-primary/5">
              <CardContent className="pt-8 pb-8">
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  Ready to Attend a Job Fair?
                </h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Connect with top employers, discover new opportunities, and advance your career at our upcoming job fairs across the Philippines.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg" 
                    className="px-8 py-4 text-lg hover:bg-[#1c1c1c] transition-colors"
                  >
                    View All Schedules
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
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
      </div>

      <Footer />
    </div>
  )
}

export default JobFairsPage

