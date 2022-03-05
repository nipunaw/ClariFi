Team Members: Nipuna Weerapperuma, Leslie Harvey, Dylan Ferris, Carlos Morales-Diaz
This VHDL was written for an Artix-7 35T with Vivado and its IP library.

File description:
adc.vhd - An abstraction layer for controlling the current ADC chip (a TLC0820)
BasicFIR.vhd - A configurable implementation for an FIR filter in the time domain
ClkDivider.vhd - Divides a clock by a power of 2
dac.vhd - An abstraction layer for controlling the current DAC chip (a MX7224)
tb_adc.vhd - Testbench for adc.vhd
tb_FIR.vhd - Testbench for BasicFIR.vhd
tb_Top.vhd - Testbench for TopLevel.vhd
TopLevel.vhd - The top level definition for the ClariFi circuit