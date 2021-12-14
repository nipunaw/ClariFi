library ieee;
use ieee.std_logic_1164.all;
use ieee.numeric_std.all;

package ClariFi is
    type CoeffiecientArray is array(natural range <>) of integer;
    type RegArray is array(natural range <>) of signed;
    type SLVArray is array(natural range <>) of std_logic_vector;
end package;

library ieee;
use ieee.std_logic_1164.all;
use ieee.numeric_std.all;
use work.ClariFi.all;

entity BasicFIR is
    generic (
          RESOLUTION : natural
        ; NUM_TAPS : natural
        ; COEFFICIENTS : CoeffiecientArray(0 to NUM_TAPS-1)
    );
    port (
          clk, rst, en : in std_logic
        ; sample : in std_logic_vector(RESOLUTION-1 downto 0)
        ; filtered : out std_logic_vector(RESOLUTION-1 downto 0)
    );
end entity;

architecture SingleOrder of BasicFIR is
    signal taps : RegArray(0 to NUM_TAPS-1)(RESOLUTION-1 downto 0);
    signal multiplies : RegArray(0 to NUM_TAPS-1)((RESOLUTION*2)-1 downto 0);
    signal multiplySLVs : SLVArray(0 to NUM_TAPS-1)((RESOLUTION*2)-1 downto 0);
    signal accumulator : signed((RESOLUTION*2)-1 downto 0);
begin
    LoadTaps: process(clk, rst, en)
    begin
        if (rst = '1') then
            taps <= (others => (others => '0'));
        elsif (rising_edge(clk) and en = '1') then
            taps(0) <= signed(sample);

            for i in 1 to NUM_TAPS-1 loop
                taps(i) <= taps(i-1);
            end loop;
        end if;
    end process;

    uMultipliers: for i in 0 to NUM_TAPS-1 generate
        uMultiplier: entity work.SignedMultDSP
            port map (
                  CLK => clk
                , A => std_logic_vector(taps(i))
                , B => std_logic_vector(to_signed(COEFFICIENTS(i), RESOLUTION))
                , P => multiplySLVs(i)
            );
            
        multiplies(i) <= signed(multiplySLVs(i));
    end generate;

    process (multiplies)
        variable acc : signed(accumulator'range) := (others => '0');
    begin
        acc := (others => '0');

        for i in 0 to NUM_TAPS-1 loop
            acc := acc + multiplies(i);
        end loop;

        accumulator <= acc;
    end process;

    filtered <= std_logic_vector(accumulator(accumulator'high downto accumulator'high - (RESOLUTION - 1)));
end architecture;