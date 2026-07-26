import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../constants/colors';
import { getCart, saveCart } from '../services/storage';

function formatRupiah(value) {
  const num = Number(value) || 0;
  return num.toLocaleString('id-ID');
}

export default function DetailScreen({ route, navigation }) {
  const { product } = route.params || {};
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Data produk tidak ditemukan.</Text>
      </View>
    );
  }

  const handleAddToCart = async () => {
    const cart = await getCart();
    const existing = cart.find((i) => i.id === product.id);
    let updatedCart;
    if (existing) {
      updatedCart = cart.map((i) => (i.id === product.id ? { ...i, qty: i.qty + 1 } : i));
    } else {
      updatedCart = [...cart, { ...product, qty: 1 }];
    }
    await saveCart(updatedCart);
    setAdded(true);
    Alert.alert('Ditambahkan', `${product.name} masuk ke keranjang.`, [
      { text: 'Lanjut Belanja', style: 'cancel' },
      { text: 'Lihat Keranjang', onPress: () => navigation.navigate('MainApp', { screen: 'Keranjang' }) },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: product.image }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title}>{product.name}</Text>
        <Text style={styles.price}>Rp {formatRupiah(product.price)}</Text>
        <View style={styles.divider} />
        <Text style={styles.descLabel}>Keterangan</Text>
        <Text style={styles.desc}>
          Produk tersedia di katalog WarungKu Digital. Stok dipantau langsung oleh pemilik warung
          melalui sistem kasir digital.
        </Text>

        <TouchableOpacity style={styles.addBtn} onPress={handleAddToCart} activeOpacity={0.88}>
          <Ionicons name={added ? 'checkmark-circle' : 'cart-outline'} size={18} color={colors.white} />
          <Text style={styles.addBtnText}>{added ? 'Ditambahkan ke Keranjang' : 'Tambah ke Keranjang'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.85}>
          <Text style={styles.backBtnText}>Kembali ke Katalog</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  text: { padding: 20, color: colors.text },
  image: { width: '100%', height: 260, backgroundColor: colors.border },
  content: { padding: 20 },
  title: { fontSize: 22, fontWeight: '800', color: colors.text },
  price: { fontSize: 20, color: colors.primary, fontWeight: '800', marginTop: 6 },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 16 },
  descLabel: { fontSize: 12, fontWeight: '700', color: colors.subtext, marginBottom: 6, textTransform: 'uppercase' },
  desc: { fontSize: 14, color: colors.text, lineHeight: 21, marginBottom: 24 },
  addBtn: {
    flexDirection: 'row', backgroundColor: colors.primary, padding: 14, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 10,
  },
  addBtnText: { color: colors.white, fontWeight: '700', fontSize: 14 },
  backBtn: { padding: 14, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  backBtnText: { color: colors.text, fontWeight: '600' },
});
