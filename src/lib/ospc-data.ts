import { Contributor, Project, CVScore, OMU, RoyaltyPayment, Proposal, License, Patent, Activity, Listing, Transaction, Badge, Validation } from './ospc-types';

const mockCVScores: Record<string, CVScore> = {
  '1': { total: 847, commitWeight: 320, crossRepoCredit: 45, temporalDecay: -30, negativeContrib: 0, pairProgramming: 60, issueTriage: 80, testCoverage: 120, refactoring: 90, semanticQuality: 85, commitMessageQuality: 35, adrCredit: 40, reviewDepth: 150, benchmarkImprovement: 70, multiModal: 20, lastUpdated: '2026-04-10' },
  '2': { total: 623, commitWeight: 210, crossRepoCredit: 80, temporalDecay: -15, negativeContrib: 0, pairProgramming: 30, issueTriage: 45, testCoverage: 95, refactoring: 65, semanticQuality: 70, commitMessageQuality: 40, adrCredit: 20, reviewDepth: 85, benchmarkImprovement: 45, multiModal: 10, lastUpdated: '2026-04-10' },
  '3': { total: 512, commitWeight: 180, crossRepoCredit: 20, temporalDecay: -25, negativeContrib: -10, pairProgramming: 0, issueTriage: 60, testCoverage: 80, refactoring: 40, semanticQuality: 55, commitMessageQuality: 30, adrCredit: 30, reviewDepth: 120, benchmarkImprovement: 0, multiModal: 5, lastUpdated: '2026-04-10' },
};

const mockBadges: Record<string, Badge[]> = {
  '1': [
    { id: 'b1', name: 'First Merge', description: 'First contribution merged', earnedAt: '2025-06-15', imageUrl: '/badges/first-merge.png' },
    { id: 'b2', name: 'Top 1% CV', description: 'Ranked in top 1% of contributors', earnedAt: '2026-01-20', imageUrl: '/badges/top-1cv.png' },
    { id: 'b3', name: 'Royalty Earner', description: 'Earned royalties from licensing', earnedAt: '2025-09-10', imageUrl: '/badges/royalty.png' },
  ],
  '2': [
    { id: 'b4', name: 'Patent Contributor', description: 'Contributed to filed patent', earnedAt: '2025-11-05', imageUrl: '/badges/patent.png' },
  ],
  '3': [
    { id: 'b5', name: 'Governance Veteran', description: 'Participated in 10+ votes', earnedAt: '2026-02-15', imageUrl: '/badges/governance.png' },
  ],
};

