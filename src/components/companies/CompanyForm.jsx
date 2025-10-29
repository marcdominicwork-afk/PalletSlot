
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Clock, Plus, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import HelpPopup from "../help/HelpPopup";
import CompanyFormHelp from "../help/CompanyFormHelp";

export default function CompanyForm({ company, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    contact_email: '',
    phone: '',
    address: '',
    min_booking_time: 15,
    pallet_time_tiers: [{ pallet_break: 10, time_per_pallet: 5 }, { pallet_break: 25, time_per_pallet: 3 }],
  });

  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name || '',
        code: company.code || '',
        contact_email: company.contact_email || '',
        phone: company.phone || '',
        address: company.address || '',
        min_booking_time: company.min_booking_time || 15,
        pallet_time_tiers: company.pallet_time_tiers && company.pallet_time_tiers.length > 0 
          ? company.pallet_time_tiers 
          : [{ pallet_break: 10, time_per_pallet: 5 }, { pallet_break: 25, time_per_pallet: 3 }],
      });
    } else {
      setFormData({
        name: '',
        code: '',
        contact_email: '',
        phone: '',
        address: '',
        min_booking_time: 15,
        pallet_time_tiers: [{ pallet_break: 10, time_per_pallet: 5 }, { pallet_break: 25, time_per_pallet: 3 }],
      });
    }
  }, [company]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: ['min_booking_time'].includes(name) ? parseInt(value) || 0 : value }));
  };

  const handleTierChange = (index, field, value) => {
    const newTiers = [...formData.pallet_time_tiers];
    newTiers[index] = { ...newTiers[index], [field]: parseInt(value) || 0 };
    setFormData(prev => ({ ...prev, pallet_time_tiers: newTiers }));
  };

  const addTier = () => {
    const lastBreak = formData.pallet_time_tiers.length > 0 ? formData.pallet_time_tiers[formData.pallet_time_tiers.length - 1].pallet_break : 0;
    setFormData(prev => ({
      ...prev,
      pallet_time_tiers: [...prev.pallet_time_tiers, { pallet_break: lastBreak + 15, time_per_pallet: 2 }]
    }));
  };

  const removeTier = (index) => {
    setFormData(prev => ({
      ...prev,
      pallet_time_tiers: prev.pallet_time_tiers.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const sortedTiers = [...formData.pallet_time_tiers].sort((a, b) => a.pallet_break - b.pallet_break);
    onSubmit({ ...formData, pallet_time_tiers: sortedTiers });
  };
  
  const calculatePalletTime = (pallets, tiers) => {
    if (!tiers || tiers.length === 0) return 0;
    const sortedTiers = [...tiers].sort((a, b) => a.pallet_break - b.pallet_break);
    
    let totalTime = 0;
    let palletsAccountedFor = 0;

    for (const tier of sortedTiers) {
        if (pallets > palletsAccountedFor) {
            const palletsInThisTier = tier.pallet_break - palletsAccountedFor;
            const palletsToCalculate = Math.min(pallets - palletsAccountedFor, palletsInThisTier);
            totalTime += palletsToCalculate * tier.time_per_pallet;
            palletsAccountedFor += palletsToCalculate;
        } else {
            break;
        }
    }
    return totalTime;
  };

  const calculateExampleTime = (pallets) => {
    const palletTime = calculatePalletTime(pallets, formData.pallet_time_tiers);
    return Math.max(formData.min_booking_time, palletTime);
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{company ? "Edit Company" : "Add New Company"}</CardTitle>
          <HelpPopup title="Company Configuration Help">
            <CompanyFormHelp />
          </HelpPopup>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Company Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Company Name</Label>
              <Input 
                id="name" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                placeholder="e.g., Acme Corporation" 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="code">Company Code</Label>
              <Input 
                id="code" 
                name="code" 
                value={formData.code} 
                onChange={handleChange} 
                placeholder="e.g., ACME" 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact_email">Contact Email</Label>
              <Input 
                id="contact_email" 
                name="contact_email" 
                type="email" 
                value={formData.contact_email} 
                onChange={handleChange} 
                placeholder="contact@company.com" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input 
                id="phone" 
                name="phone" 
                value={formData.phone} 
                onChange={handleChange} 
                placeholder="(555) 555-5555" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea 
              id="address" 
              name="address" 
              value={formData.address} 
              onChange={handleChange} 
              placeholder="123 Main St, Anytown, USA" 
            />
          </div>

          {/* Booking Time Configuration */}
          <div className="border-t pt-6">
            <div className="flex items-center space-x-2 mb-4">
              <Clock className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-slate-900">Booking Time Configuration</h3>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="min_booking_time">Minimum Booking Time (minutes)</Label>
                  <Input 
                    id="min_booking_time" 
                    name="min_booking_time" 
                    type="number" 
                    min="5" 
                    max="120" 
                    value={formData.min_booking_time} 
                    onChange={handleChange} 
                    required 
                  />
                  <p className="text-xs text-slate-600">Base time for any booking regardless of pallet count.</p>
                </div>

                <div>
                  <Label className="mb-2 block">Pallet Time Tiers</Label>
                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Up to (Pallets)</TableHead>
                          <TableHead>Mins per Pallet</TableHead>
                          <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {formData.pallet_time_tiers.map((tier, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <Input
                                type="number"
                                value={tier.pallet_break}
                                onChange={(e) => handleTierChange(index, 'pallet_break', e.target.value)}
                                className="h-8"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={tier.time_per_pallet}
                                onChange={(e) => handleTierChange(index, 'time_per_pallet', e.target.value)}
                                className="h-8"
                              />
                            </TableCell>
                            <TableCell>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeTier(index)}
                                className="h-8 w-8"
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addTier}
                    className="mt-2"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Tier
                  </Button>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg">
                <h4 className="font-medium text-slate-900 mb-3">Time Calculation Examples</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>5 pallets:</span>
                    <span className="font-medium">{calculateExampleTime(5)} minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span>15 pallets:</span>
                    <span className="font-medium">{calculateExampleTime(15)} minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span>30 pallets:</span>
                    <span className="font-medium">{calculateExampleTime(30)} minutes</span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t text-xs text-slate-600">
                  <p><strong>Formula:</strong> Time = Max(Minimum Time, Calculated Pallet Time)</p>
                  <p className="mt-1">Pallet time is calculated based on the tiers you define.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              {company ? "Save Changes" : "Create Company"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
