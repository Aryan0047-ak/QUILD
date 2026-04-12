import { Project, IPAsset, Validation, Listing, Transaction, Activity, User } from './types';

export const mockUsers: User[] = [
  { id: '1', name: 'Admin', email: 'admin@quild.com', role: 'admin' },
  { id: '2', name: 'Dr. Sarah Chen', email: 'sarah@quild.com', role: 'manager' },
  { id: '3', name: 'Michael Wong', email: 'michael@quild.com', role: 'manager' },
];

export const mockProjects: Project[] = [
  { id: '1', name: 'NeuralCore', category: 'ai', status: 'active', description: 'Advanced neural network architecture for edge computing', ipCount: 12, value: 2400000, growth: 24, createdAt: '2025-01-15', updatedAt: '2026-04-09', owner: '1', tags: ['AI', 'Edge Computing', 'Neural Networks'] },
  { id: '2', name: 'BioSynth', category: 'biotech', status: 'active', description: 'Synthetic biology platform for sustainable materials', ipCount: 8, value: 1800000, growth: 18, createdAt: '2025-03-20', updatedAt: '2026-04-08', owner: '2', tags: ['Biotech', 'Sustainability', 'Synthetic Biology'] },
  { id: '3', name: 'QuantumStack', category: 'quantum', status: 'pending', description: 'Quantum computing interface and control systems', ipCount: 5, value: 3200000, growth: 32, createdAt: '2025-06-10', updatedAt: '2026-04-07', owner: '3', tags: ['Quantum', 'Computing', 'Hardware'] },
  { id: '4', name: 'DeepMind AI', category: 'ai', status: 'active', description: 'Machine learning framework for autonomous systems', ipCount: 15, value: 4100000, growth: 45, createdAt: '2024-11-01', updatedAt: '2026-04-06', owner: '2', tags: ['AI', 'ML', 'Autonomous'] },
  { id: '5', name: 'GeneEdit Pro', category: 'biotech', status: 'completed', description: 'CRISPR-based gene editing toolkit', ipCount: 6, value: 2900000, growth: 28, createdAt: '2024-08-15', updatedAt: '2026-04-05', owner: '3', tags: ['Biotech', 'CRISPR', 'Gene Editing'] },
  { id: '6', name: 'SiliconFlow', category: 'hardware', status: 'active', description: 'Next-generation semiconductor design tools', ipCount: 9, value: 1500000, growth: 15, createdAt: '2025-02-28', updatedAt: '2026-04-04', owner: '1', tags: ['Hardware', 'Semiconductors', 'EDA'] },
  { id: '7', name: 'CogniLink', category: 'ai', status: 'active', description: 'Brain-computer interface signal processing', ipCount: 7, value: 980000, growth: 12, createdAt: '2025-07-22', updatedAt: '2026-04-03', owner: '2', tags: ['AI', 'BCI', 'Neurotech'] },
  { id: '8', name: 'NanoVax', category: 'biotech', status: 'pending', description: 'Nanoparticle-based vaccine delivery platform', ipCount: 4, value: 2100000, growth: 22, createdAt: '2025-09-05', updatedAt: '2026-04-02', owner: '3', tags: ['Biotech', 'Nanotech', 'Vaccines'] },
];

