import React, { useRef, useState, useEffect } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { PenLine, User, AlertCircle, CheckCircle2, FileSignature } from 'lucide-react';
import { cn } from '@/lib/utils';

export function SignModal({
  open,
  onOpenChange,
  invoice,
  deliverer,
  onFinalize,
}) {
  const deliveredSigRef = useRef(null);
  const receivedSigRef = useRef(null);
  const [saving, setSaving] = useState(false);
  const [validationError, setValidationError] = useState(null);
  const [deliveredSigned, setDeliveredSigned] = useState(false);
  const [receivedSigned, setReceivedSigned] = useState(false);
  const [activePad, setActivePad] = useState(null); // 'delivered' | 'received' | null

  useEffect(() => {
    if (!open) {
      setValidationError(null);
      setDeliveredSigned(false);
      setReceivedSigned(false);
      setActivePad(null);
      deliveredSigRef.current?.clear();
      receivedSigRef.current?.clear();
    }
  }, [open]);

  const canFinalize = deliveredSigned && receivedSigned;

  const handleCancel = () => {
    onOpenChange(false);
  };

  const handleFinalize = async () => {
    if (deliveredSigRef.current?.isEmpty() || receivedSigRef.current?.isEmpty()) {
      setValidationError('Both signatures are required.');
      return;
    }
    setValidationError(null);
    setSaving(true);
    try {
      const finalizedVoucher = {
        ...invoice,
        deliveredBy: deliverer.name,
        deliveredSignature: deliveredSigRef.current.toDataURL(),
        receivedSignature: receivedSigRef.current.toDataURL(),
        status: 'pending_sync',
      };
      await onFinalize(finalizedVoucher);
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} key={String(open)}>
      <DialogContent
        className={cn(
          'max-w-2xl max-h-[90vh] overflow-y-auto p-0 gap-0 border-0 shadow-2xl',
          'rounded-2xl bg-gradient-to-b from-card via-card to-muted/30',
          'ring-1 ring-border/80'
        )}
      >
        {/* Header with gradient accent */}
        <div className="relative overflow-hidden rounded-t-2xl bg-gradient-to-r from-primary/12 via-primary/8 to-transparent dark:from-primary/20 dark:via-primary/10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,var(--primary)/.15),transparent]" aria-hidden />
          <DialogHeader className="relative px-6 pt-6 pb-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary shadow-sm">
                <FileSignature className="h-5 w-5" />
              </span>
              <div>
                <DialogTitle className="text-xl font-semibold tracking-tight">Review & Sign</DialogTitle>
                <DialogDescription className="text-sm mt-0.5">
                  Invoice{' '}
                  <span className="inline-flex items-center rounded-md bg-primary/15 px-2 py-0.5 font-mono text-sm font-medium text-foreground">
                    {invoice?.invoiceNo}
                  </span>
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        {validationError && (
          <div
            className="mx-6 mt-4 flex items-center gap-2 rounded-xl border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive"
            role="alert"
          >
            <AlertCircle className="h-4 w-4 shrink-0" />
            {validationError}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 px-6 py-6">
          {/* Delivered By */}
          <div
            className={cn(
              'group relative rounded-2xl border bg-gradient-to-br from-muted/40 to-muted/20 p-5 transition-all duration-300',
              'hover:shadow-lg hover:border-primary/20 hover:from-muted/50',
              'dark:from-muted/30 dark:to-muted/10 dark:hover:from-muted/40'
            )}
          >
            <div className="absolute left-0 top-5 bottom-5 w-1 rounded-full bg-primary/30 group-hover:bg-primary/50 transition-colors" aria-hidden />
            <div className="flex items-center gap-3 mb-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary shadow-sm transition-transform group-hover:scale-105">
                <User className="h-4 w-4" />
              </span>
              <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
                <h4 className="font-semibold text-sm uppercase tracking-wider text-foreground/90">Delivered By</h4>
                {deliveredSigned && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                    <CheckCircle2 className="h-3 w-3" /> Signed
                  </span>
                )}
              </div>
            </div>
            <div className="space-y-3">
              <Label className="text-xs font-medium text-muted-foreground">Name</Label>
              <Input
                value={deliverer?.name ?? ''}
                readOnly
                variant="filled"
                className="h-11 font-medium rounded-xl"
              />
            </div>
            <div className="space-y-2 mt-4">
              <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <PenLine className="h-3.5 w-3.5" />
                Signature <span className="text-destructive/80">*</span>
              </Label>
              <div
                onFocus={() => setActivePad('delivered')}
                onBlur={() => setActivePad(null)}
                className="outline-none rounded-2xl"
                tabIndex={0}
              >
                <div
                  className={cn(
                    'relative rounded-2xl border-2 bg-background/80 overflow-hidden min-h-[110px] transition-all duration-300',
                    'hover:border-primary/40 hover:ring-2 hover:ring-primary/10 hover:ring-offset-2 hover:ring-offset-background',
                    activePad === 'delivered' && 'border-primary/60 ring-2 ring-primary/20 ring-offset-2 ring-offset-background',
                    deliveredSigned && 'border-emerald-500/50 dark:border-emerald-500/40 bg-emerald-500/5',
                    !deliveredSigned && 'border-dashed border-border'
                  )}
                >
                  {deliveredSigned && (
                    <div className="absolute top-2 right-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </div>
                  )}
                  <SignatureCanvas
                    ref={deliveredSigRef}
                    penColor="currentColor"
                    onEnd={() => setDeliveredSigned(!deliveredSigRef.current?.isEmpty())}
                    canvasProps={{
                      width: 280,
                      height: 110,
                      className: 'w-full h-full touch-none cursor-crosshair block rounded-2xl',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Received By */}
          <div
            className={cn(
              'group relative rounded-2xl border bg-gradient-to-br from-muted/40 to-muted/20 p-5 transition-all duration-300',
              'hover:shadow-lg hover:border-primary/20 hover:from-muted/50',
              'dark:from-muted/30 dark:to-muted/10 dark:hover:from-muted/40'
            )}
          >
            <div className="absolute left-0 top-5 bottom-5 w-1 rounded-full bg-primary/30 group-hover:bg-primary/50 transition-colors" aria-hidden />
            <div className="flex items-center gap-3 mb-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary shadow-sm transition-transform group-hover:scale-105">
                <User className="h-4 w-4" />
              </span>
              <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
                <h4 className="font-semibold text-sm uppercase tracking-wider text-foreground/90">Received By</h4>
                {receivedSigned && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                    <CheckCircle2 className="h-3 w-3" /> Signed
                  </span>
                )}
              </div>
            </div>
            <div className="space-y-3">
              <Label className="text-xs font-medium text-muted-foreground">Name</Label>
              <Input
                placeholder="Receiver name"
                readOnly
                variant="filled"
                className="h-11 rounded-xl"
              />
            </div>
            <div className="space-y-2 mt-4">
              <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <PenLine className="h-3.5 w-3.5" />
                Signature <span className="text-destructive/80">*</span>
              </Label>
              <div
                onFocus={() => setActivePad('received')}
                onBlur={() => setActivePad(null)}
                className="outline-none rounded-2xl"
                tabIndex={0}
              >
                <div
                  className={cn(
                    'relative rounded-2xl border-2 bg-background/80 overflow-hidden min-h-[110px] transition-all duration-300',
                    'hover:border-primary/40 hover:ring-2 hover:ring-primary/10 hover:ring-offset-2 hover:ring-offset-background',
                    activePad === 'received' && 'border-primary/60 ring-2 ring-primary/20 ring-offset-2 ring-offset-background',
                    receivedSigned && 'border-emerald-500/50 dark:border-emerald-500/40 bg-emerald-500/5',
                    !receivedSigned && 'border-dashed border-border'
                  )}
                >
                  {receivedSigned && (
                    <div className="absolute top-2 right-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </div>
                  )}
                  <SignatureCanvas
                    ref={receivedSigRef}
                    penColor="currentColor"
                    onEnd={() => setReceivedSigned(!receivedSigRef.current?.isEmpty())}
                    canvasProps={{
                      width: 280,
                      height: 110,
                      className: 'w-full h-full touch-none cursor-crosshair block rounded-2xl',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter
          className={cn(
            'px-6 py-4 rounded-b-2xl border-t bg-muted/20 backdrop-blur-sm',
            'flex-col-reverse sm:flex-row sm:justify-end gap-3'
          )}
        >
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={saving}
            className="rounded-xl flex-1 sm:flex-none min-w-[100px] transition-all hover:bg-muted/80"
          >
            Cancel
          </Button>
          <Button
            onClick={handleFinalize}
            disabled={saving || !canFinalize}
            className={cn(
              'rounded-xl flex-1 sm:flex-none min-w-[140px] transition-all',
              canFinalize && 'shadow-md hover:shadow-lg'
            )}
          >
            {saving ? (
              <span className="flex items-center justify-center gap-2">
                <Spinner size="sm" className="border-primary-foreground border-t-transparent" />
                Saving...
              </span>
            ) : (
              <>
                {canFinalize ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Finalize & Save
                  </>
                ) : (
                  'Finalize & Save'
                )}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
