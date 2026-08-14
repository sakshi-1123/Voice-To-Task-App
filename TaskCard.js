import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export default function TaskCard({ task, onToggleComplete, onDelete }) {
  return (
    <View style={[styles.card, task.completed && styles.cardCompleted]}>
      <TouchableOpacity onPress={() => onToggleComplete(task.id)} style={styles.checkbox}>
        <Ionicons
          name={task.completed ? 'checkmark-circle' : 'ellipse-outline'}
          size={26}
          color={task.completed ? colors.success : colors.textSecondary}
        />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={[styles.title, task.completed && styles.titleCompleted]}>
          {task.title}
        </Text>

        <View style={styles.metaRow}>
          {task.date ? (
            <View style={styles.metaChip}>
              <Ionicons name="calendar-outline" size={13} color={colors.primary} />
              <Text style={styles.metaText}>{task.date}</Text>
            </View>
          ) : null}
          {task.time ? (
            <View style={styles.metaChip}>
              <Ionicons name="time-outline" size={13} color={colors.primary} />
              <Text style={styles.metaText}>{task.time}</Text>
            </View>
          ) : null}
          <View style={[styles.sourceChip, task.source === 'ai' ? styles.aiChip : styles.localChip]}>
            <Text style={styles.sourceText}>
              {task.source === 'ai' ? 'AI extracted' : 'Local parser'}
            </Text>
          </View>
        </View>

        <Text style={styles.transcript} numberOfLines={2}>
          "{task.transcript}"
        </Text>
      </View>

      <TouchableOpacity onPress={() => onDelete(task.id)} style={styles.deleteBtn}>
        <Ionicons name="trash-outline" size={20} color={colors.danger} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardCompleted: { opacity: 0.55 },
  checkbox: { marginRight: 10, marginTop: 2 },
  content: { flex: 1 },
  title: { fontSize: 16, fontWeight: '600', color: colors.textPrimary },
  titleCompleted: { textDecorationLine: 'line-through' },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 6, gap: 6 },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0EEFC',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginRight: 6,
    marginBottom: 4,
  },
  metaText: { fontSize: 12, color: colors.primary, marginLeft: 4 },
  sourceChip: { borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3, marginBottom: 4 },
  aiChip: { backgroundColor: '#E5F9F1' },
  localChip: { backgroundColor: '#FFF3DE' },
  sourceText: { fontSize: 11, color: colors.textSecondary },
  transcript: { marginTop: 6, fontSize: 12, color: colors.textSecondary, fontStyle: 'italic' },
  deleteBtn: { justifyContent: 'center', paddingLeft: 8 },
});
