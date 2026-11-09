import { describe, expect, it } from 'vitest';

import {
  mockContributors,
  mockLicenses,
  mockOMUs,
  mockPatents,
  mockProjects,
  mockProposals,
  mockRoyaltyPayments,
  mockTransactions,
  mockValidations,
} from './ospc-data';

const ids = (rows: { id: string }[]) => new Set(rows.map((row) => row.id));

const contributorIds = ids(mockContributors);
const projectIds = ids(mockProjects);
const licenseIds = ids(mockLicenses);
const patentIds = ids(mockPatents);

const isIsoDate = (value: string) =>
  /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value));

const collections: [string, { id: string }[]][] = [
  ['contributors', mockContributors],
  ['projects', mockProjects],
  ['OMUs', mockOMUs],
  ['royalty payments', mockRoyaltyPayments],
  ['proposals', mockProposals],
  ['licenses', mockLicenses],
  ['patents', mockPatents],
  ['validations', mockValidations],
  ['transactions', mockTransactions],
];

describe('seed data', () => {
  it('uses unique ids within every collection', () => {
    for (const [label, rows] of collections) {
      expect(new Set(rows.map((row) => row.id)).size, label).toBe(rows.length);
    }
  });
});

describe('projects', () => {
  it('reference known owners, contributors and licenses', () => {
    for (const project of mockProjects) {
      expect(contributorIds.has(project.owner), `${project.name} owner ${project.owner}`).toBe(true);
      for (const contributorId of project.contributors) {
        expect(contributorIds.has(contributorId), `${project.name} contributor ${contributorId}`).toBe(
          true,
        );
      }
      for (const licenseId of project.licenses) {
        expect(licenseIds.has(licenseId), `${project.name} license ${licenseId}`).toBe(true);
      }
    }
  });

  it('keeps treasury, valuation and TRL in a sane range', () => {
    for (const project of mockProjects) {
      expect(project.treasury, project.name).toBeGreaterThanOrEqual(0);
      expect(project.value, project.name).toBeGreaterThan(0);
      expect(project.trl, project.name).toBeGreaterThanOrEqual(1);
      expect(project.trl, project.name).toBeLessThanOrEqual(9);
    }
  });
});

describe('OMUs', () => {
  it('belong to a known project and contributor', () => {
    for (const omu of mockOMUs) {
      expect(projectIds.has(omu.projectId), omu.id).toBe(true);
      expect(contributorIds.has(omu.contributorId), omu.id).toBe(true);
    }
  });

  it('split exactly into locked and transferable units', () => {
    for (const omu of mockOMUs) {
      expect(omu.locked + omu.transferable, omu.id).toBe(omu.amount);
    }
  });

  it('never cliffs past the total vesting duration', () => {
    for (const omu of mockOMUs) {
      expect(omu.vestingSchedule.cliff, omu.id).toBeLessThanOrEqual(
        omu.vestingSchedule.totalDuration,
      );
    }
  });

  it('carries parseable dates', () => {
    for (const omu of mockOMUs) {
      expect(isIsoDate(omu.vestingSchedule.startedAt), omu.id).toBe(true);
      expect(isIsoDate(omu.vestingSchedule.vestedAt), omu.id).toBe(true);
    }
  });
});

describe('royalty payments', () => {
  it('reference known projects and recipients', () => {
    for (const payment of mockRoyaltyPayments) {
      expect(projectIds.has(payment.projectId), payment.id).toBe(true);
      expect(contributorIds.has(payment.recipientId), payment.id).toBe(true);
    }
  });

  it('never deducts more tax than the gross amount', () => {
    for (const payment of mockRoyaltyPayments) {
      expect(payment.taxDeducted, payment.id).toBeGreaterThanOrEqual(0);
      expect(payment.taxDeducted, payment.id).toBeLessThanOrEqual(payment.convertedInr);
    }
  });

  it('pays out gross minus tax once processed', () => {
    for (const payment of mockRoyaltyPayments.filter((row) => row.status === 'completed')) {
      expect(payment.netAmount, payment.id).toBe(payment.convertedInr - payment.taxDeducted);
      expect(payment.processedAt, payment.id).toBeDefined();
    }
  });

  it('leaves pending payments unsettled', () => {
    for (const payment of mockRoyaltyPayments.filter((row) => row.status === 'pending')) {
      expect(payment.netAmount, payment.id).toBe(0);
      expect(payment.processedAt, payment.id).toBeUndefined();
    }
  });
});

