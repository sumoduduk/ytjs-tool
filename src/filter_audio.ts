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

const filterFormat = (formats: Array<videoFormat>) => {
    return formats.filter(
        (format) => !!format.url && !format.hasVideo && format.hasAudio,
    );
};

export function filterAudio(formats: Array<videoFormat>) {
    formats = filterFormat(formats);
    formats.sort(sortFormatsByAudio);
    const bestFormat = formats[0];
    formats = formats.filter((f) => sortFormatsByAudio(bestFormat, f));

    const worstVideoQuality = formats
        .map((f) => parseInt(f.qualityLabel) || 0)
        .sort((a, b) => a - b)[0];
    let format = formats.find(
        (f) => (parseInt(f.qualityLabel) || 0) === worstVideoQuality,
    );
    return format;
}
