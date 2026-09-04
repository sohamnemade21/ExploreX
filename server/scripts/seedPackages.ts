import 'dotenv/config';
import { packageService } from '../services/packageService';

async function main() {
  console.log('🚀 Starting ExploreX Packages Seeder...');
  try {
    const result = await packageService.seedAllPackages();
    console.log(`✅ Seeded ${result.seededCount} packages successfully.`);
    console.log(`🌐 Supabase Sync Status: ${result.supabaseSynced ? 'Synchronized' : 'Local store active'}`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Failed to seed packages:', err);
    process.exit(1);
  }
}

main();
