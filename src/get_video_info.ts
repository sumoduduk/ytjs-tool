import ytdl from '@distube/ytdl-core';
import { getRandomIPv6 } from '@distube/ytdl-core/lib/utils';

export async function getInfo(link: string) {
    try {
        const agentForAnotherRandomIP = ytdl.createAgent(undefined, {
            localAddress: getRandomIPv6('2001:2::/48'),
        });

        let info = await ytdl.getInfo(link, {
            agent: agentForAnotherRandomIP,
        });
        console.log(info.formats);
    } catch (error) {
        console.error(error);
    }
}
