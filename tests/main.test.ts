import { expect, assert, describe, test } from 'vitest';
import { filterAudio } from '../src/filter_audio';
import {
    checkIfFileExists,
    getInOutFileMp3,
    loadVideoFormat,
} from '../src/util';
import { convertCodec } from '../src/convert';
import { rmSync } from 'fs';

const TIMEOUT = 20 * 1000;

describe('filter audio test', () => {
    test('will filter fot the best audio', () => {
        let formats = loadVideoFormat();
        let format = filterAudio(formats);

        expect(format?.hasAudio).to.eq(true);
        expect(format?.hasVideo).to.eq(false);
    });

    test(
        'convert mp4 to mp3',
        async () => {
            let path_name = 'assets/test.mp4';
            let { in_file, out_file } = getInOutFileMp3(path_name);

            let success = await convertCodec(in_file, out_file);

            if (success) {
                let is_exist = checkIfFileExists(out_file);
                expect(is_exist).to.eq(true);
                rmSync(out_file);
            } else {
                rmSync(out_file);
                assert.fail('converting mp4 failed');
            }
        },
        TIMEOUT,
    );
});
