import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

import TaskCard from '../components/TaskCard';
import { colors } from '../theme/colors';
import { getTasks, toggleTaskCompleted, deleteTask } from '../services/storageService';

export default function TaskListScreen({ navigation }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    const data = await getTasks();
    setTasks(data);
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, [loadTasks])
  );

  const handleToggle = async (id) => {
    const updated = await toggleTaskCompleted(id);
    setTasks(updated.sort((a, b) => b.createdAt - a.createdAt));
  };

  const handleDelete = async (id) => {
    const updated = await deleteTask(id);
    setTasks(updated.sort((a, b) => b.createdAt - a.createdAt));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>My Tasks</Text>
        <View style={{ width: 22 }} />
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshing={loading}
        onRefresh={loadTasks}
        renderItem={({ item }) => (
          <TaskCard task={item} onToggleComplete={handleToggle} onDelete={handleDelete} />
        )}
        ListEmptyComponent={
          !loading && (
            <View style={styles.empty}>
              <Ionicons name="mic-off-outline" size={40} color={colors.border} />
              <Text style={styles.emptyText}>No tasks yet. Speak one on the home screen!</Text>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: { padding: 4 },
  title: { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
  listContent: { padding: 16, paddingTop: 4 },
  empty: { alignItems: 'center', marginTop: 80, paddingHorizontal: 40 },
  emptyText: { marginTop: 12, color: colors.textSecondary, textAlign: 'center' },
});
