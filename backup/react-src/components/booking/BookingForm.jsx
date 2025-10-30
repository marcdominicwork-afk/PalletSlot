
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Truck, Package, Clock, Calendar, AlertCircle, Hash, User, ArrowRight, ArrowLeft, Building, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Company } from "@/api/entities";
import { VehicleType } from "@/api/entities";
import { Carrier } from "@/api/entities";
import { Warehouse } from "@/api/entities"; // Import Warehouse
import HelpPopup from "../help/HelpPopup";
import BookingFormHelp from "../help/BookingFormHelp";

export default function BookingForm({
  formData,
  onFormChange,
  currentUser,
  onSubmit,
  onPalletCountChange,
  onMovementTypeChange,
  onCompanyChange,
  isLoading,
  warehouses, // New prop
  isLoadingWarehouses, // New prop
}) {
  const [companies, setCompanies] = useState([]);
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [carriers, setCarriers] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoadingVehicleTypes, setIsLoadingVehicleTypes] = useState(false);
  const [isLoadingCarriers, setIsLoadingCarriers] = useState(false);

  useEffect(() => {
    loadCompanies();
    loadCarriers();
  }, [currentUser]);

  useEffect(() => {
    if (formData?.company_id) {
      loadVehicleTypes(formData.company_id, formData.warehouse_id);
    } else {
      setVehicleTypes([]);
    }
  }, [formData?.company_id, formData?.warehouse_id]);

  const loadCompanies = async () => {
    try {
      if (currentUser && currentUser.company_id && currentUser.role !== 'admin') {
        const data = await Company.filter({ 
          is_active: true,
          id: currentUser.company_id 
        });
        setCompanies(data);
      } else {
        const data = await Company.filter({ is_active: true });
        setCompanies(data);
      }
    } catch (error) {
      console.error('Error loading companies:', error);
      setCompanies([]);
    }
  };

  const loadCarriers = async () => {
    setIsLoadingCarriers(true);
    try {
      const data = await Carrier.filter({ is_active: true });
      setCarriers(data);
    } catch (error) {
      console.error('Error loading carriers:', error);
      setCarriers([]);
    } finally {
      setIsLoadingCarriers(false);
    }
  };

  const loadVehicleTypes = async (companyId, warehouseId) => {
    if (!companyId) return;
    
    setIsLoadingVehicleTypes(true);
    try {
      // Fetch company-wide vehicles (no warehouse assigned)
      const companyWidePromise = VehicleType.filter({ 
        company_id: companyId, 
        warehouse_id: null,
        is_active: true 
      });
      
      // Fetch warehouse-specific vehicles if a warehouse is selected
      const warehouseSpecificPromise = warehouseId 
        ? VehicleType.filter({ warehouse_id: warehouseId, is_active: true }) 
        : Promise.resolve([]);

      const [companyVehicles, warehouseVehicles] = await Promise.all([companyWidePromise, warehouseSpecificPromise]);
      
      const allVehicles = [...warehouseVehicles, ...companyVehicles];
      // Simple de-duplication by ID. If there are vehicles with the same ID but different properties
      // (e.g., from warehouse-specific overriding company-wide), this takes the first one found.
      const uniqueVehicles = allVehicles.filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i);

      setVehicleTypes(uniqueVehicles);
    } catch (error) {
      console.error('Error loading vehicle types:', error);
      setVehicleTypes([]);
    } finally {
      setIsLoadingVehicleTypes(false);
    }
  };

  const calculateBookingDuration = (palletCount, selectedCompany, selectedVehicleType) => {
    if (!palletCount) return 0;
    
    const pallets = parseInt(palletCount);
    
    if (selectedVehicleType && selectedVehicleType.use_custom_time_calculation) {
      const minTime = selectedVehicleType.min_booking_time || 15;
      const tiers = selectedVehicleType.pallet_time_tiers || [];
      
      if (tiers.length > 0) {
        const sortedTiers = [...tiers].sort((a, b) => a.pallet_break - b.pallet_break);
        
        let palletTime = 0;
        let palletsAccountedFor = 0;

        for (const tier of sortedTiers) {
            if (pallets > palletsAccountedFor) {
                const palletsInThisTier = tier.pallet_break - palletsAccountedFor;
                const palletsToCalculate = Math.min(pallets - palletsAccountedFor, palletsInThisTier);
                palletTime += palletsToCalculate * tier.time_per_pallet;
                palletsAccountedFor += palletsToCalculate;
            } else {
                break;
            }
        }
        
        return Math.max(minTime, palletTime);
      }
    }
    
    if (selectedCompany && selectedCompany.pallet_time_tiers) {
      const minTime = selectedCompany.min_booking_time || 15;
      const tiers = selectedCompany.pallet_time_tiers;
      
      const sortedTiers = [...tiers].sort((a, b) => a.pallet_break - b.pallet_break);
      
      let palletTime = 0;
      let palletsAccountedFor = 0;

      for (const tier of sortedTiers) {
          if (pallets > palletsAccountedFor) {
              const palletsInThisTier = tier.pallet_break - palletsAccountedFor;
              const palletsToCalculate = Math.min(pallets - palletsAccountedFor, palletsInThisTier);
              palletTime += palletsToCalculate * tier.time_per_pallet;
              palletsAccountedFor += palletsToCalculate;
          } else {
              break;
          }
      }
      
      return Math.max(minTime, palletTime);
    }
    
    return 0;
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData) return false;

    if (!formData.company_id) {
      newErrors.company_id = 'Company selection is required';
    }

    if (!formData.warehouse_id) {
      newErrors.warehouse_id = 'Warehouse selection is required';
    }

    if (!formData.carrier_id) {
      newErrors.carrier_id = 'Carrier selection is required';
    }

    if (!formData.sender_name?.trim()) {
      newErrors.sender_name = 'Sender name is required';
    }

    if (!formData.reference_number?.trim()) {
      newErrors.reference_number = 'Reference number is required';
    }

    if (!formData.pallet_count) {
      newErrors.pallet_count = 'Number of pallets is required';
    } else if (formData.pallet_count < 1 || formData.pallet_count > 60) {
      newErrors.pallet_count = 'Number of pallets must be between 1 and 60';
    }

    if (!formData.vehicle_type_id) {
      newErrors.vehicle_type_id = 'Vehicle type is required';
    }

    if (!formData.booking_date) {
      newErrors.booking_date = 'Booking date is required';
    } else if (new Date(formData.booking_date) < new Date().setHours(0, 0, 0, 0)) {
      newErrors.booking_date = 'Booking date cannot be in the past';
    }

    if (formData.vehicle_type_id && formData.pallet_count) {
      const selectedVehicleType = vehicleTypes.find(vt => vt.id === formData.vehicle_type_id);
      if (selectedVehicleType && parseInt(formData.pallet_count) > selectedVehicleType.max_pallets) {
        newErrors.pallet_count = `This vehicle type can only carry ${selectedVehicleType.max_pallets} pallets maximum`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    onFormChange(field, value);

    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    if (field === 'pallet_count') {
      const palletCount = parseInt(value) || 0;
      if (palletCount > 0 && formData?.company_id) {
        const selectedCompany = companies.find(c => c.id === formData.company_id);
        const selectedVehicleType = vehicleTypes.find(vt => vt.id === formData.vehicle_type_id);
        const duration = calculateBookingDuration(palletCount, selectedCompany, selectedVehicleType);
        onPalletCountChange(duration);
      } else {
        onPalletCountChange(0);
      }
    }

    if (field === 'movement_type') {
      onMovementTypeChange(value);
    }

    if (field === 'company_id') {
      onCompanyChange(value);
      onFormChange('vehicle_type_id', ''); // Clear vehicle type when company changes
      // onFormChange is handled in parent to clear warehouse_id and vehicle_type_id
      
      // Recalculate duration if pallets are already entered
      if (formData?.pallet_count) {
        const selectedCompany = companies.find(c => c.id === value);
        const selectedVehicleType = vehicleTypes.find(vt => vt.id === formData.vehicle_type_id); // vehicle_type_id is from original formData
        const duration = calculateBookingDuration(formData.pallet_count, selectedCompany, selectedVehicleType);
        onPalletCountChange(duration);
      }
    }
    
    if (field === 'warehouse_id') {
      // onFormChange is handled in parent to clear vehicle_type_id
      onFormChange('vehicle_type_id', ''); // Clear vehicle type when warehouse changes
    }

    if (field === 'vehicle_type_id') {
      // Recalculate duration when vehicle type changes
      if (formData?.pallet_count) {
        const selectedCompany = companies.find(c => c.id === formData.company_id);
        const selectedVehicleType = vehicleTypes.find(vt => vt.id === value);
        const duration = calculateBookingDuration(formData.pallet_count, selectedCompany, selectedVehicleType);
        onPalletCountChange(duration);
      }
    }

    const updatedFormData = { ...formData, [field]: value };
    if (isFormComplete(updatedFormData)) {
      setTimeout(() => {
        const selectedCompany = companies.find(c => c.id === updatedFormData.company_id);
        const selectedWarehouse = warehouses.find(w => w.id === updatedFormData.warehouse_id);
        const selectedVehicleType = vehicleTypes.find(vt => vt.id === updatedFormData.vehicle_type_id);
        const selectedCarrier = carriers.find(c => c.id === updatedFormData.carrier_id);
        const submitData = {
          ...updatedFormData,
          company_name: selectedCompany?.name || '',
          warehouse_name: selectedWarehouse?.name || '',
          vehicle_type_name: selectedVehicleType?.name || '',
          carrier_name: selectedCarrier?.name || ''
        };
        onSubmit(submitData);
      }, 100);
    }
  };

  const getDurationText = () => {
    const palletCount = parseInt(formData?.pallet_count) || 0;
    if (palletCount > 0 && formData?.company_id) {
      const selectedCompany = companies.find(c => c.id === formData.company_id);
      const selectedVehicleType = vehicleTypes.find(vt => vt.id === formData.vehicle_type_id);
      const duration = calculateBookingDuration(palletCount, selectedCompany, selectedVehicleType);
      return `${duration} minutes`;
    }
    return '';
  };

  const getMaxPalletsForVehicle = () => {
    if (!formData?.vehicle_type_id) return 60;
    const selectedVehicleType = vehicleTypes.find(vt => vt.id === formData.vehicle_type_id);
    return selectedVehicleType?.max_pallets || 60;
  };

  const isFormComplete = (data) => {
    return data.company_id && 
           data.warehouse_id &&
           data.carrier_id && 
           data.sender_name?.trim() && 
           data.reference_number?.trim() && 
           data.pallet_count && 
           data.vehicle_type_id && 
           data.booking_date;
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Truck className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-slate-900">Delivery Details</h2>
        </div>
        <HelpPopup title="Booking Form Help">
          <BookingFormHelp />
        </HelpPopup>
      </div>

      {!formData ? (
        <div className="flex flex-col items-center justify-center h-96 text-slate-500">
          <Loader2 className="w-8 h-8 animate-spin mb-4" />
          <p>Loading booking information...</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="company_id" className="text-sm font-medium text-slate-700">
                Company
              </Label>
              <Select
                value={formData.company_id || ''}
                onValueChange={(value) => handleInputChange('company_id', value)}
                disabled={isLoading || (currentUser && currentUser.role !== 'admin' && currentUser.company_id)}
              >
                <SelectTrigger id="company_id" className="h-11 border-slate-200 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder={
                    currentUser && currentUser.role !== 'admin' && currentUser.company_id 
                      ? "Your company will be auto-selected" 
                      : "Select a company"
                  } />
                </SelectTrigger>
                <SelectContent>
                  {companies.map(company => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name} ({company.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.company_id && (
                <p className="text-sm text-red-600 flex items-center space-x-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.company_id}</span>
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="warehouse_id" className="text-sm font-medium text-slate-700">
                Warehouse / Location
              </Label>
              <Select
                value={formData.warehouse_id || ''}
                onValueChange={(value) => handleInputChange('warehouse_id', value)}
                disabled={!formData.company_id || isLoadingWarehouses}
              >
                <SelectTrigger id="warehouse_id" className="h-11 border-slate-200 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder={
                    !formData.company_id 
                      ? "Select company first" 
                      : isLoadingWarehouses 
                        ? "Loading..." 
                        : "Select a warehouse"
                  } />
                </SelectTrigger>
                <SelectContent>
                  {warehouses.map(warehouse => (
                    <SelectItem key={warehouse.id} value={warehouse.id}>
                      {warehouse.name} ({warehouse.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.warehouse_id && (
                <p className="text-sm text-red-600 flex items-center space-x-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.warehouse_id}</span>
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="movement_type" className="text-sm font-medium text-slate-700">
                Movement Type
              </Label>
              <Select
                value={formData.movement_type || 'Inwards'}
                onValueChange={(value) => handleInputChange('movement_type', value)}
              >
                <SelectTrigger 
                  id="movement_type" 
                  className={`h-11 transition-colors duration-200 font-medium ${
                    formData.movement_type === 'Outwards'
                      ? 'bg-orange-50 border-orange-200 text-orange-900 focus:ring-orange-500'
                      : 'bg-blue-50 border-blue-200 text-blue-900 focus:ring-blue-500'
                  }`}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Inwards">
                    <span className="flex items-center">
                      <ArrowRight className="w-4 h-4 mr-2 text-blue-600" />
                      Inwards
                    </span>
                  </SelectItem>
                  <SelectItem value="Outwards">
                    <span className="flex items-center">
                      <ArrowLeft className="w-4 h-4 mr-2 text-orange-600" />
                      Outwards
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="vehicle_type_id" className="text-sm font-medium text-slate-700">
                Vehicle Type
              </Label>
              <Select
                value={formData.vehicle_type_id || ''}
                onValueChange={(value) => handleInputChange('vehicle_type_id', value)}
                disabled={!formData.warehouse_id || isLoadingVehicleTypes}
              >
                <SelectTrigger id="vehicle_type_id" className="h-11 border-slate-200 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder={
                    !formData.warehouse_id 
                      ? "Select warehouse first" 
                      : isLoadingVehicleTypes 
                        ? "Loading vehicle types..." 
                        : "Select vehicle type"
                  } />
                </SelectTrigger>
                <SelectContent>
                  {vehicleTypes.map(vehicleType => (
                    <SelectItem key={vehicleType.id} value={vehicleType.id}>
                      {vehicleType.name} (Max {vehicleType.max_pallets} pallets)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.vehicle_type_id && (
                <p className="text-sm text-red-600 flex items-center space-x-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.vehicle_type_id}</span>
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="carrier_id" className="text-sm font-medium text-slate-700">
                Carrier
              </Label>
              <Select
                value={formData.carrier_id || ''}
                onValueChange={(value) => handleInputChange('carrier_id', value)}
                disabled={isLoadingCarriers}
              >
                <SelectTrigger id="carrier_id" className="h-11 border-slate-200 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder={isLoadingCarriers ? "Loading carriers..." : "Select a carrier"} />
                </SelectTrigger>
                <SelectContent>
                  {carriers.map(carrier => (
                    <SelectItem key={carrier.id} value={carrier.id}>
                      {carrier.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.carrier_id && (
                <p className="text-sm text-red-600 flex items-center space-x-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.carrier_id}</span>
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="sender_name" className="text-sm font-medium text-slate-700">
                Sender Name
              </Label>
              <Input
                id="sender_name"
                type="text"
                value={formData.sender_name || ''}
                onChange={(e) => handleInputChange('sender_name', e.target.value)}
                placeholder="Enter sender/shipper name"
                className="h-11 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.sender_name && (
                <p className="text-sm text-red-600 flex items-center space-x-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.sender_name}</span>
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="reference_number" className="text-sm font-medium text-slate-700">
                Reference Number
              </Label>
              <Input
                id="reference_number"
                type="text"
                value={formData.reference_number || ''}
                onChange={(e) => handleInputChange('reference_number', e.target.value)}
                placeholder="Enter shipment reference number"
                className="h-11 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.reference_number && (
                <p className="text-sm text-red-600 flex items-center space-x-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.reference_number}</span>
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="pallet_count" className="text-sm font-medium text-slate-700">
                Number of Pallets
              </Label>
              <Input
                id="pallet_count"
                type="number"
                min="1"
                max={getMaxPalletsForVehicle()}
                value={formData.pallet_count || ''}
                onChange={(e) => handleInputChange('pallet_count', e.target.value)}
                placeholder={`1-${getMaxPalletsForVehicle()} pallets`}
                className="h-11 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
              />
              {getDurationText() && (
                <div className="flex items-center space-x-2 text-sm text-slate-600">
                  <Clock className="w-4 h-4" />
                  <span>Booking duration: {getDurationText()}</span>
                </div>
              )}
              {errors.pallet_count && (
                <p className="text-sm text-red-600 flex items-center space-x-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.pallet_count}</span>
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="booking_date" className="text-sm font-medium text-slate-700">
                Delivery Date
              </Label>
              <Input
                id="booking_date"
                type="date"
                value={formData.booking_date || format(new Date(), 'yyyy-MM-dd')}
                onChange={(e) => handleInputChange('booking_date', e.target.value)}
                min={format(new Date(), 'yyyy-MM-dd')}
                className="h-11 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.booking_date && (
                <p className="text-sm text-red-600 flex items-center space-x-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.booking_date}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
