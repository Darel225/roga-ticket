import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import TicketVerify from './pages/TicketVerify';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/t/:code" element={<TicketVerify />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

