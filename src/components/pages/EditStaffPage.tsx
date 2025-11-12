import React, { useState, useEffect } from 'react';
import { User, Save, ChevronLeft, Upload } from 'lucide-react';
import { HierarchicalAccess } from '../ui/HierarchicalAccess';
import { ModernSelect } from '../ui/ModernSelect';
import { getUser, updateUser } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

interface EditStaffPageProps {
  staffId: string;
  onSave?: (staffData: any) => void;
  onBack?: () => void;
}

export const EditStaffPage: React.FC<EditStaffPageProps> = ({ staffId, onSave, onBack }) => {
  const { user } = useAuth();
  const [originalStaff, setOriginalStaff] = useState<any>(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    assignedZones: '',
    role: '',
    position: '',
    status: 'Active',
    businessLevel: '',
    accessPermissions: null,
    picture: null as File | null,
    depositBankAccounts: false,
    zoneId: '',
    pin: '',
    password: ''
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStaffData = async () => {
      setIsFetching(true);
      setFetchError(null);
      try {
        const staffData = await getUser(staffId);
        setOriginalStaff(staffData);
        setFormData({
          firstName: staffData['first-name'] || '',
          lastName: staffData['last-name'] || '',
          phone: staffData.phone || '',
          email: staffData.email || '',
          assignedZones: staffData['zone-id'] || '',
          role: staffData.role || '',
          position: staffData.position || '',
          status: staffData.active ? 'Active' : 'Inactive',
          businessLevel: '',
          accessPermissions: null,
          picture: null,
          depositBankAccounts: false,
          zoneId: staffData['zone-id'] || '',
          pin: '',
          password: ''
        });
      } catch (error) {
        console.error('Error fetching staff data:', error);
        setFetchError('Failed to load staff data. Please try again.');
      } finally {
        setIsFetching(false);
      }
    };

    fetchStaffData();
  }, [staffId]);

  if (isFetching) {
    return (
      <div className="p-6">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading staff data...</p>
        </div>
      </div>
    );
  }

  if (fetchError || !originalStaff) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {fetchError || 'Staff Not Found'}
          </h2>
          <button
            onClick={() => {
              if (onBack) {
                onBack();
              } else {
                window.history.back();
              }
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
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

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.role.trim()) {
      newErrors.role = 'Role is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Prepare API data with kebab-case field names
      const apiData: any = {
        'first-name': formData.firstName,
        'last-name': formData.lastName,
        phone: formData.phone,
        role: formData.role as 'officer' | 'supervisor' | 'admin'
      };

      // Only include optional fields if they have values
      if (formData.email) {
        apiData.email = formData.email;
      }
      if (formData.zoneId) {
        apiData['zone-id'] = formData.zoneId;
      }
      if (formData.pin) {
        apiData.pin = formData.pin;
      }
      if (formData.password) {
        apiData.password = formData.password;
      }

      await updateUser(staffId, apiData);

      if (onSave) {
        onSave({ ...originalStaff, ...formData });
      }

      console.log('Staff updated successfully');
      if (onBack) {
        onBack();
      } else {
        window.history.back();
      }
    } catch (error) {
      console.error('Error updating staff:', error);
      setErrors({ general: 'Failed to update staff. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const positionOptions = [
    { value: 'Revenue Operations Manager', label: 'Revenue Operations Manager' },
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
    { value: 'Ticketing Operations Office', label: 'Ticketing Operations Office' }
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
              onClick={() => {
                if (onBack) {
                  onBack();
                } else {
                  window.history.back();
                }
              }}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit Staff Member</h1>
              <p className="text-gray-600">Staff ID: {originalStaff.id || staffId}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 relative z-10 overflow-visible">
        {errors.general && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{errors.general}</p>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.firstName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter first name"
              />
            </div>
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
              Email Address
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

          {/* Zone ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Zone ID
            </label>
            <input
              type="text"
              value={formData.zoneId}
              onChange={(e) => handleInputChange('zoneId', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter zone ID (optional)"
            />
          </div>

          {/* Created At (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Created
            </label>
            <input
              type="text"
              value={originalStaff['created-at'] || 'N/A'}
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
            />
          </div>

          {/* Updated At (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Modified
            </label>
            <input
              type="text"
              value={originalStaff['updated-at'] || 'N/A'}
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
            />
          </div>
        </div>

        {/* Optional PIN Update */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Update PIN (Optional)
          </label>
          <input
            type="password"
            value={formData.pin}
            onChange={(e) => handleInputChange('pin', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Leave blank to keep current PIN"
          />
          <p className="mt-1 text-xs text-gray-500">
            Only enter a PIN if you want to update it. Leave blank to keep the current PIN.
          </p>
        </div>

        {/* Optional Password Update */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Update Password (Optional)
          </label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Leave blank to keep current password"
          />
          <p className="mt-1 text-xs text-gray-500">
            Only enter a password if you want to update it. Leave blank to keep the current password.
          </p>
        </div>

        {/* Form Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex justify-end gap-3">
            <button 
              onClick={() => window.history.back()}
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