import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Switch,
  Alert,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Feather } from '@expo/vector-icons';
import { useAppState } from '../hooks/useAppState';
import PromptModal from './PromptModal';

export default function SettingsModal({ visible, onClose }) {
  const {
    muscleGroups,
    settings,
    state,
    setRecommendedRestHours,
    updateSettings,
    resetAll,
    replaceState,
  } = useAppState();

  const [importPromptOpen, setImportPromptOpen] = useState(false);

  const confirmReset = () => {
    Alert.alert('Reset all data?', 'This deletes every workout and restores defaults.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reset', style: 'destructive', onPress: () => resetAll() },
    ]);
  };

  const exportData = async () => {
    try {
      const json = JSON.stringify(state, null, 2);
      await Clipboard.setStringAsync(json);
      Alert.alert('Copied to clipboard', 'Your data is ready to paste somewhere safe.');
    } catch (e) {
      Alert.alert('Export failed', String(e));
    }
  };

  const handleImport = (text) => {
    setImportPromptOpen(false);
    try {
      const parsed = JSON.parse(text);
      replaceState(parsed);
      Alert.alert('Imported', 'Data restored.');
    } catch (e) {
      Alert.alert('Invalid JSON', String(e));
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Feather name="chevron-down" size={26} color="#111" />
          </TouchableOpacity>
          <Text style={styles.title}>Settings</Text>
          <View style={{ width: 26 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.section}>Notifications</Text>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Ping me when a muscle is rested (iOS)</Text>
            <Switch
              value={!!settings.notificationsEnabled}
              onValueChange={(v) => updateSettings({ notificationsEnabled: v })}
            />
          </View>

          <Text style={styles.section}>Recommended rest (hours)</Text>
          {muscleGroups.map((mg) => (
            <View key={mg.id} style={styles.row}>
              <Text style={styles.rowLabel}>{mg.name}</Text>
              <TextInput
                style={styles.input}
                value={String(mg.recommendedRestHours)}
                onChangeText={(t) => {
                  const n = Number(t);
                  if (!Number.isNaN(n) && n > 0) setRecommendedRestHours(mg.id, n);
                }}
                keyboardType="numeric"
              />
            </View>
          ))}

          <Text style={styles.section}>Data</Text>
          <TouchableOpacity style={styles.btn} onPress={exportData}>
            <Text style={styles.btnText}>Export (copy JSON)</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn} onPress={() => setImportPromptOpen(true)}>
            <Text style={styles.btnText}>Import (paste JSON)</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.btnDanger]} onPress={confirmReset}>
            <Text style={[styles.btnText, styles.btnDangerText]}>Reset all data</Text>
          </TouchableOpacity>
        </ScrollView>

        <PromptModal
          visible={importPromptOpen}
          title="Import data"
          message="Paste a previously exported JSON blob."
          multiline
          onCancel={() => setImportPromptOpen(false)}
          onSubmit={handleImport}
        />
      </View>
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
  scroll: { padding: 16, paddingBottom: 60 },
  section: { fontSize: 13, fontWeight: '700', color: '#666', marginTop: 20, marginBottom: 8, textTransform: 'uppercase' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 14,
    borderRadius: 10,
    marginBottom: 6,
  },
  rowLabel: { fontSize: 15, color: '#111', flex: 1 },
  input: {
    width: 60,
    backgroundColor: '#f4f4f4',
    padding: 6,
    borderRadius: 6,
    fontSize: 15,
    textAlign: 'center',
  },
  btn: {
    backgroundColor: 'white',
    padding: 14,
    borderRadius: 10,
    marginBottom: 8,
    alignItems: 'center',
  },
  btnText: { fontSize: 15, fontWeight: '600', color: '#111' },
  btnDanger: { backgroundColor: '#fdecea' },
  btnDangerText: { color: '#c0392b' },
});
