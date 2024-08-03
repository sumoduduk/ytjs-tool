import { Downloader } from 'nodejs-file-downloader';
import { DOWNLOAD_PATH } from '..';

export async function downloadPlain(url: string, id: string) {
    let fileName = id + '.mp4';
    const downloader = new Downloader({
        url: url,
        directory: DOWNLOAD_PATH,
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
