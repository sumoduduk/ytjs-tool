import http, { ServerResponse } from 'http';
import { serveFilteredFormat } from './src/serve_format';
import { io } from 'socket.io-client';
import { IDownloadData } from './src/interfacce';
import { downloadPlain } from './src/download_plain';

export const URI = 'http://www.youtube.com/watch?v=';
const DownloadURI = 'https://yasifys.vmgware.dev/';

const socket = io('https://yasifys.vmgware.dev/');

socket.on('connect', () => {
    console.log('Client connected to server YT');
});

socket.on('download-complete', async function (data) {
    console.log('Ready to Download');
    const payload = data as IDownloadData;
    console.log('payload', payload);

    const finished_name = payload.FinishedName;
    const uri = DownloadURI + `download?url=${finished_name}`;
    await downloadPlain(uri);
});

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
