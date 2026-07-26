import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_KEY = '@user_session';
const PRODUCTS_KEY = '@warung_products';
const CART_KEY = '@warung_cart';
const TRANSACTIONS_KEY = '@warung_transactions';

// ---------- User session ----------
export const saveUserSession = async (userData) => {
  try {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));
  } catch (e) {
    console.error('Error saving user session', e);
  }
};

export const getUserSession = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(USER_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error('Error getting user session', e);
    return null;
  }
};

export const removeUserSession = async () => {
  try {
    await AsyncStorage.removeItem(USER_KEY);
  } catch (e) {
    console.error('Error removing user session', e);
  }
};

// ---------- Produk (katalog) ----------
export const saveProducts = async (products) => {
  try {
    await AsyncStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  } catch (e) {
    console.error('Error saving products', e);
  }
};

export const getProducts = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(PRODUCTS_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error('Error getting products', e);
    return null;
  }
};

// ---------- Keranjang belanja ----------
export const getCart = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(CART_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Error getting cart', e);
    return [];
  }
};

export const saveCart = async (cart) => {
  try {
    await AsyncStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch (e) {
    console.error('Error saving cart', e);
  }
};

export const clearCart = async () => {
  try {
    await AsyncStorage.removeItem(CART_KEY);
  } catch (e) {
    console.error('Error clearing cart', e);
  }
};

// ---------- Riwayat transaksi ----------
export const getTransactions = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(TRANSACTIONS_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Error getting transactions', e);
    return [];
  }
};

export const addTransaction = async (transaction) => {
  try {
    const current = await getTransactions();
    const updated = [transaction, ...current];
    await AsyncStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Error adding transaction', e);
    return [];
  }
};
