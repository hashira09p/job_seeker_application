import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link } from 'react-router-dom'
import { Building2, Database, Target, Users, Globe, ArrowRight, ExternalLink } from 'lucide-react'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Breadcrumb from '@/components/Breadcrumb'

function AboutPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f9f9f9' }}>
      <Navigation />
      <Breadcrumb />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Database className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            About the PESO Employment Information System
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Understanding the enhanced employment facilitation system and the Bureau of Local Employment
          </p>
        </div>

        <div className="space-y-16">
          
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                National Skills Registration Program (NSRP)
              </CardTitle>
              <CardDescription>
                The foundation of our employment facilitation system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground leading-relaxed">
                The National Skills Registration Program (NSRP) is a Program initiated by the Department of Labor and Employment (DOLE) with the main objective of maintaining a continuing nationwide skills registry through its Skills Registry System (SRS) database. It is an employment facilitation machinery of DOLE which aims to cover all the cities/municipalities with operating Public Employment Service Offices (PESO's).
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="text-center p-4 bg-primary/5 rounded-lg">
                  <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Database className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">Skills Registry</h4>
                  <p className="text-sm text-muted-foreground">
                    Nationwide database of skills and qualifications
                  </p>
                </div>
                
                <div className="text-center p-4 bg-primary/5 rounded-lg">
                  <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">Employment Facilitation</h4>
                  <p className="text-sm text-muted-foreground">
                    Connecting jobseekers with opportunities
                  </p>
                </div>
                
                <div className="text-center p-4 bg-primary/5 rounded-lg">
                  <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">PESO Coverage</h4>
                  <p className="text-sm text-muted-foreground">
                    Operating across all cities and municipalities
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                PESO Employment Information System (PEIS)
              </CardTitle>
              <CardDescription>
                The enhanced version of the Skills Registry System
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground leading-relaxed">
                The PESO Employment Information System (PEIS) is the enhanced version of the Skills Registry System. It is a database of active manpower supply containing the profiles of all persons and employers registered under the NSRP. It shows information on the qualifications and skills of the applicants as well as the job vacancies posted by the employers. This registry is maintained and updated by all participating PESO's nationwide.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                <div className="p-6 border rounded-lg">
                  <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Job Seeker Profiles
                  </h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span>Personal information and contact details</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span>Educational background and qualifications</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span>Work experience and skills assessment</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span>Employment preferences and availability</span>
                    </li>
                  </ul>
                </div>
                
                <div className="p-6 border rounded-lg">
                  <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    Employer Information
                  </h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span>Company profiles and business details</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span>Job vacancy postings and requirements</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span>Hiring preferences and company culture</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span>Contact information for applications</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                Bureau of Local Employment (BLE)
              </CardTitle>
              <CardDescription>
                The bureau maintaining the PEIS Web Portal and promoting local employment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div>
                <h4 className="font-semibold text-foreground mb-3">Mission</h4>
                <p className="text-muted-foreground leading-relaxed">
                  To promote full employment by facilitating access of Filipino jobseekers to local employment opportunities through policy researches, standards setting, strategy development, labor market analysis and provision of technical assistance to regional implementers in support of employment service operations.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-foreground mb-3">Vision</h4>
                <p className="text-muted-foreground leading-relaxed">
                  To become the center of employment service in Asia.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-foreground mb-4">Key Functions</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center mb-3">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <h5 className="font-medium text-foreground mb-2">Employment Facilitation</h5>
                    <p className="text-sm text-muted-foreground">
                      Facilitates local employment through PESO's and online platforms like PhilJobNet
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center mb-3">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <h5 className="font-medium text-foreground mb-2">Service Commitment</h5>
                    <p className="text-sm text-muted-foreground">
                      Commits to provide fast and effective employment service to jobseekers and clients
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center mb-3">
                      <Database className="h-5 w-5 text-primary" />
                    </div>
                    <h5 className="font-medium text-foreground mb-2">Information Provision</h5>
                    <p className="text-sm text-muted-foreground">
                      Informs policy-makers with accurate, timely, and reliable labor market information
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-primary/5 p-6 rounded-lg">
                <h4 className="font-semibold text-foreground mb-3">Learn More</h4>
                <p className="text-muted-foreground mb-4">
                  To learn more about the Bureau of Local Employment and its services, visit the BLE official website.
                </p>
                <Button 
                  variant="outline" 
                  className="hover:bg-[#1c1c1c] hover:text-white transition-colors"
                >
                  Visit BLE Website
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                System Benefits
              </CardTitle>
              <CardDescription>
                How the PEIS benefits jobseekers, employers, and the economy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center p-4">
                  <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">For Jobseekers</h4>
                  <p className="text-sm text-muted-foreground">
                    Easy access to job opportunities and career development resources
                  </p>
                </div>
                
                <div className="text-center p-4">
                  <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">For Employers</h4>
                  <p className="text-sm text-muted-foreground">
                    Access to qualified candidates and streamlined hiring processes
                  </p>
                </div>
                
                <div className="text-center p-4">
                  <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Database className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">For Government</h4>
                  <p className="text-sm text-muted-foreground">
                    Data-driven policy making and employment program development
                  </p>
                </div>
                
                <div className="text-center p-4">
                  <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Globe className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">For Economy</h4>
                  <p className="text-sm text-muted-foreground">
                    Improved labor market efficiency and reduced unemployment
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <Card className="shadow-lg border-0 bg-primary/5">
              <CardContent className="pt-8 pb-8">
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  Ready to Explore Employment Opportunities?
                </h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Discover how the PESO Employment Information System can help you find your next career opportunity or connect with qualified candidates.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/peso">
                    <Button 
                      size="lg" 
                      className="px-8 py-4 text-lg hover:bg-[#1c1c1c] transition-colors"
                    >
                      Learn About PESO
                      <ArrowRight className="h-4 w-4 ml-2" />
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
      </div>

      <Footer />
    </div>
  )
}

export default AboutPage

