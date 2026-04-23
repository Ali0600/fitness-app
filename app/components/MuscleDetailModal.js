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
import LogWorkoutModal from './LogWorkoutModal';
import WorkoutEditorModal from './WorkoutEditorModal';
import {
  avgRestIntervalHours,
  longestRestHours,
  adherence,
  hoursSinceLastWorked,
  lastWorkedAt,
} from '../utils/statsUtils';
import { formatHours, relativeFromNow, restStatusColor } from '../utils/timeUtils';

export default function MuscleDetailModal({ visible, muscle, onClose }) {
  const { workoutLog, deleteLogEntry, updateLogEntry, logWorkout, workouts, muscleGroups } =
    useAppState();
  const history = useMuscleHistory(muscle?.id);
  const [editing, setEditing] = useState(null);
  const [loggingWorkout, setLoggingWorkout] = useState(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState(null);

  if (!muscle) return null;

  const hoursSince = hoursSinceLastWorked(workoutLog, muscle.id);
  const avg = avgRestIntervalHours(workoutLog, muscle.id);
  const longest = longestRestHours(workoutLog, muscle.id);
  const adh = adherence(workoutLog, muscle.id, muscle.recommendedRestHours);

  const parentLast = lastWorkedAt(workoutLog, muscle.id);
  const subGroupRows = (muscle.subGroups || []).map((sg) => {
    const direct = lastWorkedAt(workoutLog, sg.id);
    const effective =
      direct && parentLast
        ? new Date(direct) > new Date(parentLast) ? direct : parentLast
        : direct || parentLast;
    return { ...sg, lastWorkedAt: effective };
  });

  const parentIdSet = new Set((muscleGroups || []).map((m) => m.id));
  const parentNameById = new Map((muscleGroups || []).map((m) => [m.id, m.name]));
  const muscleWorkouts = (workouts || []).filter((w) =>
    w.muscleGroupIds?.includes(muscle.id)
  );
  const targetSummary = (w) =>
    w.muscleGroupIds
      .filter((id) => parentIdSet.has(id))
      .map((id) => parentNameById.get(id))
      .join(' · ');

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

          {subGroupRows.length > 0 && (
            <>
              <Text style={styles.section}>Sub-groups</Text>
              <View style={styles.subGroupCard}>
                {subGroupRows.map((sg, i) => {
                  const dotColor = sg.lastWorkedAt
                    ? restStatusColor(sg.lastWorkedAt, muscle.recommendedRestHours)
                    : '#7f8c8d';
                  return (
                    <View
                      key={sg.id}
                      style={[
                        styles.subGroupRow,
                        i < subGroupRows.length - 1 && styles.subGroupDivider,
                      ]}
                    >
                      <View style={[styles.subDot, { backgroundColor: dotColor }]} />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.subName}>{sg.name}</Text>
                        <Text style={styles.subSub}>
                          {sg.lastWorkedAt ? relativeFromNow(sg.lastWorkedAt) : 'never logged'}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            </>
          )}

          <View style={styles.workoutsHeader}>
            <Text style={styles.section}>Workouts</Text>
            <TouchableOpacity
              onPress={() => {
                setEditingWorkout(null);
                setEditorOpen(true);
              }}
              style={styles.addWorkoutBtn}
            >
              <Feather name="plus" size={16} color="#111" />
              <Text style={styles.addWorkoutText}>Add</Text>
            </TouchableOpacity>
          </View>
          {muscleWorkouts.length === 0 ? (
            <Text style={styles.emptyText}>
              No workouts target this muscle yet. Tap Add to create one.
            </Text>
          ) : (
            <View style={styles.workoutsCard}>
              {muscleWorkouts.map((w, i) => (
                <TouchableOpacity
                  key={w.id}
                  style={[
                    styles.workoutRow,
                    i < muscleWorkouts.length - 1 && styles.workoutDivider,
                  ]}
                  onPress={() => setLoggingWorkout(w)}
                  onLongPress={() => {
                    setEditingWorkout(w);
                    setEditorOpen(true);
                  }}
                  delayLongPress={400}
                  activeOpacity={0.7}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.workoutName}>{w.name}</Text>
                    <Text style={styles.workoutTargets}>{targetSummary(w)}</Text>
                  </View>
                  <View style={styles.workoutLogBtn}>
                    <Text style={styles.workoutLogText}>Log</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

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

        <LogWorkoutModal
          visible={!!loggingWorkout}
          initialWorkout={loggingWorkout}
          onClose={() => setLoggingWorkout(null)}
        />

        <WorkoutEditorModal
          visible={editorOpen}
          workout={editingWorkout}
          presetMuscleId={editingWorkout ? null : muscle.id}
          onClose={() => {
            setEditorOpen(false);
            setEditingWorkout(null);
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
  subGroupCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  subGroupRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  subGroupDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  subDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 12,
  },
  subName: { fontSize: 15, fontWeight: '500', color: '#111' },
  subSub: { fontSize: 12, color: '#888', marginTop: 2 },
  workoutsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  addWorkoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: 'white',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  addWorkoutText: { marginLeft: 4, fontSize: 13, fontWeight: '600', color: '#111' },
  workoutsCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  workoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  workoutDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  workoutName: { fontSize: 15, fontWeight: '600', color: '#111' },
  workoutTargets: { fontSize: 12, color: '#888', marginTop: 2 },
  workoutLogBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#2ecc71',
    borderRadius: 14,
  },
  workoutLogText: { color: 'white', fontWeight: '700', fontSize: 13 },
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
