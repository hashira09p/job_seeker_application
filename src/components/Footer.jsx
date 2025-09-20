import logoImage from '@/assets/logo.png'

function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <img 
                src={logoImage} 
                alt="Una sa Trabaho Logo" 
                className="w-8 h-8 mr-2 object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <h3 className="text-lg font-semibold text-foreground">Una sa Trabaho</h3>
            </div>
            <p className="text-muted-foreground">
              Connecting talented professionals with amazing opportunities.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">For Job Seekers</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Browse Jobs</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Create Profile</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Job Alerts</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">For Employers</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Post a Job</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Browse Candidates</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Pricing</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Help Center</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-muted-foreground">
            © 2025 Una sa Trabaho. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
