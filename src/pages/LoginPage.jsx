import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, ArrowLeft, AlertCircle, CheckCircle, Clock } from 'lucide-react'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Breadcrumb from '@/components/Breadcrumb'
import { useAuth } from '@/contexts/AuthContext'
import { useState, useEffect } from 'react'
import axios from "axios"

function LoginPage() {
  const URL = "http://localhost:3000";
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const token = localStorage.getItem("token")
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [approvalStatus, setApprovalStatus] = useState(null);

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
      [e.target.name]:e.target.value
    })
    // Clear errors when user starts typing
    if (error) {
      setError('');
    }
    if (approvalStatus) {
      setApprovalStatus(null);
    }
  }

  // Approval Status Notification Component
  const ApprovalNotification = ({ status }) => {
    if (!status) return null;

    const statusConfig = {
      underReview: {
        icon: Clock,
        title: "Account Under Review",
        message: "Your employer account is currently under review by our administration team. This process typically takes 1-2 business days. You will receive an email notification once your account has been approved.",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
        textColor: "text-blue-800",
        iconColor: "text-blue-500"
      },
      approved: {
        icon: CheckCircle,
        title: "Account Approved",
        message: "Your employer account has been approved! You can now access all employer features.",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        textColor: "text-green-800",
        iconColor: "text-green-500"
      },
      rejected: {
        icon: AlertCircle,
        title: "Account Not Approved",
        message: "Your employer account application requires additional verification. Please contact our support team for more information.",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        textColor: "text-red-800",
        iconColor: "text-red-500"
      }
    };

    const config = statusConfig[status] || statusConfig.underReview;
    const IconComponent = config.icon;

    return (
      <div className={`${config.bgColor} ${config.borderColor} border rounded-lg p-4 mb-6`}>
        <div className="flex items-start gap-3">
          <IconComponent className={`${config.iconColor} mt-0.5 flex-shrink-0`} size={20} />
          <div className="flex-1">
            <h3 className={`${config.textColor} font-semibold text-sm mb-1`}>
              {config.title}
            </h3>
            <p className={`${config.textColor} text-sm`}>
              {config.message}
            </p>
          </div>
        </div>
      </div>
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setApprovalStatus(null);

    try {
      const result = await axios.post(`${URL}/submit-login`, {
        email: formData.email,
        password: formData.password
      });

      const data = result.data;
      
      // Check if employer account is under review
      if (data.role === "Employer" && data.approved === "underReview") {
        setApprovalStatus("underReview");
        setLoading(false);
        return;
      }

      // Check if employer account is rejected or not approved
      if (data.role === "Employer" && data.approved !== "pass" && data.approved !== "approved") {
        setApprovalStatus("rejected");
        setLoading(false);
        return;
      }

      // Successful login for approved accounts
      localStorage.setItem("token", data.token);
      
      if (data.role === "JobSeeker") {
        console.log(data);
        alert("Login Success");
        navigate("/");
      } else if (data.role === "Employer") {
        alert("Login Success");
        navigate("/company-dashboard");
      } else if (data.role === "Admin") {
        alert("Login Success");
        navigate("/admin-dashboard");
      }
      
    } catch (err) {
      console.log(err.response?.data?.message);
      
      if (err.response?.data?.message === "unregistered") {
        setError("Your account is not registered yet! Please register first!");
      } else if (err.response?.data?.message === "wrong password") {
        setError("Wrong password. Please try again.");
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Breadcrumb />

      <div className="flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">

          {/* Login Card */}
          <div className="bg-card rounded-lg shadow-xl p-8 border relative">
            {/* Sign Up Link - Top Right */}
            <div className="absolute top-6 right-6">
              <Link to="/signup" className="text-primary hover:text-primary/80 hover:underline font-medium transition-colors">
                Sign Up
              </Link>
            </div>

            <div className="mb-8">
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Login to your account
              </h1>
              <p className="text-muted-foreground">
                Enter your email below to login to your account
              </p>
            </div>

            {/* Approval Status Notification */}
            <ApprovalNotification status={approvalStatus} />

            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                {error}
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                  Email
                </label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="m@example.com"
                />
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="password" className="block text-sm font-medium text-foreground">
                    Password
                  </label>
                  <a href="#" className="text-sm text-primary hover:text-primary/80 hover:underline transition-colors">
                    Forgot your password?
                  </a>
                </div>
                <Input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                />
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                className="w-full py-3 bg-secondary text-secondary-foreground hover:bg-secondary/80"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </form>

            {/* Divider */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-card text-muted-foreground">Or continue with</span>
                </div>
              </div>
            </div>

            {/* Social Login Buttons */}
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
                  Log in with Google
                </a>
              </Button>
              <Button variant="outline" className="w-full">
                <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Login with Facebook
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default LoginPage