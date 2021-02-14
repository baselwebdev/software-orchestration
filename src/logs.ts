import { mkdirpSync, moveSync, readdirSync } from 'fs-extra';
import { projectDirectory } from './fileManager';

export function backUpLogs(): void {
    const logDirectory = projectDirectory + 'logs/' + getFormattedTimeStamp() + '/';
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

function getFormattedTimeStamp(): string {
    const date = new Date();
    const year = date.getFullYear().toString();
    const month = fullSizeDateNumber(date.getMonth() + 1);
    const day = fullSizeDateNumber(date.getDate());
    const hours = fullSizeDateNumber(date.getHours());
    const minutes = fullSizeDateNumber(date.getMinutes());
    const seconds = fullSizeDateNumber(date.getSeconds());

    return `${year}.${month}.${day}-${hours}:${minutes}:${seconds}`;
}

function fullSizeDateNumber(date: number): string {
    if (date < 10) {
        return `0${date}`;
    }

    return date.toString();
}
