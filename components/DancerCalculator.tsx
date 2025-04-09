'use client';

import { useState, useEffect, useCallback } from 'react';
import { dancersSalaryData } from '@/lib/dancersSalary';
import '../app/globals.css';
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
  } | null>(null);

  const resetForm = () => {
    setSeniority('');
    setEmploymentType('');
    setProjectDays('');
    setProjectHours('');
    setSalary(null);
  };

  useEffect(() => {
    if (seniority && employmentType) {
      const selectedData = dancersSalaryData.find(
        (item) => item.Ansiennitet === Number(seniority)
      );
      if (selectedData) {
        if (employmentType === 'project' && projectDays) {
          const dailyRate = Number(selectedData['Dagssats'].replace(/\s/g, ''));
          const projectSalary = dailyRate * Number(projectDays);
          setSalary({
            dailyRate: selectedData['Dagssats'],
            projectSalary: projectSalary.toLocaleString('no-NO', {
              maximumFractionDigits: 0,
            }),
          });
        } else if (employmentType === 'selfEmployed' && projectHours) {
          const hourlyRate = Number(selectedData['Timesats'].replace(/\s/g, ''));
          const selfEmployedHourlyRate = hourlyRate * 1.368; // 36.8% additional costs
          const totalHourlyFee = selfEmployedHourlyRate * Number(projectHours);
          setSalary({
            hourlyRate: selectedData['Timesats'],
            selfEmployedHourlyRate: Math.round(selfEmployedHourlyRate).toString(),
            totalHourlyFee: Math.round(totalHourlyFee).toString(),
          });
        } else {
          setSalary({
            annualSalary: selectedData.Lønn,
          });
        }
      } else {
        setSalary(null);
      }
    } else {
      setSalary(null);
    }
  }, [seniority, employmentType, projectDays, projectHours]);

  return (
    <form className="form calculator-content">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Danser lønnsberegning</h2>
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
              {dancersSalaryData.map((item) => (
                <option key={item.Ansiennitet} value={item.Ansiennitet.toString()}>
                  {item.Ansiennitet}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label htmlFor="employmentType" className="label">
              Ansettelsesform
            </label>
            <select
              id="employmentType"
              className="styled-select"
              value={employmentType}
              onChange={(e) => {
                setEmploymentType(e.target.value);
                setProjectDays('');
                setProjectHours('');
              }}
            >
              <option value="">Velg ansettelsesform</option>
              <option value="project">Enkeltstående produksjon</option>
              <option value="selfEmployed">Selvstendig næringsdrivende</option>
              <option value="permanent">Fast ansettelse</option>
            </select>
          </div>

          {employmentType === 'project' && (
            <div className="input-group">
              <label htmlFor="projectDays" className="label">
                Antall dager
              </label>
              <input
                type="number"
                id="projectDays"
                className="input"
                value={projectDays}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '' || /^[0-9\b]+$/.test(value)) {
                    setProjectDays(value);
                  }
                }}
                min="1"
                placeholder="Antall dager"
              />
            </div>
          )}

          {employmentType === 'selfEmployed' && (
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
              {employmentType === 'project' && salary.projectSalary ? (
                <div className="result-section">
                  <h3 className="result-subtitle">Lønn for produksjonen:</h3>
                  <p className="result-value">{salary.projectSalary} NOK</p>
                  <p className="result-explanation">
                    (Dagssats {salary.dailyRate} NOK x {projectDays} dager)
                  </p>
                </div>
              ) : employmentType === 'selfEmployed' && salary.selfEmployedHourlyRate ? (
                <>
                  <div className="result-section">
                    <h3 className="result-subtitle">Timesats:</h3>
                    <p className="result-value">{salary.hourlyRate} NOK</p>
                  </div>
                  <div className="result-section">
                    <h3 className="result-subtitle">Anbefalt timesats med påslag (36,8%):</h3>
                    <p className="result-value">{salary.selfEmployedHourlyRate} NOK</p>
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
                  </div>
                  <div className="result-section">
                    <h3 className="result-subtitle">Total honorar:</h3>
                    <p className="result-value">{salary.totalHourlyFee} NOK</p>
                    <p className="result-explanation">
                      (Timesats {salary.selfEmployedHourlyRate} NOK x {projectHours} timer)
                    </p>
                  </div>
                </>
              ) : (
                <div className="result-section">
                  <h3 className="result-subtitle">Årslønn:</h3>
                  <p className="result-value">{salary.annualSalary} NOK</p>
                </div>
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
