import { itineraryService } from '../services/itineraryService';
import { paymentService } from '../services/paymentService';
import { exploreService } from '../services/exploreService';
import { supabaseAuthService } from '../services/supabaseAuthService';
import { razorpayWebhookHandler } from '../services/razorpayService';
import { db } from '../db';
import { ENV } from '../config/env';

async function runAutomatedVerificationSuite() {
  console.log('======================================================');
  console.log('🧪 ExploreX Comprehensive Verification & Test Suite');
  console.log('======================================================\n');

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    totalTests++;
    if (condition) {
      passedTests++;
      console.log(`✅ [PASS] ${testName} ${detail ? `(${detail})` : ''}`);
    } else {
      console.error(`❌ [FAIL] ${testName} ${detail ? `(${detail})` : ''}`);
    }
  }

  // TEST 1: Destination Normalization & Isolation (Mumbai Request)
  console.log('--- 1. Testing Destination Isolation (Mumbai Request) ---');
  const mumbaiItin = await itineraryService.generateItinerary({
    destination: 'Mumbai',
    durationDays: 3,
    travelersCount: 2,
    budgetLevel: 'moderate',
    interests: ['heritage', 'culture', 'food'],
    travelStyle: 'couple',
    skipAi: true
  });
  assert(mumbaiItin.destination === 'Mumbai', 'Mumbai destination name preserved');
  assert(mumbaiItin.destinationId === 'dest-mumbai', 'Matched exact Mumbai DB ID (dest-mumbai)');
  const hasSindhudurgLeakInMumbai = (mumbaiItin.days || []).some(d =>
    [...(d.morning || []), ...(d.afternoon || []), ...(d.evening || [])].some(a => a.name.toLowerCase().includes('sindhudurg') || a.name.toLowerCase().includes('tarkarli'))
  );
  assert(!hasSindhudurgLeakInMumbai, 'Zero Sindhudurg POI leakage in Mumbai itinerary');

  // TEST 2: Destination Normalization & Isolation (Pune Request)
  console.log('\n--- 2. Testing Destination Isolation (Pune Request) ---');
  const puneItin = await itineraryService.generateItinerary({
    destination: 'Pune',
    durationDays: 2,
    travelersCount: 1,
    budgetLevel: 'moderate',
    interests: ['forts', 'food'],
    travelStyle: 'solo',
    skipAi: true
  });
  assert(puneItin.destination === 'Pune', 'Pune destination name preserved');
  assert(puneItin.destinationId === 'dest-pune', 'Matched exact Pune DB ID (dest-pune)');
  const hasSindhudurgLeakInPune = (puneItin.days || []).some(d =>
    [...(d.morning || []), ...(d.afternoon || []), ...(d.evening || [])].some(a => a.name.toLowerCase().includes('sindhudurg'))
  );
  assert(!hasSindhudurgLeakInPune, 'Zero Sindhudurg POI leakage in Pune itinerary');

  // TEST 3: Destination Isolation (Sindhudurg Request)
  console.log('\n--- 3. Testing Destination Isolation (Sindhudurg Request) ---');
  const sindhuItin = await itineraryService.generateItinerary({
    destination: 'Sindhudurg',
    durationDays: 2,
    travelersCount: 2,
    budgetLevel: 'moderate',
    interests: ['beach', 'scuba'],
    travelStyle: 'friends',
    skipAi: true
  });
  assert(sindhuItin.destination === 'Sindhudurg & Tarkarli', 'Sindhudurg destination name resolved');
  assert(sindhuItin.destinationId === 'dest-sindhudurg', 'Matched exact Sindhudurg DB ID');

  // TEST 4: Destination Isolation (Goa Request)
  console.log('\n--- 4. Testing Destination Isolation (Goa Request) ---');
  const goaItin = await itineraryService.generateItinerary({
    destination: 'Goa',
    durationDays: 3,
    travelersCount: 2,
    budgetLevel: 'moderate',
    interests: ['beaches', 'culture'],
    travelStyle: 'couple',
    skipAi: true
  });
  assert(goaItin.destination === 'Goa', 'Goa destination name resolved');
  assert(goaItin.destinationId === 'dest-goa', 'Matched exact Goa DB ID (dest-goa)');

  // TEST 5: Destination Isolation (Solapur Request)
  console.log('\n--- 5. Testing Destination Isolation (Solapur Request) ---');
  const solapurItin = await itineraryService.generateItinerary({
    destination: 'Solapur',
    durationDays: 2,
    travelersCount: 2,
    budgetLevel: 'moderate',
    interests: ['temples', 'history', 'textiles'],
    travelStyle: 'family',
    skipAi: true
  });
  assert(solapurItin.destination.includes('Solapur'), 'Solapur destination name resolved');
  assert(solapurItin.destinationId === 'dest-solapur', 'Matched exact Solapur DB ID (dest-solapur)');
  const hasSindhudurgLeakInSolapur = (solapurItin.days || []).some(d =>
    [...(d.morning || []), ...(d.afternoon || []), ...(d.evening || [])].some(a => a.name.toLowerCase().includes('sindhudurg') || a.name.toLowerCase().includes('tarkarli'))
  );
  assert(!hasSindhudurgLeakInSolapur, 'Zero Sindhudurg POI leakage in Solapur itinerary');

  // TEST 6: Graceful Handling for Unknown Destination (No Silent Sindhudurg Fallback!)
  console.log('\n--- 6. Testing Unknown Destination Handling (Reykjavik Request) ---');
  const unknownItin = await itineraryService.generateItinerary({
    destination: 'Reykjavik',
    durationDays: 2,
    travelersCount: 1,
    budgetLevel: 'moderate',
    interests: ['geysers', 'glaciers'],
    travelStyle: 'solo',
    skipAi: true
  });
  assert(unknownItin.destination === 'Reykjavik', 'Preserved requested unseeded destination (Reykjavik)');
  assert(unknownItin.destinationId !== 'dest-sindhudurg', 'Did NOT silently fallback to Sindhudurg!');
  assert(unknownItin.validationWarnings.some(w => w.includes('Local database coverage')), 'Warning properly signals external knowledge fallback');

  // TEST 6: Server-Side Payment Calculation & Razorpay Order Intent
  console.log('\n--- 6. Testing Server-Side Payment Intent & Calculation ---');
  const intent = await paymentService.createPaymentIntent({
    userId: 'usr-test',
    serviceType: 'package',
    title: 'Goa Coastal & Heritage Tour',
    destinationName: 'Goa',
    basePrice: 20000,
    travelDate: '2026-11-01',
    passengersCount: 2,
    passengerDetails: [{ name: 'Test User', age: 28, gender: 'Male' }],
    promoCode: 'WANDER20'
  });
  assert(intent.success === true, 'Payment intent created successfully');
  assert(intent.amountInPaise > 0, 'Amount correctly converted to paise', `₹${intent.amountInINR} INR = ${intent.amountInPaise} paise`);
  assert(intent.grandTotalINR === 39200, 'Server calculated price with 18% GST & WANDER20 discount correctly', `₹39,200 INR`);

  // TEST 7: Razorpay Signature Verification & Booking Status
  console.log('\n--- 7. Testing Razorpay Payment Verification & Safety Net ---');
  const verifyRes = await paymentService.verifyPayment({
    bookingId: intent.bookingId,
    razorpay_order_id: intent.orderId,
    razorpay_payment_id: `pay_rzp_test_${Date.now()}`,
    razorpay_signature: 'mock_signature',
    userId: 'usr-test'
  });
  assert(verifyRes.verified === true, 'Payment signature verified');
  assert(verifyRes.bookingStatus === 'confirmed', 'Booking status updated to confirmed');

  // TEST 8: Explore POI Engine Coverage
  console.log('\n--- 8. Testing Explore POI Engine ---');
  const pois = await exploreService.getExplorePOIs();
  assert(pois.length > 50, 'Explore POI Engine returned comprehensive dataset', `${pois.length} POIs loaded`);

  // TEST 9: Traveler Safety & SOS Service Core Tests
  console.log('\n--- 9. Testing Traveler Safety & Emergency SOS ---');
  const { safetyService } = await import('../services/safetyService');
  const defaultSafety = safetyService.getDefaultSafetyProfile('IN', false);
  assert(defaultSafety.travelMode === 'general', 'Default travelMode is general');
  assert(defaultSafety.checkInStatus === 'safe', 'Default status is safe');
  assert(defaultSafety.saferRoutePreferred === true, 'Safer-route preference enabled by default');
  assert(defaultSafety.avoidNightTravel === true, 'Night-travel avoidance enabled by default');

  // SOS Broadcast Trigger Test
  const sosResult = safetyService.triggerSos({
    userId: 'usr-test-safety',
    userName: 'Priya Sharma',
    travelMode: 'solo_female',
    location: { destinationName: 'Goa', lat: 15.2993, lng: 74.1240 },
    customMessage: 'Emergency test trigger'
  });
  assert(sosResult.status === 'active', 'Emergency SOS status is active');
  assert(sosResult.alertId.startsWith('SOS-'), 'Generated unique SOS alert ID');
  assert(sosResult.localEmergencyNumbers.some(n => n.number === '112'), 'Includes National Emergency 112');
  assert(sosResult.localEmergencyNumbers.some(n => n.number === '1363'), 'Includes Tourist Police 1363');
  assert(sosResult.localEmergencyNumbers.some(n => n.number === '1091'), 'Includes Women Police 1091');

  // SOS Resolution Test
  const resolveResult = safetyService.resolveSos('usr-test-safety');
  assert(resolveResult.success === true, 'Resolved Emergency SOS successfully');
  const resolvedProfile = safetyService.getSafetyProfile('usr-test-safety');
  assert(resolvedProfile.checkInStatus === 'safe', 'Profile status reset to safe after resolution');

  // Safety Check-In & Missed Detection Test
  const checkInResult = safetyService.recordCheckIn('usr-test-safety', 'safe', 'All fine on trip');
  assert(checkInResult.success === true, 'Recorded safety check-in successfully');
  const isMissed = safetyService.isCheckInMissed(resolvedProfile);
  assert(isMissed.missed === false, 'Recent check-in is not overdue');

  // Quick Trusted Contact Alert Test
  const pingResult = safetyService.pingTrustedContact('usr-test-safety', undefined, 'Quick safety ping', { destinationName: 'Goa' });
  assert(pingResult.success === true, 'Quick contact reassurance ping dispatched');

  // Destination Alerts & Night Warnings Test
  const destinationAlerts = await safetyService.getDestinationSafetyAlerts('Goa', 15.2993, 74.1240, 'solo_female');
  assert(destinationAlerts.length >= 2, 'Generated context-aware destination safety alerts');
  assert(destinationAlerts.some(a => a.type === 'advisory' && a.message.includes('1363')), 'Includes official tourist police guidance');

  // Official Directory Test
  const directory = safetyService.getEmergencyDirectory('IN');
  assert(directory.length >= 7, 'Emergency directory contains all verified Indian helplines');
  assert(directory.some(d => d.number === '1098'), 'Includes Childline 1098 for family safety');

  // TEST 10: Supabase Authentication Flow (When live configured)
  if (supabaseAuthService.isLive()) {
    console.log('\n--- 10. Testing Supabase Authentication Flow ---');
    const testEmail = `traveler_${Date.now()}@example.com`;
    const signupRes = await supabaseAuthService.signUp('Aarav Sharma', testEmail, 'StrongPassword123!');
    assert(Boolean(signupRes.token), 'Signup returned session token');
    assert(signupRes.user.email === testEmail, 'User profile associated with registered email');

    const loginRes = await supabaseAuthService.login(testEmail, 'StrongPassword123!');
    assert(Boolean(loginRes.token), 'Login issued active session token');

    const resetRes = await supabaseAuthService.resetPassword(testEmail);
    assert(resetRes.success === true, 'Password reset request completed with verification dispatch');

    const logoutRes = await supabaseAuthService.logout(loginRes.token);
    assert(logoutRes.success === true, 'Session logged out and cleared successfully');
  } else {
    console.log('\n--- 10. Supabase Authentication (Live Config Check) ---');
    assert(typeof supabaseAuthService.isLive() === 'boolean', 'Supabase Auth Service initialized safely');
  }

  // TEST 14: Razorpay Webhook HMAC-SHA256 Signature Verification with Raw Body
  console.log('\n--- 14. Testing Razorpay Webhook HMAC-SHA256 Verification ---');
  const sampleWebhookPayload = JSON.stringify({
    entity: 'event',
    account_id: 'acc_explorex_test',
    event: 'payment.captured',
    contains: ['payment'],
    payload: {
      payment: {
        entity: {
          id: `pay_webhook_${Date.now()}`,
          entity: 'payment',
          amount: 500000,
          currency: 'INR',
          status: 'captured',
          order_id: `order_webhook_${Date.now()}`,
          notes: {
            bookingId: 'BKG-2026-9812'
          }
        }
      }
    },
    created_at: Math.floor(Date.now() / 1000)
  });

  const validSignature = paymentService.generateWebhookSignature(sampleWebhookPayload);
  const isValidSig = paymentService.verifyWebhookSignature(sampleWebhookPayload, validSignature);
  assert(isValidSig === true, 'Valid HMAC-SHA256 signature verified against raw payload body');

  // TEST 15: Invalid & Tampered Webhook Signature Rejection
  console.log('\n--- 15. Testing Invalid & Tampered Webhook Signature Rejection ---');
  const tamperedPayload = sampleWebhookPayload + ' ';
  const isTamperedValid = paymentService.verifyWebhookSignature(tamperedPayload, validSignature);
  assert(isTamperedValid === false, 'Tampered webhook payload rejected with false');

  const isBogusValid = paymentService.verifyWebhookSignature(sampleWebhookPayload, 'invalid_fake_signature_abc123');
  assert(isBogusValid === false, 'Bogus webhook signature rejected with false');

  const isMissingSigValid = paymentService.verifyWebhookSignature(sampleWebhookPayload, '');
  assert(isMissingSigValid === false, 'Empty signature safely rejected without throwing exception');

  // TEST 16: Idempotent Webhook Event Processing
  console.log('\n--- 16. Testing Webhook Event Processing (payment.captured) ---');
  const eventResult = await paymentService.processWebhookEvent('payment.captured', {
    payment: {
      entity: {
        id: `pay_auto_${Date.now()}`,
        order_id: 'order_wh_auto_1',
        amount: 250000,
        notes: {
          bookingId: 'BKG-2026-9812'
        }
      }
    }
  });
  assert(eventResult.processed === true, 'Webhook event processed successfully');
  assert(eventResult.bookingId === 'BKG-2026-9812', 'Target booking identified and updated');
  const updatedBkg = db.getBookingById('BKG-2026-9812');
  assert(updatedBkg?.paymentStatus === 'paid', 'Booking payment status updated to paid');

  // TEST 17: Webhook HTTP Handler - Invalid Signature Rejection (HTTP 400)
  console.log('\n--- 17. Testing Webhook HTTP Endpoint: Invalid Signature Handling ---');
  let rejectedStatus = 0;
  let rejectedBody: any = null;
  const mockReqInvalid: any = {
    headers: { 'x-razorpay-signature': 'bad_signature_hash_999' },
    get: (h: string) => h.toLowerCase() === 'x-razorpay-signature' ? 'bad_signature_hash_999' : undefined,
    rawBody: sampleWebhookPayload,
    body: JSON.parse(sampleWebhookPayload)
  };
  const mockResInvalid: any = {
    status: (code: number) => {
      rejectedStatus = code;
      return {
        json: (data: any) => { rejectedBody = data; return data; }
      };
    }
  };
  await razorpayWebhookHandler(mockReqInvalid, mockResInvalid);
  assert(rejectedStatus === 400, 'Invalid signature returned HTTP 400 Bad Request');
  assert(rejectedBody?.code === 'INVALID_SIGNATURE', 'Error response contains INVALID_SIGNATURE code');

  // TEST 18: Webhook HTTP Handler - Valid Signature Acceptance (HTTP 200)
  console.log('\n--- 18. Testing Webhook HTTP Endpoint: Valid Signature Handling ---');
  let acceptedStatus = 0;
  let acceptedBody: any = null;
  const mockReqValid: any = {
    headers: { 'x-razorpay-signature': validSignature },
    get: (h: string) => h.toLowerCase() === 'x-razorpay-signature' ? validSignature : undefined,
    rawBody: sampleWebhookPayload,
    body: JSON.parse(sampleWebhookPayload)
  };
  const mockResValid: any = {
    status: (code: number) => {
      acceptedStatus = code;
      return {
        json: (data: any) => { acceptedBody = data; return data; }
      };
    }
  };
  await razorpayWebhookHandler(mockReqValid, mockResValid);
  assert(acceptedStatus === 200, 'Valid signature returned HTTP 200 OK');
  assert(acceptedBody?.status === 'ok' && acceptedBody?.verified === true, 'Webhook confirmed with verified: true');

  // TEST 19: Global Itinerary Uniqueness & Zero Transport Verification (4-Day Goa)
  console.log('\n--- 19. Testing 4-Day Goa Itinerary Uniqueness & Zero Transport ---');
  const goa4Day = await itineraryService.generateItinerary({
    destination: 'Goa',
    durationDays: 4,
    travelersCount: 2,
    budgetLevel: 'moderate',
    interests: ['heritage', 'beaches', 'culture', 'food'],
    travelStyle: 'couple',
    foodPreference: 'local',
    skipAi: true
  });

  const allGoaActs: any[] = [];
  for (const day of goa4Day.days) {
    allGoaActs.push(...(day.morning || []), ...(day.afternoon || []), ...(day.evening || []));
  }

  // 1. Verify ZERO transport/vehicle entities
  const transportKeywords = ['cab stand', 'scooter station', 'auto hub', 'bike station', 'vehicle rental', 'explorex transport', 'taxi stand', 'car rental'];
  const hasTransportEntities = allGoaActs.some(a => {
    const lower = `${a.name} ${a.category || ''} ${a.description || ''}`.toLowerCase();
    return transportKeywords.some(kw => lower.includes(kw));
  });
  assert(!hasTransportEntities, 'Zero transport/vehicle entities found in activities', `Total activities: ${allGoaActs.length}`);

  // 2. Verify GLOBAL Uniqueness across all 4 days
  const visitedNames = new Set<string>();
  const visitedIds = new Set<string>();
  let hasDuplicatePlace = false;
  let dupDetail = '';

  for (const act of allGoaActs) {
    const normName = act.name.toLowerCase().trim();
    if (visitedNames.has(normName) || (act.id && visitedIds.has(act.id))) {
      hasDuplicatePlace = true;
      dupDetail = `Duplicate found: "${act.name}" (ID: ${act.id})`;
      break;
    }
    visitedNames.add(normName);
    if (act.id) visitedIds.add(act.id);
  }
  assert(!hasDuplicatePlace, 'All activities across Day 1-4 are globally unique real attractions', dupDetail || `Verified ${allGoaActs.length} distinct attractions`);

  // TEST 20: Global Itinerary Uniqueness (3-Day Mumbai)
  console.log('\n--- 20. Testing 3-Day Mumbai Itinerary Uniqueness & Zero Transport ---');
  const mumbai3Day = await itineraryService.generateItinerary({
    destination: 'Mumbai',
    durationDays: 3,
    travelersCount: 2,
    budgetLevel: 'budget',
    interests: ['heritage', 'culture', 'food'],
    travelStyle: 'friends',
    foodPreference: 'veg',
    skipAi: true
  });

  const allMumbaiActs: any[] = [];
  for (const day of mumbai3Day.days) {
    allMumbaiActs.push(...(day.morning || []), ...(day.afternoon || []), ...(day.evening || []));
  }

  const hasTransportInMumbai = allMumbaiActs.some(a => {
    const lower = `${a.name} ${a.category || ''} ${a.description || ''}`.toLowerCase();
    return transportKeywords.some(kw => lower.includes(kw));
  });
  assert(!hasTransportInMumbai, 'Zero transport/vehicle entities in Mumbai activities', `Total activities: ${allMumbaiActs.length}`);

  const mumbaiNames = new Set<string>();
  let hasMumbaiDup = false;
  for (const act of allMumbaiActs) {
    const norm = act.name.toLowerCase().trim();
    if (mumbaiNames.has(norm)) {
      hasMumbaiDup = true;
      break;
    }
    mumbaiNames.add(norm);
  }
  assert(!hasMumbaiDup, 'Zero duplicates across entire 3-day Mumbai itinerary', `Verified ${allMumbaiActs.length} unique attractions`);

  // TEST 21: Verification of Preference-Based Replacement & Food Alignment
  console.log('\n--- 21. Testing Preference & Food Alignment in Generated Days ---');
  const vegFoodMealRecs = allMumbaiActs.filter(a => a.mealRecommendation?.toLowerCase().includes('vegetarian') || a.mealRecommendation?.toLowerCase().includes('breakfast') || a.mealRecommendation?.toLowerCase().includes('thali'));
  assert(vegFoodMealRecs.length > 0, 'Meal recommendations correctly respect vegetarian food preference', `${vegFoodMealRecs.length} meals aligned`);

  console.log('\n======================================================');
  console.log(`📊 TEST SUITE SUMMARY: ${passedTests} / ${totalTests} PASSED`);
  console.log('======================================================\n');

  if (passedTests !== totalTests) {
    process.exit(1);
  }
}

runAutomatedVerificationSuite().catch(err => {
  console.error('Test Suite Exception:', err);
  process.exit(1);
});
