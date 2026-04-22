import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

export default function PromptModal({
  visible,
  title,
  message,
  initialValue = '',
  placeholder = '',
  keyboardType = 'default',
  multiline = false,
  onCancel,
  onSubmit,
}) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    if (visible) setValue(initialValue);
  }, [visible, initialValue]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.backdrop}
      >
        <View style={styles.card}>
          {title ? <Text style={styles.title}>{title}</Text> : null}
          {message ? <Text style={styles.message}>{message}</Text> : null}
          <TextInput
            style={[styles.input, multiline && { height: 80, textAlignVertical: 'top' }]}
            value={value}
            onChangeText={setValue}
            placeholder={placeholder}
            autoFocus
            keyboardType={keyboardType}
            multiline={multiline}
          />
          <View style={styles.row}>
            <TouchableOpacity style={styles.btn} onPress={onCancel}>
              <Text style={styles.btnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btn, styles.btnPrimary]}
              onPress={() => onSubmit(value)}
            >
              <Text style={[styles.btnText, styles.btnTextPrimary]}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 20,
    width: '100%',
    maxWidth: 420,
  },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 6 },
  message: { fontSize: 14, color: '#555', marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 15,
    marginBottom: 16,
  },
  row: { flexDirection: 'row', justifyContent: 'flex-end' },
  btn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    marginLeft: 8,
  },
  btnPrimary: { backgroundColor: '#111' },
  btnText: { fontSize: 15, fontWeight: '600', color: '#333' },
  btnTextPrimary: { color: 'white' },
});
