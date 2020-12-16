import jsonfile from 'jsonfile';
import { readdirSync } from 'fs-extra';

export const projectDirectory = __dirname + '/../';

// eslint-disable-next-line @typescript-eslint/ban-types
export function readFileSync(location: string): {} {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return jsonfile.readFileSync(location);
}

export function listFiles(location: string): string[] {
    const filesFullPaths: string[] = [];
    const files = readdirSync(location);

    files.forEach((file) => {
        filesFullPaths.push(location + '/' + file);
    });

    return filesFullPaths;
}
