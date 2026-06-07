// withAdminAuth - protects admin pages using sessionStorage
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { isAdminAuthed } from '../lib/firebase';

export default function withAdminAuth(WrappedComponent) {
  return function AdminAuthWrapper(props) {
    const router = useRouter();
    const [checking, setChecking] = useState(true);
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
      if (isAdminAuthed()) {
        setAuthorized(true);
      } else {
        router.replace('/admin-login');
      }
      setChecking(false);
    }, []);

    if (checking) {
      return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg)' }}>
          <div className="text-center">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 animate-pulse"
              style={{ background: 'rgba(201,168,76,0.12)' }}>
              <span className="text-xl font-display font-bold" style={{ color: 'var(--color-gold)' }}>K</span>
            </div>
            <p className="text-sm opacity-40" style={{ color: 'var(--color-text)' }}>Verifying access...</p>
          </div>
        </div>
      );
    }

    if (!authorized) return null;
    return <WrappedComponent {...props} />;
  };
}
