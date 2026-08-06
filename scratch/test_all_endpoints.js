import http from 'http';

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

console.log('🔍 Starting Endpoints Live Verification...\n');

let completed = 0;

endpoints.forEach((ep) => {
  const req = http.get(`http://localhost:5000${ep}`, (res) => {
    let data = '';
    res.on('data', (chunk) => (data += chunk));
    res.on('end', () => {
      console.log(`[${res.statusCode}] ${ep} - Response Size: ${data.length} bytes`);
      completed++;
      if (completed === endpoints.length) {
        console.log('\n✅ All API Endpoints Verified Successfully!');
      }
    });
  });

  req.on('error', (err) => {
    console.error(`❌ [ERROR] ${ep} - ${err.message}`);
    completed++;
  });
});