export const mockIPAssets: IPAsset[] = [
  { id: '1', title: 'Neural Network Architecture with Adaptive Learning Rates', type: 'patent', status: 'granted', projectId: '1', projectName: 'NeuralCore', description: 'Novel neural network architecture with adaptive learning rate optimization', filingDate: '2024-03-15', expiryDate: '2044-03-15', jurisdiction: 'US', inventors: ['Dr. Sarah Chen', 'Dr. James Liu'], value: 2400000, documents: [], createdAt: '2024-03-15', updatedAt: '2026-01-10' },
  { id: '2', title: 'Quantum Error Correction Method for Qubits', type: 'patent', status: 'granted', projectId: '3', projectName: 'QuantumStack', description: 'Advanced error correction for quantum computing', filingDate: '2024-01-20', expiryDate: '2044-01-20', jurisdiction: 'EP', inventors: ['Prof. Michael Wong'], value: 3200000, documents: [], createdAt: '2024-01-20', updatedAt: '2025-12-15' },
  { id: '3', title: 'CRISPR Delivery System Using Nanoparticles', type: 'patent', status: 'pending', projectId: '2', projectName: 'BioSynth', description: 'Novel nanoparticle delivery system for CRISPR', filingDate: '2025-11-08', expiryDate: '2045-11-08', jurisdiction: 'US', inventors: ['Dr. Emily Park', 'Dr. Lisa Zhang'], value: 1800000, documents: [], createdAt: '2025-11-08', updatedAt: '2026-04-01' },
  { id: '4', title: 'Edge Computing Protocol for IoT Devices', type: 'patent', status: 'in_review', projectId: '1', projectName: 'NeuralCore', description: 'Low-power communication protocol for edge devices', filingDate: '2025-08-22', expiryDate: '2045-08-22', jurisdiction: 'US', inventors: ['Robert Kim', 'Dr. Sarah Chen'], value: 980000, documents: [], createdAt: '2025-08-22', updatedAt: '2026-03-20' },
  { id: '5', title: 'Synthetic Biology Framework for Sustainable Materials', type: 'patent', status: 'pending', projectId: '5', projectName: 'GeneEdit Pro', description: 'Framework for engineering sustainable materials', filingDate: '2025-12-01', expiryDate: '2045-12-01', jurisdiction: 'WO', inventors: ['Dr. Michael Wong', 'Dr. Emily Park'], value: 2100000, documents: [], createdAt: '2025-12-01', updatedAt: '2026-04-05' },
  { id: '6', title: 'Semiconductor Design Method v3.0', type: 'patent', status: 'granted', projectId: '6', projectName: 'SiliconFlow', description: 'Advanced semiconductor design automation', filingDate: '2023-06-10', expiryDate: '2043-06-10', jurisdiction: 'US', inventors: ['James Liu'], value: 1500000, documents: [], createdAt: '2023-06-10', updatedAt: '2025-08-20' },
  { id: '7', title: 'Brain-Computer Interface Signal Processing', type: 'patent', status: 'in_review', projectId: '7', projectName: 'CogniLink', description: 'Signal processing algorithms for BCI', filingDate: '2025-09-15', expiryDate: '2045-09-15', jurisdiction: 'US', inventors: ['Dr. Lisa Zhang', 'Dr. Sarah Chen'], value: 2900000, documents: [], createdAt: '2025-09-15', updatedAt: '2026-03-15' },
  { id: '8', title: 'NeuralCore Brand', type: 'trademark', status: 'granted', projectId: '1', projectName: 'NeuralCore', description: 'Registered trademark for NeuralCore brand', filingDate: '2024-02-01', expiryDate: '2034-02-01', jurisdiction: 'US', inventors: [], value: 50000, documents: [], createdAt: '2024-02-01', updatedAt: '2025-02-01' },
];

