
import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { Company } from "@/api/entities";
import { Warehouse } from "@/api/entities";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, Building } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import WarehouseForm from "../components/warehouses/WarehouseForm";
import WarehouseList from "../components/warehouses/WarehouseList";
import { createPageUrl } from "@/utils";

export default function WarehousesPage() {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [warehouses, setWarehouses] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState(null);
  const [selectedCompanyId, setSelectedCompanyId] = useState("");

  useEffect(() => {
    const checkAuthAndLoad = async () => {
      try {
        const user = await User.me();
        setCurrentUser(user);
        setIsAuthorized(true);
        
        // Check if user has admin privileges
        if (user.role !== 'admin' && user.role !== 'company_admin') {
          navigate(createPageUrl("Schedule"));
          return;
        }

        await loadCompanies(user);
        
        // Set initial company selection
        if (user.company_id) {
          setSelectedCompanyId(user.company_id);
        }
      } catch (error) {
        navigate(createPageUrl("Booking"));
      }
    };
    checkAuthAndLoad();
  }, [navigate]);

  useEffect(() => {
    if (currentUser && selectedCompanyId) {
      loadWarehouses();
    } else if (currentUser && !currentUser.company_id) {
      // Super admin with no company selected - show no warehouses
      setWarehouses([]);
      setIsLoading(false);
    }
  }, [currentUser, selectedCompanyId]);

  const loadCompanies = async (user) => {
    let companyFilter = { is_active: true };
    if (user && user.company_id) {
      companyFilter.id = user.company_id;
    }
    
    const data = await Company.filter(companyFilter);
    setCompanies(data);
  };

  const loadWarehouses = async () => {
    if (!selectedCompanyId) {
      setWarehouses([]);
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    try {
      const data = await Warehouse.filter({ company_id: selectedCompanyId });
      setWarehouses(data);
    } catch (error) {
      console.error('Error loading warehouses:', error);
      setWarehouses([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (warehouse) => {
    setEditingWarehouse(warehouse);
    setShowForm(true);
  };

  const handleDelete = async (warehouseId) => {
    if (window.confirm("Are you sure you want to delete this warehouse? This action cannot be undone.")) {
      await Warehouse.delete(warehouseId);
      loadWarehouses();
    }
  };
  
  const handleToggleActive = async (warehouse) => {
    await Warehouse.update(warehouse.id, { is_active: !warehouse.is_active });
    loadWarehouses();
  };

  const handleFormSubmit = async (warehouseData) => {
    // Ensure company information is included
    const selectedCompany = companies.find(c => c.id === selectedCompanyId);
    const dataWithCompany = {
      ...warehouseData,
      company_id: selectedCompanyId,
      company_name: selectedCompany?.name || ''
    };

    if (editingWarehouse) {
      await Warehouse.update(editingWarehouse.id, dataWithCompany);
    } else {
      await Warehouse.create(dataWithCompany);
    }
    setShowForm(false);
    setEditingWarehouse(null);
    loadWarehouses();
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const selectedCompany = companies.find(c => c.id === selectedCompanyId);

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
              Warehouse Management
            </h1>
            <p className="text-lg text-slate-600">
              Manage warehouses and their configurations
            </p>
          </div>
        </motion.div>

        {/* Company Selection for Super Admins */}
        {currentUser && !currentUser.company_id && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <Card className="shadow-md border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex items-center space-x-2">
                  <Building className="w-5 h-5 text-blue-600" />
                  <Label htmlFor="company-select" className="font-semibold text-slate-700">Select Company</Label>
                </div>
                <Select
                  value={selectedCompanyId}
                  onValueChange={setSelectedCompanyId}
                >
                  <SelectTrigger id="company-select" className="w-full sm:w-[350px] bg-white">
                    <SelectValue placeholder="Choose a company to manage warehouses" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map(company => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name} ({company.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Add New Warehouse Button - Only show when company is selected */}
        {selectedCompanyId && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex justify-between items-center mb-8"
          >
            <div>
              {selectedCompany && (
                <h2 className="text-xl font-semibold text-slate-800">
                  Warehouses for {selectedCompany.name}
                </h2>
              )}
            </div>
            <Button
              onClick={() => {
                setEditingWarehouse(null);
                setShowForm(true);
              }}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Warehouse
            </Button>
          </motion.div>
        )}

        {/* Warehouse Form */}
        {showForm && selectedCompanyId && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
            <WarehouseForm
              warehouse={editingWarehouse}
              onSubmit={handleFormSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingWarehouse(null);
              }}
              companies={companies}
              currentUser={currentUser}
            />
          </motion.div>
        )}

        {/* Content based on selection */}
        {!selectedCompanyId ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Select a Company</h3>
            <p className="text-slate-600">
              Choose a company from the dropdown above to manage its warehouses
            </p>
          </motion.div>
        ) : (
          <WarehouseList
            warehouses={warehouses}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleActive={handleToggleActive}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
}
