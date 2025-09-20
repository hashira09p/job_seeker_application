import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Link } from 'react-router-dom'
import { Building2, Users, Briefcase, Target, Settings, Star, UserCheck, ArrowRight } from 'lucide-react'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Breadcrumb from '@/components/Breadcrumb'

function PesoPage() {
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
            Public Employment Service Office
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Your gateway to employment opportunities and career development services
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                PESO Objectives
              </CardTitle>
              <CardDescription>
                The core goals and mission of the Public Employment Service Office
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold text-foreground mb-3">General Objective</h4>
                <p className="text-muted-foreground">
                  Ensure the prompt, timely and efficient delivery of employment service and provision of information on the other DOLE programs.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-foreground mb-3">Specific Objectives</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span>Provide a venue where people could explore simultaneously various employment options and actually seek assistance they prefer.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span>Serve as referral and information center for the various services and programs of DOLE and other government agencies present in the area.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span>Provide clients with adequate information on employment and labor market situation in the area.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span>Network with other PESO's within the region on employment for job exchange purposes.</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                PESO Functions
              </CardTitle>
              <CardDescription>
                Key services and responsibilities of PESO offices
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-3 bg-primary/5 rounded-lg">
                  <h5 className="font-medium text-foreground mb-1">Employment Services</h5>
                  <p className="text-sm text-muted-foreground">
                    Encourage employers to submit job vacancies and provide employment services to job seekers for both local and overseas employment.
                  </p>
                </div>
                
                <div className="p-3 bg-primary/5 rounded-lg">
                  <h5 className="font-medium text-foreground mb-1">Testing & Evaluation</h5>
                  <p className="text-sm text-muted-foreground">
                    Develop and administer testing and evaluation instruments for effective job selection, training and counseling.
                  </p>
                </div>
                
                <div className="p-3 bg-primary/5 rounded-lg">
                  <h5 className="font-medium text-foreground mb-1">Entrepreneurship Support</h5>
                  <p className="text-sm text-muted-foreground">
                    Provide access to livelihood and self-employment programs offered by government and non-governmental organizations.
                  </p>
                </div>
                
                <div className="p-3 bg-primary/5 rounded-lg">
                  <h5 className="font-medium text-foreground mb-1">Training & Counseling</h5>
                  <p className="text-sm text-muted-foreground">
                    Undertake employability enhancement trainings and provide career guidance and counseling services.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-lg border-0 mb-16">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-primary" />
              Special Services
            </CardTitle>
            <CardDescription>
              Exclusive programs and services offered by PESO
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-foreground mb-2">Jobs Fairs</h4>
                <p className="text-sm text-muted-foreground">
                  Periodic events bringing together job seekers and employers for immediate matching.
                </p>
              </div>
              
              <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-foreground mb-2">Livelihood Bazaars</h4>
                <p className="text-sm text-muted-foreground">
                  Information on livelihood programs, particularly in rural areas.
                </p>
              </div>
              
              <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-foreground mb-2">SPESOS Program</h4>
                <p className="text-sm text-muted-foreground">
                  Special Program for Employment of Students and Out-of-School Youth.
                </p>
              </div>
              
              <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-foreground mb-2">Work Appreciation Program</h4>
                <p className="text-sm text-muted-foreground">
                  Develop work ethics by exposing youth to actual work situations.
                </p>
              </div>
              
              <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-foreground mb-2">WHIP Program</h4>
                <p className="text-sm text-muted-foreground">
                  Workers Hiring for Infrastructure Projects with local hiring requirements.
                </p>
              </div>
              
              <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-foreground mb-2">Special Assistance</h4>
                <p className="text-sm text-muted-foreground">
                  Programs for PWDs, displaced workers, and other special groups.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 mb-16">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              PESO Clients
            </CardTitle>
            <CardDescription>
              Who can benefit from PESO services
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Badge variant="secondary" className="text-sm px-3 py-1">Jobseekers</Badge>
              <Badge variant="secondary" className="text-sm px-3 py-1">Employers</Badge>
              <Badge variant="secondary" className="text-sm px-3 py-1">Students</Badge>
              <Badge variant="secondary" className="text-sm px-3 py-1">Out-of-School Youth</Badge>
              <Badge variant="secondary" className="text-sm px-3 py-1">Migratory Workers</Badge>
              <Badge variant="secondary" className="text-sm px-3 py-1">Planners</Badge>
              <Badge variant="secondary" className="text-sm px-3 py-1">Researchers</Badge>
              <Badge variant="secondary" className="text-sm px-3 py-1">LMI Users</Badge>
              <Badge variant="secondary" className="text-sm px-3 py-1">Persons with Disabilities</Badge>
              <Badge variant="secondary" className="text-sm px-3 py-1">Returning OFWs</Badge>
              <Badge variant="secondary" className="text-sm px-3 py-1">Displaced Workers</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 mb-16">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-primary" />
              How to Avail PESO Services
            </CardTitle>
            <CardDescription>
              Step-by-step guide to access PESO services
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 border rounded-lg">
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">For Jobseekers</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Register at the PhilJobNet web portal or report personally to the nearest PESO in your locality.
                </p>
                <Button 
                  variant="outline" 
                  className="w-full hover:bg-[#1c1c1c] hover:text-white transition-colors"
                >
                  Register Now
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
              
              <div className="text-center p-6 border rounded-lg">
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">For Employers</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Register at the PhilJobNet web portal or inform the nearest PESO of your vacancies for job matching.
                </p>
                <Button 
                  variant="outline" 
                  className="w-full hover:bg-[#1c1c1c] hover:text-white transition-colors"
                >
                  Post Jobs
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
              
              <div className="text-center p-6 border rounded-lg">
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">For Researchers</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Inquire personally and secure available materials at nearest PESO.
                </p>
                <Button 
                  variant="outline" 
                  className="w-full hover:bg-[#1c1c1c] hover:text-white transition-colors"
                >
                  Contact PESO
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
                Ready to Start Your Career Journey?
              </h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Connect with PESO today and discover the employment opportunities waiting for you. 
                Our dedicated team is here to help you succeed.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/">
                  <Button 
                    size="lg" 
                    className="px-8 py-4 text-lg hover:bg-[#1c1c1c] transition-colors"
                  >
                    Back to Home
                  </Button>
                </Link>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="px-8 py-4 text-lg hover:bg-[#1c1c1c] hover:text-white transition-colors"
                >
                  Find Nearest PESO
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default PesoPage

