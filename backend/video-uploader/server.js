const app = require('./app');
const http = require('http');

const port = process.env.PORT || 3000;
app.set('port', port);

const server = http.createServer(app);
server.listen(port);
server.on('listening', () => console.log(`Video Uploader Service running on port ${port}`));
