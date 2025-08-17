'use client';

import { useState, useEffect } from 'react';
import { dancersSalaryData } from '@/lib/dancersSalary';
import { choreographyProjectSalaryData } from '@/lib/choreographyProjectSalary';
import '../styles/base.css';
import '../styles/calculator-common.css';

export function DancerChoreographerCalculator() {
  const [primaryRole, setPrimaryRole] = useState<
    'dancer' | 'choreographer' | ''
  >('');
  const [dancerSeniority, setDancerSeniority] = useState('');
  const [choreographerSeniority, setChoreographerSeniority] = useState('');
  const [projectDays, setProjectDays] = useState<string>('');
  const [productionLength, setProductionLength] = useState<string>('');
  const [rehearsalMonths, setRehearsalMonths] = useState<string>('');
  const [salary, setSalary] = useState<{
    dancerSalary: string;
    choreographerSalary: string;
    totalSalary: string;
    breakdown: {
      dancerBase: string;
      dancerDailySalary: string;
      dancerProjectSalary: string;
      choreographerBase: {
        productionSalary: string;
        rehearsalSalary: string;
      };
      choreographerRates: {
        minuteRate: string;
        monthlyRate: string;
      };
    };
  } | null>(null);

  const resetForm = () => {
    setPrimaryRole('');
    setDancerSeniority('');
    setChoreographerSeniority('');
    setProjectDays('');
    setProductionLength('');
    setRehearsalMonths('');
    setSalary(null);
  };

  const resetInputs = () => {
    setDancerSeniority('');
    setChoreographerSeniority('');
    setProjectDays('');
    setProductionLength('');
    setRehearsalMonths('');
    setSalary(null);
  };

  useEffect(() => {
    if (
      primaryRole &&
      ((primaryRole === 'dancer' && dancerSeniority && projectDays) ||
        (primaryRole === 'choreographer' &&
          choreographerSeniority &&
          productionLength &&
          rehearsalMonths)) &&
      ((primaryRole === 'dancer' &&
        choreographerSeniority &&
        productionLength &&
        rehearsalMonths) ||
        (primaryRole === 'choreographer' && dancerSeniority && projectDays))
    ) {
      const dancerData = dancersSalaryData.find(
        (item) => item.Ansiennitet === dancerSeniority
      );
      const choreographerData = choreographyProjectSalaryData.find(
        (item) => item.Ansiennitet === Number(choreographerSeniority)
      );

      if (dancerData && choreographerData) {
        const dancerYearlySalary = Number(
          dancerData['Årslønn prosjekt'].replace(/\s/g, '')
        );
        const dancerDailySalary = dancerYearlySalary / 229;
        const dancerProjectSalary = dancerDailySalary * Number(projectDays);

        const choreographerMinuteRate = Number(
          choreographerData['Minuttsats koreografi'].replace(/\s/g, '')
        );
        const choreographerMonthlyRate = Number(
          choreographerData['Innstudering månedssats'].replace(/\s/g, '')
        );
        const choreographyProductionSalary =
          choreographerMinuteRate * Number(productionLength);
        const choreographyRehearsalSalary =
          choreographerMonthlyRate * Number(rehearsalMonths);

        let primarySalary: number;
        let secondarySalary: number;
        let dancerSalary: number;
        let choreographerSalary: number;

        if (primaryRole === 'dancer') {
          primarySalary = dancerProjectSalary;
          secondarySalary =
            choreographyProductionSalary + choreographyRehearsalSalary * 0.5;
          dancerSalary = primarySalary;
          choreographerSalary = secondarySalary;
        } else {
          primarySalary =
            choreographyProductionSalary + choreographyRehearsalSalary;
          secondarySalary = dancerProjectSalary * 0.5;
          dancerSalary = secondarySalary;
          choreographerSalary = primarySalary;
        }

        const totalSalary = primarySalary + secondarySalary;

        setSalary({
          dancerSalary: Math.round(dancerSalary).toString(),
          choreographerSalary: Math.round(choreographerSalary).toString(),
          totalSalary: Math.round(totalSalary).toString(),
          breakdown: {
            dancerBase: Math.round(dancerYearlySalary).toString(),
            dancerDailySalary: Math.round(dancerDailySalary).toString(),
            dancerProjectSalary: Math.round(dancerProjectSalary).toString(),
            choreographerBase: {
              productionSalary: Math.round(
                choreographyProductionSalary
              ).toString(),
              rehearsalSalary: Math.round(
                choreographyRehearsalSalary
              ).toString(),
            },
            choreographerRates: {
              minuteRate: Math.round(choreographerMinuteRate).toString(),
              monthlyRate: Math.round(choreographerMonthlyRate).toString(),
            },
          },
        });
      }
    } else {
      setSalary(null);
    }
  }, [
    primaryRole,
    dancerSeniority,
    choreographerSeniority,
    projectDays,
    productionLength,
    rehearsalMonths,
  ]);

  const renderRoleInputs = (
    role: 'dancer' | 'choreographer',
    isPrimary: boolean
  ) => (
    <div className='card'>
      <div className='card-header'>
        <h3 className='card-title'>
          {role === 'dancer' ? 'Danser' : 'Koreograf'} (
          {isPrimary ? 'Primær' : 'Sekundær'} rolle)
        </h3>
      </div>
      <div className='card-content'>
        <div className='input-group'>
          <label htmlFor={`${role}Seniority`} className='label'>
            Ansiennitet
          </label>
          <select
            id={`${role}Seniority`}
            className='styled-select'
            value={role === 'dancer' ? dancerSeniority : choreographerSeniority}
            onChange={(e) =>
              role === 'dancer'
                ? setDancerSeniority(e.target.value)
                : setChoreographerSeniority(e.target.value)
            }
          >
            <option value=''>Velg ansiennitet</option>
            {(role === 'dancer'
              ? dancersSalaryData
              : choreographyProjectSalaryData
            ).map((item) => (
              <option
                key={item.Ansiennitet}
                value={item.Ansiennitet.toString()}
              >
                {item.Ansiennitet}
              </option>
            ))}
          </select>
        </div>

        {role === 'dancer' && (
          <div className='input-group'>
            <label htmlFor='projectDays' className='label'>
              Antall dager du skal jobbe
            </label>
            <input
              type='number'
              id='projectDays'
              className='input'
              value={projectDays}
              onChange={(e) => setProjectDays(e.target.value)}
              min='1'
              placeholder='Antall dager'
            />
            <p className='result-explanation'>
              {isPrimary
                ? '(Beregnes som 100% av daglig sats)'
                : '(Beregnes som 50% av daglig sats)'}
            </p>
          </div>
        )}

        {role === 'choreographer' && (
          <>
            <div className='input-group'>
              <label htmlFor='productionLength' className='label'>
                Produksjonslengde (minutter)
              </label>
              <input
                type='number'
                id='productionLength'
                className='input'
                value={productionLength}
                onChange={(e) => setProductionLength(e.target.value)}
                min='1'
                placeholder='Antall minutter'
              />
              <p className='result-explanation'>
                (Beregnet alltid som 100% av verkssats)
              </p>
            </div>
            <div className='input-group'>
              <label htmlFor='rehearsalMonths' className='label'>
                Innstuderingsmåneder
              </label>
              <input
                type='number'
                id='rehearsalMonths'
                className='input'
                value={rehearsalMonths}
                onChange={(e) => setRehearsalMonths(e.target.value)}
                min='1'
                placeholder='Antall måneder'
              />
              <p className='result-explanation'>
                {isPrimary
                  ? '(Beregnes som 100% av månedlig sats)'
                  : '(Beregnes som 50% av månedlig sats)'}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );

  return (
    <form className='form calculator-content'>
      <div className='card'>
        <div className='card-header'>
          <h2 className='card-title'>Velg roller</h2>
        </div>
        <div className='card-content'>
          <div className='input-group'>
            <label htmlFor='primaryRole' className='label'>
              Primær rolle
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
          </div>
        </div>
      </div>

      {primaryRole && (
        <>
          {renderRoleInputs(primaryRole, true)}
          {renderRoleInputs(
            primaryRole === 'dancer' ? 'choreographer' : 'dancer',
            false
          )}
        </>
      )}

      <div className='card result-card'>
        <div className='card-header'>
          <h2 className='card-title'>Beregnet lønn</h2>
        </div>
        <div className='separator'></div>
        <div className='card-content result-grid'>
          {salary ? (
            <section className='result-section'>
              {/* Primary Role Calculation */}
              <div>
                <h3 className='result-subtitle'>
                  {primaryRole === 'dancer' ? 'Danser' : 'Koreograf'} (Primær
                  rolle)
                </h3>
                {primaryRole === 'dancer' ? (
                  <>
                    <p className='result-explanation'>
                      Årslønn (grunnlag for beregning):{' '}
                      {Number(salary.breakdown.dancerBase).toLocaleString(
                        'no-NO',
                        { maximumFractionDigits: 0 }
                      )}{' '}
                      NOK
                    </p>
                    <p className='result-explanation'>
                      Daglig sats:{' '}
                      {Number(
                        salary.breakdown.dancerDailySalary
                      ).toLocaleString('no-NO', {
                        maximumFractionDigits: 0,
                      })}{' '}
                      NOK (Årslønn / 229 arbeidsdager)
                    </p>
                    <p className='result-explanation'>
                      Antall dager: {projectDays}
                    </p>
                    <p className='result-explanation'>
                      Beregning:{' '}
                      {Number(
                        salary.breakdown.dancerDailySalary
                      ).toLocaleString('no-NO', {
                        maximumFractionDigits: 0,
                      })}{' '}
                      NOK x {projectDays} dager
                    </p>
                    <p className='result-explanation'>
                      (Beregnet som 100% av daglig sats)
                    </p>
                    <p className='result-value'>
                      Lønn som danser:{' '}
                      {Number(
                        salary.breakdown.dancerProjectSalary
                      ).toLocaleString('no-NO', {
                        maximumFractionDigits: 0,
                      })}{' '}
                      NOK
                    </p>
                  </>
                ) : (
                  <>
                    <p className='result-explanation'>
                      Verkssats (per minutt):{' '}
                      {Number(
                        salary.breakdown.choreographerRates.minuteRate
                      ).toLocaleString('no-NO', {
                        maximumFractionDigits: 0,
                      })}{' '}
                      NOK
                    </p>
                    <p className='result-explanation'>
                      Produksjonslengde: {productionLength} minutter
                    </p>
                    <p className='result-explanation'>
                      Beregning verkssats:{' '}
                      {Number(
                        salary.breakdown.choreographerRates.minuteRate
                      ).toLocaleString('no-NO', {
                        maximumFractionDigits: 0,
                      })}{' '}
                      NOK x {productionLength} minutter ={' '}
                      {Number(
                        salary.breakdown.choreographerBase.productionSalary
                      ).toLocaleString('no-NO', {
                        maximumFractionDigits: 0,
                      })}{' '}
                      NOK
                    </p>
                    <p className='result-explanation'>
                      (Beregnet som 100% av verkssats)
                    </p>
                    <div className='mt-4'>
                      <p className='result-explanation'>
                        Innstuderingssats (per måned):{' '}
                        {Number(
                          salary.breakdown.choreographerRates.monthlyRate
                        ).toLocaleString('no-NO', {
                          maximumFractionDigits: 0,
                        })}{' '}
                        NOK
                      </p>
                    </div>
                    <p className='result-explanation'>
                      Innstuderingsmåneder: {rehearsalMonths}
                    </p>
                    <p className='result-explanation'>
                      Beregning innstudering:{' '}
                      {Number(
                        salary.breakdown.choreographerRates.monthlyRate
                      ).toLocaleString('no-NO', {
                        maximumFractionDigits: 0,
                      })}{' '}
                      NOK x {rehearsalMonths} måneder ={' '}
                      {Number(
                        salary.breakdown.choreographerBase.rehearsalSalary
                      ).toLocaleString('no-NO', {
                        maximumFractionDigits: 0,
                      })}{' '}
                      NOK
                    </p>
                    <p className='result-explanation'>
                      (Beregnet som 100% av månedlig sats)
                    </p>
                    <p className='result-explanation mt-2'>
                      (Verkssats og innstuderingssats utgjør sammen den totale
                      lønnen som koreograf)
                    </p>
                    <p className='result-value'>
                      Lønn som koreograf:{' '}
                      {Number(salary.choreographerSalary).toLocaleString(
                        'no-NO',
                        { maximumFractionDigits: 0 }
                      )}{' '}
                      NOK
                    </p>
                  </>
                )}
              </div>

              <div className='separator'></div>

              {/* Secondary Role Calculation */}
              <div>
                <h3 className='result-subtitle'>
                  {primaryRole === 'dancer' ? 'Koreograf' : 'Danser'} (Sekundær
                  rolle)
                </h3>
                {primaryRole === 'dancer' ? (
                  <>
                    <p className='result-explanation'>
                      Verkssats (per minutt):{' '}
                      {Number(
                        salary.breakdown.choreographerRates.minuteRate
                      ).toLocaleString('no-NO', {
                        maximumFractionDigits: 0,
                      })}{' '}
                      NOK
                    </p>
                    <p className='result-explanation'>
                      Produksjonslengde: {productionLength} minutter
                    </p>
                    <p className='result-explanation'>
                      Beregning verkssats:{' '}
                      {Number(
                        salary.breakdown.choreographerRates.minuteRate
                      ).toLocaleString('no-NO', {
                        maximumFractionDigits: 0,
                      })}{' '}
                      NOK x {productionLength} minutter ={' '}
                      {Number(
                        salary.breakdown.choreographerBase.productionSalary
                      ).toLocaleString('no-NO', {
                        maximumFractionDigits: 0,
                      })}{' '}
                      NOK
                    </p>
                    <p className='result-explanation'>
                      (Beregnet som 100% av verkssats)
                    </p>
                    <div className='mt-4'>
                      <p className='result-explanation'>
                        Innstuderingssats (per måned):{' '}
                        {Number(
                          salary.breakdown.choreographerRates.monthlyRate
                        ).toLocaleString('no-NO', {
                          maximumFractionDigits: 0,
                        })}{' '}
                        NOK
                      </p>
                    </div>
                    <p className='result-explanation'>
                      Innstuderingsmåneder: {rehearsalMonths}
                    </p>
                    <p className='result-explanation'>
                      Beregning innstudering:{' '}
                      {Number(
                        salary.breakdown.choreographerRates.monthlyRate
                      ).toLocaleString('no-NO', {
                        maximumFractionDigits: 0,
                      })}{' '}
                      NOK x {rehearsalMonths} måneder x 0.5 ={' '}
                      {(
                        Number(
                          salary.breakdown.choreographerBase.rehearsalSalary
                        ) * 0.5
                      ).toLocaleString('no-NO', {
                        maximumFractionDigits: 0,
                      })}{' '}
                      NOK
                    </p>
                    <p className='result-explanation'>
                      (Beregnet som 50% av månedlig sats)
                    </p>
                    <p className='result-explanation mt-2'>
                      (Verkssats og innstuderingssats utgjør sammen den totale
                      lønnen som koreograf)
                    </p>
                    <p className='result-value'>
                      Lønn som koreograf:{' '}
                      {Number(salary.choreographerSalary).toLocaleString(
                        'no-NO',
                        { maximumFractionDigits: 0 }
                      )}{' '}
                      NOK
                    </p>
                  </>
                ) : (
                  <>
                    <p className='result-explanation'>
                      Årslønn (grunnlag for beregning):{' '}
                      {Number(salary.breakdown.dancerBase).toLocaleString(
                        'no-NO',
                        { maximumFractionDigits: 0 }
                      )}{' '}
                      NOK
                    </p>
                    <p className='result-explanation'>
                      Daglig sats:{' '}
                      {Number(
                        salary.breakdown.dancerDailySalary
                      ).toLocaleString('no-NO', {
                        maximumFractionDigits: 0,
                      })}{' '}
                      NOK (Årslønn / 229 arbeidsdager)
                    </p>
                    <p className='result-explanation'>
                      Antall dager: {projectDays}
                    </p>
                    <p className='result-explanation'>
                      Beregning:{' '}
                      {Number(
                        salary.breakdown.dancerDailySalary
                      ).toLocaleString('no-NO', {
                        maximumFractionDigits: 0,
                      })}{' '}
                      NOK x {projectDays} dager x 0.5
                    </p>
                    <p className='result-explanation'>
                      (Beregnet som 50% av daglig sats)
                    </p>
                    <p className='result-value'>
                      Lønn som danser:{' '}
                      {Number(salary.dancerSalary).toLocaleString('no-NO', {
                        maximumFractionDigits: 0,
                      })}{' '}
                      NOK
                    </p>
                  </>
                )}
              </div>

              <div className='separator'></div>

              {/* Combined Base Salary */}
              <div>
                <h3 className='result-subtitle'>Kombinert grunnlønn:</h3>
                <p className='result-value'>
                  {Number(salary.combinedBaseSalary).toLocaleString('no-NO', {
                    maximumFractionDigits: 0,
                  })}{' '}
                  NOK
                </p>
                <p className='result-explanation'>
                  (Dette er summen av lønnen for begge roller, før sosiale
                  kostnader)
                </p>
              </div>

              <div className='separator'></div>

              {/* Total Salary */}
              <div className='total-salary'>
                <h3 className='result-subtitle'>Total lønn for prosjektet:</h3>
                <p className='total-salary-value'>
                  {Number(salary.totalSalary).toLocaleString('no-NO', {
                    maximumFractionDigits: 0,
                  })}{' '}
                  NOK
                </p>
                <p className='result-explanation'>
                  (Danser lønn + Koreograf lønn)
                </p>
              </div>
            </section>
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