describe('proposals', () => {
  it('reference known projects and authors', () => {
    for (const proposal of mockProposals) {
      expect(projectIds.has(proposal.projectId), proposal.id).toBe(true);
      expect(contributorIds.has(proposal.createdBy), proposal.id).toBe(true);
    }
  });

  it('never reports negative votes or conviction outside 0-100', () => {
    for (const proposal of mockProposals) {
      expect(proposal.votesFor, proposal.id).toBeGreaterThanOrEqual(0);
      expect(proposal.votesAgainst, proposal.id).toBeGreaterThanOrEqual(0);
      expect(proposal.abstain, proposal.id).toBeGreaterThanOrEqual(0);
      expect(proposal.conviction, proposal.id).toBeGreaterThanOrEqual(0);
      expect(proposal.conviction, proposal.id).toBeLessThanOrEqual(100);
    }
  });

  it('only dates execution for proposals that reached a terminal state', () => {
    for (const proposal of mockProposals) {
      if (proposal.status === 'executed') {
        expect(proposal.executedAt, proposal.id).toBeDefined();
      }
      if (['draft', 'signaling', 'voting'].includes(proposal.status)) {
        expect(proposal.executedAt, proposal.id).toBeUndefined();
      }
    }
  });
});

describe('licenses', () => {
  it('reference known projects', () => {
    for (const license of mockLicenses) {
      expect(projectIds.has(license.projectId), license.id).toBe(true);
    }
  });

  it('keep rates and dates coherent', () => {
    for (const license of mockLicenses) {
      expect(license.royaltyRate, license.id).toBeGreaterThanOrEqual(0);
      expect(license.royaltyRate, license.id).toBeLessThanOrEqual(100);
      expect(isIsoDate(license.startDate), license.id).toBe(true);
      if (license.endDate) {
        expect(Date.parse(license.endDate), license.id).toBeGreaterThan(
          Date.parse(license.startDate),
        );
      }
    }
  });
});

describe('patents', () => {
  it('reference known projects and inventors', () => {
    for (const patent of mockPatents) {
      expect(projectIds.has(patent.projectId), patent.id).toBe(true);
      for (const inventorId of patent.inventors) {
        expect(contributorIds.has(inventorId), `${patent.id} inventor ${inventorId}`).toBe(true);
      }
    }
  });

  it('grants patents only after they were filed', () => {
    for (const patent of mockPatents.filter((row) => row.status === 'granted')) {
      expect(patent.grantDate, patent.id).toBeDefined();
      expect(Date.parse(patent.grantDate as string), patent.id).toBeGreaterThanOrEqual(
        Date.parse(patent.filingDate),
      );
    }
  });
});

describe('validations', () => {
  it('reference known projects and keep scores in range', () => {
    for (const validation of mockValidations) {
      expect(projectIds.has(validation.projectId), validation.id).toBe(true);
      expect(validation.score, validation.id).toBeGreaterThanOrEqual(0);
      expect(validation.score, validation.id).toBeLessThanOrEqual(100);
      if (validation.status === 'verified') {
        expect(validation.score, validation.id).toBeGreaterThan(0);
      }
    }
  });
});

describe('transactions', () => {
  it('use positive amounts and parseable dates', () => {
    for (const transaction of mockTransactions) {
      expect(transaction.amount, transaction.id).toBeGreaterThan(0);
      expect(isIsoDate(transaction.date), transaction.id).toBe(true);
    }
  });

  it('only references records that exist', () => {
    const pools: Record<string, Set<string>> = {
      project: projectIds,
      patent: patentIds,
      license: licenseIds,
    };
    for (const transaction of mockTransactions) {
      if (!transaction.relatedId || !transaction.relatedType) continue;
      const pool = pools[transaction.relatedType];
      if (!pool) continue;
      expect(
        pool.has(transaction.relatedId),
        `${transaction.id} -> ${transaction.relatedType}:${transaction.relatedId}`,
      ).toBe(true);
    }
  });
});