export const mockContributors: Contributor[] = [
  {
    id: '1', name: 'Dr. Sarah Chen', email: 'sarah@quild.com', orcid: '0000-0001-2345-6789', github: 'sarahchen',
    role: 'founder', cvScore: mockCVScores['1'], omus: [], totalRoyaltiesReceived: 245000,
    skills: ['AI/ML', 'Quantum Computing', 'System Architecture'], reputationScore: 92,
    badges: mockBadges['1'], delegateTo: undefined, createdAt: '2024-01-15'
  },
  {
    id: '2', name: 'Prof. Michael Wong', email: 'michael@quild.com', orcid: '0000-0002-3456-7890', github: 'mwong',
    role: 'steward', cvScore: mockCVScores['2'], omus: [], totalRoyaltiesReceived: 189000,
    skills: ['Biotech', 'CRISPR', 'Bioinformatics'], reputationScore: 88,
    badges: mockBadges['2'], createdAt: '2024-03-20'
  },
  {
    id: '3', name: 'Robert Kim', email: 'robert@quild.com', github: 'rkim',
    role: 'maintainer', cvScore: mockCVScores['3'], omus: [], totalRoyaltiesReceived: 45000,
    skills: ['Hardware', 'Semiconductors', 'EDA'], reputationScore: 75,
    badges: mockBadges['3'], delegateTo: '1', createdAt: '2024-06-10'
  },
  {
    id: '4', name: 'Dr. Emily Park', email: 'emily@quild.com', orcid: '0000-0003-4567-8901', github: 'epark',
    role: 'contributor', cvScore: { total: 285, commitWeight: 90, crossRepoCredit: 15, temporalDecay: -10, negativeContrib: 0, pairProgramming: 20, issueTriage: 35, testCoverage: 45, refactoring: 30, semanticQuality: 25, commitMessageQuality: 15, adrCredit: 0, reviewDepth: 40, benchmarkImprovement: 10, multiModal: 5, lastUpdated: '2026-04-10' }, omus: [], totalRoyaltiesReceived: 12000,
    skills: ['Nanotech', 'Vaccines'], reputationScore: 68, badges: [], createdAt: '2025-02-28'
  },
  {
    id: '5', name: 'Dr. Lisa Zhang', email: 'lisa@quild.com', github: 'lzhang',
    role: 'contributor', cvScore: { total: 412, commitWeight: 150, crossRepoCredit: 30, temporalDecay: -5, negativeContrib: 0, pairProgramming: 40, issueTriage: 20, testCoverage: 60, refactoring: 35, semanticQuality: 45, commitMessageQuality: 25, adrCredit: 10, reviewDepth: 95, benchmarkImprovement: 20, multiModal: 15, lastUpdated: '2026-04-10' }, omus: [], totalRoyaltiesReceived: 67000,
    skills: ['BCI', 'Signal Processing', 'Neurotech'], reputationScore: 78, badges: [], createdAt: '2024-09-15'
  },
];

export const mockProjects: Project[] = [
  { id: '1', name: 'NeuralCore', category: 'ai', status: 'active', description: 'Advanced neural network architecture for edge computing with semantic complexity analysis', ipCount: 12, value: 2400000, growth: 24, createdAt: '2025-01-15', updatedAt: '2026-04-09', owner: '1', tags: ['AI', 'Edge Computing', 'Neural Networks'], trl: 7, contributors: ['1', '3', '5'], vestingConfig: { cliff: 6, duration: 24 }, governanceModel: 'omu_weighted', treasury: 450000, licenses: ['l1', 'l2'] },
  { id: '2', name: 'BioSynth', category: 'biotech', status: 'active', description: 'Synthetic biology platform for sustainable materials with CRISPR delivery', ipCount: 8, value: 1800000, growth: 18, createdAt: '2025-03-20', updatedAt: '2026-04-08', owner: '2', tags: ['Biotech', 'Sustainability', 'Synthetic Biology'], trl: 6, contributors: ['2', '4'], vestingConfig: { cliff: 6, duration: 24 }, governanceModel: 'cv_weighted', treasury: 280000, licenses: ['l3'] },
  { id: '3', name: 'QuantumStack', category: 'quantum', status: 'pending', description: 'Quantum computing interface and control systems with error correction', ipCount: 5, value: 3200000, growth: 32, createdAt: '2025-06-10', updatedAt: '2026-04-07', owner: '3', tags: ['Quantum', 'Computing', 'Hardware'], trl: 4, contributors: ['1', '2'], vestingConfig: { cliff: 3, duration: 12 }, governanceModel: 'omu_weighted', treasury: 520000, licenses: [] },
  { id: '4', name: 'DeepMind AI', category: 'ai', status: 'active', description: 'Machine learning framework for autonomous systems with benchmark improvements', ipCount: 15, value: 4100000, growth: 45, createdAt: '2024-11-01', updatedAt: '2026-04-06', owner: '2', tags: ['AI', 'ML', 'Autonomous'], trl: 8, contributors: ['1', '5'], vestingConfig: { cliff: 6, duration: 24 }, governanceModel: 'cv_weighted', treasury: 890000, licenses: ['l4', 'l5'] },
  { id: '5', name: 'GeneEdit Pro', category: 'biotech', status: 'completed', description: 'CRISPR-based gene editing toolkit with patent portfolio', ipCount: 6, value: 2900000, growth: 28, createdAt: '2024-08-15', updatedAt: '2026-04-05', owner: '3', tags: ['Biotech', 'CRISPR', 'Gene Editing'], trl: 9, contributors: ['2', '4'], vestingConfig: { cliff: 12, duration: 36 }, governanceModel: 'omu_weighted', treasury: 1200000, licenses: ['l6'] },
  { id: '6', name: 'SiliconFlow', category: 'hardware', status: 'active', description: 'Next-generation semiconductor design tools with EDA integration', ipCount: 9, value: 1500000, growth: 15, createdAt: '2025-02-28', updatedAt: '2026-04-04', owner: '1', tags: ['Hardware', 'Semiconductors', 'EDA'], trl: 5, contributors: ['3'], vestingConfig: { cliff: 3, duration: 18 }, governanceModel: 'cv_weighted', treasury: 150000, licenses: [] },
  { id: '7', name: 'CogniLink', category: 'ai', status: 'active', description: 'Brain-computer interface signal processing with async video review support', ipCount: 7, value: 980000, growth: 12, createdAt: '2025-07-22', updatedAt: '2026-04-03', owner: '2', tags: ['AI', 'BCI', 'Neurotech'], trl: 5, contributors: ['5', '1'], vestingConfig: { cliff: 6, duration: 24 }, governanceModel: 'omu_weighted', treasury: 95000, licenses: [] },
  { id: '8', name: 'NanoVax', category: 'biotech', status: 'pending', description: 'Nanoparticle-based vaccine delivery platform with patent pending', ipCount: 4, value: 2100000, growth: 22, createdAt: '2025-09-05', updatedAt: '2026-04-02', owner: '3', tags: ['Biotech', 'Nanotech', 'Vaccines'], trl: 3, contributors: ['2', '4'], vestingConfig: { cliff: 6, duration: 24 }, governanceModel: 'cv_weighted', treasury: 320000, licenses: [] },
];

