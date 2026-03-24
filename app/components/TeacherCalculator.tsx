'use client';

import { useState, useEffect, useMemo } from 'react';
import { teacherSalaryData } from '@/lib/teacherSalary';
import { calculateSelfEmployedRatesFromHourly } from '@/lib/selfEmployedRates';
import { formatNumber } from '@/lib/formatting';
import { SelfEmployedPopover } from './SelfEmployedPopover';

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

  // Calculate self-employed rates using shared utility
  const selfEmployedRates = useMemo(() => {
    if (!salary) return null;
    return calculateSelfEmployedRatesFromHourly(salary.hourlyRate);
  }, [salary]);

  return (
    <form className='form calculator-content'>
      <div className='calculator-intro'>
        <p className='calculator-intro-text'>
          Denne beregningen gjelder for pedagoger som ikke har en fast ansettelse ved skolene, men ansettes i midlertidig stilling.
        </p>
        <p className='calculator-intro-text'>
          Møter og forestillinger er ikke inkludert i denne utregningen. Les arbeidsavtalen din om hvordan arbeid utover selve undervisningen lønnes.
        </p>
        <details className='calculator-intro-disclosure'>
          <summary className='calculator-intro-summary'>
            Finn din ansiennitet og lønnsplassering
          </summary>
          <div className='calculator-intro-panel'>
            <p className='calculator-intro-text'>
              Ved innplassering beregnes ansiennitet ut fra tidligere
              arbeidserfaring i pedagogisk, skapende og utøvende arbeid.
            </p>
            <ul className='calculator-intro-list'>
              <li>
                Ved fullført godkjent høyere utdannelse (BA eller tilsvarende)
                innplasseres du minimum som Danselærer med 2 års ansiennitet.
              </li>
              <li>
                Har du relevant 3-årig BA med pedagogikk, innplasseres du
                minimum som Dansepedagog med 0 års ansiennitet.
              </li>
              <li>
                Har du relevant 4-årig BA inkludert pedagogikk, eller BA + 1 år
                PPU, innplasseres du minimum som Dansepedagog med 2 års
                ansiennitet.
              </li>
              <li>
                Ved mastergrad eller PhD gis ytterligere 2 års ansiennitet per
                grad.
              </li>
            </ul>
            <p className='calculator-intro-text'>
              Pedagogisk erfaring beregnes slik: Minimum 8 klasser à 60
              minutter i 28 uker per år gir 1 års ansiennitet.
            </p>
            <p className='calculator-intro-text'>
              Annen erfaring som danser eller koreograf i profesjonell
              sammenheng skal tillegges betydelig vekt, men samlet
              ansiennitet kan ikke økes med mer enn ett år for ett år.
            </p>
            <p className='calculator-intro-text'>
              For mer informasjon, se{' '}
              <a
                className='calculator-intro-link'
                href='https://norskedansekunstnere.no/lonn-og-arbeidsliv/for-pedagoger'
                target='_blank'
                rel='noopener noreferrer'
              >
                Norske Dansekunstneres side for pedagoger
              </a>
              .
            </p>
          </div>
        </details>
        <details className='calculator-intro-disclosure'>
          <summary className='calculator-intro-summary'>
            Slik beregner du ukentlige timer
          </summary>
          <div className='calculator-intro-panel'>
            <ul className='calculator-intro-list'>
              <li>Alle klasser under 60 minutter telles som 1 hel time</li>
              <li>Underviser du kun 1 klokketime i uka, skriv inn 1,5 timer</li>
              <li>For deltimer: 15 min = 0,25 / 30 min = 0,5 / 45 min = 0,75</li>
            </ul>
          </div>
        </details>
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
                  {formatNumber(salary.hourlyRate)} NOK
                </p>
                <p className='result-breakdown'>
                  {role} med {seniority} års ansiennitet
                </p>
              </section>

              {/* 2. Weekly salary */}
              <section className='result-section'>
                <h3 className='result-subtitle'>Lønn per uke:</h3>
                <p className='result-value'>
                  {formatNumber(salary.weeklySalary)} NOK
                </p>
                <p className='result-breakdown'>
                  {formatNumber(salary.hourlyRate)} NOK × {weeklyHours} timer
                </p>
              </section>

              {/* 3. Total salary for period */}
              <section className='result-section'>
                <h3 className='result-subtitle'>Total lønn for perioden:</h3>
                <p className='total-salary-value'>
                  {formatNumber(salary.totalSalary)} NOK
                </p>
                <p className='result-breakdown'>
                  {formatNumber(salary.weeklySalary)} NOK × {numberOfWeeks} uker
                </p>
              </section>

              {/* Self-employed popover button */}
              <div className='popover-trigger-container'>
                <button
                  type='button'
                  className='btn btn-secondary'
                  popoverTarget='selvstendig-info-teacher'
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

      <SelfEmployedPopover id='selvstendig-info-teacher' rates={selfEmployedRates} />
    </form>
  );
}
