(async () => {
  try {
    // Login
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com', password: '123456' }),
    });
    console.log('Login status', loginRes.status);
    const cookies = loginRes.headers.get('set-cookie');
    console.log('Cookies header:', cookies);

    const cookieHeader = cookies ? cookies.split(';')[0] : '';

    // Request my-bids
    const res = await fetch('http://localhost:5000/api/bids/user/my-bids', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookieHeader,
      },
    });

    const text = await res.text();

    console.log('my-bids status:', res.status);
    console.log('my-bids body:', text);
  } catch (err) {
    console.error('Error:', err);
  }
})();
