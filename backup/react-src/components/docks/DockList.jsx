import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Pencil, Trash2, Clock, CheckCircle, XCircle, ArrowLeftRight, ArrowRight, ArrowLeft, Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function DockList({ docks, onEdit, onDelete, onToggleActive, isLoading }) {
  const getMovementTypeStyle = (movementType) => {
    switch (movementType) {
      case 'Inwards':
        return {
          icon: <ArrowRight className="w-3 h-3 mr-1" />,
          className: "bg-blue-100 text-blue-800"
        };
      case 'Outwards':
        return {
          icon: <ArrowLeft className="w-3 h-3 mr-1" />,
          className: "bg-orange-100 text-orange-800"
        };
      case 'Both':
      default:
        return {
          icon: <ArrowLeftRight className="w-3 h-3 mr-1" />,
          className: "bg-green-100 text-green-800"
        };
    }
  };
  
  if (isLoading) {
    return (
      <div className="grid gap-4">
        {[...Array(2)].map((_, i) => (
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

  if (docks.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-slate-900 mb-2">No docks configured</h3>
        <p className="text-slate-600">Click "Add New Dock" to get started.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {docks.map((dock, index) => {
        const movementStyle = getMovementTypeStyle(dock.movement_type || 'Both');
        
        return (
          <motion.div
            key={dock.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="shadow-md border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="font-semibold text-slate-900 text-lg">{dock.name}</h3>
                    <Badge className={dock.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                      {dock.is_active ? <CheckCircle className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                      {dock.is_active ? "Active" : "Inactive"}
                    </Badge>
                    <Badge className={`${movementStyle.className} flex items-center`}>
                      {movementStyle.icon}
                      {dock.movement_type || 'Both'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-slate-600 mt-2 mb-3">
                    <Clock className="w-4 h-4" />
                    <span>{`${String(dock.start_hour).padStart(2, '0')}:00 - ${String(dock.end_hour).padStart(2, '0')}:00`}</span>
                  </div>

                  {dock.vehicle_type_names && dock.vehicle_type_names.length > 0 && (
                    <div className="flex items-start space-x-2 text-sm text-slate-600">
                      <Truck className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <div className="flex flex-wrap gap-1">
                        {dock.vehicle_type_names.map((vehicleType, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs px-2 py-1">
                            {vehicleType}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">Active</span>
                    <Switch
                      checked={dock.is_active}
                      onCheckedChange={() => onToggleActive(dock)}
                    />
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => onEdit(dock)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700" onClick={() => onDelete(dock.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}