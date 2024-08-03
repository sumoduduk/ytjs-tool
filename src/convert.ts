import { spawn, ChildProcess } from 'child_process';

export function convertCodec(
    inFile: string,
    outFile: string,
): Promise<boolean> {
    const cmdDest: string =
        process.platform === 'win32' ? '.\\data\\ffmpeg' : 'ffmpeg';

    return new Promise((resolve, reject) => {
        const ffmpeg: ChildProcess = spawn(cmdDest, [
            '-i',
            inFile,
            '-vn',
            '-ar',
            '44100',
            '-ac',
            '2',
            '-b:a',
            '192k',
            outFile,
        ]);

        const args_spawn = ffmpeg.spawnargs.join(' ');
        console.log('spawn args : ', args_spawn);

        ffmpeg.stdout?.on('data', (data) => {
            console.log(`stdout: success`);
        });

        ffmpeg.stderr?.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });

        ffmpeg.on('close', (code: number) => {
            if (code === 0) {
                resolve(true);
            } else {
                console.log('Process failed with exit code : ', code);
                reject(false);
            }
        });
    });
}

//spawn args ffmpeg -i assets/test.mp4 -vn -ar 4410 -ac 2 -b:a 192k assets/test.mp3
// "-i", in_file, "-vn", "-ar", "44100", "-ac", "2", "-b:a", "192k", out_file,
