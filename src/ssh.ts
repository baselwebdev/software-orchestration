import Chalk from 'chalk';
import Process from 'process';
import { readFileSync } from './fileManager';

interface sshFile {
    target: [SSHConfigProperties];
}

export interface SSHConfigProperties {
    type: string;
    host: string;
    username: string;
    privateKey: string;
}

export default class SSH {
    readonly type: string;
    readonly host: string;
    readonly username: string;
    readonly privateKey: string;

    constructor(target: string, resourceDirectory: string) {
        try {
            const sshConfigs = readFileSync(resourceDirectory + '/ssh.json') as sshFile;
            const sshTargetConfig = this.getSSHConfig(target, sshConfigs);

            this.type = sshTargetConfig.type;
            this.host = sshTargetConfig.host;
            this.username = sshTargetConfig.username;
            this.privateKey = sshTargetConfig.privateKey;
        } catch (e) {
            throw Error(
                Chalk.red('Failed finding the ssh file at: ' + resourceDirectory + '/ssh.json'),
            );
        }
    }

    protected getSSHConfig(target: string, sshConfigs: sshFile): SSHConfigProperties {
        const targetCount = sshConfigs.target.length;
        let sshConfig = undefined;

        for (let i = 0; i < targetCount; i++) {
            if (sshConfigs.target[i].type === target) {
                sshConfig = sshConfigs.target[i];
            }
        }
        if (sshConfig === undefined) {
            console.log(
                Chalk.red('We could not find SSH config for your SSH target server: ' + target),
            );
            Process.exit(8);
        }

        return sshConfig;
    }
}
