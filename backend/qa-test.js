const API_URL = 'http://localhost:5000/api';
let token = '';

async function runTests() {
  console.log('--- STARTING QA E2E TESTS ---');
  try {
    // 1. Register User
    console.log('1. Testing /auth/register...');
    const regRes = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'QA Tester',
        username: `qatest_${Date.now()}`,
        email: `qa_${Date.now()}@test.com`,
        password: 'Password123!'
      })
    });
    if (!regRes.ok) throw new Error(await regRes.text());
    const regData = await regRes.json();
    console.log('✅ Registration successful:', regData.username);
    token = regData.token;

    // 2. Login User
    console.log('2. Testing /auth/login...');
    const loginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: regData.email,
        password: 'Password123!'
      })
    });
    if (!loginRes.ok) throw new Error(await loginRes.text());
    const loginData = await loginRes.json();
    console.log('✅ Login successful. Token received.');
    token = loginData.token;

    const authHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    // 3. Log a Mood
    console.log('3. Testing POST /mood (Happy)...');
    const moodRes = await fetch(`${API_URL}/mood`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        emotion: 'Happy',
        intensity: 8,
        note: 'QA testing mood submission'
      })
    });
    if (!moodRes.ok) throw new Error(await moodRes.text());
    const moodData = await moodRes.json();
    console.log('✅ Mood logged. Points Awarded:', moodData.pointsAwarded, 'Total Points:', moodData.totalPoints);

    // 4. Get Mood History
    console.log('4. Testing GET /mood...');
    const historyRes = await fetch(`${API_URL}/mood`, { headers: authHeaders });
    if (!historyRes.ok) throw new Error(await historyRes.text());
    const historyData = await historyRes.json();
    console.log(`✅ Mood history retrieved. Count: ${historyData.length}`);
    if (historyData.length === 0) throw new Error('Mood history is empty!');

    // 5. Get AI Recommendations
    console.log('5. Testing GET /ai/recommendations...');
    const recRes = await fetch(`${API_URL}/ai/recommendations`, { headers: authHeaders });
    if (!recRes.ok) throw new Error(await recRes.text());
    const recData = await recRes.json();
    console.log('✅ AI Recommendations fetched.');
    console.log(`   Movies: ${recData.recommendations?.movies?.length || 0}`);
    console.log(`   Tracks: ${recData.recommendations?.music?.length || 0}`);

    // 5b. Get AI Insights
    console.log('5b. Testing GET /ai/insights...');
    const insightsRes = await fetch(`${API_URL}/ai/insights`, { headers: authHeaders });
    if (!insightsRes.ok) throw new Error(await insightsRes.text());
    const insightsData = await insightsRes.json();
    console.log('✅ AI Insights fetched.');
    console.log('   Insights:', insightsData.insights?.substring(0, 50) + '...');

    // 6. Test Gamification Updates
    console.log('6. Checking Gamification consistency...');
    if (!moodData.totalPoints || moodData.totalPoints < 10) {
      throw new Error('Points were not awarded properly!');
    }
    console.log('✅ Gamification points awarded correctly.');

    console.log('--- ALL QA E2E TESTS PASSED SUCCESSFULLY ---');
  } catch (error) {
    console.error('❌ QA TEST FAILED:', error.message || error);
    process.exit(1);
  }
}

runTests();
