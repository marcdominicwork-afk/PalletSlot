import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { useNavigate } from "react-router-dom";
import { Dock } from "@/api/entities";
import { Company } from "@/api/entities";
import { Warehouse } from "@/api/entities";
import { VehicleType } from "@/api/entities";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, Building, Warehouse as WarehouseIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import DockForm from "../components/docks/DockForm";
import DockList from "../components/docks/DockList";
import { createPageUrl } from "@/utils";

export default function DocksPage() {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [docks, setDocks] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState('');
  const [selectedWarehouseId, setSelectedWarehouseId] = useState('');
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingWarehouses, setIsLoadingWarehouses] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingDock, setEditingDock] = useState(null);

  useEffect(() => {
    const checkAuthAndLoad = async () => {
      try {
        const user = await User.me();
        setCurrentUser(user);
        setIsAuthorized(true);
        loadCompanies(user);
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
        
        if (companyToSelect && companies.some(c => c.id === companyToSelect)) {
            handleCompanyChange(companyToSelect, false);
        } else if (companies.length > 0 && currentUser.role !== 'admin' && currentUser.company_id) {
            handleCompanyChange(currentUser.company_id, false);
        }
    }
  }, [companies, currentUser]);

  useEffect(() => {
    if (selectedCompanyId) {
      loadWarehouses(selectedCompanyId);
    } else {
      setWarehouses([]);
      setSelectedWarehouseId('');
      setDocks([]);
      setVehicleTypes([]);
    }
  }, [selectedCompanyId]);

  useEffect(() => {
    if (selectedWarehouseId) {
      loadDocks();
      loadAndEnsureVehicleTypes(selectedCompanyId, selectedWarehouseId);
    } else {
      setDocks([]);
      setVehicleTypes([]);
    }
  }, [selectedWarehouseId, selectedCompanyId]);

  const loadCompanies = async (user) => {
    setIsLoading(true);
    let companyFilter = { is_active: true };
    if (user && user.company_id && user.role !== 'admin') {
      companyFilter.id = user.company_id;
    }
    
    const data = await Company.filter(companyFilter);
    setCompanies(data);
    setIsLoading(false);
  };

  const loadWarehouses = async (companyId) => {
    if (!companyId) {
      setWarehouses([]);
      return;  
    }
    setIsLoadingWarehouses(true);
    try {
      const data = await Warehouse.filter({ company_id: companyId, is_active: true });
      setWarehouses(data);
      
      // Auto-select warehouse if user is restricted to specific warehouses
      if (currentUser && currentUser.warehouse_ids && currentUser.warehouse_ids.length > 0) {
        const allowedWarehouses = data.filter(w => currentUser.warehouse_ids.includes(w.id));
        if (allowedWarehouses.length === 1) {
          handleWarehouseChange(allowedWarehouses[0].id, false);
        }
      }
    } catch (error) {
      console.error('Error loading warehouses:', error);
      setWarehouses([]);
    } finally {
      setIsLoadingWarehouses(false);
    }
  };

  const loadDocks = async () => {
    setIsLoading(true);
    
    if (!selectedWarehouseId) {
      setDocks([]);
      setIsLoading(false);
      return;
    }
    
    const data = await Dock.filter({ 
      company_id: selectedCompanyId,
      warehouse_id: selectedWarehouseId 
    });
    setDocks(data);
    setIsLoading(false);
  };
  
  const loadAndEnsureVehicleTypes = async (companyId, warehouseId) => {
    if (!companyId || !warehouseId) {
      setVehicleTypes([]);
      return;
    }

    // Load warehouse-specific vehicle types first
    const warehouseVehicles = await VehicleType.filter({ 
      warehouse_id: warehouseId, 
      is_active: true 
    });
    
    // Load company-wide vehicle types (not assigned to specific warehouse)
    const companyVehicles = await VehicleType.filter({ 
      company_id: companyId, 
      warehouse_id: null,
      is_active: true 
    });

    // Combine both lists, with warehouse-specific taking precedence
    const allVehicles = [...warehouseVehicles, ...companyVehicles];
    
    // If no vehicle types exist, seed default ones for the company
    if (allVehicles.length === 0) {
      await seedDefaultVehicleTypes(companyId);
      const newData = await VehicleType.filter({ 
        company_id: companyId, 
        warehouse_id: null,
        is_active: true 
      });
      setVehicleTypes(newData);
    } else {
      setVehicleTypes(allVehicles);
    }
  };

  const seedDefaultVehicleTypes = async (companyId) => {
    const companyForSeeding = companies.find(c => c.id === companyId);
    if (!companyForSeeding) return;

    const defaultVehicleTypes = [
      { name: "Van", code: "VAN", description: "Small delivery van", max_pallets: 6 },
      { name: "7.5T Truck", code: "7.5T", description: "7.5 tonne rigid truck", max_pallets: 12 },
      { name: "18T Truck", code: "18T", description: "18 tonne rigid truck", max_pallets: 24 },
      { name: "Articulated Lorry", code: "ARTIC", description: "Articulated lorry/trailer", max_pallets: 33 },
      { name: "Double Deck Trailer", code: "DOUBLE", description: "Double deck articulated trailer", max_pallets: 60 }
    ];

    const vehicleTypesToCreate = defaultVehicleTypes.map(vt => ({
      ...vt,
      company_id: companyId,
      company_name: companyForSeeding.name || '',
      warehouse_id: null, // Company-wide vehicles
      warehouse_name: null
    }));

    await VehicleType.bulkCreate(vehicleTypesToCreate);
  };

  const handleCompanyChange = (companyId, resetForm = true) => {
    localStorage.setItem('selectedCompanyId', companyId);
    setSelectedCompanyId(companyId);
    const company = companies.find(c => c.id === companyId);
    setSelectedCompany(company);
    setSelectedWarehouseId(''); // Reset warehouse when company changes
    setSelectedWarehouse(null);
    if (resetForm) {
      setShowForm(false);
      setEditingDock(null);
    }
  };

  const handleWarehouseChange = (warehouseId, resetForm = true) => {
    setSelectedWarehouseId(warehouseId);
    const warehouse = warehouses.find(w => w.id === warehouseId);
    setSelectedWarehouse(warehouse);
    if (resetForm) {
      setShowForm(false);
      setEditingDock(null);
    }
  };

  const handleEdit = (dock) => {
    setEditingDock(dock);
    setShowForm(true);
  };

  const handleDelete = async (dockId) => {
    if (window.confirm("Are you sure you want to delete this dock? This action cannot be undone.")) {
      await Dock.delete(dockId);
      loadDocks();
    }
  };
  
  const handleToggleActive = async (dock) => {
    await Dock.update(dock.id, { is_active: !dock.is_active });
    loadDocks();
  };

  const handleFormSubmit = async (dockData) => {
    const dataWithLocation = {
      ...dockData,
      company_id: selectedCompanyId,
      company_name: selectedCompany?.name || '',
      warehouse_id: selectedWarehouseId,
      warehouse_name: selectedWarehouse?.name || ''
    };

    if (editingDock) {
      await Dock.update(editingDock.id, dataWithLocation);
    } else {
      await Dock.create(dataWithLocation);
    }
    setShowForm(false);
    setEditingDock(null);
    loadDocks();
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
              Dock Configuration
            </h1>
            <p className="text-lg text-slate-600">
              Manage delivery docks and their availability by warehouse
            </p>
          </div>
          {selectedWarehouseId && (
            <Button
              onClick={() => {
                setEditingDock(null);
                setShowForm(true);
              }}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Dock
            </Button>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Company Selection */}
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
                      <SelectTrigger id="company-select" className="w-full">
                        <SelectValue placeholder="Choose a company..." />
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

                {/* Warehouse Selection */}
                <div className="flex items-center space-x-4">
                  <WarehouseIcon className="w-5 h-5 text-blue-600" />
                  <div className="flex-1">
                    <Label htmlFor="warehouse-select" className="text-sm font-medium text-slate-700 mb-2 block">
                      Select Warehouse
                    </Label>
                    <Select 
                      value={selectedWarehouseId} 
                      onValueChange={handleWarehouseChange}
                      disabled={!selectedCompanyId || isLoadingWarehouses}
                    >
                      <SelectTrigger id="warehouse-select" className="w-full">
                        <SelectValue placeholder={
                          !selectedCompanyId ? "Select company first" :
                          isLoadingWarehouses ? "Loading..." : "Choose a warehouse..."
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
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
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
              Choose a company from the dropdown above to manage its docks
            </p>
          </motion.div>
        ) : !selectedWarehouseId ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center py-12"
          >
            <WarehouseIcon className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Select a Warehouse</h3>
            <p className="text-slate-600">
              Choose a warehouse from the dropdown above to manage its docks
            </p>
          </motion.div>
        ) : (
          <>
            {showForm && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
                <DockForm
                  dock={editingDock}
                  onSubmit={handleFormSubmit}
                  onCancel={() => {
                    setShowForm(false);
                    setEditingDock(null);
                  }}
                  vehicleTypes={vehicleTypes}
                />
              </motion.div>
            )}

            <DockList
              docks={docks}
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