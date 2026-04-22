import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
    this.setState({ info });
  }

  render() {
    if (this.state.error) {
      return (
        <ScrollView style={styles.wrap} contentContainerStyle={styles.content}>
          <Text style={styles.title}>Something crashed</Text>
          <Text style={styles.msg}>{String(this.state.error?.message || this.state.error)}</Text>
          {this.state.error?.stack && (
            <Text style={styles.stack}>{this.state.error.stack}</Text>
          )}
          {this.state.info?.componentStack && (
            <Text style={styles.stack}>{this.state.info.componentStack}</Text>
          )}
        </ScrollView>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: '#fff5f5' },
  content: { padding: 20 },
  title: { fontSize: 20, fontWeight: '700', color: '#c0392b', marginBottom: 8 },
  msg: { fontSize: 15, color: '#333', marginBottom: 12 },
  stack: { fontSize: 11, fontFamily: 'monospace', color: '#555', marginBottom: 10 },
});
