import {NextRequest,NextResponse} from "next/server";
import {renderToBuffer} from "@react-pdf/renderer";
import {auth} from "@/auth";
import {prisma} from "@/lib/prisma";
import {InvoicePDF} from "@/components/invoices/pdf";
export const runtime="nodejs";
export async function GET(_req:NextRequest,{params}:{params:Promise<{id:string}>}){
 const session=await auth();if(!session?.user)return new NextResponse("Unauthorized",{status:401});
 const {id}=await params;
 const invoice=await prisma.invoice.findFirst({where:{id,organizationId:session.user.organizationId}});
 if(!invoice)return new NextResponse("Not found",{status:404});
 const pdf=await renderToBuffer(<InvoicePDF invoice={invoice}/>);
 return new NextResponse(new Uint8Array(pdf),{headers:{"Content-Type":"application/pdf","Content-Disposition":`attachment; filename="Fine-Ligne-${invoice.number.replace(/[^a-zA-Z0-9-]/g,"")}.pdf"`,"Cache-Control":"private, no-store"}});
}