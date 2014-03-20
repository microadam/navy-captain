# navy-captain

![build status](http://ci.microadam.co.uk/microadam/navy-captain/badge)

Executes orders (tasks) received from the [Admiral](http://github.com/microadam/navy-admiral) which have been issued via the [comms](http://github.com/microadam/navy-comms) CLI.

## Installation

    npm install -g navy-captain

## Usage

    captaind --help

## Quickstart Demo

To quickly get a Captain up and running so you can see how it works, run the following commands:

    git clone git@github.com:microadam/navy-captain.git
    cd navy-captain/example/
    captaind -c config.js

This will give you a Captain that is able to execute the 'test' order for the 'testApp' application.

## Configuration

When a Captain is initialised, it must be given a config file. The config file is used to determine how the Captain will behave, as well as dictating what orders it is able to run and where the [Admiral](http://github.com/microadam/navy-admiral) is located.

For an example config file, please see the 'example' directory.

## Orders

Orders are the tasks that a Captain knows how to execute.

For an example order, please see the 'example' directory.

See [here](https://github.com/microadam/navy-captain/wiki/Developing-Orders) for a detailed guide on how to develop your own Orders.
