library ieee;
use ieee.std_logic_1164.all;
use ieee.numeric_std.all;
use work.ClariFi.all;

entity TopLevel is 
    port (
          clk_100mhz, rst_n : in std_logic
        ; extReady, filterEn : in std_logic
        ; sampleIn : in std_logic_vector(7 downto 0)
        ; extCS, extRD, filterActive : out std_logic
        ; sampleOut : out std_logic_vector(7 downto 0)
        ; inReady, inConv, inDone, clk_out : out std_logic
    );
end entity;

architecture arch of TopLevel is
    constant RESOLUTION : natural := 8;

    signal adcOut, filterIn : std_logic_vector(sampleIn'range);
    signal filterOut, dacData : std_logic_vector(sampleOut'range);

    signal clk, rst, adcReady, adcConverting, adcDone, firEn : std_logic;
begin
    clk_out <= clk;
    rst <= not rst_n;

    filterActive <= filterEn;
    firEn <= adcDone;

    --filterIn <= std_logic_vector(unsigned(adcOut) - to_unsigned(RESOLUTION, RESOLUTION));
    filterIn <= adcOut;
    dacData <= filterOut when (filterEn = '1') else filterIn;
    --dacData <= adcOut;
--dacData <= std_logic_vector(signed(filterOut) + to_signed(RESOLUTION, RESOLUTION));
    
    inReady <= adcReady;
    inConv <= adcConverting;
    inDone <= adcDone;

    uFIR : entity work.BasicFIR
        generic map (
              RESOLUTION => RESOLUTION
            , NUM_TAPS => 9
            , COEFFICIENTS => (28, 28, 28, 28, 28, 28, 28, 28, 28) 
        )
        port map (
              clk => clk
            , rst => rst
            , en => firEn
            , sample => filterIn 
            , filtered => filterOut
        );
    
    uADC : entity work.ADC(TLC0820)
        generic map (
            WIDTH => RESOLUTION
        )
        port map (
              clk => clk
            , rst => rst
            , trigger => adcReady
            , extReady => extReady
            , extData => sampleIn
            , ready => adcReady
            , converting => adcConverting
            , done => adcDone
            , extRD => extRD
            , extCS => extCS
            , convData => adcOut
        );

    uDAC : entity work.DAC(MX7224)
        generic map (
            WIDTH => RESOLUTION
        )
        port map (
              convData => dacData
            , extData => sampleOut
        );

    uClkDiv: entity work.ClockDivider
        generic map (
            STAGES => 8
        )
        port map (
              clk_in => clk_100mhz
            , rst => rst
            , clk_out => clk
        );

end architecture;