import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Database, Download, Copy, Check } from "lucide-react";
import { motion } from "framer-motion";

export default function DatabaseScriptPage() {
  const [copied, setCopied] = useState(false);

  const sqlScript = `-- Azure SQL Database Schema for PalletSlot Application
-- Generated based on entity definitions
-- Run this script on Azure SQL Database

-- Enable necessary features
SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;

-- Create Companies table
CREATE TABLE [dbo].[Company] (
    [id] UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    [created_date] DATETIME2 DEFAULT GETUTCDATE(),
    [updated_date] DATETIME2 DEFAULT GETUTCDATE(),
    [created_by] NVARCHAR(255) NULL,
    [name] NVARCHAR(255) NOT NULL,
    [code] NVARCHAR(50) NOT NULL UNIQUE,
    [contact_email] NVARCHAR(255) NULL,
    [phone] NVARCHAR(50) NULL,
    [address] NVARCHAR(MAX) NULL,
    [min_booking_time] INT DEFAULT 15 CHECK ([min_booking_time] >= 5 AND [min_booking_time] <= 120),
    [pallet_time_tiers] NVARCHAR(MAX) NULL, -- JSON array
    [is_active] BIT DEFAULT 1
);

-- Create Warehouses table
CREATE TABLE [dbo].[Warehouse] (
    [id] UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    [created_date] DATETIME2 DEFAULT GETUTCDATE(),
    [updated_date] DATETIME2 DEFAULT GETUTCDATE(),
    [created_by] NVARCHAR(255) NULL,
    [name] NVARCHAR(255) NOT NULL,
    [code] NVARCHAR(50) NOT NULL,
    [company_id] UNIQUEIDENTIFIER NOT NULL,
    [company_name] NVARCHAR(255) NOT NULL,
    [address] NVARCHAR(MAX) NULL,
    [contact_email] NVARCHAR(255) NULL,
    [contact_phone] NVARCHAR(50) NULL,
    [operating_hours_start] INT DEFAULT 7 CHECK ([operating_hours_start] >= 0 AND [operating_hours_start] <= 23),
    [operating_hours_end] INT DEFAULT 17 CHECK ([operating_hours_end] >= 0 AND [operating_hours_end] <= 24),
    [is_active] BIT DEFAULT 1,
    FOREIGN KEY ([company_id]) REFERENCES [dbo].[Company]([id]) ON DELETE CASCADE
);

-- Create Carriers table
CREATE TABLE [dbo].[Carrier] (
    [id] UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    [created_date] DATETIME2 DEFAULT GETUTCDATE(),
    [updated_date] DATETIME2 DEFAULT GETUTCDATE(),
    [created_by] NVARCHAR(255) NULL,
    [name] NVARCHAR(255) NOT NULL,
    [address] NVARCHAR(MAX) NULL,
    [email] NVARCHAR(255) NULL,
    [phone_number] NVARCHAR(50) NULL,
    [is_active] BIT DEFAULT 1
);

-- Create VehicleTypes table
CREATE TABLE [dbo].[VehicleType] (
    [id] UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    [created_date] DATETIME2 DEFAULT GETUTCDATE(),
    [updated_date] DATETIME2 DEFAULT GETUTCDATE(),
    [created_by] NVARCHAR(255) NULL,
    [name] NVARCHAR(255) NOT NULL,
    [code] NVARCHAR(50) NOT NULL,
    [description] NVARCHAR(MAX) NULL,
    [max_pallets] INT NOT NULL CHECK ([max_pallets] >= 1 AND [max_pallets] <= 60),
    [company_id] UNIQUEIDENTIFIER NOT NULL,
    [company_name] NVARCHAR(255) NOT NULL,
    [warehouse_id] UNIQUEIDENTIFIER NULL,
    [warehouse_name] NVARCHAR(255) NULL,
    [use_custom_time_calculation] BIT DEFAULT 0,
    [min_booking_time] INT NULL CHECK ([min_booking_time] >= 5 AND [min_booking_time] <= 120),
    [pallet_time_tiers] NVARCHAR(MAX) NULL, -- JSON array
    [is_active] BIT DEFAULT 1,
    FOREIGN KEY ([company_id]) REFERENCES [dbo].[Company]([id]) ON DELETE CASCADE,
    FOREIGN KEY ([warehouse_id]) REFERENCES [dbo].[Warehouse]([id]) ON DELETE SET NULL
);

-- Create Docks table
CREATE TABLE [dbo].[Dock] (
    [id] UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    [created_date] DATETIME2 DEFAULT GETUTCDATE(),
    [updated_date] DATETIME2 DEFAULT GETUTCDATE(),
    [created_by] NVARCHAR(255) NULL,
    [name] NVARCHAR(255) NOT NULL,
    [company_id] UNIQUEIDENTIFIER NOT NULL,
    [company_name] NVARCHAR(255) NOT NULL,
    [warehouse_id] UNIQUEIDENTIFIER NOT NULL,
    [warehouse_name] NVARCHAR(255) NOT NULL,
    [start_hour] INT NOT NULL CHECK ([start_hour] >= 0 AND [start_hour] <= 23),
    [end_hour] INT NOT NULL CHECK ([end_hour] >= 0 AND [end_hour] <= 24),
    [movement_type] NVARCHAR(10) DEFAULT 'Both' CHECK ([movement_type] IN ('Inwards', 'Outwards', 'Both')),
    [vehicle_type_ids] NVARCHAR(MAX) NULL, -- JSON array
    [vehicle_type_names] NVARCHAR(MAX) NULL, -- JSON array
    [image_url] NVARCHAR(MAX) NULL,
    [additional_info] NVARCHAR(500) NULL,
    [is_active] BIT DEFAULT 1,
    FOREIGN KEY ([company_id]) REFERENCES [dbo].[Company]([id]) ON DELETE CASCADE,
    FOREIGN KEY ([warehouse_id]) REFERENCES [dbo].[Warehouse]([id]) ON DELETE CASCADE
);

-- Create Users table (extends base44 User entity)
CREATE TABLE [dbo].[User] (
    [id] UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    [created_date] DATETIME2 DEFAULT GETUTCDATE(),
    [updated_date] DATETIME2 DEFAULT GETUTCDATE(),
    [created_by] NVARCHAR(255) NULL,
    [full_name] NVARCHAR(255) NOT NULL,
    [email] NVARCHAR(255) NOT NULL UNIQUE,
    [role] NVARCHAR(50) DEFAULT 'user' CHECK ([role] IN ('admin', 'user', 'company_admin')),
    [department] NVARCHAR(255) NOT NULL,
    [phone] NVARCHAR(50) NOT NULL,
    [is_active] BIT DEFAULT 1,
    [last_login] DATETIME2 NOT NULL,
    [company_id] UNIQUEIDENTIFIER NULL,
    [company_name] NVARCHAR(255) NULL,
    [warehouse_ids] NVARCHAR(MAX) NULL, -- JSON array
    [warehouse_names] NVARCHAR(MAX) NULL, -- JSON array
    [api_key] NVARCHAR(255) NULL,
    FOREIGN KEY ([company_id]) REFERENCES [dbo].[Company]([id]) ON DELETE SET NULL
);

-- Create Bookings table
CREATE TABLE [dbo].[Booking] (
    [id] UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    [created_date] DATETIME2 DEFAULT GETUTCDATE(),
    [updated_date] DATETIME2 DEFAULT GETUTCDATE(),
    [created_by] NVARCHAR(255) NULL,
    [company_id] UNIQUEIDENTIFIER NOT NULL,
    [company_name] NVARCHAR(255) NOT NULL,
    [warehouse_id] UNIQUEIDENTIFIER NOT NULL,
    [warehouse_name] NVARCHAR(255) NOT NULL,
    [carrier_id] UNIQUEIDENTIFIER NOT NULL,
    [carrier_name] NVARCHAR(255) NOT NULL,
    [sender_name] NVARCHAR(255) NOT NULL,
    [reference_number] NVARCHAR(255) NOT NULL,
    [pallet_count] INT NOT NULL CHECK ([pallet_count] >= 1 AND [pallet_count] <= 60),
    [vehicle_type_id] UNIQUEIDENTIFIER NOT NULL,
    [vehicle_type_name] NVARCHAR(255) NOT NULL,
    [booking_date] DATE NOT NULL,
    [movement_type] NVARCHAR(10) NOT NULL CHECK ([movement_type] IN ('Inwards', 'Outwards')),
    [start_time] TIME NOT NULL,
    [end_time] TIME NOT NULL,
    [duration_minutes] INT NOT NULL,
    [status] NVARCHAR(20) DEFAULT 'confirmed' CHECK ([status] IN ('confirmed', 'cancelled', 'completed', 'provisional')),
    [dock_id] UNIQUEIDENTIFIER NOT NULL,
    [dock_name] NVARCHAR(255) NOT NULL,
    [dock_image_url] NVARCHAR(MAX) NULL,
    [dock_additional_info] NVARCHAR(MAX) NULL,
    [confirmation_id] NVARCHAR(255) NULL,
    FOREIGN KEY ([company_id]) REFERENCES [dbo].[Company]([id]) ON DELETE CASCADE,
    FOREIGN KEY ([warehouse_id]) REFERENCES [dbo].[Warehouse]([id]) ON DELETE CASCADE,
    FOREIGN KEY ([carrier_id]) REFERENCES [dbo].[Carrier]([id]) ON DELETE CASCADE,
    FOREIGN KEY ([vehicle_type_id]) REFERENCES [dbo].[VehicleType]([id]) ON DELETE CASCADE,
    FOREIGN KEY ([dock_id]) REFERENCES [dbo].[Dock]([id]) ON DELETE CASCADE
);

-- Create Arrivals table
CREATE TABLE [dbo].[Arrival] (
    [id] UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    [created_date] DATETIME2 DEFAULT GETUTCDATE(),
    [updated_date] DATETIME2 DEFAULT GETUTCDATE(),
    [created_by] NVARCHAR(255) NULL,
    [booking_id] UNIQUEIDENTIFIER NOT NULL,
    [driver_name] NVARCHAR(255) NOT NULL,
    [vehicle_registration] NVARCHAR(50) NOT NULL,
    [arrival_time] DATETIME2 NOT NULL,
    [status] NVARCHAR(20) DEFAULT 'arrived' CHECK ([status] IN ('arrived', 'departed')),
    [notes] NVARCHAR(MAX) NULL,
    FOREIGN KEY ([booking_id]) REFERENCES [dbo].[Booking]([id]) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX [IX_Company_Code] ON [dbo].[Company]([code]);
CREATE INDEX [IX_Company_IsActive] ON [dbo].[Company]([is_active]);

CREATE INDEX [IX_Warehouse_CompanyId] ON [dbo].[Warehouse]([company_id]);
CREATE INDEX [IX_Warehouse_Code] ON [dbo].[Warehouse]([company_id], [code]);
CREATE INDEX [IX_Warehouse_IsActive] ON [dbo].[Warehouse]([is_active]);

CREATE INDEX [IX_Carrier_Name] ON [dbo].[Carrier]([name]);
CREATE INDEX [IX_Carrier_IsActive] ON [dbo].[Carrier]([is_active]);

CREATE INDEX [IX_VehicleType_CompanyId] ON [dbo].[VehicleType]([company_id]);
CREATE INDEX [IX_VehicleType_WarehouseId] ON [dbo].[VehicleType]([warehouse_id]);
CREATE INDEX [IX_VehicleType_IsActive] ON [dbo].[VehicleType]([is_active]);

CREATE INDEX [IX_Dock_CompanyId] ON [dbo].[Dock]([company_id]);
CREATE INDEX [IX_Dock_WarehouseId] ON [dbo].[Dock]([warehouse_id]);
CREATE INDEX [IX_Dock_IsActive] ON [dbo].[Dock]([is_active]);

CREATE INDEX [IX_User_Email] ON [dbo].[User]([email]);
CREATE INDEX [IX_User_CompanyId] ON [dbo].[User]([company_id]);
CREATE INDEX [IX_User_IsActive] ON [dbo].[User]([is_active]);

CREATE INDEX [IX_Booking_CompanyId] ON [dbo].[Booking]([company_id]);
CREATE INDEX [IX_Booking_WarehouseId] ON [dbo].[Booking]([warehouse_id]);
CREATE INDEX [IX_Booking_BookingDate] ON [dbo].[Booking]([booking_date]);
CREATE INDEX [IX_Booking_ReferenceNumber] ON [dbo].[Booking]([reference_number]);
CREATE INDEX [IX_Booking_Status] ON [dbo].[Booking]([status]);
CREATE INDEX [IX_Booking_DockId] ON [dbo].[Booking]([dock_id]);

CREATE INDEX [IX_Arrival_BookingId] ON [dbo].[Arrival]([booking_id]);
CREATE INDEX [IX_Arrival_ArrivalTime] ON [dbo].[Arrival]([arrival_time]);

-- Create triggers to automatically update updated_date
CREATE TRIGGER [tr_Company_UpdatedDate] ON [dbo].[Company]
AFTER UPDATE AS
BEGIN
    UPDATE [dbo].[Company] 
    SET [updated_date] = GETUTCDATE() 
    WHERE [id] IN (SELECT [id] FROM inserted);
END;

CREATE TRIGGER [tr_Warehouse_UpdatedDate] ON [dbo].[Warehouse]
AFTER UPDATE AS
BEGIN
    UPDATE [dbo].[Warehouse] 
    SET [updated_date] = GETUTCDATE() 
    WHERE [id] IN (SELECT [id] FROM inserted);
END;

CREATE TRIGGER [tr_Carrier_UpdatedDate] ON [dbo].[Carrier]
AFTER UPDATE AS
BEGIN
    UPDATE [dbo].[Carrier] 
    SET [updated_date] = GETUTCDATE() 
    WHERE [id] IN (SELECT [id] FROM inserted);
END;

CREATE TRIGGER [tr_VehicleType_UpdatedDate] ON [dbo].[VehicleType]
AFTER UPDATE AS
BEGIN
    UPDATE [dbo].[VehicleType] 
    SET [updated_date] = GETUTCDATE() 
    WHERE [id] IN (SELECT [id] FROM inserted);
END;

CREATE TRIGGER [tr_Dock_UpdatedDate] ON [dbo].[Dock]
AFTER UPDATE AS
BEGIN
    UPDATE [dbo].[Dock] 
    SET [updated_date] = GETUTCDATE() 
    WHERE [id] IN (SELECT [id] FROM inserted);
END;

CREATE TRIGGER [tr_User_UpdatedDate] ON [dbo].[User]
AFTER UPDATE AS
BEGIN
    UPDATE [dbo].[User] 
    SET [updated_date] = GETUTCDATE() 
    WHERE [id] IN (SELECT [id] FROM inserted);
END;

CREATE TRIGGER [tr_Booking_UpdatedDate] ON [dbo].[Booking]
AFTER UPDATE AS
BEGIN
    UPDATE [dbo].[Booking] 
    SET [updated_date] = GETUTCDATE() 
    WHERE [id] IN (SELECT [id] FROM inserted);
END;

CREATE TRIGGER [tr_Arrival_UpdatedDate] ON [dbo].[Arrival]
AFTER UPDATE AS
BEGIN
    UPDATE [dbo].[Arrival] 
    SET [updated_date] = GETUTCDATE() 
    WHERE [id] IN (SELECT [id] FROM inserted);
END;

-- Add some basic constraints and checks
ALTER TABLE [dbo].[Dock] ADD CONSTRAINT [CK_Dock_Hours] CHECK ([start_hour] < [end_hour]);
ALTER TABLE [dbo].[Warehouse] ADD CONSTRAINT [CK_Warehouse_Hours] CHECK ([operating_hours_start] < [operating_hours_end]);
ALTER TABLE [dbo].[Booking] ADD CONSTRAINT [CK_Booking_Times] CHECK ([start_time] < [end_time]);

-- Create a view for active bookings with related information
CREATE VIEW [dbo].[vw_ActiveBookings] AS
SELECT 
    b.[id],
    b.[booking_date],
    b.[start_time],
    b.[end_time],
    b.[duration_minutes],
    b.[reference_number],
    b.[sender_name],
    b.[pallet_count],
    b.[movement_type],
    b.[status],
    c.[name] AS [company_name],
    w.[name] AS [warehouse_name],
    ca.[name] AS [carrier_name],
    d.[name] AS [dock_name],
    vt.[name] AS [vehicle_type_name],
    b.[created_date],
    b.[updated_date]
FROM [dbo].[Booking] b
    INNER JOIN [dbo].[Company] c ON b.[company_id] = c.[id]
    INNER JOIN [dbo].[Warehouse] w ON b.[warehouse_id] = w.[id]
    INNER JOIN [dbo].[Carrier] ca ON b.[carrier_id] = ca.[id]
    INNER JOIN [dbo].[Dock] d ON b.[dock_id] = d.[id]
    INNER JOIN [dbo].[VehicleType] vt ON b.[vehicle_type_id] = vt.[id]
WHERE b.[status] IN ('confirmed', 'provisional')
    AND c.[is_active] = 1
    AND w.[is_active] = 1
    AND d.[is_active] = 1;

PRINT 'Database schema created successfully for PalletSlot application.';`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(sqlScript);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([sqlScript], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "palletslot-azure-sql-schema.sql";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen py-8 px-4 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="w-6 h-6 text-blue-600" />
                <span>Azure SQL Database Schema</span>
              </CardTitle>
              <p className="text-slate-600">
                Complete SQL script to recreate the PalletSlot database structure in Azure SQL Database
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <Button onClick={handleCopy} variant="outline" className="flex items-center gap-2">
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy to Clipboard'}
                </Button>
                <Button onClick={handleDownload} className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Download SQL File
                </Button>
              </div>
              
              <Textarea
                value={sqlScript}
                readOnly
                className="font-mono text-xs h-96 bg-slate-50"
                placeholder="SQL script will appear here..."
              />
              
              <div className="text-sm text-slate-600 bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Usage Instructions:</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>This script is designed for Azure SQL Database</li>
                  <li>Run this script in Azure Data Studio or SQL Server Management Studio</li>
                  <li>Ensure you have the necessary permissions to create tables and indexes</li>
                  <li>The script includes all tables, relationships, indexes, and triggers</li>
                  <li>Sample data insertion is commented out - uncomment if needed</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}