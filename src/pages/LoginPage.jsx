import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, ArrowLeft } from 'lucide-react'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Breadcrumb from '@/components/Breadcrumb'
import { useAuth } from '@/contexts/AuthContext'
import { useState } from 'react'
import axios from "axios"


function LoginPage() {
  const URL = "http://localhost:3000";
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try{
      const result = await axios.post(`${URL}/submit-login`,{
        email: formData.email,
        password: formData.password
      });

      const data = result.data
      if(data.role == "User"){
        localStorage.setItem("token", data.token);
        console.log(data)
        alert("Login Success")
        navigate("/");
      }else{
        alert("Login Success")
        navigate("/company-dashboard");
        localStorage.setItem("token", data.token);
      }
    }catch(err){
      console.log(err.response.data.message);

      if(err.response.data.message == "unregistered"){
        alert("Your account is not registered yet! Please register first!")
        navigate("/signup")
      }else{
        alert("Wrong Password")
        navigate("/login")
      }
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

            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
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
