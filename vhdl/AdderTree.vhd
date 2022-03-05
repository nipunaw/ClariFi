library ieee;
use ieee.std_logic_1164.all;
use ieee.numeric_std.all;
use ieee.math_real.all;
use work.ClariFi.all;

entity AdderTree is
    generic (
          WIDTH : natural
        ; NUM_OPERANDS : natural
    );
    port (
          operands : in RegArray(0 to NUM_OPERANDS-1)(WIDTH-1 downto 0)
        ; sum : out signed(WIDTH + natural(ceil(log2(real(NUM_OPERANDS)))) - 1 downto 0)
    );
end entity;

architecture arch of AdderTree is
    signal inner_operands : RegArray(0 to (NUM_OPERANDS / 2) + (NUM_OPERANDS mod 2) - 1)(WIDTH downto 0);
    -- signal odd_dummy_operands : RegArray(0 to operands'high + 1)(WIDTH downto 0);
    -- signal odd_dummy_sum : signed(sum'high downto 0);
begin
    -- sum <= ('0' & inner_operands(0)) + inner_operands(1);

    odd_transform: if NUM_OPERANDS mod 2 = 1 generate
        inner_operands(inner_operands'high) <= '0' & operands(operands'high);
    end generate;

    base_even: if NUM_OPERANDS = 2 generate
        sum <= ('0' & operands(0)) + operands(1);
    end generate;

    -- base_odd: if NUM_OPERANDS = 3 generate
    --     sum <= ('0' & (('0' & operands(0)) + operands(1))) + operands(2);
    -- end generate;

    inner_adders: if NUM_OPERANDS > 2 generate
        recurse: for i in 0 to inner_operands'high - (NUM_OPERANDS mod 2) generate
            inner_operands(i) <= ('0' & operands(i * 2)) + operands(i * 2 + 1);
        end generate;

        uLayerAdder: entity work.AdderTree
            generic map (
                  WIDTH => WIDTH + 1
                , NUM_OPERANDS => inner_operands'length
            )
            port map (
                  operands => inner_operands
                , sum => sum
            );
    end generate;
end architecture;