import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Affinda Service
 * Handles resume parsing using the Affinda API
 * API Documentation: https://api.affinda.com/docs
 */
class AffindaService {
  constructor() {
    this.apiKey = process.env.AFFINDA_API_KEY;
    this.baseUrl = 'https://api.affinda.com/v2'; // Using v2 API
    
    if (!this.apiKey) {
      console.error('⚠️  WARNING: AFFINDA_API_KEY is not set in environment variables');
      console.error('Please add AFFINDA_API_KEY to your .env file');
    }
  }

  /**
   * Parse a resume file using Affinda API
   * @param {string} filePath - Path to the resume file
   * @returns {Promise<Object>} Parsed resume data
   */
  async parseResume(filePath) {
    try {
      // Validate API key
      if (!this.apiKey) {
        throw new Error('Affinda API key is not configured. Please add AFFINDA_API_KEY to your .env file');
      }

      // Check if file exists
      if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
      }

      // Get file stats
      const stats = fs.statSync(filePath);
      console.log(`📄 Preparing to parse resume: ${filePath} (${(stats.size / 1024).toFixed(2)} KB)`);

      // Create form data with the file
      const formData = new FormData();
      formData.append('file', fs.createReadStream(filePath));
      formData.append('wait', 'true'); // Wait for parsing to complete

      console.log('🚀 Sending resume to Affinda API for parsing...');

      // Make API request using v2 endpoint
      const response = await axios.post(
        `${this.baseUrl}/resumes`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            ...formData.getHeaders()
          },
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
          timeout: 60000 // 60 second timeout for parsing
        }
      );

      console.log('✅ Affinda API response received successfully');
      return this.extractResumeData(response.data);

    } catch (error) {
      console.error('❌ Error parsing resume with Affinda:', error.message);
      
      if (error.response) {
        // API returned an error response
        console.error('API Error Status:', error.response.status);
        console.error('API Error Data:', JSON.stringify(error.response.data, null, 2));
        
        if (error.response.status === 401) {
          throw new Error('Invalid Affinda API key. Please check your AFFINDA_API_KEY in .env file');
        } else if (error.response.status === 429) {
          throw new Error('Affinda API rate limit exceeded. Please try again later');
        } else {
          throw new Error(`Affinda API Error: ${error.response.data.message || error.response.statusText}`);
        }
      } else if (error.request) {
        // Request made but no response received
        throw new Error('No response from Affinda API - check your internet connection');
      } else {
        // Other errors
        throw error;
      }
    }
  }

  /**
   * Extract and structure relevant data from Affinda response
   * @param {Object} affindaData - Raw Affinda API response
   * @returns {Object} Structured resume data
   */
  extractResumeData(affindaData) {
    const data = affindaData.data || {};

    console.log('📊 Extracting structured data from Affinda response...');

    const extractedData = {
      // Personal Information
      name: data.name?.raw || '',
      email: data.emails?.[0] || '',
      phone: data.phoneNumbers?.[0] || '',
      location: data.location?.formatted || '',
      dateOfBirth: data.dateOfBirth || null,
      
      // Professional Summary
      summary: data.summary || '',
      objective: data.objective || '',
      
      // Skills (array of skill objects)
      skills: (data.skills || []).map(skill => ({
        name: skill.name || skill,
        type: skill.type || 'general',
        proficiency: skill.proficiency || null
      })),
      
      // Work Experience
      workExperience: (data.workExperience || []).map(exp => ({
        jobTitle: exp.jobTitle || '',
        organization: exp.organization || '',
        location: exp.location?.formatted || '',
        startDate: exp.dates?.startDate || null,
        endDate: exp.dates?.endDate || null,
        isCurrent: exp.dates?.isCurrent || false,
        description: exp.jobDescription || '',
        achievements: exp.achievements || []
      })),
      
      // Education
      education: (data.education || []).map(edu => ({
        institution: edu.organization || '',
        degree: edu.accreditation?.education || '',
        field: edu.accreditation?.educationLevel || '',
        grade: edu.grade?.value || '',
        startDate: edu.dates?.startDate || null,
        endDate: edu.dates?.completionDate || null,
        description: edu.description || ''
      })),
      
      // Certifications
      certifications: (data.certifications || []).map(cert => ({
        name: cert.name || '',
        organization: cert.organization || '',
        date: cert.date || null
      })),
      
      // Languages
      languages: (data.languages || []).map(lang => ({
        language: lang.name || lang,
        proficiency: lang.proficiency || null
      })),
      
      // Additional Information
      totalYearsExperience: data.totalYearsExperience || 0,
      websites: data.websites || [],
      linkedin: data.linkedin || '',
      github: data.github || '',
      
      // Metadata
      parsedAt: new Date().toISOString(),
      affindaDocumentId: affindaData.identifier || null,
      
      // Raw data for reference (optional)
      rawData: affindaData
    };

    // Log summary of extracted data
    console.log(`✅ Successfully extracted:`);
    console.log(`   - Name: ${extractedData.name}`);
    console.log(`   - Email: ${extractedData.email}`);
    console.log(`   - Skills: ${extractedData.skills.length} found`);
    console.log(`   - Work Experience: ${extractedData.workExperience.length} positions`);
    console.log(`   - Education: ${extractedData.education.length} entries`);
    console.log(`   - Years of Experience: ${extractedData.totalYearsExperience}`);

    return extractedData;
  }

  /**
   * Validate if API key is configured
   * @returns {boolean}
   */
  isConfigured() {
    return !!this.apiKey;
  }

  /**
   * Test API connection
   * @returns {Promise<boolean>}
   */
  async testConnection() {
    try {
      if (!this.apiKey) {
        console.error('❌ API key not configured');
        return false;
      }

      console.log('🔍 Testing Affinda API connection...');
      
      // Test with a simple GET request to resumes endpoint
      await axios.get(`${this.baseUrl}/resumes`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        },
        params: {
          limit: 1
        }
      });

      console.log('✅ Affinda API connection successful');
      return true;
    } catch (error) {
      console.error('❌ Affinda API connection failed:', error.message);
      return false;
    }
  }
}

// Export a singleton instance
export default new AffindaService();
