import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Pencil, Trash2, Building, CheckCircle, XCircle, Mail, Phone, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function CompanyList({ companies, onEdit, onDelete, onToggleActive, isLoading }) {
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

  if (companies.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Building className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-xl font-semibold text-slate-900 mb-2">No companies configured</h3>
        <p className="text-slate-600">Click "Add New Company" to get started.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {companies.map((company, index) => (
        <motion.div
          key={company.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Card className="shadow-md border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap mb-3">
                    <Building className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-slate-900 text-lg">{company.name}</h3>
                    <Badge className="bg-slate-100 text-slate-800 font-mono text-xs">
                      {company.code}
                    </Badge>
                    <Badge className={company.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                      {company.is_active ? <CheckCircle className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                      {company.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm text-slate-600">
                    {company.contact_email && (
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4" />
                        <span>{company.contact_email}</span>
                      </div>
                    )}
                    {company.phone && (
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4" />
                        <span>{company.phone}</span>
                      </div>
                    )}
                    {company.address && (
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4" />
                        <span className="truncate">{company.address}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 w-full lg:w-auto">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">Active</span>
                    <Switch
                      checked={company.is_active}
                      onCheckedChange={() => onToggleActive(company)}
                    />
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => onEdit(company)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-red-500 hover:text-red-700" 
                    onClick={() => onDelete(company.id)}
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