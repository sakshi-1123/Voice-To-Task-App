import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import VoiceButton from '../components/VoiceButton';
import TaskForm from '../components/TaskForm';
import { colors } from '../theme/colors';
import { requestMicPermission, startListening, stopListening } from '../services/speechService';
import { extractTaskDetails } from '../services/aiExtractionService';
import { saveTask } from '../services/storageService';

export default function HomeScreen({ navigation, onTaskSaved }) {
  const [isListening, setIsListening] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [draft, setDraft] = useState(null);
  const [error, setError] = useState(null);
  const cleanupRef = useRef(null);

  const handleMicPress = useCallback(async () => {
    setError(null);

    if (isListening) {
      cleanupRef.current?.();
      setIsListening(false);
      return;
    }

    const granted = await requestMicPermission();
    if (!granted) {
      Alert.alert(
        'Microphone permission needed',
        'Please enable microphone and speech recognition permissions in your device settings.'
      );
      return;
    }

    setDraft(null);
    setLiveTranscript('');
    setIsListening(true);

    cleanupRef.current = startListening({
      onPartialResult: (text) => setLiveTranscript(text),
      onFinalResult: async (text) => {
        setLiveTranscript(text);
        setIsListening(false);
        await handleExtraction(text);
      },
      onError: (err) => {
        setIsListening(false);
        setError(typeof err === 'string' ? err : 'Speech recognition failed. Please try again.');
      },
      onEnd: () => setIsListening(false),
    });
  }, [isListening]);

  const handleExtraction = async (transcript) => {
    if (!transcript || !transcript.trim()) {
      setError('No speech detected. Please try again.');
      return;
    }
    setIsExtracting(true);
    setError(null);
    try {
      const extracted = await extractTaskDetails(transcript);
      setDraft({ ...extracted, transcript });
    } catch (err) {
      setError('Could not extract task details. Please try again.');
    } finally {
      setIsExtracting(false);
    }
  };

  const handleSave = async () => {
    try {
      await saveTask(draft);
      setDraft(null);
      setLiveTranscript('');
      onTaskSaved?.();
      Alert.alert('Saved', 'Your task has been saved.');
    } catch (err) {
      Alert.alert('Error', 'Could not save task. Please try again.');
    }
  };

  const handleDiscard = () => {
    setDraft(null);
    setLiveTranscript('');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Voice to Task</Text>
            <Text style={styles.subtitle}>Speak a task, AI does the rest</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('TaskList')} style={styles.listBtn}>
            <Ionicons name="list-outline" size={22} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.micSection}>
          <VoiceButton isListening={isListening} onPress={handleMicPress} disabled={isExtracting} />
        </View>

        {liveTranscript ? (
          <View style={styles.transcriptBox}>
            <Text style={styles.transcriptText}>{liveTranscript}</Text>
          </View>
        ) : (
          <Text style={styles.hint}>
            Try: "Remind me to call John tomorrow at 5 PM"
          </Text>
        )}

        {isExtracting && (
          <View style={styles.loadingRow}>
            <ActivityIndicator color={colors.primary} />
            <Text style={styles.loadingText}>Extracting task details…</Text>
          </View>
        )}

        {error && (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle-outline" size={18} color={colors.danger} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {draft && (
          <TaskForm
            draft={draft}
            onChange={setDraft}
            onSave={handleSave}
            onDiscard={handleDiscard}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { padding: 20, paddingBottom: 60 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  title: { fontSize: 26, fontWeight: '800', color: colors.textPrimary },
  subtitle: { fontSize: 14, color: colors.textSecondary, marginTop: 2 },
  listBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#EFEBFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  micSection: { alignItems: 'center', marginVertical: 40 },
  transcriptBox: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  transcriptText: { fontSize: 16, color: colors.textPrimary, textAlign: 'center' },
  hint: { textAlign: 'center', color: colors.textSecondary, fontSize: 13, paddingHorizontal: 20 },
  loadingRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20, gap: 8 },
  loadingText: { color: colors.textSecondary },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFECEC',
    padding: 12,
    borderRadius: 10,
    marginTop: 16,
    gap: 8,
  },
  errorText: { color: colors.danger, flex: 1 },
});
