
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox"; // Added Checkbox import
import { Save, X, Building, Clock, Mail, Phone, Calculator, Plus, Trash2 } from "lucide-react"; // Added Calculator, Plus, Trash2 imports
import HelpPopup from "../help/HelpPopup";
import WarehouseFormHelp from "../help/WarehouseFormHelp";

export default function WarehouseForm({ warehouse, companies = [], currentUser, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    company_id: '',
    company_name: '',
    address: '',
    contact_email: '',
    contact_phone: '',
    operating_hours_start: 7,
    operating_hours_end: 17,
    use_custom_time_calculation: false, // Added
    min_booking_time: 15, // Added
    pallet_time_tiers: [ // Added
      { pallet_break: 10, time_per_pallet: 5 },
      { pallet_break: 25, time_per_pallet: 3 }
    ],
    is_active: true // Added is_active to formData state
  });

  useEffect(() => {
    if (warehouse) {
      // When editing an existing warehouse, populate all fields including company details
      setFormData({
        name: warehouse.name || '',
        code: warehouse.code || '',
        company_id: warehouse.company_id || '',
        company_name: warehouse.company_name || '',
        address: warehouse.address || '',
        contact_email: warehouse.contact_email || '',
        contact_phone: warehouse.contact_phone || '',
        operating_hours_start: warehouse.operating_hours_start || 7,
        operating_hours_end: warehouse.operating_hours_end || 17,
        use_custom_time_calculation: warehouse.use_custom_time_calculation ?? false, // Populate
        min_booking_time: warehouse.min_booking_time ?? 15, // Populate
        pallet_time_tiers: warehouse.pallet_time_tiers || [{ pallet_break: 10, time_per_pallet: 5 }, { pallet_break: 25, time_per_pallet: 3 }], // Populate
        is_active: warehouse.is_active ?? true // Populate is_active, default to true
      });
    } else {
      // Reset form for a new warehouse
      setFormData({
        name: '',
        code: '',
        company_id: '', // Ensure company_id is reset to empty for new forms
        company_name: '', // Ensure company_name is reset to empty for new forms
        address: '',
        contact_email: '',
        contact_phone: '',
        operating_hours_start: 7,
        operating_hours_end: 17,
        use_custom_time_calculation: false, // Reset
        min_booking_time: 15, // Reset
        pallet_time_tiers: [{ pallet_break: 10, time_per_pallet: 5 }, { pallet_break: 25, time_per_pallet: 3 }], // Reset
        is_active: true, // Default to active for new warehouses
      });
    }
  }, [warehouse]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedCompany = companies.find(c => c.id === formData.company_id);
    const submitData = {
      ...formData,
      company_name: selectedCompany ? selectedCompany.name : formData.company_name
    };
    onSubmit(submitData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addTier = () => {
    setFormData(prev => ({
      ...prev,
      pallet_time_tiers: [...prev.pallet_time_tiers, { pallet_break: 0, time_per_pallet: 0 }]
    }));
  };

  const removeTier = (index) => {
    setFormData(prev => ({
      ...prev,
      pallet_time_tiers: prev.pallet_time_tiers.filter((_, i) => i !== index)
    }));
  };

  const updateTier = (index, field, value) => {
    // Parse value to integer as specified in the outline, defaulting to 0
    const numValue = parseInt(value) || 0;
    setFormData(prev => ({
      ...prev,
      pallet_time_tiers: prev.pallet_time_tiers.map((tier, i) =>
        i === index ? { ...tier, [field]: numValue } : tier
      )
    }));
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Building className="w-6 h-6 text-blue-600" />
            <span>{warehouse ? 'Edit Warehouse' : 'Add New Warehouse'}</span>
          </CardTitle>
          <HelpPopup title="Warehouse Management Help">
            <WarehouseFormHelp />
          </HelpPopup>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-slate-700">
                  Warehouse Name *
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="e.g., Main Distribution Center"
                  className="border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="code" className="text-sm font-medium text-slate-700">
                  Warehouse Code *
                </Label>
                <Input
                  id="code"
                  type="text"
                  value={formData.code}
                  onChange={(e) => handleChange('code', e.target.value)}
                  placeholder="e.g., MDC"
                  className="border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Company Selection - Only show for admins */}
            {currentUser && currentUser.role === 'admin' && (
              <div className="space-y-2">
                <Label htmlFor="company_id" className="text-sm font-medium text-slate-700">
                  Company *
                </Label>
                <Select
                  value={formData.company_id}
                  onValueChange={(value) => handleChange('company_id', value)}
                  required
                >
                  <SelectTrigger id="company_id" className="border-slate-200 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Select a company" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map(company => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name} ({company.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 flex items-center space-x-2">
                <Mail className="w-5 h-5 text-blue-600" />
                <span>Contact Information</span>
              </h3>
              
              <div className="space-y-2">
                <Label htmlFor="address" className="text-sm font-medium text-slate-700">
                  Address
                </Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  placeholder="Enter warehouse address"
                  className="border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="contact_email" className="text-sm font-medium text-slate-700">
                    Contact Email
                  </Label>
                  <Input
                    id="contact_email"
                    type="email"
                    value={formData.contact_email}
                    onChange={(e) => handleChange('contact_email', e.target.value)}
                    placeholder="warehouse@company.com"
                    className="border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact_phone" className="text-sm font-medium text-slate-700">
                    Contact Phone
                  </Label>
                  <Input
                    id="contact_phone"
                    type="tel"
                    value={formData.contact_phone}
                    onChange={(e) => handleChange('contact_phone', e.target.value)}
                    placeholder="+1 (555) 123-4567" // Updated placeholder
                    className="border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Operating Hours */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 flex items-center space-x-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <span>Operating Hours</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="operating_hours_start" className="text-sm font-medium text-slate-700">
                    Start Hour (24-hour format)
                  </Label>
                  <Input // Changed from Select to Input
                    id="operating_hours_start"
                    type="number"
                    min="0"
                    max="23"
                    value={formData.operating_hours_start}
                    onChange={(e) => handleChange('operating_hours_start', parseInt(e.target.value))}
                    className="border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="operating_hours_end" className="text-sm font-medium text-slate-700">
                    End Hour (24-hour format)
                  </Label>
                  <Input // Changed from Select to Input
                    id="operating_hours_end"
                    type="number"
                    min="0"
                    max="24"
                    value={formData.operating_hours_end}
                    onChange={(e) => handleChange('operating_hours_end', parseInt(e.target.value))}
                    className="border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Time Calculation Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 flex items-center space-x-2">
                <Calculator className="w-5 h-5 text-blue-600" />
                <span>Booking Time Calculation</span>
              </h3>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="use_custom_time_calculation"
                  checked={formData.use_custom_time_calculation}
                  onCheckedChange={(checked) => handleChange('use_custom_time_calculation', checked)}
                />
                <Label htmlFor="use_custom_time_calculation" className="text-sm text-slate-700">
                  Use custom time calculation for this warehouse (overrides company settings)
                </Label>
              </div>

              {formData.use_custom_time_calculation && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="min_booking_time" className="text-sm font-medium text-slate-700">
                      Minimum Booking Time (minutes)
                    </Label>
                    <Input
                      id="min_booking_time"
                      type="number"
                      min="5"
                      max="120"
                      value={formData.min_booking_time}
                      onChange={(e) => handleChange('min_booking_time', parseInt(e.target.value))}
                      className="w-32 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium text-slate-700">
                        Pallet Time Calculation Tiers
                      </Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addTier}
                        className="text-blue-600 border-blue-200 hover:bg-blue-50"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Tier
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="grid grid-cols-12 gap-2 text-xs font-medium text-slate-600">
                        <div className="col-span-5">Up to Pallets</div>
                        <div className="col-span-5">Minutes per Pallet</div>
                        <div className="col-span-2"></div>
                      </div>
                      
                      {formData.pallet_time_tiers.map((tier, index) => (
                        <div key={index} className="grid grid-cols-12 gap-2 items-center">
                          <Input
                            type="number"
                            min="0" // Adjusted to allow 0 for new tiers
                            value={tier.pallet_break === 0 ? '' : tier.pallet_break} // Display empty string for 0 initially
                            onChange={(e) => updateTier(index, 'pallet_break', e.target.value)}
                            placeholder="Pallets"
                            className="col-span-5 h-9 text-sm border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                          />
                          <Input
                            type="number"
                            min="0" // Adjusted to allow 0 for new tiers
                            step="0.5"
                            value={tier.time_per_pallet === 0 ? '' : tier.time_per_pallet} // Display empty string for 0 initially
                            onChange={(e) => updateTier(index, 'time_per_pallet', e.target.value)}
                            placeholder="Minutes"
                            className="col-span-5 h-9 text-sm border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeTier(index)}
                            className="col-span-2 h-9 text-red-600 hover:bg-red-50"
                            disabled={formData.pallet_time_tiers.length <= 1}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    
                    <div className="text-xs text-slate-600 bg-white p-3 rounded border">
                      <strong>Example:</strong> If you have tiers "10 pallets = 3 min/pallet" and "25 pallets = 2 min/pallet":
                      <br />• 5 pallets = 5×3 = 15 minutes
                      <br />• 15 pallets = (10×3) + (5×2) = 40 minutes  
                      <br />• 30 pallets = (10×3) + (15×2) + (5×2) = 70 minutes
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Active Status */}
            <div className="flex items-center space-x-2">
              <Checkbox // Changed from input type="checkbox" to Checkbox component
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => handleChange('is_active', checked)}
              />
              <Label htmlFor="is_active" className="text-sm text-slate-700">
                Warehouse is active and available for bookings
              </Label>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="border-slate-200 hover:bg-slate-50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
              >
                {warehouse ? 'Update Warehouse' : 'Create Warehouse'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
