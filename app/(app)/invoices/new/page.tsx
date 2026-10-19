import {requireSession} from "@/lib/current-user";
import {prisma} from "@/lib/prisma";
import {InvoiceEditor} from "@/components/invoices/editor";
import {mellonaSeed} from "@/lib/invoices";
export default async function NewInvoice({searchParams}:{searchParams:Promise<{id?:string;example?:string}>}){
 const s=await requireSession();const q=await searchParams;
 const [clients,jobs,invoice]=await Promise.all([
 prisma.client.findMany({where:{organizationId:s.user.organizationId},select:{id:true,name:true},orderBy:{name:"asc"}}),
 prisma.job.findMany({where:{organizationId:s.user.organizationId},include:{client:true,items:{include:{product:true}}},orderBy:{createdAt:"desc"},take:50}),
 q.id?prisma.invoice.findFirst({where:{id:q.id,organizationId:s.user.organizationId}}):null
 ]);
 return <InvoiceEditor clients={clients} jobs={jobs.map(j=>({id:j.id,label:`Job ${j.jobNumber} — ${j.client?.name??""}`,items:j.items.map(i=>({description:i.product.name,quantity:i.quantity,unitCents:0,taxable:true as boolean,source:"JOB" as const,referenceId:j.id}))}))} initial={invoice?{id:invoice.id,number:invoice.number,customerName:invoice.customerName,customerEmail:invoice.customerEmail??"",clientId:invoice.clientId??"",jobId:invoice.jobId??"",notes:invoice.notes??"",lines:invoice.lines as unknown as typeof mellonaSeed}:q.example==="mellona"?{number:"FL-26002",customerName:"Mellona Henry",customerEmail:"",clientId:"",jobId:"",notes:"Nine customer-supplied aprons; digitizing taxability requires review.",lines:mellonaSeed}:undefined}/>;
}