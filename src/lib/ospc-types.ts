export type ProjectCategory = 'ai' | 'biotech' | 'hardware' | 'blockchain' | 'quantum';

export type ProjectStatus = 'active' | 'pending' | 'completed' | 'archived';

export interface CVScore {
  total: number;
  commitWeight: number;
  crossRepoCredit: number;
  temporalDecay: number;
  negativeContrib: number;
  pairProgramming: number;
  issueTriage: number;
  testCoverage: number;
  refactoring: number;
  semanticQuality: number;
  commitMessageQuality: number;
  adrCredit: number;
  reviewDepth: number;
  benchmarkImprovement: number;
  multiModal: number;
  lastUpdated: string;
}

export interface Contribution {
  id: string;
  contributorId: string;
  projectId: string;
  type: 'commit' | 'review' | 'issue' | 'adr' | 'test' | 'documentation' | 'design' | 'benchmark';
  cvImpact: number;
  timestamp: string;
  metadata: Record<string, unknown>;
  merged: boolean;
}

export interface OMU {
  id: string;
  projectId: string;
  contributorId: string;
  amount: number;
  vestingSchedule: VestingSchedule;
  locked: number;
  transferable: number;
  createdAt: string;
  updatedAt: string;
}

export interface VestingSchedule {
  cliff: number; // months
  totalDuration: number; // months
  startedAt: string;
  vestedAt: string;
}

export interface RoyaltyPayment {
  id: string;
  projectId: string;
  amount: number;
  currency: string;
  convertedInr: number;
  recipientId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  paymentMethod: 'upi' | 'bank_transfer' | 'rtgs' | 'crypto';
  createdAt: string;
  processedAt?: string;
  taxDeducted: number;
  netAmount: number;
}

export interface Proposal {
  id: string;
  projectId: string;
  title: string;
  description: string;
  type: 'parameter_change' | 'license' | 'budget' | 'governance' | 'emergency';
  status: 'draft' | 'signaling' | 'voting' | 'passed' | 'rejected' | 'executed';
  votesFor: number;
  votesAgainst: number;
  abstain: number;
  conviction: number;
  createdBy: string;
  createdAt: string;
  endsAt: string;
  executedAt?: string;
}

export interface License {
  id: string;
  projectId: string;
  licensee: string;
  type: 'enterprise' | 'academic' | 'sublicense' | 'field_of_use';
  fieldOfUse?: string;
  territory: string;
  royaltyRate: number;
  minimumAnnual: number;
  status: 'active' | 'pending' | 'expired' | 'terminated';
  startDate: string;
  endDate?: string;
  paymentFrequency: 'monthly' | 'quarterly' | 'annual';
  lastPayment?: string;
  nextPayment?: string;
}

export interface Contributor {
  id: string;
  name: string;
  email: string;
  orcid?: string;
  github?: string;
  role: 'contributor' | 'maintainer' | 'steward' | 'founder';
  cvScore: CVScore;
  omus: OMU[];
  totalRoyaltiesReceived: number;
  skills: string[];
  reputationScore: number;
  badges: Badge[];
  delegateTo?: string;
  beneficiaries?: string[];
  createdAt: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  earnedAt: string;
  imageUrl: string;
}

export interface Patent {
  id: string;
  projectId: string;
  title: string;
  type: 'provisional' | 'full' | 'PCT' | 'continuation';
  status: 'draft' | 'filed' | 'examined' | 'granted' | 'rejected' | 'expired';
  jurisdiction: string;
  applicationNumber?: string;
  grantNumber?: string;
  filingDate: string;
  grantDate?: string;
  expiryDate?: string;
  inventors: string[];
  claims: number;
  valuation: number;
  citedBy: number;
}

export interface Activity {
  id: string;
  type: 'project' | 'ip' | 'validation' | 'marketplace' | 'revenue' | 'governance' | 'cv' | 'omu';
  action: string;
  description: string;
  userId: string;
  userName: string;
  relatedId?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  category: ProjectCategory;
  status: ProjectStatus;
  description: string;
  ipCount: number;
  value: number;
  growth: number;
  createdAt: string;
  updatedAt: string;
  owner: string;
  tags: string[];
  trl: number;
  contributors: string[];
  vestingConfig: {
    cliff: number;
    duration: number;
  };
  governanceModel: 'omu_weighted' | 'cv_weighted';
  treasury: number;
  licenses: string[];
}

export type ValidationStatus = 'pending' | 'in_review' | 'verified' | 'rejected';

export type ValidationType = 'technology' | 'patent' | 'trademark' | 'copyright';

export interface Validation {
  id: string;
  name: string;
  type: ValidationType;
  projectId: string;
  projectName: string;
  status: ValidationStatus;
  score: number;
  submitter: string;
  reviewer?: string;
  notes?: string;
  documents: string[];
  createdAt: string;
  updatedAt: string;
}

export type ListingType = 'technology' | 'patent' | 'trademark' | 'data';

export type ListingStatus = 'active' | 'pending' | 'sold' | 'withdrawn';

export interface Listing {
  id: string;
  title: string;
  type: ListingType;
  status: ListingStatus;
  sellerId: string;
  sellerName: string;
  price: number;
  change: number;
  views: number;
  likes: number;
  category: string;
  description: string;
  details: Record<string, string>;
  images: string[];
  trl: number;
  techStack: string[];
  createdAt: string;
  updatedAt: string;
}

export type TransactionType = 'income' | 'expense';

export type TransactionCategory = 'investment' | 'licensing' | 'sale' | 'grant' | 'royalty' | 'legal' | 'operations' | 'research';

export type TransactionStatus = 'completed' | 'pending' | 'failed';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  relatedId?: string;
  relatedType?: string;
  date: string;
  status: TransactionStatus;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'viewer';
  avatar?: string;
}

export interface ProposalSimulation {
  parameter: string;
  oldValue: number;
  newValue: number;
  affectedContributors: { id: string; change: number }[];
}

export interface MarketListing {
  sellerId: string;
  omuAmount: number;
  pricePerOmu: number;
  status: 'active' | 'filled' | 'cancelled';
}

export interface Loan {
  id: string;
  borrowerId: string;
  collateralOmu: string[];
  amount: number;
  interest: number;
  status: 'pending' | 'approved' | 'active' | 'repaid' | 'defaulted';
  dueDate: string;
}

export interface Report {
  id: string;
  type: 'project_health' | 'contributor_churn' | 'licensing_pipeline' | 'royalty_forecast' | 'patent_portfolio' | 'custom';
  generatedAt: string;
  data: Record<string, unknown>;
}