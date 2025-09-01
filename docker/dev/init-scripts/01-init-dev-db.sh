#!/bin/bash
set -e

# Create additional databases for testing if needed
psql -v ON_ERROR_STOP=1 --username \"$POSTGRES_USER\" --dbname \"$POSTGRES_DB\" <<-EOSQL
    -- Create test database
    CREATE DATABASE titan_pomade_test;
    
    -- Grant privileges
    GRANT ALL PRIVILEGES ON DATABASE titan_pomade_test TO $POSTGRES_USER;
    
    -- Create development extensions if needed
    CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";
    CREATE EXTENSION IF NOT EXISTS \"pg_trgm\";
    CREATE EXTENSION IF NOT EXISTS \"btree_gin\";
EOSQL

echo \"Development database setup completed\"