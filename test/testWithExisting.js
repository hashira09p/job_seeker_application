import affindaService from '../services/affindaService.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Test Affinda parsing with existing uploaded resume
 */
async function testWithExistingResume() {
  console.log('\n🚀 Testing Affinda Resume Parser\n');
  console.log('='.repeat(60));
  
  try {
    // Check if API key is configured
    if (!affindaService.isConfigured()) {
      console.error('❌ ERROR: AFFINDA_API_KEY is not configured');
      process.exit(1);
    }
    
    console.log('✅ API key is configured');
    
    // Find an existing resume file
    const uploadsDir = path.join(process.cwd(), 'uploads', 'resumes');
    
    if (!fs.existsSync(uploadsDir)) {
      console.error('❌ Uploads directory not found');
      process.exit(1);
    }
    
    const files = fs.readdirSync(uploadsDir);
    const resumeFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.pdf', '.doc', '.docx'].includes(ext);
    });
    
    if (resumeFiles.length === 0) {
      console.error('❌ No resume files found in uploads/resumes/');
      console.log('\nPlease upload a resume through the application first.');
      process.exit(0);
    }
    
    // Use the first resume file
    const testFile = resumeFiles[0];
    const testFilePath = path.join(uploadsDir, testFile);
    
    console.log(`\n📄 Testing with: ${testFile}`);
    console.log('='.repeat(60));
    console.log('\n🤖 Sending to Affinda API for parsing...\n');
    
    // Parse the resume
    const parsedData = await affindaService.parseResume(testFilePath);
    
    // Display results
    console.log('\n' + '='.repeat(60));
    console.log('✅ SUCCESS! Resume Parsed Successfully!');
    console.log('='.repeat(60));
    
    // Personal Information
    console.log('\n👤 PERSONAL INFORMATION:');
    console.log('─'.repeat(40));
    console.log(`   Name: ${parsedData.name || 'Not found'}`);
    console.log(`   Email: ${parsedData.email || 'Not found'}`);
    console.log(`   Phone: ${parsedData.phone || 'Not found'}`);
    console.log(`   Location: ${parsedData.location || 'Not found'}`);
    
    // Skills
    if (parsedData.skills && parsedData.skills.length > 0) {
      console.log('\n💡 SKILLS:');
      console.log('─'.repeat(40));
      console.log(`   Total: ${parsedData.skills.length} skills found`);
      const topSkills = parsedData.skills.slice(0, 15).map(s => s.name).join(', ');
      console.log(`   Top skills: ${topSkills}`);
      if (parsedData.skills.length > 15) {
        console.log(`   ... and ${parsedData.skills.length - 15} more`);
      }
    }
    
    // Work Experience
    if (parsedData.workExperience && parsedData.workExperience.length > 0) {
      console.log('\n💼 WORK EXPERIENCE:');
      console.log('─'.repeat(40));
      console.log(`   Total: ${parsedData.workExperience.length} positions`);
      parsedData.workExperience.slice(0, 3).forEach((exp, idx) => {
        console.log(`\n   ${idx + 1}. ${exp.jobTitle || 'Position not specified'}`);
        if (exp.organization) console.log(`      at ${exp.organization}`);
        if (exp.startDate || exp.endDate) {
          const start = exp.startDate || 'Unknown';
          const end = exp.endDate || 'Present';
          console.log(`      ${start} - ${end}`);
        }
      });
    }
    
    // Education
    if (parsedData.education && parsedData.education.length > 0) {
      console.log('\n🎓 EDUCATION:');
      console.log('─'.repeat(40));
      console.log(`   Total: ${parsedData.education.length} entries`);
      parsedData.education.forEach((edu, idx) => {
        console.log(`   ${idx + 1}. ${edu.degree || 'Degree not specified'}`);
        if (edu.institution) console.log(`      from ${edu.institution}`);
      });
    }
    
    // Years of Experience
    if (parsedData.totalYearsExperience > 0) {
      console.log('\n⏱️  TOTAL EXPERIENCE:');
      console.log('─'.repeat(40));
      console.log(`   ${parsedData.totalYearsExperience} years`);
    }
    
    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 PARSING SUMMARY:');
    console.log('─'.repeat(40));
    console.log(`   ✓ Name extracted: ${parsedData.name ? 'Yes' : 'No'}`);
    console.log(`   ✓ Email extracted: ${parsedData.email ? 'Yes' : 'No'}`);
    console.log(`   ✓ Skills found: ${parsedData.skills ? parsedData.skills.length : 0}`);
    console.log(`   ✓ Work positions: ${parsedData.workExperience ? parsedData.workExperience.length : 0}`);
    console.log(`   ✓ Education entries: ${parsedData.education ? parsedData.education.length : 0}`);
    console.log(`   ✓ Total years exp: ${parsedData.totalYearsExperience || 0}`);
    
    // Save full output
    const outputPath = path.join(__dirname, 'test_output.json');
    fs.writeFileSync(outputPath, JSON.stringify(parsedData, null, 2));
    console.log(`\n💾 Full output saved to: test/test_output.json`);
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ TEST COMPLETED SUCCESSFULLY!');
    console.log('='.repeat(60));
    console.log('\n🎉 Your Affinda integration is working perfectly!\n');
    console.log('The resume parser will now automatically extract data');
    console.log('when users upload resumes through your application.\n');
    
  } catch (error) {
    console.error('\n' + '='.repeat(60));
    console.error('❌ TEST FAILED!');
    console.error('─'.repeat(40));
    console.error(`Error: ${error.message}`);
    console.error('='.repeat(60));
    
    if (error.message.includes('401') || error.message.includes('Invalid')) {
      console.error('\n💡 Your API key appears to be invalid.');
      console.error('Please check your AFFINDA_API_KEY in the .env file.');
    } else if (error.message.includes('429')) {
      console.error('\n💡 Rate limit exceeded. Wait a moment and try again.');
    } else if (error.message.includes('No response')) {
      console.error('\n💡 Check your internet connection.');
    }
    
    console.error('');
    process.exit(1);
  }
}

testWithExistingResume();
