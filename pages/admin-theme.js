// Admin Theme Settings - /admin-theme
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import withAdminAuth from '../components/withAdminAuth';
import { getTheme, saveTheme, DEFAULT_THEME } from '../lib/firebase';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';
import { FiArrowLeft, FiRefreshCw, FiSave, FiLogOut } from 'react-icons/fi';
import { logoutAdmin } from '../lib/firebase';
import { useRouter } from 'next/router';

const PRESETS = [
  {
    label: 'Khareef Gold (Default)',
    values: { colorGold: '#c9a84c', colorSage: '#558552', colorBg: '#fdf8f0', colorBgCard: '#ffffff', colorText: '#2d2a22', colorBgDark: '#1a1812', colorBgCardDark: '#252218', colorTextDark: '#f0ead8' },
  },
  {
    label: 'Royal Purple',
    values: { colorGold: '#7c3aed', colorSage: '#6d28d9', colorBg: '#faf5ff', colorBgCard: '#ffffff', colorText: '#1e1b2e', colorBgDark: '#13111f', colorBgCardDark: '#1e1b2e', colorTextDark: '#ede9fe' },
  },
  {
    label: 'Rose Gold',
    values: { colorGold: '#c2848a', colorSage: '#a05c62', colorBg: '#fff5f5', colorBgCard: '#ffffff', colorText: '#2d1f1f', colorBgDark: '#1f1515', colorBgCardDark: '#2d1f1f', colorTextDark: '#fde8e8' },
  },
  {
    label: 'Ocean Blue',
    values: { colorGold: '#0ea5e9', colorSage: '#0284c7', colorBg: '#f0f9ff', colorBgCard: '#ffffff', colorText: '#0c1a26', colorBgDark: '#0a1628', colorBgCardDark: '#0f2236', colorTextDark: '#e0f2fe' },
  },
  {
    label: 'Sage Green',
    values: { colorGold: '#16a34a', colorSage: '#15803d', colorBg: '#f0fdf4', colorBgCard: '#ffffff', colorText: '#14291e', colorBgDark: '#0f1f17', colorBgCardDark: '#162b20', colorTextDark: '#dcfce7' },
  },
];

const COLOR_FIELDS = [
  { key: 'colorGold',       label: 'Primary / Accent Color',  hint: 'Main brand color — buttons, prices, highlights' },
  { key: 'colorSage',       label: 'Secondary Color',          hint: 'Secondary accent' },
  { key: 'colorBg',         label: 'Page Background (Light)',  hint: 'Main background in light mode' },
  { key: 'colorBgCard',     label: 'Card Background (Light)',  hint: 'Cards and panels in light mode' },
  { key: 'colorText',       label: 'Text Color (Light)',       hint: 'Main text in light mode' },
  { key: 'colorBgDark',     label: 'Page Background (Dark)',   hint: 'Main background in dark mode' },
  { key: 'colorBgCardDark', label: 'Card Background (Dark)',   hint: 'Cards and panels in dark mode' },
  { key: 'colorTextDark',   label: 'Text Color (Dark)',        hint: 'Main text in dark mode' },
];

