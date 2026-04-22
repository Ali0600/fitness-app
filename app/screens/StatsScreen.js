import React from 'react';
import {
  Modal,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAppState } from '../hooks/useAppState';
import { useMuscleStats } from '../hooks/useMuscleStats';
import { formatHours } from '../utils/timeUtils';

export default function StatsScreen({ visible, onClose }) {
  const { muscleGroups } = useAppState();
  const stats = useMuscleStats();

  const nameFor = (id) => muscleGroups.find((m) => m.id === id)?.name || '—';
  const maxWeek = Math.max(1, ...stats.workoutsPerWeek);

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Feather name="chevron-down" size={26} color="#111" />
          </TouchableOpacity>
          <Text style={styles.title}>Stats</Text>
          <View style={{ width: 26 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.topRow}>
            <Big label="Total workouts" value={stats.totalWorkouts} />
            <Big label="Longest streak" value={`${stats.longestStreak}d`} />
          </View>
          <View style={styles.topRow}>
            <Big
              label="Most trained (30d)"
              value={stats.mostTrained.muscleId ? nameFor(stats.mostTrained.muscleId) : '—'}
              sub={stats.mostTrained.count ? `${stats.mostTrained.count} sessions` : ''}
            />
            <Big
              label="Most neglected"
              value={stats.mostNeglected.muscleId ? nameFor(stats.mostNeglected.muscleId) : '—'}
              sub={
                Number.isFinite(stats.mostNeglected.overdueHours)
                  ? `${formatHours(stats.mostNeglected.overdueHours)} overdue`
                  : ''
              }
            />
          </View>

          <Text style={styles.section}>Workouts per week</Text>
          <View style={styles.weeksBlock}>
            {stats.workoutsPerWeek.map((count, i) => (
              <View key={i} style={styles.weekRow}>
                <Text style={styles.weekLabel}>{i === 0 ? 'This week' : `${i}w ago`}</Text>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      { width: `${(count / maxWeek) * 100}%` },
                    ]}
                  />
                </View>
                <Text style={styles.weekCount}>{count}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.section}>Per-muscle averages</Text>
          <View style={styles.tableHeader}>
            <Text style={[styles.th, { flex: 2 }]}>Muscle</Text>
            <Text style={styles.th}>Avg rest</Text>
            <Text style={styles.th}>Sessions</Text>
            <Text style={styles.th}>Adherence</Text>
          </View>
          {muscleGroups.map((mg) => {
            const pm = stats.perMuscle.get(mg.id);
            return (
              <View key={mg.id} style={styles.tr}>
                <Text style={[styles.td, { flex: 2 }]}>{mg.name}</Text>
                <Text style={styles.td}>{pm.avgRestHours != null ? formatHours(pm.avgRestHours) : '—'}</Text>
                <Text style={styles.td}>{pm.totalWorkouts}</Text>
                <Text style={styles.td}>{pm.adherence != null ? `${Math.round(pm.adherence * 100)}%` : '—'}</Text>
              </View>
            );
          })}
        </ScrollView>
      </View>
    </Modal>
  );
}

function Big({ label, value, sub }) {
  return (
    <View style={styles.big}>
      <Text style={styles.bigValue}>{value}</Text>
      <Text style={styles.bigLabel}>{label}</Text>
      {sub ? <Text style={styles.bigSub}>{sub}</Text> : null}
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
  topRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  big: {
    flex: 1,
    backgroundColor: 'white',
    padding: 14,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  bigValue: { fontSize: 22, fontWeight: '700', color: '#111' },
  bigLabel: { fontSize: 12, color: '#666', marginTop: 2 },
  bigSub: { fontSize: 11, color: '#999', marginTop: 2 },
  section: { fontSize: 13, fontWeight: '700', color: '#666', marginTop: 20, marginBottom: 8, textTransform: 'uppercase' },
  weeksBlock: { backgroundColor: 'white', padding: 12, borderRadius: 12 },
  weekRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 4 },
  weekLabel: { width: 72, fontSize: 13, color: '#555' },
  barTrack: { flex: 1, height: 10, backgroundColor: '#f0f0f0', borderRadius: 5, overflow: 'hidden' },
  barFill: { height: '100%', backgroundColor: '#111' },
  weekCount: { width: 28, textAlign: 'right', fontSize: 13, fontWeight: '600' },
  tableHeader: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#eee',
    borderRadius: 8,
    marginBottom: 4,
  },
  th: { flex: 1, fontSize: 11, fontWeight: '700', color: '#666', textTransform: 'uppercase' },
  tr: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  td: { flex: 1, fontSize: 13, color: '#222' },
});
