#!/bin/sh
set -eu

DB_HOST="${DB_HOST:-sqlserver}"
DB_NAME="${DB_NAME:-Petadopt}"
DB_USER="${DB_USER:-sa}"
DB_PASS="${DB_PASS:-YourStrong@Passw0rd}"

echo "⏳ Waiting for SQL Server to accept connections on $DB_HOST:1433 ..."
# First: wait for server to respond
until /opt/mssql-tools18/bin/sqlcmd -S "$DB_HOST" -U "$DB_USER" -P "$DB_PASS" -Q "SELECT 1" -l 1 -C >/dev/null 2>&1; do
  sleep 2
done
echo "✅ SQL Server is responding."

echo "⏳ Waiting for database '$DB_NAME' to exist..."
# Then: wait until specific DB exists
until /opt/mssql-tools18/bin/sqlcmd -S "$DB_HOST" -U "$DB_USER" -P "$DB_PASS" -d master -h -1 -W -Q "
  IF EXISTS (SELECT 1 FROM sys.databases WHERE name = '$DB_NAME') SELECT 1 ELSE SELECT 0
" -C 2>/dev/null | grep -q "^1$"; do
  sleep 2
done
echo "✅ Database '$DB_NAME' is present."

echo "🚀 Starting Spring Boot..."
exec java -jar app.jar
