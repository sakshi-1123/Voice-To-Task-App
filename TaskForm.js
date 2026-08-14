import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export default function TaskForm({ draft, onChange, onSave, onDiscard }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="sparkles-outline" size={18} color={colors.primary} />
        <Text style={styles.headerText}>
          {draft.source === 'ai' ? 'Extracted by AI' : 'Extracted locally (offline)'}
        </Text>
      </View>

      <Text style={styles.label}>Task</Text>
      <TextInput
        style={styles.input}
        value={draft.title}
        onChangeText={(v) => onChange({ ...draft, title: v })}
        placeholder="Task title"
      />

      <View style={styles.row}>
        <View style={styles.half}>
          <Text style={styles.label}>Date</Text>
          <TextInput
            style={styles.input}
            value={draft.date || ''}
            onChangeText={(v) => onChange({ ...draft, date: v })}
            placeholder="e.g. Tomorrow, 23 Jul"
          />
        </View>
        <View style={styles.half}>
          <Text style={styles.label}>Time</Text>
          <TextInput
            style={styles.input}
            value={draft.time || ''}
            onChangeText={(v) => onChange({ ...draft, time: v })}
            placeholder="e.g. 5:00 PM"
          />
        </View>
      </View>

      <Text style={styles.transcriptLabel}>Raw transcript:</Text>
      <Text style={styles.transcript}>"{draft.transcript}"</Text>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.discardBtn} onPress={onDiscard}>
          <Text style={styles.discardText}>Discard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveBtn} onPress={onSave}>
          <Ionicons name="checkmark" size={18} color="#fff" />
          <Text style={styles.saveText}>Save Task</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginTop: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  headerText: { marginLeft: 6, color: colors.primary, fontWeight: '600', fontSize: 13 },
  label: { fontSize: 12, color: colors.textSecondary, marginBottom: 4, marginTop: 8 },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 15,
    color: colors.textPrimary,
    backgroundColor: '#fff',
  },
  row: { flexDirection: 'row', gap: 10 },
  half: { flex: 1 },
  transcriptLabel: { fontSize: 11, color: colors.textSecondary, marginTop: 14 },
  transcript: { fontSize: 12, color: colors.textSecondary, fontStyle: 'italic', marginTop: 2 },
  actions: { flexDirection: 'row', marginTop: 16, gap: 10 },
  discardBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  discardText: { color: colors.textSecondary, fontWeight: '600' },
  saveBtn: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.success,
    gap: 6,
  },
  saveText: { color: '#fff', fontWeight: '700' },
});
