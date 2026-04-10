import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopHeader from './TopHeader';

function Layout() {
  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="main-content">
        <TopHeader />
        <div className="page-container">
          <Outlet /> 
        </div>
      </div>
    </div>
  );
}

export default Layout;