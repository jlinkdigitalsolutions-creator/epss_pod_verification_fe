import { openDB } from 'idb';

const DB_NAME = 'Model19DB';

export const initDB = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('invoices')) db.createObjectStore('invoices', { keyPath: 'invoiceNo' });
      if (!db.objectStoreNames.contains('outbox')) db.createObjectStore('outbox', { keyPath: 'id', autoIncrement: true });
    },
  });
};

export const saveInvoices = async (invoices) => {
  const db = await initDB();
  const tx = db.transaction('invoices', 'readwrite');
  invoices.forEach(inv => tx.store.put(inv));
  await tx.done;
};

export const getInvoicesByFacility = async (facility) => {
  const db = await initDB();
  const all = await db.getAll('invoices');
  return all.filter(inv => inv.receivingFacility === facility);
};

// Save a signed voucher to outbox
export const saveSignedVoucher = async (voucherData) => {
  const db = await initDB();
  return db.add('outbox', { ...voucherData, timestamp: new Date().toISOString() });
};