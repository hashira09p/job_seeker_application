import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Shield, AlertTriangle, Server, Key, Eye, EyeOff, UserPlus, User } from 'lucide-react'
import { useState } from 'react'
import axios from "axios"

function AdminLoginPage() {
  const URL = "http://localhost:4000";
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    adminKey: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  // Add this function to validate form
  const isFormValid = () => {
    if (isRegistering) {
      return formData.firstName && formData.lastName && formData.email && formData.password && formData.adminKey;
    } else {
      return formData.email && formData.password;
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    // Clear error when user starts typing
    if (error) setError('');
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log('Login button clicked');
    console.log('Form data:', { ...formData, password: '[HIDDEN]' });
    setLoading(true);
    setError('');

    // Basic validation
    if (!formData.email || !formData.password) {
      setError("Please enter both email and password");
      setLoading(false);
      return;
    }

    try {
      const result = await axios.post(`${URL}/admin-login`, {
        email: formData.email,
        password: formData.password
      });

      const data = result.data
      if (data.role === "Admin") {
        localStorage.setItem("adminToken", data.token);
        console.log("Admin login successful:", data)
        
        // Redirect to admin dashboard
        navigate("/admin");
      } else {
        setError("Access denied. Administrator privileges required.");
      }
    } catch (err) {
      console.log("Login error:", err);
      const errorMessage = err.response?.data?.message;

      setError(errorMessage)
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    console.log('Register button clicked');
    console.log('Form data:', { ...formData, password: '[HIDDEN]' });
    setLoading(true);
    setError('');

    console.log("Registration attempt with data:", {
      ...formData,
      password: '[HIDDEN]'
    });

    // Basic validation - only check if fields are filled
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.adminKey) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      console.log("Sending registration request to:", `${URL}/admin-register`);
      
      // Combine first and last name for fullName
      const fullName = `${formData.firstName} ${formData.lastName}`;
      
      const result = await axios.post(`${URL}/admin-register`, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        role: "Admin",
        adminKey: formData.adminKey 
      });

      console.log("Registration response:", result.data);

      const data = result.data
      if (data.success || data.user) {
        alert("Admin account created successfully! Please login with your new credentials.");
        setIsRegistering(false);
        // Reset form
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          adminKey: ""
        });
      }
    } catch (err) {
      console.log("Registration error:", err);
      console.log("Error response:", err.response);
      
      const errorMessage = err.response?.data?.message;
      const statusCode = err.response?.status;

      setError(errorMessage)
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    setError('');
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      adminKey: ""
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Security Header */}
      <div className="border-b border-gray-700 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-400" />
              <span className="text-sm font-medium text-green-400">Secure Admin Portal</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <div className="flex items-center gap-1">
                <Server className="h-3 w-3" />
                <span>Development</span>
              </div>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4 py-8">
        <div className="w-full max-w-md">
          {/* Login Card */}
          <div className="bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-gray-700 relative overflow-hidden">
            {/* Security Pattern Background */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600"></div>
            </div>
            
            {/* Header */}
            <div className="text-center mb-8 relative z-10">
              <div className={`w-20 h-20 ${
                isRegistering 
                  ? 'bg-gradient-to-br from-blue-500 to-purple-600' 
                  : 'bg-gradient-to-br from-red-500 to-orange-500'
              } rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg border ${
                isRegistering ? 'border-blue-400' : 'border-red-400'
              }`}>
                {isRegistering ? (
                  <UserPlus className="h-10 w-10 text-white" />
                ) : (
                  <Shield className="h-10 w-10 text-white" />
                )}
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {isRegistering ? 'Admin Registration' : 'Admin Portal'}
              </h1>
              <p className="text-gray-400">
                {isRegistering 
                  ? 'Register new administrator account' 
                  : 'Secure system administration access'
                }
              </p>
            </div>

            {/* Development Notice */}
            {isRegistering && (
              <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <div className="flex items-start gap-3">
                  <Server className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="text-blue-400 font-medium">Development Mode</p>
                    <p className="text-blue-300/80 mt-1">
                      For testing, any admin key will be accepted. Registration uses regular user endpoints.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Security Notice */}
            <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="text-yellow-400 font-medium">Restricted Access</p>
                  <p className="text-yellow-300/80 mt-1">
                    {isRegistering 
                      ? 'Admin registration requires valid registration key. All accounts are monitored.'
                      : 'This area is for authorized personnel only. All activities are monitored and logged.'
                    }
                  </p>
                </div>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <div className="flex items-center gap-2 text-red-400">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <span className="text-sm font-medium">{error}</span>
                </div>
              </div>
            )}

            <form className="space-y-6 relative z-10" onSubmit={isRegistering ? handleRegister : handleLogin}>
              
              {/* First Name and Last Name Fields (Registration Only) */}
              {isRegistering && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-300">
                      First Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <Input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        placeholder="First name"
                        className="pl-10 h-12 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-300">
                      Last Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <Input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        placeholder="Last name"
                        className="pl-10 h-12 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                  Admin Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="admin@careerconnect.com"
                    className="pl-10 h-12 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                    {isRegistering ? 'Create Password' : 'Admin Password'}
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-sm text-gray-400 hover:text-gray-300 transition-colors flex items-center gap-1"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder={isRegistering ? "Create secure password" : "Enter admin password"}
                    className="pl-10 pr-10 h-12 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <Key className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                </div>
              </div>

              {/* Admin Key Field (Registration Only) */}
              {isRegistering && (
                <div className="space-y-2">
                  <label htmlFor="adminKey" className="block text-sm font-medium text-gray-300">
                    Registration Key
                  </label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      type="text"
                      id="adminKey"
                      name="adminKey"
                      value={formData.adminKey}
                      onChange={handleChange}
                      required
                      placeholder="Enter any key for testing"
                      className="pl-10 h-12 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}

              {/* Security Check */}
              <div className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg border border-gray-600">
                <input
                  type="checkbox"
                  id="security-check"
                  required
                  className={`w-4 h-4 ${
                    isRegistering ? 'text-blue-500' : 'text-red-500'
                  } bg-gray-600 border-gray-500 rounded focus:ring-2 ${
                    isRegistering ? 'focus:ring-blue-500' : 'focus:ring-red-500'
                  }`}
                />
                <label htmlFor="security-check" className="text-sm text-gray-300">
                  {isRegistering 
                    ? "I acknowledge that I am authorized to create an admin account"
                    : "I acknowledge that I am an authorized administrator"
                  }
                </label>
              </div>

              {/* Submit Button - FIXED VERSION */}
              <Button
                type="submit"
                className={`w-full h-12 ${
                  isRegistering
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-blue-500/30'
                    : 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 border-red-500/30'
                } text-white font-semibold text-base rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 border`}
                disabled={loading || !isFormValid()}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {isRegistering ? 'Creating Account...' : 'Authenticating...'}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    {isRegistering ? <UserPlus className="h-5 w-5" /> : <Shield className="h-5 w-5" />}
                    {isRegistering ? 'Create Admin Account' : 'Access Admin Dashboard'}
                  </div>
                )}
              </Button>
            </form>

            {/* Toggle Between Login and Register */}
            <div className="mt-6 text-center">
              <button
                onClick={toggleMode}
                className="text-blue-400 hover:text-blue-300 text-sm font-medium hover:underline transition-colors relative z-50"
              >
                {isRegistering 
                  ? '← Already have an admin account? Login here'
                  : 'Need an admin account? Register here →'
                }
              </button>
            </div>

            {/* Footer Links */}
            <div className="mt-6 pt-6 border-t border-gray-700 space-y-3 text-center relative z-50">
              <div>
                <Link 
                  to="/login" 
                  className="text-blue-400 hover:text-blue-300 text-sm font-medium hover:underline transition-colors relative z-50"
                >
                  ← Back to User Login
                </Link>
              </div>
              
              <div className="text-xs text-gray-500 space-y-1">
                <p>CareerConnect Administration System v2.1</p>
                <p>All access attempts are logged for security purposes</p>
              </div>
            </div>

            {/* Security Badge */}
            <div className="absolute bottom-4 right-4">
              <div className="flex items-center gap-1 text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded border border-green-400/20">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                SSL Secured
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="mt-6 grid grid-cols-3 gap-4 text-center">
            <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
              <div className="text-xs text-gray-400 mb-1">Database</div>
              <div className="flex items-center justify-center gap-1 text-green-400">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                <span className="text-sm font-medium">Online</span>
              </div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
              <div className="text-xs text-gray-400 mb-1">API</div>
              <div className="flex items-center justify-center gap-1 text-green-400">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                <span className="text-sm font-medium">Online</span>
              </div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
              <div className="text-xs text-gray-400 mb-1">Admin Auth</div>
              <div className="flex items-center justify-center gap-1 text-green-400">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                <span className="text-sm font-medium">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Global Footer */}
      <div className="border-t border-gray-800 bg-black/20">
        <div className="container mx-auto px-4 py-4">
          <div className="text-center text-xs text-gray-500">
            <p>© 2024 CareerConnect Admin System. Restricted Access.</p>
            <p className="mt-1">Unauthorized access is prohibited and may be subject to legal action.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminLoginPage