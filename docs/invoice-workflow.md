# Invoice workflow — Fine Ligne Studio / StitchOS

## Design and data
- Figma invoice source of truth: https://www.figma.com/design/SXxqYyR1uL15rdbPxTrPXM?node-id=3-8
- Figma Mellona Henry example: https://www.figma.com/design/SXxqYyR1uL15rdbPxTrPXM?node-id=18-58
- Invoice data is stored in StitchOS PostgreSQL/Prisma by organization; Figma is **not** queried for each generated PDF.
- The PDF is rendered with the installed @react-pdf/renderer library, not AI. The layout can be refined in code to stay consistent with Figma.
- New invoice: /invoices/new; populate manual lines, import a production job's product/quantity lines (prices default to $0 pending manual pricing), select CRM client, change taxability by line.
- Download PDF from /invoices after saving; no AI credits used.

## Example (not auto-billed)
Open /invoices/new?example=mellona, review taxability and save when ready. $507.00 embroidery + $25 digitizing + $9.99 studio-acquired apron = $541.99 subtotal. An example 6.625% applied only to 9 customer-supplied apron embroidery charges ($456.30) gives $30.23 tax and $572.22 total.

**Accounting caution:** tax classification of digitizing, supplied-apron charges, and purchased-apron reimbursement must be confirmed with NJ tax guidance/accountant. Review before sending. No automatic charge or customer contact occurs in this feature.

## Before deploy
- Review tax rules and classifications; current implementation uses an explicit per-line taxable checkbox, not automatic classification.
- Apply Prisma migration and regenerate Prisma client (existing Vercel build command handles both).
- Run typecheck and smoke tests with the actual database; ensure organization-isolation and PDF rendering.
- Confirm the design matches the Figma master (PDF is code-generated, not exported directly from Figma).
- Ensure number uniqueness and editing restrictions meet financial record retention policies.
