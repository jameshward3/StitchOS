CREATE TABLE "Invoice" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "clientId" TEXT,
  "jobId" TEXT,
  "number" TEXT NOT NULL,
  "customerName" TEXT NOT NULL,
  "customerEmail" TEXT,
  "status" TEXT NOT NULL DEFAULT 'DRAFT',
  "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "dueAt" TIMESTAMP(3),
  "notes" TEXT,
  "lines" JSONB NOT NULL,
  "taxRateBps" INTEGER NOT NULL DEFAULT 6625,
  "subtotalCents" INTEGER NOT NULL,
  "taxableCents" INTEGER NOT NULL,
  "taxCents" INTEGER NOT NULL,
  "totalCents" INTEGER NOT NULL,
  "paidCents" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Invoice_organizationId_number_key" ON "Invoice"("organizationId","number");
CREATE INDEX "Invoice_organizationId_issuedAt_idx" ON "Invoice"("organizationId","issuedAt");
