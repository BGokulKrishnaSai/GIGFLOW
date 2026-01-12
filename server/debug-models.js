const Bid = require('./models/Bid');
const Gig = require('./models/Gig');
const User = require('./models/User');
console.log('Bid type:', typeof Bid);
console.log('Bid keys:', Object.keys(Bid));
console.log('Bid.find exists?', typeof Bid.find);
console.log('Gig type:', typeof Gig);
console.log('User type:', typeof User);
