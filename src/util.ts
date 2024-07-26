import fs from 'fs';
import { videoFormat } from './interfacce';

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

export function wait(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
