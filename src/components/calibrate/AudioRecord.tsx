import { useEffect, useState } from "react";
import "css/MainContent.css";
import { writeSerial } from "functions/serial";
import Loading from "../Loading";
import { useAppSelector } from "hooks";
import { useAppDispatch } from "hooks";
import { nextState, selectCalibrate } from "reducers/calibrateSlice";
const electron = window.require("electron");

const audioCtx = new AudioContext();
var analyser = audioCtx.createAnalyser();
analyser.fftSize = 32768;
var source;

enum AudioState {
  Ready,
  Recording,
  Processing,
  Error,
  Finished,
}

interface AudioDevice extends MediaStreamConstraints {
  audio: {
    deviceId: string | undefined;
  };
}

var constraints: AudioDevice = {
  audio: {
    deviceId: undefined,
  },
};

const RECORD_MS_TIME = 5500;

const handleStart = (event: Event) => {
  setTimeout(function () {
    let eventRecorder = event.target as MediaRecorder;
    eventRecorder.stop();
  }, RECORD_MS_TIME);
};

const handleStop = (setRecorderState: () => void, updateState: () => void) => {
  setRecorderState();
  updateState();
};

const handleDataAvailable = (event: BlobEvent) => {
  let audioCtx = new AudioContext();
  event.data.arrayBuffer().then((arrayBuf) => {
    audioCtx.decodeAudioData(arrayBuf).then((buffer) => {
      //sample rate is 48kHz for my device

      //let bufferLength = analyser.frequencyBinCount;
      //const fftData = new Float32Array(bufferLength);
      //analyser.getFloatFrequencyData(fftData);

      const rawRecordedData = buffer.getChannelData(0); // get a single channel of sound
      const sampleRate = audioCtx.sampleRate;
      electron.ipcRenderer.send(
        "process-audio",
        rawRecordedData,
        sampleRate,
        "ambience"
      );
    });
  });
};

export default function AudioRecord() {
  const [state, setState] = useState<AudioState>(AudioState.Ready);
  const [recorder, setRecorder] = useState<MediaRecorder>();
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>();
  const { deviceId, testName } = useAppSelector(selectCalibrate);
  const dispatch = useAppDispatch();

  useEffect(() => {
    electron.ipcRenderer.on(
      "audio-finished",
      (event, status, message, data) => {
        console.log(status);
        if (status === true) {
          setState(AudioState.Finished);
          //setFeedbackMsg(message);
          writeSerial(data).then((serialStatus) => {
            console.log(serialStatus);
          });
        } else {
          setState(AudioState.Error);
        }
      }
    );
  }, []);

  function handleSuccess(stream: MediaStream) {
    source = audioCtx.createMediaStreamSource(stream);
    source.connect(analyser);

    const options = { mimeType: "audio/webm" };
    const _recorder = new MediaRecorder(stream, options);
    _recorder.onstart = handleStart;
    _recorder.onstop = () =>
      handleStop(
        () => setRecorder(undefined),
        () => setState(AudioState.Processing)
      );
    _recorder.ondataavailable = handleDataAvailable;
    _recorder.start();
    setRecorder(_recorder);
  }

  function handleError(error: Error) {
    const errorMessage =
      "navigator.MediaDevices.getUserMedia error: " +
      error.message +
      " " +
      error.name;
    console.log(errorMessage);
  }

  const handleClick = () => {
    if (state === AudioState.Ready && deviceId != null) {
      setFeedbackMsg(null);
      setState(AudioState.Recording);
      // TODO: Potentially wait to ensure click is not apart of freq
      constraints.audio.deviceId = deviceId;
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then(handleSuccess)
        .catch(handleError);
    } else if (state === AudioState.Finished) {
      dispatch(nextState());
    }
  };

  const getButton = () => {
    let buttonDisplay: string = "";
    let isDisabled: boolean = true;

    switch (state) {
      case AudioState.Ready: {
        buttonDisplay = "Begin recording";
        isDisabled = false;
        break;
      }
      case AudioState.Recording: {
        buttonDisplay = "Recording...";
        isDisabled = true;
        break;
      }
      case AudioState.Processing: {
        buttonDisplay = "Processing...";
        isDisabled = true;
        break;
      }
      case AudioState.Finished: {
        buttonDisplay = "Next";
        isDisabled = false;
        break;
      }
      case AudioState.Error: {
        buttonDisplay = "Error";
        isDisabled = true;
        break;
      }
    }
    return (
      <button
        className="user-button"
        onClick={handleClick}
        disabled={isDisabled}
      >
        {buttonDisplay}
      </button>
    );
  };

  const getStateMessage = (): string | null => {
    if (state === AudioState.Ready) {
      return `Start the ${testName} test for the listed recording device.`;
    } else if (state === AudioState.Processing) {
      return "Processing...";
    } else if (state === AudioState.Recording) {
      return "Recording...";
    } else if (state === AudioState.Finished) {
      return "Finished processing audio. Please proceed to the next step. ";
    } else if (state === AudioState.Error) {
      return "An error occured while performing test. Please try again.";
    }
    return null;
  };

  const deviceSelected = (
    <div
      className="device-list"
      style={{ minHeight: "300px", justifyContent: "normal" }}
    >
      <div
        style={{
          fontWeight: "600",
          fontSize: "18px",
        }}
      >
        DeviceId Selected:{" "}
      </div>
      {deviceId}
    </div>
  );

  return (
    <div className="main-content">
      <div className="display-message">
        {getStateMessage()}
        {feedbackMsg}
      </div>
      {state == AudioState.Recording || state == AudioState.Processing ? (
        <Loading />
      ) : (
        deviceSelected
      )}
      {getButton()}
    </div>
  );
}
