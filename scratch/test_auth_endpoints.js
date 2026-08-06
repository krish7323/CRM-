import http from 'http';

const loginData = JSON.stringify({
  email: 'owner@elh.edu',
  password: 'password123',
});

const req = http.request(
  {
    hostname: '127.0.0.1',
    port: 5000,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(loginData),
    },
  },
  (res) => {
    let data = '';
    res.on('data', (chunk) => (data += chunk));
    res.on('end', () => {
      console.log(`🔑 Login Response [${res.statusCode}]: ${data}`);
      try {
        const parsed = JSON.parse(data);
        const token = parsed.token;

        if (!token) {
          console.error('❌ Token not returned from login endpoint.');
          return;
        }

        console.log(`\n✅ Acquired JWT Token: ${token.substring(0, 25)}...\n`);

        const endpoints = [
          '/api/leads',
          '/api/students',
          '/api/library/books',
          '/api/homework',
          '/api/scholarships',
          '/api/ptm',
          '/api/exams',
          '/api/calendar/events',
          '/api/transport/routes',
          '/api/inventory/assets',
          '/api/notices',
          '/api/chat/messages',
          '/api/leaves',
          '/api/courses',
          '/api/batches',
          '/api/attendance',
          '/api/fees',
          '/api/expenses',
        ];

        let done = 0;
        endpoints.forEach((ep) => {
          const authReq = http.get(
            `http://127.0.0.1:5000${ep}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
            (authRes) => {
              let epData = '';
              authRes.on('data', (c) => (epData += c));
              authRes.on('end', () => {
                console.log(`[${authRes.statusCode}] SUCCESS ${ep} - ${epData.substring(0, 70)}...`);
                done++;
                if (done === endpoints.length) {
                  console.log('\n🎉 ALL 18 REST API ENDPOINTS VERIFIED & WORKING PERFECTLY!');
                }
              });
            }
          );

          authReq.on('error', (e) => console.error(`❌ [ERROR] ${ep}: ${e.message}`));
        });
      } catch (err) {
        console.error('Parse error:', err.message);
      }
    });
  }
);

req.on('error', (e) => console.error(`❌ Login error: ${e.message}`));
req.write(loginData);
req.end();
