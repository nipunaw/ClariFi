import sys
import crepe
import sounddevice as sd
import numpy as np
from scipy.io import wavfile

def main():
    filename = sys.argv[1]
    fs=44100
    duration = 10  # seconds
    myrecording = sd.rec(duration * fs, samplerate=fs, channels=2, dtype='float64')
    print("Recording Audio")
    sd.wait()
    print("Audio recording complete , Play Audio")
    wavfile.write(filename, fs, myrecording)
    
    sample_rate, audio = wavfile.read(filename)
    
    time, frequency, confidence, activation = crepe.predict(audio, sample_rate, viterbi=True)

    # for x in time:
        # print(x)
    
    print("Frequency measurements (10ms interval)")
    for x in frequency:
        print(x)
        
    # for x in confidence:
        # print(x)
        
    # for x in activation:
        # print(x)
     
    # sys.stdout.flush()
   
    
if __name__ == "__main__":
    main()