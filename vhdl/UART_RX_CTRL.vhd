-- ClariFi
-- Part: XC7A35TICSG324-1L 
-- UART_RX_CTRL - Utilizes the Arty A7's USB-UART Bridge (Serial Port)
-- Serialization information:
-- 		TXD -> Pin A9
-- 		RXD -> Pin D10
-- 		115200 Baud Rate
-- 		8 Data Bits, LSB First
-- 		1 Stop Bit
-- 		No parity
-- Data needs to be sampled at a rate of at least 115200*8 = 921.600 KHz
-- A 100 MHz clock is expected. We sample in the middle of a bit data.

library ieee;
use ieee.std_logic_1164.ALL;
use ieee.numeric_std.all;
 
entity UART_RX_CTRL is
	generic (
		CLKS_PER_BIT : integer := 868 -- 868 = round(100MHz / 115200)
	);
	port (
		CLK		: in  std_logic;
		RST 	: in std_logic;
		UART_RX : in  std_logic;
		RX_DONE : out std_logic;
		DATA	: out std_logic_vector(7 downto 0)
	);
end UART_RX_CTRL;

architecture BHV of UART_RX_CTRL is
 
  type state_type is (S_START, S_START_BIT, S_DATA_BITS, S_STOP_BIT, S_DONE);
  signal state : state_type := S_START;
 
  signal r_UART_RX : std_logic;
  signal r_r_UART_RX   : std_logic;
   
  signal r_Bit_Counter : integer range 0 to CLKS_PER_BIT-1 := 0;
  signal r_Bit_Index : integer range 0 to 7 := 0;  -- 8 Bits Total
  signal r_RX_Byte   : std_logic_vector(7 downto 0) := (others => '0');
  signal r_RX_DONE     : std_logic := '0';
  
  signal r_In_Start : std_logic;
   
begin 
	process (CLK, UART_RX, r_In_Start)
	begin
		if (falling_edge(UART_RX) and r_In_Start = '1') then
			state <= S_START_BIT;
		end if;
		
		if rising_edge(CLK) then
			-- Dual-flop synchronizer to stabilize incoming signal (data)
			r_UART_RX <= UART_RX;
			r_r_UART_RX <= r_UART_RX;
			r_In_Start <= '0';
			
		  case state is
	 
			when S_START =>
			  r_RX_DONE     <= '0';
			  r_Bit_Counter <= 0;
			  r_Bit_Index <= 0;
			  r_In_Start <= '1';
	 
			-- Sample half bit later to make sure it's still low
			when S_START_BIT =>
			  if r_Bit_Counter = (CLKS_PER_BIT-1)/2 then
				if r_r_UART_RX = '0' then
				  r_Bit_Counter <= 0;  -- Reset the counter
				  state   <= S_DATA_BITS; -- We are receiving data
				else
				  state   <= S_START; -- Start bit was not held low long enough
				end if;
			  else
				r_Bit_Counter <= r_Bit_Counter + 1;
				state   <= S_START_BIT;
			  end if;
	 
			   
			-- Sample data after CLKS_PER_BIT-1 clock cycles
			when S_DATA_BITS =>
			  if r_Bit_Counter < CLKS_PER_BIT-1 then
				r_Bit_Counter <= r_Bit_Counter + 1;
				state   <= S_DATA_BITS;
			  else
				r_Bit_Counter            <= 0;
				r_RX_Byte(r_Bit_Index) <= r_r_UART_RX;
				 
				-- Loop back until all 8 bits have been added to r_RX_Byte
				if r_Bit_Index < 7 then
				  r_Bit_Index <= r_Bit_Index + 1;
				  state   <= S_DATA_BITS;
				else
				  r_Bit_Index <= 0;
				  state   <= S_STOP_BIT;
				end if;
			  end if;
	 
	 
			-- Receive last bit, 1 stop bit. 
			when S_STOP_BIT =>
			  -- Check stop bit after CLKS_PER_BIT-1 clock cycles
			  if r_Bit_Counter < CLKS_PER_BIT-1 then
				r_Bit_Counter <= r_Bit_Counter + 1;
				state   <= S_STOP_BIT;
			  else
				r_RX_DONE     <= '1';
				r_Bit_Counter <= 0;
				state   <= S_DONE;
			  end if;
	 
					   
			-- Wait 1 cycle before going back to S_START
			when S_DONE =>
			  state <= S_START;
			  r_RX_DONE   <= '0';
	 
			-- Should never be reached
			when others =>
			  state <= S_START;
	 
		  end case;
    end if;
  end process;
 
  RX_DONE   <= r_RX_DONE;
  DATA <= r_RX_Byte;
   
end BHV;