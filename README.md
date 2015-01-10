# MCAC

[![Build Status](https://travis-ci.org/openmcac/mcac-js.svg)](https://travis-ci.org/openmcac/mcac-js)
[![Code Climate](https://codeclimate.com/github/openmcac/mcac-js/badges/gpa.svg)](https://codeclimate.com/github/openmcac/mcac-js)

This repository holds the code for the JavaScript application that will run on
mcac.church. It is meant to communicate with a Rails server that mounts
[Basechurch][b] @ `/api/`.

[b]: http://github.com/openmcac/basechurch

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](http://git-scm.com/)
* [Node.js](http://nodejs.org/) (with NPM) and [Bower](http://bower.io/)

*If you need help installing these prerequisites on Ubuntu, see the
[Getting Started][gs] guide.*

[gs]: GETTING_STARTED-UBUNTU.md

## Installation

* `git clone git@github.com:openmcac/mcac-js` this repository
* change into the new directory
* `npm install`
* `bower install`
* `npm install -g ember-cli`
* `npm install -g phantomjs`


## Running / Development

* `ember server`
* Visit your app at [http://localhost:4200](http://localhost:4200).

### Code Generators

Make use of the many generators for code, try `ember help generate` for more details

### Running Tests

* `ember test`
* `ember test --server`

### Building

* `ember build` (development)
* `ember build --environment production` (production)

### Deploying

TODO

## Further Reading / Useful Links

* [ember.js](http://emberjs.com/)
* [ember-cli](http://www.ember-cli.com/)
* Development Browser Extensions
  * [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  * [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)

