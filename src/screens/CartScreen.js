import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import colors from '../constants/colors';
import { getCart, saveCart, clearCart, addTransaction } from '../services/storage';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';

function formatRupiah(value) {
  const num = Number(value) || 0;
  return num.toLocaleString('id-ID');
}

export default function CartScreen() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadCart();
    }, [])
  );

  const loadCart = async () => {
    setLoading(true);
    const data = await getCart();
    setCart(data);
    setLoading(false);
  };

  const updateQty = async (id, delta) => {
    const updated = cart
      .map((item) => (item.id === id ? { ...item, qty: item.qty + delta } : item))
      .filter((item) => item.qty > 0);
    setCart(updated);
    await saveCart(updated);
  };

  const removeItem = async (id) => {
    const updated = cart.filter((item) => item.id !== id);
    setCart(updated);
    await saveCart(updated);
  };

  const total = cart.reduce((sum, item) => sum + Number(item.price) * item.qty, 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    Alert.alert('Konfirmasi Checkout', `Selesaikan transaksi senilai Rp ${formatRupiah(total)}?`, [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Checkout',
        onPress: async () => {
          const transaction = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            items: cart,
            total,
          };
          await addTransaction(transaction);
          await clearCart();
          setCart([]);
          Alert.alert('Berhasil', 'Transaksi tersimpan di Riwayat Transaksi.');
        },
      },
    ]);
  };

  if (loading) return <LoadingSpinner label="Memuat keranjang..." />;

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.title}>Keranjang Belanja</Text>
        <Text style={styles.subtitle}>{cart.length} jenis barang</Text>
      </View>

      <FlatList
        data={cart}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<EmptyState message="Keranjang masih kosong. Yuk tambah produk dari Katalog." icon="cart-outline" />}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.thumbnail} />
            <View style={{ flex: 1 }}>
              <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.itemPrice}>Rp {formatRupiah(item.price)}</Text>
            </View>
            <View style={styles.stepper}>
              <TouchableOpacity style={styles.stepBtn} onPress={() => updateQty(item.id, -1)}>
                <Ionicons name="remove" size={16} color={colors.primary} />
              </TouchableOpacity>
              <Text style={styles.qtyText}>{item.qty}</Text>
              <TouchableOpacity style={styles.stepBtn} onPress={() => updateQty(item.id, 1)}>
                <Ionicons name="add" size={16} color={colors.primary} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => removeItem(item.id)} style={styles.removeBtn}>
              <Ionicons name="close-circle" size={20} color={colors.danger} />
            </TouchableOpacity>
          </View>
        )}
      />

      {cart.length > 0 && (
        <View style={styles.footer}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Belanja</Text>
            <Text style={styles.totalValue}>Rp {formatRupiah(total)}</Text>
          </View>
          <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout} activeOpacity={0.88}>
            <Ionicons name="checkmark-circle-outline" size={18} color={colors.white} />
            <Text style={styles.checkoutText}>Checkout Sekarang</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  topBar: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 10 },
  title: { fontSize: 22, fontWeight: '800', color: colors.text },
  subtitle: { fontSize: 13, color: colors.subtext, marginTop: 2 },
  listContent: { paddingHorizontal: 20, paddingBottom: 12, flexGrow: 1 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 10,
    borderRadius: 14,
    marginBottom: 10,
    shadowColor: colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  thumbnail: { width: 50, height: 50, borderRadius: 10, marginRight: 12, backgroundColor: colors.border },
  itemName: { fontSize: 14, fontWeight: '700', color: colors.text },
  itemPrice: { fontSize: 12, color: colors.primary, fontWeight: '600', marginTop: 2 },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    borderRadius: 20,
    paddingHorizontal: 4,
    marginRight: 8,
  },
  stepBtn: { width: 26, height: 26, alignItems: 'center', justifyContent: 'center' },
  qtyText: { minWidth: 20, textAlign: 'center', fontWeight: '700', color: colors.text, fontSize: 13 },
  removeBtn: { padding: 2 },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.card,
  },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  totalLabel: { fontSize: 14, color: colors.subtext, fontWeight: '600' },
  totalValue: { fontSize: 20, color: colors.text, fontWeight: '800' },
  checkoutBtn: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  checkoutText: { color: colors.white, fontWeight: '700', fontSize: 15 },
});