export const mockOMUs: OMU[] = [
  { id: 'om1', projectId: '1', contributorId: '1', amount: 45000, vestingSchedule: { cliff: 6, totalDuration: 24, startedAt: '2025-01-15', vestedAt: '2025-07-15' }, locked: 18000, transferable: 27000, createdAt: '2025-01-15', updatedAt: '2026-04-10' },
  { id: 'om2', projectId: '1', contributorId: '3', amount: 22000, vestingSchedule: { cliff: 3, totalDuration: 18, startedAt: '2025-02-28', vestedAt: '2025-05-28' }, locked: 5000, transferable: 17000, createdAt: '2025-02-28', updatedAt: '2026-04-10' },
  { id: 'om3', projectId: '2', contributorId: '2', amount: 38000, vestingSchedule: { cliff: 6, totalDuration: 24, startedAt: '2025-03-20', vestedAt: '2025-09-20' }, locked: 15000, transferable: 23000, createdAt: '2025-03-20', updatedAt: '2026-04-10' },
  { id: 'om4', projectId: '4', contributorId: '1', amount: 52000, vestingSchedule: { cliff: 6, totalDuration: 24, startedAt: '2024-11-01', vestedAt: '2025-05-01' }, locked: 0, transferable: 52000, createdAt: '2024-11-01', updatedAt: '2026-04-10' },
  { id: 'om5', projectId: '5', contributorId: '2', amount: 65000, vestingSchedule: { cliff: 12, totalDuration: 36, startedAt: '2024-08-15', vestedAt: '2025-08-15' }, locked: 0, transferable: 65000, createdAt: '2024-08-15', updatedAt: '2026-04-10' },
];

