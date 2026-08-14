import AsyncStorage from '@react-native-async-storage/async-storage';

const TASKS_KEY = '@voice_to_task/tasks';

/**
 * Fetch all tasks from local storage, newest first.
 */
export async function getTasks() {
  try {
    const raw = await AsyncStorage.getItem(TASKS_KEY);
    const tasks = raw ? JSON.parse(raw) : [];
    return tasks.sort((a, b) => b.createdAt - a.createdAt);
  } catch (err) {
    console.error('storageService.getTasks failed:', err);
    return [];
  }
}

/**
 * Persist a new task. Returns the saved task (with id).
 */
export async function saveTask(task) {
  try {
    const existing = await getTasks();
    const newTask = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: Date.now(),
      completed: false,
      ...task,
    };
    const updated = [newTask, ...existing];
    await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(updated));
    return newTask;
  } catch (err) {
    console.error('storageService.saveTask failed:', err);
    throw err;
  }
}

/**
 * Toggle a task's completed state.
 */
export async function toggleTaskCompleted(taskId) {
  const existing = await getTasks();
  const updated = existing.map((t) =>
    t.id === taskId ? { ...t, completed: !t.completed } : t
  );
  await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(updated));
  return updated;
}

/**
 * Delete a task by id.
 */
export async function deleteTask(taskId) {
  const existing = await getTasks();
  const updated = existing.filter((t) => t.id !== taskId);
  await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(updated));
  return updated;
}

/**
 * Wipe all tasks (used for debugging / reset button).
 */
export async function clearAllTasks() {
  await AsyncStorage.removeItem(TASKS_KEY);
}
