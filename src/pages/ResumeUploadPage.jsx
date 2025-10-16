import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import * as React from "react"
import { Link, useNavigate } from 'react-router-dom'
import { 
  Upload, 
  FileText, 
  ArrowRight, 
  CheckCircle, 
  AlertCircle,
  Download,
  Eye,
  Trash2,
  TrendingUp,
  Users,
  Award,
  LogIn,
  Info
} from 'lucide-react'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Breadcrumb from '@/components/Breadcrumb'
import axios from 'axios'

function ResumeUploadPage() {
  const [uploadedFile, setUploadedFile] = React.useState(null)
  const [isUploading, setIsUploading] = React.useState(false)
  const [uploadProgress, setUploadProgress] = React.useState(0)
  const [analysisComplete, setAnalysisComplete] = React.useState(false)
  const [uploadError, setUploadError] = React.useState("")
  const [uploadSuccess, setUploadSuccess] = React.useState("")
  const [storedResume, setStoredResume] = React.useState(null)
  const URL = "http://localhost:3000"
  const navigate = useNavigate()

  // Check if user is logged in
  const isUserLoggedIn = () => {
    const token = localStorage.getItem("token");
    return !!token;
  };

  // Fetch stored resume from database on component mount
  React.useEffect(() => {
    if (isUserLoggedIn()) {
      fetchStoredResume();
    }
  }, []);

  // Clean and normalize file path
  const cleanFilePath = (path) => {
    if (!path) return '';
    
    console.log("Original path from backend:", path);
    
    // Remove extra spaces
    path = path.trim();
    
    // Replace all backslashes with forward slashes
    path = path.replace(/\\/g, '/');
    
    // Remove double slashes
    path = path.replace(/\/\//g, '/');
    
    // Fix specific path issues
    path = path.replace(/upLoads/gi, 'uploads');
    path = path.replace(/rcname/gi, 'resumes'); // Fix "rcname" to "resumes"
    path = path.replace(/lvesumes/gi, 'resumes'); // Fix "lvesumes" to "resumes"
    path = path.replace(/V/g, ''); // Remove the stray "V"
    
    // Ensure it starts with uploads/resumes/
    if (!path.startsWith('uploads/resumes/')) {
      // Extract filename and rebuild path
      const fileName = path.split('/').pop() || path.split('\\').pop();
      path = `uploads/resumes/${fileName}`;
    }
    
    console.log("Cleaned path:", path);
    return path;
  }

  const fetchStoredResume = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get(`${URL}/getResume`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      console.log("Fetched resume:", response.data)
      
      // Check if resumePath exists in response
      if (response.data && response.data.resumePath) {
        // Clean the file path
        const cleanedPath = cleanFilePath(response.data.resumePath);
        console.log(cleanedPath)
        setStoredResume({
          resumePath: cleanedPath,
          uploadedAt: new Date().toISOString()
        })
        setAnalysisComplete(true)
      }
    } catch (error) {
      console.error('Error fetching resume:', error)
      // It's okay if no resume exists yet
    }
  }

  const handleFileUpload = (event) => {
    // Check if user is logged in
    if (!isUserLoggedIn()) {
      alert('Please log in or register first to upload your resume.');
      navigate('/login');
      return;
    }

    // Check if there's already a stored resume
    if (storedResume) {
      setUploadError('Please delete your existing resume first before uploading a new one.');
      // Clear the file input
      event.target.value = '';
      return;
    }

    const file = event.target.files[0]
    if (file) {
      // Check file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        setUploadError('Please upload a PDF or Word document');
        // Clear the file input
        event.target.value = '';
        return;
      }
      
      // Check file size (50MB limit)
      if (file.size > 50 * 1024 * 1024) {
        setUploadError('File size must be less than 50MB');
        // Clear the file input
        event.target.value = '';
        return;
      }
      
      setUploadedFile(file)
      setUploadError("")
      setUploadSuccess("")
      setAnalysisComplete(false)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    
    // Check if user is logged in
    if (!isUserLoggedIn()) {
      alert('Please log in or register first to upload your resume.');
      navigate('/login');
      return;
    }
    
    // Check if there's already a stored resume
    if (storedResume) {
      setUploadError('Please delete your existing resume first before uploading a new one.');
      return;
    }
    
    if (!uploadedFile) {
      setUploadError('Please select a resume file to upload')
      return
    }

    setIsUploading(true)
    setUploadError("")
    setUploadSuccess("")

    try {
      const formData = new FormData()
      formData.append("resumeFile", uploadedFile)

      const token = localStorage.getItem("token")

      const response = await axios.post(`${URL}/uploadResume`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          setUploadProgress(progress)
        }
      })

      console.log("Upload response:", response.data)
      
      setUploadSuccess('Resume uploaded successfully!')
      setAnalysisComplete(true)
      
      // Fetch the stored resume data from database after successful upload
      await fetchStoredResume()
      
      // Clear the temporary uploaded file state since we now have it in database
      setUploadedFile(null)
      setUploadProgress(0)

    } catch (error) {
      console.error('Error uploading resume:', error)
      if (error.response?.status === 401) {
        alert('Your session has expired. Please log in again.');
        localStorage.removeItem("token");
        navigate('/login');
      } else if (error.response?.status === 400) {
        setUploadError('You already have a resume uploaded. Please delete it first.');
      } else {
        setUploadError('Failed to upload resume. Please try again.');
      }
    } finally {
      setIsUploading(false)
    }
  }

  const removeFile = async () => {
    // Check if user is logged in
    if (!isUserLoggedIn()) {
      alert('Please log in or register first to manage your resume.');
      navigate('/login');
      return;
    }

    try {
      const token = localStorage.getItem("token")
      await axios.delete(`${URL}/deleteResume`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      
      setStoredResume(null)
      setUploadedFile(null)
      setUploadProgress(0)
      setAnalysisComplete(false)
      setUploadError("")
      setUploadSuccess("Resume deleted successfully!")
      
      // Clear the file input
      const fileInput = document.getElementById('resume-upload');
      if (fileInput) {
        fileInput.value = '';
      }
    } catch (error) {
      console.error('Error deleting resume:', error)
      if (error.response?.status === 401) {
        alert('Your session has expired. Please log in again.');
        localStorage.removeItem("token");
        navigate('/login');
      } else {
        setUploadError("Failed to delete resume")
      }
    }
  }

  const uploadNewResume = () => {
    // Check if user is logged in
    if (!isUserLoggedIn()) {
      alert('Please log in or register first to upload your resume.');
      navigate('/login');
      return;
    }

    setUploadedFile(null)
    setUploadProgress(0)
    setAnalysisComplete(false)
    setUploadError("")
    setUploadSuccess("")
    
    // Clear the file input
    const fileInput = document.getElementById('resume-upload');
    if (fileInput) {
      fileInput.value = '';
    }
  }

  // Extract filename from path for display
  const getFileNameFromPath = (path) => {
    if (!path) return '';
    const cleanedPath = cleanFilePath(path);
    return cleanedPath.split('/').pop() || cleanedPath.split('\\').pop() || cleanedPath;
  }

  // Download the file using the resumePath from backend
  const handleDownload = async () => {
    // Check if user is logged in
    if (!isUserLoggedIn()) {
      alert('Please log in or register first to download your resume.');
      navigate('/login');
      return;
    }

    if (!storedResume || !storedResume.resumePath) {
      setUploadError("No resume file available for download");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      
      // Use the API endpoint instead of direct file access
      const response = await axios.get(`${URL}/downloadResume`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        responseType: 'blob' // Important for file downloads
      });

      // Create blob from response
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      
      // Create download link
      const link = document.createElement('a');
      link.href = url;
      
      // Get filename from response headers or use default
      const contentDisposition = response.headers['content-disposition'];
      let fileName = 'resume.pdf';
      
      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/);
        if (fileNameMatch && fileNameMatch[1]) {
          fileName = fileNameMatch[1];
        }
      }
      
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Download error:', error);
      if (error.response?.status === 401) {
        alert('Your session has expired. Please log in again.');
        localStorage.removeItem("token");
        navigate('/login');
      } else {
        setUploadError(`Download failed: ${error.message}`);
      }
    }
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
            Upload your resume to get started with job applications. You can upload one resume at a time.
          </p>
          
          {!isUserLoggedIn() && (
            <div className="mt-6 p-4 bg-yellow-100 border border-yellow-300 rounded-lg max-w-2xl mx-auto">
              <div className="flex items-center justify-center gap-2">
                <LogIn className="h-5 w-5 text-yellow-700" />
                <p className="text-yellow-800 font-medium">
                  Please <Link to="/login" className="underline hover:text-yellow-900">log in</Link> or <Link to="/signup" className="underline hover:text-yellow-900">register</Link> to upload and manage your resume
                </p>
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="shadow-lg border-0 mb-16">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-primary" />
                Resume Upload
              </CardTitle>
              <CardDescription>
                Upload your resume in PDF, DOC, or DOCX format. Maximum file size: 50MB.
                {!isUserLoggedIn() && (
                  <span className="text-yellow-600 font-medium block mt-1">
                    🔒 You need to be logged in to upload a resume
                  </span>
                )}
                {isUserLoggedIn() && storedResume && (
                  <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Info className="h-4 w-4 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-blue-800 text-sm font-medium">
                          You already have a resume uploaded
                        </p>
                        <p className="text-blue-700 text-xs mt-1">
                          Please delete your current resume first to upload a new one
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Error and Success Messages */}
              {uploadError && (
                <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg flex items-center gap-2 text-red-700">
                  <AlertCircle className="h-4 w-4" />
                  {uploadError}
                </div>
              )}

              {uploadSuccess && (
                <div className="mb-6 p-4 bg-green-100 border border-green-300 rounded-lg flex items-center gap-2 text-green-700">
                  <CheckCircle className="h-4 w-4" />
                  {uploadSuccess}
                </div>
              )}

              <div className="space-y-6">
                {/* Resume Upload Section */}
                <div className="space-y-4">
                  {!isUserLoggedIn() ? (
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                      <div className="bg-muted/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <LogIn className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        Authentication Required
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        Please log in or create an account to upload your resume
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/login">
                          <Button className="px-6">
                            <LogIn className="h-4 w-4 mr-2" />
                            Log In
                          </Button>
                        </Link>
                        <Link to="/signup">
                          <Button variant="outline" className="px-6">
                            Create Account
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ) : storedResume ? (
                    // Show existing resume with delete option
                    <div className="space-y-4">
                      <div className="border-2 border-blue-200 bg-blue-50 rounded-lg p-6 text-center">
                        <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                          <FileText className="h-8 w-8 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                          Resume Already Uploaded
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          You have already uploaded a resume. Delete it first to upload a new one.
                        </p>
                        
                        <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                          <div className="flex items-center gap-3">
                            <div className="bg-primary/10 w-10 h-10 rounded-lg flex items-center justify-center">
                              <FileText className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium text-foreground">
                                {getFileNameFromPath(storedResume.resumePath)}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                <strong>Uploaded:</strong> {storedResume.uploadedAt ? new Date(storedResume.uploadedAt).toLocaleDateString() : 'Recently'}
                              </p>
                              <Badge className="bg-green-100 text-green-800 mt-1">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Stored in Database
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              type="button"
                              onClick={handleDownload}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              type="button" 
                              onClick={removeFile}
                              className="bg-red-50 border-red-200 text-red-700 hover:bg-red-100 hover:text-red-800"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Resume
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : !uploadedFile ? (
                    // Show upload interface when no resume exists
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
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
                        required
                      />
                      <Button asChild type="button">
                        <label htmlFor="resume-upload" className="cursor-pointer">
                          <Upload className="h-4 w-4 mr-2" />
                          Choose File
                        </label>
                      </Button>
                      <p className="text-sm text-muted-foreground mt-4">
                        Supported formats: PDF, DOC, DOCX (Max 50MB)
                      </p>
                    </div>
                  ) : (
                    // Show file ready for upload
                    <div className="space-y-4">
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
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="bg-primary/10 w-10 h-10 rounded-lg flex items-center justify-center">
                                <FileText className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium text-foreground">
                                  {uploadedFile.name}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  File Size: {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                                <Badge className="bg-blue-100 text-blue-800 mt-1">
                                  Ready to Upload
                                </Badge>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                type="button" 
                                onClick={() => {
                                  setUploadedFile(null);
                                  const fileInput = document.getElementById('resume-upload');
                                  if (fileInput) fileInput.value = '';
                                }}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Cancel
                              </Button>
                            </div>
                          </div>

                          <div className="flex justify-end gap-4">
                            <Button 
                              type="submit" 
                              size="lg" 
                              disabled={isUploading}
                              className="px-8 py-4 text-lg hover:bg-[#1c1c1c] transition-colors"
                            >
                              {isUploading ? (
                                <>
                                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                  Uploading...
                                </>
                              ) : (
                                <>
                                  <Upload className="h-4 w-4 mr-2" />
                                  Upload Resume
                                  <ArrowRight className="h-4 w-4 ml-2" />
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </form>

        {analysisComplete && storedResume && (
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

        {/* Only show "Ready to Find Your Dream Job?" section if user is NOT logged in */}
        {!isUserLoggedIn() && (
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
        )}
      </div>

      <Footer />
    </div>
  )
}

export default ResumeUploadPage