function AdminThemePage() {
  const router = useRouter();
  const { updateTheme } = useTheme();
  const [form,    setForm]    = useState(DEFAULT_THEME);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);

  useEffect(() => {
    getTheme().then(t => { setForm(t); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const handleChange = (key, value) => {
    const updated = { ...form, [key]: value };
    setForm(updated);
    updateTheme(updated); // live preview
  };

  const applyPreset = (preset) => {
    const updated = { ...form, ...preset.values };
    setForm(updated);
    updateTheme(updated);
    toast.success(`Preset "${preset.label}" applied — click Save to keep it`);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveTheme(form);
      updateTheme(form);
      toast.success('Theme saved successfully!');
    } catch (e) {
      toast.error('Failed to save: ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!window.confirm('Reset to default theme?')) return;
    setForm(DEFAULT_THEME);
    updateTheme(DEFAULT_THEME);
    await saveTheme(DEFAULT_THEME);
    toast.success('Theme reset to default');
  };

  const handleLogout = () => { logoutAdmin(); router.replace('/admin-login'); };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg)' }}>
      <p className="opacity-40" style={{ color: 'var(--color-text)' }}>Loading theme...</p>
    </div>
  );

  return (
    <>
      <Head><title>Theme Settings | Khareef Admin</title><meta name="robots" content="noindex" /></Head>
      <Toaster position="top-right" />

      <div className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
        {/* Header */}
        <header className="sticky top-0 z-40 border-b px-6 py-3 flex items-center justify-between"
          style={{ background: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}>
          <div className="flex items-center gap-3">
            <Link href="/admin-dashboard"
              className="p-2 rounded-xl hover:opacity-70 transition-opacity"
              style={{ color: 'var(--color-text)' }}>
              <FiArrowLeft size={18} />
            </Link>
            <div>
              <p className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>Theme Settings</p>
              <p className="text-xs opacity-40" style={{ color: 'var(--color-text)' }}>Customize store appearance</p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-sm opacity-50 hover:opacity-100"
            style={{ color: 'var(--color-text)' }}>
            <FiLogOut size={15} /> Logout
          </button>
        </header>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

          {/* Live Preview Banner */}
          <div className="p-4 rounded-2xl text-sm"
            style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)', color: 'var(--color-gold)' }}>
            🎨 Changes preview live instantly. Click <strong>Save Theme</strong> to make them permanent.
          </div>

          {/* Presets */}
          <div>
            <h2 className="text-lg font-display font-semibold mb-4" style={{ color: 'var(--color-text)' }}>
              Quick Presets
            </h2>
            <div className="flex flex-wrap gap-3">
              {PRESETS.map((preset) => (
                <button key={preset.label} onClick={() => applyPreset(preset)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all hover:shadow-md hover:-translate-y-0.5"
                  style={{ background: 'var(--color-bg-card)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}>
                  <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ background: preset.values.colorGold }} />
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Color Pickers */}
          <div>
            <h2 className="text-lg font-display font-semibold mb-4" style={{ color: 'var(--color-text)' }}>
              Custom Colors
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {COLOR_FIELDS.map(({ key, label, hint }) => (
                <div key={key} className="p-4 rounded-2xl"
                  style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>{label}</label>
                    <div className="w-8 h-8 rounded-lg border" style={{ background: form[key], borderColor: 'var(--color-border)' }} />
                  </div>
                  <p className="text-xs opacity-40 mb-3" style={{ color: 'var(--color-text)' }}>{hint}</p>
                  <div className="flex items-center gap-3">
                    <input type="color" value={form[key]}
                      onChange={e => handleChange(key, e.target.value)}
                      className="w-12 h-9 rounded-lg cursor-pointer border"
                      style={{ borderColor: 'var(--color-border)' }} />
                    <input type="text" value={form[key]}
                      onChange={e => handleChange(key, e.target.value)}
                      className="input-field flex-1 text-sm font-mono py-2"
                      placeholder="#c9a84c" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Live Preview */}
          <div>
            <h2 className="text-lg font-display font-semibold mb-4" style={{ color: 'var(--color-text)' }}>
              Preview
            </h2>
            <div className="p-6 rounded-2xl space-y-4"
              style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
              <div className="flex gap-3 flex-wrap">
                <button className="btn-primary">Primary Button</button>
                <button className="btn-secondary">Secondary Button</button>
                <span className="badge" style={{ background: `${form.colorGold}18`, color: form.colorGold }}>Badge</span>
              </div>
              <div className="flex gap-3">
                <div className="p-4 rounded-xl text-center flex-1 card">
                  <p className="text-2xl font-bold" style={{ color: form.colorGold }}>49.99</p>
                  <p className="text-sm opacity-60" style={{ color: 'var(--color-text)' }}>Product Price</p>
                </div>
                <div className="p-4 rounded-xl text-center flex-1 card">
                  <div className="w-8 h-8 rounded-full mx-auto mb-1" style={{ background: form.colorGold }} />
                  <p className="text-xs opacity-60" style={{ color: 'var(--color-text)' }}>Accent Color</p>
                </div>
                <div className="p-4 rounded-xl text-center flex-1 card">
                  <div className="w-8 h-8 rounded-full mx-auto mb-1" style={{ background: form.colorSage }} />
                  <p className="text-xs opacity-60" style={{ color: 'var(--color-text)' }}>Secondary</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pb-8">
            <button onClick={handleSave} disabled={saving}
              className="btn-primary flex-1 justify-center text-base disabled:opacity-60">
              <FiSave size={18} />
              {saving ? 'Saving...' : 'Save Theme'}
            </button>
            <button onClick={handleReset}
              className="btn-secondary flex items-center justify-center gap-2 px-6">
              <FiRefreshCw size={16} /> Reset to Default
            </button>
            <Link href="/admin-dashboard" className="btn-secondary flex items-center justify-center gap-2 px-6">
              <FiArrowLeft size={16} /> Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default withAdminAuth(AdminThemePage);
