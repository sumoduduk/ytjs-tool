import http, { ServerResponse } from 'http';
import { filterAudio } from './src/filter_audio';
import { getInfoFormats } from './src/get_video_info';

const URL = 'http://www.youtube.com/watch?v=';

const not_found = (res: ServerResponse) => {
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
            const id = url.split('/')[1];

            if (id.length === 0) return not_found(res);

            const formats = await getInfoFormats(URL + id);
            if (!formats) return not_found(res);

            let filtered = filterAudio(formats);
            if (!filtered) return not_found(res);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(filtered));
    }
});

const PORT = 6969;
server.listen(PORT, () => {
    console.log('Server Listen for port = ' + PORT);
});
