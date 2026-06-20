-- Migration to add Facebook Messenger Page-Scoped ID (PSID) to customers

ALTER TABLE customers
ADD COLUMN messenger_psid VARCHAR(255) UNIQUE;

-- Add a comment to the column for future reference
COMMENT ON COLUMN customers.messenger_psid IS 'The Facebook Page-Scoped ID (PSID) for the customer, used for Messenger integration';
