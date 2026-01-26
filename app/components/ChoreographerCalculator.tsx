'use client';

import { useState, useEffect, useMemo } from 'react';
import { choreographyProjectSalaryData } from '@/lib/choreographyProjectSalary';
import { choreographyTheaterMusicalSalaryData } from '@/lib/choreographyTheaterMusicalSalary';
import { calculateSelfEmployedRates, calculateSelfEmployedRatesFromHourly } from '@/lib/selfEmployedRates';
import { formatNumber, parseNorwegianNumber } from '@/lib/formatting';
import { SelfEmployedPopover } from './SelfEmployedPopover';

export function ChoreographerCalculator() {
  const [seniority, setSeniority] = useState('');
  const [workType, setWorkType] = useState<'project' | 'theater' | ''>('');
  const [productionLength, setProductionLength] = useState('');
  const [rehearsalMonths, setRehearsalMonths] = useState('');
  const [rehearsalDays, setRehearsalDays] = useState('');
  const [salary, setSalary] = useState<{
    minuteRate?: string;
    monthlyRate?: string;
    annualSalary?: string;
    productionSalary?: string;
    rehearsalSalary?: string;
    totalSalary?: string;
    dailyRate?: number;
    totalFee?: number;
    normalhonorar?: number;
    usedHighestSeniority?: boolean;
  } | null>(null);

  const resetForm = () => {
    setSeniority('');
    setWorkType('');
    setProductionLength('');
    setRehearsalMonths('');
    setRehearsalDays('');
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
        const monthlyRate = parseNorwegianNumber(
          selectedData['Innstudering månedssats']
        );
        estimatedAnnualSalary = monthlyRate * 12;
      }
    } else if (workType === 'theater' && salary?.dailyRate) {
      return calculateSelfEmployedRatesFromHourly(salary.dailyRate);
    }

    if (estimatedAnnualSalary === null) return null;
    return calculateSelfEmployedRates(estimatedAnnualSalary);
  }, [seniority, workType, salary?.normalhonorar, salary?.dailyRate]);

  useEffect(() => {
    if (seniority && workType) {
      if (workType === 'project') {
        const selectedData = choreographyProjectSalaryData.find(
          (item) => item.Ansiennitet === Number(seniority)
        );
        if (selectedData && productionLength && rehearsalMonths) {
          const minuteRate = parseNorwegianNumber(
            selectedData['Minuttsats koreografi']
          );
          const monthlyRate = parseNorwegianNumber(
            selectedData['Innstudering månedssats']
          );
          const productionSalary = minuteRate * Number(productionLength);
          const rehearsalSalary = monthlyRate * Number(rehearsalMonths);
          const totalSalary = productionSalary + rehearsalSalary;

          setSalary({
            minuteRate: selectedData['Minuttsats koreografi'],
            monthlyRate: selectedData['Innstudering månedssats'],
            productionSalary: formatNumber(productionSalary),
            rehearsalSalary: formatNumber(rehearsalSalary),
            totalSalary: formatNumber(totalSalary),
          });
        } else {
          setSalary(null);
        }
      } else if (workType === 'theater') {
        const days = Number(rehearsalDays);
        if (rehearsalDays && days >= 1 && days <= 48) {
          const usedHighestSeniority = days <= 15;
          const lookupSeniority = usedHighestSeniority ? 14 : Number(seniority);
          const selectedData = choreographyTheaterMusicalSalaryData.find(
            (item) => item.Ansiennitet === lookupSeniority
          );
          if (selectedData) {
            const normalhonorar = parseNorwegianNumber(selectedData.Lønn);
            const dailyRate = normalhonorar / 48;
            const totalFee = dailyRate * days;
            setSalary({
              dailyRate,
              totalFee,
              normalhonorar,
              usedHighestSeniority,
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
    } else {
      setSalary(null);
    }
  }, [seniority, workType, productionLength, rehearsalMonths, rehearsalDays]);

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
                setRehearsalDays('');
              }}
            >
              <option value=''>Velg arbeidstype</option>
              <option value='project'>Produksjon for dansekompani</option>
              <option value='theater'>For teater eller musikal</option>
            </select>
          </div>

          {workType === 'theater' && (
            <div className='input-group'>
              <label htmlFor='rehearsalDays' className='label'>
                Antall prøvedager
              </label>
              <input
                type='number'
                id='rehearsalDays'
                className='input'
                value={rehearsalDays}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '' || /^[0-9\b]+$/.test(value)) {
                    const num = Number(value);
                    if (value === '' || (num >= 0 && num <= 48)) {
                      setRehearsalDays(value);
                    }
                  }
                }}
                min='1'
                max='48'
                placeholder='1–48 dager'
              />
            </div>
          )}

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
                        <h3 className='result-subtitle'>Verkssats:</h3>
                        <p className='result-value'>
                          {salary.productionSalary} NOK
                        </p>
                        <p className='result-breakdown'>
                          {salary.minuteRate} NOK/min × {productionLength} min
                        </p>
                      </section>
                      <section className='result-section'>
                        <h3 className='result-subtitle'>Lønn for innstudering:</h3>
                        <p className='result-value'>
                          {salary.rehearsalSalary} NOK
                        </p>
                        <p className='result-breakdown'>
                          {salary.monthlyRate} NOK/mnd × {rehearsalMonths} mnd
                        </p>
                      </section>
                      <section className='result-section'>
                        <h3 className='result-subtitle'>Total lønn for produksjonen:</h3>
                        <p className='total-salary-value'>
                          {salary.totalSalary} NOK
                        </p>
                        <p className='result-breakdown'>
                          Verkssats + innstudering
                        </p>
                      </section>
                      <section className='result-section'>
                        <h3 className='result-subtitle'>Husk royalties!</h3>
                        <p className='result-explanation'>
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
              ) : workType === 'theater' && salary.totalFee != null ? (
                <>
                  <section className='result-section'>
                    <h3 className='result-subtitle'>Normalhonorar (48 dager):</h3>
                    <p className='result-value'>
                      {formatNumber(salary.normalhonorar!)} NOK
                    </p>
                    {salary.usedHighestSeniority && (
                      <p className='result-breakdown'>
                        Høyeste ansiennitet (14 år) brukt jf. punkt 7.4
                      </p>
                    )}
                  </section>
                  <section className='result-section'>
                    <h3 className='result-subtitle'>Dagsats:</h3>
                    <p className='result-value'>
                      {formatNumber(Math.round(salary.dailyRate! * 100) / 100)} NOK
                    </p>
                    <p className='result-breakdown'>
                      {formatNumber(salary.normalhonorar!)} ÷ 48 dager
                    </p>
                  </section>
                  <section className='result-section'>
                    <h3 className='result-subtitle'>Total honorar:</h3>
                    <p className='total-salary-value'>
                      {formatNumber(Math.round(salary.totalFee!))} NOK
                    </p>
                    <p className='result-breakdown'>
                      {formatNumber(Math.round(salary.dailyRate! * 100) / 100)} NOK/dag × {rehearsalDays} dager
                    </p>
                  </section>
                  {salary.usedHighestSeniority && (
                    <section className='result-section'>
                      <h3 className='result-subtitle'>Merk:</h3>
                      <p className='result-explanation'>
                        Ved 1–15 prøvedager benyttes alltid høyeste ansiennitet (14 år) for beregning av dagsats, uavhengig av koreografens faktiske ansiennitet (jf. Koreografavtalen punkt 7.4).
                      </p>
                    </section>
                  )}
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
                  popoverTarget='selvstendig-info-choreographer'
                >
                  Selvstendig næringsdrivende?
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
          Nullstill kalkulator
        </button>
      </div>

      <SelfEmployedPopover
        id='selvstendig-info-choreographer'
        rates={selfEmployedRates}
        rateLabel={workType === 'theater' ? 'Dagsats' : undefined}
        rateNote={workType === 'theater' ? 'jf. punkt 7.4 i koreografavtalen' : undefined}
      />
    </form>
  );
}
