'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Project, IPAsset, Validation, Listing, Transaction, Activity, User } from '@/lib/types';
import { mockProjects, mockIPAssets, mockValidations, mockListings, mockTransactions, mockActivities, mockUsers } from '@/lib/data';

interface AppState {
  projects: Project[];
  ipAssets: IPAsset[];
  validations: Validation[];
  listings: Listing[];
  transactions: Transaction[];
  activities: Activity[];
  currentUser: User | null;
  isLoading: boolean;
}

interface AppContextType {
  projects: Project[];
  ipAssets: IPAsset[];
  validations: Validation[];
  listings: Listing[];
  transactions: Transaction[];
  activities: Activity[];
  currentUser: User | null;
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  
  createProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Project>;
  updateProject: (id: string, data: Partial<Project>) => Promise<Project>;
  deleteProject: (id: string) => Promise<void>;
  getProjectById: (id: string) => Project | undefined;
  
  createIPAsset: (ip: Omit<IPAsset, 'id' | 'createdAt' | 'updatedAt'>) => Promise<IPAsset>;
  updateIPAsset: (id: string, data: Partial<IPAsset>) => Promise<IPAsset>;
  deleteIPAsset: (id: string) => Promise<void>;
  getIPAssetById: (id: string) => IPAsset | undefined;
  
