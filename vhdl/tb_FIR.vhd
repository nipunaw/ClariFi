library ieee;
use ieee.std_logic_1164.all;
use ieee.numeric_std.all;
use std.env.finish;
use work.ClariFi.all;

entity tb_FIR is
end entity;

architecture arch of tb_FIR is
    signal clk, rst, en : std_logic := '0';
    signal sample : std_logic_vector(7 downto 0) := (others => '0');
    signal filtered  : std_logic_vector(7 downto 0);
begin
    UUT: entity work.BasicFIR
        generic map (
              RESOLUTION => 8
            , NUM_TAPS => 9
            , COEFFICIENTS => (
                  28, 8
                , 28, 8
                , 28, 8
                , 28, 8
                , 28, 8
                , 28, 8
                , 28, 8
                , 28, 8
                , 28, 8
            )
        )
        port map (
              clk => clk
            , rst => rst
            , en => en
            , sample => sample
            , filtered => filtered
        );

    clk <= not clk after 10 ns;

    process
    begin
        rst <= '1';

        wait for 5 ns;
        rst <= '0';
        en <= '1';

        sample <= x"64";

        wait for 500 ns;

        finish;
    end process;
end architecture;