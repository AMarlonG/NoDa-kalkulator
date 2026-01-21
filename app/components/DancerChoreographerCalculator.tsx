'use client';

import { useState, useEffect } from 'react';
import { dancersSalaryData } from '@/lib/dancersSalary';
import { choreographyProjectSalaryData } from '@/lib/choreographyProjectSalary';
import '../styles/base.css';
import '../styles/calculator-common.css';

interface SalaryBreakdown {
  // Base rates
  dancerMonthlyRate: number;
  choreographerMonthlyRate: number;
  choreographerMinuteRate: number;

  // Verkssats (one-time, always 100%)
  verkssats: number;

  // Production period breakdown
  productionPeriod: {
    dancerSalary: number;
    dancerPercent: number;
    choreographerSalary: number;
    choreographerPercent: number;
    periodTotal: number;
  };

  // Performance period breakdown
  performancePeriod: {
    dancerSalary: number;
    dancerPercent: number;
    periodTotal: number;
  };

  // Totals
  totalDancerSalary: number;
  totalChoreographerSalary: number;
  grandTotal: number;
}

export function DancerChoreographerCalculator() {
  const [primaryRole, setPrimaryRole] = useState<
    'dancer' | 'choreographer' | ''
  >('');
  const [dancerSeniority, setDancerSeniority] = useState('');
  const [choreographerSeniority, setChoreographerSeniority] = useState('');
  const [productionLengthMinutes, setProductionLengthMinutes] = useState<string>('');
  const [productionPeriodMonths, setProductionPeriodMonths] = useState<string>('');
  const [performancePeriodMonths, setPerformancePeriodMonths] = useState<string>('');
  const [salary, setSalary] = useState<SalaryBreakdown | null>(null);

  const resetForm = () => {
    setPrimaryRole('');
    setDancerSeniority('');
    setChoreographerSeniority('');
    setProductionLengthMinutes('');
    setProductionPeriodMonths('');
    setPerformancePeriodMonths('');
    setSalary(null);
  };

  const resetInputs = () => {
    setDancerSeniority('');
    setChoreographerSeniority('');
    setProductionLengthMinutes('');
    setProductionPeriodMonths('');
    setPerformancePeriodMonths('');
    setSalary(null);
  };

  useEffect(() => {
    // Check if all required fields are filled
    if (
      !primaryRole ||
      !dancerSeniority ||
      !choreographerSeniority ||
      !productionLengthMinutes ||
      !productionPeriodMonths ||
      !performancePeriodMonths
    ) {
      setSalary(null);
      return;
    }

    const dancerData = dancersSalaryData.find(
      (item) => item.Ansiennitet === dancerSeniority
    );
    const choreographerData = choreographyProjectSalaryData.find(
      (item) => item.Ansiennitet === Number(choreographerSeniority)
    );

    if (!dancerData || !choreographerData) {
      setSalary(null);
      return;
    }

    // Base rates
    const dancerYearlySalary = Number(
      dancerData['Årslønn prosjekt'].replace(/\s/g, '')
    );
    const dancerMonthlyRate = dancerYearlySalary / 12;
    const choreographerMonthlyRate = Number(
      choreographerData['Innstudering månedssats'].replace(/\s/g, '')
    );
    const choreographerMinuteRate = Number(
      choreographerData['Minuttsats koreografi'].replace(/\s/g, '')
    );

    // Verkssats (always 100%, one-time fee)
    const verkssats = choreographerMinuteRate * Number(productionLengthMinutes);

    // Parse months
    const prodMonths = parseFloat(productionPeriodMonths);
    const perfMonths = parseFloat(performancePeriodMonths);

    let prodDancer: number;
    let prodChoreographer: number;
    let prodDancerPercent: number;
    let prodChoreographerPercent: number;
    let perfDancer: number;
    let perfDancerPercent: number;

    if (primaryRole === 'dancer') {
      // Production: 100% dancer + 50% choreographer monthly
      prodDancer = dancerMonthlyRate * prodMonths * 1.0;
      prodDancerPercent = 100;
      prodChoreographer = choreographerMonthlyRate * prodMonths * 0.5;
      prodChoreographerPercent = 50;

      // Performance: 100% dancer + 0% choreographer
      perfDancer = dancerMonthlyRate * perfMonths * 1.0;
      perfDancerPercent = 100;
    } else {
      // Production: 100% choreographer monthly + 50% dancer
      prodChoreographer = choreographerMonthlyRate * prodMonths * 1.0;
      prodChoreographerPercent = 100;
      prodDancer = dancerMonthlyRate * prodMonths * 0.5;
      prodDancerPercent = 50;

      // Performance: 0% choreographer + 100% dancer
      perfDancer = dancerMonthlyRate * perfMonths * 1.0;
      perfDancerPercent = 100;
    }

    // Totals
    const totalDancerSalary = prodDancer + perfDancer;
    const totalChoreographerSalary = verkssats + prodChoreographer;
    const grandTotal = totalDancerSalary + totalChoreographerSalary;

    setSalary({
      dancerMonthlyRate,
      choreographerMonthlyRate,
      choreographerMinuteRate,
      verkssats,
      productionPeriod: {
        dancerSalary: prodDancer,
        dancerPercent: prodDancerPercent,
        choreographerSalary: prodChoreographer,
        choreographerPercent: prodChoreographerPercent,
        periodTotal: prodDancer + prodChoreographer,
      },
      performancePeriod: {
        dancerSalary: perfDancer,
        dancerPercent: perfDancerPercent,
        periodTotal: perfDancer,
      },
      totalDancerSalary,
      totalChoreographerSalary,
      grandTotal,
    });
  }, [
    primaryRole,
    dancerSeniority,
    choreographerSeniority,
    productionLengthMinutes,
    productionPeriodMonths,
    performancePeriodMonths,
  ]);

  const formatNumber = (num: number) =>
    Math.round(num).toLocaleString('no-NO', { maximumFractionDigits: 0 });

  return (
    <form className='form calculator-content'>
      {/* Primary Role Selection */}
      <div className='card'>
        <div className='card-header'>
          <h2 className='card-title'>Velg primær rolle</h2>
        </div>
        <div className='card-content'>
          <div className='input-group'>
            <label htmlFor='primaryRole' className='label'>
              Hva er din primære rolle?
            </label>
            <select
              id='primaryRole'
              className='styled-select'
              value={primaryRole}
              onChange={(e) => {
                setPrimaryRole(e.target.value as 'dancer' | 'choreographer');
                resetInputs();
              }}
            >
              <option value=''>Velg primær rolle</option>
              <option value='dancer'>Danser</option>
              <option value='choreographer'>Koreograf</option>
            </select>
            {primaryRole && (
              <p className='result-explanation'>
                {primaryRole === 'dancer'
                  ? 'Som primær danser får du 100% danserlønn i begge perioder, og 50% koreograflønn i innstuderingsperioden.'
                  : 'Som primær koreograf får du 100% koreograflønn i innstuderingsperioden, og 50% danserlønn i innstudering + 100% i forestillingsperioden.'}
              </p>
            )}
          </div>
        </div>
      </div>

      {primaryRole && (
        <>
          {/* Seniority Selection */}
          <div className='card'>
            <div className='card-header'>
              <h2 className='card-title'>Ansiennitet</h2>
            </div>
            <div className='card-content'>
              <div className='input-group'>
                <label htmlFor='dancerSeniority' className='label'>
                  Danser ansiennitet
                </label>
                <select
                  id='dancerSeniority'
                  className='styled-select'
                  value={dancerSeniority}
                  onChange={(e) => setDancerSeniority(e.target.value)}
                >
                  <option value=''>Velg ansiennitet</option>
                  {dancersSalaryData.map((item) => (
                    <option key={item.Ansiennitet} value={item.Ansiennitet}>
                      {item.Ansiennitet}
                    </option>
                  ))}
                </select>
              </div>

              <div className='input-group'>
                <label htmlFor='choreographerSeniority' className='label'>
                  Koreograf ansiennitet
                </label>
                <select
                  id='choreographerSeniority'
                  className='styled-select'
                  value={choreographerSeniority}
                  onChange={(e) => setChoreographerSeniority(e.target.value)}
                >
                  <option value=''>Velg ansiennitet</option>
                  {choreographyProjectSalaryData.map((item) => (
                    <option key={item.Ansiennitet} value={item.Ansiennitet}>
                      {item.Ansiennitet}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Period Inputs */}
          <div className='card'>
            <div className='card-header'>
              <h2 className='card-title'>Produksjonsdetaljer</h2>
            </div>
            <div className='card-content'>
              <div className='input-group'>
                <label htmlFor='productionLengthMinutes' className='label'>
                  Produksjonslengde (minutter)
                </label>
                <input
                  type='number'
                  id='productionLengthMinutes'
                  className='input'
                  value={productionLengthMinutes}
                  onChange={(e) => setProductionLengthMinutes(e.target.value)}
                  min='1'
                  placeholder='Antall minutter'
                />
                <p className='result-explanation'>
                  Brukes til å beregne verkssats (alltid 100%)
                </p>
              </div>

              <div className='input-group'>
                <label htmlFor='productionPeriodMonths' className='label'>
                  Innstuderingsperiode (måneder)
                </label>
                <input
                  type='number'
                  id='productionPeriodMonths'
                  className='input'
                  value={productionPeriodMonths}
                  onChange={(e) => setProductionPeriodMonths(e.target.value)}
                  min='0.25'
                  step='0.25'
                  placeholder='f.eks. 2 eller 1.5'
                />
                <p className='result-explanation'>
                  Perioden hvor koreografi utvikles og øves inn (bruk 0.25 for kvart måned)
                </p>
              </div>

              <div className='input-group'>
                <label htmlFor='performancePeriodMonths' className='label'>
                  Forestillingsperiode (måneder)
                </label>
                <input
                  type='number'
                  id='performancePeriodMonths'
                  className='input'
                  value={performancePeriodMonths}
                  onChange={(e) => setPerformancePeriodMonths(e.target.value)}
                  min='0.25'
                  step='0.25'
                  placeholder='f.eks. 1 eller 0.5'
                />
                <p className='result-explanation'>
                  Perioden med forestillinger (koreografarbeid avsluttes, kun danserarbeid)
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Results */}
      <div className='card result-card'>
        <div className='card-header'>
          <h2 className='card-title'>Beregnet lønn</h2>
        </div>
        <div className='separator'></div>
        <div className='card-content result-grid'>
          {salary ? (
            <>
              {/* Verkssats Section */}
              <section className='result-section'>
                <h3 className='result-subtitle'>Verkssats - Koreografisk verk</h3>
                <p className='result-explanation'>
                  Minuttsats: {formatNumber(salary.choreographerMinuteRate)} NOK
                </p>
                <p className='result-explanation'>
                  Produksjonslengde: {productionLengthMinutes} minutter
                </p>
                <p className='result-explanation'>
                  Beregning: {formatNumber(salary.choreographerMinuteRate)} NOK × {productionLengthMinutes} min
                </p>
                <p className='result-explanation'>(Alltid 100% - engangsbetaling)</p>
                <p className='result-value'>
                  Verkssats: {formatNumber(salary.verkssats)} NOK
                </p>
              </section>

              <div className='separator'></div>

              {/* Production Period Section */}
              <section className='result-section'>
                <h3 className='result-subtitle'>
                  Innstuderingsperiode - {productionPeriodMonths} måneder
                </h3>
                <p className='result-explanation'>
                  Danser månedssats: {formatNumber(salary.dancerMonthlyRate)} NOK
                </p>
                <p className='result-explanation'>
                  Koreograf månedssats: {formatNumber(salary.choreographerMonthlyRate)} NOK
                </p>
                <div className='mt-4'>
                  <p className='result-explanation'>
                    Danser ({salary.productionPeriod.dancerPercent}%):{' '}
                    {formatNumber(salary.dancerMonthlyRate)} × {productionPeriodMonths} × {salary.productionPeriod.dancerPercent / 100} ={' '}
                    {formatNumber(salary.productionPeriod.dancerSalary)} NOK
                  </p>
                  <p className='result-explanation'>
                    Koreograf ({salary.productionPeriod.choreographerPercent}%):{' '}
                    {formatNumber(salary.choreographerMonthlyRate)} × {productionPeriodMonths} × {salary.productionPeriod.choreographerPercent / 100} ={' '}
                    {formatNumber(salary.productionPeriod.choreographerSalary)} NOK
                  </p>
                </div>
                <p className='result-value'>
                  Sum periode: {formatNumber(salary.productionPeriod.periodTotal)} NOK
                </p>
              </section>

              <div className='separator'></div>

              {/* Performance Period Section */}
              <section className='result-section'>
                <h3 className='result-subtitle'>
                  Forestillingsperiode - {performancePeriodMonths} måneder
                </h3>
                <p className='result-explanation'>
                  (Koreografarbeid avsluttes ved forestillingsstart)
                </p>
                <div className='mt-4'>
                  <p className='result-explanation'>
                    Danser ({salary.performancePeriod.dancerPercent}%):{' '}
                    {formatNumber(salary.dancerMonthlyRate)} × {performancePeriodMonths} × 1 ={' '}
                    {formatNumber(salary.performancePeriod.dancerSalary)} NOK
                  </p>
                  <p className='result-explanation'>
                    Koreograf (0%): 0 NOK
                  </p>
                </div>
                <p className='result-value'>
                  Sum periode: {formatNumber(salary.performancePeriod.periodTotal)} NOK
                </p>
              </section>

              <div className='separator'></div>

              {/* Totals Section */}
              <section className='result-section'>
                <h3 className='result-subtitle'>Totalt</h3>
                <p className='result-explanation'>
                  Total danserlønn: {formatNumber(salary.totalDancerSalary)} NOK
                </p>
                <p className='result-explanation'>
                  Total koreograflønn (verkssats + innstudering): {formatNumber(salary.totalChoreographerSalary)} NOK
                </p>
                <div className='total-salary'>
                  <p className='total-salary-value'>
                    Samlet lønn: {formatNumber(salary.grandTotal)} NOK
                  </p>
                </div>
              </section>

              <div className='separator'></div>

              {/* Royalties Section */}
              <section className='result-section royalties-note'>
                <h3 className='result-subtitle'>Royalties</h3>
                <p className='royalties-text'>
                  I tillegg skal du, som koreograf, ha 6% av billettinntektene utbetalt som royalties.
                </p>
              </section>
            </>
          ) : (
            <p className='result-explanation'>
              Vennligst fyll ut alle feltene for å se beregnet lønn.
            </p>
          )}
        </div>
      </div>

      <div className='clear-button-container'>
        <button
          type='button'
          onClick={resetForm}
          className='btn btn-primary'
          aria-label='Nullstill alle verdier'
        >
          Nullstill
        </button>
      </div>
    </form>
  );
}
