import React, { useState } from 'react';
import { User, Save, X, ChevronLeft, Upload } from 'lucide-react';
import { HierarchicalAccess } from '../ui/HierarchicalAccess';
import { ModernSelect } from '../ui/ModernSelect';

interface AddStaffPageProps {
  onBack: () => void;
  onSave?: (staffData: any) => void;
}

export const AddStaffPage: React.FC<AddStaffPageProps> = ({ onBack, onSave }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    username: '',
    position: '',
    businessLevel: '',
    accessPermissions: null,
    role: '',
    picture: null as File | null,
    status: 'Active',
    depositBankAccounts: false
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

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

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
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

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!formData.position) {
      newErrors.position = 'Position is required';
    }

    if (!formData.businessLevel) {
      newErrors.businessLevel = 'Business level is required';
    }

    if (!formData.accessPermissions) {
      newErrors.accessPermissions = 'Access permissions are required';
    }

    if (!formData.role) {
      newErrors.role = 'Role is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (onSave) {
        onSave(formData);
      }
      
      console.log('Staff created successfully:', formData);
      onBack();
    } catch (error) {
      console.error('Error creating staff:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      username: '',
      position: '',
      businessLevel: '',
      accessPermissions: null,
      role: '',
      picture: null,
      status: 'Active',
      depositBankAccounts: false
    });
    setErrors({});
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

  const businessLevelOptions = [
    { value: 'Head Office', label: 'Head Office' },
    { value: 'Regional Office', label: 'Regional Office' },
    { value: 'Water System Office', label: 'Water System Office' }
  ];

  const roleOptions = [
    { value: 'Management', label: 'Management' },
    { value: 'Data_Admin', label: 'Data Admin' },
    { value: 'System_Admin', label: 'System Admin' },
    { value: 'Collector', label: 'Collector' },
    { value: 'Field_Officer', label: 'Field Officer' },
    { value: 'Technician', label: 'Technician' }
  ];

  const statusOptions = [
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' }
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
              <h1 className="text-2xl font-bold text-gray-900">Add Staff</h1>
              <p className="text-gray-600">Create a new staff member account</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Staff Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 relative z-10 overflow-visible">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Add Staff</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.firstName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter first name"
            />
            {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.lastName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter last name"
            />
            {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone <span className="text-red-500">*</span>
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
              Email <span className="text-red-500">*</span>
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

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.username ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter username"
            />
            {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username}</p>}
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
              Business Level <span className="text-red-500">*</span>
            </label>
            <ModernSelect
              value={formData.businessLevel}
              onChange={(value) => handleInputChange('businessLevel', value)}
              placeholder="Select Business Level"
              options={businessLevelOptions}
              className="w-full"
            />
            {errors.businessLevel && <p className="mt-1 text-sm text-red-600">{errors.businessLevel}</p>}
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role <span className="text-red-500">*</span>
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

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status <span className="text-red-500">*</span>
            </label>
            <ModernSelect
              value={formData.status}
              onChange={(value) => handleInputChange('status', value)}
              placeholder="Select Status"
              options={statusOptions}
              className="w-full"
            />
          </div>
        </div>

        {/* Access Permissions - Full Width */}
        <div className="mt-6">
          <HierarchicalAccess
            label="Zone Assignment (Access Permissions)"
            placeholder="Select access level and permissions"
            value={formData.accessPermissions}
            onChange={(value) => handleInputChange('accessPermissions', value)}
            error={errors.accessPermissions}
            required={true}
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
              id="staff-picture"
            />
            <label
              htmlFor="staff-picture"
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

        {/* Form Actions */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex justify-end gap-3">
            <button 
              type="button"
              onClick={handleReset}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Reset
            </button>
            <button 
              type="button"
              onClick={onBack}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? 'Creating...' : 'Submit'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};