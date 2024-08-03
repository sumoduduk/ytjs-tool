import fs from 'fs';
import { videoFormat } from './interfacce';
import path from 'path';

export function loadVideoFormat() {
    let data = fs.readFileSync('assets/videoFormat.json', 'utf8');
    return JSON.parse(data) as Array<videoFormat>;
}

export function checkIfFileExists(filePath: string) {
    try {
        fs.accessSync(filePath, fs.constants.F_OK);
        console.log('File exists');
        return true;
    } catch (err: any) {
        if (err.code === 'ENOENT') {
            console.log('File does not exist');
            console.log('Downloading audio...');
            return false;
        } else {
            throw err;
        }
    }
}

export function getInOutFileMp3(path_file: string) {
    let parent = path.dirname(path_file);
    let stem_name = path.basename(path_file, path.extname(path_file));

    let file_name = stem_name + '.mp3';
    let out_file = path.join(parent, file_name);

    return {
        in_file: path_file,
        out_file,
    };
}

export function wait(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
