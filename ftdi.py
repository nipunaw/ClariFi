from pyftdi.ftdi import Ftdi
from pyftdi.spi import (SpiController)
from time import sleep
import sys

Ftdi.show_devices()

spi = SpiController()
spi.configure('ftdi://ftdi:232h:FT4RZWM0/1')
slave = spi.get_port(cs=0, freq = 12E4, mode=0)

def writeToSlave(out: bytes):
    global spi
    global slave

    slave.write(out)

class _Getch:
    """Gets a single character from standard input.  Does not echo to the screen."""
    def __init__(self):
        try:
            self.impl = _GetchWindows()
        except ImportError:
            self.impl = _GetchUnix()

    def __call__(self): return self.impl()


class _GetchUnix:
    def __init__(self):
        import tty, sys

    def __call__(self):
        import sys, tty, termios
        fd = sys.stdin.fileno()
        old_settings = termios.tcgetattr(fd)
        try:
            tty.setraw(sys.stdin.fileno())
            ch = sys.stdin.read(1)
        finally:
            termios.tcsetattr(fd, termios.TCSADRAIN, old_settings)
        return ch


class _GetchWindows:
    def __init__(self):
        import msvcrt

    def __call__(self):
        import msvcrt
        return msvcrt.getch()


def main():
    #getch = _Getch()
    curValue = 0
    curMode = "LED"

    print("Now in LED mode")

    for command in sys.argv[1:]:
        if curMode == "LED":

            if command == "q":
                spi.close()
                quit()
            elif command == "t":
                curMode = "TAPS"
                print("Now in Taps mode")
                continue

            n = int(command) - ord('0')
            a = int(command) - ord('a')

            newNibble = 0

            if n in range(0, 10):
                print(n)
                newNibble = n
            elif a in range(0, 7):
                a = a + 10
                print(a)
                newNibble = a
            else:
                continue

            curValue = ((curValue << 4) & 0xF0) | newNibble
            writeToSlave([0x01, curValue])

        elif curMode == "TAPS":
            
            if command == "q":
                spi.close()
                quit()
            elif command == "l":
                curMode = "LED"
                print("Now in LED mode")
                continue

            coefficient = int(command)

            if coefficient not in range(0, 256):
                print("Value must be between 0 and 255")
                continue

            writeToSlave([0x02, coefficient])

if __name__ == "__main__":
    main()