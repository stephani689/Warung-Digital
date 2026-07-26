import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import colors from '../constants/colors';

export default function LoadingSpinner({ label = 'Memuat data...' }) {
  return (
    <View style={styles.container}>
      <ActivityIndicator animating={true} size="large" color={colors.primary} />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  label: {
    marginTop: 12,
    color: colors.subtext,
    fontSize: 13,
  },
});
