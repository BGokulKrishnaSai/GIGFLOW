const path = require('path');
const resolved = require.resolve('./models/Bid');
console.log('Resolved path:', resolved);
const mod = require(resolved);
console.log('Exported type:', typeof mod);
console.log('Is mongoose model?', mod && mod.modelName);
console.log('Mongoose models keys:', Object.keys(require('mongoose').models));
console.log('Module cache keys snippet:');
Object.keys(require.cache).filter(k => k.includes('models')).forEach(k => console.log('-', k));
