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
begin
    UUT: entity work.TopLevel
        port map (
            clk_100mhz => clk, rst_n => rst_n,
            extReady => extReady, filterEn => filterEn,
            sampleIn => sampleIn,
            extCS => extCS, extRD => extRD, filterActive => filterActive,
            sampleOut => sampleOut,
            inReady => inReady, inConv => inConv, inDone => inDone, clk_out => clk_out
        );

    clk <= not clk after 10 ns;

    process
    begin
        sampleIn <= x"64";
        filterEn <= '1';
        wait for 5 ns;
        rst_n <= '1';

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