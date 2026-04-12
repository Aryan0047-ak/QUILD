'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Contributor, Project, CVScore, OMU, RoyaltyPayment, Proposal, License, Patent, Activity, Listing, Transaction, Validation } from '@/lib/ospc-types';
import { mockContributors, mockProjects, mockOMUs, mockRoyaltyPayments, mockProposals, mockLicenses, mockPatents, mockListings, mockTransactions, mockActivities, mockProjectHealth, mockChurnRisk, mockValidations } from '@/lib/ospc-data';

interface OSPCContextType {
  // Data
  contributors: Contributor[];
  projects: Project[];
  omus: OMU[];
  royaltyPayments: RoyaltyPayment[];
  proposals: Proposal[];
  licenses: License[];
  patents: Patent[];
  listings: Listing[];
  transactions: Transaction[];
  activities: Activity[];
  validations: Validation[];
  projectHealth: Record<string, { score: number; contributors: number; testCoverage: number; dependencySecurity: string; governanceParticipation: number; licensingPipeline: number }>;
  churnRisk: Record<string, { risk: number; signals: string[] }>;
  
  // CV Engine
  getCVScore: (contributorId: string) => CVScore | undefined;
  getCVBreakdown: (contributorId: string) => string;
  
  // OMU Operations
  getOMUs: (contributorId: string) => OMU[];
  getOMUTotal: (contributorId: string) => number;
  
  // Governance
  createProposal: (proposal: Omit<Proposal, 'id' | 'createdAt' | 'status' | 'votesFor' | 'votesAgainst' | 'abstain' | 'conviction'>) => Promise<void>;
  vote: (proposalId: string, support: boolean | 'abstain', weight: number) => Promise<void>;
  executeProposal: (proposalId: string) => Promise<void>;
  
  // Licensing
  createLicense: (license: Omit<License, 'id'>) => Promise<void>;
  
  // Patents
  getPatents: () => Patent[];
  
  // Marketplace
  purchaseListing: (listingId: string, buyerId: string) => Promise<void>;
  
  // Analytics
  getProjectHealth: (projectId: string) => { score: number; contributors: number; testCoverage: number; dependencySecurity: string; governanceParticipation: number; licensingPipeline: number };
  getChurnRisk: (contributorId: string) => { risk: number; signals: string[] } | undefined;
  
  // Contributors
  getContributor: (id: string) => Contributor | undefined;
  getAllContributors: () => Contributor[];
  
  // Transactions
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => Promise<void>;
  
