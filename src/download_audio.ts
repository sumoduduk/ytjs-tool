import ytdl, { videoInfo } from '@distube/ytdl-core';
import path from 'path';
import { Readable } from 'stream';
import fs from 'fs';
import fsPromises from 'fs/promises';

async function downloadAudioOnly(
    info: videoInfo,
    id: string,
    // videoDetails: MoreVideoDetails,
    // thumb: string,
) {
    const audioStream = ytdl.downloadFromInfo(info, {
        quality: 'highestaudio',
    });

    const tempMp3 = path.join('music', `${id}.webm`);

    console.log('Downloading audio...');
    await streamToFile(audioStream, tempMp3);
    console.log('Audio download complete.');

    await fsPromises.unlink(tempMp3);
    return tempMp3;
}

function streamToFile(stream: Readable, filePath: string) {
    return new Promise((resolve, reject) => {
        const writeStream = fs.createWriteStream(filePath);
        stream.pipe(writeStream);
        stream.on('end', resolve);
        stream.on('error', reject);
        writeStream.on('error', reject);
    });
}

async function youtubeDownloader(link: string, id: string) {
    try {
        const info = await ytdl.getInfo(link);

        // const videoDetails = info.videoDetails;
        // const thumb =
        //     info.player_response.microformat.playerMicroformatRenderer.thumbnail
        //         .thumbnails[0].url;

        return await downloadAudioOnly(info, id);
    } catch (err: any) {
        console.error('Youtube Downloader Error:\n', err);
        return {
            status: false,
            message: err.message,
        };
    }
}

export async function download_audio(link: string, id: string) {
    try {
        let path_music = await youtubeDownloader(link, id);

        if (typeof path_music == 'string') {
            console.log(path_music);
        }
    } catch (error) {
        console.log(error);
    }
}
