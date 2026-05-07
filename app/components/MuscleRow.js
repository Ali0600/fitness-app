import React, { memo, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { Feather } from '@expo/vector-icons';
import { relativeFromNow, restStatusColor, isRested } from '../utils/timeUtils';
import { useAppState } from '../hooks/useAppState';
import WorkoutSwipeRow from './WorkoutSwipeRow';
import { buildTargetSummary } from '../utils/workoutDisplay';

function MuscleRow({
  muscle,
  lastWorkedAt,
  hoursSince,
  onLog,
  onTap,
  onLogWorkout,
  onEditWorkout,
  onDeleteWorkout,
}) {
  const swipeableRef = useRef(null);
  const closeSwipe = () => swipeableRef.current?.close();
  const { workouts, muscleGroups } = useAppState();
  const [expanded, setExpanded] = useState(false);

  const muscleWorkouts = (workouts || []).filter((w) =>
    w.muscleGroupIds?.includes(muscle.id)
  );

  const rested = isRested(lastWorkedAt, muscle.recommendedRestHours);
  const dotColor = lastWorkedAt ? restStatusColor(lastWorkedAt, muscle.recommendedRestHours) : '#7f8c8d';

  const handleLog = () => {
    Alert.alert(
      'Log workout',
      `Record that you worked ${muscle.name} right now?`,
      [
        { text: 'Cancel', style: 'cancel', onPress: closeSwipe },
        {
          text: 'Log',
          style: 'default',
          onPress: () => {
            onLog();
            closeSwipe();
          },
        },
      ]
    );
  };

  const handlePress = () => {
    setExpanded((e) => !e);
  };

  return (
    <Swipeable
      ref={swipeableRef}
      leftThreshold={80}
      onSwipeableOpen={() => handleLog()}
      renderLeftActions={() => (
        <TouchableOpacity style={styles.logBox} onPress={handleLog}>
          <Text style={styles.actionText}>Log now</Text>
        </TouchableOpacity>
      )}
    >
      <View>
        <TouchableOpacity
          style={styles.row}
          onPress={handlePress}
          onLongPress={onTap}
          delayLongPress={300}
          activeOpacity={0.7}
        >
          <View style={[styles.dot, { backgroundColor: dotColor }]} />
          <View style={styles.textCol}>
            <Text style={styles.name}>{muscle.name}</Text>
            <Text style={styles.sub}>
              {lastWorkedAt
                ? `${relativeFromNow(lastWorkedAt)} · ${rested ? 'ready' : 'recovering'}`
                : 'never logged'}
              {' · target '}
              {muscle.recommendedRestHours}h
            </Text>
          </View>
          <Text style={styles.hours}>
            {Number.isFinite(hoursSince)
              ? `${hoursSince < 24 ? hoursSince.toFixed(1) + 'h' : Math.floor(hoursSince / 24) + 'd'}`
              : '∞'}
          </Text>
          <Feather
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={18}
            color="#888"
            style={styles.chevron}
          />
        </TouchableOpacity>

        {expanded && (
          <View style={styles.workoutsCard}>
            {muscleWorkouts.length === 0 ? (
              <View style={styles.emptyRow}>
                <Text style={styles.emptyText}>No workouts yet · long-press to add</Text>
              </View>
            ) : (
              muscleWorkouts.map((w, i) => (
                <WorkoutSwipeRow
                  key={w.id}
                  workout={w}
                  isLast={i === muscleWorkouts.length - 1}
                  targetSummary={buildTargetSummary(w, muscleGroups)}
                  onLog={() => onLogWorkout && onLogWorkout(w)}
                  onEdit={() => onEditWorkout && onEditWorkout(w)}
                  onDelete={() => onDeleteWorkout && onDeleteWorkout(w.id)}
                />
              ))
            )}
          </View>
        )}
      </View>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  row: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
    marginHorizontal: 12,
    marginVertical: 4,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 14,
  },
  textCol: {
    flex: 1,
  },
  name: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111',
  },
  sub: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  hours: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  logBox: {
    backgroundColor: '#2ecc71',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginVertical: 4,
    marginLeft: 12,
    borderRadius: 14,
  },
  actionText: {
    color: 'white',
    fontWeight: 'bold',
  },
  chevron: {
    marginLeft: 8,
  },
  workoutsCard: {
    backgroundColor: 'white',
    borderRadius: 14,
    marginHorizontal: 12,
    marginTop: -2,
    marginBottom: 4,
    paddingHorizontal: 14,
    overflow: 'hidden',
  },
  emptyRow: {
    paddingVertical: 14,
  },
  emptyText: {
    color: '#999',
    fontSize: 13,
  },
});

export default memo(MuscleRow);
