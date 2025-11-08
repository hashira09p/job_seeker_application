import affindaService from '../services/affindaService.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Get current directory in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Test script for Affinda API integration
 * 
 * Usage:
 * 1. Make sure you have AFFINDA_API_KEY in your .env file
 * 2. Place a sample resume (PDF, DOC, or DOCX) in the test/samples/ folder
 * 3. Run: node test/testAffinda.js
 */
async function testAffindaParsing() {
  console.log('\n🚀 Starting Affinda API Integration Test\n');
  console.log('='.repeat(60));
  
  try {
    // Check if API key is configured
    if (!affindaService.isConfigured()) {
      console.error('\n❌ ERROR: AFFINDA_API_KEY is not configured');
      console.error('\nPlease add your Affinda API key to the .env file:');
      console.error('AFFINDA_API_KEY=your_api_key_here\n');
      console.error('Get your API key from: https://www.affinda.com/');
      process.exit(1);
    }

    console.log('✅ API key is configured');
    
    // Test API connection first
    console.log('\n🔍 Testing API connection...');
    const isConnected = await affindaService.testConnection();
    
    if (!isConnected) {
      console.error('\n❌ Failed to connect to Affinda API');
      console.error('Please check your API key and internet connection');
      process.exit(1);
    }

    // Find a sample resume file
    const samplesDir = path.join(__dirname, 'samples');
    
    if (!fs.existsSync(samplesDir)) {
      console.log('\n📁 Creating samples directory...');
      fs.mkdirSync(samplesDir, { recursive: true });
      console.log('\n⚠️  No sample resumes found!');
      console.log(`\nPlease place a resume file (PDF, DOC, or DOCX) in: ${samplesDir}`);
      console.log('Then run this test again.\n');
      process.exit(0);
    }

    // Look for resume files
    const files = fs.readdirSync(samplesDir);
    const resumeFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.pdf', '.doc', '.docx'].includes(ext);
    });

    if (resumeFiles.length === 0) {
      console.log('\n⚠️  No sample resumes found!');
      console.log(`\nPlease place a resume file (PDF, DOC, or DOCX) in: ${samplesDir}`);
      console.log('Then run this test again.\n');
      process.exit(0);
    }

    // Use the first resume file found
    const sampleResume = resumeFiles[0];
    const sampleResumePath = path.join(samplesDir, sampleResume);

    console.log(`\n📄 Found sample resume: ${sampleResume}`);
    console.log('='.repeat(60));
    console.log('\n🤖 Parsing resume with Affinda API...\n');

    // Parse the resume
    const parsedData = await affindaService.parseResume(sampleResumePath);

    // Display results
    console.log('\n' + '='.repeat(60));
    console.log('📊 PARSED RESUME DATA');
    console.log('='.repeat(60));

    // Personal Information
    if (parsedData.name || parsedData.email || parsedData.phone) {
      console.log('\n👤 Personal Information:');
      console.log('─'.repeat(40));
      if (parsedData.name) console.log(`   Name: ${parsedData.name}`);
      if (parsedData.email) console.log(`   Email: ${parsedData.email}`);
      if (parsedData.phone) console.log(`   Phone: ${parsedData.phone}`);
      if (parsedData.location) console.log(`   Location: ${parsedData.location}`);
    }

    // Skills
    if (parsedData.skills && parsedData.skills.length > 0) {
      console.log('\n💡 Skills:');
      console.log('─'.repeat(40));
      console.log(`   Total: ${parsedData.skills.length} skills found`);
      const skillNames = parsedData.skills.slice(0, 10).map(s => s.name).join(', ');
      console.log(`   Top 10: ${skillNames}`);
      if (parsedData.skills.length > 10) {
        console.log(`   ... and ${parsedData.skills.length - 10} more`);
      }
    }

    // Work Experience
    if (parsedData.workExperience && parsedData.workExperience.length > 0) {
      console.log('\n💼 Work Experience:');
      console.log('─'.repeat(40));
      console.log(`   Total: ${parsedData.workExperience.length} positions`);
      parsedData.workExperience.forEach((exp, idx) => {
        console.log(`\n   ${idx + 1}. ${exp.jobTitle || 'N/A'}`);
        if (exp.organization) console.log(`      Company: ${exp.organization}`);
        if (exp.startDate || exp.endDate) {
          const start = exp.startDate ? new Date(exp.startDate).toLocaleDateString() : 'Unknown';
          const end = exp.endDate ? new Date(exp.endDate).toLocaleDateString() : 'Present';
          console.log(`      Period: ${start} - ${end}`);
        }
      });
    }

    // Education
    if (parsedData.education && parsedData.education.length > 0) {
      console.log('\n🎓 Education:');
      console.log('─'.repeat(40));
      console.log(`   Total: ${parsedData.education.length} entries`);
      parsedData.education.forEach((edu, idx) => {
        console.log(`\n   ${idx + 1}. ${edu.degree || 'N/A'}`);
        if (edu.institution) console.log(`      Institution: ${edu.institution}`);
        if (edu.field) console.log(`      Field: ${edu.field}`);
      });
    }

    // Certifications
    if (parsedData.certifications && parsedData.certifications.length > 0) {
      console.log('\n📜 Certifications:');
      console.log('─'.repeat(40));
      console.log(`   Total: ${parsedData.certifications.length} certifications`);
      parsedData.certifications.forEach((cert, idx) => {
        console.log(`   ${idx + 1}. ${cert.name || 'N/A'}`);
      });
    }

    // Languages
    if (parsedData.languages && parsedData.languages.length > 0) {
      console.log('\n🌐 Languages:');
      console.log('─'.repeat(40));
      const langs = parsedData.languages.map(l => l.language).join(', ');
      console.log(`   ${langs}`);
    }

    // Years of Experience
    if (parsedData.totalYearsExperience > 0) {
      console.log('\n⏱️  Total Years of Experience:');
      console.log('─'.repeat(40));
      console.log(`   ${parsedData.totalYearsExperience} years`);
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📈 Summary:');
    console.log('─'.repeat(40));
    console.log(`   ✓ Successfully parsed resume`);
    console.log(`   ✓ Name: ${parsedData.name || 'Not found'}`);
    console.log(`   ✓ Skills extracted: ${parsedData.skills ? parsedData.skills.length : 0}`);
    console.log(`   ✓ Work experience: ${parsedData.workExperience ? parsedData.workExperience.length : 0} positions`);
    console.log(`   ✓ Education: ${parsedData.education ? parsedData.education.length : 0} entries`);
    console.log(`   ✓ Parsed at: ${parsedData.parsedAt}`);

    // Save to JSON for inspection
    const outputPath = path.join(__dirname, 'parsed_output.json');
    fs.writeFileSync(outputPath, JSON.stringify(parsedData, null, 2));
    console.log(`\n💾 Full parsed data saved to: ${outputPath}`);

    console.log('\n' + '='.repeat(60));
    console.log('✅ Test completed successfully!\n');

  } catch (error) {
    console.error('\n' + '='.repeat(60));
    console.error('❌ Test failed!');
    console.error('─'.repeat(40));
    console.error(`Error: ${error.message}`);
    console.error('='.repeat(60) + '\n');
    
    if (error.message.includes('API key')) {
      console.error('💡 TIP: Make sure your AFFINDA_API_KEY is correct in the .env file');
    } else if (error.message.includes('not found')) {
      console.error('💡 TIP: Make sure the resume file exists in the test/samples/ folder');
    } else if (error.message.includes('No response')) {
      console.error('💡 TIP: Check your internet connection');
    }
    
    console.error('');
    process.exit(1);
  }
}

// Run the test
testAffindaParsing();
