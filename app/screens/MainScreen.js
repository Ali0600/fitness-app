import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import MuscleRow from '../components/MuscleRow';
import BodyVisualization from '../components/BodyVisualization';
import LogWorkoutModal from '../components/LogWorkoutModal';
import MuscleDetailModal from '../components/MuscleDetailModal';
import SettingsModal from '../components/SettingsModal';
import StatsScreen from './StatsScreen';
import { useAppState, useAppLoading } from '../hooks/useAppState';
import { useMuscleStats } from '../hooks/useMuscleStats';
import { useNotifications } from '../hooks/useNotifications';

export default function MainScreen() {
  const { logWorkout, workoutLog } = useAppState();
  const { isLoading } = useAppLoading();
  const [refreshTick, setRefreshTick] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const stats = useMuscleStats(refreshTick);
  useNotifications();

  const [logOpen, setLogOpen] = useState(false);
  const [logInitialIds, setLogInitialIds] = useState([]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);
  const [detailMuscle, setDetailMuscle] = useState(null);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setRefreshTick((t) => t + 1);
    setTimeout(() => setRefreshing(false), 350);
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#111" />
      </View>
    );
  }

  const renderItem = ({ item }) => {
    const pm = stats.perMuscle.get(item.id);
    return (
      <MuscleRow
        muscle={item}
        lastWorkedAt={pm?.lastWorkedAt}
        hoursSince={pm?.hoursSince ?? Infinity}
        onLog={() => logWorkout([item.id])}
        onTap={() => setDetailMuscle(item)}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.topBar}>
        <Text style={styles.appTitle}>Rested</Text>
        <View style={styles.iconRow}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => setStatsOpen(true)}>
            <Feather name="bar-chart-2" size={22} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => {
              setLogInitialIds([]);
              setLogOpen(true);
            }}
          >
            <Feather name="plus" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={() => setSettingsOpen(true)}>
            <Feather name="settings" size={22} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.bodyContainer}>
        <BodyVisualization targetMuscleId={stats.longestRestedId} />
        {stats.longestRestedId && (
          <View style={styles.bodyLabel}>
            <Text style={styles.bodyLabelText}>
              Longest rested:{' '}
              <Text style={styles.bodyLabelBold}>
                {stats.sortedMuscles[0]?.name}
              </Text>
            </Text>
          </View>
        )}
      </View>

      <FlatList
        data={stats.sortedMuscles}
        renderItem={renderItem}
        keyExtractor={(m) => m.id}
        contentContainerStyle={styles.listContent}
        extraData={refreshTick}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#2ecc71"
            colors={['#2ecc71']}
          />
        }
        ListHeaderComponent={
          workoutLog.length === 0 ? (
            <TouchableOpacity
              style={styles.emptyCard}
              activeOpacity={0.85}
              onPress={() => {
                setLogInitialIds([]);
                setLogOpen(true);
              }}
            >
              <View style={styles.emptyIconCircle}>
                <Feather name="plus" size={22} color="white" />
              </View>
              <View style={styles.emptyTextCol}>
                <Text style={styles.emptyTitle}>Log your first workout</Text>
                <Text style={styles.emptySubtitle}>
                  Tap here, or any muscle below, to start tracking rest.
                </Text>
              </View>
            </TouchableOpacity>
          ) : null
        }
      />

      <LogWorkoutModal
        visible={logOpen}
        initialMuscleIds={logInitialIds}
        onClose={() => setLogOpen(false)}
      />
      <MuscleDetailModal
        visible={!!detailMuscle}
        muscle={detailMuscle}
        onClose={() => setDetailMuscle(null)}
      />
      <SettingsModal visible={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <StatsScreen visible={statsOpen} onClose={() => setStatsOpen(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f7f7' },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f7f7f7' },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#0b0b0b',
  },
  appTitle: { fontSize: 22, fontWeight: '800', color: 'white', letterSpacing: 0.3 },
  iconRow: { flexDirection: 'row' },
  iconBtn: { padding: 8, marginLeft: 4 },
  bodyContainer: {
    height: 320,
    backgroundColor: '#0b0b0b',
  },
  bodyLabel: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  bodyLabelText: { color: 'rgba(255,255,255,0.85)', fontSize: 13 },
  bodyLabelBold: { color: '#2ecc71', fontWeight: '700' },
  listContent: { paddingVertical: 6, paddingBottom: 30 },
  emptyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
    marginTop: 10,
    marginBottom: 6,
    padding: 14,
    borderRadius: 14,
    backgroundColor: '#0b0b0b',
  },
  emptyIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2ecc71',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  emptyTextCol: { flex: 1 },
  emptyTitle: { color: 'white', fontSize: 15, fontWeight: '700' },
  emptySubtitle: { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 2 },
});
