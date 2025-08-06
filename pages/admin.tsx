import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { auth, db } from '@/services/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { UserTrialData, isUserAdmin, approveUser, rejectUser, getDaysRemainingInTrial } from '@/utils/trial';

export default function AdminPanel() {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [users, setUsers] = useState<UserTrialData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'active' | 'expired' | 'approved' | 'rejected'>('pending');
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    if (user && !isUserAdmin(user.email || '')) {
      router.push('/dashboard');
      return;
    }
    if (user) {
      fetchUsers();
    }
  }, [user, router]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const usersRef = collection(db, 'userTrials');
      const q = query(usersRef, orderBy('registrationDate', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const usersData: UserTrialData[] = [];
      querySnapshot.forEach((doc) => {
        usersData.push(doc.data() as UserTrialData);
      });
      
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveUser = async (uid: string) => {
    if (!user?.email) return;
    
    try {
      setProcessing(uid);
      await approveUser(uid, user.email);
      await fetchUsers(); // Refresh the list
    } catch (error) {
      console.error('Error approving user:', error);
      alert('Failed to approve user. Please try again.');
    } finally {
      setProcessing(null);
    }
  };

  const handleRejectUser = async (uid: string) => {
    if (!user?.email) return;
    
    if (!confirm('Are you sure you want to reject this user? This action cannot be undone.')) {
      return;
    }
    
    try {
      setProcessing(uid);
      await rejectUser(uid, user.email);
      await fetchUsers(); // Refresh the list
    } catch (error) {
      console.error('Error rejecting user:', error);
      alert('Failed to reject user. Please try again.');
    } finally {
      setProcessing(null);
    }
  };

  const filteredUsers = users.filter((userData) => {
    switch (filter) {
      case 'pending':
        return userData.approvalStatus === 'pending';
      case 'active':
        return userData.trialStatus === 'active';
      case 'expired':
        return userData.trialStatus === 'expired';
      case 'approved':
        return userData.trialStatus === 'approved';
      case 'rejected':
        return userData.trialStatus === 'rejected';
      default:
        return true;
    }
  });

  const getStatusBadge = (userData: UserTrialData) => {
    switch (userData.trialStatus) {
      case 'active':
        const daysLeft = getDaysRemainingInTrial(userData.trialEndDate);
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            ✅ Active ({daysLeft}d left)
          </span>
        );
      case 'expired':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            ⏰ Expired - Pending
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
            ❌ Rejected
          </span>
        );
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!isUserAdmin(user.email || '')) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">You don't have permission to access this page.</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
                <p className="mt-1 text-sm text-gray-600">
                  Manage user trial approvals and account statuses
                </p>
              </div>
              <button
                onClick={() => router.push('/dashboard')}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
              >
                Back to Dashboard
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-2xl font-bold text-gray-900">{users.length}</div>
              <div className="text-sm text-gray-600">Total Users</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-2xl font-bold text-green-600">
                {users.filter(u => u.trialStatus === 'active').length}
              </div>
              <div className="text-sm text-gray-600">Active Trials</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-2xl font-bold text-yellow-600">
                {users.filter(u => u.approvalStatus === 'pending').length}
              </div>
              <div className="text-sm text-gray-600">Pending Approval</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-2xl font-bold text-blue-600">
                {users.filter(u => u.trialStatus === 'approved').length}
              </div>
              <div className="text-sm text-gray-600">Approved</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-2xl font-bold text-red-600">
                {users.filter(u => u.trialStatus === 'rejected').length}
              </div>
              <div className="text-sm text-gray-600">Rejected</div>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {(['all', 'pending', 'active', 'expired', 'approved', 'rejected'] as const).map((filterOption) => (
                <button
                  key={filterOption}
                  onClick={() => setFilter(filterOption)}
                  className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
                    filter === filterOption
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {filterOption} ({filter === filterOption ? filteredUsers.length : 
                    filterOption === 'all' ? users.length :
                    filterOption === 'pending' ? users.filter(u => u.approvalStatus === 'pending').length :
                    users.filter(u => u.trialStatus === filterOption).length})
                </button>
              ))}
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading users...</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-8 text-center text-gray-600">
                No users found for the selected filter.
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {filteredUsers.map((userData) => (
                  <li key={userData.uid} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-purple-600 flex items-center justify-center">
                              <span className="text-white font-medium text-sm">
                                {userData.email.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {userData.email}
                            </p>
                            <div className="flex items-center space-x-2 mt-1">
                              {getStatusBadge(userData)}
                              <span className="text-xs text-gray-500">
                                Registered: {new Date(userData.registrationDate).toLocaleDateString()}
                              </span>
                            </div>
                            {userData.lastLoginDate && (
                              <p className="text-xs text-gray-500 mt-1">
                                Last login: {new Date(userData.lastLoginDate).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {userData.approvalStatus === 'pending' && (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleApproveUser(userData.uid)}
                            disabled={processing === userData.uid}
                            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-3 py-1 rounded text-sm"
                          >
                            {processing === userData.uid ? 'Processing...' : 'Approve'}
                          </button>
                          <button
                            onClick={() => handleRejectUser(userData.uid)}
                            disabled={processing === userData.uid}
                            className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-3 py-1 rounded text-sm"
                          >
                            {processing === userData.uid ? 'Processing...' : 'Reject'}
                          </button>
                        </div>
                      )}
                      
                      {userData.approvalStatus === 'approved' && (
                        <div className="text-xs text-gray-500">
                          Approved by {userData.approvedBy}<br/>
                          on {userData.approvedAt ? new Date(userData.approvedAt).toLocaleDateString() : 'N/A'}
                        </div>
                      )}
                      
                      {userData.approvalStatus === 'rejected' && (
                        <div className="text-xs text-gray-500">
                          Rejected by {userData.rejectedBy}<br/>
                          on {userData.rejectedAt ? new Date(userData.rejectedAt).toLocaleDateString() : 'N/A'}
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
