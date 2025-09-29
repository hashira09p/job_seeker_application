import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Combobox } from "@/components/ui/combobox"
import { Search, MapPin } from "lucide-react"
import Navigation from "@/components/Navigation"
import Footer from "@/components/Footer"
import Breadcrumb from "@/components/Breadcrumb"
import { useEffect, useState } from "react"
import axios from "axios"

function CompaniesPage() {
  const [industry, setIndustry] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [search, setSearch] = useState("")
  const URL = "http://localhost:3000"
  const [dataFromDB, setDataFromDB] = useState([])

  useEffect(() => {
    async function getData() {
      try {
        const freshData = await axios.get(`${URL}/companies`)
        setDataFromDB(freshData.data.result)
      } catch (err) {
        console.log(err.message)
      }
    }
    getData()
  }, [])

  // --- Filtering logic ---
  const filteredCompanies = dataFromDB
    .filter(
      (c) =>
        (!industry || (c.industry && c.industry === industry)) &&
        (!search ||
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          (c.industry && c.industry.toLowerCase().includes(search.toLowerCase())))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "name-desc":
          return b.name.localeCompare(a.name)
        default:
          return 0
      }
    })

  // --- Options ---
  const industryOptions = [
    { value: "technology", label: "Technology" },
    { value: "healthcare", label: "Healthcare" },
    { value: "finance", label: "Finance & Banking" },
    { value: "education", label: "Education" },
    { value: "energy", label: "Energy & Utilities" }
  ]

  const sortOptions = [
    { value: "name", label: "Name A-Z" },
    { value: "name-desc", label: "Name Z-A" }
  ]

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f9f9f9" }}>
      <Navigation />
      <Breadcrumb />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* SEARCH + FILTERS */}
        <Card className="shadow-lg border-0 mb-16">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" />
              Search Companies
            </CardTitle>
            <CardDescription>
              Find companies that match your career goals and values
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-8">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <Input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Company name, industry, or keywords"
                    className="pl-10 h-12 text-lg"
                  />
                </div>
              </div>
            </div>

            <div className="border-t pt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Industry
                </label>
                <Combobox
                  options={industryOptions}
                  value={industry}
                  onValueChange={setIndustry}
                  placeholder="All Industries"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* RESULTS */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Featured Companies</h2>
              <p className="text-muted-foreground">
                Showing {filteredCompanies.length} results
              </p>
            </div>
            <div className="w-full sm:w-48">
              <Combobox
                options={sortOptions}
                value={sortBy}
                onValueChange={setSortBy}
                placeholder="Sort by"
              />
            </div>
          </div>

          {filteredCompanies.length === 0 ? (
            <Card className="shadow-lg border-0">
              <CardContent className="text-center py-12">
                <h3 className="text-xl font-semibold mb-2">No Companies Found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search criteria or filters.
                </p>
                <Button
                  onClick={() => {
                    setIndustry("")
                    setSearch("")
                  }}
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCompanies.map((c) => (
                <Card
                  key={c.id}
                  className="shadow-md border-0 hover:shadow-lg transition"
                >
                  <CardHeader>
                    <CardTitle>{c.name}</CardTitle>
                    <CardDescription>{c.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Industry: {c.industry || "N/A"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Website: {c.website || "N/A"}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default CompaniesPage