
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Clock, Plus, Trash2, Info } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import HelpPopup from "../help/HelpPopup";
import VehicleTypeFormHelp from "../help/VehicleTypeFormHelp";

export default function VehicleTypeForm({ vehicleType, onSubmit, onCancel, companyDefaults }) {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    max_pallets: 1,
    use_custom_time_calculation: false,
    min_booking_time: 15,
    pallet_time_tiers: [{ pallet_break: 10, time_per_pallet: 5 }, { pallet_break: 25, time_per_pallet: 3 }],
  });

  useEffect(() => {
    if (vehicleType) {
      setFormData({
        name: vehicleType.name || '',
        code: vehicleType.code || '',
        description: vehicleType.description || '',
        max_pallets: vehicleType.max_pallets || 1,
        use_custom_time_calculation: vehicleType.use_custom_time_calculation || false,
        min_booking_time: vehicleType.min_booking_time || companyDefaults?.min_booking_time || 15,
        pallet_time_tiers: vehicleType.pallet_time_tiers && vehicleType.pallet_time_tiers.length > 0
          ? vehicleType.pallet_time_tiers
          : companyDefaults?.pallet_time_tiers || [{ pallet_break: 10, time_per_pallet: 5 }, { pallet_break: 25, time_per_pallet: 3 }],
      });
    } else {
      setFormData({
        name: '',
        code: '',
        description: '',
        max_pallets: 1,
        use_custom_time_calculation: false,
        min_booking_time: companyDefaults?.min_booking_time || 15,
        pallet_time_tiers: companyDefaults?.pallet_time_tiers || [{ pallet_break: 10, time_per_pallet: 5 }, { pallet_break: 25, time_per_pallet: 3 }],
      });
    }
  }, [vehicleType, companyDefaults]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = ['max_pallets', 'min_booking_time'].includes(name) ? parseInt(value) || 0 : value;

    setFormData(prev => {
        // Ensure max_pallets is at least 1
        if (name === 'max_pallets' && processedValue < 1) {
            processedValue = 1;
        }
        
        const updatedData = { ...prev, [name]: processedValue };
        
        // If max_pallets is changed, validate and adjust tiers
        if (name === 'max_pallets') {
            const maxPallets = processedValue;
            const adjustedTiers = updatedData.pallet_time_tiers.map(tier => ({
                ...tier,
                pallet_break: Math.min(tier.pallet_break, maxPallets)
            }));
            updatedData.pallet_time_tiers = adjustedTiers;
        }

        return updatedData;
    });
  };

  const handleCustomTimeToggle = (checked) => {
    setFormData(prev => ({ ...prev, use_custom_time_calculation: checked }));
  };

  const handleTierChange = (index, field, value) => {
    const newTiers = [...formData.pallet_time_tiers];
    let processedValue = parseInt(value) || 0;

    if (field === 'pallet_break') {
      // Cap the break at the vehicle's max pallets and ensure it's at least 1
      processedValue = Math.min(processedValue, formData.max_pallets);
      if (processedValue < 1) processedValue = 1;
    }
    
    newTiers[index] = { ...newTiers[index], [field]: processedValue };
    setFormData(prev => ({ ...prev, pallet_time_tiers: newTiers }));
  };

  const addTier = () => {
    const lastBreak = formData.pallet_time_tiers.length > 0 ? formData.pallet_time_tiers[formData.pallet_time_tiers.length - 1].pallet_break : 0;
    
    // Prevent adding a new tier if the last one is already at (or beyond) the max pallet limit
    if (lastBreak >= formData.max_pallets) return;

    // Suggest a new break, but cap it at the vehicle's max pallet limit
    const newBreak = Math.min(lastBreak + 15, formData.max_pallets);

    setFormData(prev => ({
      ...prev,
      pallet_time_tiers: [...prev.pallet_time_tiers, { pallet_break: newBreak, time_per_pallet: 2 }]
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

  const calculateExampleTime = (pallets, useCustom = false) => {
    const tiers = useCustom || formData.use_custom_time_calculation ? formData.pallet_time_tiers : companyDefaults?.pallet_time_tiers || formData.pallet_time_tiers;
    const minTime = useCustom || formData.use_custom_time_calculation ? formData.min_booking_time : companyDefaults?.min_booking_time || formData.min_booking_time;
    const palletTime = calculatePalletTime(pallets, tiers);
    return Math.max(minTime, palletTime);
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{vehicleType ? "Edit Vehicle Type" : "Add New Vehicle Type"}</CardTitle>
          <HelpPopup title="Vehicle Type Configuration Help">
            <VehicleTypeFormHelp />
          </HelpPopup>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Vehicle Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Vehicle Name</Label>
              <Input 
                id="name" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                placeholder="e.g., 7.5T Truck" 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="code">Vehicle Code</Label>
              <Input 
                id="code" 
                name="code" 
                value={formData.code} 
                onChange={handleChange} 
                placeholder="e.g., 7.5T" 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max_pallets">Maximum Pallets</Label>
              <Input 
                id="max_pallets" 
                name="max_pallets" 
                type="number" 
                min="1" 
                max="60" 
                value={formData.max_pallets} 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              placeholder="Brief description of the vehicle type" 
            />
          </div>

          {/* Time Configuration */}
          <div className="border-t pt-6">
            <div className="flex items-center space-x-2 mb-4">
              <Clock className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-slate-900">Booking Time Configuration</h3>
            </div>

            <div className="flex items-center space-x-2 mb-4">
              <Checkbox
                id="use_custom_time"
                checked={formData.use_custom_time_calculation}
                onCheckedChange={handleCustomTimeToggle}
              />
              <Label htmlFor="use_custom_time" className="text-sm font-medium">
                Use custom time calculation for this vehicle type
              </Label>
            </div>

            {!formData.use_custom_time_calculation && companyDefaults && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-start space-x-2">
                  <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-blue-900 mb-2">Using Company Defaults</p>
                    <p className="text-xs text-blue-800">
                      Minimum time: {companyDefaults.min_booking_time} minutes | 
                      Tiers: {companyDefaults.pallet_time_tiers?.map(t => `${t.pallet_break}@${t.time_per_pallet}min`).join(', ')}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {formData.use_custom_time_calculation && (
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
                                  max={formData.max_pallets}
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
                    <p className="text-xs text-slate-500 mt-1">
                      Pallet break cannot exceed the vehicle's maximum of {formData.max_pallets}.
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addTier}
                      className="mt-2"
                      disabled={formData.pallet_time_tiers.some(t => t.pallet_break >= formData.max_pallets)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Tier
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <h4 className="font-medium text-slate-900 mb-3">Vehicle Time Examples</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>5 pallets:</span>
                        <span className="font-medium">{calculateExampleTime(5, true)} minutes</span>
                      </div>
                      <div className="flex justify-between">
                        <span>15 pallets:</span>
                        <span className="font-medium">{calculateExampleTime(15, true)} minutes</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Max ({formData.max_pallets}):</span>
                        <span className="font-medium">{calculateExampleTime(formData.max_pallets, true)} minutes</span>
                      </div>
                    </div>
                  </div>

                  {companyDefaults && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-3">Company Defaults</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>5 pallets:</span>
                          <span className="font-medium">{calculateExampleTime(5, false)} minutes</span>
                        </div>
                        <div className="flex justify-between">
                          <span>15 pallets:</span>
                          <span className="font-medium">{calculateExampleTime(15, false)} minutes</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Max ({formData.max_pallets}):</span>
                          <span className="font-medium">{calculateExampleTime(formData.max_pallets, false)} minutes</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              {vehicleType ? "Save Changes" : "Create Vehicle Type"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