export const mockValidations: Validation[] = [
  { id: '1', name: 'Neural Network Architecture v2.1', type: 'technology', projectId: '1', projectName: 'NeuralCore', status: 'verified', score: 94, submitter: 'Dr. Sarah Chen', reviewer: 'Dr. James Liu', notes: 'Excellent technical implementation', documents: [], createdAt: '2026-04-01', updatedAt: '2026-04-09' },
  { id: '2', name: 'CRISPR Delivery System', type: 'patent', projectId: '2', projectName: 'BioSynth', status: 'verified', score: 88, submitter: 'Dr. Michael Wong', reviewer: 'Dr. Emily Park', documents: [], createdAt: '2026-04-05', updatedAt: '2026-04-08' },
  { id: '3', name: 'Quantum Error Correction', type: 'technology', projectId: '3', projectName: 'QuantumStack', status: 'in_review', score: 0, submitter: 'Prof. James Liu', documents: [], createdAt: '2026-04-08', updatedAt: '2026-04-08' },
  { id: '4', name: 'Edge Computing Protocol', type: 'technology', projectId: '1', projectName: 'NeuralCore', status: 'pending', score: 0, submitter: 'Dr. Sarah Chen', documents: [], createdAt: '2026-04-07', updatedAt: '2026-04-07' },
  { id: '5', name: 'Synthetic Biology Framework', type: 'patent', projectId: '5', projectName: 'GeneEdit Pro', status: 'rejected', score: 45, submitter: 'Dr. Emily Park', reviewer: 'Dr. Lisa Zhang', notes: 'Insufficient novelty', documents: [], createdAt: '2026-04-01', updatedAt: '2026-04-06' },
  { id: '6', name: 'Semiconductor Design v3.0', type: 'technology', projectId: '6', projectName: 'SiliconFlow', status: 'verified', score: 91, submitter: 'Robert Kim', reviewer: 'Dr. James Liu', documents: [], createdAt: '2026-04-02', updatedAt: '2026-04-05' },
  { id: '7', name: 'Neural Interface Protocol', type: 'technology', projectId: '7', projectName: 'CogniLink', status: 'in_review', score: 0, submitter: 'Dr. Lisa Zhang', documents: [], createdAt: '2026-04-04', updatedAt: '2026-04-04' },
  { id: '8', name: 'Nanoparticle Synthesis', type: 'patent', projectId: '8', projectName: 'NanoVax', status: 'pending', score: 0, submitter: 'Dr. Michael Wong', documents: [], createdAt: '2026-04-03', updatedAt: '2026-04-03' },
];

export const mockListings: Listing[] = [
  { id: '1', title: 'AI Image Generation Model', type: 'technology', status: 'active', sellerId: '1', sellerName: 'NeuralTech Labs', price: 450000, change: 12, views: 234, likes: 45, category: 'AI/ML', description: 'State-of-the-art image generation model with proprietary architecture', details: { 'Model Size': '7B params', 'License': 'Commercial', 'API': 'REST API' }, images: [], createdAt: '2026-03-01', updatedAt: '2026-04-09' },
  { id: '2', title: 'Quantum Computing Patent Portfolio', type: 'patent', status: 'active', sellerId: '2', sellerName: 'Quantum Innovations', price: 2800000, change: 8, views: 156, likes: 32, category: 'Quantum', description: '12 patents covering quantum error correction and qubit control', details: { 'Patents': '12', 'Jurisdiction': 'US, EP, WO', 'Status': 'Granted' }, images: [], createdAt: '2026-02-15', updatedAt: '2026-04-08' },
  { id: '3', title: 'Biotech Synthesis Platform', type: 'technology', status: 'active', sellerId: '3', sellerName: 'BioSynth Inc', price: 890000, change: -3, views: 89, likes: 18, category: 'Biotech', description: 'Automated synthetic biology platform for sustainable materials', details: { 'Platform': 'Cloud-based', 'Users': '50+', 'API': 'GraphQL' }, images: [], createdAt: '2026-01-20', updatedAt: '2026-04-07' },
  { id: '4', title: 'Smart IoT Protocol', type: 'patent', status: 'active', sellerId: '1', sellerName: 'EdgeNet Systems', price: 320000, change: 15, views: 178, likes: 56, category: 'IoT', description: 'Low-power IoT communication protocol for edge devices', details: { 'Protocol': 'MQTT-based', 'Power': '<1mW', 'Range': '500m' }, images: [], createdAt: '2026-03-10', updatedAt: '2026-04-06' },
  { id: '5', title: 'Neural Interface IP', type: 'patent', status: 'active', sellerId: '2', sellerName: 'CogniTech', price: 1200000, change: 22, views: 267, likes: 78, category: 'Neurotech', description: 'Brain-computer interface signal processing patents', details: { 'Patents': '5', 'Signal': 'EEG/EMG', 'Latency': '<10ms' }, images: [], createdAt: '2026-02-28', updatedAt: '2026-04-05' },
  { id: '6', title: 'Semiconductor Design Tools', type: 'technology', status: 'sold', sellerId: '3', sellerName: 'SiliconFlow', price: 680000, change: 5, views: 123, likes: 29, category: 'Hardware', description: 'Advanced semiconductor design and simulation tools', details: { 'Tools': 'EDA Suite', 'Nodes': '3nm-130nm', 'License': 'Enterprise' }, images: [], createdAt: '2026-01-10', updatedAt: '2026-03-15' },
];

