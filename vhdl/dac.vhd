library ieee;
use ieee.std_logic_1164.all;
use ieee.numeric_std.all;

entity DAC is
    generic (
        WIDTH : natural
    );
    port (
          convData : in std_logic_vector(WIDTH-1 downto 0)
        ; ldac, wr, cs : out std_logic
        ; extData : out std_logic_vector(WIDTH-1 downto 0)
    );
end entity;

architecture MX7224 of DAC is
begin
    ldac <= '0';
    wr <= '0';
    cs <= '0';

    extData <= convData; -- With all digital inputs to the DAC set to 0, the input registers becomes transparent
end architecture;