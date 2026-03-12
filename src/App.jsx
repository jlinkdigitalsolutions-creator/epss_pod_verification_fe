import React, { useRef, useState, useEffect } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { saveSignedVoucher, initDB } from './db';
import './App.css';

// 1. Mock Data Integration
const MOCK_INVOICES = [
  {
    receivingFacility: "Gula H.C.",
    invoiceNo: "INV-2026-001",
    date: "2026-03-05",
    receiverName: "Seid Mohammed",
    sender: "Amhara Regional State Bureau",
    region: "Amhara",
    regionCode: "AMH",
    items: [
      { id: 1, internalCode: '001', description: 'Samsung Galaxy Tablet A9+', unit: 'Pcs', receivedQty: 1, unitCost: 450, totalCost: 450, batch: 'SN-R92...', expiry: '2028-01-01', remark: 'Cellular' },
      { id: 2, internalCode: '002', description: 'Mobile Charger', unit: 'Pcs', receivedQty: 1, unitCost: 25, totalCost: 25, batch: 'N/A', expiry: 'N/A', remark: 'Fast' }
    ]
  },
  {
    receivingFacility: "Bahir Dar Clinic",
    invoiceNo: "INV-2026-002",
    date: "2026-03-06",
    receiverName: "Abebe Kebede",
    sender: "Amhara Regional State Bureau",
    region: "Amhara",
    regionCode: "AMH",
    items: [
      { id: 1, internalCode: '003', description: 'Medical Gloves', unit: 'Box', receivedQty: 50, unitCost: 10, totalCost: 500, batch: 'GLV-123', expiry: '2027-12-01', remark: '' }
    ]
  }
];

