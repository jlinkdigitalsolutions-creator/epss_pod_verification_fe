import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TopNav } from '@/components/layout/TopNav';
import { AnimatedBackground } from '@/components/layout/AnimatedBackground';
import { PageHeader } from '@/components/layout/PageHeader';
import { Spinner } from '@/components/ui/spinner';
import { FileText, Building2 } from 'lucide-react';

export function SelectionPage({
  facilities,
  availableInvoices,
  selectedFacility,
  onSelectFacility,
  onSelectInvoice,
  user,
  onLogout,
}) {
  const [loadingInvoice, setLoadingInvoice] = useState(false);

  const handleSelectInvoice = async (val) => {
    setLoadingInvoice(true);
    try {
      await new Promise((r) => setTimeout(r, 400));
      const inv = availableInvoices.find((i) => i.invoiceNo === val);
      onSelectInvoice(inv);
    } finally {
      setLoadingInvoice(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <AnimatedBackground />
      <TopNav user={user} onLogout={onLogout} title="Select invoice" />

      <main id="main-content" className="flex-1 p-4 md:p-6 lg:p-8" role="main">
        <div className="max-w-2xl mx-auto space-y-6">
          <PageHeader
            title="Inventory"
            description="Choose a facility and invoice to open the receiving voucher."
          />

          <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/20 border-2 rounded-2xl group">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-sm transition-transform duration-200 group-hover:scale-105">
                  <FileText className="h-5 w-5" />
                </span>
                <span>Select invoice</span>
              </CardTitle>
              <CardDescription>Receiving facility and invoice number</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2 text-foreground">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  Receiving facility
                </label>
                <Select value={selectedFacility || ''} onValueChange={onSelectFacility}>
                  <SelectTrigger leftIcon={<Building2 className="h-4 w-4" />} className="h-12 rounded-xl border-2 hover:border-primary/30 transition-colors">
                    <SelectValue placeholder="Select facility" />
                  </SelectTrigger>
                  <SelectContent sideOffset={4} className="rounded-xl">
                    {facilities.map((f) => (
                      <SelectItem key={f} value={f} className="rounded-lg focus:bg-primary/10">
                        {f}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedFacility && (
                <div className="space-y-2 animate-fade-in">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    Invoice number
                  </label>
                  <Select onValueChange={handleSelectInvoice} disabled={loadingInvoice}>
                    <SelectTrigger leftIcon={<FileText className="h-4 w-4" />} className="h-12 rounded-xl border-2 hover:border-primary/30 transition-colors">
                      <SelectValue placeholder="Select invoice" />
                    </SelectTrigger>
                    <SelectContent sideOffset={4} className="rounded-xl">
                      {availableInvoices.map((inv) => (
                        <SelectItem key={inv.invoiceNo} value={inv.invoiceNo} className="rounded-lg focus:bg-primary/10">
                          {inv.invoiceNo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {loadingInvoice && (
                    <p className="flex items-center gap-2 text-sm text-muted-foreground pt-1">
                      <Spinner size="sm" />
                      Opening voucher...
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
