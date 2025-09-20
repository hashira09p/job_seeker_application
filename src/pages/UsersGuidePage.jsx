import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Link } from 'react-router-dom'
import { BookOpen, LogIn, UserPlus, ArrowRight, CheckCircle, Info, Search, Filter, Building2, Briefcase, MapPin, DollarSign, Users, Star, Upload, FileText, Sparkles, Target, TrendingUp, Award, Calendar, Phone, Mail, Eye, Trash2, Download } from 'lucide-react'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Breadcrumb from '@/components/Breadcrumb'

function UsersGuidePage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f9f9f9' }}>
      <Navigation />
      <Breadcrumb />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Users Guide
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Complete step-by-step guide to navigate and use all features of the Una sa Trabaho platform effectively
          </p>
        </div>

        <div className="space-y-16">
          
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" />
                Quick Navigation
              </CardTitle>
              <CardDescription>
                Jump to the guide you need
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <a href="#login-guide" className="inline-block">
                  <Badge variant="secondary" className="text-sm px-4 py-2 hover:bg-[#1c1c1c] hover:text-white transition-colors cursor-pointer">
                    Login Guide
                  </Badge>
                </a>
                <a href="#signup-guide" className="inline-block">
                  <Badge variant="secondary" className="text-sm px-4 py-2 hover:bg-[#1c1c1c] hover:text-white transition-colors cursor-pointer">
                    Signup Guide
                  </Badge>
                </a>
                <a href="#resume-upload-guide" className="inline-block">
                  <Badge variant="secondary" className="text-sm px-4 py-2 hover:bg-[#1c1c1c] hover:text-white transition-colors cursor-pointer">
                    Resume Upload
                  </Badge>
                </a>
                <a href="#jobs-guide" className="inline-block">
                  <Badge variant="secondary" className="text-sm px-4 py-2 hover:bg-[#1c1c1c] hover:text-white transition-colors cursor-pointer">
                    Jobs Guide
                  </Badge>
                </a>
                <a href="#companies-guide" className="inline-block">
                  <Badge variant="secondary" className="text-sm px-4 py-2 hover:bg-[#1c1c1c] hover:text-white transition-colors cursor-pointer">
                    Companies Guide
                  </Badge>
                </a>
                <a href="#job-fairs-guide" className="inline-block">
                  <Badge variant="secondary" className="text-sm px-4 py-2 hover:bg-[#1c1c1c] hover:text-white transition-colors cursor-pointer">
                    Job Fairs
                  </Badge>
                </a>
                <a href="#peso-services-guide" className="inline-block">
                  <Badge variant="secondary" className="text-sm px-4 py-2 hover:bg-[#1c1c1c] hover:text-white transition-colors cursor-pointer">
                    PESO Services
                  </Badge>
                </a>
              </div>
            </CardContent>
          </Card>

          <Card id="login-guide" className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LogIn className="h-5 w-5 text-primary" />
                Login Guide
              </CardTitle>
              <CardDescription>
                Step-by-step instructions for logging into your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-foreground mb-4">Prerequisites</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">You must have an existing account</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Remember your email and password</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Ensure you have internet connection</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-foreground mb-4">What You'll Need</h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-primary/5 rounded-lg">
                      <p className="text-sm font-medium text-foreground">Email Address</p>
                      <p className="text-xs text-muted-foreground">The email you used during registration</p>
                    </div>
                    <div className="p-3 bg-primary/5 rounded-lg">
                      <p className="text-sm font-medium text-foreground">Password</p>
                      <p className="text-xs text-muted-foreground">Your secure account password</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-4">Step-by-Step Instructions</h4>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">
                      1
                    </div>
                    <div>
                      <h5 className="font-medium text-foreground mb-1">Navigate to Login Page</h5>
                      <p className="text-muted-foreground text-sm">
                        Click on the "Login" button in the top-right corner of the navigation bar, or visit the login page directly.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">
                      2
                    </div>
                    <div>
                      <h5 className="font-medium text-foreground mb-1">Enter Your Credentials</h5>
                      <p className="text-muted-foreground text-sm">
                        In the login form, enter your registered email address and password in the respective fields.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">
                      3
                    </div>
                    <div>
                      <h5 className="font-medium text-foreground mb-1">Submit and Verify</h5>
                      <p className="text-muted-foreground text-sm">
                        Click the "Login" button to submit your credentials. The system will verify your information and log you in.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">
                      4
                    </div>
                    <div>
                      <h5 className="font-medium text-foreground mb-1">Access Your Dashboard</h5>
                      <p className="text-muted-foreground text-sm">
                        Upon successful login, you'll be redirected to your personalized dashboard where you can manage your profile and job applications.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h5 className="font-medium text-blue-900 mb-2">💡 Pro Tips</h5>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Use the "Remember Me" option for faster login on trusted devices</li>
                  <li>• Keep your password secure and don't share it with others</li>
                  <li>• If you forget your password, use the "Forgot Password" link</li>
                </ul>
              </div>

              <div className="text-center">
                <Link to="/login">
                  <Button 
                    className="px-8 py-3 hover:bg-[#1c1c1c] transition-colors"
                  >
                    Go to Login Page
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card id="signup-guide" className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-primary" />
                Signup Guide
              </CardTitle>
              <CardDescription>
                Complete guide for creating a new account on Una sa Trabaho
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-foreground mb-4">Before You Start</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Ensure you have a valid email address</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Prepare a strong password</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Have your personal information ready</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-foreground mb-4">Required Information</h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-primary/5 rounded-lg">
                      <p className="text-sm font-medium text-foreground">Personal Details</p>
                      <p className="text-xs text-muted-foreground">Full name, contact information</p>
                    </div>
                    <div className="p-3 bg-primary/5 rounded-lg">
                      <p className="text-sm font-medium text-foreground">Account Credentials</p>
                      <p className="text-xs text-muted-foreground">Email, password, security questions</p>
                    </div>
                    <div className="p-3 bg-primary/5 rounded-lg">
                      <p className="text-sm font-medium text-foreground">Profile Information</p>
                      <p className="text-xs text-muted-foreground">Skills, experience, preferences</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-4">Registration Process</h4>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">
                      1
                    </div>
                    <div>
                      <h5 className="font-medium text-foreground mb-1">Access Signup Page</h5>
                      <p className="text-muted-foreground text-sm">
                        Click the "Sign Up" button in the navigation bar or visit the registration page directly.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">
                      2
                    </div>
                    <div>
                      <h5 className="font-medium text-foreground mb-1">Fill Personal Information</h5>
                      <p className="text-muted-foreground text-sm">
                        Enter your full name, email address, phone number, and other required personal details in the registration form.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">
                      3
                    </div>
                    <div>
                      <h5 className="font-medium text-foreground mb-1">Create Account Credentials</h5>
                      <p className="text-muted-foreground text-sm">
                        Choose a strong password and confirm it. Ensure your password meets the security requirements.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">
                      4
                    </div>
                    <div>
                      <h5 className="font-medium text-foreground mb-1">Complete Profile Setup</h5>
                      <p className="text-muted-foreground text-sm">
                        Add your skills, work experience, education, and job preferences to complete your profile.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">
                      5
                    </div>
                    <div>
                      <h5 className="font-medium text-foreground mb-1">Verify Email</h5>
                      <p className="text-muted-foreground text-sm">
                        Check your email for a verification link and click it to activate your account.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">
                      6
                    </div>
                    <div>
                      <h5 className="font-medium text-foreground mb-1">Start Using the Platform</h5>
                      <p className="text-muted-foreground text-sm">
                        Once verified, you can log in and start browsing jobs, applying for positions, and managing your applications.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h5 className="font-medium text-green-900 mb-2">✅ Best Practices</h5>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• Use a strong, unique password with letters, numbers, and symbols</li>
                  <li>• Provide accurate and up-to-date information</li>
                  <li>• Upload a professional profile picture</li>
                  <li>• Complete all profile sections for better job matching</li>
                </ul>
              </div>

              <div className="text-center">
                <Link to="/signup">
                  <Button 
                    className="px-8 py-3 hover:bg-[#1c1c1c] transition-colors"
                  >
                    Create Account
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card id="resume-upload-guide" className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-primary" />
                Resume Upload Guide
              </CardTitle>
              <CardDescription>
                Get personalized job recommendations by uploading your resume and letting our AI analyze your skills
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-foreground mb-4">What This Feature Does</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Analyzes your resume using AI technology</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Extracts your skills and experience automatically</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Provides personalized job recommendations</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Shows match scores for each job suggestion</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-foreground mb-4">Supported File Formats</h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-primary/5 rounded-lg">
                      <p className="text-sm font-medium text-foreground">PDF Documents</p>
                      <p className="text-xs text-muted-foreground">Most common format, best compatibility</p>
                    </div>
                    <div className="p-3 bg-primary/5 rounded-lg">
                      <p className="text-sm font-medium text-foreground">Microsoft Word</p>
                      <p className="text-xs text-muted-foreground">DOC and DOCX files supported</p>
                    </div>
                    <div className="p-3 bg-primary/5 rounded-lg">
                      <p className="text-sm font-medium text-foreground">File Size Limit</p>
                      <p className="text-xs text-muted-foreground">Maximum 10MB file size</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-4">Step-by-Step Resume Upload Process</h4>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">
                      1
                    </div>
                    <div>
                      <h5 className="font-medium text-foreground mb-1">Navigate to Resume Upload</h5>
                      <p className="text-muted-foreground text-sm">
                        Click on "Upload Resume" in the navigation menu, or use the "Upload Resume for Job Matches" button on the homepage or jobs page.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">
                      2
                    </div>
                    <div>
                      <h5 className="font-medium text-foreground mb-1">Prepare Your Resume</h5>
                      <p className="text-muted-foreground text-sm">
                        Ensure your resume is in PDF, DOC, or DOCX format and is under 10MB. Make sure it contains your skills, experience, and education clearly.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">
                      3
                    </div>
                    <div>
                      <h5 className="font-medium text-foreground mb-1">Upload Your File</h5>
                      <p className="text-muted-foreground text-sm">
                        Click "Choose File" or drag and drop your resume into the upload area. You'll see a progress bar as the file uploads.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">
                      4
                    </div>
                    <div>
                      <h5 className="font-medium text-foreground mb-1">AI Analysis Process</h5>
                      <p className="text-muted-foreground text-sm">
                        Our AI will analyze your resume, extracting skills, experience, and qualifications. This process takes a few moments and you'll see a progress indicator.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">
                      5
                    </div>
                    <div>
                      <h5 className="font-medium text-foreground mb-1">Review Extracted Skills</h5>
                      <p className="text-muted-foreground text-sm">
                        Once analysis is complete, you'll see a list of skills and technologies that were detected from your resume. Review these for accuracy.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">
                      6
                    </div>
                    <div>
                      <h5 className="font-medium text-foreground mb-1">Browse Job Recommendations</h5>
                      <p className="text-muted-foreground text-sm">
                        View your personalized job suggestions with match scores. Each job shows how well it matches your profile, along with detailed information.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">
                      7
                    </div>
                    <div>
                      <h5 className="font-medium text-foreground mb-1">Apply to Jobs</h5>
                      <p className="text-muted-foreground text-sm">
                        Click "Apply Now" on jobs that interest you, or "View Details" to learn more about the position and company before applying.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h5 className="font-medium text-blue-900 mb-2">💡 Resume Upload Tips</h5>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Use clear, readable fonts in your resume</li>
                    <li>• Include specific skills and technologies</li>
                    <li>• List your work experience with job titles</li>
                    <li>• Mention your education and certifications</li>
                    <li>• Keep your resume updated and current</li>
                  </ul>
                </div>

                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h5 className="font-medium text-green-900 mb-2">✅ Understanding Match Scores</h5>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• 90-100%: Excellent Match (Perfect fit)</li>
                    <li>• 80-89%: Great Match (Very good fit)</li>
                    <li>• 70-79%: Good Match (Decent fit)</li>
                    <li>• 60-69%: Fair Match (Some overlap)</li>
                  </ul>
                </div>
              </div>

              <div className="text-center">
                <Link to="/upload-resume">
                  <Button 
                    className="px-8 py-3 hover:bg-[#1c1c1c] transition-colors"
                  >
                    Upload Your Resume
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card id="jobs-guide" className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" />
                Jobs Guide
              </CardTitle>
              <CardDescription>
                Learn how to search, filter, and apply for jobs effectively on Una sa Trabaho
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-foreground mb-4">What You Can Do</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Search jobs by title, keywords, or company</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Filter by location, job type, and salary</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Apply to multiple positions easily</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Save favorite jobs for later</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-foreground mb-4">Search Features</h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-primary/5 rounded-lg">
                      <p className="text-sm font-medium text-foreground">Smart Search</p>
                      <p className="text-xs text-muted-foreground">Search by job title, skills, or company name</p>
                    </div>
                    <div className="p-3 bg-primary/5 rounded-lg">
                      <p className="text-sm font-medium text-foreground">Location Filter</p>
                      <p className="text-xs text-muted-foreground">Find jobs in your preferred area</p>
                    </div>
                    <div className="p-3 bg-primary/5 rounded-lg">
                      <p className="text-sm font-medium text-foreground">Advanced Filters</p>
                      <p className="text-xs text-muted-foreground">Filter by job type, experience, salary</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-4">How to Search and Filter Jobs</h4>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">
                      1
                    </div>
                    <div>
                      <h5 className="font-medium text-foreground mb-1">Access the Jobs Page</h5>
                      <p className="text-muted-foreground text-sm">
                        Click on "Jobs" in the navigation menu or use the search bar on the homepage to access the jobs page.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">
                      2
                    </div>
                    <div>
                      <h5 className="font-medium text-foreground mb-1">Use the Main Search Bar</h5>
                      <p className="text-muted-foreground text-sm">
                        Enter job titles, keywords, or company names in the main search field. You can also specify your preferred location.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">
                      3
                    </div>
                    <div>
                      <h5 className="font-medium text-foreground mb-1">Apply Advanced Filters</h5>
                      <p className="text-muted-foreground text-sm">
                        Use the dropdown filters to narrow results by job type (Full-time, Part-time, Contract), experience level, salary range, and industry.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">
                      4
                    </div>
                    <div>
                      <h5 className="font-medium text-foreground mb-1">Review and Sort Results</h5>
                      <p className="text-muted-foreground text-sm">
                        Browse through the job listings and use the sort options to organize results by date, salary, or relevance.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">
                      5
                    </div>
                    <div>
                      <h5 className="font-medium text-foreground mb-1">Apply to Jobs</h5>
                      <p className="text-muted-foreground text-sm">
                        Click on job listings to view details, then use the "Apply Now" button to submit your application with your profile.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h5 className="font-medium text-blue-900 mb-2">💡 Pro Tips for Job Search</h5>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Use specific keywords related to your skills and experience</li>
                  <li>• Set up job alerts to get notified of new opportunities</li>
                  <li>• Keep your profile updated to increase application success</li>
                  <li>• Research companies before applying to understand their culture</li>
                  <li>• Use the quick filter tags for popular job categories</li>
                </ul>
              </div>

              <div className="text-center">
                <Link to="/jobs">
                  <Button 
                    className="px-8 py-3 hover:bg-[#1c1c1c] transition-colors"
                  >
                    Browse Jobs
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card id="companies-guide" className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                Companies Guide
              </CardTitle>
              <CardDescription>
                Discover and explore companies to find your ideal workplace
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-foreground mb-4">What You Can Discover</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Browse company profiles and information</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">View current job openings by company</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Filter companies by industry and size</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Read company reviews and ratings</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-foreground mb-4">Company Information</h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-primary/5 rounded-lg">
                      <p className="text-sm font-medium text-foreground">Company Details</p>
                      <p className="text-xs text-muted-foreground">Size, industry, location, and type</p>
                    </div>
                    <div className="p-3 bg-primary/5 rounded-lg">
                      <p className="text-sm font-medium text-foreground">Job Openings</p>
                      <p className="text-xs text-muted-foreground">Current available positions</p>
                    </div>
                    <div className="p-3 bg-primary/5 rounded-lg">
                      <p className="text-sm font-medium text-foreground">Work Culture</p>
                      <p className="text-xs text-muted-foreground">Remote options, benefits, environment</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-4">How to Explore Companies</h4>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">
                      1
                    </div>
                    <div>
                      <h5 className="font-medium text-foreground mb-1">Navigate to Companies Page</h5>
                      <p className="text-muted-foreground text-sm">
                        Click on "Companies" in the navigation menu to access the companies directory.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">
                      2
                    </div>
                    <div>
                      <h5 className="font-medium text-foreground mb-1">Search for Companies</h5>
                      <p className="text-muted-foreground text-sm">
                        Use the search bar to find companies by name, industry, or keywords. You can also search by location.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">
                      3
                    </div>
                    <div>
                      <h5 className="font-medium text-foreground mb-1">Apply Company Filters</h5>
                      <p className="text-muted-foreground text-sm">
                        Filter companies by industry, company size, company type, and work arrangement (onsite, hybrid, remote).
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">
                      4
                    </div>
                    <div>
                      <h5 className="font-medium text-foreground mb-1">Browse Company Profiles</h5>
                      <p className="text-muted-foreground text-sm">
                        Click on company names to view detailed profiles, including their job openings, company information, and ratings.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">
                      5
                    </div>
                    <div>
                      <h5 className="font-medium text-foreground mb-1">Apply to Company Jobs</h5>
                      <p className="text-muted-foreground text-sm">
                        From the company profile, you can view all their job openings and apply directly to positions that interest you.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h5 className="font-medium text-green-900 mb-2">✅ Company Research Tips</h5>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• Research company culture and values before applying</li>
                  <li>• Check company size and growth potential</li>
                  <li>• Look at employee reviews and ratings</li>
                  <li>• Consider work arrangement preferences (remote, hybrid, onsite)</li>
                  <li>• Use quick filter tags for popular company types</li>
                </ul>
              </div>

              <div className="text-center">
                <Link to="/companies">
                  <Button 
                    className="px-8 py-3 hover:bg-[#1c1c1c] transition-colors"
                  >
                    Explore Companies
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card id="job-fairs-guide" className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Job Fairs Guide
              </CardTitle>
              <CardDescription>
                Discover and participate in job fairs to connect with employers and explore opportunities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-foreground mb-4">What You Can Do</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Browse upcoming job fairs and events</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Register for job fairs online</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">View participating companies</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Get event details and location information</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-foreground mb-4">Job Fair Information</h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-primary/5 rounded-lg">
                      <p className="text-sm font-medium text-foreground">Event Details</p>
                      <p className="text-xs text-muted-foreground">Date, time, location, and venue information</p>
                    </div>
                    <div className="p-3 bg-primary/5 rounded-lg">
                      <p className="text-sm font-medium text-foreground">Participating Companies</p>
                      <p className="text-xs text-muted-foreground">List of employers attending the fair</p>
                    </div>
                    <div className="p-3 bg-primary/5 rounded-lg">
                      <p className="text-sm font-medium text-foreground">Registration</p>
                      <p className="text-xs text-muted-foreground">Online registration and requirements</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-4">How to Participate in Job Fairs</h4>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">
                      1
                    </div>
                    <div>
                      <h5 className="font-medium text-foreground mb-1">Browse Job Fairs</h5>
                      <p className="text-muted-foreground text-sm">
                        Click on "Job Fairs" in the navigation menu to view all upcoming job fairs and career events.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">
                      2
                    </div>
                    <div>
                      <h5 className="font-medium text-foreground mb-1">Filter and Search Events</h5>
                      <p className="text-muted-foreground text-sm">
                        Use filters to find job fairs by date, location, industry, or company type. Search for specific events or companies.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">
                      3
                    </div>
                    <div>
                      <h5 className="font-medium text-foreground mb-1">View Event Details</h5>
                      <p className="text-muted-foreground text-sm">
                        Click on job fair listings to see detailed information including date, time, location, participating companies, and registration requirements.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">
                      4
                    </div>
                    <div>
                      <h5 className="font-medium text-foreground mb-1">Register for Events</h5>
                      <p className="text-muted-foreground text-sm">
                        Complete the online registration form for job fairs you want to attend. Some events may require pre-registration.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">
                      5
                    </div>
                    <div>
                      <h5 className="font-medium text-foreground mb-1">Prepare for the Event</h5>
                      <p className="text-muted-foreground text-sm">
                        Research participating companies, prepare your resume, and plan your questions. Bring multiple copies of your resume and dress professionally.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">
                      6
                    </div>
                    <div>
                      <h5 className="font-medium text-foreground mb-1">Attend and Network</h5>
                      <p className="text-muted-foreground text-sm">
                        Arrive early, visit company booths, network with recruiters, and collect business cards. Follow up with companies after the event.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h5 className="font-medium text-blue-900 mb-2">💡 Job Fair Success Tips</h5>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Research companies before attending the fair</li>
                  <li>• Prepare a 30-second elevator pitch about yourself</li>
                  <li>• Bring multiple copies of your updated resume</li>
                  <li>• Dress professionally and arrive early</li>
                  <li>• Ask thoughtful questions about the company and roles</li>
                  <li>• Collect business cards and follow up within 24-48 hours</li>
                </ul>
              </div>

              <div className="text-center">
                <Link to="/job-fairs">
                  <Button 
                    className="px-8 py-3 hover:bg-[#1c1c1c] transition-colors"
                  >
                    Browse Job Fairs
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card id="peso-services-guide" className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                PESO Services Guide
              </CardTitle>
              <CardDescription>
                Access Public Employment Service Office services for career guidance and employment assistance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-foreground mb-4">Available Services</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Career counseling and guidance</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Job placement assistance</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Skills training programs</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Employment information and statistics</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-foreground mb-4">Service Categories</h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-primary/5 rounded-lg">
                      <p className="text-sm font-medium text-foreground">Career Development</p>
                      <p className="text-xs text-muted-foreground">Resume writing, interview preparation, career planning</p>
                    </div>
                    <div className="p-3 bg-primary/5 rounded-lg">
                      <p className="text-sm font-medium text-foreground">Training Programs</p>
                      <p className="text-xs text-muted-foreground">Skills development, certification courses</p>
                    </div>
                    <div className="p-3 bg-primary/5 rounded-lg">
                      <p className="text-sm font-medium text-foreground">Job Matching</p>
                      <p className="text-xs text-muted-foreground">Connect job seekers with employers</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-4">How to Access PESO Services</h4>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">
                      1
                    </div>
                    <div>
                      <h5 className="font-medium text-foreground mb-1">Navigate to PESO Services</h5>
                      <p className="text-muted-foreground text-sm">
                        Click on "Services" in the navigation menu, then select "PESO Services" to access the Public Employment Service Office portal.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">
                      2
                    </div>
                    <div>
                      <h5 className="font-medium text-foreground mb-1">Browse Available Services</h5>
                      <p className="text-muted-foreground text-sm">
                        Explore the different service categories including career counseling, job placement, training programs, and employment information.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">
                      3
                    </div>
                    <div>
                      <h5 className="font-medium text-foreground mb-1">Select Your Service</h5>
                      <p className="text-muted-foreground text-sm">
                        Choose the service that best fits your needs, whether it's career guidance, skills training, or job placement assistance.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">
                      4
                    </div>
                    <div>
                      <h5 className="font-medium text-foreground mb-1">Complete Service Request</h5>
                      <p className="text-muted-foreground text-sm">
                        Fill out the service request form with your personal information, career goals, and specific assistance needed.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">
                      5
                    </div>
                    <div>
                      <h5 className="font-medium text-foreground mb-1">Schedule Appointment</h5>
                      <p className="text-muted-foreground text-sm">
                        For services requiring in-person consultation, schedule an appointment with a PESO counselor at your local office.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">
                      6
                    </div>
                    <div>
                      <h5 className="font-medium text-foreground mb-1">Follow Up and Track Progress</h5>
                      <p className="text-muted-foreground text-sm">
                        Keep track of your service requests and follow up as needed. PESO staff will contact you regarding your requests and provide updates.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h5 className="font-medium text-green-900 mb-2">✅ PESO Service Benefits</h5>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• Free career counseling and guidance services</li>
                  <li>• Access to government job opportunities</li>
                  <li>• Skills training and development programs</li>
                  <li>• Job placement assistance and matching</li>
                  <li>• Employment statistics and market information</li>
                  <li>• Support for special groups (OFWs, persons with disabilities)</li>
                </ul>
              </div>

              <div className="text-center">
                <Link to="/peso">
                  <Button 
                    className="px-8 py-3 hover:bg-[#1c1c1c] transition-colors"
                  >
                    Access PESO Services
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Additional Resources
              </CardTitle>
              <CardDescription>
                More helpful resources to get the most out of Una sa Trabaho
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="bg-primary/10 w-10 h-10 rounded-lg flex items-center justify-center mb-3">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">Profile Optimization</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Learn how to create a compelling profile that attracts employers and increases your visibility.
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-1 mb-3">
                    <li>• Complete all profile sections</li>
                    <li>• Use professional keywords</li>
                    <li>• Upload a professional photo</li>
                    <li>• Keep information updated</li>
                  </ul>
                </div>
                
                <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="bg-primary/10 w-10 h-10 rounded-lg flex items-center justify-center mb-3">
                    <Target className="h-5 w-5 text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">Job Application Tips</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Best practices for applying to jobs and increasing your chances of success.
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-1 mb-3">
                    <li>• Customize applications for each job</li>
                    <li>• Follow up after applying</li>
                    <li>• Prepare for interviews</li>
                    <li>• Network with professionals</li>
                  </ul>
                </div>
                
                <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="bg-primary/10 w-10 h-10 rounded-lg flex items-center justify-center mb-3">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">AI-Powered Features</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Discover how our AI technology helps you find the perfect job matches.
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-1 mb-3">
                    <li>• Resume analysis and parsing</li>
                    <li>• Smart job recommendations</li>
                    <li>• Skills matching algorithms</li>
                    <li>• Personalized suggestions</li>
                  </ul>
                </div>

                <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="bg-primary/10 w-10 h-10 rounded-lg flex items-center justify-center mb-3">
                    <Award className="h-5 w-5 text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">Career Development</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Resources and tools to advance your career and develop new skills.
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-1 mb-3">
                    <li>• Skills assessment tools</li>
                    <li>• Training recommendations</li>
                    <li>• Career path planning</li>
                    <li>• Industry insights</li>
                  </ul>
                </div>

                <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="bg-primary/10 w-10 h-10 rounded-lg flex items-center justify-center mb-3">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">Networking</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Connect with professionals and build your professional network.
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-1 mb-3">
                    <li>• Connect with industry peers</li>
                    <li>• Join professional groups</li>
                    <li>• Attend virtual events</li>
                    <li>• Share your expertise</li>
                  </ul>
                </div>

                <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="bg-primary/10 w-10 h-10 rounded-lg flex items-center justify-center mb-3">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">Document Management</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Manage your professional documents and keep them organized.
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-1 mb-3">
                    <li>• Upload and store resumes</li>
                    <li>• Manage cover letters</li>
                    <li>• Store certificates</li>
                    <li>• Track application history</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <Card className="shadow-lg border-0 bg-primary/5">
              <CardContent className="pt-8 pb-8">
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  Ready to Get Started?
                </h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Now that you know how to use Una sa Trabaho, create your account and start your job search journey today.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/signup">
                    <Button 
                      size="lg" 
                      className="px-8 py-4 text-lg hover:bg-[#1c1c1c] transition-colors"
                    >
                      Create Account
                    </Button>
                  </Link>
                  <Link to="/upload-resume">
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="px-8 py-4 text-lg hover:bg-[#1c1c1c] hover:text-white transition-colors"
                    >
                      Upload Resume
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

export default UsersGuidePage

