const fs = require('fs');
const path = require('path');

// Source: PhishGuard-Detector project (adjust this path if your folder structure changes)
const sourcePath = path.resolve(
  __dirname,
  '../../OneDrive/Desktop/PhishGuard-Detector/rules/phishing_rules.json'
);

// Destination inside the Vite app
const destPath = path.resolve(__dirname, '../src/data/phishing_rules.json');

try {
  if (!fs.existsSync(sourcePath)) {
    console.warn('⚠️  phishing_rules.json not found at:', sourcePath);
    console.warn('   Make sure the PhishGuard-Detector project is in the expected location.');
    process.exit(0);
  }

  const content = fs.readFileSync(sourcePath, 'utf8');
  fs.writeFileSync(destPath, content);

  console.log('✅ Copied shared phishing rules to website:');
  console.log('   From:', sourcePath);
  console.log('   To:  ', destPath);
} catch (err) {
  console.error('❌ Failed to copy phishing rules:', err.message);
  process.exit(1);
}