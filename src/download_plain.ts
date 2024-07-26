import { Downloader } from 'nodejs-file-downloader';

export async function downloadPlain(url: string) {
    const downloader = new Downloader({
        url: url,
        directory: './music',
    });
    try {
        const report = await downloader.download();
        console.log('Download Complete', report);
    } catch (error) {
        console.log('Download plain error', error);
    }
}