  createValidation: (v: Omit<Validation, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Validation>;
  updateValidation: (id: string, data: Partial<Validation>) => Promise<Validation>;
  submitValidation: (id: string) => Promise<Validation>;
  approveValidation: (id: string, score: number, notes: string) => Promise<Validation>;
  rejectValidation: (id: string, notes: string) => Promise<Validation>;
  
  createListing: (listing: Omit<Listing, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Listing>;
  updateListing: (id: string, data: Partial<Listing>) => Promise<Listing>;
  deleteListing: (id: string) => Promise<void>;
  purchaseListing: (id: string) => Promise<void>;
  
  createTransaction: (tx: Omit<Transaction, 'id' | 'createdAt'>) => Promise<Transaction>;
  deleteTransaction: (id: string) => Promise<void>;
  getTransactionsByDateRange: (start: string, end: string) => Transaction[];
  
  addActivity: (activity: Omit<Activity, 'id' | 'createdAt'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [ipAssets, setIPAssets] = useState<IPAsset[]>(mockIPAssets);
  const [validations, setValidations] = useState<Validation[]>(mockValidations);
  const [listings, setListings] = useState<Listing[]>(mockListings);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [activities, setActivities] = useState<Activity[]>(mockActivities);
  const [currentUser] = useState<User | null>(mockUsers[0]);
  const [isLoading, setIsLoading] = useState(false);

  const setLoading = (loading: boolean) => setIsLoading(loading);

  const projectOps = {
    create: useCallback(async (data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> => {
      const now = formatDate(new Date());
      const newProject: Project = { ...data, id: generateId(), createdAt: now, updatedAt: now };
      setProjects(prev => [...prev, newProject]);
      return newProject;
    }, []),

    update: useCallback(async (id: string, data: Partial<Project>): Promise<Project> => {
      setProjects(prev => prev.map(p => p.id === id ? { ...p, ...data, updatedAt: formatDate(new Date()) } : p));
      return projects.find(p => p.id === id)!;
    }, [projects]),

    delete: useCallback(async (id: string): Promise<void> => {
      setProjects(prev => prev.filter(p => p.id !== id));
    }, []),

    getById: useCallback((id: string) => projects.find(p => p.id === id), [projects]),
  };

  const ipOps = {
    create: useCallback(async (data: Omit<IPAsset, 'id' | 'createdAt' | 'updatedAt'>): Promise<IPAsset> => {
      const now = formatDate(new Date());
      const newIP: IPAsset = { ...data, id: generateId(), createdAt: now, updatedAt: now };
      setIPAssets(prev => [...prev, newIP]);
      return newIP;
    }, []),

    update: useCallback(async (id: string, data: Partial<IPAsset>): Promise<IPAsset> => {
      setIPAssets(prev => prev.map(ip => ip.id === id ? { ...ip, ...data, updatedAt: formatDate(new Date()) } : ip));
      return ipAssets.find(ip => ip.id === id)!;
    }, [ipAssets]),

    delete: useCallback(async (id: string): Promise<void> => {
      setIPAssets(prev => prev.filter(ip => ip.id !== id));
    }, []),

    getById: useCallback((id: string) => ipAssets.find(ip => ip.id === id), [ipAssets]),
  };

  const validationOps = {
    create: useCallback(async (data: Omit<Validation, 'id' | 'createdAt' | 'updatedAt'>): Promise<Validation> => {
      const now = formatDate(new Date());
      const newValidation: Validation = { ...data, id: generateId(), createdAt: now, updatedAt: now };
      setValidations(prev => [...prev, newValidation]);
      return newValidation;
    }, []),

    update: useCallback(async (id: string, data: Partial<Validation>): Promise<Validation> => {
      setValidations(prev => prev.map(v => v.id === id ? { ...v, ...data, updatedAt: formatDate(new Date()) } : v));
      return validations.find(v => v.id === id)!;
    }, [validations]),

    submit: useCallback(async (id: string): Promise<Validation> => {
      setValidations(prev => prev.map(v => v.id === id ? { ...v, status: 'in_review', updatedAt: formatDate(new Date()) } : v));
      return validations.find(v => v.id === id)!;
    }, [validations]),

    approve: useCallback(async (id: string, score: number, notes: string): Promise<Validation> => {
      setValidations(prev => prev.map(v => v.id === id ? { ...v, status: 'verified', score, notes, reviewer: currentUser?.name, updatedAt: formatDate(new Date()) } : v));
      return validations.find(v => v.id === id)!;
    }, [validations, currentUser]),

    reject: useCallback(async (id: string, notes: string): Promise<Validation> => {
      setValidations(prev => prev.map(v => v.id === id ? { ...v, status: 'rejected', notes, reviewer: currentUser?.name, updatedAt: formatDate(new Date()) } : v));
      return validations.find(v => v.id === id)!;
    }, [validations, currentUser]),
  };

  const listingOps = {
    create: useCallback(async (data: Omit<Listing, 'id' | 'createdAt' | 'updatedAt'>): Promise<Listing> => {
      const now = formatDate(new Date());
      const newListing: Listing = { ...data, id: generateId(), createdAt: now, updatedAt: now };
      setListings(prev => [...prev, newListing]);
      return newListing;
    }, []),

    update: useCallback(async (id: string, data: Partial<Listing>): Promise<Listing> => {
      setListings(prev => prev.map(l => l.id === id ? { ...l, ...data, updatedAt: formatDate(new Date()) } : l));
      return listings.find(l => l.id === id)!;
    }, [listings]),

    delete: useCallback(async (id: string): Promise<void> => {
      setListings(prev => prev.filter(l => l.id !== id));
    }, []),

    purchase: useCallback(async (id: string): Promise<void> => {
      setListings(prev => prev.map(l => l.id === id ? { ...l, status: 'sold', updatedAt: formatDate(new Date()) } : l));
    }, []),
  };

  const transactionOps = {
    create: useCallback(async (data: Omit<Transaction, 'id' | 'createdAt'>): Promise<Transaction> => {
      const now = new Date().toISOString();
      const newTx: Transaction = { ...data, id: generateId(), createdAt: now };
      setTransactions(prev => [...prev, newTx]);
      return newTx;
    }, []),

    delete: useCallback(async (id: string): Promise<void> => {
      setTransactions(prev => prev.filter(t => t.id !== id));
    }, []),

    getByDateRange: useCallback((start: string, end: string): Transaction[] => {
      return transactions.filter(t => t.date >= start && t.date <= end);
    }, [transactions]),
  };

  const addActivity = useCallback((activity: Omit<Activity, 'id' | 'createdAt'>) => {
    const newActivity: Activity = { ...activity, id: generateId(), createdAt: new Date().toISOString() };
    setActivities(prev => [newActivity, ...prev]);
  }, []);

  return (
    <AppContext.Provider value={{
      projects,
      ipAssets,
      validations,
      listings,
      transactions,
      activities,
      currentUser,
      isLoading,
      setLoading,
      createProject: projectOps.create,
      updateProject: projectOps.update,
      deleteProject: projectOps.delete,
      getProjectById: projectOps.getById,
      createIPAsset: ipOps.create,
      updateIPAsset: ipOps.update,
      deleteIPAsset: ipOps.delete,
      getIPAssetById: ipOps.getById,
      createValidation: validationOps.create,
      updateValidation: validationOps.update,
      submitValidation: validationOps.submit,
      approveValidation: validationOps.approve,
      rejectValidation: validationOps.reject,
      createListing: listingOps.create,
      updateListing: listingOps.update,
      deleteListing: listingOps.delete,
      purchaseListing: listingOps.purchase,
      createTransaction: transactionOps.create,
      deleteTransaction: transactionOps.delete,
      getTransactionsByDateRange: transactionOps.getByDateRange,
      addActivity,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
