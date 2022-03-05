library ieee;
use ieee.std_logic_1164.all;
use ieee.numeric_std.all;

package ClariFi is
    type CoeffiecientArray is array(natural range <>) of integer;
    type RegArray is array(natural range <>) of signed;
    type SLVArray is array(natural range <>) of std_logic_vector;

    -- type Command_t is (A_None, A_WriteLEDs);
    constant A_None : std_logic_vector(7 downto 0) := X"00";
    constant A_WriteLEDs : std_logic_vector(7 downto 0) := X"01";
    constant A_ShiftCoefficient : std_logic_vector(7 downto 0) := X"02";
end package;