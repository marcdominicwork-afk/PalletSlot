
import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { Company } from "@/api/entities";
import { Warehouse } from "@/api/entities"; // Added Warehouse import
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, Building } from "lucide-react";
import UserForm from "../components/users/UserForm";
import UserList from "../components/users/UserList";
import { createPageUrl } from "@/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

export default function UsersPage() {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); // State to store the current authenticated user
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedCompanyId, setSelectedCompanyId] = useState(""); // Changed initial state to ""
  const [warehouses, setWarehouses] = useState([]); // Added state for warehouses

  useEffect(() => {
    const checkAuthAndLoad = async () => {
      try {
        // This call checks if the user is authorized/logged in and fetches user data
        const user = await User.me();
        setCurrentUser(user); // Store the current user data
        setIsAuthorized(true);
        loadCompanies(user);
        // Initial load of users will be triggered by the other useEffect
      } catch (error) {
        // If not authorized, redirect to a public page
        navigate(createPageUrl("Booking"));
      }
    };
    checkAuthAndLoad();
  }, [navigate]);

  useEffect(() => {
    if (currentUser) {
      loadUsers(currentUser);
    }
  }, [currentUser, selectedCompanyId]);

  const loadUsers = async (user) => { // Accept user as argument
    if (!user) return;
    setIsLoading(true);
    
    // Filter users based on current user permissions
    let userFilter = {};
    if (user.role === 'admin' && user.company_id) {
      // Company Admin: sees only their company's users
      userFilter.company_id = user.company_id;
    } else if (user.role === 'admin' && !user.company_id) {
      // Super Admin: filters by dropdown selection or shows unassigned users
      if (selectedCompanyId === "" || selectedCompanyId === null) {
        // If the initial state (empty string) OR if 'Show Users without a Company' (value=null) is explicitly selected
        userFilter.company_id = null; // Filter for users without a company
      } else {
        // A specific company ID is selected
        userFilter.company_id = selectedCompanyId;
      }
    } else if (user.company_id) {
       // Regular user or non-admin role with a company
      userFilter.company_id = user.company_id;
    }
    
    const data = await User.filter(userFilter); // Changed from User.list() to User.filter()
    setUsers(data);
    setIsLoading(false);
  };

  const loadCompanies = async (user) => { // Accept user as argument
    // Load companies based on user permissions
    let companyFilter = { is_active: true };
    if (user && user.company_id && user.role !== 'admin') {
      // A non-admin user should only see their own company (if applicable for other forms/views)
      companyFilter.id = user.company_id;
    }
    // A super-admin will not have user.company_id, so they will get all companies
    // A company-admin will have user.company_id, and see all companies unless we restrict it.
    // The current logic works: if admin has company, only show that company in edit form. if not, show all.
    if (user && user.company_id) { 
      companyFilter.id = user.company_id;
    }
    
    const data = await Company.filter(companyFilter);
    setCompanies(data);
  };

  const handleEdit = async (user) => { // Made handleEdit async
    setEditingUser(user);
    if (user.company_id) {
      // Fetch warehouses for the selected user's company
      const warehouseData = await Warehouse.filter({ company_id: user.company_id, is_active: true });
      setWarehouses(warehouseData);
    } else {
      setWarehouses([]); // Clear warehouses if no company_id is associated with the user
    }
  };

  const handleToggleActive = async (user) => {
    await User.update(user.id, { is_active: !user.is_active });
    loadUsers(currentUser); // Pass currentUser here to re-filter correctly
  };

  const handleFormSubmit = async (userData) => {
    if (editingUser) {
      await User.update(editingUser.id, userData);
    }
    setEditingUser(null); // Hide form on submit
    setWarehouses([]); // Clear warehouses after form submission
    loadUsers(currentUser); // Pass currentUser here to re-filter correctly
  };

  // Display a loader while checking for authorization
  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
        >
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
              User Management
            </h1>
            <p className="text-lg text-slate-600">
              Manage user accounts. New users must be invited via Workspace Settings.
            </p>
          </div>
          <div className="text-sm text-slate-600 bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="font-medium text-blue-800 mb-1">Access Control:</p>
            <p>• Public: Driver Arrival, Book Slot</p>
            <p>• Logged In: Schedule, Companies, Docks, Users</p>
          </div>
        </motion.div>

        {currentUser && currentUser.role === 'admin' && !currentUser.company_id && (
           <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
           >
            <Card className="shadow-md border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex items-center space-x-2">
                  <Building className="w-5 h-5 text-blue-600" />
                  <Label htmlFor="company-filter" className="font-semibold text-slate-700">Filter Users by Company</Label>
                </div>
                <Select
                  value={selectedCompanyId}
                  onValueChange={setSelectedCompanyId}
                >
                  <SelectTrigger id="company-filter" className="w-full sm:w-[350px] bg-white">
                    <SelectValue placeholder="Show Users without a Company" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={null}>Show Users without a Company</SelectItem>
                    {companies.map(company => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
           </motion.div>
        )}

        {editingUser && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
            <UserForm
              user={editingUser}
              companies={companies}
              warehouses={warehouses} // Passed warehouses to UserForm
              onSubmit={handleFormSubmit}
              onCancel={() => {
                setEditingUser(null);
                setWarehouses([]); // Clear warehouses when canceling edit
              }}
            />
          </motion.div>
        )}

        <UserList
          users={users}
          onEdit={handleEdit}
          onToggleActive={handleToggleActive}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
