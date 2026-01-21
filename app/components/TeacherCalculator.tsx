'use client';

import { useState, useEffect } from 'react';
import { teacherSalaryData } from '@/lib/teacherSalary';
import {
  classLengthCalculationData,
  getMultiplierForClassLength,
} from '@/lib/classLengthCalculation';
import '../styles/base.css';
import '../styles/calculator-common.css';

export function TeacherCalculator() {
  const [role, setRole] = useState<
    'Assistent' | 'Danselærer' | 'Dansepedagog' | ''
  >('');
  const [seniority, setSeniority] = useState('');
  const [classCount, setClassCount] = useState<'single' | 'multiple' | ''>('');
  const [classDuration, setClassDuration] = useState<number | ''>('');
  const [numberOfClasses, setNumberOfClasses] = useState<string>('');
  const [salary, setSalary] = useState<{
    hourlyRate: string;
    classMultiplier: number;
    baseSalaryPerClass: string;
    totalBaseSalary: string;
  } | null>(null);

  // Filter seniority options based on selected role
  const seniorityOptions = role
    ? teacherSalaryData
        .filter((item) => item.Rolle === role)
        .map((item) => item.Ansiennitet)
    : [];

  // Effect to handle single class selection (always 90 minutes)
  useEffect(() => {
    if (classCount === 'single') {
      setClassDuration(90);
      setNumberOfClasses('1');
    } else if (classCount === 'multiple' && classDuration === '') {
      // Reset class duration when switching to multiple classes
      setClassDuration('');
    }
  }, [classCount]);

  // Calculate salary when inputs change
  useEffect(() => {
    if (
      role &&
      seniority &&
      classCount &&
      classDuration &&
      (classCount === 'single' ||
        (classCount === 'multiple' && numberOfClasses))
    ) {
      const selectedData = teacherSalaryData.find(
        (item) => item.Rolle === role && item.Ansiennitet === Number(seniority)
      );

      if (selectedData) {
        const hourlyRate = selectedData.Timelønn;
        const multiplier = getMultiplierForClassLength(Number(classDuration));
        const baseSalaryPerClass = hourlyRate * multiplier;

        // Calculate total base salary for all classes
        const numClasses = Number(numberOfClasses) || 1;
        const totalBaseSalary = baseSalaryPerClass * numClasses;

        setSalary({
          hourlyRate: hourlyRate.toString(),
          classMultiplier: multiplier,
          baseSalaryPerClass: Math.round(baseSalaryPerClass).toString(),
          totalBaseSalary: Math.round(totalBaseSalary).toString(),
        });
      }
    } else {
      setSalary(null);
    }
  }, [role, seniority, classCount, classDuration, numberOfClasses]);

  // Add the resetForm function after the state declarations
  const resetForm = () => {
    setRole('');
    setSeniority('');
    setClassCount('');
    setClassDuration('');
    setNumberOfClasses('');
    setSalary(null);
  };

  // Calculate self-employed rate based on hourly rate
  const getSelfEmployedRates = () => {
    if (!salary) return null;
    const baseRate = Number(salary.hourlyRate);
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
              <label htmlFor='classCount' className='label'>
                Antall klasser
              </label>
              <div className='radio-group'>
                <div className='radio-option'>
                  <input
                    type='radio'
                    id='singleClass'
                    name='classCount'
                    value='single'
                    checked={classCount === 'single'}
                    onChange={() => setClassCount('single')}
                  />
                  <label htmlFor='singleClass'>
                    Én klasse (beregnes alltid som 90 min)
                  </label>
                </div>
                <div className='radio-option'>
                  <input
                    type='radio'
                    id='multipleClasses'
                    name='classCount'
                    value='multiple'
                    checked={classCount === 'multiple'}
                    onChange={() => setClassCount('multiple')}
                  />
                  <label htmlFor='multipleClasses'>Flere klasser</label>
                </div>
              </div>
            </div>
          )}

          {classCount && (
            <div className='input-group'>
              <label htmlFor='classDuration' className='label'>
                Undervisningstid
              </label>
              <select
                id='classDuration'
                className='styled-select'
                value={classDuration}
                onChange={(e) => setClassDuration(Number(e.target.value))}
                disabled={classCount === 'single'}
              >
                <option value=''>Velg undervisningstid</option>
                {classLengthCalculationData.map((item) => (
                  <option
                    key={item['Undervisningstid (min)']}
                    value={item['Undervisningstid (min)']}
                  >
                    {item['Undervisningstid (min)']} minutter (
                    {item['Undervisningstid (timer)']})
                  </option>
                ))}
              </select>
              {classCount === 'single' && (
                <p className='result-explanation'>
                  Én klasse beregnes alltid som 90 minutter uavhengig av faktisk
                  varighet.
                </p>
              )}
            </div>
          )}

          {classCount === 'multiple' && classDuration && (
            <div className='input-group'>
              <label htmlFor='numberOfClasses' className='label'>
                Antall klasser
              </label>
              <input
                type='number'
                id='numberOfClasses'
                className='input'
                value={numberOfClasses}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '' || /^[0-9\b]+$/.test(value)) {
                    setNumberOfClasses(value);
                  }
                }}
                min='1'
                placeholder='Antall klasser'
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
              {/* 1. First show the calculations for the base hourly rate */}
              <section className='result-section'>
                <h3 className='result-subtitle'>Timesats:</h3>
                <p className='result-value'>
                  {Number(salary.hourlyRate).toLocaleString('no-NO', {
                    maximumFractionDigits: 0,
                  })}{' '}
                  NOK
                </p>
                <p className='result-explanation'>
                  Basert på {role} med {seniority} års ansiennitet
                </p>
                <p className='result-explanation'>
                  For {classDuration} minutter:{' '}
                  {Number(salary.hourlyRate).toLocaleString('no-NO', {
                    maximumFractionDigits: 0,
                  })}{' '}
                  NOK × {salary.classMultiplier} ={' '}
                  {Number(salary.baseSalaryPerClass).toLocaleString('no-NO', {
                    maximumFractionDigits: 0,
                  })}{' '}
                  NOK
                </p>
              </section>

              {/* 2. Show total salary for multiple classes */}
              {classCount === 'multiple' && (
                <>
                  <div className='separator'></div>
                  <section className='result-section'>
                    <h3 className='result-subtitle'>Total lønn:</h3>
                    <p className='result-value'>
                      {Number(salary.totalBaseSalary).toLocaleString('no-NO', {
                        maximumFractionDigits: 0,
                      })}{' '}
                      NOK
                    </p>
                    <p className='result-explanation'>
                      {Number(salary.baseSalaryPerClass).toLocaleString(
                        'no-NO',
                        { maximumFractionDigits: 0 }
                      )}{' '}
                      NOK × {numberOfClasses} klasser ={' '}
                      {Number(salary.totalBaseSalary).toLocaleString('no-NO', {
                        maximumFractionDigits: 0,
                      })}{' '}
                      NOK
                    </p>
                  </section>
                </>
              )}

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
