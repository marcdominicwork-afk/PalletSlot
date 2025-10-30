import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Building, Shield, Mail, Phone, UserCheck } from "lucide-react";

export default function UserFormHelp() {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">Managing Users</h3>
        <p className="text-blue-800">
          Assign users to companies and set their roles. Users must first be invited through 
          Workspace Settings before they can be assigned to companies here.
        </p>
      </div>

      <div className="bg-amber-50 p-4 rounded-lg">
        <h4 className="font-semibold text-amber-900 mb-2">Important: User Invitation Process</h4>
        <ol className="text-sm text-amber-800 space-y-1 list-decimal list-inside">
          <li>First, invite users via <strong>Workspace → Settings → Users</strong></li>
          <li>Users receive email invitation and create their account</li>
          <li>Then use this page to assign them to companies and set roles</li>
        </ol>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-4">
            <h4 className="font-semibold text-slate-900 mb-3 flex items-center">
              <Building className="w-4 h-4 mr-2 text-blue-600" />
              Company Assignment
            </h4>
            <p className="text-sm text-slate-600 mb-3">
              Assign users to specific companies to control their access.
            </p>
            <div className="space-y-2 text-xs text-slate-600">
              <div><strong>Company:</strong> Select which company this user belongs to</div>
              <div><strong>Effect:</strong> User will only see data for their assigned company</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h4 className="font-semibold text-slate-900 mb-3 flex items-center">
              <Shield className="w-4 h-4 mr-2 text-blue-600" />
              User Roles
            </h4>
            <p className="text-sm text-slate-600 mb-3">
              Set the appropriate access level for each user.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Badge className="bg-purple-100 text-purple-800 text-xs">Admin</Badge>
                <span className="text-xs text-slate-600">Full system access, all companies</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className="bg-blue-100 text-blue-800 text-xs">User</Badge>
                <span className="text-xs text-slate-600">Company-specific access only</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h4 className="font-semibold text-slate-900 mb-3 flex items-center">
              <User className="w-4 h-4 mr-2 text-blue-600" />
              User Information
            </h4>
            <p className="text-sm text-slate-600 mb-3">
              Basic user details and contact information.
            </p>
            <div className="space-y-2 text-xs text-slate-600">
              <div><strong>Name & Email:</strong> Cannot be changed here (set during invitation)</div>
              <div><strong>Department:</strong> User's department within the company</div>
              <div><strong>Phone:</strong> Contact number for coordination</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h4 className="font-semibold text-slate-900 mb-3 flex items-center">
              <UserCheck className="w-4 h-4 mr-2 text-blue-600" />
              User Status
            </h4>
            <p className="text-sm text-slate-600 mb-3">
              Control whether users can access the system.
            </p>
            <div className="space-y-2 text-xs text-slate-600">
              <div><strong>Active:</strong> User can log in and use the system</div>
              <div><strong>Inactive:</strong> User account is temporarily disabled</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-slate-50 p-4 rounded-lg">
        <h4 className="font-semibold text-slate-900 mb-2">Example: Cario W/H Users</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="bg-white p-3 rounded border">
            <div className="font-medium flex items-center space-x-2">
              <span>Sarah Johnson</span>
              <Badge className="bg-blue-100 text-blue-800 text-xs">User</Badge>
            </div>
            <div className="text-slate-600">Warehouse Operations</div>
            <div className="text-xs text-slate-500 mt-1">sarah.johnson@cariowh.com</div>
          </div>
          <div className="bg-white p-3 rounded border">
            <div className="font-medium flex items-center space-x-2">
              <span>Mike Roberts</span>
              <Badge className="bg-purple-100 text-purple-800 text-xs">Admin</Badge>
            </div>
            <div className="text-slate-600">Logistics Manager</div>
            <div className="text-xs text-slate-500 mt-1">mike.roberts@cariowh.com</div>
          </div>
        </div>
      </div>

      <div className="bg-green-50 p-4 rounded-lg">
        <h4 className="font-semibold text-green-900 mb-2">Access Control Summary</h4>
        <div className="text-sm text-green-800 space-y-1">
          <div><strong>Company Users:</strong> Can only book slots and view schedules for their assigned company</div>
          <div><strong>Admin Users:</strong> Can manage all companies, users, and system configuration</div>
          <div><strong>Inactive Users:</strong> Cannot log in until reactivated</div>
        </div>
      </div>
    </div>
  );
}