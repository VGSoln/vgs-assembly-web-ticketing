import React, { useState, useEffect } from 'react';
import { User, Save, ChevronLeft, Upload } from 'lucide-react';
import { staffData } from '@/lib/data';
import { HierarchicalAccess } from '../ui/HierarchicalAccess';
import { ModernSelect } from '../ui/ModernSelect';

interface EditStaffPageProps {
  staffId: string;
  onBack: () => void;
  onSave?: (staffData: any) => void;
}

export const EditStaffPage: React.FC<EditStaffPageProps> = ({ staffId, onBack, onSave }) => {
  const originalStaff = staffData.find(s => s.id.toString() === staffId);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    assignedZones: '',
    role: '',
    position: '',
    status: 'Active',
    businessLevel: '',
    accessPermissions: null,
    picture: null as File | null,
    depositBankAccounts: false
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (originalStaff) {
      setFormData({
        name: originalStaff.name,
        phone: originalStaff.phone,
        email: originalStaff.email,
        assignedZones: originalStaff.assignedZones,
        role: originalStaff.role,
        position: originalStaff.position,
        status: originalStaff.status,
        businessLevel: '',
        accessPermissions: null,
        picture: null,
        depositBankAccounts: false
      });
    }
  }, [originalStaff]);

  if (!originalStaff) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Staff Not Found</h2>
          <button 
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Staff Details
          </button>
        </div>
      </div>
    );
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, picture: file }));
      if (errors.picture) {
        setErrors(prev => ({ ...prev, picture: '' }));
      }
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.assignedZones.trim()) {
      newErrors.assignedZones = 'Assigned zones is required';
    }

    if (!formData.role.trim()) {
      newErrors.role = 'Role is required';
    }

    if (!formData.position.trim()) {
      newErrors.position = 'Position is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (onSave) {
        onSave({ ...originalStaff, ...formData });
      }
      
      // Show success message (you might want to add toast notification)
      console.log('Staff updated successfully:', formData);
      onBack();
    } catch (error) {
      console.error('Error updating staff:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const positionOptions = [
    { value: 'Water System Manager', label: 'Water System Manager' },
    { value: 'Information Technology Specialist', label: 'Information Technology Specialist' },
    { value: 'Data Analyst', label: 'Data Analyst' },
    { value: 'System Admin', label: 'System Admin' },
    { value: 'Chief Accountant', label: 'Chief Accountant' },
    { value: 'Information Technology Coordinator', label: 'Information Technology Coordinator' },
    { value: 'Hydrologist', label: 'Hydrologist' },
    { value: 'Revenue Officer', label: 'Revenue Officer' },
    { value: 'Field Officer', label: 'Field Officer' },
    { value: 'Technician', label: 'Technician' }
  ];

  const roleOptions = [
    { value: 'Management', label: 'Management' },
    { value: 'Data_Admin', label: 'Data Admin' },
    { value: 'System_Admin', label: 'System Admin' },
    { value: 'Collector', label: 'Collector' },
    { value: 'Field_Officer', label: 'Field Officer' },
    { value: 'Technician', label: 'Technician' }
  ];

  const businessLevelOptions = [
    { value: 'Head Office', label: 'Head Office' },
    { value: 'Regional Office', label: 'Regional Office' },
    { value: 'Water System Office', label: 'Water System Office' }
  ];

  const statusOptions = [
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' },
    { value: 'Suspended', label: 'Suspended' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 relative z-20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit Staff Member</h1>
              <p className="text-gray-600">Staff ID: {originalStaff.id.toString().padStart(4, '0')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 relative z-10 overflow-visible">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter full name"
              />
            </div>
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="0244989297"
            />
            {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="user@example.com"
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>

          {/* Assigned Zones - Greyed Out */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Assigned Zones
            </label>
            <input
              type="text"
              value={formData.assignedZones}
              readOnly
              disabled
              className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
              placeholder="10"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Staff Role <span className="text-red-500">*</span>
            </label>
            <ModernSelect
              value={formData.role}
              onChange={(value) => handleInputChange('role', value)}
              placeholder="Select Role"
              options={roleOptions}
              className="w-full"
            />
            {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role}</p>}
          </div>

          {/* Position */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Position <span className="text-red-500">*</span>
            </label>
            <ModernSelect
              value={formData.position}
              onChange={(value) => handleInputChange('position', value)}
              placeholder="Select Position"
              options={positionOptions}
              className="w-full"
            />
            {errors.position && <p className="mt-1 text-sm text-red-600">{errors.position}</p>}
          </div>

          {/* Business Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Level
            </label>
            <ModernSelect
              value={formData.businessLevel}
              onChange={(value) => handleInputChange('businessLevel', value)}
              placeholder="Select Business Level"
              options={businessLevelOptions}
              className="w-full"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <ModernSelect
              value={formData.status}
              onChange={(value) => handleInputChange('status', value)}
              placeholder="Select Status"
              options={statusOptions}
              className="w-full"
            />
          </div>

          {/* Created (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Created
            </label>
            <input
              type="text"
              value={originalStaff.created}
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
            />
          </div>

          {/* Modified (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Modified
            </label>
            <input
              type="text"
              value={originalStaff.modified}
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
            />
          </div>
        </div>

        {/* Zone Assignment (Access Permissions) - Full Width */}
        <div className="mt-6">
          <HierarchicalAccess
            label="Zone Assignment (Access Permissions)"
            placeholder="Select access level and permissions"
            value={formData.accessPermissions}
            onChange={(value) => handleInputChange('accessPermissions', value)}
            error={errors.accessPermissions}
            required={false}
          />
        </div>

        {/* Upload Staff Picture */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Staff Picture
          </label>
          <div className="flex items-center gap-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="staff-picture-edit"
            />
            <label
              htmlFor="staff-picture-edit"
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors"
            >
              <Upload className="w-4 h-4" />
              Choose File
            </label>
            <span className="text-sm text-gray-500">
              {formData.picture ? formData.picture.name : 'No file chosen'}
            </span>
          </div>
        </div>

        {/* Deposit Bank Account Checkbox */}
        <div className="mt-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.depositBankAccounts}
              onChange={(e) => handleInputChange('depositBankAccounts', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
            />
            <span className="text-sm font-medium text-gray-700">
              Deposit Bank Account(s)
            </span>
          </label>
          <p className="mt-1 text-xs text-gray-500 ml-7">
            Grant access to manage bank account deposits and transactions
          </p>
        </div>

        {/* Form Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex justify-end gap-3">
            <button 
              onClick={onBack}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              disabled={isLoading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};