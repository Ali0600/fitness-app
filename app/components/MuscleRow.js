import React, { memo, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { Feather } from '@expo/vector-icons';
import { relativeFromNow, restStatusColor, isRested } from '../utils/timeUtils';
import { useAppState } from '../hooks/useAppState';
import { lastWorkedAt as lastWorkedAtFor } from '../utils/statsUtils';

function MuscleRow({ muscle, lastWorkedAt, hoursSince, onLog, onTap }) {
  const swipeableRef = useRef(null);
  const closeSwipe = () => swipeableRef.current?.close();
  const { workoutLog } = useAppState();
  const [expanded, setExpanded] = useState(false);

  const hasSubGroups = (muscle.subGroups || []).length > 0;

  const rested = isRested(lastWorkedAt, muscle.recommendedRestHours);
  const dotColor = lastWorkedAt ? restStatusColor(lastWorkedAt, muscle.recommendedRestHours) : '#7f8c8d';

  const subGroupRows = expanded && hasSubGroups
    ? muscle.subGroups.map((sg) => {
        const direct = lastWorkedAtFor(workoutLog, sg.id);
        const effective =
          direct && lastWorkedAt
            ? new Date(direct) > new Date(lastWorkedAt) ? direct : lastWorkedAt
            : direct || lastWorkedAt;
        return { ...sg, lastWorkedAt: effective };
      })
    : [];

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
    if (hasSubGroups) {
      setExpanded((e) => !e);
    } else {
      onTap();
    }
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
          {hasSubGroups && (
            <Feather
              name={expanded ? 'chevron-up' : 'chevron-down'}
              size={18}
              color="#888"
              style={styles.chevron}
            />
          )}
        </TouchableOpacity>

        {expanded && subGroupRows.length > 0 && (
          <View style={styles.subGroupCard}>
            {subGroupRows.map((sg, i) => {
              const sgDot = sg.lastWorkedAt
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
                  <View style={[styles.subDot, { backgroundColor: sgDot }]} />
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
  subGroupCard: {
    backgroundColor: 'white',
    borderRadius: 14,
    marginHorizontal: 12,
    marginTop: -2,
    marginBottom: 4,
    paddingHorizontal: 14,
    paddingTop: 4,
  },
  subGroupRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  subGroupDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  subDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
    marginLeft: 18,
  },
  subName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111',
  },
  subSub: {
    fontSize: 11,
    color: '#888',
    marginTop: 2,
  },
});

export default memo(MuscleRow);
