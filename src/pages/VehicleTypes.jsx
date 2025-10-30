
import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { useNavigate } from "react-router-dom";
import { VehicleType } from "@/api/entities";
import { Company } from "@/api/entities";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, Building } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import VehicleTypeForm from "../components/vehicletypes/VehicleTypeForm";
import VehicleTypeList from "../components/vehicletypes/VehicleTypeList";
import { createPageUrl } from "@/utils";

export default function VehicleTypesPage() {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState('');
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingVehicleType, setEditingVehicleType] = useState(null);

  useEffect(() => {
    const checkAuthAndLoad = async () => {
      try {
        const user = await User.me();
        setCurrentUser(user);
        setIsAuthorized(true);
        // Call loadCompanies here initially. It will refine its filter once currentUser is fully available in its body.
        loadCompanies();
      } catch (error) {
        navigate(createPageUrl("Booking"));
      }
    };
    checkAuthAndLoad();
  }, [navigate]);

  useEffect(() => {
    if (companies.length > 0 && currentUser) {
        let companyToSelect = '';
        if (currentUser.role !== 'admin' && currentUser.company_id) {
            companyToSelect = currentUser.company_id;
        } else {
            companyToSelect = localStorage.getItem('selectedCompanyId') || '';
        }
        
        // Ensure that a non-admin user can only select their own company,
        // or an admin can select one from the list.
        if (companyToSelect && companies.some(c => c.id === companyToSelect)) {
            handleCompanyChange(companyToSelect, false); // Select without clearing form
        } else if (currentUser.role !== 'admin' && currentUser.company_id) {
            // If non-admin and no company selected or selected company is not their own, force-select their company
            handleCompanyChange(currentUser.company_id, false);
        } else if (companies.length > 0 && !companyToSelect) {
            // For admins, if no company is selected, default to the first available company if any exist
            if (currentUser.role === 'admin') {
                handleCompanyChange(companies[0].id, false);
            }
        }
    }
  }, [companies, currentUser]); // Added currentUser to dependencies for re-evaluation when user data is set

  useEffect(() => {
    if (selectedCompanyId) {
      // Pass currentUser as a dependency because vehicle type loading functions now depend on it for access control
      initializeAndLoadVehicleTypes(selectedCompanyId); 
    }
  }, [selectedCompanyId, currentUser]); // Added currentUser to dependencies

  // Modified: Load companies based on user permissions
  const loadCompanies = async () => {
    setIsLoading(true);
    let companyFilter = { is_active: true };
    // If the current user is not an admin and has a company ID, filter companies by their company ID.
    if (currentUser && currentUser.company_id && currentUser.role !== 'admin') {
      companyFilter.id = currentUser.company_id;
    }
    
    const data = await Company.filter(companyFilter);
    setCompanies(data);
    setIsLoading(false);
  };

  // Modified: Initialize and load vehicle types with company-level access control
  const initializeAndLoadVehicleTypes = async (companyId) => {
    if (!companyId) return;
    
    // Implement company-level access control:
    // If the user is not an admin and the requested companyId is not their assigned company, prevent loading.
    if (currentUser && currentUser.role !== 'admin' && currentUser.company_id && companyId !== currentUser.company_id) {
        console.warn("Unauthorized attempt to initialize/load vehicle types for a different company.");
        setVehicleTypes([]); // Clear existing types if unauthorized
        setIsLoading(false);
        return;
    }

    setIsLoading(true);
    let data = await VehicleType.filter({ company_id: companyId });
    
    // If no vehicle types exist for this company, create default ones
    if (data.length === 0) {
      await seedDefaultVehicleTypes(); // This already uses selectedCompanyId from state
      data = await VehicleType.filter({ company_id: companyId }); // Re-fetch after seeding
    }
    setVehicleTypes(data);
    setIsLoading(false);
  };

  // Modified: Load vehicle types for a specific company with company-level access control
  const loadVehicleTypesForCompany = async (companyId) => {
    if (!companyId) return;

    // Implement company-level access control:
    // If the user is not an admin and the requested companyId is not their assigned company, prevent loading.
    if (currentUser && currentUser.role !== 'admin' && currentUser.company_id && companyId !== currentUser.company_id) {
        console.warn("Unauthorized attempt to load vehicle types for a different company.");
        setVehicleTypes([]); // Clear existing types if unauthorized
        setIsLoading(false);
        return;
    }
    
    setIsLoading(true);
    const data = await VehicleType.filter({ company_id: companyId });
    setVehicleTypes(data);
    setIsLoading(false);
  };

  const loadCompanyDefaults = async (companyId) => {
    if (!companyId) return null;
    
    const company = await Company.get(companyId);
    return {
      min_booking_time: company.min_booking_time || 15,
      pallet_time_tiers: company.pallet_time_tiers || [
        { pallet_break: 10, time_per_pallet: 5 },
        { pallet_break: 25, time_per_pallet: 3 }
      ]
    };
  };

  const seedDefaultVehicleTypes = async () => {
    const defaultVehicleTypes = [
      { name: "Van", code: "VAN", description: "Small delivery van", max_pallets: 6 },
      { name: "7.5T Truck", code: "7.5T", description: "7.5 tonne rigid truck", max_pallets: 12 },
      { name: "18T Truck", code: "18T", description: "18 tonne rigid truck", max_pallets: 24 },
      { name: "Articulated Lorry", code: "ARTIC", description: "Articulated lorry/trailer", max_pallets: 33 },
      { name: "Double Deck Trailer", code: "DOUBLE", description: "Double deck articulated trailer", max_pallets: 60 }
    ];

    const vehicleTypesToCreate = defaultVehicleTypes.map(vt => ({
      ...vt,
      company_id: selectedCompanyId,
      company_name: selectedCompany?.name || ''
    }));

    await VehicleType.bulkCreate(vehicleTypesToCreate);
  };

  const handleCompanyChange = (companyId, resetForm = true) => {
    localStorage.setItem('selectedCompanyId', companyId);
    setSelectedCompanyId(companyId);
    const company = companies.find(c => c.id === companyId);
    setSelectedCompany(company);
    if (resetForm) {
      setShowForm(false);
      setEditingVehicleType(null);
    }
  };

  const handleEdit = (vehicleType) => {
    setEditingVehicleType(vehicleType);
    setShowForm(true);
  };

  const handleDelete = async (vehicleTypeId) => {
    if (window.confirm("Are you sure you want to delete this vehicle type? This action cannot be undone.")) {
      await VehicleType.delete(vehicleTypeId);
      loadVehicleTypesForCompany(selectedCompanyId); // Use new loading function
    }
  };
  
  const handleToggleActive = async (vehicleType) => {
    await VehicleType.update(vehicleType.id, { is_active: !vehicleType.is_active });
    loadVehicleTypesForCompany(selectedCompanyId); // Use new loading function
  };

  const handleFormSubmit = async (vehicleTypeData) => {
    const companyDefaults = await loadCompanyDefaults(selectedCompanyId); // Added as per outline, although its return value is not used here
    const dataWithCompany = {
      ...vehicleTypeData,
      company_id: selectedCompanyId,
      company_name: selectedCompany?.name || ''
    };

    if (editingVehicleType) {
      await VehicleType.update(editingVehicleType.id, dataWithCompany);
    } else {
      await VehicleType.create(dataWithCompany);
    }
    setShowForm(false);
    setEditingVehicleType(null);
    loadVehicleTypesForCompany(selectedCompanyId); // Changed to use the new loading function
  };
  
  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
        >
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
              Vehicle Types
            </h1>
            <p className="text-lg text-slate-600">
              Manage vehicle types and their configurations by company
            </p>
          </div>
          {selectedCompanyId && (
            <Button
              onClick={() => {
                setEditingVehicleType(null);
                setShowForm(true);
              }}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Vehicle Type
            </Button>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-4">
              <Building className="w-5 h-5 text-blue-600" />
              <div className="flex-1">
                <Label htmlFor="company-select" className="text-sm font-medium text-slate-700 mb-2 block">
                  Select Company
                </Label>
                <Select 
                  value={selectedCompanyId} 
                  onValueChange={handleCompanyChange}
                  disabled={currentUser && currentUser.role !== 'admin'}
                >
                  <SelectTrigger id="company-select" className="w-full max-w-md">
                    <SelectValue placeholder="Choose a company to manage vehicle types" />
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
            </div>
          </div>
        </motion.div>

        {!selectedCompanyId ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center py-12"
          >
            <Building className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Select a Company</h3>
            <p className="text-slate-600">
              Choose a company from the dropdown above to manage its vehicle types
            </p>
          </motion.div>
        ) : (
          <>
            {showForm && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
                <VehicleTypeForm
                  vehicleType={editingVehicleType}
                  companyDefaults={selectedCompany} // Added prop as per outline
                  onSubmit={handleFormSubmit}
                  onCancel={() => {
                    setShowForm(false);
                    setEditingVehicleType(null);
                  }}
                />
              </motion.div>
            )}

            <VehicleTypeList
              vehicleTypes={vehicleTypes}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleActive={handleToggleActive}
              isLoading={isLoading}
            />
          </>
        )}
      </div>
    </div>
  );
}
