import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { useNavigate } from "react-router-dom";
import { Carrier } from "@/api/entities";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import CarrierForm from "../components/carriers/CarrierForm";
import CarrierList from "../components/carriers/CarrierList";
import { createPageUrl } from "@/utils";

export default function CarriersPage() {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [carriers, setCarriers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCarrier, setEditingCarrier] = useState(null);

  useEffect(() => {
    const checkAuthAndLoad = async () => {
      try {
        await User.me();
        setIsAuthorized(true);
        loadCarriers();
      } catch (error) {
        navigate(createPageUrl("Booking"));
      }
    };
    checkAuthAndLoad();
  }, [navigate]);

  const loadCarriers = async () => {
    setIsLoading(true);
    const data = await Carrier.list();
    setCarriers(data);
    setIsLoading(false);
  };

  const handleEdit = (carrier) => {
    setEditingCarrier(carrier);
    setShowForm(true);
  };

  const handleDelete = async (carrierId) => {
    if (window.confirm("Are you sure you want to delete this carrier? This action cannot be undone.")) {
      await Carrier.delete(carrierId);
      loadCarriers();
    }
  };
  
  const handleToggleActive = async (carrier) => {
    await Carrier.update(carrier.id, { is_active: !carrier.is_active });
    loadCarriers();
  };

  const handleFormSubmit = async (carrierData) => {
    if (editingCarrier) {
      await Carrier.update(editingCarrier.id, carrierData);
    } else {
      await Carrier.create(carrierData);
    }
    setShowForm(false);
    setEditingCarrier(null);
    loadCarriers();
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
              Carrier Management
            </h1>
            <p className="text-lg text-slate-600">
              Manage delivery carriers and their details
            </p>
          </div>
          <Button
            onClick={() => {
              setEditingCarrier(null);
              setShowForm(true);
            }}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Carrier
          </Button>
        </motion.div>

        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
            <CarrierForm
              carrier={editingCarrier}
              onSubmit={handleFormSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingCarrier(null);
              }}
            />
          </motion.div>
        )}

        <CarrierList
          carriers={carriers}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleActive={handleToggleActive}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}