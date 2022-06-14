const express = require('express');
const path = require('path');
const cors = require('cors');
// const http = require('http');
const process = require('process');
const app = express();

const stream = require('youtube-audio-stream');

const corsOptions = {
    origin: ['https://192.168.1.131:3000', 'https://localhost:3000', 'https://localhost:4173'],
    optionsSuccessStatus: 200
}

app.get('/stream/:videoId', cors(corsOptions), async function (req, res) {
    try {
        res.set({'Content-Type': 'audio/mpeg'});
        stream(req.params.videoId).pipe(res);
    } catch (exception) {
        res.status(500).send(exception)
    }
});

// app.use(express.static(path.join(__dirname, '../views/dist')));
app.use('/', express.static('public'));


// const server = http.createServer(app);
app.listen(process.env.PORT || 8000, '0.0.0.0', () => {
    console.log(`server is running on port ${process.env.PORT || 8000}`)
});
