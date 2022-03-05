library ieee;
use ieee.std_logic_1164.all;
use ieee.numeric_std.all;
use work.ClariFi.all;

entity SPI is
    port (
          clk, rst, cs_n : in std_logic
        ; dataIn : in std_logic
        ; ready : out std_logic
        ; command : out std_logic_vector(7 downto 0)
        ; dataOut : out std_logic_vector(7 downto 0)
    );
end entity;

architecture arch of SPI is
    signal shifted_data, final_data : std_logic_vector(15 downto 0) := (others => '0');
    signal data_len : unsigned(15 downto 0) := (others => '0');
    signal ready_r : std_logic := '0';
begin
    ready <= cs_n;
    dataOut <= shifted_data(7 downto 0);

    command <= A_WriteLEDs when (shifted_data(15 downto 8) = X"01") else
               A_ShiftCoefficient when (shifted_data(15 downto 8) = X"02") else
               A_None;

    process (cs_n, clk)
    begin
        -- if (cs_n = '1') then
        --     if (data_len = X"10") then
        --         final_data <= shifted_data;
        --         shifted_data <= (others => '0');
        --         data_len <= (others => '0');
        --         ready_r <= '1';
        --     end if;
        -- elsif (cs_n = '0') then
        --     ready_r <= '0';

        --     if (rising_edge(clk)) then
        --         if (cs_n = '0') then
        if (rising_edge(clk) and cs_n = '0') then
            shifted_data <= shifted_data(14 downto 0) & dataIn;
        end if;            
        --             data_len <= data_len + 1;
        --         end if;
        --     end if;
        -- end if;
    end process;
end architecture;