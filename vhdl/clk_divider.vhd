library ieee;
use ieee.std_logic_1164.all;
use ieee.numeric_std.all;
use ieee.math_real.all;

entity clk_divider is
    generic(clk_in_freq  : natural := 100000000;
            clk_out_freq : natural := 100);
    port (
        clk_in  : in  std_logic;
        clk_out : out std_logic;
        rst     : in  std_logic);
end clk_divider;

architecture BHV of clk_divider is 
	constant ratio : natural := clk_in_freq / clk_out_freq;
begin 
	process(clk_in, rst)
	variable count : integer := 0;

	begin
		if(rst = '1') then 
			clk_out <= '0';
			count := 0;
		elsif(rising_edge(clk_in)) then 
			count := count + 1;
			if (count = ratio) then
				clk_out <= '1';
				count := 0;
			else
				clk_out <= '0';
			end if;
		end if;
	end process;
end BHV;