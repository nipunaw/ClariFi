# ClariFi

FPGA and software crossover to bring your microphone clarity and fidelity

**[Software]**

Dependencies:

[Node.js 16.13.1]

Steps to run:

- npm install
- npm start (Run React Server)
- npm run electron-dev (Run Electron Application)

Current development is done on Windows and the main target platform is Windows. This application is built using ElectronJS and ReactJS

Note: When installing packages, a warning will appear about npm package vulnerabilities. This is not a concern and is addressed here: https://github.com/facebook/create-react-app/issues/11174

**[Hardware]**

VHDL files included in 'vhdl' folder. Schematic files included in 'schematics' folder.

Synthesizing steps: 

The HDL is synthesized by the Vivado 2021.1 build system. It has not been tested on other versions of Vivado.
1. Download the Vivado project zip file from the Releases tab.
2. Unzip the archive and open the project in Vivado
3. Double click on "Generate Bitstream" to generate the bitstream for the Arty A7-35 (xc7a35ticsg324-1L) FPGA, which is preconfigured. Other devices may be selected, however neither performance nor compatibility are guaranteed.

The default pinout, which can also be found in the constraint file, is:
- clk - E3
- rst - C2
- sampleIn[0:7] -  D4,  D3,  F4,  F3,  E2,  D2,  H2,  G2
- sampleOut[0:7] - G13, B11, A11, D12, D13, B18, A18, K16

For status of the filter on the Arty A7 devboard, it outputs to a status LED:
- filterActive - H5

The switch on the devboard enables the filter
- filterEn - A8


The pins for the TLC0820:
- extCS - E15
- extRD - E16
- extReady - D15

The MX7224 is held in transparent mode