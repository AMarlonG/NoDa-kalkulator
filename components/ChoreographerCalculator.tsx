'use client';

import { useState, useEffect } from 'react';
import { choreographyProjectSalaryData } from '@/lib/choreographyProjectSalary';
import { choreographyTheaterMusicalSalaryData } from '@/lib/choreographyTheaterMusicalSalary';
import '../app/globals.css';
import '../app/styles/calculator-common.css';

export function ChoreographerCalculator() {
  const [seniority, setSeniority] = useState('');
  const [workType, setWorkType] = useState<'project' | 'theater' | 'selfEmployed' | ''>('');
  const [productionLength, setProductionLength] = useState('');
  const [rehearsalMonths, setRehearsalMonths] = useState('');
  const [projectHours, setProjectHours] = useState('');
  const [salary, setSalary] = useState<{
    minuteRate?: string;
    monthlyRate?: string;
    annualSalary?: string;
    hourlyRate?: string;
    selfEmployedHourlyRate?: string;
    totalHourlyFee?: string;
    productionSalary?: string;
    rehearsalSalary?: string;
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
    setWorkType('');
    setProductionLength('');
    setRehearsalMonths('');
    setProjectHours('');
    setSalary(null);
  };

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
          const baseSalary = productionSalary + rehearsalSalary;

          // Calculate social costs
          const holidayPay = baseSalary * 0.102;
          const employerTax = baseSalary * 0.141;
          const pension = baseSalary * 0.02;
          const socialCostsTotal = holidayPay + employerTax + pension;
          const totalSalary = baseSalary + socialCostsTotal;

          setSalary({
            minuteRate: selectedData['Minuttsats koreografi'],
            monthlyRate: selectedData['Innstudering månedssats'],
            productionSalary: productionSalary.toLocaleString('no-NO', {
              maximumFractionDigits: 0,
            }),
            rehearsalSalary: rehearsalSalary.toLocaleString('no-NO', {
              maximumFractionDigits: 0,
            }),
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
      } else if (workType === 'selfEmployed' && projectHours) {
        const selectedData = choreographyProjectSalaryData.find(
          (item) => item.Ansiennitet === Number(seniority)
        );
        if (selectedData) {
          // Estimate annual salary based on monthly rate × 12
          const monthlyRate = Number(
            selectedData['Innstudering månedssats'].replace(/\s/g, '')
          );
          const estimatedAnnualSalary = monthlyRate * 12;

          // Calculate hourly rate based on 1750 working hours per year
          const hourlyRate = estimatedAnnualSalary / 1750;

          // Calculate self-employed hourly rate with 36.8% additional costs
          const selfEmployedHourlyRate = hourlyRate * 1.368;

          let totalHourlyFee;
          if (projectHours && Number(projectHours) > 0) {
            totalHourlyFee = selfEmployedHourlyRate * Number(projectHours);
          }

          setSalary({
            monthlyRate: selectedData['Innstudering månedssats'],
            hourlyRate: Math.round(hourlyRate).toString(),
            selfEmployedHourlyRate: Math.round(selfEmployedHourlyRate).toString(),
            totalHourlyFee: totalHourlyFee
              ? Math.round(totalHourlyFee).toString()
              : undefined,
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
  }, [seniority, workType, productionLength, rehearsalMonths, projectHours]);

  return (
    <form className="form calculator-content">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Koreograf lønnsberegning</h2>
        </div>
        <div className="card-content">
          <div className="input-group">
            <label htmlFor="seniority" className="label">
              Ansiennitet
            </label>
            <select
              id="seniority"
              className="styled-select"
              value={seniority}
              onChange={(e) => setSeniority(e.target.value)}
            >
              <option value="">Velg ansiennitet</option>
              {choreographyProjectSalaryData.map((item) => (
                <option key={item.Ansiennitet} value={item.Ansiennitet.toString()}>
                  {item.Ansiennitet}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label htmlFor="workType" className="label">
              Arbeidstype
            </label>
            <select
              id="workType"
              className="styled-select"
              value={workType}
              onChange={(e) => {
                setWorkType(e.target.value as 'project' | 'theater' | 'selfEmployed');
                setProductionLength('');
                setRehearsalMonths('');
                setProjectHours('');
              }}
            >
              <option value="">Velg arbeidstype</option>
              <option value="project">Enkeltstående produksjon</option>
              <option value="theater">For teater eller musikal</option>
              <option value="selfEmployed">Selvstendig næringsdrivende</option>
            </select>
          </div>

          {workType === 'project' && (
            <>
              <div className="input-group">
                <label htmlFor="productionLength" className="label">
                  Produksjonslengde (minutter)
                </label>
                <input
                  type="number"
                  id="productionLength"
                  className="input"
                  value={productionLength}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '' || /^[0-9\b]+$/.test(value)) {
                      setProductionLength(value);
                    }
                  }}
                  min="1"
                  placeholder="Antall minutter"
                />
              </div>
              <div className="input-group">
                <label htmlFor="rehearsalMonths" className="label">
                  Innstuderingsmåneder
                </label>
                <input
                  type="number"
                  id="rehearsalMonths"
                  className="input"
                  value={rehearsalMonths}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '' || /^[0-9\b]+$/.test(value)) {
                      setRehearsalMonths(value);
                    }
                  }}
                  min="1"
                  placeholder="Antall måneder"
                />
              </div>
            </>
          )}

          {workType === 'selfEmployed' && (
            <div className="input-group">
              <label htmlFor="projectHours" className="label">
                Antall timer
              </label>
              <input
                type="number"
                id="projectHours"
                className="input"
                value={projectHours}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '' || /^[0-9\b]+$/.test(value)) {
                    setProjectHours(value);
                  }
                }}
                min="1"
                placeholder="Antall timer"
              />
            </div>
          )}
        </div>
      </div>

      <div className="card result-card">
        <div className="card-header">
          <h2 className="card-title">Beregnet lønn</h2>
        </div>
        <div className="separator"></div>
        <div className="card-content result-grid">
          {salary ? (
            <div>
              {workType === 'project' ? (
                <>
                  {salary.totalSalary ? (
                    <>
                      <div className="result-section">
                        <h3 className="result-subtitle">Lønn for koreografi:</h3>
                        <p className="result-value">{salary.productionSalary} NOK</p>
                        <p className="result-explanation">
                          (Minuttsats {salary.minuteRate} NOK x {productionLength} minutter)
                        </p>
                      </div>
                      <div className="result-section">
                        <h3 className="result-subtitle">Lønn for innstudering:</h3>
                        <p className="result-value">{salary.rehearsalSalary} NOK</p>
                        <p className="result-explanation">
                          (Månedssats {salary.monthlyRate} NOK x {rehearsalMonths} måneder)
                        </p>
                      </div>
                      <div className="result-section">
                        <h3 className="result-subtitle">Grunnlønn for produksjonen:</h3>
                        <p className="result-value">
                          {Number(salary.baseSalary).toLocaleString('no-NO', { maximumFractionDigits: 0 })} NOK
                        </p>
                        <p className="result-explanation">(Lønn for koreografi + Lønn for innstudering)</p>
                      </div>
                      <div className="separator"></div>
                      {salary.socialCosts && (
                        <div className="result-section social-costs">
                          <h3 className="result-subtitle">Sosiale kostnader:</h3>
                          <p className="result-value">
                            {Number(salary.socialCosts.total).toLocaleString('no-NO', { maximumFractionDigits: 0 })} NOK
                          </p>
                          <ul className="social-costs-list">
                            <li className="social-costs-item">
                              Feriepenger (10,2%):
                              <br />
                              {Number(salary.baseSalary).toLocaleString('no-NO', { maximumFractionDigits: 0 })} NOK x
                              0,102 ={' '}
                              {Number(salary.socialCosts.holidayPay).toLocaleString('no-NO', {
                                maximumFractionDigits: 0,
                              })}{' '}
                              NOK
                            </li>
                            <li className="social-costs-item">
                              Arbeidsgiveravgift (14,1%):
                              <br />
                              {Number(salary.baseSalary).toLocaleString('no-NO', { maximumFractionDigits: 0 })} NOK x
                              0,141 ={' '}
                              {Number(salary.socialCosts.employerTax).toLocaleString('no-NO', {
                                maximumFractionDigits: 0,
                              })}{' '}
                              NOK
                            </li>
                            <li className="social-costs-item">
                              Pensjon (2%):
                              <br />
                              {Number(salary.baseSalary).toLocaleString('no-NO', { maximumFractionDigits: 0 })} NOK x
                              0,02 ={' '}
                              {Number(salary.socialCosts.pension).toLocaleString('no-NO', { maximumFractionDigits: 0 })}{' '}
                              NOK
                            </li>
                          </ul>
                          <p className="result-explanation">(Beregnet basert på grunnlønn for produksjonen)</p>
                        </div>
                      )}
                      <div className="separator"></div>
                      <div className="result-section total-salary">
                        <h3 className="result-subtitle">Total lønn for produksjonen:</h3>
                        <p className="total-salary-value">
                          {Number(salary.totalSalary).toLocaleString('no-NO', { maximumFractionDigits: 0 })} NOK
                        </p>
                        <p className="result-explanation">
                          (Inkluderer grunnlønn for produksjonen, samt alle sosiale kostnader)
                        </p>
                      </div>
                    </>
                  ) : (
                    <p className="result-explanation">
                      Vennligst fyll ut produksjonslengde og innstuderingsmåneder for å se beregnet lønn.
                    </p>
                  )}
                </>
              ) : workType === 'theater' && salary.annualSalary ? (
                <div className="result-section">
                  <h3 className="result-subtitle">Årslønn:</h3>
                  <p className="result-value">{salary.annualSalary} NOK</p>
                </div>
              ) : workType === 'selfEmployed' && projectHours && salary.selfEmployedHourlyRate ? (
                <>
                  <section className="result-section">
                    <h3 className="result-subtitle">Timesats basert på årslønn:</h3>
                    <p className="result-value">
                      {Number(salary.hourlyRate).toLocaleString('no-NO', { maximumFractionDigits: 0 })} NOK
                    </p>
                    <p className="result-explanation">(Årslønn / 1750 arbeidstimer)</p>
                    <p className="result-explanation mt-2">
                      <strong>Grunnlag for beregning:</strong> Estimert årslønn:{' '}
                      {(Number(salary.monthlyRate.replace(/\s/g, '')) * 12).toLocaleString('no-NO', {
                        maximumFractionDigits: 0,
                      })}{' '}
                      NOK (Månedssats {salary.monthlyRate} NOK × 12)
                    </p>

                    <div className="separator"></div>

                    <h3 className="result-subtitle">Anbefalt timesats med påslag (36,8%):</h3>
                    <p className="result-value">
                      {Number(salary.selfEmployedHourlyRate).toLocaleString('no-NO', { maximumFractionDigits: 0 })} NOK
                    </p>
                    <p className="result-explanation">
                      Påslaget på 36,8% dekker egne kostnader som selvstendig næringsdrivende, fordelt slik:
                    </p>
                    <ul className="result-explanation-list">
                      <li>15,8% - Kompensasjon for arbeidsgiveravgift og tap av rettigheter i folketrygdloven</li>
                      <li>12,0% - Kompensasjon for feriepenger</li>
                      <li>3,6% - Trygdeavgiftsforhøyelse for næringsdrivende</li>
                      <li>0,4% - Frivillig yrkesskadeforsikring</li>
                      <li>5,0% - Administrative kostnader for næringsvirksomhet</li>
                    </ul>

                    <div className="separator"></div>

                    <h3 className="result-subtitle">Total honorar:</h3>
                    <p className="result-value">
                      {Number(salary.totalHourlyFee).toLocaleString('no-NO', { maximumFractionDigits: 0 })} NOK
                    </p>
                    <p className="result-explanation">
                      (Timesats{' '}
                      {Number(salary.selfEmployedHourlyRate).toLocaleString('no-NO', {
                        maximumFractionDigits: 0,
                      })}{' '}
                      NOK × {projectHours} timer)
                    </p>
                  </section>
                </>
              ) : (
                <p className="result-explanation">
                  Vennligst fyll ut alle feltene for å se beregnet lønn.
                </p>
              )}
            </div>
          ) : (
            <p className="result-explanation">
              Vennligst fyll ut alle feltene for å se beregnet lønn.
            </p>
          )}
        </div>
      </div>
      <div className="clear-button-container">
        <button type="button" onClick={resetForm} className="btn btn-primary" aria-label="Nullstill alle verdier">
          Nullstill
        </button>
      </div>
    </form>
  );
}
