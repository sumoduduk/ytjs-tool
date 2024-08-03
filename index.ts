import http, { ServerResponse } from 'http';
import { serveFilteredFormat } from './src/serve_format';
import * as dotenv from 'dotenv';
import { io } from 'socket.io-client';

dotenv.config();

export const SOCKET_URL = process.env.SOCKET_URL as string;
const socket = io(SOCKET_URL);

export const DOWNLOAD_PATH = process.env.PATH_FOLDER as string;

socket.on('connect', () => {
    console.log('Client connected to server YT');
});

export const URI = process.env.URI as string;

export const not_found = (res: ServerResponse) => {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Page Not Found');
};

const server = http.createServer(async (req, res) => {
    const url = req.url;

    switch (url) {
        case '/':
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('Welcome');
            break;

        case '/about':
            console.log(url);
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('This is about');
            break;

        default:
            if (!url) return not_found(res);
            serveFilteredFormat(url, res, socket);
    }
});

const PORT = 6969;
server.listen(PORT, () => {
    console.log('Server Listen for port = ' + PORT);
});
