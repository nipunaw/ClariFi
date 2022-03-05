library ieee;
use ieee.std_logic_1164.all;
use ieee.numeric_std.all;
use work.ClariFi.all;

entity TopLevel is 
    port (
          clk_100mhz, rst_n : in std_logic
        ; extReady, filterEn : in std_logic
        ; spiCS_n, spiCLK, spiData : in std_logic
        ; sampleIn : in std_logic_vector(7 downto 0)
        ; extCS, extRD, filterActive : out std_logic
        ; sampleOut : out std_logic_vector(7 downto 0)
        ; lightsOut : out std_logic_vector(3 downto 0)
        ; spiReady : out std_logic
        ; inReady, inConv, inDone, clk_out : out std_logic 
    );
end entity;

architecture arch of TopLevel is
    constant RESOLUTION : natural := 8;
    constant NUM_TAPS : natural := 9;

    signal filterCoefficients : RegArray(0 to NUM_TAPS - 1)(RESOLUTION-1 downto 0) := (others => to_signed(28, RESOLUTION));

    signal adcOut, filterIn : std_logic_vector(sampleIn'range);
    signal filterOut, dacData : std_logic_vector(sampleOut'range);

    signal clk, rst, adcReady, adcConverting, adcDone, firEn : std_logic;

    signal spi_command_ready : std_logic;
    signal spi_command : std_logic_vector(7 downto 0);
    signal spi_dataOut : std_logic_vector(7 downto 0);

    signal leds_r : std_logic_vector(7 downto 0);

    -- CS4272 Clocks
    signal mclk, sclk, lrclk : std_logic;
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


    spiReady <= spi_command_ready;
    lightsOut <= leds_r(3 downto 0);

    process (spi_command_ready)
    begin
        if (rising_edge(spi_command_ready)) then
            case (spi_command) is
                when A_WriteLEDs =>
                    leds_r <= spi_dataOut;
                when A_ShiftCoefficient =>
                    for i in 0 to (filterCoefficients'high - 1) loop
                        filterCoefficients(i) <= filterCoefficients(i + 1);
                    end loop;

                    filterCoefficients(filterCoefficients'high) <= signed(spi_dataOut);
                when others => NULL;
            end case;
        end if;
    end process;


    uSPI: entity work.SPI
        port map (
              clk => spiClk
            , rst => rst
            , cs_n => spiCS_n
            , dataIn => spiData
            , ready => spi_command_ready
            , command => spi_command
            , dataOut => spi_dataOut
        );

    uFIR : entity work.BasicFIR
        generic map (
              RESOLUTION => RESOLUTION
            , NUM_TAPS => 9
            -- , COEFFICIENTS => (28, 28, 28, 28, 28, 28, 28, 28, 28) 
        )
        port map (
              clk => clk
            , rst => rst
            , en => firEn
            , sample => filterIn
            , coefficients => filterCoefficients
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

    uMCLK: entity work.MCLK_Gen
        port map (
              clk_in1 => clk_100mhz
            , clk_out1 => mclk
        );

    uSCLK_Div: entity work.ClockDivider
        generic map (
            STAGES => 2
        )
        port map (
              clk_in => mclk
            , rst => rst
            , clk_out => sclk
        );

    uLRCLK_Div: entity work.ClockDivider
        generic map (
            STAGES => 8
        )
        port map (
              clk_in => mclk
            , rst => rst
            , clk_out => lrclk
        );
end architecture;