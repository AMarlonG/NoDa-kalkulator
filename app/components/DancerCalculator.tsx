'use client';

import { useState, useEffect, useCallback } from 'react';
import { dancersSalaryData } from '@/lib/dancersSalary';
import '../styles/base.css';
import '../styles/calculator-common.css';

export function DancerCalculator() {
  const [seniority, setSeniority] = useState('');
  const [employmentType, setEmploymentType] = useState('');
  const [projectDays, setProjectDays] = useState('');
  const [salary, setSalary] = useState<{
    annualSalary: string;
    dailyRate?: string;
    projectSalary?: string;
  } | null>(null);

  const resetForm = () => {
    setSeniority('');
    setEmploymentType('');
    setProjectDays('');
    setSalary(null);
  };

  // Calculate self-employed rate based on annual salary
  const getSelfEmployedRates = () => {
    if (!salary) return null;
    const annualSalary = Number(salary.annualSalary.replace(/\s/g, ''));
    const baseHourlyRate = annualSalary / 1750;
    const markup = baseHourlyRate * 0.368;
    const totalRate = baseHourlyRate + markup;
    return {
      baseRate: Math.round(baseHourlyRate),
      markup: Math.round(markup),
      totalRate: Math.round(totalRate),
    };
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
        } else if (employmentType === 'project' && projectDays) {
          const annualSalary = Number(
            selectedData['Årslønn prosjekt'].replace(/\s/g, '')
          );
          const dailyRate = annualSalary / 229;
          const projectSalary = dailyRate * Number(projectDays);

          setSalary({
            annualSalary: selectedData['Årslønn prosjekt'],
            dailyRate: Math.round(dailyRate).toString(),
            projectSalary: Math.round(projectSalary).toString(),
          });
        } else {
          setSalary(null);
        }
      }
    } else {
      setSalary(null);
    }
  }, [seniority, employmentType, projectDays]);

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
              }}
            >
              <option value=''>Velg ansettelsestype</option>
              <option value='permanent'>Fast ansettelse</option>
              <option value='project'>Midlertidig ansettelse</option>
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
                          Lønn for prosjektet:
                        </h3>
                        <p className='result-value'>
                          {Number(salary.projectSalary).toLocaleString('no-NO', {
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

      {/* Self-employed popover */}
      <div id='selvstendig-info-dancer' popover='auto' className='popover'>
        <div className='popover-content'>
          <h3 className='popover-title'>
            Er dette et oppdrag eller en ansettelse?
          </h3>

          <p className='popover-text'>
            Jobb som danser, koreograf eller pedagog er i de fleste tilfeller å
            anse som et arbeidsforhold i følge Arbeidsmiljøloven §1.8.
          </p>

          <p className='popover-text'>
            Dersom arbeidet ikke treffer spesifiseringen i denne paragrafen kan
            du ta jobben som et oppdrag. Vi anbefaler da at du legger på 36,8%
            for å dekke dine kostnader med å drive eget firma og besørge egne
            sosiale kostnader.
          </p>

          {salary && getSelfEmployedRates() && (
            <>
              <h4 className='popover-subtitle'>
                Din timesats som selvstendig næringsdrivende:
              </h4>
              <div className='popover-rate-breakdown'>
                <div className='rate-row'>
                  <span>Timesats (grunnlag):</span>
                  <span>{getSelfEmployedRates()?.baseRate.toLocaleString('no-NO')} NOK</span>
                </div>
                <div className='rate-row'>
                  <span>+ 36,8% påslag:</span>
                  <span>{getSelfEmployedRates()?.markup.toLocaleString('no-NO')} NOK</span>
                </div>
                <div className='rate-row rate-total'>
                  <span>Timesats med påslag:</span>
                  <span>{getSelfEmployedRates()?.totalRate.toLocaleString('no-NO')} NOK</span>
                </div>
              </div>
            </>
          )}

          <h4 className='popover-subtitle'>Påslaget dekker:</h4>
          <ul className='popover-list'>
            <li>15,8% - Arbeidsgiveravgift og tap av rettigheter</li>
            <li>12,0% - Feriepenger</li>
            <li>3,6% - Trygdeavgiftsforhøyelse</li>
            <li>0,4% - Frivillig yrkesskadeforsikring</li>
            <li>5,0% - Administrative kostnader</li>
          </ul>

          <button
            type='button'
            className='btn btn-primary popover-close'
            popoverTarget='selvstendig-info-dancer'
            popoverTargetAction='hide'
          >
            Lukk
          </button>
        </div>
      </div>
    </form>
  );
}
