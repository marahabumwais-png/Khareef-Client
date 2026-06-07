// Firebase Client SDK - Single source of truth
import { initializeApp, getApps } from 'firebase/app';
import {
  getFirestore,
  collection, doc,
  getDocs, getDoc, addDoc, updateDoc, deleteDoc,
  query, where, orderBy, serverTimestamp, setDoc,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db  = getFirestore(app);
export { db };

// =============================================
// ADMIN AUTH
// =============================================
const ADMIN_EMAIL    = 'admin@khareef.com';
const ADMIN_PASSWORD = '123456';
const ADMIN_KEY      = 'khareef_admin_authed';

export const loginAdmin = (email, password) => {
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    if (typeof window !== 'undefined') sessionStorage.setItem(ADMIN_KEY, 'true');
    return true;
  }
  return false;
};
export const logoutAdmin  = () => { if (typeof window !== 'undefined') sessionStorage.removeItem(ADMIN_KEY); };
export const isAdminAuthed = () => { if (typeof window === 'undefined') return false; return sessionStorage.getItem(ADMIN_KEY) === 'true'; };

// =============================================
// THEME — stored in Firestore config/theme
// =============================================
export const DEFAULT_THEME = {
  colorGold:      '#c9a84c',
  colorSage:      '#558552',
  colorBg:        '#fdf8f0',
  colorBgDark:    '#1a1812',
  colorBgCard:    '#ffffff',
  colorBgCardDark:'#252218',
  colorText:      '#2d2a22',
  colorTextDark:  '#f0ead8',
  fontStyle:      'elegant',   // elegant | modern | bold
  borderRadius:   'rounded',   // rounded | sharp | pill
};

export const getTheme = async () => {
  try {
    const snap = await getDoc(doc(db, 'config', 'theme'));
    if (snap.exists()) return { ...DEFAULT_THEME, ...snap.data() };
  } catch {}
  return DEFAULT_THEME;
};

export const saveTheme = async (themeData) => {
  await setDoc(doc(db, 'config', 'theme'), themeData, { merge: true });
};

// =============================================
// CATEGORIES
// =============================================
export const getCategories = async () => {
  const snap = await getDocs(collection(db, 'categories'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};
export const addCategory    = async (data) => addDoc(collection(db, 'categories'), { ...data, createdAt: serverTimestamp() });
export const updateCategory = async (id, data) => updateDoc(doc(db, 'categories', id), { ...data, updatedAt: serverTimestamp() });
export const deleteCategory = async (id) => deleteDoc(doc(db, 'categories', id));

// =============================================
// PRODUCTS
// =============================================
export const getProducts = async (categoryFilter = null, searchQuery = null) => {
  let q = categoryFilter
    ? query(collection(db, 'products'), where('category', '==', categoryFilter))
    : query(collection(db, 'products'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  let products = snap.docs.map(d => {
    const { quantity, ...pub } = d.data();
    return { id: d.id, ...pub };
  });
  if (searchQuery) {
    const sq = searchQuery.toLowerCase();
    products = products.filter(p => p.name?.toLowerCase().includes(sq) || p.nameAr?.toLowerCase().includes(sq));
  }
  return products;
};
export const getProductsAdmin = async () => {
  const snap = await getDocs(collection(db, 'products'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};
export const getProduct = async (id) => {
  const snap = await getDoc(doc(db, 'products', id));
  if (!snap.exists()) return null;
  const { quantity, ...pub } = snap.data();
  return { id: snap.id, ...pub };
};
export const addProduct    = async (data) => addDoc(collection(db, 'products'), { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
export const updateProduct = async (id, data) => updateDoc(doc(db, 'products', id), { ...data, updatedAt: serverTimestamp() });
export const deleteProduct = async (id) => deleteDoc(doc(db, 'products', id));

// =============================================
// IMAGE — Base64 via canvas compression
// =============================================
export const uploadImage = (file, onProgress) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const MAX = 800;
        let { width, height } = img;
        if (width > MAX) { height = Math.round(height * MAX / width); width = MAX; }
        const canvas = document.createElement('canvas');
        canvas.width = width; canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.75));
        onProgress && onProgress(100);
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.onprogress = (e) => { if (e.lengthComputable) onProgress && onProgress(Math.round(e.loaded / e.total * 50)); };
    reader.readAsDataURL(file);
  });
};

// =============================================
// ORDERS
// =============================================
export const addOrder    = async (data) => addDoc(collection(db, 'orders'), { ...data, status: 'pending', createdAt: serverTimestamp() });
export const getOrders   = async () => {
  const snap = await getDocs(query(collection(db, 'orders'), orderBy('createdAt', 'desc')));
  return snap.docs.map(d => ({ id: d.id, ...d.data(), createdAt: d.data().createdAt?.toDate?.()?.toLocaleDateString() || '' }));
};
export const updateOrderStatus = async (id, status) => updateDoc(doc(db, 'orders', id), { status, updatedAt: serverTimestamp() });
