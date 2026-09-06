import { app } from '../app';
import http from 'http';

async function runVercelAuthTests() {
  console.log('\n======================================================');
  console.log('🚀 Running Vercel Serverless & Auth Integration Tests');
  console.log('======================================================\n');

  // Start test HTTP server with app
  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const port = (server.address() as any).port;
  const baseUrl = `http://127.0.0.1:${port}`;

  let passed = 0;
  let failed = 0;

  function assert(name: string, condition: boolean, extra?: string) {
    if (condition) {
      console.log(`✅ [PASS] ${name} ${extra || ''}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${name} ${extra || ''}`);
      failed++;
    }
  }

  try {
    // 1. Health check
    const healthRes = await fetch(`${baseUrl}/api/health`);
    const healthJson = await healthRes.json();
    assert('Health Check /api/health', healthRes.status === 200 && healthJson.status === 'online');

    // 2. Health check alias /health
    const healthAliasRes = await fetch(`${baseUrl}/health`);
    const healthAliasJson = await healthAliasRes.json();
    assert('Health Check alias /health', healthAliasRes.status === 200 && healthAliasJson.status === 'online');

    // 3. Signup with unique test user
    const testEmail = `traveler_${Date.now()}@example.com`;
    const testPassword = 'ExploreXTest@2026';
    const testName = 'Test Production Traveler';

    console.log(`\n--- Testing Supabase Auth Signup (${testEmail}) ---`);
    const signupRes = await fetch(`${baseUrl}/api/v1/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: testName,
        email: testEmail,
        password: testPassword
      })
    });

    const signupJson = await signupRes.json();
    assert('Signup HTTP status is 200', signupRes.status === 200, `(Status: ${signupRes.status})`);
    assert('Signup returned JWT token', Boolean(signupJson.token), `Token length: ${signupJson.token?.length}`);
    assert('Signup returned user profile', signupJson.user?.email === testEmail);

    const userToken = signupJson.token;

    // 4. Test Login with newly created user
    console.log(`\n--- Testing Supabase Auth Login (${testEmail}) ---`);
    const loginRes = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword
      })
    });

    const loginJson = await loginRes.json();
    assert('Login HTTP status is 200', loginRes.status === 200, `(Status: ${loginRes.status})`);
    assert('Login returned JWT token', Boolean(loginJson.token));
    assert('Login returned correct user ID', loginJson.user?.id === signupJson.user?.id);

    // 5. Test Login with incorrect password (MUST return 400 Bad Request, NOT 500!)
    console.log('\n--- Testing Login with Wrong Password (Must return 400, not 500) ---');
    const wrongLoginRes = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: 'WrongPassword@123'
      })
    });

    const wrongLoginJson = await wrongLoginRes.json();
    assert('Wrong credentials returned HTTP 400', wrongLoginRes.status === 400, `(Status: ${wrongLoginRes.status})`);
    assert('Error message provided without crash', Boolean(wrongLoginJson.error), `Error: ${wrongLoginJson.error}`);

    // 6. Test Session Verification /api/v1/auth/session
    console.log('\n--- Testing Session Persistence & Verification ---');
    const sessionRes = await fetch(`${baseUrl}/api/v1/auth/session`, {
      headers: { 'Authorization': `Bearer ${userToken}` }
    });
    const sessionJson = await sessionRes.json();
    assert('Session verification returned HTTP 200', sessionRes.status === 200);
    assert('Session authenticated is true', sessionJson.authenticated === true);
    assert('Session user matches registered email', sessionJson.user?.email === testEmail);

    // 7. Test Protected Profile Route with Auth
    console.log('\n--- Testing Protected Profile Endpoint ---');
    const profileRes = await fetch(`${baseUrl}/api/v1/auth/profile`, {
      headers: { 'Authorization': `Bearer ${userToken}` }
    });
    const profileJson = await profileRes.json();
    assert('Protected profile returned HTTP 200', profileRes.status === 200);
    assert('Profile ID matches authenticated user', profileJson.id === signupJson.user?.id);

    // 8. Test Unauthenticated Protected Route (Must return 401)
    const unauthProfileRes = await fetch(`${baseUrl}/api/v1/auth/profile`);
    assert('Unauthenticated access blocked with HTTP 401', unauthProfileRes.status === 401);

    // 9. Test Administrator Login & Authorization
    console.log('\n--- Testing Admin Account Verification ---');
    const adminLoginRes = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'explorexsih0426@gmail.com',
        password: 'ExploreXsih@0426'
      })
    });
    const adminLoginJson = await adminLoginRes.json();
    assert('Admin Login succeeded with 200', adminLoginRes.status === 200);
    assert('Admin user has admin role', adminLoginJson.user?.role === 'admin');

    // 10. Test Serverless Handler simulation (invoking api/index default export)
    console.log('\n--- Testing Vercel Handler Function Direct Invocation ---');
    const vercelHandler = (await import('../../api/index')).default;
    assert('Vercel serverless function export exists and is callable', typeof vercelHandler === 'function');

  } finally {
    server.close();
  }

  console.log('\n======================================================');
  console.log(`📊 VERCEL & AUTH TEST SUMMARY: ${passed} / ${passed + failed} PASSED`);
  console.log('======================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runVercelAuthTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
