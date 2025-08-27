// generateStructure.js
const fs = require("fs");
const path = require("path");

const structure = {
  "backend": {
    "package.json": "",
    ".env": "",
    "server.js": "// Entry point\n",
    "config": {
      "db.js": "// MongoDB connection\n"
    },
    "models": {
      "productModel.js": "// Products schema\n",
      "analysisModel.js": "// Analysis schema\n"
    },
    "scraper": {
      "index.js": "// Main scraper flow (scraper → LLM → DB)\n",
      "marketplaces": {
        "codecanyonScraper.js": ""
      }
    },
    "llm": {
      "model.js": "// Load local LLM\n",
      "analyzer.js": "// Transform raw scrape via LLM\n"
    },
    "analysis": {
      "analyzer.js": "// Compute metrics (optional, post-DB)\n"
    },
    "api": {
      "routes.js": "// Express routes\n"
    },
    "cron": {
      "scheduler.js": "// node-cron setup\n"
    },
    "utils": {
      "helpers.js": "// Helper functions\n"
    }
  }
};

function createStructure(basePath, obj) {
  for (const name in obj) {
    const targetPath = path.join(basePath, name);
    if (typeof obj[name] === "string") {
      // Create file
      fs.mkdirSync(basePath, { recursive: true });
      fs.writeFileSync(targetPath, obj[name], "utf8");
      console.log("Created file:", targetPath);
    } else {
      // Create directory
      fs.mkdirSync(targetPath, { recursive: true });
      console.log("Created directory:", targetPath);
      createStructure(targetPath, obj[name]);
    }
  }
}

createStructure(process.cwd(), structure);

