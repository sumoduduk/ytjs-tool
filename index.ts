import http, { ServerResponse } from 'http';
import { serveFilteredFormat } from './src/serve_format';

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
            serveFilteredFormat(url, res);
    }
});

const PORT = 6969;
server.listen(PORT, () => {
    console.log('Server Listen for port = ' + PORT);
});
