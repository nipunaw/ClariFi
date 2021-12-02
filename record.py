import sys
import sounddevice as sd
from scipy.io.wavfile import write


def main():
    filename = sys.argv[1]
    fs=44100
    duration = 10  # seconds
    myrecording = sd.rec(duration * fs, samplerate=fs, channels=2, dtype='float64')
    print("Recording Audio")
    sd.wait()
    print("Audio recording complete , Play Audio")
    write(filename, fs, myrecording)
   
    
if __name__ == "__main__":
    main()