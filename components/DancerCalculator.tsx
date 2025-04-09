'use client';

import { useState, useEffect, useCallback } from 'react';
import { dancersSalaryData } from '@/lib/dancersSalary';
import '../app/styles/base.css';
import '../app/styles/calculator-common.css';

export function DancerCalculator() {
  const [seniority, setSeniority] = useState('');
  const [employmentType, setEmploymentType] = useState('');
  const [projectDays, setProjectDays] = useState('');
  const [projectHours, setProjectHours] = useState('');
  const [salary, setSalary] = useState<{
    annualSalary: string;
    dailyRate?: string;
    hourlyRate?: string;
    selfEmployedHourlyRate?: string;
    projectSalary?: string;
    totalHourlyFee?: string;
    baseSalary?: string;
    totalSalary?: string;
    socialCosts?: {
      total?: string;
      holidayPay: string;
      employerTax: string;
      pension: string;
    };
  } | null>(null);

  const resetForm = () => {
    setSeniority('');
    setEmploymentType('');
    setProjectDays('');
    setProjectHours('');
    setSalary(null);
  };

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
        } else if (employmentType === 'selfEmployed' && projectHours) {
          const annualSalary = Number(
            selectedData['Årslønn prosjekt'].replace(/\s/g, '')
          );
          // Calculate hourly rate based on 1750 working hours per year
          const hourlyRate = annualSalary / 1750;
          // Calculate self-employed hourly rate with 36.8% additional costs
          const selfEmployedHourlyRate = hourlyRate * 1.368;

          let totalHourlyFee;
          if (projectHours && Number(projectHours) > 0) {
            totalHourlyFee = selfEmployedHourlyRate * Number(projectHours);
          }

          setSalary({
            annualSalary: selectedData['Årslønn prosjekt'],
            hourlyRate: Math.round(hourlyRate).toString(),
            selfEmployedHourlyRate: Math.round(
              selfEmployedHourlyRate
            ).toString(),
            totalHourlyFee: totalHourlyFee
              ? Math.round(totalHourlyFee).toString()
              : undefined,
          });
        } else if (employmentType === 'project' && projectDays) {
          const annualSalary = Number(
            selectedData['Årslønn prosjekt'].replace(/\s/g, '')
          );
          const dailyRate = annualSalary / 229;
          const baseSalary = dailyRate * Number(projectDays);

          const holidayPay = baseSalary * 0.102;
          const employerTax = baseSalary * 0.141;
          const pension = baseSalary * 0.02;
          const socialCostsTotal = holidayPay + employerTax + pension;
          const totalSalary = baseSalary + socialCostsTotal;

          setSalary({
            annualSalary: selectedData['Årslønn prosjekt'],
            dailyRate: Math.round(dailyRate).toString(),
            projectSalary: Math.round(baseSalary).toString(),
            baseSalary: Math.round(baseSalary).toString(),
            totalSalary: Math.round(totalSalary).toString(),
            socialCosts: {
              total: Math.round(socialCostsTotal).toString(),
              holidayPay: Math.round(holidayPay).toString(),
              employerTax: Math.round(employerTax).toString(),
              pension: Math.round(pension).toString(),
            },
          });
        } else {
          setSalary(null);
        }
      }
    } else {
      setSalary(null);
    }
  }, [seniority, employmentType, projectDays, projectHours]);

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
                setProjectDays('');
                setProjectHours('');
              }}
            >
              <option value=''>Velg ansettelsestype</option>
              <option value='permanent'>Fast ansettelse</option>
              <option value='project'>Midlertidig ansettelse</option>
              <option value='selfEmployed'>Selvstendig næringsdrivende</option>
            </select>
          </div>

          {employmentType === 'project' && (
            <div className='input-group'>
              <label htmlFor='projectDays' className='label'>
                Antall arbeidsdager for prosjektet
              </label>
              <input
                type='number'
                id='projectDays'
                className='input'
                value={projectDays}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '' || /^[0-9\b]+$/.test(value)) {
                    setProjectDays(value);
                  }
                }}
                min='1'
                placeholder='Antall dager'
              />
            </div>
          )}

          {employmentType === 'selfEmployed' && (
            <div className='input-group'>
              <label htmlFor='projectHours' className='label'>
                Antall timer
              </label>
              <input
                type='number'
                id='projectHours'
                className='input'
                value={projectHours}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '' || /^[0-9\b]+$/.test(value)) {
                    setProjectHours(value);
                  }
                }}
                min='1'
                placeholder='Antall timer'
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
                  ) : employmentType === 'selfEmployed' && projectHours ? (
                    <>
                      <section className='result-section'>
                        <h3 className='result-subtitle'>
                          Timesats basert på årslønn:
                        </h3>
                        <p className='result-value'>
                          {Number(salary.hourlyRate).toLocaleString('no-NO', {
                            maximumFractionDigits: 0,
                          })}{' '}
                          NOK
                        </p>
                        <p className='result-explanation'>
                          (Årslønn / 1750 arbeidstimer)
                        </p>
                        <p className='result-explanation mt-2'>
                          <strong>Grunnlag for beregning:</strong> Årslønn{' '}
                          {Number(
                            salary.annualSalary.replace(/\s/g, '')
                          ).toLocaleString('no-NO', {
                            maximumFractionDigits: 0,
                          })}{' '}
                          NOK
                        </p>

                        <div className='separator'></div>

                        <h3 className='result-subtitle'>
                          Anbefalt timesats med påslag (36,8%):
                        </h3>
                        <p className='result-value'>
                          {Number(salary.selfEmployedHourlyRate).toLocaleString(
                            'no-NO',
                            { maximumFractionDigits: 0 }
                          )}{' '}
                          NOK
                        </p>
                        <p className='result-explanation'>
                          Påslaget på 36,8% dekker egne kostnader som
                          selvstendig næringsdrivende, fordelt slik:
                        </p>
                        <ul className='result-explanation-list'>
                          <li>
                            15,8% - Kompensasjon for arbeidsgiveravgift og tap
                            av rettigheter i folketrygdloven
                          </li>
                          <li>12,0% - Kompensasjon for feriepenger</li>
                          <li>
                            3,6% - Trygdeavgiftsforhøyelse for næringsdrivende
                          </li>
                          <li>0,4% - Frivillig yrkesskadeforsikring</li>
                          <li>
                            5,0% - Administrative kostnader for
                            næringsvirksomhet
                          </li>
                        </ul>

                        <div className='separator'></div>

                        <h3 className='result-subtitle'>Total honorar:</h3>
                        <p className='result-value'>
                          {Number(salary.totalHourlyFee).toLocaleString(
                            'no-NO',
                            { maximumFractionDigits: 0 }
                          )}{' '}
                          NOK
                        </p>
                        <p className='result-explanation'>
                          (Timesats{' '}
                          {Number(salary.selfEmployedHourlyRate).toLocaleString(
                            'no-NO',
                            {
                              maximumFractionDigits: 0,
                            }
                          )}{' '}
                          NOK × {projectHours} timer)
                        </p>
                      </section>
                    </>
                  ) : employmentType === 'project' && salary.totalSalary ? (
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
                        <h3 className='result-subtitle'>Dagsats:</h3>
                        <p className='result-value'>
                          {Number(salary.dailyRate).toLocaleString('no-NO', {
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
                          NOK / 229 arbeidsdager)
                        </p>
                      </section>
                      <section className='result-section'>
                        <h3 className='result-subtitle'>
                          Grunnlønn for prosjektet:
                        </h3>
                        <p className='result-value'>
                          {Number(salary.baseSalary).toLocaleString('no-NO', {
                            maximumFractionDigits: 0,
                          })}{' '}
                          NOK
                        </p>
                        <p className='result-explanation'>
                          (Dagsats{' '}
                          {Number(salary.dailyRate).toLocaleString('no-NO', {
                            maximumFractionDigits: 0,
                          })}{' '}
                          NOK x {projectDays} dager)
                        </p>
                      </section>
                      <div className='separator'></div>
                      <section className='result-section social-costs'>
                        <h3 className='result-subtitle'>Sosiale kostnader:</h3>
                        <p className='result-value'>
                          {salary.socialCosts?.total
                            ? Number(salary.socialCosts.total).toLocaleString(
                                'no-NO',
                                { maximumFractionDigits: 0 }
                              )
                            : '0'}{' '}
                          NOK
                        </p>
                        <div className='social-costs-list'>
                          <li className='social-costs-item'>
                            Feriepenger (10,2%):
                            <br />
                            {Number(salary.baseSalary).toLocaleString('no-NO', {
                              maximumFractionDigits: 0,
                            })}{' '}
                            NOK x 0,102 ={' '}
                            {salary.socialCosts?.holidayPay
                              ? Number(
                                  salary.socialCosts.holidayPay
                                ).toLocaleString('no-NO', {
                                  maximumFractionDigits: 0,
                                })
                              : '0'}{' '}
                            NOK
                          </li>
                          <li className='social-costs-item'>
                            Arbeidsgiveravgift (14,1%):
                            <br />
                            {Number(salary.baseSalary).toLocaleString('no-NO', {
                              maximumFractionDigits: 0,
                            })}{' '}
                            NOK x 0,141 ={' '}
                            {salary.socialCosts?.employerTax
                              ? Number(
                                  salary.socialCosts.employerTax
                                ).toLocaleString('no-NO', {
                                  maximumFractionDigits: 0,
                                })
                              : '0'}{' '}
                            NOK
                          </li>
                          <li className='social-costs-item'>
                            Pensjon (2%):
                            <br />
                            {Number(salary.baseSalary).toLocaleString('no-NO', {
                              maximumFractionDigits: 0,
                            })}{' '}
                            NOK x 0,02 ={' '}
                            {salary.socialCosts?.pension
                              ? Number(
                                  salary.socialCosts.pension
                                ).toLocaleString('no-NO', {
                                  maximumFractionDigits: 0,
                                })
                              : '0'}{' '}
                            NOK
                          </li>
                        </div>
                        <p className='result-explanation'>
                          (Beregnet basert på grunnlønn for prosjektet)
                        </p>
                      </section>
                      <div className='separator'></div>
                      <section className='result-section total-salary'>
                        <h3 className='result-subtitle'>
                          Total lønn for prosjektet:
                        </h3>
                        <p className='total-salary-value'>
                          {Number(salary.totalSalary).toLocaleString('no-NO', {
                            maximumFractionDigits: 0,
                          })}{' '}
                          NOK
                        </p>
                        <p className='result-explanation'>
                          (Inkluderer grunnlønn for prosjektet og alle sosiale
                          kostnader)
                        </p>
                      </section>
                    </>
                  ) : (
                    <p className='result-explanation'>
                      Vennligst fyll ut alle feltene for å se beregnet lønn.
                    </p>
                  )}
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
    </form>
  );
}
