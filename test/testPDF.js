import affindaService from '../services/affindaService.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Test with PDF file
 */
async function testPDF() {
  console.log('\n🚀 Testing Affinda Resume Parser with PDF\n');
  console.log('='.repeat(60));
  
  try {
    const testFile = '1762185939661.pdf';  // Try the PDF file
    const testFilePath = path.join(process.cwd(), 'uploads', 'resumes', testFile);
    
    if (!fs.existsSync(testFilePath)) {
      console.error('❌ PDF file not found');
      process.exit(1);
    }
    
    console.log(`\n📄 Testing with: ${testFile}`);
    console.log('='.repeat(60));
    console.log('\n🤖 Parsing resume...\n');
    
    const parsedData = await affindaService.parseResume(testFilePath);
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ SUCCESS!');
    console.log('='.repeat(60));
    
    console.log('\n👤 PERSONAL INFO:');
    console.log(`   Name: ${parsedData.name || 'Not found'}`);
    console.log(`   Email: ${parsedData.email || 'Not found'}`);
    console.log(`   Phone: ${parsedData.phone || 'Not found'}`);
    console.log(`   Location: ${parsedData.location || 'Not found'}`);
    
    console.log('\n💡 SKILLS:');
    console.log(`   Total: ${parsedData.skills ? parsedData.skills.length : 0}`);
    if (parsedData.skills && parsedData.skills.length > 0) {
      console.log(`   Top 10: ${parsedData.skills.slice(0, 10).map(s => s.name).join(', ')}`);
    }
    
    console.log('\n💼 WORK EXPERIENCE:');
    console.log(`   Positions: ${parsedData.workExperience ? parsedData.workExperience.length : 0}`);
    
    console.log('\n🎓 EDUCATION:');
    console.log(`   Entries: ${parsedData.education ? parsedData.education.length : 0}`);
    
    console.log('\n⏱️  EXPERIENCE:');
    console.log(`   Years: ${parsedData.totalYearsExperience || 0}`);
    
    const outputPath = path.join(__dirname, 'parsed_resume.json');
    fs.writeFileSync(outputPath, JSON.stringify(parsedData, null, 2));
    console.log(`\n💾 Saved to: test/parsed_resume.json`);
    
    console.log('\n🎉 AFFINDA INTEGRATION WORKING!\n');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

testPDF();
