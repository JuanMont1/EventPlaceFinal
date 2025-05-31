import React from 'react';
import { Outlet } from 'react-router-dom';
import { BarraNavegacion2 } from '../common/BarraNavegacion2';

const MainLayout = () => {
  return (
    <>
      <BarraNavegacion2 />
      <Outlet />
    </>
  );
};

export default MainLayout;