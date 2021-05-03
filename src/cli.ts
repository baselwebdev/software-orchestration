#!/usr/bin/env node

import SoftwareOrchestration from './softwareOrchestration';
import Yargs from 'yargs';

Yargs.options({
    target: {
        demandOption: true,
        alias: 't',
        type: 'string',
        description: 'Specify in which target environment the software should be installed into.',
    },
    resourceDirectory: {
        demandOption: true,
        alias: 'd',
        type: 'string',
        description:
            'Specify the resource directory. ' +
            'The resource directory contains your commands, files you want to upload and the ssh config file',
    },
}).strict().argv;

const software = new SoftwareOrchestration(
    Yargs.argv.target as string,
    Yargs.argv.resourceDirectory as string,
);

software.install();
