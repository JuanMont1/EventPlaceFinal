import React from 'react';
import { BarraNavegacionAdmin } from '../common/BarraNavegacionAdmin';
import { Outlet } from 'react-router-dom';

const AdminPage = () => {
  return (
    <div className="admin-layout">
      <BarraNavegacionAdmin />
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminPage;