import Link from "next/link";
import {requireSession} from "@/lib/current-user";
import {prisma} from "@/lib/prisma";
import {money} from "@/lib/invoices";
export default async function InvoicesPage(){
 const s=await requireSession();
 const invoices=await prisma.invoice.findMany({where:{organizationId:s.user.organizationId},orderBy:{issuedAt:"desc"},take:100});
 return <section className="space-y-5 max-w-6xl"><div className="flex items-center justify-between"><div><h1 className="text-2xl font-semibold">Invoices</h1><p className="text-sm text-ink-muted">Reusable, itemized studio billing and code-generated PDFs</p></div><Link href="/invoices/new" className="rounded bg-accent text-black px-4 py-2">New invoice</Link></div><div className="rounded-lg border border-border overflow-hidden"><table className="w-full text-sm"><thead><tr className="bg-surface-raised text-left"><th className="p-3">Number</th><th className="p-3">Customer</th><th className="p-3">Status</th><th className="p-3">Total</th><th className="p-3">PDF</th></tr></thead><tbody>{invoices.map(i=><tr key={i.id} className="border-t border-border"><td className="p-3"><Link href={`/invoices/new?id=${i.id}`} className="underline">{i.number}</Link></td><td className="p-3">{i.customerName}</td><td className="p-3">{i.status}</td><td className="p-3">{money(i.totalCents)}</td><td className="p-3"><a className="underline" href={`/api/invoices/${i.id}/pdf`}>Download</a></td></tr>)}</tbody></table>{!invoices.length&&<p className="p-8 text-center">No invoices yet. Create one to begin.</p>}</div></section>;
}