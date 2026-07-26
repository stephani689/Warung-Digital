import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import colors from '../constants/colors';
import { getUserSession, removeUserSession, getProducts, getTransactions } from '../services/storage';

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ products: 0, transactions: 0, omzet: 0 });

  useFocusEffect(
    useCallback(() => {
      getUserSession().then((res) => setUser(res));
      loadStats();
    }, [])
  );

  const loadStats = async () => {
    const products = (await getProducts()) || [];
    const transactions = (await getTransactions()) || [];
    const omzet = transactions.reduce((sum, t) => sum + t.total, 0);
    setStats({ products: products.length, transactions: transactions.length, omzet });
  };

  const handleLogout = () => {
    Alert.alert('Keluar Akun', 'Yakin ingin logout dari WarungKu Digital?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await removeUserSession();
          navigation.replace('LoginScreen');
        },
      },
    ]);
  };

  const initials = (user?.name || 'W').slice(0, 2).toUpperCase();

  return (
    <View style={styles.container}>
      <View style={styles.headerCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <Text style={styles.name}>{user?.name || 'Pemilik Warung'}</Text>
        <Text style={styles.email}>{user?.email || 'user@warungku.com'}</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Ionicons name="pricetags-outline" size={18} color={colors.primary} />
          <Text style={styles.statValue}>{stats.products}</Text>
          <Text style={styles.statLabel}>Produk</Text>
        </View>
        <View style={styles.statBox}>
          <Ionicons name="receipt-outline" size={18} color={colors.primary} />
          <Text style={styles.statValue}>{stats.transactions}</Text>
          <Text style={styles.statLabel}>Transaksi</Text>
        </View>
        <View style={styles.statBox}>
          <Ionicons name="cash-outline" size={18} color={colors.primary} />
          <Text style={styles.statValue}>{Math.round(stats.omzet / 1000)}rb</Text>
          <Text style={styles.statLabel}>Omzet</Text>
        </View>
      </View>

      <View style={styles.menuCard}>
        <View style={styles.menuRow}>
          <Ionicons name="storefront-outline" size={18} color={colors.subtext} />
          <Text style={styles.menuText}>WarungKu Digital — UMKM Partner</Text>
        </View>
        <View style={styles.menuRow}>
          <Ionicons name="school-outline" size={18} color={colors.subtext} />
          <Text style={styles.menuText}>UAS Pemrograman Mobile · Domain C</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.88}>
        <Ionicons name="log-out-outline" size={18} color={colors.white} />
        <Text style={styles.logoutBtnText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: colors.background },
  headerCard: { alignItems: 'center', paddingVertical: 24 },
  avatar: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  avatarText: { color: colors.white, fontSize: 24, fontWeight: '800' },
  name: { fontSize: 18, fontWeight: '800', color: colors.text },
  email: { fontSize: 13, color: colors.subtext, marginTop: 2 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  statBox: {
    flex: 1, backgroundColor: colors.card, borderRadius: 14, paddingVertical: 16,
    alignItems: 'center', shadowColor: colors.shadow, shadowOpacity: 1,
    shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 1,
  },
  statValue: { fontSize: 16, fontWeight: '800', color: colors.text, marginTop: 6 },
  statLabel: { fontSize: 11, color: colors.subtext, marginTop: 2 },
  menuCard: {
    backgroundColor: colors.card, borderRadius: 14, padding: 16, marginBottom: 24,
    shadowColor: colors.shadow, shadowOpacity: 1, shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 }, elevation: 1,
  },
  menuRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8 },
  menuText: { fontSize: 13, color: colors.text },
  logoutBtn: {
    flexDirection: 'row', backgroundColor: colors.danger, padding: 14, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 'auto',
  },
  logoutBtnText: { color: colors.white, fontWeight: '700', fontSize: 14 },
});
