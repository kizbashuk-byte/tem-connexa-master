-- Migration: Add Instagram Direct support

-- 1. Add instagram_id to customers table
ALTER TABLE customers
ADD COLUMN instagram_id VARCHAR(255) UNIQUE;

COMMENT ON COLUMN customers.instagram_id IS 'The Instagram Scoped ID (IGSID) for the customer, used for Instagram Direct integration';

-- 2. Create tenant_integrations table for OAuth connections
-- This table allows future channels to also store their OAuth tokens per-tenant.
CREATE TABLE tenant_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  channel VARCHAR(50) NOT NULL, -- e.g., 'instagram', 'telegram'
  provider_account_id VARCHAR(255) NOT NULL, -- e.g., Instagram Professional Account ID
  access_token TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(tenant_id, channel)
);

COMMENT ON TABLE tenant_integrations IS 'Stores third-party channel OAuth connections securely per tenant';

-- Enable Row Level Security (RLS)
ALTER TABLE tenant_integrations ENABLE ROW LEVEL SECURITY;

-- Allow tenant members to read/write their own integrations
CREATE POLICY "Tenant members can manage their integrations" 
  ON tenant_integrations 
  FOR ALL 
  USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid()
    )
  );
