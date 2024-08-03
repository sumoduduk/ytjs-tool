import ytdl, { videoInfo } from '@distube/ytdl-core';
import path from 'path';
import { Readable } from 'stream';
import fs from 'fs';
// import fsPromises from 'fs/promises';
import { filterAudio } from './filter_audio';

// @ts-ignore
import { getRandomIPv6 } from '@distube/ytdl-core/lib/utils';
import { checkIfFileExists } from './util';
import { convertCodec } from './convert';

async function downloadAudioOnly(
    info: videoInfo,
    id: string,
    extentions: string,
    // videoDetails: MoreVideoDetails,
    // thumb: string,
) {
    const tempMp3 = path.join('music', `${id}.${extentions}`);
    if (checkIfFileExists(tempMp3)) return;
    const agentForAnotherRandomIP = ytdl.createAgent(undefined, {
        localAddress: getRandomIPv6('2001:2::/48'),
    });

    const audioStream = ytdl.downloadFromInfo(info, {
        quality: 'highestaudio',
        agent: agentForAnotherRandomIP,
    });

    // await streamToFile(audioStream, tempMp3);
    const write_stream = audioStream.pipe(fs.createWriteStream(tempMp3));

    write_stream.on('finish', () => {
        console.log('Audio download complete.');

        // convertCodec(id);
    });

    return tempMp3;
}

function streamToFile(stream: Readable, filePath: string) {
    return new Promise((resolve, reject) => {
        const writeStream = fs.createWriteStream(filePath);
        stream.pipe(writeStream);
        stream.on('end', resolve);
        stream.on('error', reject);
        writeStream.on('error', reject);
        writeStream.on('finish', resolve);
    });
}

async function youtubeDownloader(link: string, id: string) {
    try {
        const agentForAnotherRandomIP = ytdl.createAgent(undefined, {
            localAddress: getRandomIPv6('2001:2::/48'),
        });

        let info = await ytdl.getInfo(link, {
            agent: agentForAnotherRandomIP,
        });

        let extentions = 'webm';

        const format_higest = filterAudio(info.formats);
        if (format_higest) {
            extentions = format_higest.container;
        }

        // const videoDetails = info.videoDetails;
        // const thumb =
        //     info.player_response.microformat.playerMicroformatRenderer.thumbnail
        //         .thumbnails[0].url;

        return await downloadAudioOnly(info, id, extentions);
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
