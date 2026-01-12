(async () => {
  try {
    // Login first to obtain cookie
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com', password: '123456' }),
    });

    const cookies = loginRes.headers.get('set-cookie');
    console.log('Login status', loginRes.status);
    if (!cookies) {
      console.error('No cookie returned from login');
      console.log('Login body:', await loginRes.text());
      return;
    }

    // Use the returned cookie to submit a bid
    const cookieHeader = cookies.split(';')[0];

    const bidRes = await fetch('http://localhost:5000/api/bids', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookieHeader,
      },
      body: JSON.stringify({ gigId: '<REPLACE_GIG_ID>', message: 'Hello, I can do this', bidAmount: 500 }),
    });

    console.log('Bid status:', bidRes.status);
    console.log('Bid body:', await bidRes.text());
  } catch (err) {
    console.error('Error:', err);
  }
})();