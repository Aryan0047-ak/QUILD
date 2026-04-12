export type ProjectCategory = 'ai' | 'biotech' | 'hardware' | 'blockchain' | 'quantum';
export type ProjectStatus = 'active' | 'pending' | 'completed' | 'archived';

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
}

export type IPStatus = 'draft' | 'pending' | 'in_review' | 'verified' | 'rejected' | 'granted';
export type IPType = 'patent' | 'trademark' | 'copyright' | 'trade_secret';

export interface IPAsset {
  id: string;
  title: string;
  type: IPType;
  status: IPStatus;
  projectId: string;
  projectName: string;
  description: string;
  filingDate?: string;
  expiryDate?: string;
  jurisdiction: string;
  inventors: string[];
  value: number;
  documents: Document[];
  createdAt: string;
  updatedAt: string;
  details?: Record<string, string>;
  images?: string[];
}

export interface Document {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedAt: string;
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

export interface Activity {
  id: string;
  type: 'project' | 'ip' | 'validation' | 'marketplace' | 'revenue' | 'user';
  action: string;
  description: string;
  userId: string;
  userName: string;
  relatedId?: string;
  createdAt: string;
}
