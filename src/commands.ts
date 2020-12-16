import { YAMLException } from 'js-yaml';
import { listFiles } from './fileManager';
import { readFileSync } from 'fs-extra';
import { replaceAll } from './strModification';
import yaml from 'js-yaml';

export interface Commands {
    variables?: Record<string, string>;
    preProvision?: {
        remote?: string[];
        local?: string[];
    };
    provision: string[];
    postProvision?: {
        remote?: string[];
        local?: string[];
    };
}

export function readCommands(resourceDirectory: string): Commands {
    const resourceFiles = listFiles(resourceDirectory);
    const commandFile = resourceFiles.find((file: string) => {
        return file.endsWith('.yaml');
    });

    if (typeof commandFile === 'undefined') {
        throw Error(`No .yaml found in the directory: ` + resourceDirectory);
    }

    try {
        let fileContents = readFileSync(commandFile, 'utf8');
        const content = yaml.load(fileContents) as Commands;

        if (typeof content.variables !== 'undefined') {
            const keys = Object.keys(content.variables);

            keys.forEach((key) => {
                if (typeof content.variables !== 'undefined') {
                    fileContents = replaceAll(
                        fileContents,
                        `{{${key}}}`,
                        content.variables[`${key}`],
                    );
                }
            });
        }

        return yaml.safeLoad(fileContents) as Commands;
    } catch (e) {
        if (e instanceof YAMLException) {
            throw Error('Cannot read command yaml file: ' + e.message);
        } else {
            throw Error('Cannot read command yaml file.');
        }
    }
}

export function setTargetCommands(formatted: Commands, target: string): TargetCommands {
    // By default command list is empty.
    const commands: TargetCommands = {
        preProvision: [],
        provision: [],
        postProvision: [],
    };

    commands.provision = formatted.provision;

    // Exit program if no provisioning command is found.
    if (commands.provision.length === 0) {
        throw Error(
            'No provisioning command is defined.\n Please define at least one command in your commands yaml file.',
        );
    }

    commands.provision.find((command: string | null): void => {
        if (command === null) {
            throw Error('We have a command item that is empty.');
        }
    });

    switch (target) {
        case 'remote':
            if (typeof formatted.preProvision !== 'undefined' && formatted.preProvision !== null) {
                if (typeof formatted.preProvision.remote !== 'undefined') {
                    commands.preProvision = formatted.preProvision.remote;
                }
            }
            if (
                typeof formatted.postProvision !== 'undefined' &&
                formatted.postProvision !== null
            ) {
                if (typeof formatted.postProvision.remote !== 'undefined') {
                    commands.postProvision = formatted.postProvision.remote;
                }
            }
            break;
        case 'local':
            if (typeof formatted.preProvision !== 'undefined' && formatted.preProvision !== null) {
                if (typeof formatted.preProvision.local !== 'undefined') {
                    commands.preProvision = formatted.preProvision.local;
                }
            }
            if (
                typeof formatted.postProvision !== 'undefined' &&
                formatted.postProvision !== null
            ) {
                if (typeof formatted.postProvision.local !== 'undefined') {
                    commands.postProvision = formatted.postProvision.local;
                }
            }
            break;
    }

    return commands;
}

export interface TargetCommands {
    preProvision: string[];
    provision: string[];
    postProvision: string[];
}
