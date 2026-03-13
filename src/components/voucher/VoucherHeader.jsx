import React from 'react';
import { Input } from '@/components/ui/input';
import { getRegionInfo } from '@/constants/regions';
import { FileText } from 'lucide-react';

export function VoucherHeader({ invoice, regionInfo, userInfo }) {
  const info = regionInfo || getRegionInfo(invoice?.regionCode);

  if (!invoice) return null;

  return (
    <header className="text-center border-b border-border pb-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm font-semibold leading-tight text-muted-foreground">
          ሞዴል 19/ጤና <br /> Model 19/Health
        </span>
        <div className="flex items-center gap-2">
          <label htmlFor="serialNo" className="text-sm font-medium text-foreground">
            Seri. No:
          </label>
          <Input
            id="serialNo"
            type="number"
            placeholder="000000"
            min={100000}
            max={999999}
            className="w-28 h-12 text-center font-mono rounded-xl"
          />
        </div>
      </div>
      <div className="space-y-2">
        <h2 className="text-base font-semibold text-foreground leading-snug">
          {info?.amharic} <br />
          {info?.english}
          <br />
          <span className="text-muted-foreground font-normal text-sm">
            የመድኃኒትና የህክምና መገልገያዎች ገቢ ደረሰኝ
            <br />
            Receiving Voucher for Drugs, Reagents, Medical Supplies and Equipment
          </span>
        </h2>
      </div>
      <div className="flex items-center justify-center gap-2 mt-4">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <FileText className="h-4 w-4" />
        </span>
        <h3 className="text-lg font-semibold">Receiving Voucher</h3>
      </div>
      <div className="mt-5 text-left space-y-3 text-sm rounded-xl bg-muted/30 border border-border p-4 transition-colors duration-200 hover:bg-muted/40">
        <p className="amharic-declaration leading-relaxed">
          እኔ <strong>{userInfo?.formattedName || "________________"}</strong> በቀን <strong>{ new Date().toISOString().split('T')[0] }</strong> ከ{' '}
          <strong>{invoice.sender}</strong> ለ <strong>{invoice.receivingFacility}</strong> የተላከውን ከታች የተዘረዘረውን ዕቃ በትክክል ቆጥሬ መረከቤን አረጋግጣለሁ::
        </p>
        <p className=" leading-relaxed">
          I, <strong>{userInfo?.formattedName || "________________"}</strong>, on <strong>{ new Date().toISOString().split('T')[0] }</strong>, hereby certify that I have
          counted correctly and received items enumerated below for <strong>{invoice.receivingFacility}</strong> from{' '}
          <strong>{invoice.sender}</strong> (Invoice No: {invoice.invoiceNo}).
        </p>
      </div>
    </header>
  );
}
