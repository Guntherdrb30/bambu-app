-- bambu-backend/db/schema.sql
CREATE TABLE leads_bambu (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    name VARCHAR(255),
    phone VARCHAR(50),
    email VARCHAR(255),
    city VARCHAR(100),
    notes TEXT,
    source VARCHAR(50),
    ip_address VARCHAR(45),
    user_agent TEXT,
    qty_122x300 INT DEFAULT 0,
    qty_60x300 INT DEFAULT 0,
    qty_40x300 INT DEFAULT 0,
    CONSTRAINT chk_contact CHECK (phone IS NOT NULL OR email IS NOT NULL)
);