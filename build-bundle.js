// Build script to run browserify programmatically
const browserify = require('browserify');
const fs = require('fs');
const path = require('path');

const inputFile = path.join(__dirname, 'assets', 'js', 'differential-growth', 'entry.js');
const outputFile = path.join(__dirname, 'assets', 'js', 'differential-growth-bundle.js');

console.log('Building differential-growth-bundle.js...');
console.log('Input:', inputFile);
console.log('Output:', outputFile);

const b = browserify(inputFile);

b.bundle(function(err, buf) {
  if (err) {
    console.error('Error during bundle:', err);
    process.exit(1);
  }
  
  fs.writeFileSync(outputFile, buf);
  console.log('Bundle created successfully!');
  console.log('File size:', buf.length, 'bytes');
});

