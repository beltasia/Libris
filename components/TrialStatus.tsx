import { useState, useEffect } from 'react';
import { UserTrialData, getDaysRemainingInTrial } from '@/utils/trial';

interface TrialStatusProps {
  trialData: UserTrialData | null;
  isLoading: boolean;
}

export default function TrialStatus({ trialData, isLoading }: TrialStatusProps) {
  const [daysRemaining, setDaysRemaining] = useState<number>(0);

  useEffect(() => {
    if (trialData && trialData.trialStatus === 'active') {
      setDaysRemaining(getDaysRemainingInTrial(trialData.trialEndDate));
      
      // Update days remaining every hour
      const interval = setInterval(() => {
        setDaysRemaining(getDaysRemainingInTrial(trialData.trialEndDate));
      }, 3600000); // 1 hour

      return () => clearInterval(interval);
    }
  }, [trialData]);

  if (isLoading) {
    return (
      <div className="bg-gray-100 rounded-lg p-4 animate-pulse">
        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-300 rounded w-1/2"></div>
      </div>
    );
  }

  if (!trialData) return null;

  const getStatusBadge = () => {
    switch (trialData.trialStatus) {
      case 'active':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            ✅ Active Trial
          </span>
        );
      case 'expired':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            ⏰ Trial Expired
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            🎉 Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            ❌ Access Denied
          </span>
        );
      default:
        return null;
    }
  };

  const getStatusMessage = () => {
    switch (trialData.trialStatus) {
      case 'active':
        return (
          <div>
            <p className="text-sm text-gray-600 mb-1">
              🎯 <strong>{daysRemaining} day{daysRemaining !== 1 ? 's' : ''}</strong> remaining in your free trial
            </p>
            <p className="text-xs text-gray-500">
              Trial expires on {new Date(trialData.trialEndDate).toLocaleDateString()}
            </p>
          </div>
        );
      case 'expired':
        return (
          <div>
            <p className="text-sm text-yellow-700 mb-1">
              📋 Your trial has expired. Waiting for admin approval.
            </p>
            <p className="text-xs text-gray-500">
              Your access is currently limited. You'll be notified once approved.
            </p>
          </div>
        );
      case 'approved':
        return (
          <div>
            <p className="text-sm text-blue-700 mb-1">
              🎊 Congratulations! Your access has been approved.
            </p>
            <p className="text-xs text-gray-500">
              Approved on {trialData.approvedAt ? new Date(trialData.approvedAt).toLocaleDateString() : 'N/A'}
            </p>
          </div>
        );
      case 'rejected':
        return (
          <div>
            <p className="text-sm text-red-700 mb-1">
              🚫 Your access request has been denied.
            </p>
            <p className="text-xs text-gray-500">
              Please contact support if you believe this is an error.
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-800">Account Status</h3>
        {getStatusBadge()}
      </div>
      {getStatusMessage()}
      
      {trialData.trialStatus === 'active' && daysRemaining <= 2 && (
        <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <p className="text-sm text-orange-800">
            ⚠️ <strong>Action needed:</strong> Your trial is ending soon. 
            Your account will be reviewed for approval after the trial period.
          </p>
        </div>
      )}
    </div>
  );
}
