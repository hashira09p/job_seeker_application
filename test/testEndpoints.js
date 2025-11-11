import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Test different Affinda API endpoints to find the correct one
 */
async function testEndpoints() {
  const apiKey = process.env.AFFINDA_API_KEY;
  const testFile = path.join(process.cwd(), 'uploads', 'resumes', '1762185258031.docx');
  
  console.log('\n🔍 Testing different Affinda API endpoints...\n');
  console.log('API Key:', apiKey.substring(0, 10) + '...');
  console.log('File:', testFile);
  console.log('='.repeat(60));
  
  const endpoints = [
    { name: 'v3/resumes', url: 'https://api.affinda.com/v3/resumes' },
    { name: 'v3/documents', url: 'https://api.affinda.com/v3/documents' },
    { name: 'v3/resume_redactor', url: 'https://api.affinda.com/v3/resume_redactor' },
    { name: 'v2/resumes', url: 'https://api.affinda.com/v2/resumes' }
  ];
  
  for (const endpoint of endpoints) {
    try {
      console.log(`\n📡 Testing: ${endpoint.name}`);
      console.log(`   URL: ${endpoint.url}`);
      
      const formData = new FormData();
      formData.append('file', fs.createReadStream(testFile));
      formData.append('wait', 'true');
      
      const response = await axios.post(endpoint.url, formData, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          ...formData.getHeaders()
        },
        timeout: 10000
      });
      
      console.log(`   ✅ SUCCESS!`);
      console.log(`   Status: ${response.status}`);
      console.log(`   Response type: ${typeof response.data}`);
      console.log(`\n🎉 WORKING ENDPOINT FOUND: ${endpoint.url}\n`);
      
      // Save response for inspection
      fs.writeFileSync('test/endpoint_response.json', JSON.stringify(response.data, null, 2));
      console.log('Response saved to: test/endpoint_response.json\n');
      break;
      
    } catch (error) {
      console.log(`   ❌ Failed: ${error.response?.status || error.message}`);
      if (error.response?.data) {
        console.log(`   Error: ${JSON.stringify(error.response.data)}`);
      }
    }
  }
  
  console.log('\n' + '='.repeat(60));
}

testEndpoints();
