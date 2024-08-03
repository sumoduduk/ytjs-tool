import { ServerResponse } from 'http';
import { not_found, SOCKET_URL, URI } from '..';

import { filterAudio } from './filter_audio';
import { getInfoFormats } from './get_video_info';
import { download_audio } from './download_audio';

import { IDownloadData } from './interfacce';
import { downloadPlain } from './download_plain';
import { getInOutFileMp3, wait } from './util';
import { Socket } from 'socket.io-client';
import { convertCodec } from './convert';

interface IData {
    message: string;
    image_url: string | null;
    url: string;
    file_path: string | null;
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

    console.log('download now: ', uri_video);

    let data_before: IData = {
        message: 'failed',
        image_url: null,
        url: uri_video,
        file_path: null,
    };

    let json_data: IData | undefined = undefined;

    const startTime = Date.now();

    socket.emit('download-video', uri_video, 'highestaudio');

    socket.on('download-complete', async function (data) {
        const payload = data as IDownloadData;

        const finished_name = payload.FinishedName;
        if (finished_name.includes(id)) {
            console.log('payload', payload);
            console.log('Ready to Download');
            const uri = SOCKET_URL + `download?url=${finished_name}`;
            wait(1500);
            let data_download = await downloadPlain(uri, id);

            if (!data_download) {
                json_data = data_before;
            } else {
                data_before.message = data_download.downloadStatus;
                data_before.file_path = data_download.filePath;
                data_before.image_url = payload.thumbnail;
                json_data = data_before;
            }
        }
    });

    socket.once('download-error', function (data) {
        console.log('error download : ', data);
    });

    while (json_data == undefined) {
        if (Date.now() - startTime > 120000) {
            json_data = data_before;
        }

        await wait(300);
    }

    socket.on('disconnect', () => {
        console.log('disconnected from YT');
        socket.connect();
    });

    try {
        if (json_data.file_path == null) throw Error();

        let path_name = json_data.file_path;

        let { in_file, out_file } = getInOutFileMp3(path_name);

        let success = await convertCodec(in_file, out_file);
        if (!success) throw Error();

        json_data.file_path = out_file;

        res.writeHead(200, { 'Content-Type': 'application/json' });
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
    } finally {
        res.end(JSON.stringify(json_data));
    }
}
