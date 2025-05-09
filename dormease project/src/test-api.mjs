import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

async function testAuth() {
  try {
    // Test registration
    console.log('Testing registration...');
    const registerResponse = await axios.post(`${API_URL}/auth/register`, {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      phone: '1234567890',
      address: 'Test Address',
      userType: 'student'
    });
    console.log('Registration successful:', registerResponse.data);

    // Test login
    console.log('\nTesting login...');
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: 'test@example.com',
      password: 'password123'
    });
    console.log('Login successful:', loginResponse.data);

    const token = loginResponse.data.token;

    // Test getting listings
    console.log('\nTesting listings...');
    const listingsResponse = await axios.get(`${API_URL}/listings`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Listings fetched successfully:', listingsResponse.data);

  } catch (error) {
    console.error('Test failed:', error.response?.data || error.message);
  }
}

testAuth(); 