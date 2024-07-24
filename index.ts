import { youtubeDownloader } from './src/download_audio';

let id = '0yBnIUX0QAE';
let url = 'http://www.youtube.com/watch?v=';

let link = url + id;
console.log(link);

async function download() {
    try {
        let path_music = await youtubeDownloader(link, id);

        if (typeof path_music == 'string') {
            console.log(path_music);
        }
    } catch (error) {
        console.log(error);
    }
}

download();
