-- library ieee;
-- use ieee.std_logic_1164.all;
-- use ieee.numeric_std.all;

-- package ClariFi is
--     type CoeffiecientArray is array(natural range <>) of integer;
--     type RegArray is array(natural range <>) of signed;
--     type SLVArray is array(natural range <>) of std_logic_vector;
-- end package;

library ieee;
use ieee.std_logic_1164.all;
use ieee.numeric_std.all;
use IEEE.math_real.all;
use work.ClariFi.all;

entity BasicFIR is
    generic (
          RESOLUTION : natural
        ; NUM_TAPS : natural
        -- ; COEFFICIENTS : CoeffiecientArray(0 to NUM_TAPS-1)
    );
    port (
          clk, rst, en : in std_logic
        ; sample : in std_logic_vector(RESOLUTION-1 downto 0)
        ; coefficients : RegArray(0 to NUM_TAPS-1)
        ; filtered : out std_logic_vector(RESOLUTION-1 downto 0)
    );
end entity;

architecture SingleOrder of BasicFIR is
    signal taps : RegArray(0 to NUM_TAPS-1)(RESOLUTION-1 downto 0);
    signal multiplies : RegArray(0 to NUM_TAPS-1)((RESOLUTION*2)-1 downto 0);
    signal multiplySLVs : SLVArray(0 to NUM_TAPS-1)((RESOLUTION*2)-1 downto 0);
    signal accumulator : signed((RESOLUTION * 2) + natural(ceil(log2(real(NUM_TAPS)))) - 1 downto 0);
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
                , B => std_logic_vector(COEFFICIENTS(i))
                , P => multiplySLVs(i)
            );
            
        multiplies(i) <= signed(multiplySLVs(i));
    end generate;

    -- proc_accumulator: process (multiplies)
    --     variable acc : signed(accumulator'range) := (others => '0');
    -- begin
    --     acc := (others => '0');

    --     for i in 0 to NUM_TAPS-1 loop
    --         acc := acc + multiplies(i);
    --     end loop;

    --     accumulator <= acc;
    -- end process;

    uAdderTree: entity work.AdderTree
        generic map (
              WIDTH => RESOLUTION*2
            , NUM_OPERANDS => NUM_TAPS
        )
        port map (
              operands => multiplies
            , sum => accumulator
        );

    filtered <= std_logic_vector(accumulator(accumulator'high downto accumulator'high - (RESOLUTION - 1)));
end architecture;