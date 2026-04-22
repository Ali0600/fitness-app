import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Switch,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAppState } from '../hooks/useAppState';

export default function LogWorkoutModal({ visible, onClose, initialMuscleIds = [] }) {
  const { muscleGroups, logWorkout } = useAppState();
  const [selected, setSelected] = useState(new Set(initialMuscleIds));
  const [notes, setNotes] = useState('');
  const [addDetail, setAddDetail] = useState(false);
  const [exercises, setExercises] = useState([]);

  const reset = () => {
    setSelected(new Set(initialMuscleIds));
    setNotes('');
    setAddDetail(false);
    setExercises([]);
  };

  const close = () => {
    reset();
    onClose();
  };

  const toggle = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const addExercise = () => {
    setExercises((prev) => [...prev, { name: '', sets: [{ reps: '', weight: '' }] }]);
  };

  const updateExerciseName = (idx, name) => {
    setExercises((prev) => prev.map((e, i) => (i === idx ? { ...e, name } : e)));
  };

  const addSet = (exIdx) => {
    setExercises((prev) =>
      prev.map((e, i) =>
        i === exIdx ? { ...e, sets: [...e.sets, { reps: '', weight: '' }] } : e
      )
    );
  };

  const updateSet = (exIdx, setIdx, field, value) => {
    setExercises((prev) =>
      prev.map((e, i) => {
        if (i !== exIdx) return e;
        const sets = e.sets.map((s, j) => (j === setIdx ? { ...s, [field]: value } : s));
        return { ...e, sets };
      })
    );
  };

  const removeExercise = (idx) => {
    setExercises((prev) => prev.filter((_, i) => i !== idx));
  };

  const save = () => {
    const ids = Array.from(selected);
    if (ids.length === 0) return;
    const cleanedExercises = addDetail
      ? exercises
          .filter((e) => e.name.trim())
          .map((e) => ({
            name: e.name.trim(),
            sets: e.sets
              .filter((s) => s.reps || s.weight)
              .map((s) => ({
                reps: Number(s.reps) || 0,
                weight: Number(s.weight) || 0,
              })),
          }))
      : [];
    logWorkout(ids, { notes: notes.trim(), exercises: cleanedExercises });
    close();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={close}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={close}>
            <Text style={styles.cancel}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Log workout</Text>
          <TouchableOpacity onPress={save} disabled={selected.size === 0}>
            <Text style={[styles.save, selected.size === 0 && styles.saveDisabled]}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.section}>Muscles worked</Text>
          <View style={styles.chipWrap}>
            {muscleGroups.map((mg) => {
              const on = selected.has(mg.id);
              return (
                <TouchableOpacity
                  key={mg.id}
                  style={[styles.chip, on && styles.chipOn]}
                  onPress={() => toggle(mg.id)}
                >
                  <Text style={[styles.chipText, on && styles.chipTextOn]}>{mg.name}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.section}>Notes (optional)</Text>
          <TextInput
            style={styles.notes}
            value={notes}
            onChangeText={setNotes}
            placeholder="How did it feel?"
            multiline
          />

          <View style={styles.detailToggleRow}>
            <Text style={styles.detailToggleText}>Add exercise detail</Text>
            <Switch value={addDetail} onValueChange={setAddDetail} />
          </View>

          {addDetail && (
            <View>
              {exercises.map((ex, exIdx) => (
                <View key={exIdx} style={styles.exerciseCard}>
                  <View style={styles.exerciseHeader}>
                    <TextInput
                      style={styles.exerciseName}
                      value={ex.name}
                      onChangeText={(t) => updateExerciseName(exIdx, t)}
                      placeholder="Exercise name (e.g. Bench Press)"
                    />
                    <TouchableOpacity onPress={() => removeExercise(exIdx)}>
                      <Feather name="x" size={20} color="#888" />
                    </TouchableOpacity>
                  </View>
                  {ex.sets.map((s, setIdx) => (
                    <View key={setIdx} style={styles.setRow}>
                      <Text style={styles.setLabel}>Set {setIdx + 1}</Text>
                      <TextInput
                        style={styles.setInput}
                        value={String(s.reps)}
                        onChangeText={(t) => updateSet(exIdx, setIdx, 'reps', t)}
                        placeholder="reps"
                        keyboardType="numeric"
                      />
                      <Text style={styles.setX}>×</Text>
                      <TextInput
                        style={styles.setInput}
                        value={String(s.weight)}
                        onChangeText={(t) => updateSet(exIdx, setIdx, 'weight', t)}
                        placeholder="weight"
                        keyboardType="numeric"
                      />
                    </View>
                  ))}
                  <TouchableOpacity onPress={() => addSet(exIdx)} style={styles.addSet}>
                    <Text style={styles.addSetText}>+ Add set</Text>
                  </TouchableOpacity>
                </View>
              ))}
              <TouchableOpacity onPress={addExercise} style={styles.addExercise}>
                <Feather name="plus" size={18} color="#111" />
                <Text style={styles.addExerciseText}>Add exercise</Text>
              </TouchableOpacity>
            </View>
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
  title: { fontSize: 17, fontWeight: '700' },
  cancel: { fontSize: 16, color: '#888' },
  save: { fontSize: 16, color: '#111', fontWeight: '700' },
  saveDisabled: { color: '#bbb' },
  scroll: { padding: 16, paddingBottom: 60 },
  section: { fontSize: 13, fontWeight: '700', color: '#666', marginTop: 8, marginBottom: 8, textTransform: 'uppercase' },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap' },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: 'white',
    borderRadius: 18,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  chipOn: { backgroundColor: '#111', borderColor: '#111' },
  chipText: { color: '#333' },
  chipTextOn: { color: 'white', fontWeight: '600' },
  notes: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 12,
    minHeight: 60,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#eee',
  },
  detailToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 8,
  },
  detailToggleText: { fontSize: 15, fontWeight: '600', color: '#333' },
  exerciseCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  exerciseHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  exerciseName: { flex: 1, fontSize: 15, fontWeight: '600', paddingVertical: 4 },
  setRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
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
  addExercise: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  addExerciseText: { marginLeft: 6, fontWeight: '600', color: '#111' },
});
