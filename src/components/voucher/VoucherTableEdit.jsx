import React, { useState } from 'react';
import { cn } from '@/lib/utils';

const TH = ({ children, className, ...props }) => (
  <th
    className={cn(
      'border-b border-border px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground bg-muted/30',
      className
    )}
    {...props}
  >
    {children}
  </th>
);

const TD = ({ children, className, ...props }) => (
  <td className={cn('border-b border-border px-3 py-3 text-sm text-foreground', className)} {...props}>
    {children}
  </td>
);

export function VoucherTableEdit({ data, onUpdate }) {

  // Use a local state for the table items to keep typing snappy
  const [invoice, setInvoice] = useState(data);

  const handleQtyChange = (itemId, newQty) => {
    const numericQty = Number(newQty);
    
    const updatedInvoice = {
      ...invoice,
      items: invoice.items.map(item => 
        item.id === itemId 
          ? { 
              ...item, 
              receivedQty: numericQty,
              totalCost: numericQty * item.unitCost 
            } 
          : item
      )
    };

    setInvoice(updatedInvoice); // Update local view
    onUpdate(updatedInvoice);    // Send to Parent so Parent's "Save" button works
  };

  if (!invoice?.items?.length) {
    return (
      <div className="rounded-xl border border-border bg-muted/20 py-12 text-center text-sm text-muted-foreground">
        No items in this voucher.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card animate-fade-in shadow-sm">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            <TH className="text-center w-12">
              <span className="block text-[10px] font-normal text-muted-foreground/80">ተራ ቁጥር</span>
              S/N
            </TH>
            <TH className="min-w-[90px]">
              <span className="block text-[10px] font-normal text-muted-foreground/80">የውስጥ ኮድ</span>
              Internal Code
            </TH>
            <TH className="min-w-[140px]">
              <span className="block text-[10px] font-normal text-muted-foreground/80">የዕቃው ዝርዝር</span>
              Description
            </TH>
            <TH className="text-center min-w-[60px]">
              <span className="block text-[10px] font-normal text-muted-foreground/80">መለኪያ</span>
              Unit
            </TH>
            <TH className="text-center min-w-[50px]">
              <span className="block text-[10px] font-normal text-muted-foreground/80"></span>
              Invoiced
            </TH>
            <TH className="text-center min-w-[50px]">
              <span className="block text-[10px] font-normal text-muted-foreground/80"></span>
              Received
            </TH>
            <TH className="text-center min-w-[50px]">
              <span className="block text-[10px] font-normal text-muted-foreground/80"></span>
              NOT Received
            </TH>
            <TH className="text-right min-w-[80px]">
              <span className="block text-[10px] font-normal text-muted-foreground/80">የአንዱ ዋጋ</span>
              Unit Cost
            </TH>
            <TH className="text-right min-w-[80px]">
              <span className="block text-[10px] font-normal text-muted-foreground/80">ጠቅላላ ዋጋ</span>
              Total
            </TH>
            <TH className="min-w-[70px]">
              <span className="block text-[10px] font-normal text-muted-foreground/80">ባች</span>
              Batch
            </TH>
            <TH className="min-w-[80px]">
              <span className="block text-[10px] font-normal text-muted-foreground/80">ማለቂያ ቀን</span>
              Expiry
            </TH>
            <TH className="min-w-[80px]">
              <span className="block text-[10px] font-normal text-muted-foreground/80">ማስታወሻ</span>
              Remark
            </TH>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item, i) => (
            <tr
              key={item.id ?? i}
              className="border-b border-border transition-colors duration-150 hover:bg-muted/30 active:bg-muted/40"
            >
              <TD className="text-center">{i + 1}</TD>
              <TD>{item.internalCode}</TD>
              <TD>{item.description}</TD>
              <TD className="text-center">{item.unit}</TD>
              <TD className="text-center">{item.invoicedQty}</TD>
              <TD className="p-2 border-b">
                <input
                  type="number"
                  className="w-20 px-2 py-1 text-center border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={item.receivedQty}
                  onChange={(e) => handleQtyChange(item.id, e.target.value)}
                />
              </TD>
              <TD className="text-center">{item.invoicedQty - item.receivedQty}</TD>
              <TD className="text-right">{item.unitCost}</TD>
              <TD className="text-right font-semibold">{item.totalCost}</TD>
              <TD>{item.batch}</TD>
              <TD>{item.expiry}</TD>
              <TD>{item.remark}</TD>
            </tr>
          ))}
          <tr className="bg-muted/30 border-border font-medium">
            <TD colSpan={8} className="text-right py-3 border-r border-border">
              <span className="text-muted-foreground font-normal text-xs">ጠቅላላ ዋጋ / </span>Sum Total
            </TD>
            <TD colSpan={1} className="text-right py-3 ">
              {invoice.items.reduce((acc, item) => acc + item.totalCost, 0)}
            </TD>
            <TD colSpan={3}></TD>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
