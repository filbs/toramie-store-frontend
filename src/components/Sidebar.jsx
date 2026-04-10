import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Calculator, Settings, Package, LogOut } from 'lucide-react';

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userAuth");
    navigate("/login");
    window.location.reload();
  };

  const menu = [
    { path: '/admin/calculator', name: 'Calculator', icon: <Calculator size={20} /> },
    { path: '/admin', name: 'Settings', icon: <Settings size={20} /> },
    { path: '/admin/orders', name: 'Orders', icon: <Package size={20} /> },
  ];

  return (
    <div className="sidebar">
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <img src="/toramie-icon.png" alt="Logo" style={{ width: '70px', borderRadius: '18px' }} />
        <h2 style={{ color: 'var(--toramie-gold)', fontSize: '1.1rem', marginTop: '10px' }}>Toramie Admin</h2>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {menu.map((item) => (
          <Link 
            key={item.path}
            to={item.path} 
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            style={{
              display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 15px',
              borderRadius: '12px', textDecoration: 'none', transition: '0.3s',
              color: location.pathname === item.path ? 'white' : '#A0AEC0',
              background: location.pathname === item.path ? 'var(--toramie-blue)' : 'transparent'
            }}
          >
            {item.icon}
            <span style={{ fontWeight: '500' }}>{item.name}</span>
          </Link>
        ))}
      </nav>

      <button onClick={handleLogout} style={{
        marginTop: 'auto', background: 'none', border: 'none', color: '#fc8181',
        display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '15px'
      }}>
        <LogOut size={20} />
        <span style={{ fontWeight: '600' }}>Logout</span>
      </button>
    </div>
  );
}

export default Sidebar;