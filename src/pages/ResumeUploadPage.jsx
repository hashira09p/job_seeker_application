import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import * as React from "react"
import { Link } from 'react-router-dom'
import { 
  Upload, 
  FileText, 
  Search, 
  MapPin, 
  Briefcase, 
  Building2, 
  Clock, 
  DollarSign, 
  ArrowRight, 
  CheckCircle, 
  AlertCircle, 
  Star,
  Download,
  Eye,
  Trash2,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Award
} from 'lucide-react'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Breadcrumb from '@/components/Breadcrumb'

function ResumeUploadPage() {
  const [uploadedFile, setUploadedFile] = React.useState(null)
  const [isUploading, setIsUploading] = React.useState(false)
  const [uploadProgress, setUploadProgress] = React.useState(0)
  const [extractedSkills, setExtractedSkills] = React.useState([])
  const [suggestedJobs, setSuggestedJobs] = React.useState([])
  const [isAnalyzing, setIsAnalyzing] = React.useState(false)
  const [analysisComplete, setAnalysisComplete] = React.useState(false)
  const [userProfile, setUserProfile] = React.useState({
    name: '',
    email: '',
    phone: '',
    experience: '',
    education: '',
    skills: []
  })

  const mockSuggestedJobs = [
    {
      id: 1,
      title: "Senior Software Engineer",
      company_name: "Globe Telecom",
      location: "Taguig City, Metro Manila",
      job_type: "Full Time",
      salary_min: 80000,
      salary_max: 120000,
      posted_date: "2024-01-15",
      description: "We are looking for a Senior Software Engineer to join our dynamic team. You will be responsible for developing and maintaining high-quality software solutions.",
      requirements: ["React", "Node.js", "TypeScript", "AWS", "5+ years experience"],
      match_score: 95,
      is_urgent: true,
      is_remote: true
    },
    {
      id: 2,
      title: "Full Stack Developer",
      company_name: "SM Investments",
      location: "Makati City, Metro Manila",
      job_type: "Full Time",
      salary_min: 60000,
      salary_max: 90000,
      posted_date: "2024-01-14",
      description: "Join our innovative team as a Full Stack Developer. Work on cutting-edge projects and contribute to our digital transformation initiatives.",
      requirements: ["JavaScript", "Python", "React", "Django", "PostgreSQL"],
      match_score: 88,
      is_urgent: false,
      is_remote: false
    },
    {
      id: 3,
      title: "Frontend Developer",
      company_name: "Ayala Corporation",
      location: "Quezon City, Metro Manila",
      job_type: "Full Time",
      salary_min: 50000,
      salary_max: 75000,
      posted_date: "2024-01-13",
      description: "We are seeking a talented Frontend Developer to create amazing user experiences. You will work with modern technologies and collaborate with cross-functional teams.",
      requirements: ["React", "Vue.js", "CSS", "JavaScript", "UI/UX"],
      match_score: 82,
      is_urgent: false,
      is_remote: true
    },
    {
      id: 4,
      title: "Backend Developer",
      company_name: "BDO Unibank",
      location: "Ortigas, Pasig City",
      job_type: "Full Time",
      salary_min: 55000,
      salary_max: 85000,
      posted_date: "2024-01-12",
      description: "Join our backend development team and work on scalable, secure financial applications. Experience with microservices architecture preferred.",
      requirements: ["Node.js", "Python", "MongoDB", "Docker", "Kubernetes"],
      match_score: 78,
      is_urgent: true,
      is_remote: false
    },
    {
      id: 5,
      title: "DevOps Engineer",
      company_name: "PLDT",
      location: "Mandaluyong City, Metro Manila",
      job_type: "Full Time",
      salary_min: 70000,
      salary_max: 100000,
      posted_date: "2024-01-11",
      description: "We are looking for a DevOps Engineer to help us build and maintain our cloud infrastructure. Experience with CI/CD pipelines and automation is essential.",
      requirements: ["AWS", "Docker", "Kubernetes", "Jenkins", "Terraform"],
      match_score: 75,
      is_urgent: false,
      is_remote: true
    }
  ]

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      setUploadedFile(file)
      setIsUploading(true)
      setUploadProgress(0)
      
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval)
            setIsUploading(false)
            analyzeResume(file)
            return 100
          }
          return prev + 10
        })
      }, 200)
    }
  }

  const analyzeResume = async (file) => {
    setIsAnalyzing(true)
    
    setTimeout(() => {
      const mockSkills = [
        "React", "JavaScript", "Node.js", "Python", "TypeScript", 
        "AWS", "Docker", "Git", "MongoDB", "PostgreSQL", "CSS", "HTML"
      ]
      
      setExtractedSkills(mockSkills)
      setSuggestedJobs(mockSuggestedJobs)
      setAnalysisComplete(true)
      setIsAnalyzing(false)
    }, 3000)
  }

  const removeFile = () => {
    setUploadedFile(null)
    setUploadProgress(0)
    setExtractedSkills([])
    setSuggestedJobs([])
    setAnalysisComplete(false)
  }

  const getMatchScoreColor = (score) => {
    if (score >= 90) return "text-green-600 bg-green-100"
    if (score >= 80) return "text-blue-600 bg-blue-100"
    if (score >= 70) return "text-yellow-600 bg-yellow-100"
    return "text-orange-600 bg-orange-100"
  }

  const getMatchScoreLabel = (score) => {
    if (score >= 90) return "Excellent Match"
    if (score >= 80) return "Great Match"
    if (score >= 70) return "Good Match"
    return "Fair Match"
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f9f9f9' }}>
      <Navigation />
      <Breadcrumb />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Upload Your Resume
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Get personalized job recommendations based on your skills and experience. 
          </p>
        </div>

        <Card className="shadow-lg border-0 mb-16">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-primary" />
              Resume Upload
            </CardTitle>
            <CardDescription>
              Upload your resume in PDF, DOC, or DOCX format. We'll analyze it to provide personalized job suggestions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!uploadedFile ? (
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 text-center hover:border-primary/50 transition-colors">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Choose your resume file
                </h3>
                <p className="text-muted-foreground mb-6">
                  Drag and drop your resume here, or click to browse files
                </p>
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="resume-upload"
                />
                <Button asChild>
                  <label htmlFor="resume-upload" className="cursor-pointer">
                    <Upload className="h-4 w-4 mr-2" />
                    Choose File
                  </label>
                </Button>
                <p className="text-sm text-muted-foreground mt-4">
                  Supported formats: PDF, DOC, DOCX (Max 10MB)
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {isUploading && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">Uploading...</span>
                      <span className="text-sm text-muted-foreground">{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {uploadedFile && !isUploading && (
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 w-10 h-10 rounded-lg flex items-center justify-center">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{uploadedFile.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                      <Button variant="outline" size="sm" onClick={removeFile}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                  </div>
                )}

                {isAnalyzing && (
                  <div className="text-center py-8">
                    <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="h-8 w-8 text-primary animate-pulse" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Analyzing Your Resume
                    </h3>
                    <p className="text-muted-foreground">
                      Extracting your skills and experience to find the best job matches...
                    </p>
                  </div>
                )}

                {analysisComplete && (
                  <div className="text-center py-8">
                    <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Analysis Complete!
                    </h3>
                    <p className="text-muted-foreground">
                      We've found {suggestedJobs.length} job opportunities that match your profile.
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {extractedSkills.length > 0 && (
          <Card className="shadow-lg border-0 mb-16">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Skills Detected
              </CardTitle>
              <CardDescription>
                Based on your resume, we've identified the following skills and technologies.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {extractedSkills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="text-sm">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {suggestedJobs.length > 0 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Recommended Jobs for You
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Based on your resume analysis, here are the best matching job opportunities we found for you.
              </p>
            </div>

            <div className="space-y-4">
              {suggestedJobs.map((job) => (
                <Card key={job.id} className="shadow-lg border-0 hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-foreground">{job.title}</h3>
                          <Badge className={`${getMatchScoreColor(job.match_score)}`}>
                            {job.match_score}% Match
                          </Badge>
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
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{job.job_type}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            <span>₱{job.salary_min?.toLocaleString()} - ₱{job.salary_max?.toLocaleString()}</span>
                          </div>
                        </div>

                        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                          {job.description}
                        </p>

                        <div className="flex flex-wrap gap-1 mb-3">
                          {job.requirements.slice(0, 5).map((req, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {req}
                            </Badge>
                          ))}
                          {job.requirements.length > 5 && (
                            <Badge variant="outline" className="text-xs">
                              +{job.requirements.length - 5} more
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2 lg:min-w-[200px]">
                        <div className="text-center mb-2">
                          <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getMatchScoreColor(job.match_score)}`}>
                            <Star className="h-3 w-3" />
                            {getMatchScoreLabel(job.match_score)}
                          </div>
                        </div>
                        <Button className="hover:bg-[#1c1c1c] transition-colors">
                          Apply Now
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                        <Button variant="outline" className="hover:bg-[#1c1c1c] hover:text-white transition-colors">
                          View Details
                        </Button>
                        <Button variant="outline" size="sm" className="hover:bg-[#1c1c1c] hover:text-white transition-colors">
                          Save Job
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {analysisComplete && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
              What's Next?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow cursor-pointer hover:bg-[#1c1c1c] hover:text-white group">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center group-hover:bg-white/20">
                      <TrendingUp className="h-6 w-6 text-primary group-hover:text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold group-hover:text-white">Career Insights</h3>
                      <p className="text-sm text-muted-foreground group-hover:text-gray-300">
                        Get detailed analysis of your career path and growth opportunities.
                      </p>
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
                      <h3 className="font-semibold group-hover:text-white">Network Building</h3>
                      <p className="text-sm text-muted-foreground group-hover:text-gray-300">
                        Connect with professionals in your field and expand your network.
                      </p>
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
                      <h3 className="font-semibold group-hover:text-white">Skill Development</h3>
                      <p className="text-sm text-muted-foreground group-hover:text-gray-300">
                        Discover courses and certifications to enhance your skills.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        <div className="text-center mt-16">
          <Card className="shadow-lg border-0 bg-primary/5">
            <CardContent className="pt-8 pb-8">
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Ready to Find Your Dream Job?
              </h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Create your profile, set up job alerts, and get notified about new opportunities that match your skills.
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
                    Browse All Jobs
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

export default ResumeUploadPage

