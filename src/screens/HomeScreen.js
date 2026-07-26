import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import colors from '../constants/colors';
import { getProducts, saveProducts, getCart, saveCart } from '../services/storage';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const DUMMY_PRODUCTS = [
  { id: '1', name: 'Minyak Goreng 1L', price: '18000', image: 'https://via.placeholder.com/150' },
  { id: '2', name: 'Beras Premium 5kg', price: '68000', image: 'https://via.placeholder.com/150' },
];

function formatRupiah(value) {
  const num = Number(value) || 0;
  return num.toLocaleString('id-ID');
}

export default function HomeScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    loadProductData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      refreshCartCount();
    }, [])
  );

  const refreshCartCount = async () => {
    const cart = await getCart();
    setCartCount(cart.reduce((sum, i) => sum + i.qty, 0));
  };

  const loadProductData = async () => {
    setLoading(true);
    const savedProducts = await getProducts();
    if (savedProducts && savedProducts.length > 0) {
      setProducts(savedProducts);
    } else {
      setProducts(DUMMY_PRODUCTS);
      await saveProducts(DUMMY_PRODUCTS);
    }
    setLoading(false);
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Izin Ditolak', 'Izin akses galeri dibutuhkan untuk memilih foto produk.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.5,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleAddProduct = async () => {
    if (!name || !price) {
      Alert.alert('Validasi Gagal', 'Nama dan Harga produk wajib diisi!');
      return;
    }
    if (isNaN(Number(price))) {
      Alert.alert('Validasi Gagal', 'Harga harus berupa angka.');
      return;
    }

    const newProduct = {
      id: Date.now().toString(),
      name,
      price,
      image: imageUri || 'https://via.placeholder.com/150',
    };

    const updatedList = [newProduct, ...products];
    setProducts(updatedList);
    await saveProducts(updatedList);

    setName('');
    setPrice('');
    setImageUri(null);
    setShowForm(false);
  };

  const handleDeleteProduct = (id) => {
    Alert.alert('Hapus Produk', 'Yakin ingin menghapus produk ini dari katalog?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: async () => {
          const updatedList = products.filter((item) => item.id !== id);
          setProducts(updatedList);
          await saveProducts(updatedList);
        },
      },
    ]);
  };

  const handleAddToCart = async (product) => {
    const cart = await getCart();
    const existing = cart.find((i) => i.id === product.id);
    let updatedCart;
    if (existing) {
      updatedCart = cart.map((i) => (i.id === product.id ? { ...i, qty: i.qty + 1 } : i));
    } else {
      updatedCart = [...cart, { ...product, qty: 1 }];
    }
    await saveCart(updatedCart);
    setCartCount(updatedCart.reduce((sum, i) => sum + i.qty, 0));
  };

  if (loading) return <LoadingSpinner label="Menyiapkan katalog..." />;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.topBar}>
        <View>
          <Text style={styles.greeting}>Katalog Warung</Text>
          <Text style={styles.greetingSub}>{products.length} produk tersedia</Text>
        </View>
        <TouchableOpacity
          style={styles.cartPill}
          onPress={() => navigation.navigate('Keranjang')}
          activeOpacity={0.85}
        >
          <Ionicons name="cart-outline" size={20} color={colors.white} />
          {cartCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            {!showForm ? (
              <TouchableOpacity style={styles.addToggle} onPress={() => setShowForm(true)} activeOpacity={0.85}>
                <Ionicons name="add-circle" size={20} color={colors.primary} />
                <Text style={styles.addToggleText}>Tambah Produk Baru</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.formCard}>
                <View style={styles.formHeader}>
                  <Text style={styles.formTitle}>Produk Baru</Text>
                  <TouchableOpacity onPress={() => setShowForm(false)}>
                    <Ionicons name="close" size={20} color={colors.subtext} />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.imagePickerBtn} onPress={pickImage} activeOpacity={0.85}>
                  {imageUri ? (
                    <Image source={{ uri: imageUri }} style={styles.imagePreview} />
                  ) : (
                    <View style={styles.imagePlaceholder}>
                      <Ionicons name="camera-outline" size={22} color={colors.subtext} />
                      <Text style={styles.imagePlaceholderText}>Pilih Foto Produk</Text>
                    </View>
                  )}
                </TouchableOpacity>

                <TextInput
                  style={styles.input}
                  placeholder="Nama Produk"
                  placeholderTextColor={colors.subtext}
                  value={name}
                  onChangeText={setName}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Harga (Rp)"
                  placeholderTextColor={colors.subtext}
                  value={price}
                  onChangeText={setPrice}
                  keyboardType="numeric"
                />

                <TouchableOpacity style={styles.addBtn} onPress={handleAddProduct} activeOpacity={0.85}>
                  <Text style={styles.addBtnText}>Simpan Produk</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        }
        ListEmptyComponent={<EmptyState message="Katalog produk masih kosong. Tambahkan produk pertamamu." icon="pricetags-outline" />}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <TouchableOpacity
              style={styles.cardMain}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('DetailScreen', { product: item })}
            >
              <Image source={{ uri: item.image }} style={styles.thumbnail} />
              <View style={{ flex: 1 }}>
                <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.productPrice}>Rp {formatRupiah(item.price)}</Text>
              </View>
            </TouchableOpacity>
            <View style={styles.cardActions}>
              <TouchableOpacity onPress={() => handleAddToCart(item)} style={styles.cartBtn} activeOpacity={0.85}>
                <Ionicons name="cart" size={16} color={colors.white} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteProduct(item.id)} style={styles.deleteBtn} activeOpacity={0.85}>
                <Ionicons name="trash-outline" size={16} color={colors.danger} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  greeting: { fontSize: 22, fontWeight: '800', color: colors.text },
  greetingSub: { fontSize: 13, color: colors.subtext, marginTop: 2 },
  cartPill: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: colors.accentDark,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: colors.background,
  },
  cartBadgeText: { color: colors.white, fontSize: 11, fontWeight: '700' },
  listContent: { paddingHorizontal: 20, paddingBottom: 24 },
  addToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingVertical: 14,
    marginBottom: 16,
    backgroundColor: colors.primaryLight,
  },
  addToggleText: { color: colors.primary, fontWeight: '700', marginLeft: 8, fontSize: 14 },
  formCard: {
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 14,
    marginBottom: 18,
    shadowColor: colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  formHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  formTitle: { fontSize: 15, fontWeight: '700', color: colors.text },
  imagePickerBtn: { marginBottom: 10, borderRadius: 10, overflow: 'hidden' },
  imagePlaceholder: {
    height: 90,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  imagePlaceholderText: { color: colors.subtext, fontSize: 12, marginTop: 4 },
  imagePreview: { width: '100%', height: 130, borderRadius: 10 },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    color: colors.text,
    backgroundColor: colors.background,
  },
  addBtn: { backgroundColor: colors.primary, padding: 13, borderRadius: 10, alignItems: 'center', marginTop: 2 },
  addBtnText: { color: colors.white, fontWeight: '700', fontSize: 14 },
  card: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    padding: 12,
    borderRadius: 14,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  cardMain: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  thumbnail: { width: 54, height: 54, borderRadius: 10, marginRight: 12, backgroundColor: colors.border },
  productName: { fontSize: 15, fontWeight: '700', color: colors.text },
  productPrice: { color: colors.primary, fontWeight: '700', marginTop: 2, fontSize: 13 },
  cardActions: { flexDirection: 'row', gap: 8 },
  cartBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  deleteBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.dangerLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
});
