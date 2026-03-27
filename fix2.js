const fs = require('fs');
let content = fs.readFileSync('client/src/pages/Home.tsx', 'utf8');

// Replace all hardcoded rgba(139,92,246, opacity) with hsl(var(--primary) / opacity)
content = content.replace(/rgba\(139,92,246,([0-9.]+)\)/g, 'hsl(var(--primary) / $1)');

fs.writeFileSync('client/src/pages/Home.tsx', content);
console.log("Replacements done for shadows!");
