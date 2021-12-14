library ieee;
use ieee.std_logic_1164.all;
use ieee.numeric_std.all;

entity ADC is
    generic (
        WIDTH : natural
    );
    port (
          clk, rst : in std_logic
        ; trigger, extReady : in std_logic
        ; extData : in std_logic_vector(WIDTH-1 downto 0)
        ; ready, done, converting, extRD, extCS : out std_logic
        ; convData : out std_logic_vector(WIDTH-1 downto 0)
    );
end entity;

architecture TLC0820 of ADC is
    type StateType is (S_Ready, S_Converting, S_Done);
    signal curState : StateType := S_Ready;

    signal r_data : std_logic_vector(WIDTH-1 downto 0);
begin
    convData <= r_data;

    process (clk, rst, extReady)
    begin
        if (rst = '1') then
            curState <= S_Ready;
            r_data <= (others => '0');
        elsif (rising_edge(clk)) then
            case (curState) is
                when S_Ready =>
                    --if (extReady = '0' and trigger = '1') then
                        curState <= S_Converting;
                    --end if;
                when S_Converting =>
                    if (extReady = '1') then
                        r_data <= extData;
                        curState <= S_Done;
                    end if;
                when S_Done =>
                    if (trigger = '0') then
                        curState <= S_Ready;
                    end if;
            end case;
        end if;
        
        -- if (rst = '0' and rising_edge(extReady)) then
        --     if (curState = S_Converting) then
        --         curState <= S_Done;
        --         r_data <= extData;
        --     end if;
        -- end if;
    end process;

    process (curState, extReady, rst)
    begin
        ready <= '0';
        converting <= '0';
        done <= '0';

        extCS <= '1';
        extRD <= '1';

        case (curState) is
            when S_Ready =>
                ready <= not extReady;
                extCS <= '0' or rst;
            when S_Converting =>
                converting <= '1';
                extCS <= '0';
                extRD <= '0';
            when S_Done =>
                done <= '1';
        end case;
    end process;
end architecture;