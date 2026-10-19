export type InvoiceLine = {description:string; quantity:number; unitCents:number; taxable:boolean; source?: "MANUAL"|"JOB"|"PRODUCT"; referenceId?:string};
export const NJ_TAX_BPS = 662.5;
export function calculateInvoice(lines:InvoiceLine[], taxRate=0.06625){
 const subtotalCents=lines.reduce((s,l)=>s+Math.round(l.quantity*l.unitCents),0);
 const taxableCents=lines.filter(l=>l.taxable).reduce((s,l)=>s+Math.round(l.quantity*l.unitCents),0);
 const taxCents=Math.round(taxableCents*taxRate);
 return {subtotalCents,taxableCents,taxCents,totalCents:subtotalCents+taxCents};
}
export const money=(cents:number)=>new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}).format(cents/100);
export const mellonaSeed:InvoiceLine[]=[
 {description:"Custom logo embroidery — customer-supplied aprons",quantity:9,unitCents:5070,taxable:true,source:"MANUAL"},
 {description:"Custom logo embroidery — studio-supplied apron",quantity:1,unitCents:5070,taxable:false,source:"MANUAL"},
 {description:"One-time logo digitizing",quantity:1,unitCents:2500,taxable:false,source:"MANUAL"},
 {description:"Apron acquisition",quantity:1,unitCents:999,taxable:false,source:"MANUAL"},
];