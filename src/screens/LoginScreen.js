import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../constants/colors';
import { saveUserSession } from '../services/storage';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Semua field wajib diisi!');
      return;
    }
    if (!email.includes('@')) {
      setError('Format email tidak valid!');
      return;
    }
    if (password.length < 6) {
      setError('Password minimal 6 karakter!');
      return;
    }

    setError('');
    const userData = { email, name: email.split('@')[0] };
    await saveUserSession(userData);
    navigation.replace('MainApp');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.logoWrap}>
          <View style={styles.logoCircle}>
            <Ionicons name="storefront" size={34} color={colors.white} />
          </View>
          <Text style={styles.title}>WarungKu Digital</Text>
          <Text style={styles.subtitle}>Kelola katalog, keranjang & transaksi UMKM warung Anda</Text>
        </View>

        <View style={styles.formCard}>
          {error ? (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle-outline" size={16} color={colors.danger} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <Text style={styles.label}>Email Pemilik Warung</Text>
          <View style={styles.inputWrap}>
            <Ionicons name="mail-outline" size={18} color={colors.subtext} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="nama@warung.com"
              placeholderTextColor={colors.subtext}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <Text style={styles.label}>Password</Text>
          <View style={styles.inputWrap}>
            <Ionicons name="lock-closed-outline" size={18} color={colors.subtext} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Minimal 6 karakter"
              placeholderTextColor={colors.subtext}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword((s) => !s)}>
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={18}
                color={colors.subtext}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleLogin} activeOpacity={0.88}>
            <Text style={styles.buttonText}>Masuk / Register</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footerNote}>UAS Praktikum Pemrograman Mobile · Domain Warung Digital</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  logoWrap: { alignItems: 'center', marginBottom: 28 },
  logoCircle: {
    width: 72, height: 72, borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center', marginBottom: 14,
  },
  title: { fontSize: 24, fontWeight: '800', color: colors.text },
  subtitle: { fontSize: 13, color: colors.subtext, textAlign: 'center', marginTop: 6, paddingHorizontal: 20 },
  formCard: {
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 20,
    shadowColor: colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  errorBox: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: colors.dangerLight, borderRadius: 8, padding: 10, marginBottom: 14,
  },
  errorText: { color: colors.danger, fontSize: 12.5, flex: 1 },
  label: { fontSize: 12, fontWeight: '700', color: colors.subtext, marginBottom: 6, marginTop: 4 },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.background,
    borderWidth: 1, borderColor: colors.border, borderRadius: 10,
    paddingHorizontal: 12, marginBottom: 14,
  },
  inputIcon: { marginRight: 8 },
  input: { flex: 1, paddingVertical: 12, color: colors.text },
  button: { backgroundColor: colors.primary, padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 6 },
  buttonText: { color: colors.white, fontWeight: '700', fontSize: 15 },
  footerNote: { textAlign: 'center', color: colors.subtext, fontSize: 11, marginTop: 20 },
});
