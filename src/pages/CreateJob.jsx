```tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // if using React Router
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface JobPosting {
  id: number;
  title: string;
  description: string;
  location: string;
  type: string;
  salaryRange: string;
}

export default function JobPostingFormPage() {
  const navigate = useNavigate(); // for redirecting after submit
  const [formData, setFormData] = useState<JobPosting>({
    id: Date.now(),
    title: "",
    description: "",
    location: "",
    type: "Full-time",
    salaryRange: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 👉 Save to backend or state management here
    console.log("New Job Posting:", formData);

    // Example: send to API
    // fetch("/api/jobs", { method: "POST", body: JSON.stringify(formData) })

    // After saving, go back to dashboard
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <Card className="shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Create Job Posting</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="title">Job Title</Label>
                <Input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="e.g. Frontend Developer"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Job Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Write a detailed job description"
                  rows={5}
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  type="text"
                  id="location"
                  name="location"
                  placeholder="e.g. Manila, Remote"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="type">Job Type</Label>
                <Select value={formData.type} onValueChange={(val) => handleSelectChange("type", val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Remote">Remote</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="salaryRange">Salary Range</Label>
                <Input
                  type="text"
                  id="salaryRange"
                  name="salaryRange"
                  placeholder="e.g. ₱40,000 - ₱60,000"
                  value={formData.salaryRange}
                  onChange={handleChange}
                />
              </div>

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => navigate("/dashboard")}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                  Save Job Posting
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

