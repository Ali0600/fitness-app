import React, { useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';

export default function WorkoutSwipeRow({
  workout,
  isLast,
  targetSummary,
  onLog,
  onEdit,
  onDelete,
}) {
  const swipeableRef = useRef(null);
  const closeSwipe = () => swipeableRef.current?.close();

  const confirmLog = () => {
    Alert.alert(
      'Log workout',
      `Mark "${workout.name}" as done now?`,
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

  const confirmDelete = () => {
    Alert.alert(
      'Delete workout',
      `Are you sure you want to delete "${workout.name}"?`,
      [
        { text: 'Cancel', style: 'cancel', onPress: closeSwipe },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            onDelete();
            closeSwipe();
          },
        },
      ]
    );
  };

  return (
    <Swipeable
      ref={swipeableRef}
      renderLeftActions={() => (
        <TouchableOpacity style={styles.completeBox} onPress={confirmLog}>
          <Text style={styles.actionText}>Complete</Text>
        </TouchableOpacity>
      )}
      renderRightActions={() => (
        <TouchableOpacity style={styles.deleteBoxRow} onPress={confirmDelete}>
          <Text style={styles.actionText}>Delete</Text>
        </TouchableOpacity>
      )}
    >
      <TouchableOpacity
        style={[styles.workoutRow, !isLast && styles.workoutDivider]}
        onPress={onLog}
        onLongPress={onEdit}
        delayLongPress={400}
        activeOpacity={0.7}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.workoutName}>{workout.name}</Text>
          {targetSummary ? (
            <Text style={styles.workoutTargets}>{targetSummary}</Text>
          ) : null}
        </View>
        <View style={styles.workoutLogBtn}>
          <Text style={styles.workoutLogText}>Log</Text>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  workoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: 'white',
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
  completeBox: {
    backgroundColor: '#2ecc71',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 22,
  },
  deleteBoxRow: {
    backgroundColor: '#e74c3c',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 22,
  },
  actionText: { color: 'white', fontWeight: 'bold' },
});
