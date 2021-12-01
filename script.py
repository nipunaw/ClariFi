import sys
import crepe
from scipy.io import wavfile

def main():
    sample_rate, audio = wavfile.read(sys.argv[1])
    
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