import sys
import crepe
import sounddevice as sd
import numpy as np
from scipy.io import wavfile

def main():
    filename = sys.argv[1]
    fs=44100
    duration = 5  # seconds
    myrecording = sd.rec(duration * fs, samplerate=fs, channels=2, dtype='float64')
    print("Audio recording started")
    sd.wait()
    print("Audio recording complete")
    wavfile.write(filename, fs, myrecording)
    
    sample_rate, audio = wavfile.read(filename)
    
    # time, frequency, confidence, activation = crepe.predict(audio, sample_rate, viterbi=True)
    print("Audio processing started")
    
    crepe.process_file(filename, viterbi=True, save_plot=True, plot_voicing=True);
    
    print("Audio processing complete")
    
    # for x in time:
        # print(x)
    
    # for x in confidence:
        # print(x)
        
    # for x in activation:
        # print(x)
     
    # sys.stdout.flush()
   
    
if __name__ == "__main__":
    main()