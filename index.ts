import { exit } from 'process';
import { getInfo } from './src/get_video_info';

const args = Bun.argv;

if (args.length < 3) {
    console.log('provide id');
    exit();
}

let id = args[2];
let url = 'http://www.youtube.com/watch?v=';

async function begin() {
    if (!id) return console.log('NO ID');
    let link = url + id;

    await getInfo(link);
}

begin();
