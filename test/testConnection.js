import affindaService from '../services/affindaService.js';

/**
 * Quick test to verify Affinda API key and connection
 */
async function testConnection() {
  console.log('\n🔍 Testing Affinda API Connection...\n');
  console.log('='.repeat(60));
  
  try {
    // Check if API key is configured
    if (!affindaService.isConfigured()) {
      console.error('❌ ERROR: AFFINDA_API_KEY is not configured');
      process.exit(1);
    }
    
    console.log('✅ API key is configured');
    console.log(`   Key: ${process.env.AFFINDA_API_KEY.substring(0, 10)}...`);
    
    // Test API connection
    console.log('\n🔌 Testing connection to Affinda API...');
    const isConnected = await affindaService.testConnection();
    
    if (isConnected) {
      console.log('\n✅ SUCCESS! Connection to Affinda API is working!');
      console.log('='.repeat(60));
      console.log('\n🎉 Your API key is valid and ready to use!\n');
      console.log('Next steps:');
      console.log('1. Place a sample resume (PDF, DOC, or DOCX) in test/samples/');
      console.log('2. Run: node test/testAffinda.js');
      console.log('   Or upload a resume through the application\n');
    } else {
      console.log('\n❌ Connection failed!');
      console.log('Please check:');
      console.log('- Your internet connection');
      console.log('- Your API key is correct');
      console.log('- Affinda API status');
    }
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

testConnection();
