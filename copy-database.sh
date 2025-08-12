#!/bin/bash

# Database Copy Script - Railway to Local Docker
# This script copies data from Railway production database to local Docker database

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Railway Database Configuration
RAILWAY_HOST="monorail.proxy.rlwy.net"
RAILWAY_PORT="14343"
RAILWAY_USER="root"
RAILWAY_PASS="2aBcH5AhA1Ae-6CF63Degab1BA61eB61"
RAILWAY_DB="railway"

# Local Docker Database Configuration
LOCAL_HOST="127.0.0.1"
LOCAL_PORT="3307"
LOCAL_USER="root"
LOCAL_PASS="123456"
LOCAL_DB="logoscard"

# Backup file
BACKUP_FILE="railway_backup_$(date +%Y%m%d_%H%M%S).sql"

echo -e "${GREEN}🚀 Database Copy Script${NC}"
echo -e "${YELLOW}📋 Railway → Local Docker${NC}"
echo "=================================="

# Check if mysqldump is installed
if ! command -v mysqldump &> /dev/null; then
    echo -e "${RED}❌ mysqldump is not installed. Please install MySQL client tools.${NC}"
    exit 1
fi

# Check if mysql is installed
if ! command -v mysql &> /dev/null; then
    echo -e "${RED}❌ mysql is not installed. Please install MySQL client tools.${NC}"
    exit 1
fi

# Step 1: Test Railway connection
echo -e "${YELLOW}🔍 Testing Railway database connection...${NC}"
if mysql -h"$RAILWAY_HOST" -P"$RAILWAY_PORT" -u"$RAILWAY_USER" -p"$RAILWAY_PASS" -e "SELECT 1;" "$RAILWAY_DB" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Railway database connection successful${NC}"
else
    echo -e "${RED}❌ Failed to connect to Railway database${NC}"
    exit 1
fi

# Step 2: Test local Docker connection
echo -e "${YELLOW}🔍 Testing local Docker database connection...${NC}"
if mysql -h"$LOCAL_HOST" -P"$LOCAL_PORT" -u"$LOCAL_USER" -p"$LOCAL_PASS" -e "SELECT 1;" "$LOCAL_DB" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Local Docker database connection successful${NC}"
else
    echo -e "${RED}❌ Failed to connect to local Docker database${NC}"
    echo -e "${YELLOW}💡 Make sure your Docker container is running with MySQL exposed on port 3306${NC}"
    exit 1
fi

# Step 3: Create database dump from Railway
echo -e "${YELLOW}📥 Creating database dump from Railway...${NC}"
mysqldump \
    -h"$RAILWAY_HOST" \
    -P"$RAILWAY_PORT" \
    -u"$RAILWAY_USER" \
    -p"$RAILWAY_PASS" \
    --single-transaction \
    --skip-lock-tables \
    --add-drop-table \
    --extended-insert \
    --complete-insert \
    --skip-triggers \
    --skip-routines \
    "$RAILWAY_DB" > "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Database dump created: $BACKUP_FILE${NC}"
    echo -e "${GREEN}📊 File size: $(ls -lh $BACKUP_FILE | awk '{print $5}')${NC}"
    
    # Check if dump contains actual data
    TABLE_COUNT_IN_DUMP=$(grep -c "CREATE TABLE" "$BACKUP_FILE")
    echo -e "${GREEN}📋 Tables found in dump: $TABLE_COUNT_IN_DUMP${NC}"
    
    if [ "$TABLE_COUNT_IN_DUMP" -eq 0 ]; then
        echo -e "${YELLOW}⚠️  Warning: No CREATE TABLE statements found in dump${NC}"
        echo -e "${YELLOW}📋 First 20 lines of dump file:${NC}"
        head -20 "$BACKUP_FILE"
    fi
else
    echo -e "${RED}❌ Failed to create database dump${NC}"
    exit 1
fi

# Step 4: Import dump to local Docker database
echo -e "${YELLOW}📤 Importing dump to local Docker database...${NC}"

# First, ensure the database exists
mysql -h"$LOCAL_HOST" -P"$LOCAL_PORT" -u"$LOCAL_USER" -p"$LOCAL_PASS" -e "CREATE DATABASE IF NOT EXISTS $LOCAL_DB;" 2>/dev/null

# Import the dump
mysql -h"$LOCAL_HOST" -P"$LOCAL_PORT" -u"$LOCAL_USER" -p"$LOCAL_PASS" "$LOCAL_DB" < "$BACKUP_FILE" 2>/dev/null

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Database imported successfully to local Docker${NC}"
else
    echo -e "${RED}❌ Failed to import database to local Docker${NC}"
    echo -e "${YELLOW}💡 Trying to get more details about the error...${NC}"
    
    # Try import with error output
    mysql -h"$LOCAL_HOST" -P"$LOCAL_PORT" -u"$LOCAL_USER" -p"$LOCAL_PASS" "$LOCAL_DB" < "$BACKUP_FILE"
    exit 1
fi

# Step 5: Verify import
echo -e "${YELLOW}🔍 Verifying import...${NC}"
TABLE_COUNT=$(mysql -h"$LOCAL_HOST" -P"$LOCAL_PORT" -u"$LOCAL_USER" -p"$LOCAL_PASS" -e "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='$LOCAL_DB';" -s -N "$LOCAL_DB")

if [ "$TABLE_COUNT" -gt 0 ]; then
    echo -e "${GREEN}✅ Import verified: $TABLE_COUNT tables found${NC}"
else
    echo -e "${RED}❌ Import verification failed: No tables found${NC}"
    exit 1
fi

# Step 6: Cleanup
echo -e "${YELLOW}🧹 Cleaning up...${NC}"
read -p "Do you want to keep the backup file ($BACKUP_FILE)? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    rm "$BACKUP_FILE"
    echo -e "${GREEN}✅ Backup file removed${NC}"
else
    echo -e "${GREEN}✅ Backup file kept: $BACKUP_FILE${NC}"
fi

echo "=================================="
echo -e "${GREEN}🎉 Database copy completed successfully!${NC}"
echo -e "${GREEN}📋 Railway database has been copied to local Docker${NC}"
echo -e "${YELLOW}💡 Your local database is now ready for development${NC}" 