export const mockRoyaltyPayments: RoyaltyPayment[] = [
  { id: 'r1', projectId: '1', amount: 85000, currency: 'USD', convertedInr: 7100000, recipientId: '1', status: 'completed', paymentMethod: 'bank_transfer', createdAt: '2026-04-01', processedAt: '2026-04-02', taxDeducted: 71000, netAmount: 6389000 },
  { id: 'r2', projectId: '4', amount: 45000, currency: 'USD', convertedInr: 3765000, recipientId: '1', status: 'completed', paymentMethod: 'upi', createdAt: '2026-03-15', processedAt: '2026-03-16', taxDeducted: 37650, netAmount: 3727350 },
  { id: 'r3', projectId: '2', amount: 25000, currency: 'EUR', convertedInr: 2250000, recipientId: '2', status: 'completed', paymentMethod: 'bank_transfer', createdAt: '2026-03-01', processedAt: '2026-03-03', taxDeducted: 22500, netAmount: 2227500 },
  { id: 'r4', projectId: '5', amount: 120000, currency: 'USD', convertedInr: 10080000, recipientId: '2', status: 'completed', paymentMethod: 'rtgs', createdAt: '2026-02-15', processedAt: '2026-02-16', taxDeducted: 100800, netAmount: 9979200 },
  { id: 'r5', projectId: '1', amount: 55000, currency: 'USD', convertedInr: 4605000, recipientId: '3', status: 'pending', paymentMethod: 'upi', createdAt: '2026-04-09', taxDeducted: 0, netAmount: 0 },
];

export const mockProposals: Proposal[] = [
  { id: 'g1', projectId: '1', title: 'Increase CV review depth weight from 10x to 15x', description: 'Deep reviews are undervalued. This proposal increases the multiplier to incentivize thorough code reviews.', type: 'parameter_change', status: 'voting', votesFor: 15000, votesAgainst: 3200, abstain: 800, conviction: 85, createdBy: '3', createdAt: '2026-04-05', endsAt: '2026-04-12' },
  { id: 'g2', projectId: '1', title: 'Enterprise license - TechCorp Innovations', description: 'TechCorp wants enterprise license for internal R&D use. Annual fee of ₹50L with 3% royalty on derived works.', type: 'license', status: 'signaling', votesFor: 0, votesAgainst: 0, abstain: 0, conviction: 45, createdBy: '1', createdAt: '2026-04-08', endsAt: '2026-04-15' },
  { id: 'g3', projectId: '2', title: 'Add biotech domain expert to governance', description: 'Invite Dr. James Wilson as governance council member due to his expertise in gene editing patents.', type: 'governance', status: 'passed', votesFor: 28000, votesAgainst: 1200, abstain: 500, conviction: 92, createdBy: '2', createdAt: '2026-03-20', endsAt: '2026-03-27', executedAt: '2026-03-28' },
  { id: 'g4', projectId: '4', title: 'Emergency: CVE in dependency', description: 'Critical vulnerability in one of our dependencies requires immediate patch. Authorize emergency budget of ₹2L for rapid fix.', type: 'emergency', status: 'executed', votesFor: 45000, votesAgainst: 0, abstain: 100, conviction: 100, createdBy: '1', createdAt: '2026-04-01', endsAt: '2026-04-01', executedAt: '2026-04-01' },
  { id: 'g5', projectId: '1', title: 'Retroactive bonus for foundational API', description: 'The API designed by contributor #1 in early 2025 now has 30+ downstream modules depending on it. Grant 5000 OMU retroactive bonus.', type: 'budget', status: 'rejected', votesFor: 8000, votesAgainst: 22000, abstain: 3000, conviction: 25, createdBy: '2', createdAt: '2026-03-15', endsAt: '2026-03-22' },
];

