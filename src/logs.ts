import { mkdirpSync, moveSync, readdirSync } from 'fs-extra';
import { projectDirectory } from './fileManager';
import { replaceAll } from './strModification';

export function backUpLogs(): void {
    const date = new Date();
    const currentTime =
        replaceAll(date.toLocaleDateString('en-UK'), '/', '.') +
        '-' +
        replaceAll(date.toLocaleTimeString('en-UK', { hour12: true }), ' ', '-');
    const logDirectory = projectDirectory + 'logs/' + currentTime + '/';
    const files = readdirSync(projectDirectory + 'logs/');

    mkdirpSync(logDirectory);

    try {
        files.forEach((file: string) => {
            if (file.endsWith('.log')) {
                const fileLocation = projectDirectory + 'logs/' + file;
                const newLocation = logDirectory + file;

                moveSync(fileLocation, newLocation);
            }
        });
    } catch (ErrorMessage) {
        throw Error(`Failed moving logs: ${ErrorMessage as string}`);
    }
}
