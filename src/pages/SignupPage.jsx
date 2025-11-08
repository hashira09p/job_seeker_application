import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, Phone, Building, ArrowLeft, Upload } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import axios from "axios";
import { useEffect, useState } from "react";

function SignupPage() {
  const URL = "http://localhost:3000";
  const navigate = useNavigate();
  const token = localStorage.getItem("token")

  const [role, setRole] = useState("None");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    description: "",
    companyName: "",
    email: "",
    password: "",
    role: "",
    industry: "",
    website: "",
    arrangement: ""
  });
  const [document, setDocument] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    async function authenticate() {
      if (token){
        navigate("/")
      }
    }

    authenticate()
  }, [])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear errors when user starts typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ""
      });
    }
  };

  const handleDocumentChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setDocument(e.target.files[0]);
      // Clear document error when file is selected
      if (errors.document) {
        setErrors({
          ...errors,
          document: ""
        });
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Basic validation for all fields
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";

    // Employer-specific validation
    if (formData.role === "Employer") {
      if (!formData.companyName) newErrors.companyName = "Company name is required";
      if (!formData.industry) newErrors.industry = "Industry is required";
      if (!formData.arrangement) newErrors.arrangement = "Arrangement is required";
      if (!document) newErrors.document = "Company document is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setUploading(true);
    
    try {
      // Create FormData to handle file upload
      const submitData = new FormData();
      
      // Append all form fields
      Object.keys(formData).forEach(key => {
        submitData.append(key, formData[key]);
      });
      
      // Append document if exists (required for employers)
      if (document) {
        submitData.append('document', document);
      }

      const result = await axios({
        url: `${URL}/submit-signup`,
        method: "post",
        data: submitData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log(result);
      navigate("/login");
    } catch (err) {
      console.log(err.message);
      if (err.response?.data?.message) {
        setErrors({ submit: err.response.data.message });
      }
    } finally {
      setUploading(false);
    }
  };

  const roleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.role) {
      setErrors({ role: "Please select a role" });
      return;
    }
    setRole(formData.role);
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Breadcrumb />

      {role === "None" ? (
        <div className="flex items-center justify-center px-4 py-16">
          <div className="w-full max-w-md">
            <div className="bg-card rounded-lg shadow-xl p-8 border relative">
              <div className="absolute top-6 right-6">
                <Link
                  to="/login"
                  className="text-primary hover:text-primary/80 hover:underline font-medium transition-colors"
                >
                  Sign In
                </Link>
              </div>

              <div className="mb-8">
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  Create your account
                </h1>
                <p className="text-muted-foreground">
                  Are you an User or Employer?
                </p>
              </div>

              <form className="space-y-6" onSubmit={roleSubmit}>
                <div>
                  <label
                    htmlFor="role"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Role *
                  </label>
                  <select
                    id="role"
                    name="role"
                    required
                    className={`w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.role ? "border-red-500" : "border-gray-300"
                    }`}
                    onChange={handleChange}
                    value={formData.role}
                  >
                    <option value="">Select a role</option>
                    <option value="JobSeeker">Job Seeker</option>
                    <option value="Employer">Employer</option>
                  </select>
                  {errors.role && (
                    <p className="text-red-500 text-xs mt-1">{errors.role}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full py-3 bg-secondary text-secondary-foreground hover:bg-secondary/80"
                >
                  Submit
                </Button>
              </form>
            </div>
          </div>
        </div>
      ) : role == "JobSeeker" ? (
        <div className="flex items-center justify-center px-4 py-16">
          <div className="w-full max-w-md">
            <div className="bg-card rounded-lg shadow-xl p-8 border relative">
              <div className="absolute top-6 right-6">
                <Link
                  to="/login"
                  className="text-primary hover:text-primary/80 hover:underline font-medium transition-colors"
                >
                  Sign In
                </Link>
              </div>

              <div className="mb-8">
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  Create your account
                </h1>
                <p className="text-muted-foreground">
                  Create your account as "Job Seeker"
                </p>
              </div>

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="first-name"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      First Name *
                    </label>
                    <Input
                      type="text"
                      id="first-name"
                      name="firstName"
                      required
                      placeholder="Enter your first name"
                      onChange={handleChange}
                      value={formData.firstName}
                      className={errors.firstName ? "border-red-500" : ""}
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="lastname"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      Last Name *
                    </label>
                    <Input
                      type="text"
                      id="last-name"
                      name="lastName"
                      required
                      placeholder="Enter your last name"
                      onChange={handleChange}
                      value={formData.lastName}
                      className={errors.lastName ? "border-red-500" : ""}
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Email *
                  </label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    required
                    placeholder="m@example.com"
                    onChange={handleChange}
                    value={formData.email}
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Password *
                  </label>
                  <Input
                    type="password"
                    id="password"
                    name="password"
                    required
                    placeholder="Create a password"
                    onChange={handleChange}
                    value={formData.password}
                    className={errors.password ? "border-red-500" : ""}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                  )}
                </div>

                <div className="flex items-start">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    required
                    className="h-4 w-4 text-primary focus:ring-ring border-input rounded mt-1"
                  />
                  <label
                    htmlFor="terms"
                    className="ml-2 block text-sm text-foreground"
                  >
                    I agree to the{" "}
                    <a
                      href="#"
                      className="text-primary hover:text-primary/80 hover:underline transition-colors"
                    >
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a
                      href="#"
                      className="text-primary hover:text-primary/80 hover:underline transition-colors"
                    >
                      Privacy Policy
                    </a>
                  </label>
                </div>

                {errors.submit && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-3">
                    <p className="text-red-600 text-sm">{errors.submit}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full py-3 bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  disabled={uploading}
                >
                  {uploading ? "Creating Account..." : "Create Account"}
                </Button>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-card text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <Button variant="outline" className="w-full">
                  <a href={`${URL}/auth/google`}>
                    <svg className="h-5 w-5 mr-2 inline-block" viewBox="0 1 30 30">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Sign up with Google
                  </a>
                </Button>
                <Button variant="outline" className="w-full">
                  <svg
                    className="h-5 w-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Sign up with Facebook
                </Button>
              </div>
            </div>
          </div>
        </div>
      ): (
        <div className="flex items-center justify-center px-4 py-16">
          <div className="w-full max-w-md">
            <div className="bg-card rounded-lg shadow-xl p-8 border relative">
              <div className="absolute top-6 right-6">
                <Link
                  to="/login"
                  className="text-primary hover:text-primary/80 hover:underline font-medium transition-colors"
                >
                  Sign In
                </Link>
              </div>

              <div className="mb-8">
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  Create your account
                </h1>
                <p className="text-muted-foreground">
                  Create your account as "Employer"
                </p>
              </div>

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      Email *
                    </label>
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      required
                      placeholder="Enter your company email"
                      onChange={handleChange}
                      value={formData.email}
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      Password *
                    </label>
                    <Input
                      type="password"
                      id="password"
                      name="password"
                      required
                      placeholder="Create a password"
                      onChange={handleChange}
                      value={formData.password}
                      className={errors.password ? "border-red-500" : ""}
                    />
                    {errors.password && (
                      <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="first-name"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      First Name *
                    </label>
                    <Input
                      type="text"
                      id="first-name"
                      name="firstName"
                      required
                      placeholder="Enter your first name"
                      onChange={handleChange}
                      value={formData.firstName}
                      className={errors.firstName ? "border-red-500" : ""}
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="lastname"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      Last Name *
                    </label>
                    <Input
                      type="text"
                      id="last-name"
                      name="lastName"
                      required
                      placeholder="Enter your last name"
                      onChange={handleChange}
                      value={formData.lastName}
                      className={errors.lastName ? "border-red-500" : ""}
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="companyName"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Company Name *
                  </label>
                  <Input
                    type="text"
                    id="company-name"
                    name="companyName"
                    required
                    placeholder="Input your company"
                    onChange={handleChange}
                    value={formData.companyName}
                    className={errors.companyName ? "border-red-500" : ""}
                  />
                  {errors.companyName && (
                    <p className="text-red-500 text-xs mt-1">{errors.companyName}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Description
                  </label>
                  <Input
                    type="text"
                    id="description"
                    name="description"
                    placeholder="Describe your company (optional)"
                    onChange={handleChange}
                    value={formData.description}
                  />
                </div>
                
                <div>
                  <label
                    htmlFor="industry"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Industry *
                  </label>
                  <Input
                    type="text"
                    id="industry"
                    name="industry"
                    placeholder="ex. IT, Utilites, .etc"
                    required
                    onChange={handleChange}
                    value={formData.industry}
                    className={errors.industry ? "border-red-500" : ""}
                  />
                  {errors.industry && (
                    <p className="text-red-500 text-xs mt-1">{errors.industry}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="website"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Website
                  </label>
                  <Input
                    type="text"
                    id="website"
                    name="website"
                    placeholder="ex. www.website.com (optional)"
                    onChange={handleChange}
                    value={formData.website}
                  />
                </div>

                <div>
                  <label
                    htmlFor="arrangement"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Arrangement *
                  </label>
                  <select
                    id="arrangement"
                    name="arrangement"
                    required
                    className={`w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.arrangement ? "border-red-500" : "border-gray-300"
                    }`}
                    onChange={handleChange}
                    value={formData.arrangement}
                  >
                    <option value="">Select an arrangement</option>
                    <option value="On-site">On-site</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Remote">Remote</option>
                    <option value="Flexible">Flexible</option>
                  </select>
                  {errors.arrangement && (
                    <p className="text-red-500 text-xs mt-1">{errors.arrangement}</p>
                  )}
                </div>

                {/* Document Upload Field for Employers - REQUIRED */}
                <div>
                  <label
                    htmlFor="document"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Company Document *
                  </label>
                  <div className="flex items-center gap-4">
                    <Input
                      type="file"
                      id="document"
                      name="document"
                      required
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={handleDocumentChange}
                      className={`flex-1 ${errors.document ? "border-red-500" : ""}`}
                    />
                    {document && (
                      <span className="text-sm text-green-600">
                        ✓ {document.name}
                      </span>
                    )}
                  </div>
                  {errors.document && (
                    <p className="text-red-500 text-xs mt-1">{errors.document}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    Upload company registration document, license, or other relevant files (PDF, DOC, JPG, PNG)
                  </p>
                </div>

                <div className="flex items-start">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    required
                    className="h-4 w-4 text-primary focus:ring-ring border-input rounded mt-1"
                  />
                  <label
                    htmlFor="terms"
                    className="ml-2 block text-sm text-foreground"
                  >
                    I agree to the{" "}
                    <a
                      href="#"
                      className="text-primary hover:text-primary/80 hover:underline transition-colors"
                    >
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a
                      href="#"
                      className="text-primary hover:text-primary/80 hover:underline transition-colors"
                    >
                      Privacy Policy
                    </a>
                  </label>
                </div>

                {errors.submit && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-3">
                    <p className="text-red-600 text-sm">{errors.submit}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full py-3 bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  disabled={uploading}
                >
                  {uploading ? "Creating Account..." : "Create Account"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}

export default SignupPage;