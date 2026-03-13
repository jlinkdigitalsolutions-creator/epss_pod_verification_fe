import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { saveSignedVoucher, initDB } from '@/db';
import { DelivererLogin } from '@/components/auth/DelivererLogin';
import { SelectionPage } from '@/components/selection/SelectionPage';
import { VoucherPage } from '@/components/voucher';
import { InvoicePage } from '@/components/voucher/InvoicePage';
import { MOCK_INVOICES } from '@/constants/mockData';
import { AnimatedBackground } from '@/components/layout/AnimatedBackground';


import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';

const DEFAULT_DELIVERER = { name: '', id: '', status: '' };

export default function App() {
  const navigate = useNavigate();

  const [deliverer, setDeliverer] = useState(DEFAULT_DELIVERER);
  const [invoice, setInvoice] = useState(null);
  const [selectedFacility, setSelectedFacility] = useState('');

  useEffect(() => {
    const syncData = async () => {
      if (!navigator.onLine) return;
      const db = await initDB();
      const pendingVouchers = await db.getAll('outbox');
      for (const voucher of pendingVouchers) {
        try {
          const res = await fetch('/api/submit-voucher', {
            method: 'POST',
            body: JSON.stringify(voucher),
          });
          if (res.ok) await db.delete('outbox', voucher.id);
        } catch (_) { }
      }
    };
    window.addEventListener('online', syncData);
    return () => window.removeEventListener('online', syncData);
  }, []);

  const facilities = [...new Set(MOCK_INVOICES.map((i) => i.receivingFacility))];
  const availableInvoices = MOCK_INVOICES.filter((i) => i.receivingFacility === selectedFacility);

  useEffect(() => {
    setInvoice(null);
  }, [selectedFacility]);

  return (
    <>

      <AnimatedBackground />
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={
            <DelivererLogin
              deliverer={deliverer}
              onSave={(data) => {
                if(data.name == 'Staff')
                  setDeliverer(data);
                  localStorage.setItem('delivererProfile', JSON.stringify(data));
                  navigate('/selection');
              }}
            />} 
          />

          <Route path="/selection" element={
            <SelectionPage
              facilities={facilities}
              availableInvoices={availableInvoices}
              selectedFacility={selectedFacility}
              onSelectFacility={setSelectedFacility}
              onSelectInvoice={(data) => { 
                setInvoice(data);
                localStorage.setItem('selectedInvoice', JSON.stringify(data));
                navigate('/invoice');
              }}
              user={deliverer}
            />} 
          />

          <Route path="/invoice" element={
            <InvoicePage
              deliverer={deliverer}
              onBack={() => setInvoice(null)}
              saveSignedVoucher={saveSignedVoucher}
            />} 
          />

          <Route path="/callback" element={
            <VoucherPage
              invoice={invoice}
              deliverer={deliverer}
              onBack={() => setInvoice(null)}
              saveSignedVoucher={saveSignedVoucher}
            />} 
          />
        </Routes>
      </AnimatePresence>
    </>
  );
}
