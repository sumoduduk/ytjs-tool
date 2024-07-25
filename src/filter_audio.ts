import { videoFormat } from './interfacce';

const audioEncodingRanks = ['mp4a', 'mp3', 'vorbis', 'aac', 'opus', 'flac'];

const getAudioBitrate = (format: videoFormat) => format.audioBitrate || 0;
const getAudioEncodingRank = (format: videoFormat) =>
    audioEncodingRanks.findIndex(
        (enc) => format.codecs && format.codecs.includes(enc),
    );

const sortFormatsBy = (
    a: videoFormat,
    b: videoFormat,
    sortBy: Array<(x: videoFormat) => number>,
) => {
    let res = 0;
    for (let fn of sortBy) {
        res = fn(b) - fn(a);
        if (res !== 0) {
            break;
        }
    }
    return res;
};

const sortFormatsByAudio = (a: videoFormat, b: videoFormat) =>
    sortFormatsBy(a, b, [getAudioBitrate, getAudioEncodingRank]);

function filterAudio(formats: Array<videoFormat>) {}
