import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { saveSignedVoucher, initDB } from '@/db';
import { DelivererLogin } from '@/components/auth/DelivererLogin';
import { SelectionPage } from '@/components/selection/SelectionPage';
import { VoucherPage } from '@/components/voucher';
import { MOCK_INVOICES } from '@/constants/mockData';
import { PageTransition } from '@/components/layout/PageTransition';

const DEFAULT_DELIVERER = () =>
  JSON.parse(localStorage.getItem('delivererProfile')) || { name: '', id: '', status: '' };

export default function App() {
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
      <AnimatePresence mode="wait">
        {deliverer.status !== 'accepted' ? (
          <PageTransition key="login">
            <DelivererLogin
              deliverer={deliverer}
              onSave={(data) => {
                setDeliverer(data);
                localStorage.setItem('delivererProfile', JSON.stringify(data));
              }}
            />
          </PageTransition>
        ) : !invoice ? (
          <PageTransition key="selection">
            <SelectionPage
              facilities={facilities}
              availableInvoices={availableInvoices}
              selectedFacility={selectedFacility}
              onSelectFacility={setSelectedFacility}
              onSelectInvoice={setInvoice}
              user={deliverer}
              onLogout={() => {
                setDeliverer({ name: '', id: '', status: '' });
                localStorage.removeItem('delivererProfile');
              }}
            />
          </PageTransition>
        ) : (
          <PageTransition key="voucher">
            <VoucherPage
              invoice={invoice}
              deliverer={deliverer}
              onBack={() => setInvoice(null)}
              saveSignedVoucher={saveSignedVoucher}
              onLogout={() => {
                setDeliverer({ name: '', id: '', status: '' });
                localStorage.removeItem('delivererProfile');
              }}
            />
          </PageTransition>
        )}
      </AnimatePresence>
    </>
  );
}