export const mockLicenses: License[] = [
  { id: 'l1', projectId: '1', licensee: 'TechCorp Innovations', type: 'enterprise', territory: 'India', royaltyRate: 3, minimumAnnual: 500000, status: 'active', startDate: '2025-06-01', endDate: '2027-05-31', paymentFrequency: 'annual', lastPayment: '2025-06-01', nextPayment: '2026-06-01' },
  { id: 'l2', projectId: '1', licensee: 'StartupXYZ', type: 'field_of_use', fieldOfUse: 'Medical Imaging', territory: 'Global', royaltyRate: 5, minimumAnnual: 100000, status: 'active', startDate: '2025-09-15', endDate: '2026-09-14', paymentFrequency: 'quarterly', lastPayment: '2026-03-15', nextPayment: '2026-06-15' },
  { id: 'l3', projectId: '2', licensee: 'University of Cambridge', type: 'academic', territory: 'UK', royaltyRate: 1, minimumAnnual: 0, status: 'active', startDate: '2025-04-01', paymentFrequency: 'annual' },
  { id: 'l4', projectId: '4', licensee: 'DRDO', type: 'enterprise', territory: 'India', royaltyRate: 2, minimumAnnual: 1000000, status: 'active', startDate: '2025-01-10', endDate: '2027-01-09', paymentFrequency: 'annual', lastPayment: '2025-01-10', nextPayment: '2026-01-10' },
  { id: 'l5', projectId: '4', licensee: 'ISRO', type: 'enterprise', territory: 'India', royaltyRate: 2.5, minimumAnnual: 800000, status: 'pending', startDate: '2026-05-01', paymentFrequency: 'annual' },
  { id: 'l6', projectId: '5', licensee: 'Pfizer', type: 'enterprise', territory: 'Global', royaltyRate: 4, minimumAnnual: 2000000, status: 'active', startDate: '2024-11-01', endDate: '2027-10-31', paymentFrequency: 'quarterly', lastPayment: '2026-03-01', nextPayment: '2026-06-01' },
];

export const mockPatents: Patent[] = [
  { id: 'p1', projectId: '1', title: 'Neural Network Architecture with Adaptive Learning Rates', type: 'full', status: 'granted', jurisdiction: 'US', applicationNumber: 'US17/123,456', grantNumber: 'US11,234,567', filingDate: '2024-03-15', grantDate: '2025-11-20', expiryDate: '2044-03-15', inventors: ['1', '3'], claims: 12, valuation: 2400000, citedBy: 45 },
  { id: 'p2', projectId: '3', title: 'Quantum Error Correction Method for Qubits', type: 'PCT', status: 'filed', jurisdiction: 'WO', applicationNumber: 'PCT/IB2026/012,345', filingDate: '2024-01-20', expiryDate: '2044-01-20', inventors: ['2'], claims: 18, valuation: 3200000, citedBy: 12 },
  { id: 'p3', projectId: '2', title: 'CRISPR Delivery System Using Nanoparticles', type: 'provisional', status: 'filed', jurisdiction: 'US', applicationNumber: 'US63/089,123', filingDate: '2025-11-08', inventors: ['2', '4'], claims: 8, valuation: 1800000, citedBy: 3 },
  { id: 'p4', projectId: '5', title: 'Gene Editing Toolkit with Guide RNA Optimization', type: 'full', status: 'granted', jurisdiction: 'US', applicationNumber: 'US17/098,234', grantNumber: 'US11,567,890', filingDate: '2024-06-10', grantDate: '2025-08-15', expiryDate: '2044-06-10', inventors: ['2'], claims: 22, valuation: 2900000, citedBy: 78 },
  { id: 'p5', projectId: '7', title: 'Brain-Computer Interface Signal Processing Algorithm', type: 'provisional', status: 'examined', jurisdiction: 'US', applicationNumber: 'US63/145,678', filingDate: '2025-09-15', inventors: ['5', '1'], claims: 6, valuation: 980000, citedBy: 1 },
];

