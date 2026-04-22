import React, { memo, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { relativeFromNow, restStatusColor, isRested } from '../utils/timeUtils';

function MuscleRow({ muscle, lastWorkedAt, hoursSince, onLog, onTap }) {
  const swipeableRef = useRef(null);
  const closeSwipe = () => swipeableRef.current?.close();

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

  return (
    <Swipeable
      ref={swipeableRef}
      leftThreshold={80}
      onSwipeableOpen={(direction) => {
        if (direction === 'left') handleLog();
      }}
      renderLeftActions={() => (
        <TouchableOpacity style={styles.logBox} onPress={handleLog}>
          <Text style={styles.actionText}>Log now</Text>
        </TouchableOpacity>
      )}
    >
      <TouchableOpacity style={styles.row} onPress={onTap} activeOpacity={0.7}>
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
      </TouchableOpacity>
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
});

export default memo(MuscleRow);
