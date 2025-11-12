import React, { useState, useEffect } from 'react';
import { User, Edit, Mail, Send, ChevronLeft, Briefcase, Calendar, Clock, AlertCircle } from 'lucide-react';
import { getUser, getZone } from '@/lib/api';
import { ConfirmationModal } from '../ui/ConfirmationModal';
import { StaffDeactivationModal } from '../ui/StaffDeactivationModal';
import { StaffReactivationModal } from '../ui/StaffReactivationModal';
import { StaffDeactivatedModal } from '../ui/StaffDeactivatedModal';

interface StaffDetailsPageProps {
  staffId: string;
  onEdit?: (staffId: string) => void;
  onBack?: () => void;
  onZoneSelect?: (zoneId: string) => void;
}

type StaffMember = {
  id: string;
  'first-name': string;
  'last-name': string;
  name: string;
  phone: string;
  email?: string;
  role: string;
  'zone-id'?: string;
  'is-active': boolean;
  'created-at': string;
  'updated-at'?: string;
};

export const StaffDetailsPage: React.FC<StaffDetailsPageProps> = ({ staffId, onEdit, onBack, onZoneSelect }) => {
  const [staff, setStaff] = useState<StaffMember | null>(null);
  const [zoneName, setZoneName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [deactivationModalOpen, setDeactivationModalOpen] = useState(false);
  const [deactivatedModalOpen, setDeactivatedModalOpen] = useState(false);
  const [reactivationModalOpen, setReactivationModalOpen] = useState(false);

  // Fetch staff member from API
  useEffect(() => {
    if (staffId) {
      setLoading(true);
      getUser(staffId)
        .then((data) => {
          setStaff(data);
          setError(null);

          // Fetch zone name if staff has a zone-id
          if (data['zone-id']) {
            getZone(data['zone-id'])
              .then((zone) => {
                setZoneName(zone.name || zone['zone-name'] || zone.id);
              })
              .catch((err) => {
                console.error('Failed to fetch zone:', err);
                setZoneName(data['zone-id']); // Fallback to ID
              });
          }
        })
        .catch((err) => {
          console.error('Failed to fetch staff:', err);
          setError('Failed to load staff member. Please try again.');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [staffId]);

  const handleSendPassword = () => {
    setPasswordModalOpen(true);
  };

  const handleSendPin = () => {
    setPinModalOpen(true);
  };

  const handleStatusClick = () => {
    if (staff?.['is-active']) {
      setDeactivationModalOpen(true);
    } else {
      setDeactivatedModalOpen(true);
    }
  };

  const handleReactivateClick = () => {
    setDeactivatedModalOpen(false);
    setReactivationModalOpen(true);
  };

  const handleConfirmDeactivation = (reason: string) => {
    // Handle the actual deactivation logic here
    console.log('Deactivating staff member:', staffId, 'Reason:', reason);
    // In a real app, you would update the database here
    setDeactivationModalOpen(false);
  };

  const handleConfirmReactivation = (reason: string) => {
    // Handle the actual reactivation logic here
    console.log('Reactivating staff member:', staffId, 'Reason:', reason);
    // In a real app, you would update the database here
    setReactivationModalOpen(false);
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading staff details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 font-medium mb-2">Error Loading Staff</p>
          <p className="text-gray-600 text-sm mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!staff) {
    return (
      <div className="p-6">
        <div className="max-w-md mx-auto text-center bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-6 h-6 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Staff Not Found</h2>
          <p className="text-sm text-gray-600 mb-6">The requested staff member could not be found.</p>
          <button
            onClick={() => {
              if (onBack) {
                onBack();
              } else {
                window.history.back();
              }
            }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Staff List
          </button>
        </div>
      </div>
    );
  }

  // Generate initials for avatar
  const initials = staff.name.split(' ').map(n => n[0]).join('').toUpperCase();
  const usernamePrefix = staff.name.split(' ').map(n => n.charAt(0)).join('').toLowerCase();
  const username = usernamePrefix + staff.id;
  const usernameElided = usernamePrefix + formatGUID(staff.id);

  // Format date helper
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  // Format GUID to show elided version (e.g., "4444...4446")
  const formatGUID = (guid: string) => {
    if (!guid || guid.length <= 8) return guid;
    return `${guid.slice(0, 4)}...${guid.slice(-4)}`;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => {
                  if (onBack) {
                    onBack();
                  } else {
                    window.history.back();
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors border border-gray-300"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
              <div className="border-l border-gray-300 pl-3">
                <p className="text-sm text-gray-600" title={`Full ID: ${staff.id}`}>
                  Staff ID: #{formatGUID(staff.id)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleStatusClick}
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  !staff['is-active']
                    ? 'bg-red-100 text-red-800 hover:bg-red-200'
                    : 'bg-green-100 text-green-800 hover:bg-green-200'
                }`}
                title={staff['is-active'] ? 'Click to deactivate staff member' : 'Click to view deactivation details'}
              >
                {staff['is-active'] ? 'ACTIVE' : 'INACTIVE'}
              </button>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => onEdit?.(staffId)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit className="w-3.5 h-3.5" />
                  Edit Staff
                </button>
                <button 
                  onClick={handleSendPassword}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600 text-white text-sm rounded-lg hover:bg-cyan-700 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  Send Password
                </button>
                <button 
                  onClick={handleSendPin}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  Send PIN
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Tab Header */}
          <div className="border-b border-gray-200 px-6 py-3 bg-gray-50">
            <button className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg">
              <User className="w-3.5 h-3.5 mr-1.5" />
              Staff Profile
            </button>
          </div>

          {/* Profile Content */}
          <div className="p-6">
            {/* Primary Information Section */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-4 h-4 text-green-500" />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {/* Name with Avatar */}
                <div className="md:col-span-2">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-2">Name</label>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden transition-all duration-300 ease-in-out hover:scale-[2.5] hover:z-50 hover:shadow-2xl cursor-pointer transform-gpu">
                      <img 
                        src="/images/customer1.jpg" 
                        alt={staff.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{staff.name}</p>
                      <p className="text-xs text-gray-500" title={`Full username: @${username}`}>@{usernameElided}</p>
                    </div>
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-2">Phone</label>
                  <p className="text-sm font-medium text-gray-900">{staff.phone}</p>
                </div>

                {/* Email */}
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-2">Email</label>
                  <p className="text-sm font-medium text-gray-900 break-all">{staff.email}</p>
                </div>

                {/* Username */}
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-2">Username</label>
                  <p
                    className="text-sm font-medium text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded inline-block"
                    title={`Full username: ${username}`}
                  >
                    {usernameElided}
                  </p>
                </div>
              </div>
            </div>

            {/* Employment Information Section */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-blue-500" />
                Employment Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Staff Role */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1">
                    Staff Role
                  </label>
                  <p className="text-sm font-medium text-gray-900">{staff.role}</p>
                </div>

                {/* Assigned Zone */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1">
                    Assigned Zone
                  </label>
                  {staff['zone-id'] ? (
                    onZoneSelect ? (
                      <button
                        onClick={() => onZoneSelect(staff['zone-id']!)}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                        title={`View zone details: ${zoneName || staff['zone-id']}`}
                      >
                        {zoneName || 'Loading...'}
                      </button>
                    ) : (
                      <p className="text-sm font-medium text-gray-900" title={`Zone ID: ${staff['zone-id']}`}>
                        {zoneName || staff['zone-id']}
                      </p>
                    )
                  ) : (
                    <p className="text-sm font-medium text-gray-500">Not Assigned</p>
                  )}
                </div>

                {/* Status */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1">
                    Status
                  </label>
                  <p className="text-sm font-medium text-gray-900">{staff['is-active'] ? 'Active' : 'Inactive'}</p>
                </div>
              </div>
            </div>

            {/* Date Information Section */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-500" />
                Key Dates
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Hired Date</span>
                  <span className="text-sm font-medium text-gray-900">TBD</span>
                </div>
                <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Termination Date</span>
                  <span className="text-sm font-medium text-gray-900">TBD</span>
                </div>
              </div>
            </div>

            {/* Audit Information Section */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-500" />
                Audit Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-lg p-3">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-2">
                    Created
                  </label>
                  <p className="text-sm font-medium text-gray-900">{formatDate(staff['created-at'])}</p>
                </div>

                <div className="border border-gray-200 rounded-lg p-3">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-2">
                    Last Modified
                  </label>
                  <p className="text-sm font-medium text-gray-900">{formatDate(staff['updated-at'])}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modals */}
      <ConfirmationModal
        isOpen={passwordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
        title="Password Sent Successfully"
        message={`A generated password has been sent to ${staff.email}. The staff member will receive an email with login instructions.`}
        type="success"
        autoClose={true}
        autoCloseDelay={10000}
      />

      <ConfirmationModal
        isOpen={pinModalOpen}
        onClose={() => setPinModalOpen(false)}
        title="PIN Sent Successfully"
        message={`A generated PIN has been sent to ${staff.phone}. The staff member will receive an SMS with the new PIN.`}
        type="success"
        autoClose={true}
        autoCloseDelay={10000}
      />

      {/* Staff Deactivation Modal */}
      <StaffDeactivationModal
        isOpen={deactivationModalOpen}
        onClose={() => setDeactivationModalOpen(false)}
        staffId={staff.id.toString()}
        staffName={staff.name}
        staffPhone={staff.phone}
        staffEmail={staff.email}
        onConfirm={handleConfirmDeactivation}
      />

      {/* Staff Deactivated Info Modal */}
      <StaffDeactivatedModal
        isOpen={deactivatedModalOpen}
        onClose={() => setDeactivatedModalOpen(false)}
        staffId={staff.id.toString()}
        staffName={staff.name}
        staffPhone={staff.phone}
        staffEmail={staff.email}
        deactivatedDate={formatDate(staff['updated-at'])}
        deactivatedBy="N/A"
        deactivationReason="As per management decision"
        onReactivate={handleReactivateClick}
      />

      {/* Staff Reactivation Modal */}
      <StaffReactivationModal
        isOpen={reactivationModalOpen}
        onClose={() => setReactivationModalOpen(false)}
        staffId={staff.id.toString()}
        staffName={staff.name}
        staffPhone={staff.phone}
        staffEmail={staff.email}
        onConfirm={handleConfirmReactivation}
      />
    </div>
  );
};