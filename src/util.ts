import fs from 'fs';
import { videoFormat } from './interfacce';

export function loadVideoFormat() {
    let data = fs.readFileSync('assets/videoFormat.json', 'utf8');
    return JSON.parse(data) as Array<videoFormat>;
}