export const mockTransactions: Transaction[] = [
  { id: '1', description: 'TechVentures Investment', amount: 250000, type: 'income', category: 'investment', relatedId: '1', relatedType: 'project', date: '2026-04-09', status: 'completed', createdAt: '2026-04-09' },
  { id: '2', description: 'Patent Filing - US2026891', amount: 15000, type: 'expense', category: 'legal', relatedId: '1', relatedType: 'ip', date: '2026-04-08', status: 'completed', createdAt: '2026-04-08' },
  { id: '3', description: 'QuantumCore Licensing', amount: 85000, type: 'income', category: 'licensing', relatedId: '3', relatedType: 'project', date: '2026-04-07', status: 'completed', createdAt: '2026-04-07' },
  { id: '4', description: 'Marketplace Sale - AI Model', amount: 450000, type: 'income', category: 'sale', relatedId: '1', relatedType: 'listing', date: '2026-04-06', status: 'completed', createdAt: '2026-04-06' },
  { id: '5', description: 'Cloud Infrastructure', amount: 12500, type: 'expense', category: 'operations', date: '2026-04-05', status: 'completed', createdAt: '2026-04-05' },
  { id: '6', description: 'Research Grant - BioSynth', amount: 180000, type: 'income', category: 'grant', relatedId: '2', relatedType: 'project', date: '2026-04-04', status: 'completed', createdAt: '2026-04-04' },
  { id: '7', description: 'Legal Consultation', amount: 8500, type: 'expense', category: 'legal', date: '2026-04-03', status: 'completed', createdAt: '2026-04-03' },
  { id: '8', description: 'Royalty - NeuralCore', amount: 32000, type: 'income', category: 'royalty', relatedId: '1', relatedType: 'ip', date: '2026-04-02', status: 'completed', createdAt: '2026-04-02' },
  { id: '9', description: 'Team Salaries', amount: 85000, type: 'expense', category: 'operations', date: '2026-04-01', status: 'completed', createdAt: '2026-04-01' },
  { id: '10', description: 'Investor Funding - Series A', amount: 500000, type: 'income', category: 'investment', date: '2026-03-28', status: 'completed', createdAt: '2026-03-28' },
];

export const mockActivities: Activity[] = [
  { id: '1', type: 'project', action: 'created', description: 'New AI project "NeuralCore" added', userId: '1', userName: 'Admin', relatedId: '1', createdAt: '2026-04-09T10:30:00Z' },
  { id: '2', type: 'ip', action: 'granted', description: 'Patent #US2026891 granted', userId: '2', userName: 'Dr. Sarah Chen', relatedId: '1', createdAt: '2026-04-09T10:15:00Z' },
  { id: '3', type: 'revenue', action: 'received', description: '$50,000 received from TechVentures', userId: '1', userName: 'Admin', relatedId: '1', createdAt: '2026-04-09T09:00:00Z' },
  { id: '4', type: 'validation', action: 'verified', description: 'Project "BioSynth" validated', userId: '3', userName: 'Michael Wong', relatedId: '2', createdAt: '2026-04-08T16:00:00Z' },
  { id: '5', type: 'marketplace', action: 'listed', description: 'New listing "Quantum Computing Portfolio"', userId: '2', userName: 'Dr. Sarah Chen', relatedId: '2', createdAt: '2026-04-08T14:00:00Z' },
  { id: '6', type: 'project', action: 'updated', description: 'Project "CogniLink" status changed to active', userId: '2', userName: 'Dr. Sarah Chen', relatedId: '7', createdAt: '2026-04-08T11:00:00Z' },
];
