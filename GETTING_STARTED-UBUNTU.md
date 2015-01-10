Getting Started with Ubuntu
===========================

You have two options: Install Ubuntu on a VirtualBox or install it natively.
Ubuntu will run a lot smoother if you're running it natively, but it is a lot
easier to install via VirtualBox.

### Install Ubuntu 14.04 LTS (64-bit Desktop)

Regardless of whether you're installing virtually or natively, you'll need to
download the OS image: http://www.ubuntu.com/download/desktop

### Installing via VirtualBox

If you choose to install this virtually, download the appropriate VirtualBox
client at https://www.virtualbox.org/wiki/Downloads.

#### Create a VirtualBox

Create a VirtualBox with at least 2GB RAM. The more, the better, but your
computer may not be able to handle it. Test it and find the right balance for
your machine.

After Ubuntu is installed, install the Guest Additions from VirtualBox:

VirtualBox VM Menu → Devices → Install Guest Additions CD Image

This will install a couple extensions to VirtualBox to help it work smoother on
your computer.

### Install Git

We'll need to install Git to interact with GitHub.

```bash
sudo apt-get install git
```

### Install curl

We need to install `curl`, a command line tool for transferring data with URL
syntax, to start setting up Node.

```bash
sudo apt-get install curl
```

### Install Node

Based on [instructions from Joyent][instructions]

[instructions]: https://github.com/joyent/node/wiki/installing-node.js-via-package-manager#debian-and-ubuntu-based-linux-distributions

```bash
curl -sL https://deb.nodesource.com/setup | sudo bash -
sudo apt-get install -y nodejs
sudo apt-get install -y build-essential
```

Finally, run `node -v` to confirm you’re using a version >= 0.10.35.

### Update npm

The version of `npm` packaged with Node is old. Update to the latest version:

```bash
sudo npm install -g npm
```

Run `npm -v` to confirm that you’re using a version >= 2.1.14.


### Install Bower

[Bower][b] is our front-end package manager. We will use it to fetch
third-party dependencies from remote Git repositories.

[b]: http://bower.io

```bash
sudo npm install -g bower
```

### Installing a Text Editor

The choice of Text Editors is completely up to you.

Here are the [instructions][atom-i] to install [Atom][atom], the text editor
made by GitHub. I can't really say I recommend it as I don't use it myself...
but it's relatively well backed and is available for Ubuntu.

[atom]: http://atom.io
[atom-i]: https://github.com/atom/atom#debian-linux-ubuntu


 - Download `atom-amd64.deb` from the [Atom releases page][r].
 - Run `sudo dpkg --install atom-amd64.deb` on the downloaded package.
 - Launch Atom using the installed `atom` command.
 - The Linux version does not currently automatically update so you will need
   to repeat these steps to upgrade to future releases.

[r]: https://github.com/atom/atom/releases/latest
