const app = require('./app');
const http = require('http');
const { pollMessages } = require('./controllers/sqsPoller');
const port = process.env.PORT || 3002;
app.set('port', port);

const server = http.createServer(app);



server.listen(port);
server.on('listening', () => console.log(`Media Processor Service running on port ${port}`));

pollMessages (); // Start polling SQS for messages
console.log("Started SQS polling...");
