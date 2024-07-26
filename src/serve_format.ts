import { ServerResponse } from 'http';
import { not_found, URI } from '..';

import { filterAudio } from './filter_audio';
import { getInfoFormats } from './get_video_info';
import { download_audio } from './download_audio';
import { Socket } from 'socket.io-client';

export async function serveFilteredFormat(
    url: string,
    res: ServerResponse,
    socket: Socket,
) {
    const id = url.split('/')[1];

    if (id.length === 0) return not_found(res);

    if (id.toLowerCase() == 'download') return downloadSong(url, res);
    if (id.toLowerCase() == 'send') return sendCase(url, res, socket);

    const formats = await getInfoFormats(URI + id);
    if (!formats) return not_found(res);

    let filtered = filterAudio(formats);
    if (!filtered) return not_found(res);

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(filtered));
}

async function downloadSong(url: string, res: ServerResponse) {
    try {
        const id = url.split('/')[2];
        if (id.length === 0) return not_found(res);
        const link = URI + id;
        console.log(link);
        await download_audio(link, id);

        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Download Success');
    } catch (error) {
        not_found(res);
    }
}

async function sendCase(url: string, res: ServerResponse, socket: Socket) {
    const id = url.split('/')[2];
    if (id.length == 0) return not_found(res);
    const uri_video = URI + id;
    console.log(uri_video);

    socket.emit('download-video', uri_video, 'highestvideo');

    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Event emitted!');
}
