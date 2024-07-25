import { expect } from 'chai';
import { filterAudio } from '../src/filter_audio';
import { loadVideoFormat } from '../src/util';

describe('filtter audio test', () => {
    it('will filter fot the best audio', () => {
        let formats = loadVideoFormat();
        let format = filterAudio(formats);

        console.log(format);

        expect(format?.hasAudio).to.eq(true);
        expect(format?.hasVideo).to.eq(false);
    });
});
