import React from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  ToggleLeft,
  ToggleRight,
  ClipboardList,
  Building,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export default function WarehouseList({ warehouses, onEdit, onDelete, onToggleActive, isLoading }) {
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-600">Loading warehouses...</p>
      </div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="shadow-md border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ClipboardList className="w-6 h-6 text-blue-600" />
            <span>Warehouse List</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="hidden sm:table-cell">Code</TableHead>
                <TableHead className="hidden md:table-cell">Contact</TableHead>
                <TableHead className="hidden md:table-cell">Hours</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {warehouses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan="7" className="text-center h-24">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Building className="w-10 h-10 text-slate-400" />
                      <p className="text-slate-600">No warehouses found for this company.</p>
                      <p className="text-sm text-slate-500">Click "Add New Warehouse" to get started.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                warehouses.map((warehouse) => (
                  <TableRow key={warehouse.id}>
                    <TableCell className="font-mono text-xs text-slate-500">{warehouse.id}</TableCell>
                    <TableCell className="font-medium">{warehouse.name}</TableCell>
                    <TableCell className="hidden sm:table-cell">{warehouse.code}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="text-sm text-slate-600">{warehouse.contact_email}</div>
                      <div className="text-xs text-slate-500">{warehouse.contact_phone}</div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {warehouse.operating_hours_start}:00 - {warehouse.operating_hours_end}:00
                    </TableCell>
                    <TableCell>
                      <Badge variant={warehouse.is_active ? "default" : "secondary"}>
                        {warehouse.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onEdit(warehouse)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            <span>Edit</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onToggleActive(warehouse)}>
                            {warehouse.is_active ? (
                              <ToggleLeft className="mr-2 h-4 w-4" />
                            ) : (
                              <ToggleRight className="mr-2 h-4 w-4" />
                            )}
                            <span>{warehouse.is_active ? 'Set Inactive' : 'Set Active'}</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onDelete(warehouse.id)} className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
}