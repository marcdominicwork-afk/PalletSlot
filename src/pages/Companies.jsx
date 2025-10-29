
import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { useNavigate } from "react-router-dom";
import { Company } from "@/api/entities";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import CompanyForm from "../components/companies/CompanyForm";
import CompanyList from "../components/companies/CompanyList";
import { createPageUrl } from "@/utils";

export default function CompaniesPage() {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); // Added currentUser state
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);

  useEffect(() => {
    const checkAuthAndLoad = async () => {
      try {
        const user = await User.me(); // This call checks if the user is authorized/logged in
        setCurrentUser(user); // Set the current user
        setIsAuthorized(true);

        // Company-specific users cannot access company management
        if (user.role !== 'admin' && user.company_id) {
          navigate(createPageUrl("Schedule")); // Redirect to Schedule page
          return; // Stop further execution for unauthorized company users
        }

        loadCompanies();
      } catch (error) {
        console.error("Authorization failed:", error); // Log the error for debugging
        navigate(createPageUrl("Booking")); // Redirect to Booking page if not authorized at all
      }
    };
    checkAuthAndLoad();
  }, [navigate]);

  const loadCompanies = async () => {
    setIsLoading(true);
    const data = await Company.list();
    setCompanies(data);
    setIsLoading(false);
  };

  const handleEdit = (company) => {
    setEditingCompany(company);
    setShowForm(true);
  };

  const handleDelete = async (companyId) => {
    if (window.confirm("Are you sure you want to delete this company? This action cannot be undone.")) {
      await Company.delete(companyId);
      loadCompanies();
    }
  };
  
  const handleToggleActive = async (company) => {
    await Company.update(company.id, { is_active: !company.is_active });
    loadCompanies();
  };

  const handleFormSubmit = async (companyData) => {
    if (editingCompany) {
      await Company.update(editingCompany.id, companyData);
    } else {
      await Company.create(companyData);
    }
    setShowForm(false);
    setEditingCompany(null);
    loadCompanies();
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
        >
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
              Company Management
            </h1>
            <p className="text-lg text-slate-600">
              Manage companies and their dock access
            </p>
          </div>
          <Button
            onClick={() => {
              setEditingCompany(null);
              setShowForm(true);
            }}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Company
          </Button>
        </motion.div>

        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
            <CompanyForm
              company={editingCompany}
              onSubmit={handleFormSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingCompany(null);
              }}
            />
          </motion.div>
        )}

        <CompanyList
          companies={companies}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleActive={handleToggleActive}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
