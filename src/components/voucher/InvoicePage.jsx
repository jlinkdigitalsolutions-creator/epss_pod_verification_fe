import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import { VoucherTableEdit } from './VoucherTableEdit';
import { TopNav } from '@/components/layout/TopNav';
import { AnimatedBackground } from '@/components/layout/AnimatedBackground';
import { PageHeader } from '@/components/layout/PageHeader';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function InvoicePage({
  deliverer,
  onLogout,
}) {
  const navigate = useNavigate();

  // 1. Move invoice to actual State so the parent re-renders
  const [invoice, setInvoice] = useState(() => {
    const savedData = localStorage.getItem('selectedInvoice');
    return savedData ? JSON.parse(savedData) : null;
  });

  return (
    <div className="min-h-screen flex flex-col ">
      <AnimatedBackground />
      <TopNav
        user={deliverer}
        onLogout={onLogout}
        title={invoice?.invoiceNo ?? 'Voucher'}
      />

      <main id="main-content" className="flex-1 p-4 md:p-6 lg:p-8" role="main">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-end justify-between gap-4 mb-2">
            <PageHeader
              title="Invoice"
              description={invoice?.invoiceNo}
              className="mb-0" // Remove any bottom margin from the header if it has one
            />
            
            <Button
              variant="ghost"
              onClick={() => navigate("/selection")}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-xl transition-all duration-200 group"
              aria-label="Back to inventory"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
              Back to Selection
            </Button>
          </div>

          <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md hover:border-border/80">
            <div className="p-6 md:p-8">
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-4">
                  
                  {/* Column 1 */}
                  <div className="space-y-4">
                    <div className="flex justify-between border-b border-gray-50 pb-1">
                      <span className="text-gray-500 font-medium">Invoice Number</span>
                      <span className="text-gray-900 font-semibold">{invoice.invoiceNo}</span>
                    </div>
                    
                    <div className="flex justify-between border-b border-gray-50 pb-1">
                      <span className="text-gray-500 font-medium">Mode</span>
                      <span className="text-gray-900 font-semibold">Health Program</span>
                    </div>

                    <div className="flex justify-between border-b border-gray-50 pb-1">
                      <span className="text-gray-500 font-medium">Invoice Date</span>
                      <span className="text-gray-900 font-semibold">{invoice.date}</span>
                    </div>
                  </div>

                  {/* Column 2 */}
                  <div className="space-y-4">
                    <div className="flex justify-between border-b border-gray-50 pb-1">
                      <span className="text-gray-500 font-medium">Account</span>
                      <span className="text-gray-900 font-semibold">MOH</span>
                    </div>

                    <div className="flex justify-between border-b border-gray-50 pb-1">
                      <span className="text-gray-500 font-medium">Sub Account</span>
                      <span className="text-gray-900 font-semibold">Other</span>
                    </div>

                    <div className="flex justify-between border-b border-gray-50 pb-1">
                      <span className="text-gray-500 font-medium">Activity</span>
                      <span className="text-gray-900 font-semibold">Other</span>
                    </div>
                  </div>

                </div>
              </div>
              <br />

              <VoucherTableEdit 
                data={invoice} 
                onUpdate={(updatedInvoice) => setInvoice(updatedInvoice)} // Listen for changes
              />

              <div className="pt-6 border-border">
                <Button
                  className="w-full h-12 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-200"
                  size="lg"
                  onClick={() => {
                    localStorage.setItem('selectedInvoice', JSON.stringify(invoice));
                    navigate("/callback");
                  }
                }
                >
                  Save & Continue
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
