import sys
import crepe
import numpy as np
from scipy.io import wavfile

def main():
    # If file does not exist, create empty one (this is to pass compilation errors)
    blank_array = np.array([[0, 0], [0, 0]])
    filename = sys.argv[1]
    wavfile.write(filename, 44100, blank_array)
    
    sample_rate, audio = wavfile.read(filename)
    
    time, frequency, confidence, activation = crepe.predict(audio, sample_rate, viterbi=True)

    # for x in time:
        # print(x)
        
    for x in frequency:
        print(x)
        
    # for x in confidence:
        # print(x)
        
    # for x in activation:
        # print(x)
     
    # sys.stdout.flush()
    
if __name__ == "__main__":
    main()