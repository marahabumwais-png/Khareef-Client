// Admin Dashboard - /admin-dashboard — 100% Firebase, no backend
import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import withAdminAuth from '../components/withAdminAuth';
import {
  getProductsAdmin, addProduct, updateProduct, deleteProduct,
  getOrders, updateOrderStatus, uploadImage,
  getCategories, addCategory, updateCategory, deleteCategory,
  logoutAdmin,
} from '../lib/firebase';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';
import { FiPackage, FiShoppingBag, FiPlus, FiEdit2, FiTrash2, FiX, FiUpload, FiLogOut, FiGrid, FiTag, FiSettings } from 'react-icons/fi';
import Link from 'next/link';
import { TableSkeleton } from '../components/Skeletons';

const STATUS_COLORS = {
  pending:   { bg: 'rgba(245,158,11,0.1)',  color: '#d97706' },
  confirmed: { bg: 'rgba(59,130,246,0.1)',  color: '#3b82f6' },
  shipped:   { bg: 'rgba(139,92,246,0.1)',  color: '#8b5cf6' },
  delivered: { bg: 'rgba(34,197,94,0.1)',   color: '#22c55e' },
  cancelled: { bg: 'rgba(239,68,68,0.1)',   color: '#ef4444' },
};

const EMPTY_PRODUCT = { name: '', nameAr: '', category: '', price: '', description: '', descriptionAr: '', colors: '', quantity: '', images: [] };
const EMPTY_CAT     = { name: '', nameAr: '', color: '#c9a84c', icon: 'FiBox' };

