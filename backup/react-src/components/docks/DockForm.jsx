
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, X, UploadCloud, Loader2 } from "lucide-react";
import { UploadFile } from "@/api/integrations";
import { Textarea } from "@/components/ui/textarea";
import HelpPopup from "../help/HelpPopup";
import DockFormHelp from "../help/DockFormHelp";

export default function DockForm({ dock, onSubmit, onCancel, vehicleTypes }) {
  const [formData, setFormData] = useState({
    name: '',
    start_hour: '7',
    end_hour: '17',
    movement_type: 'Both',
    vehicle_type_ids: [],
    image_url: '',
    additional_info: ''
  });
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (dock) {
      setFormData({
        name: dock.name || '',
        start_hour: String(dock.start_hour || '7'),
        end_hour: String(dock.end_hour || '17'),
        movement_type: dock.movement_type || 'Both',
        vehicle_type_ids: dock.vehicle_type_ids || [],
        image_url: dock.image_url || '',
        additional_info: dock.additional_info || ''
      });
    } else {
       setFormData({
        name: '',
        start_hour: '7',
        end_hour: '17',
        movement_type: 'Both',
        vehicle_type_ids: [],
        image_url: '',
        additional_info: ''
      });
    }
  }, [dock]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const { file_url } = await UploadFile({ file });
      setFormData(prev => ({ ...prev, image_url: file_url }));
    } catch (error) {
      console.error("Image upload failed:", error);
      alert("Image upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedVehicleTypes = vehicleTypes.filter(vt => formData.vehicle_type_ids.includes(vt.id));
    const dataToSubmit = {
      ...formData,
      start_hour: parseInt(formData.start_hour),
      end_hour: parseInt(formData.end_hour),
      vehicle_type_names: selectedVehicleTypes.map(vt => vt.name)
    };
    onSubmit(dataToSubmit);
  };

  const handleVehicleTypeToggle = (vehicleTypeId) => {
    setFormData(prev => ({
      ...prev,
      vehicle_type_ids: prev.vehicle_type_ids.includes(vehicleTypeId)
        ? prev.vehicle_type_ids.filter(id => id !== vehicleTypeId)
        : [...prev.vehicle_type_ids, vehicleTypeId]
    }));
  };

  const hours = Array.from({ length: 25 }, (_, i) => String(i));

  return (
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{dock ? "Edit Dock" : "Add New Dock"}</CardTitle>
            <HelpPopup title="Dock Configuration Help">
              <DockFormHelp />
            </HelpPopup>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Dock Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Dock 1, North Bay"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="movement_type">Movement Type</Label>
                <Select
                  value={formData.movement_type}
                  onValueChange={(value) => setFormData({ ...formData, movement_type: value })}
                >
                  <SelectTrigger id="movement_type"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Inwards">Inwards Only</SelectItem>
                    <SelectItem value="Outwards">Outwards Only</SelectItem>
                    <SelectItem value="Both">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="start_hour">Opening Hour</Label>
                <Select
                  value={formData.start_hour}
                  onValueChange={(value) => setFormData({ ...formData, start_hour: value })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {hours.slice(0, 24).map(hour => (
                      <SelectItem key={`start-${hour}`} value={hour}>{`${hour.padStart(2, '0')}:00`}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="end_hour">Closing Hour</Label>
                <Select
                  value={formData.end_hour}
                  onValueChange={(value) => setFormData({ ...formData, end_hour: value })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {hours.map(hour => (
                      <SelectItem key={`end-${hour}`} value={hour}>{`${hour.padStart(2, '0')}:00`}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Allowed Vehicle Types</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-2">
                  {vehicleTypes.map(vehicleType => (
                    <div key={vehicleType.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`vehicle-${vehicleType.id}`}
                        checked={formData.vehicle_type_ids.includes(vehicleType.id)}
                        onChange={() => handleVehicleTypeToggle(vehicleType.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor={`vehicle-${vehicleType.id}`} className="text-sm text-slate-700">
                        {vehicleType.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="dock-image">Dock Image</Label>
                <div className="flex items-center space-x-4">
                  <Input 
                    id="dock-image" 
                    type="file" 
                    onChange={handleImageUpload} 
                    disabled={isUploading}
                    className="flex-1"
                  />
                  {isUploading && <Loader2 className="w-5 h-5 animate-spin text-blue-500" />}
                </div>
                {formData.image_url && !isUploading && (
                  <div className="mt-2 relative w-48 h-32">
                    <img src={formData.image_url} alt="Dock preview" className="rounded-lg h-full w-full object-cover shadow-md" />
                  </div>
                )}
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="additional_info">Additional Information</Label>
                <Textarea
                  id="additional_info"
                  value={formData.additional_info}
                  onChange={(e) => setFormData({ ...formData, additional_info: e.target.value })}
                  placeholder="e.g., Please reverse into bay. Report to Gatehouse B on arrival."
                  maxLength="500"
                  className="h-24"
                />
                <p className="text-xs text-slate-500 mt-1 text-right">
                  {formData.additional_info.length} / 500 characters
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2 mt-6">
              <Button type="button" variant="ghost" onClick={onCancel}>
                <X className="w-4 h-4 mr-2" /> Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white" disabled={isUploading}>
                {isUploading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save Dock
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
