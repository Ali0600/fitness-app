import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import moment from 'moment';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { useAppState } from '../hooks/useAppState';
import { useMuscleHistory } from '../hooks/useMuscleStats';
import PromptModal from './PromptModal';
import {
  avgRestIntervalHours,
  longestRestHours,
  adherence,
  hoursSinceLastWorked,
} from '../utils/statsUtils';
import { formatHours } from '../utils/timeUtils';

export default function MuscleDetailModal({ visible, muscle, onClose }) {
  const { workoutLog, deleteLogEntry, updateLogEntry, logWorkout } = useAppState();
  const history = useMuscleHistory(muscle?.id);
  const [editing, setEditing] = useState(null);

  if (!muscle) return null;

  const hoursSince = hoursSinceLastWorked(workoutLog, muscle.id);
  const avg = avgRestIntervalHours(workoutLog, muscle.id);
  const longest = longestRestHours(workoutLog, muscle.id);
  const adh = adherence(workoutLog, muscle.id, muscle.recommendedRestHours);

  const handleDelete = (entry) => {
    Alert.alert('Delete entry?', moment(entry.timestamp).format('LLL'), [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteLogEntry(entry.id) },
    ]);
  };

  const backdate = () => {
    if (history.length === 0) {
      logWorkout([muscle.id], {
        timestamp: new Date(Date.now() - 80 * 3600 * 1000).toISOString(),
      });
    } else {
      const last = history[0];
      updateLogEntry(last.id, {
        timestamp: new Date(Date.now() - 80 * 3600 * 1000).toISOString(),
      });
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Feather name="chevron-down" size={26} color="#111" />
          </TouchableOpacity>
          <Text style={styles.title}>{muscle.name}</Text>
          <View style={{ width: 26 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.bigStat}>
            {Number.isFinite(hoursSince) ? formatHours(hoursSince) : 'Never worked'}
          </Text>
          <Text style={styles.bigStatSub}>since last workout · target rest {muscle.recommendedRestHours}h</Text>

          <View style={styles.statGrid}>
            <Stat label="Total workouts" value={history.length} />
            <Stat label="Avg rest" value={avg != null ? formatHours(avg) : '—'} />
            <Stat label="Longest rest" value={longest != null ? formatHours(longest) : '—'} />
            <Stat label="Adherence" value={adh != null ? `${Math.round(adh * 100)}%` : '—'} />
          </View>

          <Text style={styles.section}>History</Text>
          {history.length === 0 && (
            <Text style={styles.emptyText}>No workouts yet. Swipe a muscle row on the main screen to log one.</Text>
          )}
          {history.map((entry) => (
            <Swipeable
              key={entry.id}
              renderRightActions={() => (
                <TouchableOpacity style={styles.deleteBox} onPress={() => handleDelete(entry)}>
                  <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
              )}
            >
              <TouchableOpacity
                style={styles.entry}
                onLongPress={() => setEditing(entry)}
                delayLongPress={400}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.entryTime}>{moment(entry.timestamp).format('LLL')}</Text>
                  <Text style={styles.entrySub}>
                    {moment(entry.timestamp).fromNow()}
                    {entry.muscleGroupIds.length > 1 && ` · +${entry.muscleGroupIds.length - 1} more`}
                  </Text>
                  {entry.notes ? <Text style={styles.entryNotes}>{entry.notes}</Text> : null}
                  {entry.exercises?.length > 0 && (
                    <View style={styles.exerciseBlock}>
                      {entry.exercises.map((ex, i) => (
                        <Text key={i} style={styles.exerciseLine}>
                          {ex.name}
                          {ex.sets?.length > 0 &&
                            ` · ${ex.sets.map((s) => `${s.reps}×${s.weight}`).join(', ')}`}
                        </Text>
                      ))}
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            </Swipeable>
          ))}

          {__DEV__ && (
            <TouchableOpacity style={styles.devBtn} onPress={backdate}>
              <Text style={styles.devBtnText}>DEV: Backdate last entry by 80h</Text>
            </TouchableOpacity>
          )}
        </ScrollView>

        <PromptModal
          visible={!!editing}
          title="Edit timestamp"
          message="Enter ISO date (e.g. 2026-04-20T14:00)"
          initialValue={editing ? moment(editing.timestamp).format('YYYY-MM-DDTHH:mm') : ''}
          onCancel={() => setEditing(null)}
          onSubmit={(value) => {
            const parsed = moment(value);
            if (parsed.isValid()) {
              updateLogEntry(editing.id, { timestamp: parsed.toISOString() });
            }
            setEditing(null);
          }}
        />
      </View>
    </Modal>
  );
}

function Stat({ label, value }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
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
  scroll: { padding: 16, paddingBottom: 60 },
  bigStat: { fontSize: 40, fontWeight: '700', color: '#111', textAlign: 'center', marginTop: 16 },
  bigStatSub: { fontSize: 13, color: '#666', textAlign: 'center', marginBottom: 24 },
  statGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  stat: {
    width: '48%',
    backgroundColor: 'white',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
  },
  statValue: { fontSize: 22, fontWeight: '700', color: '#111' },
  statLabel: { fontSize: 12, color: '#666', marginTop: 2 },
  section: { fontSize: 13, fontWeight: '700', color: '#666', marginTop: 8, marginBottom: 8, textTransform: 'uppercase' },
  emptyText: { color: '#999', fontSize: 14, padding: 12 },
  entry: {
    backgroundColor: 'white',
    padding: 14,
    borderRadius: 10,
    marginBottom: 8,
  },
  entryTime: { fontSize: 15, fontWeight: '600', color: '#111' },
  entrySub: { fontSize: 12, color: '#888', marginTop: 2 },
  entryNotes: { fontSize: 14, color: '#333', marginTop: 6 },
  exerciseBlock: { marginTop: 6 },
  exerciseLine: { fontSize: 13, color: '#555', marginTop: 2 },
  deleteBox: {
    backgroundColor: '#e74c3c',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 22,
    marginBottom: 8,
    borderRadius: 10,
  },
  deleteText: { color: 'white', fontWeight: 'bold' },
  devBtn: {
    padding: 12,
    backgroundColor: '#ffd54f',
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
  },
  devBtnText: { fontSize: 13, fontWeight: '700', color: '#222' },
});
