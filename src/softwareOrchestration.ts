import { createWriteStream, ensureFileSync } from 'fs-extra';
import { readCommands, setTargetCommands } from './commands';
import Chalk from 'chalk';
import type { Commands } from './commands';
import NodeSSH from 'node-ssh';
import SSH from './ssh';
import type { TargetCommands } from './commands';
import type { WriteStream } from 'fs';
import { backUpLogs } from './logs';
import { copyArtefacts } from './files';

export default class SoftwareOrchestration {
    commands: TargetCommands;
    target: string;
    resourceDirectory: string;

    constructor(target: string, resourceDirectory: string) {
        this.target = target;
        this.resourceDirectory = resourceDirectory;
        const formattedCommands: Commands = readCommands(resourceDirectory);

        this.commands = setTargetCommands(formattedCommands, target);
    }

    protected getDefaultExceptions(
        logStream: WriteStream,
        errorLogStream: WriteStream,
    ): SSHExecCommandOptions {
        return {
            cwd: '/',
            onStdout(chunk: Buffer): void {
                logStream.write(chunk.toString('utf8'));
            },
            onStderr(chunk: Buffer): void {
                errorLogStream.write(chunk.toString('utf8'));
            },
        };
    }

    public install(): void {
        const ssh = new SSH(this.target, this.resourceDirectory);
        const server = new NodeSSH();

        void (async () => {
            try {
                await copyArtefacts(ssh, this.resourceDirectory);
                await server
                    .connect(ssh)
                    .catch(function (error) {
                        console.log(Chalk.red('Error connecting to server.'));
                        console.log(error);
                    })
                    .then(async () => {
                        await this.commandRunner(server, this.commands.preProvision);
                        await this.commandRunner(server, this.commands.provision);
                        await this.commandRunner(server, this.commands.postProvision);
                    });
                backUpLogs();
                console.log(Chalk.green('Finished provisioning.'));
                process.exit(0);
            } catch (ErrorMessage) {
                throw Error(ErrorMessage);
            }
        })();
    }

    protected async commandRunner(server: NodeSSH, commands: string[]): Promise<void> {
        ensureFileSync(__dirname + '/../logs/command-output.log');
        ensureFileSync(__dirname + '/../logs/command-output-error.log');
        const logStream = createWriteStream(__dirname + '/../logs/command-output.log', {
            flags: 'a',
        });
        const errorLogStream = createWriteStream(__dirname + '/../logs/command-output-error.log', {
            flags: 'a',
        });
        const defaultExecOptions = this.getDefaultExceptions(logStream, errorLogStream);

        for (const command of commands) {
            // Provisioning commands are by default '' when no commands are specified.
            // In those cases we do need to run empty commands.
            if (command === '') {
                continue;
            }
            try {
                console.log(`Running: ${Chalk.green(command)}`);
                logStream.write(`------------ Start running ${command} \n`);
                errorLogStream.write(`------------ Start running ${command} \n`);
                await server.execCommand(command, defaultExecOptions);
            } catch (ErrorResponse) {
                throw Error(ErrorResponse);
            }
        }
        logStream.close();
        errorLogStream.close();
    }
}

interface SSHExecCommandOptions {
    cwd: string;
    onStdout: (chunk: Buffer) => void;
    onStderr: (chunk: Buffer) => void;
}
