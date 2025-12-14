import React, { useState, createContext, useContext, useEffect } from 'react';
import { User, Job, JobStatus, Message, UserRole, Review, Notification } from './types';
import { MOCK_JOBS, MOCK_USERS, MOCK_NOTIFICATIONS } from './constants';
import { Layout } from './components/Layout';

// --- Pages ---
import { Login } from './pages/Login';
import { CustomerDashboard } from './pages/customer/CustomerDashboard';
import { MechanicDashboard } from './pages/mechanic/MechanicDashboard';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { Profile } from './pages/Profile';
import { Notifications } from './pages/Notifications';

// --- Context ---
type AppRoute = 'DASHBOARD' | 'PROFILE' | 'NOTIFICATIONS';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  jobs: Job[];
  messages: Message[];
  notifications: Notification[];
  currentRoute: AppRoute;
  login: (userData: Partial<User>) => void;
  logout: () => void;
  navigateTo: (route: AppRoute) => void;
  createJob: (job: Omit<Job, 'id' | 'status' | 'createdAt' | 'customerId'>) => void;
  acceptJob: (jobId: string) => void;
  completeJob: (jobId: string) => void;
  confirmPayment: (jobId: string) => void;
  sendMessage: (jobId: string, text: string) => void;
  verifyMechanic: (mechanicId: string) => void;
  markNotificationsAsRead: () => void;
}

export const AppContext = createContext<AppContextType | null>(null);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within AppProvider");
  return context;
};

// --- Main App ---
export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentRoute, setCurrentRoute] = useState<AppRoute>('DASHBOARD');
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS);
  const [messages, setMessages] = useState<Message[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);

  const login = (userData: Partial<User>) => {
    // Check if user exists by email
    const existingUser = users.find(u => u.email === userData.email);
    
    if (existingUser) {
      setCurrentUser(existingUser);
    } else {
      // Register new user with provided data
      const newUser: User = {
        id: `u${Date.now()}`,
        name: userData.name || userData.email?.split('@')[0] || 'User',
        email: userData.email || '',
        role: userData.role || UserRole.CUSTOMER,
        phone: userData.phone,
        isVerified: userData.role === UserRole.MECHANIC ? false : undefined,
        // Optional fields
        abn: userData.abn,
        experienceYears: userData.experienceYears,
        skills: userData.skills,
        bio: userData.bio
      };
      setUsers([...users, newUser]);
      setCurrentUser(newUser);
    }
    setCurrentRoute('DASHBOARD');
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentRoute('DASHBOARD');
  };

  const navigateTo = (route: AppRoute) => setCurrentRoute(route);

  const createJob = (jobData: Omit<Job, 'id' | 'status' | 'createdAt' | 'customerId'>) => {
    if (!currentUser) return;
    const newJob: Job = {
      ...jobData,
      id: `j${Date.now()}`,
      customerId: currentUser.id,
      status: JobStatus.OPEN,
      createdAt: new Date().toISOString()
    };
    setJobs([newJob, ...jobs]);
  };

  const acceptJob = (jobId: string) => {
    if (!currentUser || currentUser.role !== UserRole.MECHANIC) return;
    setJobs(jobs.map(j => j.id === jobId ? { ...j, status: JobStatus.ACCEPTED, mechanicId: currentUser.id } : j));
  };

  const completeJob = (jobId: string) => {
    setJobs(jobs.map(j => j.id === jobId ? { ...j, status: JobStatus.COMPLETED_PENDING_PAYMENT } : j));
  };

  const confirmPayment = (jobId: string) => {
    setJobs(jobs.map(j => j.id === jobId ? { ...j, status: JobStatus.PAID_AND_CLOSED } : j));
  };

  const sendMessage = (jobId: string, text: string) => {
    if (!currentUser) return;
    const newMessage: Message = {
      id: `m${Date.now()}`,
      jobId,
      senderId: currentUser.id,
      content: text,
      timestamp: new Date().toISOString()
    };
    setMessages([...messages, newMessage]);
  };

  const verifyMechanic = (mechanicId: string) => {
    setUsers(users.map(u => u.id === mechanicId ? { ...u, isVerified: true } : u));
  };

  const markNotificationsAsRead = () => {
    if (!currentUser) return;
    setNotifications(notifications.map(n => n.userId === currentUser.id ? { ...n, read: true } : n));
  };

  return (
    <AppContext.Provider value={{ 
      currentUser, users, jobs, messages, notifications, currentRoute,
      login, logout, navigateTo, createJob, acceptJob, completeJob, confirmPayment, sendMessage, verifyMechanic, markNotificationsAsRead
    }}>
      <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
        {!currentUser ? (
          <Login />
        ) : (
          <Layout>
             {currentRoute === 'PROFILE' ? (
               <Profile />
             ) : currentRoute === 'NOTIFICATIONS' ? (
               <Notifications />
             ) : (
               <>
                 {currentUser.role === UserRole.CUSTOMER && <CustomerDashboard />}
                 {currentUser.role === UserRole.MECHANIC && <MechanicDashboard />}
                 {currentUser.role === UserRole.ADMIN && <AdminDashboard />}
               </>
             )}
          </Layout>
        )}
      </div>
    </AppContext.Provider>
  );
}