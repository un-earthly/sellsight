const fs = require('fs');
const path = require('path');

// Define folder structure
const structure = {
  src: {
    scrapers: ['marketplaceScraper.js'],
    services: ['dbService.js', 'analysisService.js'],
    jobs: ['cronJobs.js'],
    api: ['insightsApi.js'],
    'app.js': '',
    'config.js': '',
  },
  data: ['sellsight.db'],
  'package.json': '',
  'README.md': '',
};

// Function to create folders and files recursively
function createStructure(basePath, obj) {
  for (const key in obj) {
    const value = obj[key];
    const fullPath = path.join(basePath, key);

    if (Array.isArray(value)) {
      // It's a folder containing files
      if (!fs.existsSync(fullPath)) fs.mkdirSync(fullPath, { recursive: true });
      value.forEach((file) => {
        const filePath = path.join(fullPath, file);
        if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, '');
      });
    } else if (typeof value === 'object') {
      // Nested folder
      if (!fs.existsSync(fullPath)) fs.mkdirSync(fullPath, { recursive: true });
      createStructure(fullPath, value);
    } else {
      // File
      fs.writeFileSync(fullPath, '');
    }
  }
}

// Run generator
const projectRoot = path.join(__dirname, 'sellsight-server');
if (!fs.existsSync(projectRoot)) fs.mkdirSync(projectRoot);
createStructure(projectRoot, structure);

console.log('✅ SellSight server structure generated at ./sellsight-server');
