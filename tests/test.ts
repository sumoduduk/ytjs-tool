import { expect } from 'chai';
import fs from 'fs';
import { videoFormat } from '../src/interfacce';
import { filterAudio } from '../src/filter_audio';

function loadVideoFormat() {
    let data = fs.readFileSync('assets/videoFormat.json', 'utf8');
    return JSON.parse(data) as Array<videoFormat>;
}

describe('filtter audio test', () => {
    it('will filter fot the best audio', () => {
        let formats = loadVideoFormat();
        let format = filterAudio(formats);

        console.log(format);

        expect(format?.hasAudio).to.eq(true);
        expect(format?.hasVideo).to.eq(false);
    });
});
