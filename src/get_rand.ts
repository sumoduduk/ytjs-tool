import * as dotenv from 'dotenv';
dotenv.config();

const RAND_IP = process.env.URI_RAND as string;

export async function get_randIP() {
    try {
        let response = await fetch(RAND_IP);

        const reader = response.body?.getReader();
        if (!reader) {
            throw new Error('Failed to get reader for the response body');
        }

        const decoder = new TextDecoder();

        const ipTab: Array<string> = [];

        while (true) {
            const { done, value } = await reader.read();
            if (ipTab.length > 100) {
                break;
            }

            const chunk = decoder.decode(value, { stream: true });
            chunk.split('\n').forEach((c) => {
                if (isValidIPAddressWithPort(c)) {
                    ipTab.push(c);
                }
            });
        }

        let rand = Math.floor(Math.random() * (100 - 1 + 1)) + 1;
        return ipTab[rand];
    } catch (error) {
        console.log(error);
    }
}

function isValidIPAddressWithPort(inputString: string) {
    const ipAddressWithPortPattern =
        /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}:[0-9]{1,5}$/;
    return ipAddressWithPortPattern.test(inputString);
}
