-- Create database only if it doesn't exist
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'Petadopt')
BEGIN
    PRINT 'Creating database [Petadopt]...';
    CREATE DATABASE [Petadopt];
END
ELSE
BEGIN
    PRINT 'Database [Petadopt] already exists.';
END
GO