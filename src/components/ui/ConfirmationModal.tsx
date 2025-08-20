import React from 'react';
import { CheckCircle, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: 'success' | 'info' | 'warning' | 'error';
  autoClose?: boolean;
  autoCloseDelay?: number;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  type = 'success',
  autoClose = true,
  autoCloseDelay = 3000
}) => {
  React.useEffect(() => {
    if (isOpen && autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, autoCloseDelay, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          iconColor: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200'
        };
      case 'info':
        return {
          iconColor: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200'
        };
      case 'warning':
        return {
          iconColor: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200'
        };
      case 'error':
        return {
          iconColor: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200'
        };
      default:
        return {
          iconColor: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200'
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
        onClick={handleBackdropClick}
      >
        {/* Background overlay */}
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        
        {/* Modal content */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-full max-w-md">
          <div className="bg-white px-6 py-6">
            <div className="flex items-start">
              <div className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full ${styles.bgColor} ${styles.borderColor} border-2`}>
                <CheckCircle className={`h-6 w-6 ${styles.iconColor}`} />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left flex-1">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">
                  {title}
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    {message}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="ml-3 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg p-1 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {autoClose && (
              <div className="mt-4">
                <div className="text-xs text-gray-400 text-center">
                  This dialog will close automatically in {autoCloseDelay / 1000} seconds
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-1">
                  <div 
                    className="bg-blue-600 h-1 rounded-full animate-pulse"
                    style={{
                      animation: `shrink ${autoCloseDelay}ms linear forwards`
                    }}
                  />
                </div>
              </div>
            )}
            
            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                onClick={onClose}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};