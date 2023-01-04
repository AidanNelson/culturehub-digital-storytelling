This repository contains the virtual venue for CultureHub's Experiments in Digital Storytelling writers' workshop in January, 2023.

# Getting Started

This guide assumes some familiarity with your the command line (a text-based interface for your computer) and with web-development technologies. So when you see blocks of code below, these should be entered into your MacOS Terminal 💻 or Windows/Linux equivalent.

```sh
# download this repository and change directory (cd) into the root folder
git clone https://github.com/AidanNelson/culturehub-digital-storytelling.git
cd culturehub-digital-storytelling

# install all dependencies on the front end
npm install

# if you are developing features for the server,
# change directory into the /server folder and install all server-side dependencies
cd server
npm install # note that this may take several minutes as it will compile the Mediasoup WebRTC SFU package

# once everything has been installed, start the server from the root of the repository
cd ..
npm run start-server

# You should now be able to access the venue from your web-browser

```

# Customizing for Your Needs

The code is organized into a few different sections:

## Server

The backend Node.js server code is contained within the `/server` folder. The server manages all real-time communications between audience members and the showrunners.

## Front End

There are several web pages available in the front-end. These are available at the following paths.

[Audience](./src/) - This is where audience members will enter into your virtual venue.

[Show Control](./src/show-control/) - This is where you will control the show, move between scenes and otherwise affect the audience experience. Think of this page as home-base for a stage manager.

[Broadcaster](./src/broadcaster/) - This page allows a live performer or showrunner to broadcast to the audience using WebRTC broadcasting.
