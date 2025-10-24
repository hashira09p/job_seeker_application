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
  Info,
  Plus,
  File
} from 'lucide-react'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Breadcrumb from '@/components/Breadcrumb'
import axios from 'axios'

function ResumeUploadPage() {
  const [uploadedFile, setUploadedFile] = React.useState(null)
  const [isUploading, setIsUploading] = React.useState(false)
  const [uploadProgress, setUploadProgress] = React.useState(0)
  const [uploadError, setUploadError] = React.useState("")
  const [uploadSuccess, setUploadSuccess] = React.useState("")
  const [storedDocuments, setStoredDocuments] = React.useState([])
  const URL = "http://localhost:3000"
  const navigate = useNavigate()

  // Check if user is logged in
  const isUserLoggedIn = () => {
    const token = localStorage.getItem("token");
    return !!token;
  };

  // Fetch stored documents from database on component mount
  React.useEffect(() => {
    if (isUserLoggedIn()) {
      fetchStoredDocuments();
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
    
    // Ensure it starts with uploads/
    if (!path.startsWith('uploads/')) {
      // Extract filename and rebuild path
      const fileName = path.split('/').pop() || path.split('\\').pop();
      path = `uploads/${fileName}`;
    }
    
    console.log("Cleaned path:", path);
    return path;
  }

  const fetchStoredDocuments = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get(`${URL}/getResume`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      console.log("Fetched documents:", response.data)
      
      // Check if documents exist in response
      if (response.data && response.data.documents) {
        const documents = Array.isArray(response.data.documents) 
          ? response.data.documents 
          : [response.data.documents];
        
        // Filter documents where deletedAt is null (not deleted)
        const activeDocuments = documents.filter(doc => doc.deletedAt === null);
        
        const formattedDocuments = activeDocuments.map(doc => ({
          id: doc.id,
          docType: doc.docType || 'Resume',
          fileName: doc.fileName,
          fileDir: cleanFilePath(doc.fileDir),
          createdAt: doc.createdAt,
          updatedAt: doc.updatedAt,
          deletedAt: doc.deletedAt
        }));
        
        setStoredDocuments(formattedDocuments);
      }
    } catch (error) {
      console.error('Error fetching documents:', error)
      // It's okay if no documents exist yet
    }
  }

  const handleFileUpload = (event) => {
    // Check if user is logged in
    if (!isUserLoggedIn()) {
      alert('Please log in or register first to upload documents.');
      navigate('/login');
      return;
    }

    const file = event.target.files[0]
    if (file) {
      // Check file type - Only allow PDF, DOC, and DOCX
      const allowedTypes = [
        'application/pdf', 
        'application/msword', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      
      // Also check file extension for additional validation
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      const allowedExtensions = ['pdf', 'doc', 'docx'];
      
      if (!allowedTypes.includes(file.type) || !allowedExtensions.includes(fileExtension)) {
        setUploadError('Please upload only PDF, DOC, or DOCX files');
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
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    
    // Check if user is logged in
    if (!isUserLoggedIn()) {
      alert('Please log in or register first to upload documents.');
      navigate('/login');
      return;
    }
    
    if (!uploadedFile) {
      setUploadError('Please select a file to upload')
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
      
      setUploadSuccess('Document uploaded successfully!')
      
      // Fetch the updated documents list from database after successful upload
      await fetchStoredDocuments()
      
      // Clear the temporary uploaded file state since we now have it in database
      setUploadedFile(null)
      setUploadProgress(0)

    } catch (error) {
      console.error('Error uploading document:', error)
      if (error.response?.status === 401) {
        alert('Your session has expired. Please log in again.');
        localStorage.removeItem("token");
        navigate('/login');
      } else {
        setUploadError('Failed to upload document. Please try again.');
      }
    } finally {
      setIsUploading(false)
    }
  }

  const removeFile = async (documentId) => {
    // Check if user is logged in
    if (!isUserLoggedIn()) {
      alert('Please log in or register first to manage your documents.');
      navigate('/login');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      const token = localStorage.getItem("token")
      await axios.delete(`${URL}/deleteResume/${documentId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      
      // Update local state by removing the deleted document
      setStoredDocuments(prev => prev.filter(doc => doc.id !== documentId))
      setUploadError("")
      setUploadSuccess("Document deleted successfully!")
      
    } catch (error) {
      console.error('Error deleting document:', error)
      if (error.response?.status === 401) {
        alert('Your session has expired. Please log in again.');
        localStorage.removeItem("token");
        navigate('/login');
      } else {
        setUploadError(error.response?.data?.message || 'Error deleting document')
      }
    }
  }

  // Extract filename from path for display
  const getFileNameFromPath = (path) => {
    if (!path) return '';
    const cleanedPath = cleanFilePath(path);
    return cleanedPath.split('/').pop() || cleanedPath.split('\\').pop() || cleanedPath;
  }

  // Get file type badge color
  const getFileTypeBadge = (docType, fileName) => {
    const fileExtension = fileName?.split('.').pop()?.toLowerCase();
    
    if (docType) {
      return (
        <Badge variant="secondary" className="capitalize">
          {docType}
        </Badge>
      );
    }
    
    // Fallback to file extension based badge
    switch (fileExtension) {
      case 'pdf':
        return <Badge className="bg-red-100 text-red-800">PDF</Badge>;
      case 'doc':
      case 'docx':
        return <Badge className="bg-blue-100 text-blue-800">Word</Badge>;
      default:
        return <Badge variant="secondary">Document</Badge>;
    }
  }

  // Download the file using the document ID
  const handleDownload = async (documentId, fileName) => {
    // Check if user is logged in
    if (!isUserLoggedIn()) {
      alert('Please log in or register first to download documents.');
      navigate('/login');
      return;
    }

    try {
      const token = localStorage.getItem("token");
      
      // Use the API endpoint for downloading
      const response = await axios.get(`${URL}/applicants/${documentId}/resume`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        responseType: 'blob'
      });

      // Get filename from Content-Disposition header or use the stored filename
      const contentDisposition = response.headers['content-disposition'];
      let downloadFileName = fileName || 'document';
      
      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/);
        if (fileNameMatch && fileNameMatch[1]) {
          downloadFileName = fileNameMatch[1];
        }
      }

      // Get content type to determine file extension if not in filename
      const contentType = response.headers['content-type'];
      if (!downloadFileName.includes('.') && contentType) {
        if (contentType.includes('pdf')) {
          downloadFileName += '.pdf';
        } else if (contentType.includes('word') || contentType.includes('docx')) {
          downloadFileName += '.docx';
        } else if (contentType.includes('msword')) {
          downloadFileName += '.doc';
        }
      }

      // Create blob from response with proper content type
      const blob = new Blob([response.data], { 
        type: contentType || 'application/octet-stream'
      });
      const url = window.URL.createObjectURL(blob);
      
      // Create download link
      const link = document.createElement('a');
      link.href = url;
      link.download = downloadFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      window.URL.revokeObjectURL(url);
      
      console.log('Document downloaded successfully:', downloadFileName);
      
    } catch (error) {
      console.error('Download error:', error);
      if (error.response?.status === 401) {
        alert('Your session has expired. Please log in again.');
        localStorage.removeItem("token");
        navigate('/login');
      } else if (error.response?.status === 404) {
        setUploadError('Document file not found on server.');
      } else if (error.response?.status === 500) {
        setUploadError('Server error while downloading document. Please try again.');
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
            Manage Your Documents
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Upload and manage your resumes and documents. Only PDF, DOC, and DOCX files are supported.
          </p>
          
          {!isUserLoggedIn() && (
            <div className="mt-6 p-4 bg-yellow-100 border border-yellow-300 rounded-lg max-w-2xl mx-auto">
              <div className="flex items-center justify-center gap-2">
                <LogIn className="h-5 w-5 text-yellow-700" />
                <p className="text-yellow-800 font-medium">
                  Please <Link to="/login" className="underline hover:text-yellow-900">log in</Link> or <Link to="/signup" className="underline hover:text-yellow-900">register</Link> to upload and manage your documents
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
                Document Upload
              </CardTitle>
              <CardDescription>
                Upload your resumes and documents in PDF, DOC, or DOCX format. Maximum file size: 50MB.
                {!isUserLoggedIn() && (
                  <span className="text-yellow-600 font-medium block mt-1">
                    🔒 You need to be logged in to upload documents
                  </span>
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
                {/* Document Upload Section */}
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
                        Please log in or create an account to upload documents
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
                  ) : !uploadedFile ? (
                    // Show upload interface
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                      <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Plus className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        Add New Document
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        Drag and drop your file here, or click to browse files
                      </p>
                      <Input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="document-upload"
                        required
                      />
                      <Button asChild type="button">
                        <label htmlFor="document-upload" className="cursor-pointer">
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
                                <File className="h-5 w-5 text-primary" />
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
                                  const fileInput = document.getElementById('document-upload');
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
                                  Upload Document
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

                {/* Display stored documents */}
                {storedDocuments.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">Your Active Documents</h3>
                    <p className="text-sm text-muted-foreground">
                      Showing {storedDocuments.length} active document(s)
                    </p>
                    <div className="space-y-3">
                      {storedDocuments.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-4 bg-white rounded-lg border hover:shadow-md transition-shadow">
                          <div className="flex items-center gap-3">
                            <div className="bg-primary/10 w-10 h-10 rounded-lg flex items-center justify-center">
                              <FileText className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-medium text-foreground">
                                  {doc.fileName || getFileNameFromPath(doc.fileDir)}
                                </p>
                                {getFileTypeBadge(doc.docType, doc.fileName)}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                <strong>Uploaded:</strong> {doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : 'Unknown date'}
                              </p>
                              {doc.updatedAt && doc.updatedAt !== doc.createdAt && (
                                <p className="text-sm text-muted-foreground">
                                  <strong>Updated:</strong> {new Date(doc.updatedAt).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              type="button"
                              onClick={() => handleDownload(doc.id, doc.fileName)}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              type="button" 
                              onClick={() => removeFile(doc.id)}
                              className="bg-red-50 border-red-200 text-red-700 hover:bg-red-100 hover:text-red-800"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {storedDocuments.length === 0 && isUserLoggedIn() && (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      No Active Documents
                    </h3>
                    <p className="text-muted-foreground">
                      Upload your first document to get started
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </form>

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