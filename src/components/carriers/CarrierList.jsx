import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Pencil, Trash2, Phone, Mail, MapPin, Truck } from "lucide-react";

export default function CarrierList({ carriers, onEdit, onDelete, onToggleActive, isLoading }) {
  if (isLoading) {
    return <div>Loading carriers...</div>;
  }
  
  if (!carriers || carriers.length === 0) {
    return (
      <div className="text-center py-12">
        <Truck className="w-16 h-16 text-slate-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-slate-900 mb-2">No Carriers Found</h3>
        <p className="text-slate-600">
          Get started by adding a new carrier.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {carriers.map(carrier => (
        <motion.div
          key={carrier.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="shadow-md border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row justify-between sm:items-start">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-slate-900">{carrier.name}</h3>
                    <Badge variant={carrier.is_active ? "default" : "secondary"}>
                      {carrier.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div className="space-y-1 text-sm text-slate-600">
                    {carrier.address && (
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4" />
                        <span>{carrier.address}</span>
                      </div>
                    )}
                    {carrier.email && (
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4" />
                        <span>{carrier.email}</span>
                      </div>
                    )}
                    {carrier.phone_number && (
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4" />
                        <span>{carrier.phone_number}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-slate-600">Active</span>
                    <Switch
                      checked={carrier.is_active}
                      onCheckedChange={() => onToggleActive(carrier)}
                    />
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => onEdit(carrier)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(carrier.id)} className="text-red-500 hover:text-red-600">
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