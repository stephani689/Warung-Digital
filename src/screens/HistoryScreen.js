import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import colors from '../constants/colors';
import { getTransactions } from '../services/storage';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';

function formatRupiah(value) {
  const num = Number(value) || 0;
  return num.toLocaleString('id-ID');
}

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) +
    ' · ' + d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

export default function HistoryScreen() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [])
  );

  const loadHistory = async () => {
    setLoading(true);
    const data = await getTransactions();
    setTransactions(data);
    setLoading(false);
  };

  const totalOmzet = transactions.reduce((sum, t) => sum + t.total, 0);

  if (loading) return <LoadingSpinner label="Memuat riwayat..." />;

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.title}>Riwayat Transaksi</Text>
        <Text style={styles.subtitle}>
          {transactions.length} transaksi · Total Rp {formatRupiah(totalOmzet)}
        </Text>
      </View>

      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyState message="Belum ada transaksi. Checkout dari keranjang untuk mulai mencatat penjualan." icon="receipt-outline" />
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.iconWrap}>
                <Ionicons name="receipt-outline" size={18} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.date}>{formatDate(item.date)}</Text>
                <Text style={styles.itemCount}>{item.items.length} jenis barang</Text>
              </View>
              <Text style={styles.total}>Rp {formatRupiah(item.total)}</Text>
            </View>
            <View style={styles.divider} />
            {item.items.map((p) => (
              <View key={p.id} style={styles.row}>
                <Text style={styles.rowName} numberOfLines={1}>{p.name} × {p.qty}</Text>
                <Text style={styles.rowPrice}>Rp {formatRupiah(Number(p.price) * p.qty)}</Text>
              </View>
            ))}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  topBar: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 10 },
  title: { fontSize: 22, fontWeight: '800', color: colors.text },
  subtitle: { fontSize: 13, color: colors.subtext, marginTop: 2 },
  listContent: { paddingHorizontal: 20, paddingBottom: 24, flexGrow: 1 },
  card: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    shadowColor: colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center' },
  iconWrap: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.primaryLight,
    alignItems: 'center', justifyContent: 'center', marginRight: 10,
  },
  date: { fontSize: 13, fontWeight: '700', color: colors.text },
  itemCount: { fontSize: 12, color: colors.subtext, marginTop: 1 },
  total: { fontSize: 15, fontWeight: '800', color: colors.primary },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  rowName: { flex: 1, fontSize: 12.5, color: colors.subtext, marginRight: 8 },
  rowPrice: { fontSize: 12.5, color: colors.text, fontWeight: '600' },
});
