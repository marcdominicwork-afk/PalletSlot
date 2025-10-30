
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Pencil, User, CheckCircle, XCircle, Mail, Phone, Briefcase, Shield, UserCheck, Building, Warehouse } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function UserList({ users, onEdit, onToggleActive, isLoading }) {
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

  if (users.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-xl font-semibold text-slate-900 mb-2">No users found</h3>
        <p className="text-slate-600">Users must be invited via Workspace Settings.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {users.map((user, index) => (
        <motion.div
          key={user.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Card className="shadow-md border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap mb-3">
                    <User className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-slate-900 text-lg">{user.full_name}</h3>
                    <Badge className={user.role === 'admin' ? "bg-purple-100 text-purple-800" : "bg-slate-100 text-slate-800"}>
                      {user.role === 'admin' ? <Shield className="w-3 h-3 mr-1" /> : <UserCheck className="w-3 h-3 mr-1" />}
                      {user.role}
                    </Badge>
                    <Badge className={user.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                      {user.is_active ? <CheckCircle className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                      {user.is_active ? "Active" : "Inactive"}
                    </Badge>
                    {!user.company_id && (
                      <Badge className="bg-amber-100 text-amber-800">
                        Unassigned
                      </Badge>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm text-slate-600">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4" />
                      <span>{user.email}</span>
                    </div>
                    {user.company_name ? (
                      <div className="flex items-center space-x-2">
                        <Building className="w-4 h-4" />
                        <span>{user.company_name}</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Building className="w-4 h-4 text-amber-500" />
                        <span className="text-amber-600 font-medium">No Company Assigned</span>
                      </div>
                    )}
                    {user.department && (
                      <div className="flex items-center space-x-2">
                        <Briefcase className="w-4 h-4" />
                        <span>{user.department}</span>
                      </div>
                    )}
                    {user.phone && (
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4" />
                        <span>{user.phone}</span>
                      </div>
                    )}
                  </div>
                  {user.warehouse_names && user.warehouse_names.length > 0 && (
                      <div className="flex items-start space-x-2 mt-3 pt-3 border-t">
                        <Warehouse className="w-4 h-4 mt-1" />
                        <div className="flex flex-wrap gap-1">
                            {user.warehouse_names.map(name => (
                                <Badge key={name} variant="secondary">{name}</Badge>
                            ))}
                        </div>
                      </div>
                  )}
                   {user.last_login && (
                      <div className="flex items-center space-x-2 text-xs text-slate-500 col-span-full mt-3 pt-3 border-t">
                        <span>Last login: {format(new Date(user.last_login), 'MMM d, yyyy')}</span>
                      </div>
                    )}
                </div>
                
                <div className="flex items-center gap-2 w-full lg:w-auto">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">Active</span>
                    <Switch
                      checked={user.is_active}
                      onCheckedChange={() => onToggleActive(user)}
                    />
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => onEdit(user)}>
                    <Pencil className="w-4 h-4" />
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
