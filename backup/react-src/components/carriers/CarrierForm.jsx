
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Truck } from "lucide-react"; // Added Truck icon
import HelpPopup from "../help/HelpPopup"; // Added HelpPopup import
import CarrierFormHelp from "../help/CarrierFormHelp"; // Added CarrierFormHelp import

export default function CarrierForm({ carrier, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    email: '',
    phone_number: '',
  });

  useEffect(() => {
    if (carrier) {
      setFormData({
        name: carrier.name || '',
        address: carrier.address || '',
        email: carrier.email || '',
        phone_number: carrier.phone_number || '',
      });
    } else {
      setFormData({
        name: '',
        address: '',
        email: '',
        phone_number: '',
      });
    }
  }, [carrier]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Truck className="w-5 h-5 text-blue-600" />
              <span>{carrier ? 'Edit Carrier' : 'Add New Carrier'}</span>
            </div>
            <HelpPopup title="Carrier Management Help">
              <CarrierFormHelp />
            </HelpPopup>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Carrier Name</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="e.g., FedEx, UPS" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea id="address" name="address" value={formData.address} onChange={handleChange} placeholder="123 Main St, Anytown, USA" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="contact@carrier.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone_number">Phone Number</Label>
              <Input id="phone_number" name="phone_number" value={formData.phone_number} onChange={handleChange} placeholder="(555) 555-5555" />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit">{carrier ? "Save Changes" : "Create Carrier"}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
