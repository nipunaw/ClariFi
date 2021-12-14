library ieee;
use ieee.std_logic_1164.all;
use ieee.numeric_std.all;

entity Alternator is
    port (
          clk, rst : in std_logic
        ; q : out std_logic
    );
end entity;

architecture arch of Alternator is
    signal q_r : std_logic := '0';
begin
    q <= q_r;

    process (clk, rst)
    begin
        if (rst = '1') then
            q_r <= '0';
        elsif (rising_edge(clk)) then
            q_r <= not q_r;
        end if;
    end process;
end architecture;

library ieee;
use ieee.std_logic_1164.all;
use ieee.numeric_std.all;

entity ClockDivider is
    generic (
        STAGES : natural
    );
    port (
          clk_in, rst : in std_logic
        ; clk_out : out std_logic
    );
end entity;

architecture arch of ClockDivider is
    signal clkStages : std_logic_vector(STAGES+1 downto 0);
begin
    uAlts: for i in 0 to STAGES-1 generate
        uAlt: entity work.Alternator
            port map(
                  clk => clkStages(i)
                , rst => rst
                , q => clkStages(i + 1)
            );
    end generate;
    
    clkStages(0) <= clk_in;
    clk_out <= clkStages(STAGES) ;
end architecture;