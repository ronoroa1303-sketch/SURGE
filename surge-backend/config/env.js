const checkEnvVars = () => {
  const missing = [];
  const requiredVars = [
    'MONGO_URI',
    'JWT_SECRET',
    'RAZORPAY_KEY_ID',
    'RAZORPAY_KEY_SECRET',
    'SMTP_HOST',
    'SMTP_USER',
    'SMTP_PASS'
  ];

  requiredVars.forEach((envVar) => {
    if (!process.env[envVar]) {
      missing.push(envVar);
    }
  });

  if (missing.length > 0) {
    console.error('CRITICAL: Missing required environment variables:');
    missing.forEach((variable) => console.error(`- ${variable}`));
    process.exit(1);
  }
};

export default checkEnvVars;
