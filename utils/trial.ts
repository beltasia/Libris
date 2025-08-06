import { User } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/services/firebase';

export interface UserTrialData {
  uid: string;
  email: string;
  registrationDate: string;
  trialStartDate: string;
  trialEndDate: string;
  trialStatus: 'active' | 'expired' | 'approved' | 'rejected';
  approvalStatus: 'pending' | 'approved' | 'rejected' | null;
  approvedBy?: string;
  approvedAt?: string;
  rejectedBy?: string;
  rejectedAt?: string;
  lastLoginDate?: string;
}

export const TRIAL_DURATION_DAYS = 7;
export const ADMIN_EMAIL = 'sialumbamelissa@gmail.com'; // Updated with your admin email

export const calculateTrialEndDate = (startDate: Date): Date => {
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + TRIAL_DURATION_DAYS);
  return endDate;
};

export const isTrialActive = (trialEndDate: string): boolean => {
  const now = new Date();
  const endDate = new Date(trialEndDate);
  return now < endDate;
};

export const getDaysRemainingInTrial = (trialEndDate: string): number => {
  const now = new Date();
  const endDate = new Date(trialEndDate);
  const diffTime = endDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
};

export const createUserTrialData = async (user: User): Promise<UserTrialData> => {
  const now = new Date();
  const trialEndDate = calculateTrialEndDate(now);
  
  const trialData: UserTrialData = {
    uid: user.uid,
    email: user.email || '',
    registrationDate: now.toISOString(),
    trialStartDate: now.toISOString(),
    trialEndDate: trialEndDate.toISOString(),
    trialStatus: 'active',
    approvalStatus: null,
    lastLoginDate: now.toISOString()
  };

  try {
    await setDoc(doc(db, 'userTrials', user.uid), trialData);
    return trialData;
  } catch (error) {
    console.error('Error creating trial data:', error);
    throw error;
  }
};

export const getUserTrialData = async (uid: string): Promise<UserTrialData | null> => {
  try {
    const docRef = doc(db, 'userTrials', uid);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as UserTrialData;
    }
    return null;
  } catch (error) {
    console.error('Error fetching trial data:', error);
    return null;
  }
};

export const updateUserTrialStatus = async (uid: string, updates: Partial<UserTrialData>): Promise<void> => {
  try {
    const docRef = doc(db, 'userTrials', uid);
    await updateDoc(docRef, updates);
  } catch (error) {
    console.error('Error updating trial status:', error);
    throw error;
  }
};

export const updateLastLogin = async (uid: string): Promise<void> => {
  try {
    const docRef = doc(db, 'userTrials', uid);
    await updateDoc(docRef, {
      lastLoginDate: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating last login:', error);
  }
};

export const checkAndUpdateTrialStatus = async (trialData: UserTrialData): Promise<UserTrialData> => {
  const isActive = isTrialActive(trialData.trialEndDate);
  
  if (!isActive && trialData.trialStatus === 'active') {
    const updatedData = {
      ...trialData,
      trialStatus: 'expired' as const,
      approvalStatus: 'pending' as const
    };
    
    await updateUserTrialStatus(trialData.uid, {
      trialStatus: 'expired',
      approvalStatus: 'pending'
    });
    
    return updatedData;
  }
  
  return trialData;
};

export const isUserAdmin = (email: string): boolean => {
  return email === ADMIN_EMAIL;
};

export const approveUser = async (uid: string, adminEmail: string): Promise<void> => {
  await updateUserTrialStatus(uid, {
    approvalStatus: 'approved',
    trialStatus: 'approved',
    approvedBy: adminEmail,
    approvedAt: new Date().toISOString()
  });
};

export const rejectUser = async (uid: string, adminEmail: string): Promise<void> => {
  await updateUserTrialStatus(uid, {
    approvalStatus: 'rejected',
    trialStatus: 'rejected',
    rejectedBy: adminEmail,
    rejectedAt: new Date().toISOString()
  });
};
