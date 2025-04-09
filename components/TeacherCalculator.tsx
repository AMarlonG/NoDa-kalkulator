'use client';

import { useState, useEffect } from 'react';
import { teacherSalaryData } from '@/lib/teacherSalary';
import {
  classLengthCalculationData,
  getMultiplierForClassLength,
} from '@/lib/classLengthCalculation';
import '../app/globals.css';
import '../app/styles/calculator-common.css';

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
    selfEmployedHourlyRate: string;
    selfEmployedRatePerClass: string;
    totalSelfEmployedFee: string;
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

        // Calculate self-employed hourly rate with 36.8% additional costs
        const selfEmployedHourlyRate = hourlyRate * 1.368;
        const selfEmployedRatePerClass = selfEmployedHourlyRate * multiplier;
        const totalSelfEmployedFee = selfEmployedRatePerClass * numClasses;

        setSalary({
          hourlyRate: hourlyRate.toString(),
          selfEmployedHourlyRate: Math.round(selfEmployedHourlyRate).toString(),
          classMultiplier: multiplier,
          baseSalaryPerClass: Math.round(baseSalaryPerClass).toString(),
          totalBaseSalary: Math.round(totalBaseSalary).toString(),
          selfEmployedRatePerClass: Math.round(
            selfEmployedRatePerClass
          ).toString(),
          totalSelfEmployedFee: Math.round(totalSelfEmployedFee).toString(),
        });
      }
    } else {
      setSalary(null);
    }
  }, [role, seniority, classCount, classDuration, numberOfClasses]);

  const resetForm = () => {
    setRole('');
    setSeniority('');
    setClassCount('');
    setClassDuration('');
    setNumberOfClasses('');
    setSalary(null);
  };

  return (
    <form className='form calculator-content'>
      <div className='calculator-intro'>
        <p className='calculator-intro-text'>
          Denne utregningen gjelder for selvstendig næringsdrivende i private
          danseskoler
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
          <h2 className='card-title'>Danselærer lønnsberegning</h2>
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
              }}
            >
              <option value=''>Velg rolle</option>
              <option value='Assistent'>Assistent</option>
              <option value='Danselærer'>Danselærer</option>
              <option value='Dansepedagog'>Dansepedagog</option>
            </select>
          </div>

          <div className='input-group'>
            <label htmlFor='seniority' className='label'>
              Ansiennitet
            </label>
            <select
              id='seniority'
              className='styled-select'
              value={seniority}
              onChange={(e) => setSeniority(e.target.value)}
              disabled={!role}
            >
              <option value=''>Velg ansiennitet</option>
              {seniorityOptions.map((years) => (
                <option key={years} value={years}>
                  {years}
                </option>
              ))}
            </select>
          </div>

          <div className='input-group'>
            <label htmlFor='classCount' className='label'>
              Antall klasser
            </label>
            <select
              id='classCount'
              className='styled-select'
              value={classCount}
              onChange={(e) =>
                setClassCount(e.target.value as 'single' | 'multiple')
              }
              disabled={!seniority}
            >
              <option value=''>Velg antall klasser</option>
              <option value='single'>Enkelttime (90 min)</option>
              <option value='multiple'>Flere timer</option>
            </select>
          </div>

          {classCount === 'multiple' && (
            <>
              <div className='input-group'>
                <label htmlFor='classDuration' className='label'>
                  Lengde per klasse (minutter)
                </label>
                <select
                  id='classDuration'
                  className='styled-select'
                  value={classDuration}
                  onChange={(e) => setClassDuration(Number(e.target.value))}
                >
                  <option value=''>Velg lengde</option>
                  {classLengthCalculationData.map((item) => (
                    <option key={item.minutes} value={item.minutes}>
                      {item.minutes} minutter
                    </option>
                  ))}
                </select>
              </div>

              <div className='input-group'>
                <label htmlFor='numberOfClasses' className='label'>
                  Antall timer
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
                  placeholder='Antall timer'
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
              <div className='result-section'>
                <h3 className='result-subtitle'>Grunnlønn per time:</h3>
                <p className='result-value'>{salary.hourlyRate} NOK</p>
              </div>

              <div className='result-section'>
                <h3 className='result-subtitle'>Lengdemultiplikator:</h3>
                <p className='result-value'>x{salary.classMultiplier}</p>
                <p className='result-explanation'>
                  (Basert på {classDuration} minutters varighet)
                </p>
              </div>

              <div className='result-section'>
                <h3 className='result-subtitle'>Grunnlønn per klasse:</h3>
                <p className='result-value'>{salary.baseSalaryPerClass} NOK</p>
                <p className='result-explanation'>
                  (Timelønn {salary.hourlyRate} NOK × lengdemultiplikator{' '}
                  {salary.classMultiplier})
                </p>
              </div>

              {classCount === 'multiple' && (
                <div className='result-section'>
                  <h3 className='result-subtitle'>Total grunnlønn:</h3>
                  <p className='result-value'>{salary.totalBaseSalary} NOK</p>
                  <p className='result-explanation'>
                    (Grunnlønn per klasse {salary.baseSalaryPerClass} NOK ×{' '}
                    {numberOfClasses} timer)
                  </p>
                </div>
              )}

              <div className='separator'></div>

              <div className='result-section'>
                <h3 className='result-subtitle'>
                  Anbefalt timesats med påslag (36,8%):
                </h3>
                <p className='result-value'>
                  {salary.selfEmployedHourlyRate} NOK
                </p>
                <p className='result-explanation'>
                  Påslaget på 36,8% dekker egne kostnader som selvstendig
                  næringsdrivende, fordelt slik:
                </p>
                <ul className='result-explanation-list'>
                  <li>
                    15,8% - Kompensasjon for arbeidsgiveravgift og tap av
                    rettigheter i folketrygdloven
                  </li>
                  <li>12,0% - Kompensasjon for feriepenger</li>
                  <li>3,6% - Trygdeavgiftsforhøyelse for næringsdrivende</li>
                  <li>0,4% - Frivillig yrkesskadeforsikring</li>
                  <li>5,0% - Administrative kostnader for næringsvirksomhet</li>
                </ul>
              </div>

              <div className='result-section'>
                <h3 className='result-subtitle'>
                  Anbefalt honorar per klasse:
                </h3>
                <p className='result-value'>
                  {salary.selfEmployedRatePerClass} NOK
                </p>
                <p className='result-explanation'>
                  (Timesats med påslag {salary.selfEmployedHourlyRate} NOK ×
                  lengdemultiplikator {salary.classMultiplier})
                </p>
              </div>

              {classCount === 'multiple' && (
                <div className='result-section'>
                  <h3 className='result-subtitle'>Totalt anbefalt honorar:</h3>
                  <p className='result-value'>
                    {salary.totalSelfEmployedFee} NOK
                  </p>
                  <p className='result-explanation'>
                    (Honorar per klasse {salary.selfEmployedRatePerClass} NOK ×{' '}
                    {numberOfClasses} timer)
                  </p>
                </div>
              )}
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
    </form>
  );
}
