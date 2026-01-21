'use client';

import { useState, useEffect, useMemo } from 'react';
import { choreographyProjectSalaryData } from '@/lib/choreographyProjectSalary';
import { choreographyTheaterMusicalSalaryData } from '@/lib/choreographyTheaterMusicalSalary';
import { calculateSelfEmployedRates } from '@/lib/selfEmployedRates';
import { SelfEmployedPopover } from './SelfEmployedPopover';

export function ChoreographerCalculator() {
  const [seniority, setSeniority] = useState('');
  const [workType, setWorkType] = useState<'project' | 'theater' | ''>('');
  const [productionLength, setProductionLength] = useState('');
  const [rehearsalMonths, setRehearsalMonths] = useState('');
  const [salary, setSalary] = useState<{
    minuteRate?: string;
    monthlyRate?: string;
    annualSalary?: string;
    productionSalary?: string;
    rehearsalSalary?: string;
    totalSalary?: string;
  } | null>(null);

  const resetForm = () => {
    setSeniority('');
    setWorkType('');
    setProductionLength('');
    setRehearsalMonths('');
    setSalary(null);
  };

  // Calculate self-employed rates using shared utility
  const selfEmployedRates = useMemo(() => {
    if (!seniority) return null;

    let estimatedAnnualSalary: number | null = null;

    if (workType === 'project') {
      const selectedData = choreographyProjectSalaryData.find(
        (item) => item.Ansiennitet === Number(seniority)
      );
      if (selectedData) {
        const monthlyRate = Number(
          selectedData['Innstudering månedssats'].replace(/\s/g, '')
        );
        estimatedAnnualSalary = monthlyRate * 12;
      }
    } else if (workType === 'theater' && salary?.annualSalary) {
      estimatedAnnualSalary = Number(salary.annualSalary.replace(/\s/g, ''));
    }

    if (estimatedAnnualSalary === null) return null;
    return calculateSelfEmployedRates(estimatedAnnualSalary);
  }, [seniority, workType, salary?.annualSalary]);

  useEffect(() => {
    if (seniority && workType) {
      if (workType === 'project') {
        const selectedData = choreographyProjectSalaryData.find(
          (item) => item.Ansiennitet === Number(seniority)
        );
        if (selectedData && productionLength && rehearsalMonths) {
          const minuteRate = Number(
            selectedData['Minuttsats koreografi'].replace(/\s/g, '')
          );
          const monthlyRate = Number(
            selectedData['Innstudering månedssats'].replace(/\s/g, '')
          );
          const productionSalary = minuteRate * Number(productionLength);
          const rehearsalSalary = monthlyRate * Number(rehearsalMonths);
          const totalSalary = productionSalary + rehearsalSalary;

          setSalary({
            minuteRate: selectedData['Minuttsats koreografi'],
            monthlyRate: selectedData['Innstudering månedssats'],
            productionSalary: productionSalary.toLocaleString('no-NO', {
              maximumFractionDigits: 0,
            }),
            rehearsalSalary: rehearsalSalary.toLocaleString('no-NO', {
              maximumFractionDigits: 0,
            }),
            totalSalary: Math.round(totalSalary).toString(),
          });
        } else {
          setSalary(null);
        }
      } else if (workType === 'theater') {
        const selectedData = choreographyTheaterMusicalSalaryData.find(
          (item) => item.Ansiennitet === Number(seniority)
        );
        if (selectedData) {
          setSalary({
            annualSalary: selectedData.Lønn,
          });
        } else {
          setSalary(null);
        }
      } else {
        setSalary(null);
      }
    } else {
      setSalary(null);
    }
  }, [seniority, workType, productionLength, rehearsalMonths]);

  return (
    <form className='form calculator-content'>
      <div className='card'>
        <div className='card-header'>
          <h2 className='card-title'>Koreograf lønnsberegning</h2>
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
              {choreographyProjectSalaryData.map((item) => (
                <option
                  key={item.Ansiennitet}
                  value={item.Ansiennitet.toString()}
                >
                  {item.Ansiennitet}
                </option>
              ))}
            </select>
          </div>

          <div className='input-group'>
            <label htmlFor='workType' className='label'>
              Arbeidstype
            </label>
            <select
              id='workType'
              className='styled-select'
              value={workType}
              onChange={(e) => {
                setWorkType(e.target.value as 'project' | 'theater');
                setProductionLength('');
                setRehearsalMonths('');
              }}
            >
              <option value=''>Velg arbeidstype</option>
              <option value='project'>Produksjon for dansekompani</option>
              <option value='theater'>For teater eller musikal</option>
            </select>
          </div>

          {workType === 'project' && (
            <>
              <div className='input-group'>
                <label htmlFor='productionLength' className='label'>
                  Lengde på verk (minutter)
                </label>
                <input
                  type='number'
                  id='productionLength'
                  className='input'
                  value={productionLength}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '' || /^[0-9\b]+$/.test(value)) {
                      setProductionLength(value);
                    }
                  }}
                  min='1'
                  placeholder='Antall minutter'
                />
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
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '' || /^[0-9\b]+$/.test(value)) {
                      setRehearsalMonths(value);
                    }
                  }}
                  min='1'
                  placeholder='Antall måneder'
                />
              </div>
            </>
          )}
        </div>
      </div>

      <div className='card result-card'>
        <div className='card-header'>
          <h2 className='card-title'>Beregnet lønn</h2>
        </div>
        <div className='separator'></div>
        <div className='card-content result-grid'>
          {salary ? (
            <div>
              {workType === 'project' ? (
                <>
                  {salary.totalSalary ? (
                    <>
                      <section className='result-section'>
                        <h3 className='result-subtitle'>
                          Lønn for koreografi:
                        </h3>
                        <p className='result-value'>
                          {salary.productionSalary} NOK
                        </p>
                        <p className='result-explanation'>
                          (Minuttsats {salary.minuteRate} NOK x{' '}
                          {productionLength} minutter)
                        </p>
                      </section>
                      <section className='result-section'>
                        <h3 className='result-subtitle'>
                          Lønn for innstudering:
                        </h3>
                        <p className='result-value'>
                          {salary.rehearsalSalary} NOK
                        </p>
                        <p className='result-explanation'>
                          (Månedssats {salary.monthlyRate} NOK x{' '}
                          {rehearsalMonths} måneder)
                        </p>
                      </section>
                      <div className='separator'></div>
                      <section className='result-section total-salary'>
                        <h3 className='result-subtitle'>
                          Total lønn for produksjonen:
                        </h3>
                        <p className='total-salary-value'>
                          {Number(salary.totalSalary).toLocaleString('no-NO', {
                            maximumFractionDigits: 0,
                          })}{' '}
                          NOK
                        </p>
                        <p className='result-explanation'>
                          (Lønn for koreografi + Lønn for innstudering)
                        </p>
                      </section>
                      <div className='separator'></div>
                      <section className='result-section royalties-note'>
                        <h3 className='result-subtitle'>Royalties</h3>
                        <p className='royalties-text'>
                          I tillegg skal du, som koreograf, ha 6% av billettinntektene utbetalt som royalties.
                        </p>
                      </section>
                    </>
                  ) : (
                    <p className='result-explanation'>
                      Vennligst fyll ut produksjonslengde og
                      innstuderingsmåneder for å se beregnet lønn.
                    </p>
                  )}
                </>
              ) : workType === 'theater' && salary.annualSalary ? (
                <section className='result-section'>
                  <h3 className='result-subtitle'>Produksjonslønn:</h3>
                  <p className='result-value'>{salary.annualSalary} NOK</p>
                </section>
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
                  popoverTarget='selvstendig-info-choreographer'
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

      <SelfEmployedPopover id='selvstendig-info-choreographer' rates={selfEmployedRates} />
    </form>
  );
}