export const mockListings: Listing[] = [
  { id: 'lst1', title: 'AI Image Generation Model v3.0', type: 'technology', status: 'active', sellerId: '1', sellerName: 'NeuralTech Labs', price: 450000, change: 12, views: 234, likes: 45, category: 'AI/ML', description: 'State-of-the-art image generation model with proprietary architecture', details: { 'Model Size': '7B params', 'License': 'Commercial', 'API': 'REST API', 'TRL': '7' }, images: [], trl: 7, techStack: ['Python', 'PyTorch', 'TensorFlow'], createdAt: '2026-03-01', updatedAt: '2026-04-09' },
  { id: 'lst2', title: 'Quantum Computing Patent Portfolio - 12 Patents', type: 'patent', status: 'active', sellerId: '2', sellerName: 'Quantum Innovations', price: 2800000, change: 8, views: 156, likes: 32, category: 'Quantum', description: '12 patents covering quantum error correction and qubit control', details: { 'Patents': '12', 'Jurisdiction': 'US, EP, WO', 'Status': 'Granted', 'TRL': '9' }, images: [], trl: 9, techStack: ['Quantum Computing', 'Physics'], createdAt: '2026-02-15', updatedAt: '2026-04-08' },
  { id: 'lst3', title: 'Biotech Synthesis Platform', type: 'technology', status: 'active', sellerId: '3', sellerName: 'BioSynth Inc', price: 890000, change: -3, views: 89, likes: 18, category: 'Biotech', description: 'Automated synthetic biology platform for sustainable materials', details: { 'Platform': 'Cloud-based', 'Users': '50+', 'API': 'GraphQL', 'TRL': '6' }, images: [], trl: 6, techStack: ['Python', 'Docker', 'Kubernetes'], createdAt: '2026-01-20', updatedAt: '2026-04-07' },
];

export const mockTransactions: Transaction[] = [
  { id: 't1', description: 'TechVentures Investment', amount: 250000, type: 'income', category: 'investment', relatedId: '1', relatedType: 'project', date: '2026-04-09', status: 'completed', createdAt: '2026-04-09' },
  { id: 't2', description: 'Patent Filing - US2026891', amount: 15000, type: 'expense', category: 'legal', relatedId: 'p1', relatedType: 'patent', date: '2026-04-08', status: 'completed', createdAt: '2026-04-08' },
  { id: 't3', description: 'QuantumCore Licensing', amount: 85000, type: 'income', category: 'licensing', relatedId: 'l1', relatedType: 'license', date: '2026-04-07', status: 'completed', createdAt: '2026-04-07' },
  { id: 't4', description: 'Marketplace Sale - AI Model', amount: 450000, type: 'income', category: 'sale', relatedId: 'lst1', relatedType: 'listing', date: '2026-04-06', status: 'completed', createdAt: '2026-04-06' },
  { id: 't5', description: 'Cloud Infrastructure', amount: 12500, type: 'expense', category: 'operations', date: '2026-04-05', status: 'completed', createdAt: '2026-04-05' },
  { id: 't6', description: 'Research Grant - BioSynth', amount: 180000, type: 'income', category: 'grant', relatedId: '2', relatedType: 'project', date: '2026-04-04', status: 'completed', createdAt: '2026-04-04' },
  { id: 't7', description: 'Legal Consultation', amount: 8500, type: 'expense', category: 'legal', date: '2026-04-03', status: 'completed', createdAt: '2026-04-03' },
  { id: 't8', description: 'Royalty - NeuralCore', amount: 32000, type: 'income', category: 'royalty', relatedId: 'l1', relatedType: 'license', date: '2026-04-02', status: 'completed', createdAt: '2026-04-02' },
];

