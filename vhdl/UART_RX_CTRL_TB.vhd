library ieee;
use ieee.std_logic_1164.ALL;
use ieee.numeric_std.all;
 
entity UART_RX_CTRL_TB is
end UART_RX_CTRL_TB;
 
architecture Testbench of UART_RX_CTRL_TB is
 
  component UART_RX_CTRL is
    generic (
      CLKS_PER_BIT : integer := 868
      );
    port (
		CLK		: in  std_logic;
		RST 	: in std_logic;
		UART_RX : in  std_logic;
		RX_DONE : out std_logic;
		DATA	: out std_logic_vector(7 downto 0)
	);
  end component UART_RX_CTRL;
 
  constant c_CLKS_PER_BIT : integer := 868;
 
   
  signal r_CLOCK     : std_logic                    := '0';
  signal w_RX_DV     : std_logic;
  signal w_RX_BYTE   : std_logic_vector(7 downto 0);
  signal r_RX_SERIAL : std_logic := '1';
  signal data_sent	 : std_logic_vector(7 downto 0) := X"a9";
  signal done 	: std_logic := '0'; 
   
begin
 
  -- Instantiate UART Receiver
  UART_RX_INST : UART_RX_CTRL
    generic map (
      CLKS_PER_BIT => c_CLKS_PER_BIT
      )
    port map (
      CLK		=> r_CLOCK,
	  RST 		=> '0',
      UART_RX	=> r_RX_SERIAL,
      RX_DONE   => w_RX_DV,
      DATA   	=> w_RX_BYTE
      );
 
  r_CLOCK <= not r_CLOCK after 10 ns when done = '0' else r_CLOCK;
   
  process is
  begin
  	wait for 1000 ns;

     
    wait until rising_edge(r_CLOCK);
	
	-- Send Start Bit
    r_RX_SERIAL <= '0';
    wait for 17360 ns;

	-- Send Data Byte
    for i in 0 to 7 loop
      r_RX_SERIAL <= data_sent(i);
      wait for 17360 ns;
    end loop;
	
	-- Send Stop Bit
    r_RX_SERIAL <= '1';
    wait for 17360 ns;
	
    wait until rising_edge(r_CLOCK);
 
    if w_RX_BYTE = X"a9" then
      report "Test Passed - Correct Byte Received" severity note;
    else
      report "Test Failed - Incorrect Byte Received" severity note;
    end if;
 
	report "SIMULATION FINISHED!";
	done <= '1';
	wait;     
  end process;
   
end Testbench;