  // Project CRUD
  createProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateProject: (id: string, project: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  
  // Validation CRUD
  createValidation: (validation: Omit<Validation, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateValidation: (id: string, validation: Partial<Validation>) => Promise<void>;
  approveValidation: (id: string) => Promise<void>;
  rejectValidation: (id: string) => Promise<void>;
  
  // Listing CRUD
  createListing: (listing: Omit<Listing, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateListing: (id: string, listing: Partial<Listing>) => Promise<void>;
  deleteListing: (id: string) => Promise<void>;
  
  // Transaction CRUD
  createTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  
  // Activities
  addActivity: (activity: Omit<Activity, 'id' | 'createdAt'>) => void;
}

const OSPCContext = createContext<OSPCContextType | undefined>(undefined);

function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function OSPCProvider({ children }: { children: ReactNode }) {
  const [contributors] = useState<Contributor[]>(mockContributors);
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [omus] = useState<OMU[]>(mockOMUs);
  const [royaltyPayments] = useState<RoyaltyPayment[]>(mockRoyaltyPayments);
  const [proposals, setProposals] = useState<Proposal[]>(mockProposals);
  const [licenses, setLicenses] = useState<License[]>(mockLicenses);
  const [patents] = useState<Patent[]>(mockPatents);
  const [listings, setListings] = useState<Listing[]>(mockListings);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [activities, setActivities] = useState<Activity[]>(mockActivities);
  const [validations, setValidations] = useState<Validation[]>(mockValidations || []);

  const getCVScore = useCallback((contributorId: string) => {
    return contributors.find(c => c.id === contributorId)?.cvScore;
  }, [contributors]);

  const getCVBreakdown = useCallback((contributorId: string) => {
    const cv = contributors.find(c => c.id === contributorId)?.cvScore;
    if (!cv) return '';
    return `Total: ${cv.total} pts | Commits: ${cv.commitWeight} | Reviews: ${cv.reviewDepth} | Tests: ${cv.testCoverage} | Semantic: ${cv.semanticQuality}`;
  }, [contributors]);

  const getOMUs = useCallback((contributorId: string) => {
    return omus.filter(o => o.contributorId === contributorId);
  }, [omus]);

  const getOMUTotal = useCallback((contributorId: string) => {
    return omus.filter(o => o.contributorId === contributorId).reduce((sum, o) => sum + o.transferable, 0);
  }, [omus]);

  const createProposal = useCallback(async (proposalData: Omit<Proposal, 'id' | 'createdAt' | 'status' | 'votesFor' | 'votesAgainst' | 'abstain' | 'conviction'>) => {
    const newProposal: Proposal = {
      ...proposalData,
      id: generateId(),
      status: 'signaling',
      votesFor: 0,
      votesAgainst: 0,
      abstain: 0,
      conviction: 0,
      createdAt: new Date().toISOString(),
    };
    setProposals(prev => [...prev, newProposal]);
    addActivity({
      type: 'governance',
      action: 'proposal_created',
      description: `New proposal: ${proposalData.title}`,
      userId: proposalData.createdBy,
      userName: contributors.find(c => c.id === proposalData.createdBy)?.name || 'Unknown',
      relatedId: newProposal.id,
    });
  }, []);

  const vote = useCallback(async (proposalId: string, support: boolean | 'abstain', weight: number) => {
    setProposals(prev => prev.map(p => {
      if (p.id !== proposalId) return p;
      if (support === 'abstain') {
        return { ...p, abstain: p.abstain + weight };
      }
      return support 
        ? { ...p, votesFor: p.votesFor + weight, conviction: p.conviction + weight }
        : { ...p, votesAgainst: p.votesAgainst + weight };
    }));
  }, []);

  const executeProposal = useCallback(async (proposalId: string) => {
    setProposals(prev => prev.map(p => {
      if (p.id !== proposalId) return p;
      return { ...p, status: 'executed', executedAt: new Date().toISOString() };
    }));
  }, []);

  const createLicense = useCallback(async (licenseData: Omit<License, 'id'>) => {
    const newLicense: License = { ...licenseData, id: generateId() };
    setLicenses(prev => [...prev, newLicense]);
    addActivity({
      type: 'project',
      action: 'license_created',
      description: `New license agreement with ${licenseData.licensee}`,
      userId: '1',
      userName: 'System',
      relatedId: newLicense.id,
    });
  }, []);

  const purchaseListing = useCallback(async (listingId: string, buyerId: string) => {
    setListings(prev => prev.map(l => {
      if (l.id !== listingId) return l;
      return { ...l, status: 'sold' };
    }));
  }, []);

  const getProjectHealth = useCallback((projectId: string) => {
    return (mockProjectHealth as Record<string, { score: number; contributors: number; testCoverage: number; dependencySecurity: string; governanceParticipation: number; licensingPipeline: number }>)[projectId] || { score: 0, contributors: 0, testCoverage: 0, dependencySecurity: 'unknown', governanceParticipation: 0, licensingPipeline: 0 };
  }, []);

  const getChurnRisk = useCallback((contributorId: string) => {
    return (mockChurnRisk as Record<string, { risk: number; signals: string[] }>)[contributorId];
  }, []);

  const getContributor = useCallback((id: string) => {
    return contributors.find(c => c.id === id);
  }, [contributors]);

  const getAllContributors = useCallback(() => {
    return contributors;
  }, [contributors]);

  const addTransaction = useCallback(async (transactionData: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTransaction: Transaction = {
      ...transactionData,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    setTransactions(prev => [...prev, newTransaction]);
  }, []);

  const addActivity = useCallback((activityData: Omit<Activity, 'id' | 'createdAt'>) => {
    const newActivity: Activity = {
      ...activityData,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    setActivities(prev => [newActivity, ...prev]);
  }, []);

  const createProject = useCallback(async (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProject: Project = {
      ...projectData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setProjects(prev => [...prev, newProject]);
  }, []);

  const updateProject = useCallback(async (id: string, projectData: Partial<Project>) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...projectData, updatedAt: new Date().toISOString() } : p));
  }, []);

  const deleteProject = useCallback(async (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  }, []);

  const createValidation = useCallback(async (validationData: Omit<Validation, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newValidation: Validation = {
      ...validationData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setValidations(prev => [...prev, newValidation]);
  }, []);

  const updateValidation = useCallback(async (id: string, validationData: Partial<Validation>) => {
    setValidations(prev => prev.map(v => v.id === id ? { ...v, ...validationData, updatedAt: new Date().toISOString() } : v));
  }, []);

  const approveValidation = useCallback(async (id: string, score?: number, notes?: string) => {
    setValidations(prev => prev.map(v => v.id === id ? { 
      ...v, 
      status: 'verified' as const, 
      score: score ?? v.score,
      notes: notes ?? v.notes,
      reviewer: 'Admin',
      updatedAt: new Date().toISOString() 
    } : v));
  }, []);

  const rejectValidation = useCallback(async (id: string, notes?: string) => {
    setValidations(prev => prev.map(v => v.id === id ? { 
      ...v, 
      status: 'rejected' as const,
      notes: notes ?? v.notes,
      reviewer: 'Admin',
      updatedAt: new Date().toISOString() 
    } : v));
  }, []);

  const createListing = useCallback(async (listingData: Omit<Listing, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newListing: Listing = {
      ...listingData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setListings(prev => [...prev, newListing]);
  }, []);

  const updateListing = useCallback(async (id: string, listingData: Partial<Listing>) => {
    setListings(prev => prev.map(l => l.id === id ? { ...l, ...listingData, updatedAt: new Date().toISOString() } : l));
  }, []);

  const deleteListing = useCallback(async (id: string) => {
    setListings(prev => prev.filter(l => l.id !== id));
  }, []);

  const createTransaction = useCallback(async (transactionData: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTransaction: Transaction = {
      ...transactionData,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    setTransactions(prev => [...prev, newTransaction]);
  }, []);

  const deleteTransaction = useCallback(async (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <OSPCContext.Provider value={{
      contributors, projects, omus, royaltyPayments, proposals,
      licenses, patents, listings, transactions, activities, validations,
      projectHealth: mockProjectHealth, churnRisk: mockChurnRisk,
      getCVScore, getCVBreakdown, getOMUs, getOMUTotal,
      createProposal, vote, executeProposal,
      createLicense,
      getPatents: () => patents,
      purchaseListing,
      getProjectHealth, getChurnRisk,
      getContributor, getAllContributors,
      addTransaction,
      createProject, updateProject, deleteProject,
      createValidation, updateValidation, approveValidation, rejectValidation,
      createListing, updateListing, deleteListing,
      createTransaction, deleteTransaction,
      addActivity,
    }}>
      {children}
    </OSPCContext.Provider>
  );
}

export function useOSPC() {
  const context = useContext(OSPCContext);
  if (context === undefined) {
    throw new Error('useOSPC must be used within an OSPCProvider');
  }
  return context;
}