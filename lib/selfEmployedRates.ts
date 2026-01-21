import { ANNUAL_WORKING_HOURS, SELF_EMPLOYMENT_MARKUP } from './constants';

export interface SelfEmployedRates {
  baseRate: number;
  markup: number;
  totalRate: number;
}

/**
 * Calculate self-employed hourly rates based on annual salary
 * @param annualSalary - The annual salary in NOK
 * @returns Object containing base rate, markup amount, and total rate (all rounded)
 */
export function calculateSelfEmployedRates(
  annualSalary: number
): SelfEmployedRates {
  const baseHourlyRate = annualSalary / ANNUAL_WORKING_HOURS;
  const markup = baseHourlyRate * SELF_EMPLOYMENT_MARKUP;
  const totalRate = baseHourlyRate + markup;

  return {
    baseRate: Math.round(baseHourlyRate),
    markup: Math.round(markup),
    totalRate: Math.round(totalRate),
  };
}

/**
 * Calculate self-employed rates based on an existing hourly rate
 * @param hourlyRate - The base hourly rate in NOK
 * @returns Object containing base rate, markup amount, and total rate (all rounded)
 */
export function calculateSelfEmployedRatesFromHourly(
  hourlyRate: number
): SelfEmployedRates {
  const markup = hourlyRate * SELF_EMPLOYMENT_MARKUP;
  const totalRate = hourlyRate + markup;

  return {
    baseRate: Math.round(hourlyRate),
    markup: Math.round(markup),
    totalRate: Math.round(totalRate),
  };
}
