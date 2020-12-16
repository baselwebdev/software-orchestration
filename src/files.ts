import Chalk from 'chalk';
import Execa from 'execa';
import type { SSHConfigProperties } from './ssh';
import { listFiles } from './fileManager';

export async function copyArtefacts(
    config: SSHConfigProperties,
    resourceDirectory: string,
): Promise<void> {
    const files = listFiles(resourceDirectory + '/files');
    const scp = `scp -o IdentitiesOnly=yes -o StrictHostKeyChecking=no -q -i ${config.privateKey} `;
    const fileCopyOver: Promise<void>[] = [];

    files.forEach((file: string) => {
        const copyOver = Execa.command(`${scp} ${file} ${config.username}@${config.host}:~/`)
            .catch((error) => {
                console.log(
                    Chalk.red(
                        `Failed transferring the ${file} file over to server. Exiting the process.`,
                    ),
                );
                console.log(error);
                process.exit(8);
            })
            .then(() => {
                console.log(`Transferred ${Chalk.green(file)} file to server.`);
            });

        fileCopyOver.push(copyOver);
    });

    await Promise.all(fileCopyOver);
}
