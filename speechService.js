import { ExpoSpeechRecognitionModule } from 'expo-speech-recognition';

/**
 * Thin wrapper around expo-speech-recognition so the rest of the app
 * never talks to the native module directly. Uses the on-device speech
 * recognizer built into iOS/Android — free, no API key, works offline
 * on most modern devices.
 */

export async function requestMicPermission() {
  const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
  return result.granted;
}

/**
 * Start listening. Registers callbacks for partial results, final result,
 * and errors, then starts the recognizer.
 *
 * @param {object} handlers
 * @param {(text: string) => void} handlers.onPartialResult
 * @param {(text: string) => void} handlers.onFinalResult
 * @param {(error: string) => void} handlers.onError
 * @param {() => void} handlers.onEnd
 */
export function startListening({ onPartialResult, onFinalResult, onError, onEnd }) {
  const resultSub = ExpoSpeechRecognitionModule.addListener('result', (event) => {
    const transcript = event.results?.[0]?.transcript ?? '';
    if (event.isFinal) {
      onFinalResult?.(transcript);
    } else {
      onPartialResult?.(transcript);
    }
  });

  const errorSub = ExpoSpeechRecognitionModule.addListener('error', (event) => {
    onError?.(event.error || 'Speech recognition error');
  });

  const endSub = ExpoSpeechRecognitionModule.addListener('end', () => {
    onEnd?.();
  });

  ExpoSpeechRecognitionModule.start({
    lang: 'en-US',
    interimResults: true,
    continuous: false,
    requiresOnDeviceRecognition: false,
  });

  // Return a cleanup function that removes listeners and stops the recognizer.
  return () => {
    resultSub.remove();
    errorSub.remove();
    endSub.remove();
    ExpoSpeechRecognitionModule.stop();
  };
}

export function stopListening() {
  ExpoSpeechRecognitionModule.stop();
}
