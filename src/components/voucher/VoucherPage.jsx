import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { VoucherHeader } from './VoucherHeader';
import { VoucherTable } from './VoucherTable';
import { SignModal } from './SignModal';
import { TopNav } from '@/components/layout/TopNav';
import { AnimatedBackground } from '@/components/layout/AnimatedBackground';
import { PageHeader } from '@/components/layout/PageHeader';
import { getRegionInfo } from '@/constants/regions';
import { ArrowLeft, CheckCircle } from 'lucide-react';

export function VoucherPage({
  invoice,
  deliverer,
  onBack,
  saveSignedVoucher,
  onLogout,
}) {
  const [signOpen, setSignOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const regionInfo = invoice ? getRegionInfo(invoice.regionCode) : null;

  const handleFinalize = async (finalizedVoucher) => {
    await saveSignedVoucher(finalizedVoucher);
    setSignOpen(false);
    // Defer opening success dialog so sign modal can close first
    requestAnimationFrame(() => {
      setSuccessOpen(true);
    });
  };

  const handleSuccessClose = () => {
    setSuccessOpen(false);
    onBack();
  };

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
          <Button
            variant="ghost"
            onClick={onBack}
            className="-ml-2 mb-2 flex items-center gap-2 text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-xl transition-all duration-200 group"
            aria-label="Back to inventory"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Back to inventory
          </Button>
          <PageHeader
            title="Receiving voucher"
            description={`${invoice?.invoiceNo} · Review items and sign to save`}
          />

          <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md hover:border-border/80">
            <div className="p-6 md:p-8">
              <VoucherHeader invoice={invoice} regionInfo={regionInfo} />
              <VoucherTable items={invoice.items} />
              <div className="mt-8 pt-6 border-t border-border">
                <Button
                  className="w-full h-12 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-200"
                  size="lg"
                  onClick={() => setSignOpen(true)}
                >
                  Confirm & Save
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <SignModal
        open={signOpen}
        onOpenChange={setSignOpen}
        invoice={invoice}
        deliverer={deliverer}
        onFinalize={handleFinalize}
      />

      <Dialog open={successOpen} onOpenChange={(open) => { setSuccessOpen(open); if (!open) onBack(); }}>
        <DialogContent className="max-w-sm rounded-2xl border border-border bg-card shadow-xl text-center sm:text-left">
          <DialogHeader>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 sm:mx-0">
              <CheckCircle className="h-7 w-7" />
            </div>
            <DialogTitle className="text-lg pt-3">Voucher saved</DialogTitle>
            <DialogDescription>
              Saved locally. It will sync when you're back online.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center pt-2">
            <Button onClick={handleSuccessClose} className="w-full sm:w-auto">
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
