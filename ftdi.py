from pyftdi.ftdi import Ftdi
from pyftdi.spi import (SpiController)
from time import sleep

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


getch = _Getch()

curValue = 0
curMode = "LED"

print("Now in LED mode")

while True:
    if curMode == "LED":
        c = ord(getch())

        if c == ord('q'):
            spi.close()
            quit()
        elif c == ord('t'):
            curMode = "TAPS"
            print("Now in Taps mode")
            continue

        n = c - ord('0')
        a = c - ord('a')

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
        line = input()
        
        if line == "q":
            spi.close()
            quit()
        elif line == "l":
            curMode = "LED"
            print("Now in LED mode")
            continue

        coefficient = int(line)

        if coefficient not in range(0, 256):
            print("Value must be between 0 and 255")
            continue

        writeToSlave([0x02, coefficient])

        

    
    