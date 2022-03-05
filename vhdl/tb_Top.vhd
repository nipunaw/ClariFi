library ieee;
use ieee.std_logic_1164.all;
use ieee.numeric_std.all;
use std.env.finish;
use work.ClariFi.all;

entity tb_Top is
end entity;

architecture arch of tb_Top is
    signal clk, rst_n : std_logic := '0';
    signal extReady, filterEn : std_logic := '0';
    signal sampleIn : std_logic_vector(7 downto 0);
    signal extCS, extRD, filterActive : std_logic;
    signal sampleOut : std_logic_vector(7 downto 0);
    signal inReady, inConv, inDone, clk_out : std_logic;

    signal spiCLK,forceSpiCLK, spiCS_n, spiData : std_logic;

    signal transmit : std_logic_vector(15 downto 0) := X"0137";
    signal transmit2 : std_logic_vector(15 downto 0) := X"0154";
    signal lightsOut : std_logic_vector(7 downto 0);
begin
    UUT: entity work.TopLevel
        port map (
            clk_100mhz => clk, rst_n => rst_n,
            extReady => extReady, filterEn => filterEn,
            sampleIn => sampleIn,
            extCS => extCS, extRD => extRD,
            sampleOut => sampleOut,
            clk_out => clk_out,
            spiCLK => spiCLK,
            spiCS_n => spiCS_n,
            spiData => spiData,
            lightsOut => lightsOut
        );

    clk <= not clk after 10 ns;
    spiCLK <= clk nor forceSpiCLK;

    process
    begin
        sampleIn <= x"64";
        filterEn <= '1';

        spiCS_n <= '1';
        spiData <= '0';
        forceSpiCLK <= '0';
        
        wait for 5 ns;
        rst_n <= '1';

        wait for 1 ns;

        wait until spiCLK = '1';
        wait until spiCLK = '0';
        spiCS_n <= '0';

        for i in 15 downto 0 loop
            spiData <= transmit(i);

            wait until spiCLK = '1';
            wait until spiCLK = '0';
        end loop;

        spiCS_n <= '1';
        forceSpiCLK <= '1';
        wait for 50 ns;
        forceSpiCLK <= '0';

        wait until spiCLK = '1';
        wait until spiCLK = '0';
        spiCS_n <= '0';

        for i in 15 downto 0 loop
            spiData <= transmit2(i);

            wait until spiCLK = '1';
            wait until spiCLK = '0';
        end loop;

        spiCS_n <= '1';

        for i in 0 to 10 loop
            extReady <= '0';
            wait until inConv = '1';

            extReady <= '1';
            wait until inDone = '1';

            extReady <= '0';
        end loop;

        wait for 100 ns;
        finish;
    end process;
end architecture;