function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState('overview');

  const [products,   setProducts]   = useState([]);
  const [orders,     setOrders]     = useState([]);
  const [categories, setCategories] = useState([]);

  const [loadingP, setLoadingP] = useState(true);
  const [loadingO, setLoadingO] = useState(true);
  const [loadingC, setLoadingC] = useState(true);

  // Product modal
  const [showPModal,   setShowPModal]   = useState(false);
  const [editingP,     setEditingP]     = useState(null);
  const [pForm,        setPForm]        = useState(EMPTY_PRODUCT);
  const [uploading,    setUploading]    = useState(false);
  const [uploadPct,    setUploadPct]    = useState(0);
  const [savingP,      setSavingP]      = useState(false);
  const fileRef = useRef();

  // Category modal
  const [showCModal, setShowCModal] = useState(false);
  const [editingC,   setEditingC]   = useState(null);
  const [cForm,      setCForm]      = useState(EMPTY_CAT);
  const [savingC,    setSavingC]    = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try { setLoadingP(true); setProducts(await getProductsAdmin()); } catch { toast.error('Failed to load products'); } finally { setLoadingP(false); }
    try { setLoadingO(true); setOrders(await getOrders()); }         catch { toast.error('Failed to load orders'); }   finally { setLoadingO(false); }
    try { setLoadingC(true); setCategories(await getCategories()); } catch { toast.error('Failed to load categories'); } finally { setLoadingC(false); }
  };

  const handleLogout = () => { logoutAdmin(); router.replace('/admin-login'); };

  // ---- Product ----
  const openAddP = () => { setEditingP(null); setPForm({ ...EMPTY_PRODUCT, category: categories[0]?.name || '' }); setShowPModal(true); };
  const openEditP = (p) => {
    setEditingP(p);
    setPForm({ name: p.name||'', nameAr: p.nameAr||'', category: p.category||'', price: p.price?.toString()||'', description: p.description||'', descriptionAr: p.descriptionAr||'', colors: Array.isArray(p.colors)?p.colors.join(', '):'', quantity: p.quantity?.toString()||'', images: p.images||[] });
    setShowPModal(true);
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    setUploadPct(0);
    try {
      const urls = [];
      for (let i = 0; i < files.length; i++) {
        const url = await uploadImage(files[i], (pct) => setUploadPct(Math.round((i / files.length * 100) + pct / files.length)));
        urls.push(url);
      }
      setPForm(f => ({ ...f, images: [...f.images, ...urls] }));
      toast.success(`${urls.length} image(s) uploaded!`);
    } catch (err) {
      toast.error('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
      setUploadPct(0);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleSaveP = async (e) => {
    e.preventDefault();
    if (!pForm.name || !pForm.price || !pForm.category) { toast.error('Name, category and price required'); return; }
    setSavingP(true);
    try {
      const data = { ...pForm, price: parseFloat(pForm.price), quantity: parseInt(pForm.quantity)||0, colors: pForm.colors.split(',').map(c=>c.trim()).filter(Boolean) };
      if (editingP) { await updateProduct(editingP.id, data); toast.success('Product updated!'); }
      else          { await addProduct(data);                  toast.success('Product created!'); }
      setShowPModal(false);
      setProducts(await getProductsAdmin());
    } catch (e) { toast.error(e.message || 'Save failed'); }
    finally { setSavingP(false); }
  };

  const handleDeleteP = async (p) => {
    if (!window.confirm(`Delete "${p.name}"?`)) return;
    try { await deleteProduct(p.id); toast.success('Deleted'); setProducts(await getProductsAdmin()); }
    catch { toast.error('Delete failed'); }
  };

  // ---- Category ----
  const openAddC  = () => { setEditingC(null); setCForm(EMPTY_CAT); setShowCModal(true); };
  const openEditC = (c) => { setEditingC(c); setCForm({ name: c.nameLabel||c.name, nameAr: c.nameAr||'', color: c.color||'#c9a84c', icon: c.icon||'FiBox' }); setShowCModal(true); };

  const handleSaveC = async (e) => {
    e.preventDefault();
    if (!cForm.name) { toast.error('Name required'); return; }
    setSavingC(true);
    try {
      if (editingC) { await updateCategory(editingC.id, { ...cForm, name: cForm.name.toLowerCase(), nameLabel: cForm.name }); toast.success('Category updated!'); }
      else          { await addCategory({ ...cForm, name: cForm.name.toLowerCase(), nameLabel: cForm.name }); toast.success('Category created!'); }
      setShowCModal(false);
      setCategories(await getCategories());
    } catch (e) { toast.error(e.message || 'Save failed'); }
    finally { setSavingC(false); }
  };

  const handleDeleteC = async (c) => {
    if (!window.confirm(`Delete "${c.nameLabel||c.name}"?`)) return;
    try { await deleteCategory(c.id); toast.success('Deleted'); setCategories(await getCategories()); }
    catch (e) { toast.error(e.message || 'Delete failed'); }
  };

  // ---- Orders ----
  const handleStatusChange = async (id, status) => {
    try { await updateOrderStatus(id, status); setOrders(prev => prev.map(o => o.id===id ? {...o,status} : o)); toast.success('Updated'); }
    catch { toast.error('Failed'); }
  };

  const totalRevenue = orders.filter(o=>o.status!=='cancelled').reduce((s,o)=>s+(o.total||0),0);

  const TABS = [
    { id: 'overview',   label: 'Overview',   icon: FiGrid },
    { id: 'categories', label: 'Categories', icon: FiTag },
    { id: 'products',   label: 'Products',   icon: FiPackage },
    { id: 'orders',     label: 'Orders',     icon: FiShoppingBag },
  ];

  return (
    <>
      <Head><title>Admin | Khareef</title><meta name="robots" content="noindex" /></Head>
      <Toaster position="top-right" />
      <div className="min-h-screen" style={{ background: 'var(--color-bg)' }}>

        {/* Header */}
        <header className="sticky top-0 z-40 border-b px-6 py-3 flex items-center justify-between"
          style={{ background: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(201,168,76,0.12)' }}>
              <span className="font-display font-bold" style={{ color: 'var(--color-gold)' }}>K</span>
            </div>
            <p className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>Khareef Admin</p>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-sm opacity-60 hover:opacity-100" style={{ color: 'var(--color-text)' }}>
            <FiLogOut size={16} /> Logout
          </button>
        </header>

        <div className="flex">
          {/* Sidebar */}
          <aside className="w-56 min-h-[calc(100vh-52px)] sticky top-[52px] border-e p-4 space-y-1 hidden md:block"
            style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg-card)' }}>
            {TABS.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setTab(id)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={{ background: tab===id ? 'rgba(201,168,76,0.1)' : 'transparent', color: tab===id ? 'var(--color-gold)' : 'var(--color-text)', opacity: tab===id ? 1 : 0.6 }}>
                <Icon size={16} /> {label}
              </button>
            ))}
            <div className="pt-2 mt-2 border-t" style={{ borderColor: 'var(--color-border)' }}>
              <Link href="/admin-theme"
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all opacity-60 hover:opacity-100"
                style={{ color: 'var(--color-text)' }}>
                <FiSettings size={16} /> Theme Settings
              </Link>
            </div>
          </aside>

          <main className="flex-1 p-4 md:p-8 min-w-0">
            {/* Mobile tabs */}
            <div className="flex gap-2 mb-6 md:hidden overflow-x-auto pb-1">
              {TABS.map(({ id, label }) => (
                <button key={id} onClick={() => setTab(id)}
                  className="flex-shrink-0 px-3 py-2 rounded-xl text-xs font-medium transition-all"
                  style={{ background: tab===id ? 'var(--color-gold)' : 'var(--color-bg-card)', color: tab===id ? '#fff' : 'var(--color-text)', border: '1px solid var(--color-border)' }}>
                  {label}
                </button>
              ))}
            </div>

            {/* OVERVIEW */}
            {tab === 'overview' && (
              <div className="space-y-6 animate-fade-in">
                <h1 className="text-2xl font-display font-bold" style={{ color: 'var(--color-text)' }}>Overview</h1>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: 'Categories', value: categories.length, color: '#8b5cf6' },
                    { label: 'Products',   value: products.length,   color: 'var(--color-gold)' },
                    { label: 'Orders',     value: orders.length,     color: '#3b82f6' },
                    { label: 'Revenue',    value: totalRevenue.toFixed(2)+' SAR', color: '#22c55e' },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="p-5 rounded-2xl" style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
                      <p className="text-xs opacity-50 mb-2" style={{ color: 'var(--color-text)' }}>{label}</p>
                      <p className="text-xl font-bold" style={{ color }}>{value}</p>
                    </div>
                  ))}
                </div>
                <div>
                  <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text)' }}>Recent Orders</h2>
                  {loadingO ? <TableSkeleton rows={3} /> : orders.slice(0,5).map(o => (
                    <div key={o.id} className="flex items-center gap-4 p-4 rounded-2xl mb-3"
                      style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm" style={{ color: 'var(--color-text)' }}>{o.customerName}</p>
                        <p className="text-xs opacity-40" style={{ color: 'var(--color-text)' }}>{o.phone}</p>
                      </div>
                      <span className="text-sm font-bold" style={{ color: 'var(--color-gold)' }}>{o.total?.toFixed(2)} SAR</span>
                      <span className="badge text-xs capitalize" style={STATUS_COLORS[o.status]||STATUS_COLORS.pending}>{o.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CATEGORIES */}
            {tab === 'categories' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-display font-bold" style={{ color: 'var(--color-text)' }}>Categories</h1>
                  <button onClick={openAddC} className="btn-primary"><FiPlus size={16} /> Add Category</button>
                </div>
                {loadingC ? <TableSkeleton rows={3} /> : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories.length === 0 ? (
                      <p className="col-span-3 text-center py-12 opacity-30" style={{ color: 'var(--color-text)' }}>No categories yet.</p>
                    ) : categories.map(cat => (
                      <div key={cat.id} className="p-5 rounded-2xl flex items-center gap-4"
                        style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
                        <div className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center"
                          style={{ background: `${cat.color||'#c9a84c'}18` }}>
                          <div className="w-5 h-5 rounded-full" style={{ background: cat.color||'#c9a84c' }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold" style={{ color: 'var(--color-text)' }}>{cat.nameLabel||cat.name}</p>
                          {cat.nameAr && <p className="text-sm opacity-50" dir="rtl" style={{ color: 'var(--color-text)' }}>{cat.nameAr}</p>}
                        </div>
                        <div className="flex gap-2">
                          <button onClick={()=>openEditC(cat)} className="p-2 rounded-lg hover:opacity-70" style={{ background: 'rgba(59,130,246,0.1)', color: '#3b82f6' }}><FiEdit2 size={14} /></button>
                          <button onClick={()=>handleDeleteC(cat)} className="p-2 rounded-lg hover:opacity-70" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}><FiTrash2 size={14} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* PRODUCTS */}
            {tab === 'products' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-display font-bold" style={{ color: 'var(--color-text)' }}>Products</h1>
                  <button onClick={openAddP} disabled={categories.length===0}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    title={categories.length===0 ? 'Add a category first' : ''}>
                    <FiPlus size={16} />{categories.length===0 ? 'Add a category first' : 'Add Product'}
                  </button>
                </div>
                {categories.length===0 && (
                  <div className="p-4 rounded-2xl text-sm" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', color: '#d97706' }}>
                    ⚠️ Create at least one category before adding products.{' '}
                    <button onClick={() => setTab('categories')} className="underline font-semibold">Go to Categories →</button>
                  </div>
                )}
                {loadingP ? <TableSkeleton rows={6} /> : (
                  <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--color-border)' }}>
                    <table className="w-full text-sm">
                      <thead>
                        <tr style={{ background: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)' }}>
                          {['Image','Name','Category','Price','Stock','Actions'].map(h => (
                            <th key={h} className="px-4 py-3 text-start font-medium opacity-50" style={{ color: 'var(--color-text)' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {products.length === 0 ? (
                          <tr><td colSpan={6} className="text-center py-12 opacity-30" style={{ color: 'var(--color-text)' }}>No products yet.</td></tr>
                        ) : products.map((p, i) => (
                          <tr key={p.id} style={{ background: i%2===0?'var(--color-bg-card)':'var(--color-bg)', borderTop: '1px solid var(--color-border)' }}>
                            <td className="px-4 py-3">
                              <div className="w-12 h-12 rounded-xl overflow-hidden" style={{ background: 'var(--color-border)' }}>
                                {p.images?.[0] && <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <p className="font-medium" style={{ color: 'var(--color-text)' }}>{p.name}</p>
                              <p className="text-xs opacity-40" style={{ color: 'var(--color-text)' }}>{p.nameAr}</p>
                            </td>
                            <td className="px-4 py-3">
                              <span className="badge capitalize" style={{ background: 'rgba(201,168,76,0.1)', color: 'var(--color-gold)' }}>{p.category}</span>
                            </td>
                            <td className="px-4 py-3 font-semibold" style={{ color: 'var(--color-gold)' }}>{p.price?.toFixed(2)} SAR</td>
                            <td className="px-4 py-3">
                              <span className={`font-semibold ${p.quantity===0?'text-red-500':''}`} style={{ color: 'var(--color-text)' }}>{p.quantity??'—'}</span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex gap-2">
                                <button onClick={()=>openEditP(p)} className="p-2 rounded-lg hover:opacity-70" style={{ background: 'rgba(59,130,246,0.1)', color: '#3b82f6' }}><FiEdit2 size={14} /></button>
                                <button onClick={()=>handleDeleteP(p)} className="p-2 rounded-lg hover:opacity-70" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}><FiTrash2 size={14} /></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* ORDERS */}
            {tab === 'orders' && (
              <div className="space-y-6 animate-fade-in">
                <h1 className="text-2xl font-display font-bold" style={{ color: 'var(--color-text)' }}>Orders</h1>
                {loadingO ? <TableSkeleton rows={5} /> : orders.length===0 ? (
                  <p className="text-center py-16 opacity-30" style={{ color: 'var(--color-text)' }}>No orders yet.</p>
                ) : orders.map(o => (
                  <div key={o.id} className="p-5 rounded-2xl" style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                      <div>
                        <p className="font-semibold" style={{ color: 'var(--color-text)' }}>{o.customerName}</p>
                        <p className="text-sm opacity-50" style={{ color: 'var(--color-text)' }}>{o.phone} · {o.address}</p>
                        {o.createdAt && <p className="text-xs opacity-30 mt-0.5" style={{ color: 'var(--color-text)' }}>{o.createdAt}</p>}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold" style={{ color: 'var(--color-gold)' }}>{o.total?.toFixed(2)} SAR</span>
                        <select value={o.status||'pending'} onChange={e=>handleStatusChange(o.id,e.target.value)}
                          className="text-xs px-2 py-1.5 rounded-lg border outline-none font-medium"
                          style={{ background: STATUS_COLORS[o.status]?.bg||STATUS_COLORS.pending.bg, color: STATUS_COLORS[o.status]?.color||STATUS_COLORS.pending.color, borderColor: 'transparent' }}>
                          {['pending','confirmed','shipped','delivered','cancelled'].map(s => (
                            <option key={s} value={s} style={{ background: 'var(--color-bg-card)', color: 'var(--color-text)' }}>
                              {s.charAt(0).toUpperCase()+s.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    {(o.items||[]).map((item,i)=>(
                      <div key={i} className="flex items-center gap-3 text-sm mb-1">
                        {item.image && <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />}
                        <span className="flex-1 opacity-70" style={{ color: 'var(--color-text)' }}>{item.name} {item.color&&`(${item.color})`} ×{item.quantity}</span>
                        <span style={{ color: 'var(--color-text)' }}>{(item.price*item.quantity).toFixed(2)} SAR</span>
                      </div>
                    ))}
                    <p className="text-xs opacity-20 mt-2 font-mono" style={{ color: 'var(--color-text)' }}>ID: {o.id}</p>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* PRODUCT MODAL */}
      {showPModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={()=>setShowPModal(false)} />
          <div className="relative w-full max-w-2xl my-8 rounded-3xl p-6 md:p-8" style={{ background: 'var(--color-bg-card)', boxShadow: 'var(--shadow-lg)' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-display font-semibold" style={{ color: 'var(--color-text)' }}>{editingP ? 'Edit Product' : 'Add Product'}</h2>
              <button onClick={()=>setShowPModal(false)} className="p-2 rounded-xl hover:opacity-70" style={{ color: 'var(--color-text)' }}><FiX size={20} /></button>
            </div>
            <form onSubmit={handleSaveP} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium mb-1 opacity-60" style={{ color: 'var(--color-text)' }}>Name (English) *</label>
                  <input className="input-field" value={pForm.name} required onChange={e=>setPForm(f=>({...f,name:e.target.value}))} placeholder="Product name" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 opacity-60" style={{ color: 'var(--color-text)' }}>Name (Arabic)</label>
                  <input className="input-field" dir="rtl" value={pForm.nameAr} onChange={e=>setPForm(f=>({...f,nameAr:e.target.value}))} placeholder="اسم المنتج" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 opacity-60" style={{ color: 'var(--color-text)' }}>Category *</label>
                  <select className="input-field" value={pForm.category} required onChange={e=>setPForm(f=>({...f,category:e.target.value}))}>
                    <option value="" disabled>Select category</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.name} style={{ background: 'var(--color-bg-card)', color: 'var(--color-text)' }}>
                        {c.nameLabel||c.name}{c.nameAr ? ` — ${c.nameAr}` : ''}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 opacity-60" style={{ color: 'var(--color-text)' }}>Price (SAR) *</label>
                  <input type="number" min="0" step="0.01" className="input-field" value={pForm.price} required onChange={e=>setPForm(f=>({...f,price:e.target.value}))} placeholder="0.00" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 opacity-60" style={{ color: 'var(--color-text)' }}>Stock Quantity</label>
                  <input type="number" min="0" className="input-field" value={pForm.quantity} onChange={e=>setPForm(f=>({...f,quantity:e.target.value}))} placeholder="0" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 opacity-60" style={{ color: 'var(--color-text)' }}>Colors (comma-separated)</label>
                  <input className="input-field" value={pForm.colors} onChange={e=>setPForm(f=>({...f,colors:e.target.value}))} placeholder="#FF5733, Gold, Silver" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 opacity-60" style={{ color: 'var(--color-text)' }}>Description (English)</label>
                <textarea rows={2} className="input-field resize-none" value={pForm.description} onChange={e=>setPForm(f=>({...f,description:e.target.value}))} placeholder="Description..." />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 opacity-60" style={{ color: 'var(--color-text)' }}>Description (Arabic)</label>
                <textarea rows={2} dir="rtl" className="input-field resize-none" value={pForm.descriptionAr} onChange={e=>setPForm(f=>({...f,descriptionAr:e.target.value}))} placeholder="وصف المنتج..." />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-xs font-medium mb-2 opacity-60" style={{ color: 'var(--color-text)' }}>Product Images</label>
                <button type="button" onClick={()=>fileRef.current?.click()} disabled={uploading}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border-2 border-dashed transition-all hover:opacity-70 disabled:opacity-40"
                  style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}>
                  <FiUpload size={16} />
                  {uploading ? `Uploading... ${uploadPct}%` : 'Upload Images'}
                </button>
                {uploading && (
                  <div className="mt-2 h-2 rounded-full overflow-hidden" style={{ background: 'var(--color-border)' }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${uploadPct}%`, background: 'var(--color-gold)' }} />
                  </div>
                )}
                <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
                {pForm.images.length > 0 && (
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {pForm.images.map((url,i) => (
                      <div key={i} className="relative group w-16 h-16">
                        <img src={url} alt="" className="w-16 h-16 rounded-xl object-cover" />
                        <button type="button" onClick={()=>setPForm(f=>({...f,images:f.images.filter((_,j)=>j!==i)}))}
                          className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{ background: '#ef4444' }}>
                          <FiX size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={savingP} className="btn-primary flex-1 justify-center disabled:opacity-60">
                  {savingP ? 'Saving...' : editingP ? 'Update' : 'Create'}
                </button>
                <button type="button" onClick={()=>setShowPModal(false)} className="btn-secondary px-6">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CATEGORY MODAL */}
      {showCModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={()=>setShowCModal(false)} />
          <div className="relative w-full max-w-sm rounded-3xl p-6" style={{ background: 'var(--color-bg-card)', boxShadow: 'var(--shadow-lg)' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-display font-semibold" style={{ color: 'var(--color-text)' }}>{editingC ? 'Edit Category' : 'Add Category'}</h2>
              <button onClick={()=>setShowCModal(false)} className="p-2 rounded-xl hover:opacity-70" style={{ color: 'var(--color-text)' }}><FiX size={20} /></button>
            </div>
            <form onSubmit={handleSaveC} className="space-y-4">
              <div>
                <label className="block text-xs font-medium mb-1 opacity-60" style={{ color: 'var(--color-text)' }}>Name (English) *</label>
                <input className="input-field" value={cForm.name} required onChange={e=>setCForm(f=>({...f,name:e.target.value}))} placeholder="e.g. Cookware" />
                <p className="text-xs mt-1 opacity-30" style={{ color: 'var(--color-text)' }}>Key: "{cForm.name.toLowerCase()}"</p>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 opacity-60" style={{ color: 'var(--color-text)' }}>Name (Arabic)</label>
                <input className="input-field" dir="rtl" value={cForm.nameAr} onChange={e=>setCForm(f=>({...f,nameAr:e.target.value}))} placeholder="أواني الطهي" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-2 opacity-60" style={{ color: 'var(--color-text)' }}>Color</label>
                <div className="flex items-center gap-3">
                  <input type="color" value={cForm.color} onChange={e=>setCForm(f=>({...f,color:e.target.value}))}
                    className="w-12 h-10 rounded-lg cursor-pointer border" style={{ borderColor: 'var(--color-border)' }} />
                  <input className="input-field flex-1" value={cForm.color} onChange={e=>setCForm(f=>({...f,color:e.target.value}))} placeholder="#c9a84c" />
                  <div className="w-10 h-10 rounded-xl flex-shrink-0" style={{ background: cForm.color }} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 opacity-60" style={{ color: 'var(--color-text)' }}>Icon</label>
                <select className="input-field" value={cForm.icon||'FiBox'} onChange={e=>setCForm(f=>({...f,icon:e.target.value}))}>
                  <option value="FiBox">📦 Default Box</option>
                  <option value="GiCookingPot">🍳 Cooking Pot</option>
                  <option value="GiPerfumeBottle">🌸 Perfume Bottle</option>
                  <option value="GiDiamondTrophy">💎 Diamond / Tray</option>
                  <option value="GiLipstick">💄 Lipstick</option>
                  <option value="GiSoap">🧼 Soap</option>
                  <option value="GiFlowerPot">🌺 Flower Pot</option>
                  <option value="GiCandleLight">🕯️ Candle</option>
                  <option value="MdOutlineCoffee">☕ Coffee / Cup</option>
                  <option value="MdOutlineFaceRetouchingNatural">✨ Cosmetics / Face</option>
                  <option value="MdOutlineKitchen">🍽️ Kitchen</option>
                  <option value="MdOutlineSpa">🧖 Spa</option>
                  <option value="FiHome">🏠 Home</option>
                  <option value="FiHeart">❤️ Heart</option>
                  <option value="FiStar">⭐ Star</option>
                  <option value="FiDroplet">💧 Droplet</option>
                  <option value="FiSun">☀️ Sun</option>
                  <option value="FiShoppingBag">🛍️ Shopping Bag</option>
                  <option value="BiDish">🍽️ Dish</option>
                  <option value="BsFlower1">🌸 Flower 1</option>
                  <option value="BsFlower2">🌸 Flower 2</option>
                </select>
                <p className="text-xs opacity-30 mt-1" style={{ color: 'var(--color-text)' }}>Icon shown on homepage category card</p>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={savingC} className="btn-primary flex-1 justify-center disabled:opacity-60">
                  {savingC ? 'Saving...' : editingC ? 'Update' : 'Create'}
                </button>
                <button type="button" onClick={()=>setShowCModal(false)} className="btn-secondary px-6">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default withAdminAuth(AdminDashboard);