export const mockActivities: Activity[] = [
  { id: 'a1', type: 'project', action: 'created', description: 'New AI project "NeuralCore" added', userId: '1', userName: 'Dr. Sarah Chen', relatedId: '1', createdAt: '2026-04-09T10:30:00Z' },
  { id: 'a2', type: 'ip', action: 'granted', description: 'Patent #US11,234,567 granted for Neural Network Architecture', userId: '1', userName: 'Dr. Sarah Chen', relatedId: 'p1', createdAt: '2026-04-09T10:15:00Z' },
  { id: 'a3', type: 'revenue', action: 'received', description: '₹7,100,000 received from TechCorp Innovations licensing', userId: '1', userName: 'Dr. Sarah Chen', relatedId: 'r1', metadata: { amount: 7100000 }, createdAt: '2026-04-09T09:00:00Z' },
  { id: 'a4', type: 'governance', action: 'voting_started', description: 'New proposal: Increase CV review depth weight from 10x to 15x', userId: '3', userName: 'Robert Kim', relatedId: 'g1', createdAt: '2026-04-05T14:00:00Z' },
  { id: 'a5', type: 'cv', action: 'score_updated', description: 'CV score updated: +85 points from benchmark improvement', userId: '1', userName: 'Dr. Sarah Chen', metadata: { previousScore: 762, newScore: 847 }, createdAt: '2026-04-08T16:00:00Z' },
  { id: 'a6', type: 'omu', action: 'vested', description: '5,000 OMUs vested for NeuralCore', userId: '3', userName: 'Robert Kim', metadata: { amount: 5000, projectId: '1' }, createdAt: '2026-04-07T12:00:00Z' },
  { id: 'a7', type: 'validation', action: 'verified', description: 'Technology validation approved for BioSynth', userId: '2', userName: 'Prof. Michael Wong', relatedId: '2', createdAt: '2026-04-06T11:00:00Z' },
];

export const mockMarketListings = [
  { sellerId: '3', omuAmount: 5000, pricePerOmu: 120, status: 'active' as const },
  { sellerId: '4', omuAmount: 2000, pricePerOmu: 150, status: 'active' as const },
];

export const mockProjectHealth = {
  '1': { score: 87, contributors: 12, testCoverage: 94, dependencySecurity: 'good', governanceParticipation: 78, licensingPipeline: 5 },
  '2': { score: 72, contributors: 8, testCoverage: 82, dependencySecurity: 'warning', governanceParticipation: 65, licensingPipeline: 2 },
  '3': { score: 58, contributors: 4, testCoverage: 65, dependencySecurity: 'good', governanceParticipation: 45, licensingPipeline: 0 },
  '4': { score: 91, contributors: 15, testCoverage: 97, dependencySecurity: 'excellent', governanceParticipation: 88, licensingPipeline: 8 },
  '5': { score: 95, contributors: 6, testCoverage: 99, dependencySecurity: 'excellent', governanceParticipation: 92, licensingPipeline: 12 },
};

export const mockChurnRisk: Record<string, { risk: number; signals: string[] }> = {
  '3': { risk: 72, signals: ['No commits in 21 days', 'Review response time increased 300%', 'Last governance vote: 45 days ago'] },
  '4': { risk: 45, signals: ['Commit frequency down 40%', 'No issue activity in 14 days'] },
};

export const mockValidations: Validation[] = [
  { id: 'v1', name: 'Neural Network Compression Algorithm', type: 'technology', projectId: '1', projectName: 'NeuralCore', status: 'verified', score: 92, submitter: '1', reviewer: '2', notes: 'Novel approach with significant commercial potential', documents: ['tech_spec.pdf', 'demo.mp4'], createdAt: '2026-03-15', updatedAt: '2026-04-01' },
  { id: 'v2', name: 'CRISPR Delivery Mechanism', type: 'patent', projectId: '2', projectName: 'BioSynth', status: 'in_review', score: 85, submitter: '2', documents: ['patent_draft.pdf'], createdAt: '2026-04-05', updatedAt: '2026-04-08' },
  { id: 'v3', name: 'QUILD Trademark', type: 'trademark', projectId: '1', projectName: 'NeuralCore', status: 'pending', score: 0, submitter: '1', documents: ['tm_application.pdf'], createdAt: '2026-04-10', updatedAt: '2026-04-10' },
  { id: 'v4', name: 'Quantum Error Correction Code', type: 'technology', projectId: '3', projectName: 'QuantumStack', status: 'rejected', score: 45, submitter: '3', reviewer: '1', notes: 'Insufficient novelty - prior art exists', documents: ['tech_spec.pdf'], createdAt: '2026-02-20', updatedAt: '2026-03-10' },
];