-- Controller for the CS4272-DZZ (DAC and ADC)
-- Assuming a sample frequency of 44.1 kHz
-- Note that unless we have Fs > 50 KHz, pins M0 and M1 
-- should both be 0 (can just connect to DGND).
-- CTRL = x"10" & RegAddr & Data

library ieee;
use ieee.std_logic_1164.all;
use ieee.numeric_std.all;

entity CS4272 is
    generic (
        WIDTH : natural
    );
    port (
        clk : in std_logic;
        rst : in std_logic;
        --go  : in std_logic;
        en  : in std_logic;
        DIN : in std_logic_vector(WIDTH-1 downto 0); -- Digital in
        AIN : in std_logic_vector(WIDTH-1 downto 0); -- Analog in
        CS  : out std_logic; -- Connect to pin 13
        DOUT : out std_logic_vector(WIDTH-1 downto 0);
        AOUT : out std_logic_vector(WIDTH-1 downto 0);
        CTRL : out std_logic_vector(23 downto 0); -- Control signal for configuration
        converting : out std_logic;
        done : out std_logic
    );
end entity;

architecture ADC_DAC of CS4272 is

    type StateType is (S_Ready, S_DACControl, S_Converting, S_Done);
    signal state_r, next_state : StateType;
    signal ADC_data_r, DAC_data_r : std_logic_vector(WIDTH-1 downto 0);

begin
    process (clk, rst)
    begin
        if (rst = '1') then 
            state_r <= S_Ready;
            ADC_data_r <= (others => '0');
            DAC_data_r <= (others => '0');
        elsif (rising_edge(clk)) then 
            state_r <= next_state;
        end if;
    end process;

    AIN <= ADC_data_r;
    DIN <= DAC_data_r;

    process (state_r, go, en, DIN, AIN)
    begin 
        done <= '0';
        converting <= '0';
        next_state <= state_r;  

        case state_r is         
            when S_Ready => 
                CS <= '0';
                CTRL <= x"10" & x"07" & x"02"; -- Chip address, write, set CPEN, clear PDN
                next_state <= S_DACControl; -- we should always do configuration first regardless of go

            when S_DACControl =>
                CS <= '0';
                -- Auto-Mute off, fast roll off, De-Emphasis Filter off, Ramp-up/down off, no inversion
                -- The default is x"00" anyways but in case we want to enable any option later
                CTRL <= x"10" & x"02" & x"00"; 
                next_state <= S_ADCControl;

            when S_ADCControl => 
                CS <= '0';
                -- Dither16 is off (when we're using 8-bits resolution), 24-bit LJ, No mutes, High pass filter enabled (default)
                CTRL <= x"10" & x"06" & x"00";
                if (en = '1') -- when do we start converting 
                    next_state <= S_Converting;
                end if;

            when S_Converting => 
                CS <= '1';
                converting <= '1';
                ADC_data_r <= AIN; -- Connect pins appropriately 
                DAC_data_r <= DIN;
                next_state <= S_Done;

            when S_Done => 
                CS <= '1';
                done <= '1'; -- you can get the data now
                if (en = '1')
                    done <= '0'; -- another conversion 
                    next_state <= S_Converting; -- just convert, registers are already configured
                end if;
        end case;
    end process;
end architecture;