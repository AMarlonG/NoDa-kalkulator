/**
 * Salary calculation constants used across the application
 */

/** Standard annual working hours in Norway */
export const ANNUAL_WORKING_HOURS = 1750;

/**
 * Self-employment markup percentage (36.8%)
 * This covers additional costs for self-employed workers:
 * - 15.8% - Employer's national insurance contribution and loss of rights
 * - 12.0% - Holiday pay
 * - 3.6% - National insurance contribution increase
 * - 0.4% - Voluntary occupational injury insurance
 * - 5.0% - Administrative costs
 */
export const SELF_EMPLOYMENT_MARKUP = 0.368;

/**
 * Breakdown of the self-employment markup components
 */
export const SELF_EMPLOYMENT_MARKUP_BREAKDOWN = {
  employerContribution: 0.158,
  holidayPay: 0.12,
  nationalInsurance: 0.036,
  occupationalInsurance: 0.004,
  administrativeCosts: 0.05,
} as const;
