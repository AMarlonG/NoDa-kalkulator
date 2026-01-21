'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { dancersSalaryData } from '@/lib/dancersSalary';
import { calculateSelfEmployedRates } from '@/lib/selfEmployedRates';
import { SelfEmployedPopover } from './SelfEmployedPopover';

export function DancerCalculator() {
  const [seniority, setSeniority] = useState('');
  const [employmentType, setEmploymentType] = useState('');
  const [projectMonths, setProjectMonths] = useState('');
  const [salary, setSalary] = useState<{
    annualSalary: string;
    monthlyRate?: string;
    projectSalary?: string;
  } | null>(null);

  const resetForm = () => {
    setSeniority('');
    setEmploymentType('');
    setProjectMonths('');
    setSalary(null);
  };

  // Calculate self-employed rates using shared utility
  const selfEmployedRates = useMemo(() => {
    if (!salary) return null;
    const annualSalary = Number(salary.annualSalary.replace(/\s/g, ''));
    return calculateSelfEmployedRates(annualSalary);
  }, [salary]);

  const calculateSalary = useCallback(() => {
    if (seniority && employmentType) {
      const selectedData = dancersSalaryData.find(
        (item) => item.Ansiennitet === seniority
      );
      if (selectedData) {
        if (employmentType === 'permanent') {
          setSalary({
            annualSalary: selectedData['Årslønn fast ansettelse'],
          });
        } else if (employmentType === 'project' && projectMonths) {
          const annualSalary = Number(
            selectedData['Årslønn prosjekt'].replace(/\s/g, '')
          );
          const monthlyRate = annualSalary / 12;
          const projectSalary = monthlyRate * Number(projectMonths);

          setSalary({
            annualSalary: selectedData['Årslønn prosjekt'],
            monthlyRate: Math.round(monthlyRate).toString(),
            projectSalary: Math.round(projectSalary).toString(),
          });
        } else {
          setSalary(null);
        }
      }
    } else {
      setSalary(null);
    }
  }, [seniority, employmentType, projectMonths]);

  useEffect(() => {
    calculateSalary();
  }, [calculateSalary]);

  return (
    <form className='form calculator-content'>
      <p className='sr-only'>
        Du kan bruke tastaturet for å navigere i kalkulatoren. Bruk tab-tasten
        for å flytte mellom felt, og enter-tasten for å velge alternativer.
      </p>
      <div className='card'>
        <div className='card-header'>
          <h2 className='card-title'>Danser lønnsberegning</h2>
        </div>
        <div className='card-content'>
          <div className='input-group'>
            <label htmlFor='seniority' className='label'>
              Ansiennitet
            </label>
            <select
              id='seniority'
              className='styled-select'
              value={seniority}
              onChange={(e) => setSeniority(e.target.value)}
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
            <label htmlFor='employmentType' className='label'>
              Ansettelsestype
            </label>
            <select
              id='employmentType'
              className='styled-select'
              value={employmentType}
              onChange={(e) => {
                setEmploymentType(e.target.value);
                setProjectMonths('');
              }}
            >
              <option value=''>Velg ansettelsestype</option>
              <option value='permanent'>Fast ansettelse</option>
              <option value='project'>Midlertidig ansettelse</option>
            </select>
          </div>

          {employmentType === 'project' && (
            <div className='input-group'>
              <label htmlFor='projectMonths' className='label'>
                Antall måneder for engasjementet
              </label>
              <input
                type='number'
                id='projectMonths'
                className='input'
                value={projectMonths}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '' || /^[0-9\b]+$/.test(value)) {
                    setProjectMonths(value);
                  }
                }}
                min='1'
                placeholder='Antall måneder'
              />
            </div>
          )}

          <div className='card result-card'>
            <div className='card-header'>
              <h2 id='results-title' className='card-title'>
                Beregnet lønn
              </h2>
            </div>
            <div className='separator'></div>
            <div
              className='card-content result-grid'
              aria-labelledby='results-title'
              aria-live='polite'
            >
              {salary ? (
                <div>
                  {employmentType === 'permanent' ? (
                    <section className='result-section'>
                      <h3 className='result-subtitle'>
                        Årslønn (fast ansettelse):
                      </h3>
                      <p className='result-value'>
                        {Number(
                          salary.annualSalary.replace(/\s/g, '')
                        ).toLocaleString('no-NO', {
                          maximumFractionDigits: 0,
                        })}{' '}
                        NOK
                      </p>
                    </section>
                  ) : employmentType === 'project' && salary.projectSalary ? (
                    <>
                      <section className='result-section'>
                        <h3 className='result-subtitle'>
                          Årslønn (grunnlag for beregning):
                        </h3>
                        <p className='result-value'>
                          {Number(
                            salary.annualSalary.replace(/\s/g, '')
                          ).toLocaleString('no-NO', {
                            maximumFractionDigits: 0,
                          })}{' '}
                          NOK
                        </p>
                      </section>
                      <section className='result-section'>
                        <h3 className='result-subtitle'>Månedssats:</h3>
                        <p className='result-value'>
                          {Number(salary.monthlyRate).toLocaleString('no-NO', {
                            maximumFractionDigits: 0,
                          })}{' '}
                          NOK
                        </p>
                        <p className='result-explanation'>
                          (Årslønn{' '}
                          {Number(
                            salary.annualSalary.replace(/\s/g, '')
                          ).toLocaleString('no-NO', {
                            maximumFractionDigits: 0,
                          })}{' '}
                          NOK / 12 måneder)
                        </p>
                      </section>
                      <section className='result-section'>
                        <h3 className='result-subtitle'>
                          Lønn for engasjementet:
                        </h3>
                        <p className='result-value'>
                          {Number(salary.projectSalary).toLocaleString('no-NO', {
                            maximumFractionDigits: 0,
                          })}{' '}
                          NOK
                        </p>
                        <p className='result-explanation'>
                          (Månedssats{' '}
                          {Number(salary.monthlyRate).toLocaleString('no-NO', {
                            maximumFractionDigits: 0,
                          })}{' '}
                          NOK x {projectMonths} måneder)
                        </p>
                      </section>
                    </>
                  ) : (
                    <p className='result-explanation'>
                      Vennligst fyll ut alle feltene for å se beregnet lønn.
                    </p>
                  )}

                  {/* Self-employed popover button */}
                  <div className='popover-trigger-container'>
                    <button
                      type='button'
                      className='btn btn-secondary'
                      popoverTarget='selvstendig-info-dancer'
                    >
                      Er dette et oppdrag?
                    </button>
                  </div>
                </div>
              ) : (
                <p className='result-explanation'>
                  Vennligst fyll ut alle feltene for å se beregnet lønn.
                </p>
              )}
            </div>
          </div>
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

      <SelfEmployedPopover id='selvstendig-info-dancer' rates={selfEmployedRates} />
    </form>
  );
}
