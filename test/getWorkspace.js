import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Fetch available workspaces from Affinda API
 */
async function getWorkspaces() {
  try {
    const apiKey = process.env.AFFINDA_API_KEY;
    
    if (!apiKey) {
      console.error('❌ AFFINDA_API_KEY not configured');
      process.exit(1);
    }
    
    console.log('\n🔍 Fetching your Affinda workspaces...\n');
    
    const response = await axios.post(
    `${this.baseUrl}/documents`,
    formData,
    {
        headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        ...formData.getHeaders()
        },
        params: {
        workspace: this.workspace,
        wait: 'true'
        }
    }
    );

    
    console.log('✅ Workspaces found:\n');
    console.log(JSON.stringify(response.data, null, 2));
    
    if (response.data && response.data.results && response.data.results.length > 0) {
      const workspace = response.data.results[0];
      console.log('\n📝 Workspace to use:');
      console.log(`   Identifier: ${workspace.identifier}`);
      console.log(`   Name: ${workspace.name || 'N/A'}`);
      console.log(`\n💡 Update affindaService.js with: this.workspace = '${workspace.identifier}';`);
    }
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.response) {
      console.error('Response:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

getWorkspaces();
