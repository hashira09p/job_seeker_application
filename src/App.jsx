import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import PesoPage from './pages/PesoPage'
import AboutPage from './pages/AboutPage'
import UsersGuidePage from './pages/UsersGuidePage'
import JobFairsPage from './pages/JobFairsPage'
import JobsPage from './pages/JobsPage'
import CompaniesPage from './pages/CompaniesPage'
import AdminPage from './pages/AdminPage'
import ResumeUploadPage from './pages/ResumeUploadPage'
import CompanyDashboardPage from './pages/CompanyDashboardPage'



function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-background">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/peso" element={<PesoPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/users-guide" element={<UsersGuidePage />} />
            <Route path="/job-fairs" element={<JobFairsPage />} />
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/companies" element={<CompaniesPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/upload-resume" element={<ResumeUploadPage />} />
            <Route path="/company-dashboard" element={<CompanyDashboardPage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

 


export default App