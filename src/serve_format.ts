import { ServerResponse } from 'http';
import { not_found, SOCKET_URL, URI } from '..';

import { filterAudio } from './filter_audio';
import { getInfoFormats } from './get_video_info';
import { download_audio } from './download_audio';
import { Socket } from 'socket.io-client';

import { IDownloadData } from './interfacce';
import { downloadPlain } from './download_plain';
import { wait } from './util';

interface IData {
    message: string;
    url: string;
    file_path: string;
}

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

    let data: IData = {
        message: 'failed',
        url: uri_video,
        file_path: 'failed download',
    };

    let json_data: typeof data | undefined = undefined;

    const startTime = Date.now();

    socket.emit('download-video', uri_video, 'highestvideo');

    socket.on('download-complete', async function (data) {
        console.log('Ready to Download');
        const payload = data as IDownloadData;
        console.log('payload', payload);

        const finished_name = payload.FinishedName;
        const uri = SOCKET_URL + `download?url=${finished_name}`;
        let data_download = await downloadPlain(uri);

        if (!data_download) {
            json_data = data;
        } else {
            data.message = data_download.downloadStatus;
            data.file_path = data_download.filePath;
        }
    });

    while (typeof json_data == undefined) {
        if (Date.now() - startTime > 300000) {
            json_data = data;
        }

        await wait(300);
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });

    res.end(JSON.stringify(json_data));
}
