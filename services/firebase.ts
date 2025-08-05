import { 
  initializeApp, 
  type FirebaseApp 
} from 'firebase/app';
import { 
  getAuth, 
  type Auth,
  signInWithEmailAndPassword, // Added import
  signOut, // Added import
  onAuthStateChanged,
  type User
} from 'firebase/auth';
import { 
  getFirestore, 
  type Firestore 
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDGCWDtaRPNie1OfVjVIPautOZQNoidE9I",
  authDomain: "libris-38192.firebaseapp.com",
  projectId: "libris-38192",
  storageBucket: "libris-38192.appspot.com",
  messagingSenderId: "833200271977",
  appId: "1:833200271977:web:d7799b289e0e5b162028f8",
  measurementId: "G-NS61KSEH45"
};

// Initialize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);
const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);

// Auth methods
export const login = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const logout = () => {
  return signOut(auth);
};

// Auth state listener
export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

export { auth, db };
export default app;