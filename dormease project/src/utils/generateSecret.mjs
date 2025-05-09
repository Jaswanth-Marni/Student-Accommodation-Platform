import crypto from 'crypto';

export const generateJWTSecret = () => {
  // Generate a random 64-byte string and convert it to base64
  const secret = crypto.randomBytes(64).toString('base64');
  return secret;
};

// Generate and log the secret
const secret = generateJWTSecret();
console.log('Generated JWT Secret:');
console.log(secret);
console.log('\nCopy this secret and paste it into your .env file as JWT_SECRET='); 