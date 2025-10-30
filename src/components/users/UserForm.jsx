
import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import HelpPopup from "../help/HelpPopup";
import UserFormHelp from "../help/UserFormHelp";
import { Shield, Building, Warehouse, Mail, Phone, Key, Copy, Check } from "lucide-react";
import { MultiSelect } from "@/components/ui/MultiSelect";

export default function UserForm({ user, companies, warehouses, onSubmit, onCancel }) {
  const [editedUser, setEditedUser] = useState(user);
  const [apiKey, setApiKey] = useState(user?.api_key || '');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setEditedUser(user);
    setApiKey(user?.api_key || '');
  }, [user]);

  const handleInputChange = (field, value) => {
    // Handle company deselection
    if (field === 'company_id' && (value === '' || value === null)) {
      setEditedUser(prev => ({ 
        ...prev, 
        company_id: null,
        company_name: null,
        warehouse_ids: [],
        warehouse_names: []
      }));
      return;
    }
    
    // Handle normal company selection
    if (field === 'company_id' && value) {
      const selectedCompany = companies.find(c => c.id === value);
      setEditedUser(prev => ({ 
        ...prev, 
        company_id: value,
        company_name: selectedCompany?.name || '',
        warehouse_ids: [],
        warehouse_names: []
      }));
      return;
    }

    setEditedUser(prev => ({ ...prev, [field]: value }));
  };
  
  const handleWarehouseChange = (selectedIds) => {
    const selectedWarehouses = warehouses.filter(w => selectedIds.includes(w.id));
    const selectedNames = selectedWarehouses.map(w => w.name);
    setEditedUser(prev => ({ ...prev, warehouse_ids: selectedIds, warehouse_names: selectedNames }));
  }
  
  const generateApiKey = () => {
    const newKey = 'psk_' + [...Array(32)].map(() => Math.random().toString(36)[2]).join('');
    setApiKey(newKey);
    handleInputChange('api_key', newKey);
  };
  
  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(editedUser);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Edit User: {user.full_name}</CardTitle>
          <HelpPopup title="User Management Help">
            <UserFormHelp />
          </HelpPopup>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="role" className="text-sm font-medium text-slate-700">Role</Label>
                <Select
                  value={editedUser.role || ''}
                  onValueChange={(value) => handleInputChange('role', value)}
                >
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="company_admin">Company Admin</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="api">API User</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="company_id" className="text-sm font-medium text-slate-700">Company</Label>
                <Select
                  value={editedUser.company_id || ''}
                  onValueChange={(value) => handleInputChange('company_id', value)}
                  disabled={companies.length === 1}
                >
                  <SelectTrigger id="company_id">
                    <SelectValue placeholder="Select a company" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={null}>No Company Assigned</SelectItem>
                    {companies.map(company => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-slate-500">
                  Users without a company can only access the booking and schedule pages
                </p>
              </div>
            </div>

            {editedUser.company_id && (
              <div className="space-y-2">
                <Label htmlFor="warehouse_ids" className="text-sm font-medium text-slate-700">Assigned Warehouses</Label>
                <MultiSelect
                  options={warehouses.map(w => ({ value: w.id, label: w.name }))}
                  selected={editedUser.warehouse_ids || []}
                  onChange={handleWarehouseChange}
                  placeholder="Select warehouses for this user..."
                  className="w-full"
                />
                 <p className="text-xs text-slate-500 mt-1">Leave empty to grant access to all warehouses within the company.</p>
              </div>
            )}

            {editedUser.role === 'api' && (
              <div className="space-y-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <Label htmlFor="api_key" className="text-sm font-medium text-slate-700 flex items-center">
                  <Key className="w-4 h-4 mr-2 text-blue-600" />
                  API Key
                </Label>
                <p className="text-xs text-blue-700">This key is used for programmatic access. It should be treated like a password.</p>
                <div className="flex gap-2 items-center">
                  <Input id="api_key" value={apiKey} readOnly className="font-mono bg-white" />
                  <Button type="button" variant="outline" onClick={handleCopy}>
                    {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                  </Button>
                  <Button type="button" onClick={generateApiKey}>Generate New Key</Button>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
