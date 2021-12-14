library ieee;
use ieee.std_logic_1164.all;
use ieee.numeric_std.all;
use std.env.finish;

entity tb_ADC is
end entity;

architecture TB of tb_ADC is
    constant WIDTH : natural := 8;

    signal clk, rst, simDone : std_logic := '0';
    signal trigger : std_logic := '0';
    signal extReady : std_logic := '1';
    signal extData : std_logic_vector(WIDTH-1 downto 0);
    signal ready, converting, done, extRD, extCS : std_logic;
    signal convData : std_logic_vector(WIDTH-1 downto 0);
begin
    UUT: entity work.ADC
        generic map (
            WIDTH => WIDTH
        )
        port map (
              clk => clk
            , rst => rst
            , trigger => trigger
            , extReady => extReady
            , extData => extData
            , extRD => extRD
            , extCS => extCS
            , ready => ready
            , converting => converting
            , done => done
            , convData => convData
        );
    
    clk <= not clk and not simDone after 20 ns;

    process 
    begin
        report "Hello, world!";

        rst <= '1';

        wait for 5 ns;

        rst <= '0';

        wait for 30 ns;

        trigger <= '1';

        wait until clk = '0';
        wait for 5 ns;

        extReady <= '0';

        wait for 100 ns;

        extData <= x"dd";

        wait for 10 ns;

        extReady <= '1';

        wait until done = '1';
        wait for 1 ns;

        trigger <= '0';

        wait for 10 ns;

        extReady <= '0';

        wait for 50 ns;
        report "Finishing";
        finish;
    end process;
end architecture;