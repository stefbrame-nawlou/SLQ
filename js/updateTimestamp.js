const fs = require("fs");
const path = require("path");

// Path to menu.js (relative to this script)
const filePath = path.join(__dirname, "menu.js");  // __dirname is js/ folder

// Get current timestamp
const now = new Date();
const timestamp = now.toISOString().replace("T", " ").split(".")[0]; // e.g., 2025-12-13 15:45:02

// Read menu.js
let content = fs.readFileSync(filePath, "utf8");

// Replace placeholder
content = content.replace(/__COMMIT_TIMESTAMP__/g, timestamp);

// Write back
fs.writeFileSync(filePath, content, "utf8");

console.log("Commit timestamp updated to:", timestamp);
