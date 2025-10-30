import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Pencil, Trash2, Truck, CheckCircle, XCircle, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function VehicleTypeList({ vehicleTypes, onEdit, onDelete, onToggleActive, isLoading }) {
  if (isLoading) {
    return (
      <div className="grid gap-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4 flex justify-between items-center">
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
              <div className="h-8 w-20 bg-gray-200 rounded-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (vehicleTypes.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Truck className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-xl font-semibold text-slate-900 mb-2">No vehicle types configured</h3>
        <p className="text-slate-600">Click "Add Vehicle Type" to get started.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {vehicleTypes.map((vehicleType, index) => (
        <motion.div
          key={vehicleType.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Card className="shadow-md border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap mb-3">
                    <Truck className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-slate-900 text-lg">{vehicleType.name}</h3>
                    <Badge className="bg-slate-100 text-slate-800 font-mono text-xs">
                      {vehicleType.code}
                    </Badge>
                    <Badge className={vehicleType.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                      {vehicleType.is_active ? <CheckCircle className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                      {vehicleType.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-600">
                    <div className="flex items-center space-x-2">
                      <Package className="w-4 h-4" />
                      <span>Max {vehicleType.max_pallets} pallets</span>
                    </div>
                    {vehicleType.description && (
                      <div className="flex items-center space-x-2">
                        <span className="truncate">{vehicleType.description}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 w-full lg:w-auto">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">Active</span>
                    <Switch
                      checked={vehicleType.is_active}
                      onCheckedChange={() => onToggleActive(vehicleType)}
                    />
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => onEdit(vehicleType)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-red-500 hover:text-red-700" 
                    onClick={() => onDelete(vehicleType.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}