function App() {
  useEffect(() => {
    const syncData = async () => {
      if (navigator.onLine) {
        const db = await initDB();
        const pendingVouchers = await db.getAll('outbox');
        
        for (const voucher of pendingVouchers) {
          // Mock API Call
          const success = await fetch('/api/submit-voucher', {
            method: 'POST',
            body: JSON.stringify(voucher)
          });
          
          if (success.ok) {
            // Remove from outbox after successful sync
            await db.delete('outbox', voucher.id);
          }
        }
      }
    };

    window.addEventListener('online', syncData);
    return () => window.removeEventListener('online', syncData);
  }, []);

  const deliveredSigRef = useRef(null); // Create these refs
  const receivedSigRef = useRef(null);

  const [selectedFacility, setSelectedFacility] = useState('');
  const [invoice, setInvoice] = useState(null);
  
  // Get unique facilities for the first dropdown
  const facilities = [...new Set(MOCK_INVOICES.map(i => i.receivingFacility))];
  
  // Filter invoices based on selected facility
  const availableInvoices = MOCK_INVOICES.filter(i => i.receivingFacility === selectedFacility);
  const regionInfo = invoice ? getRegionInfo(invoice.regionCode) : null;

  // Add this to your App component
  const [deliverer, setDeliverer] = useState(() => {
    return JSON.parse(localStorage.getItem('delivererProfile')) || { name: '', id: '', status: '' };
  });

  const [isConfirming, setIsConfirming] = useState(false);

  const openConfirmation = () => {
    // Add validation: Ensure form is ready
    setIsConfirming(true);
  };

  const saveDeliverer = (data) => {
    setDeliverer(data);
    // localStorage.setItem('delivererProfile', JSON.stringify(data));
  };

  const handleConfirmAndSave = async () => {
    // Check if signatures are empty
    if (deliveredSigRef.current.isEmpty() || receivedSigRef.current.isEmpty()) {
      alert("Both signatures are required!");
      return;
    }

    const finalizedVoucher = {
      ...invoice,
      deliveredBy: deliverer.name,
      // Extract base64 image strings
      deliveredSignature: deliveredSigRef.current.toDataURL(),
      receivedSignature: receivedSigRef.current.toDataURL(),
      status: 'pending_sync'
    };

    await saveSignedVoucher(finalizedVoucher);
    alert("Voucher saved locally! It will sync when online.");
    setInvoice(null);
  };

  if (deliverer.status == '') {
    return (
      <div className="auth-container">
        <h2>Deliverer Login</h2>
        <p>Please enter your credentials to continue</p>
        <input 
          placeholder="Username" 
          value={deliverer.name}
          onChange={(e) => setDeliverer({...deliverer, name: e.target.value})} 
        />
        <input 
          placeholder="Staff ID" 
          value={deliverer.id}
          onChange={(e) => setDeliverer({...deliverer, id: e.target.value})} 
        />
        <button onClick={() => saveDeliverer({...deliverer, status: 'accepted'})}>Login & Continue</button>
      </div>
    );
  }

  // Render Selection Screen if no invoice is chosen
  if (!invoice) {
    return (
      <div className="selection-page">
        <h2>Inventory Management System</h2>
        <div className="selection-container">
          <select onChange={(e) => setSelectedFacility(e.target.value)} value={selectedFacility}>
            <option value="">-- Select Receiving Facility --</option>
            {facilities.map(f => <option key={f} value={f}>{f}</option>)}
          </select>

          {selectedFacility && (
            <select onChange={(e) => setInvoice(availableInvoices.find(i => i.invoiceNo === e.target.value))}>
              <option value="">-- Select Invoice No --</option>
              {availableInvoices.map(inv => <option key={inv.invoiceNo} value={inv.invoiceNo}>{inv.invoiceNo}</option>)}
            </select>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="voucher-page">
      <button onClick={() => setInvoice(null)}>← Back to Selection</button>
      <header className="voucher-header">
        <div className="header-top">
          <span>ሞዴል 19/ጤና <br/> Model 19/Health</span>
          <div className="serial-input-wrapper">
            <label htmlFor="serialNo">Seri. No: </label>
            <input 
              id="serialNo"
              type="number" 
              placeholder="000000"
              min="100000" 
              max="999999" 
              required 
              className="serial-input"
            />
          </div>
        </div>
        <div className="title-block">
          <h2 className="org-name">
            { regionInfo?.amharic} <br/>
            { regionInfo?.english }
          <br/>
            የመድኃኒትና የህክምና መገልገያዎች ገቢ ደረሰኝ<br/>
            Receiving Voucher for Drugs, Reagents, Medical Supplies and Equipment
          </h2>
        </div>
        <h2>Receiving Voucher</h2>
        <div className="receiving-declaration">
          <p className="amharic-declaration">
            እኔ <strong>{invoice.receiverName}</strong> በቀን <strong>{invoice.date} </strong>
            ከ <strong>{invoice.sender}</strong> የተላከውን ከታች የተዘረዘረውን ዕቃ በትክክል ቆጥሬ መረከቤን አረጋግጣለሁ::
          </p>

          <p className="declaration-text">
            I, <strong>{invoice.receiverName}</strong>, on <strong>{invoice.date}</strong>, 
            hereby certify that I have counted correctly and received items enumerated below 
            for <strong>{invoice.institution}</strong> from <strong>{invoice.sender}</strong> 
            (Invoice No: {invoice.invoiceNo}).
          </p>
        </div>
      </header>
      

      <div className="table-container">
        <table className="voucher-table">
          <thead>
          <tr>
            <th><small>ተራ <br/>ቁጥር</small><br/>S/N</th>
            <th><small>የውስጥ ኮድ</small><br/>Internal <br/>Code</th>
            <th><small>የዕቃው ዝርዝር</small><br/>Description</th>
            <th><small>መለኪያ</small><br/>Unit</th>
            <th><small>ብዛት</small><br/>Qty</th>
            <th><small>የአንዱ ዋጋ</small><br/>Unit Cost</th>
            <th><small>ጠቅላላ ዋጋ</small><br/>Total</th>
            <th><small>ባች</small><br/>Batch</th>
            <th><small>ማለቂያ ቀን</small><br/>Expiry</th>
            <th><small>ማስታወሻ</small><br/>Remark</th>
          </tr>
        </thead>
          <tbody>
            {invoice.items.map((item, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{item.internalCode}</td>
                <td>{item.description}</td>
                <td>{item.unit}</td>
                <td>{item.receivedQty}</td>
                <td>{item.unitCost}</td>
                <td className="bold">{item.totalCost}</td>
                <td>{item.batch}</td>
                <td>{item.expiry}</td>
                <td>{item.remark}</td>
              </tr>
            ))}
            <tr>
                <td colSpan="6" style={{ textAlign: 'right', fontWeight: 'bold' }}>
                  <small>ጠቅላላ ዋጋ</small> / Sum Total
                </td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
          </tbody>
        </table>
      </div>

      {/* <div className="accounting-section">
        <h3>Only for accounting purpose</h3>
        <div className="grid-2">
          <input placeholder="Budget Category" onChange={(e) => setAccounting({...accounting, budget: e.target.value})} />
          <input placeholder="Account Code" onChange={(e) => setAccounting({...accounting, account: e.target.value})} />
        </div>
        <div className="sum-total">Sum Total: {totalSum.toFixed(2)}</div>
      </div> */}

      
      <button 
        className="submit-btn" 
        onClick={openConfirmation}
      >
        Confirm & Save
      </button>

      {isConfirming && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Review & Sign</h3>
            <p>Invoice: {invoice.invoiceNo}</p>
            
            <footer className="voucher-footer">
              {/* Delivered By Section */}
              <div className="sig-column">
                <h4>Delivered By</h4>
                <div className="sig-box">
                  <label>Name:</label>
                  <input 
                    type="text" 
                    className="sig-input" 
                    value={deliverer.name} 
                    readOnly // Keeps it professional as it's auto-filled
                  />
                </div>
                <div className="sig-box">
                  <label>Signature:</label>
                  <SignatureCanvas 
                    ref={deliveredSigRef}
                    penColor='black' 
                    canvasProps={{width: 200, height: 80, className: 'sig-canvas'}} 
                  />
                </div>
              </div>

              {/* Received By Section */}
              <div className="sig-column">
                <h4>Received By</h4>
                <div className="sig-box">
                  <label>Name:</label>
                  <input type="text" className="sig-input" placeholder="Enter name..." />
                </div>
                <div className="sig-box">
                  <label>Signature:</label>
                  <SignatureCanvas 
                    ref={receivedSigRef}
                    penColor='black' 
                    canvasProps={{width: 200, height: 80, className: 'sig-canvas'}} 
                  />
                </div>
              </div>
            </footer>

            
            <button onClick={handleConfirmAndSave}>Finalize & Save</button>
            <button onClick={() => setIsConfirming(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

const REGIONS = {
  'ADD': {
    english: 'Addis Ababa City Administration Finance Bureau',
    amharic: 'አዲስ አበባ ከተማ አስተዳደር የገንዘብ ቢሮ'
  },
  'AFR': {
    english: 'Afar National Regional State Finance and Economic Development Bureau',
    amharic: 'አፋር ብሔራዊ ክልላዊ መንግሥት የገንዘብና ኢኮኖሚ ትብብር ቢሮ'
  },
  'AMH': {
    english: 'Amhara Regional State Bureau of Finance and Economic Cooperation',
    amharic: 'አማራ ብሔራዊ ክልላዊ መንግሥት የገንዘብና ኢኮኖሚ ትብብር ቢሮ'
  },
  'BEN': {
    english: 'Benishangul-Gumuz National Regional State Finance and Economic Development Bureau',
    amharic: 'ቤኒሻንጉል ጉምዝ ብሔራዊ ክልላዊ መንግሥት የገንዘብና ኢኮኖሚ ትብብር ቢሮ'
  },
  'DIR': {
    english: 'Dire Dawa City Administration Finance Bureau',
    amharic: 'ድሬዳዋ ከተማ አስተዳደር የገንዘብ ቢሮ'
  },
  'GAM': {
    english: 'Gambella Peoples National Regional State Finance and Economic Development Bureau',
    amharic: 'ጋምቤላ ሕዝቦች ብሔራዊ ክልላዊ መንግሥት የገንዘብና ኢኮኖሚ ትብብር ቢሮ'
  },
  'HAR': {
    english: 'Harari National Regional State Finance and Economic Development Bureau',
    amharic: 'ሐረሪ ብሔራዊ ክልላዊ መንግሥት የገንዘብና ኢኮኖሚ ትብብር ቢሮ'
  },
  'ORO': {
    english: 'Oromia National Regional State Finance and Economic Cooperation Bureau',
    amharic: 'ኦሮሚያ ብሔራዊ ክልላዊ መንግሥት የገንዘብና ኢኮኖሚ ትብብር ቢሮ'
  },
  'SID': {
    english: 'Sidama National Regional State Finance and Economic Development Bureau',
    amharic: 'ሲዳማ ብሔራዊ ክልላዊ መንግሥት የገንዘብና ኢኮኖሚ ትብብር ቢሮ'
  },
  'SOM': {
    english: 'Somali National Regional State Finance and Economic Development Bureau',
    amharic: 'ሶማሌ ብሔራዊ ክልላዊ መንግሥት የገንዘብና ኢኮኖሚ ትብብር ቢሮ'
  },
  'SOU': {
    english: 'South Ethiopia Regional State Finance and Economic Development Bureau',
    amharic: 'ደቡብ ኢትዮጵያ ክልላዊ መንግሥት የገንዘብና ኢኮኖሚ ትብብር ቢሮ'
  },
  'SWE': {
    english: 'South West Ethiopia Peoples’ Regional State Finance and Economic Development Bureau',
    amharic: 'ደቡብ ምዕራብ ኢትዮጵያ ሕዝቦች ክልላዊ መንግሥት የገንዘብና ኢኮኖሚ ትብብር ቢሮ'
  },
  'TIG': {
    english: 'Tigray National Regional State Finance and Economic Development Bureau',
    amharic: 'ትግራይ ብሔራዊ ክልላዊ መንግሥት የገንዘብና ኢኮኖሚ ትብብር ቢሮ'
  },
  'NTN': {
    english: 'Finance and Economic Development Bureau',
    amharic: 'የገንዘብና ኢኮኖሚ ትብብር ቢሮ'
  }
};

// Helper method to get the info
const getRegionInfo = (regionCode) => {
  return REGIONS[regionCode] || REGIONS['NTN'];
};

export default App;