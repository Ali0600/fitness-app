import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAppState } from '../hooks/useAppState';

export default function WorkoutEditorModal({
  visible,
  onClose,
  workout = null,
  presetMuscleId = null,
}) {
  const { muscleGroups, addWorkout, updateWorkout, deleteWorkout } = useAppState();
  const isEdit = !!workout;

  const [name, setName] = useState('');
  const [selected, setSelected] = useState(new Set());
  const [sets, setSets] = useState([{ reps: '', weight: '' }]);

  useEffect(() => {
    if (!visible) return;
    if (workout) {
      setName(workout.name || '');
      setSelected(new Set(workout.muscleGroupIds || []));
      setSets(
        (workout.defaultSets || [{ reps: 8, weight: 0 }]).map((s) => ({
          reps: String(s.reps ?? ''),
          weight: String(s.weight ?? ''),
        }))
      );
    } else {
      setName('');
      const initial = new Set();
      if (presetMuscleId) initial.add(presetMuscleId);
      setSelected(initial);
      setSets([{ reps: '8', weight: '0' }]);
    }
  }, [visible, workout, presetMuscleId]);

  const toggle = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const updateSet = (idx, field, value) => {
    setSets((prev) => prev.map((s, i) => (i === idx ? { ...s, [field]: value } : s)));
  };

  const addSet = () => {
    const last = sets[sets.length - 1] || { reps: '8', weight: '0' };
    setSets((prev) => [...prev, { reps: last.reps, weight: last.weight }]);
  };

  const removeSet = (idx) => {
    setSets((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== idx) : prev));
  };

  const canSave = name.trim().length > 0 && selected.size > 0;

  const save = () => {
    if (!canSave) return;
    const cleaned = {
      name: name.trim(),
      muscleGroupIds: Array.from(selected),
      defaultSets: sets
        .map((s) => ({
          reps: Number(s.reps) || 0,
          weight: Number(s.weight) || 0,
        }))
        .filter((s) => s.reps > 0 || s.weight > 0),
    };
    if (cleaned.defaultSets.length === 0) cleaned.defaultSets = [{ reps: 8, weight: 0 }];

    if (isEdit) {
      updateWorkout(workout.id, cleaned);
    } else {
      addWorkout(cleaned);
    }
    onClose();
  };

  const confirmDelete = () => {
    Alert.alert(
      'Delete workout?',
      `"${workout.name}" will be removed from all muscle views. History entries stay.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteWorkout(workout.id);
            onClose();
          },
        },
      ]
    );
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.cancel}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.title} numberOfLines={1}>
            {isEdit ? 'Edit workout' : 'New workout'}
          </Text>
          <TouchableOpacity onPress={save} disabled={!canSave}>
            <Text style={[styles.save, !canSave && styles.saveDisabled]}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.section}>Name</Text>
          <TextInput
            style={styles.nameInput}
            value={name}
            onChangeText={setName}
            placeholder="e.g. Preacher Curl"
          />

          <Text style={styles.section}>Targets</Text>
          {muscleGroups.map((mg) => {
            const parentOn = selected.has(mg.id);
            return (
              <View key={mg.id} style={styles.targetBlock}>
                <Text style={styles.targetGroupName}>{mg.name}</Text>
                <View style={styles.chipWrap}>
                  <TouchableOpacity
                    style={[styles.chip, styles.chipParent, parentOn && styles.chipOn]}
                    onPress={() => toggle(mg.id)}
                  >
                    <Text style={[styles.chipText, parentOn && styles.chipTextOn]}>
                      {mg.name}
                    </Text>
                  </TouchableOpacity>
                  {(mg.subGroups || []).map((sg) => {
                    const on = selected.has(sg.id);
                    return (
                      <TouchableOpacity
                        key={sg.id}
                        style={[styles.chip, on && styles.chipOn]}
                        onPress={() => toggle(sg.id)}
                      >
                        <Text style={[styles.chipText, on && styles.chipTextOn]}>
                          {sg.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            );
          })}

          <Text style={styles.section}>Default sets</Text>
          <View style={styles.setsCard}>
            {sets.map((s, i) => (
              <View key={i} style={styles.setRow}>
                <Text style={styles.setLabel}>Set {i + 1}</Text>
                <TextInput
                  style={styles.setInput}
                  value={String(s.reps)}
                  onChangeText={(t) => updateSet(i, 'reps', t)}
                  placeholder="reps"
                  keyboardType="numeric"
                />
                <Text style={styles.setX}>×</Text>
                <TextInput
                  style={styles.setInput}
                  value={String(s.weight)}
                  onChangeText={(t) => updateSet(i, 'weight', t)}
                  placeholder="weight"
                  keyboardType="numeric"
                />
                <TouchableOpacity onPress={() => removeSet(i)} disabled={sets.length <= 1}>
                  <Feather
                    name="x"
                    size={18}
                    color={sets.length <= 1 ? '#ddd' : '#888'}
                    style={{ marginLeft: 8 }}
                  />
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity onPress={addSet} style={styles.addSet}>
              <Text style={styles.addSetText}>+ Add set</Text>
            </TouchableOpacity>
          </View>

          {isEdit && (
            <TouchableOpacity onPress={confirmDelete} style={styles.deleteBtn}>
              <Text style={styles.deleteBtnText}>Delete workout</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f7f7' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: { fontSize: 17, fontWeight: '700', flex: 1, textAlign: 'center', marginHorizontal: 12 },
  cancel: { fontSize: 16, color: '#888' },
  save: { fontSize: 16, color: '#111', fontWeight: '700' },
  saveDisabled: { color: '#bbb' },
  scroll: { padding: 16, paddingBottom: 80 },
  section: {
    fontSize: 13,
    fontWeight: '700',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  nameInput: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#eee',
  },
  targetBlock: { marginBottom: 8 },
  targetGroupName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#888',
    marginBottom: 6,
    marginTop: 4,
  },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap' },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'white',
    borderRadius: 16,
    marginRight: 6,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  chipParent: { borderColor: '#111' },
  chipOn: { backgroundColor: '#111', borderColor: '#111' },
  chipText: { color: '#333', fontSize: 13 },
  chipTextOn: { color: 'white', fontWeight: '600' },
  setsCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  setRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  setLabel: { width: 56, color: '#666', fontSize: 13 },
  setInput: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    padding: 8,
    borderRadius: 6,
    fontSize: 14,
  },
  setX: { marginHorizontal: 6, color: '#888' },
  addSet: { marginTop: 4, alignSelf: 'flex-start' },
  addSetText: { color: '#555', fontSize: 13, fontWeight: '600' },
  deleteBtn: {
    marginTop: 24,
    padding: 14,
    borderRadius: 10,
    backgroundColor: '#fff0ee',
    borderWidth: 1,
    borderColor: '#f5c6c0',
    alignItems: 'center',
  },
  deleteBtnText: { color: '#e74c3c', fontWeight: '700', fontSize: 15 },
});
