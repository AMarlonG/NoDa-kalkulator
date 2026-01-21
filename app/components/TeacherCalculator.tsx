'use client';

import { useState, useEffect } from 'react';
import { teacherSalaryData } from '@/lib/teacherSalary';

export function TeacherCalculator() {
  const [role, setRole] = useState<
    'Assistent' | 'Danselærer' | 'Dansepedagog' | ''
  >('');
  const [seniority, setSeniority] = useState('');
  const [weeklyHours, setWeeklyHours] = useState<string>('');
  const [numberOfWeeks, setNumberOfWeeks] = useState<string>('');
  const [salary, setSalary] = useState<{
    hourlyRate: number;
    weeklySalary: number;
    totalSalary: number;
  } | null>(null);

  // Filter seniority options based on selected role
  const seniorityOptions = role
    ? teacherSalaryData
        .filter((item) => item.Rolle === role)
        .map((item) => item.Ansiennitet)
    : [];

  // Calculate salary when inputs change
  useEffect(() => {
    if (role && seniority && weeklyHours && numberOfWeeks) {
      const selectedData = teacherSalaryData.find(
        (item) => item.Rolle === role && item.Ansiennitet === Number(seniority)
      );

      if (selectedData) {
        const hourlyRate = selectedData.Timelønn;
        const hours = parseFloat(weeklyHours);
        const weeks = parseFloat(numberOfWeeks);
        const weeklySalary = hourlyRate * hours;
        const totalSalary = weeklySalary * weeks;

        setSalary({ hourlyRate, weeklySalary, totalSalary });
      }
    } else {
      setSalary(null);
    }
  }, [role, seniority, weeklyHours, numberOfWeeks]);

  // Add the resetForm function after the state declarations
  const resetForm = () => {
    setRole('');
    setSeniority('');
    setWeeklyHours('');
    setNumberOfWeeks('');
    setSalary(null);
  };

  // Calculate self-employed rate based on hourly rate
  const getSelfEmployedRates = () => {
    if (!salary) return null;
    const baseRate = salary.hourlyRate;
    const markup = baseRate * 0.368;
    const totalRate = baseRate + markup;
    return {
      baseRate: Math.round(baseRate),
      markup: Math.round(markup),
      totalRate: Math.round(totalRate),
    };
  };

  return (
    <form className='form calculator-content'>
      <div className='calculator-intro'>
        <p className='calculator-intro-text'>
          Denne beregningen gjelder for pedagoger som ikke har en fast ansettelse ved skolene, men ansettes i midlertidig stilling.
        </p>
        <p className='calculator-intro-text'>
          Møter og forestillinger er ikke inkludert i denne utregningen. Les arbeidsavtalen din om hvordan arbeid utover selve undervisningen lønnes.
        </p>
        <ul className='calculator-intro-list'>
          <li>
            Har du relevant Bachelor (BA) starter du minimum på Danselærer, 2 år
          </li>
          <li>
            Har du relevant 3-årig BA med pedagogikk starter du minimum på
            Dansepedagog, 0 år
          </li>
          <li>
            Har du relevant 4-årig BA inkludert pedagogikk, eller BA + 1 år PPU,
            starter du minimum på Dansepedagog, 2 år
          </li>
        </ul>
        <p className='calculator-intro-text'>
          <strong>Slik beregner du ukentlige timer:</strong>
        </p>
        <ul className='calculator-intro-list'>
          <li>Alle klasser under 60 minutter telles som 1 hel time</li>
          <li>Underviser du kun 1 klokketime i uka, skriv inn 1,5 timer</li>
          <li>For deltimer: 15 min = 0,25 / 30 min = 0,5 / 45 min = 0,75</li>
        </ul>
      </div>

      <div className='card'>
        <div className='card-header'>
          <h2 className='card-title'>Pedagog lønnsberegning</h2>
        </div>
        <div className='card-content'>
          <div className='input-group'>
            <label htmlFor='role' className='label'>
              Rolle
            </label>
            <select
              id='role'
              className='styled-select'
              value={role}
              onChange={(e) => {
                setRole(
                  e.target.value as 'Assistent' | 'Danselærer' | 'Dansepedagog'
                );
                setSeniority('');
                setSalary(null);
              }}
            >
              <option value=''>Velg rolle</option>
              <option value='Assistent'>Assistent</option>
              <option value='Danselærer'>Danselærer</option>
              <option value='Dansepedagog'>Dansepedagog</option>
            </select>
          </div>

          {role && (
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
                {seniorityOptions.map((ansiennitet) => (
                  <option key={ansiennitet} value={ansiennitet}>
                    {ansiennitet}
                  </option>
                ))}
              </select>
            </div>
          )}

          {seniority && (
            <div className='input-group'>
              <label htmlFor='weeklyHours' className='label'>
                Totalt antall klokketimer per uke
              </label>
              <input
                type='number'
                id='weeklyHours'
                className='input'
                value={weeklyHours}
                onChange={(e) => setWeeklyHours(e.target.value)}
                min='0.25'
                step='0.25'
                placeholder='F.eks. 1.5, 2.25, 3'
              />
            </div>
          )}

          {weeklyHours && (
            <div className='input-group'>
              <label htmlFor='numberOfWeeks' className='label'>
                Antall uker i ansettelsen
              </label>
              <input
                type='number'
                id='numberOfWeeks'
                className='input'
                value={numberOfWeeks}
                onChange={(e) => setNumberOfWeeks(e.target.value)}
                min='1'
                placeholder='Antall uker'
              />
            </div>
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
              {/* 1. Hourly rate */}
              <section className='result-section'>
                <h3 className='result-subtitle'>Timesats:</h3>
                <p className='result-value'>
                  {salary.hourlyRate.toLocaleString('no-NO', {
                    maximumFractionDigits: 0,
                  })}{' '}
                  NOK
                </p>
                <p className='result-explanation'>
                  Basert på {role} med {seniority} års ansiennitet
                </p>
              </section>

              <div className='separator'></div>

              {/* 2. Weekly salary */}
              <section className='result-section'>
                <h3 className='result-subtitle'>Lønn per uke:</h3>
                <p className='result-value'>
                  {Math.round(salary.weeklySalary).toLocaleString('no-NO', {
                    maximumFractionDigits: 0,
                  })}{' '}
                  NOK
                </p>
                <p className='result-explanation'>
                  {salary.hourlyRate.toLocaleString('no-NO', {
                    maximumFractionDigits: 0,
                  })}{' '}
                  NOK × {weeklyHours} timer ={' '}
                  {Math.round(salary.weeklySalary).toLocaleString('no-NO', {
                    maximumFractionDigits: 0,
                  })}{' '}
                  NOK
                </p>
              </section>

              <div className='separator'></div>

              {/* 3. Total salary for period */}
              <section className='result-section'>
                <h3 className='result-subtitle'>Total lønn for perioden:</h3>
                <p className='result-value'>
                  {Math.round(salary.totalSalary).toLocaleString('no-NO', {
                    maximumFractionDigits: 0,
                  })}{' '}
                  NOK
                </p>
                <p className='result-explanation'>
                  {Math.round(salary.weeklySalary).toLocaleString('no-NO', {
                    maximumFractionDigits: 0,
                  })}{' '}
                  NOK × {numberOfWeeks} uker ={' '}
                  {Math.round(salary.totalSalary).toLocaleString('no-NO', {
                    maximumFractionDigits: 0,
                  })}{' '}
                  NOK
                </p>
              </section>

              {/* Self-employed popover button */}
              <div className='popover-trigger-container'>
                <button
                  type='button'
                  className='btn btn-secondary'
                  popoverTarget='selvstendig-info-teacher'
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

      {/* Self-employed popover */}
      <div id='selvstendig-info-teacher' popover='auto' className='popover'>
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
                  <span>
                    {getSelfEmployedRates()?.baseRate.toLocaleString('no-NO')}{' '}
                    NOK
                  </span>
                </div>
                <div className='rate-row'>
                  <span>+ 36,8% påslag:</span>
                  <span>
                    {getSelfEmployedRates()?.markup.toLocaleString('no-NO')} NOK
                  </span>
                </div>
                <div className='rate-row rate-total'>
                  <span>Timesats med påslag:</span>
                  <span>
                    {getSelfEmployedRates()?.totalRate.toLocaleString('no-NO')}{' '}
                    NOK
                  </span>
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
            popoverTarget='selvstendig-info-teacher'
            popoverTargetAction='hide'
          >
            Lukk
          </button>
        </div>
      </div>
    </form>
  );
}
