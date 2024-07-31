import { Downloader } from 'nodejs-file-downloader';

import { get_randIP } from './get_rand';

export async function downloadPlain(url: string, id: string) {
    let fileName = id + '.mp4';
    const downloader = new Downloader({
        url: url,
        directory: './music',
        skipExistingFileName: true,
        fileName,
    });
    try {
        const report = await downloader.download();
        console.log('Download Complete', report);
        return report;
    } catch (error) {
        console.log('Download plain error', error);
    }
}

async function downloadWithProxy(url: string) {
    let ip = await get_randIP();
    if (!ip) return console.log('error rand ip');

    const downloader = new Downloader({
        url: url,
        proxy: ip,
        directory: './music',
    });
    try {
        const report = await downloader.download();
        console.log('Download Complete', report);
        return report;
    } catch (error) {
        console.log('Download plain error', error);
    }
}
