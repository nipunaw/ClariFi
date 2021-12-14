# ClariFi

FPGA and software crossover to bring your microphone clarity and fidelity

**[Hardware]**

VHDL files included in 'vhdl' folder. These are standalone and separate from the software below.

**[Software]**

Dependencies:

[Python 3.9.1]

- pip install tensorflow
- pip install crepe
- pip install sounddevice

[Node.js 16.13.1]

Steps to run:

- npm install
- npm install -g http-server
- Go to ClariFi/
- http-server ./
- npm start (Run React Server)
- npm run electron-dev (Run Electron Application)

Current development is done on Windows and the main target platform is Windows. This application is built using ElectronJS and ReactJS

Note: When installing packages, a warning will appear about npm package vulnerabilities. This is not a concern and is addressed here: https://github.com/facebook/create-react-app/issues/11174
