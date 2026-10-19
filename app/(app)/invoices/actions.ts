"use server";
import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { calculateInvoice, type InvoiceLine } from "@/lib/invoices";

export async function saveInvoice(input:{id?:string;number:string;customerName:string;customerEmail?:string;clientId?:string;jobId?:string;notes?:string;lines:InvoiceLine[]}){
 const session=await requireSession();
 if(!["ADMIN","DESIGNER"].includes(session.user.role)) throw new Error("Not authorized");
 if(!input.customerName.trim()||!input.number.trim()||!input.lines.length)throw new Error("Missing invoice fields");
 if(input.lines.some(l=>!l.description.trim()||!Number.isSafeInteger(l.unitCents)||l.unitCents<0||!Number.isFinite(l.quantity)||l.quantity<=0))throw new Error("Invalid line");
 const organizationId=session.user.organizationId;
 if(input.clientId){const client=await prisma.client.findFirst({where:{id:input.clientId,organizationId}});if(!client)throw new Error("Unknown customer");}
 if(input.jobId){const job=await prisma.job.findFirst({where:{id:input.jobId,organizationId}});if(!job)throw new Error("Unknown job");}
 const totals=calculateInvoice(input.lines);
 const data={number:input.number.trim(),customerName:input.customerName.trim(),customerEmail:input.customerEmail||null,clientId:input.clientId||null,jobId:input.jobId||null,notes:input.notes||null,lines:JSON.parse(JSON.stringify(input.lines)),taxRateBps:6625,...totals};
 if(input.id){
 const count=await prisma.invoice.updateMany({where:{id:input.id,organizationId,status:"DRAFT"},data});
 if(!count.count)throw new Error("Draft not found");revalidatePath("/invoices");return input.id;
 }
 const created=await prisma.invoice.create({data:{...data,organizationId}});
 revalidatePath("/invoices");return created.id;
}
export async function setInvoiceStatus(id:string,status:"DRAFT"|"SENT"|"PAID"|"VOID"){
 const session=await requireSession();if(!["ADMIN","DESIGNER"].includes(session.user.role))throw new Error("Not authorized");
 const result=await prisma.invoice.updateMany({where:{id,organizationId:session.user.organizationId},data:{status}});if(!result.count)throw new Error("Invoice not found");
 revalidatePath("/invoices");
}