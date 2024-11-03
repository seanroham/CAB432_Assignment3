const app = require('./app');
const http = require('http');

const port = process.env.PORT || 3003;
app.set('port', port);

const server = http.createServer(app);
server.listen(port);
server.on('listening', () => console.log(`Auth Service running on port ${port}`));
