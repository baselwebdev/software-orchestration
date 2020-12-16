# Software orchestration

Provision software to remote servers and local virtual machines.

You can use this library to provision your remote infrastructure and  also utilise the same provisioning logic to your local virtual machine set up.

This repo used to be part of an internal monolithic software I developed for a personal project.

They have been open-sourced and split into three repos:

- [Repo retriever](https://github.com/baselwebdev/repo-retriever)

- [Software orchestration](https://github.com/baselwebdev/software-orchestration)

- [Infrastructure management](https://github.com/baselwebdev/infrastructure-management)

## TODO

- [ ] Add tests and get 100% test coverage

## Install

Install with [npm](https://www.npmjs.com/):

```sh
$ npm install software-orchestration
```

## Usage

Using the CLI

```sh
$ node bin/cli.js --help
Options:
  --help                   Show help                                   [boolean]
  --version                Show version number                         [boolean]
  --target, -t             Specify in which target environment the software
                           should be installed into.                    [string]
  --resourceDirectory, -d  Specify the resource directory absolute path. The resource
                           directory contains your commands, files you want to
                           upload and the ssh config file    [string] [required]
```

The resource directory:

```
root
│   commands.yaml
│
└─── files
    │   my_code.zip
    │   nginx.conf
    │   etc...
```

Define your commands to run on the VM and server in the commands.yaml file.

The commands.yaml file supports variables.

You can define optional pre-provision command that is unique to remote and local.

You can define optional post-provision command that is unique to remote and local.

The commands.yaml file example:

```yaml
variables:
  install: 'sudo yum install -q -y'
  node: '14.x'

preProvision:
  remote:
    - 'echo "export URL=test.com" >> ~/.bashrc'
    - 'mkdir /test.com'/
    - 'cd ~; unzip my_code.zip'
    - 'cd ~; sudo mv my_code/* /teast.com/'

  local:
    - 'echo "export URL=test-local.com" >> ~/.bashrc'

provision:
  - 'sudo yum update -q -y'
  # Enable software repos.
  - 'sudo amazon-linux-extras enable nginx1'
  # Install Nginx
  - '{{install}} nginx'
  # Add NodeJs mirror
  - '{{directory}} curl -sL https://rpm.nodesource.com/setup_{{node}} | sudo bash -'
  # Install nodejs
  - '{{install}} nodejs'
  # Install modules
  - 'cd /test.com/; npm install'

postProvision:
  remote:
    - 'cd /test.com/; npm run tests'
```

Please use the absolute path for privateKey.

You can 1 or more targets defined.

In the following example I am using one remote and local type target.

The ssh.json file example:

```json
{
  "target": [
    {
      "type": "remote",
      "host": "18.133.156.8",
      "username": "ec2-user",
      "privateKey": "my_key.pem"
    },
    {
      "type": "local",
      "host": "192.168.100.9",
      "username": "vagrant",
      "privateKey": "private_key"
    }
  ]
}
```

Software orchestration running:

![Redeploy in action](https://baselwebdevgifs.s3.eu-west-2.amazonaws.com/software-orchestration/infrastructure-orchestration-running.gif)

## About

### Contributing

Pull requests are always welcome. 

For bugs and feature requests, [please create an issue](../../issues/new).

### Author

**Basel Ahmed**

* [github/baselwebdev](https://github.com/baselwebdev)
* [twitter/baselwebdev](https://twitter.com/baselwebdev)

### License

Copyright © 2020, [Basel Ahmed](https://github.com/baselwebdev).
Released under the [MIT License](LICENSE).
