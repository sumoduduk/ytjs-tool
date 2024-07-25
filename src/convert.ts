import { promisify } from 'util';
import { exec } from 'child_process';
import { promises as fs } from 'fs';

const asyncExec = promisify(exec);

export async function convertCodec(
    videoId: string,
): Promise<{ stdout: string; stderr: string }> {
    const inFile: string = `music/${videoId}.mp4`;
    const outFile: string = `music/${videoId}.mp3`;

    const cmdDest: string =
        process.platform === 'win32' ? '.\\data\\ffmpeg' : 'ffmpeg';

    const { stdout, stderr } = await asyncExec(
        `${cmdDest} -i ${inFile} -vn -ar 44100 -ac 2 -b:a 192k ${outFile}`,
    );

    // await fs.unlink(inFile);

    return { stdout, stderr };
}
