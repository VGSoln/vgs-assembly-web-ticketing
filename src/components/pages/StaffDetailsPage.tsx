import React, { useState } from 'react';
import { User, Edit, Mail, Send, ChevronLeft, Briefcase, Calendar, Clock } from 'lucide-react';
import { staffData } from '@/lib/data';
import { ConfirmationModal } from '../ui/ConfirmationModal';
import { StaffDeactivationModal } from '../ui/StaffDeactivationModal';
import { StaffReactivationModal } from '../ui/StaffReactivationModal';
import { StaffDeactivatedModal } from '../ui/StaffDeactivatedModal';

interface StaffDetailsPageProps {
  staffId: string;
  onEdit?: (staffId: string) => void;
  onBack?: () => void;
}

export const StaffDetailsPage: React.FC<StaffDetailsPageProps> = ({ staffId, onEdit, onBack }) => {
  const staff = staffData.find(s => s.id.toString() === staffId);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [deactivationModalOpen, setDeactivationModalOpen] = useState(false);
  const [deactivatedModalOpen, setDeactivatedModalOpen] = useState(false);
  const [reactivationModalOpen, setReactivationModalOpen] = useState(false);

  const handleSendPassword = () => {
    setPasswordModalOpen(true);
  };

  const handleSendPin = () => {
    setPinModalOpen(true);
  };

  const handleStatusClick = () => {
    if (staff?.status === 'Active') {
      setDeactivationModalOpen(true);
    } else if (staff?.status === 'Inactive') {
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
  const username = staff.name.split(' ').map(n => n.charAt(0)).join('').toLowerCase() + staff.id;

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
                <p className="text-sm text-gray-600">Staff ID: #{staff.id.toString().padStart(4, '0')}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleStatusClick}
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  staff.status === 'Inactive' 
                    ? 'bg-red-100 text-red-800 hover:bg-red-200' 
                    : 'bg-green-100 text-green-800 hover:bg-green-200'
                }`}
                title={staff.status === 'Active' ? 'Click to deactivate staff member' : 'Click to view deactivation details'}
              >
                {staff.status.toUpperCase()}
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
                      <p className="text-xs text-gray-500">@{username}</p>
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
                  <p className="text-sm font-medium text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded inline-block">
                    {username}
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
                {/* Staff Position */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1">
                    Staff Position
                  </label>
                  <p className="text-sm font-medium text-gray-900">{staff.position}</p>
                </div>

                {/* Staff Role */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1">
                    Staff Role
                  </label>
                  <p className="text-sm font-medium text-gray-900">{staff.role}</p>
                </div>

                {/* Assigned Zones */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1">
                    Assigned Zones
                  </label>
                  <p className="text-sm font-medium text-gray-900">{staff.assignedZones}</p>
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
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1">
                        Created
                      </label>
                      <p className="text-sm font-medium text-gray-900">{staff.created}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1">
                        Created By
                      </label>
                      <p className="text-sm font-medium text-gray-900">{staff.modifiedBy}</p>
                    </div>
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1">
                        Last Modified
                      </label>
                      <p className="text-sm font-medium text-gray-900">{staff.modified}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1">
                        Last Modified By
                      </label>
                      <p className="text-sm font-medium text-gray-900">{staff.modifiedBy}</p>
                    </div>
                  </div>
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
        deactivatedDate={staff.modified}
        deactivatedBy={staff.modifiedBy}
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