"use client"

import { useState, useEffect } from "react"
import { teacherSalaryData } from "@/lib/teacherSalary"
import { classLengthCalculationData, getMultiplierForClassLength } from "@/lib/classLengthCalculation"
import "../app/styles/base.css"
import "../app/styles/calculator-common.css"

export function TeacherCalculator() {
  const [role, setRole] = useState<"Assistent" | "Danselærer" | "Dansepedagog" | "">("")
  const [seniority, setSeniority] = useState("")
  const [classCount, setClassCount] = useState<"single" | "multiple" | "">("")
  const [classDuration, setClassDuration] = useState<number | "">("")
  const [numberOfClasses, setNumberOfClasses] = useState<string>("")
  const [salary, setSalary] = useState<{
    hourlyRate: string
    classMultiplier: number
    baseSalaryPerClass: string
    totalBaseSalary: string
    selfEmployedHourlyRate: string
    selfEmployedRatePerClass: string
    totalSelfEmployedFee: string
  } | null>(null)

  // Filter seniority options based on selected role
  const seniorityOptions = role
    ? teacherSalaryData.filter((item) => item.Rolle === role).map((item) => item.Ansiennitet)
    : []

  // Effect to handle single class selection (always 90 minutes)
  useEffect(() => {
    if (classCount === "single") {
      setClassDuration(90)
      setNumberOfClasses("1")
    } else if (classCount === "multiple" && classDuration === "") {
      // Reset class duration when switching to multiple classes
      setClassDuration("")
    }
  }, [classCount])

  // Calculate salary when inputs change
  useEffect(() => {
    if (
      role &&
      seniority &&
      classCount &&
      classDuration &&
      (classCount === "single" || (classCount === "multiple" && numberOfClasses))
    ) {
      const selectedData = teacherSalaryData.find(
        (item) => item.Rolle === role && item.Ansiennitet === Number(seniority),
      )

      if (selectedData) {
        const hourlyRate = selectedData.Timelønn
        const multiplier = getMultiplierForClassLength(Number(classDuration))
        const baseSalaryPerClass = hourlyRate * multiplier

        // Calculate total base salary for all classes
        const numClasses = Number(numberOfClasses) || 1
        const totalBaseSalary = baseSalaryPerClass * numClasses

        // Calculate self-employed hourly rate with 36.8% additional costs
        const selfEmployedHourlyRate = hourlyRate * 1.368
        const selfEmployedRatePerClass = selfEmployedHourlyRate * multiplier
        const totalSelfEmployedFee = selfEmployedRatePerClass * numClasses

        setSalary({
          hourlyRate: hourlyRate.toString(),
          selfEmployedHourlyRate: Math.round(selfEmployedHourlyRate).toString(),
          classMultiplier: multiplier,
          baseSalaryPerClass: Math.round(baseSalaryPerClass).toString(),
          totalBaseSalary: Math.round(totalBaseSalary).toString(),
          selfEmployedRatePerClass: Math.round(selfEmployedRatePerClass).toString(),
          totalSelfEmployedFee: Math.round(totalSelfEmployedFee).toString(),
        })
      }
    } else {
      setSalary(null)
    }
  }, [role, seniority, classCount, classDuration, numberOfClasses])

  // Add the resetForm function after the state declarations
  const resetForm = () => {
    setRole("")
    setSeniority("")
    setClassCount("")
    setClassDuration("")
    setNumberOfClasses("")
    setSalary(null)
  }

  return (
    <form className="form calculator-content">
      <div className="calculator-intro">
        <p className="calculator-intro-text">
          Denne utregningen gjelder for selvstendig næringsdrivende i private danseskoler
        </p>
        <ul className="calculator-intro-list">
          <li>Har du relevant Bachelor (BA) starter du minimum på Danselærer, 2 år</li>
          <li>Har du relevant 3-årig BA med pedagogikk starter du minimum på Dansepedagog, 0 år</li>
          <li>
            Har du relevant 4-årig BA inkludert pedagogikk, eller BA + 1 år PPU, starter du minimum på Dansepedagog, 2
            år
          </li>
        </ul>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Pedagog lønnsberegning</h2>
        </div>
        <div className="card-content">
          <div className="input-group">
            <label htmlFor="role" className="label">
              Rolle
            </label>
            <select
              id="role"
              className="styled-select"
              value={role}
              onChange={(e) => {
                setRole(e.target.value as "Assistent" | "Danselærer" | "Dansepedagog")
                setSeniority("")
                setSalary(null)
              }}
            >
              <option value="">Velg rolle</option>
              <option value="Assistent">Assistent</option>
              <option value="Danselærer">Danselærer</option>
              <option value="Dansepedagog">Dansepedagog</option>
            </select>
          </div>

          {role && (
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
                {seniorityOptions.map((ansiennitet) => (
                  <option key={ansiennitet} value={ansiennitet}>
                    {ansiennitet}
                  </option>
                ))}
              </select>
            </div>
          )}

          {seniority && (
            <div className="input-group">
              <label htmlFor="classCount" className="label">
                Antall klasser
              </label>
              <div className="radio-group">
                <div className="radio-option">
                  <input
                    type="radio"
                    id="singleClass"
                    name="classCount"
                    value="single"
                    checked={classCount === "single"}
                    onChange={() => setClassCount("single")}
                  />
                  <label htmlFor="singleClass">Én klasse (beregnes alltid som 90 min)</label>
                </div>
                <div className="radio-option">
                  <input
                    type="radio"
                    id="multipleClasses"
                    name="classCount"
                    value="multiple"
                    checked={classCount === "multiple"}
                    onChange={() => setClassCount("multiple")}
                  />
                  <label htmlFor="multipleClasses">Flere klasser</label>
                </div>
              </div>
            </div>
          )}

          {classCount && (
            <div className="input-group">
              <label htmlFor="classDuration" className="label">
                Undervisningstid
              </label>
              <select
                id="classDuration"
                className="styled-select"
                value={classDuration}
                onChange={(e) => setClassDuration(Number(e.target.value))}
                disabled={classCount === "single"}
              >
                <option value="">Velg undervisningstid</option>
                {classLengthCalculationData.map((item) => (
                  <option key={item["Undervisningstid (min)"]} value={item["Undervisningstid (min)"]}>
                    {item["Undervisningstid (min)"]} minutter ({item["Undervisningstid (timer)"]})
                  </option>
                ))}
              </select>
              {classCount === "single" && (
                <p className="result-explanation">
                  Én klasse beregnes alltid som 90 minutter uavhengig av faktisk varighet.
                </p>
              )}
            </div>
          )}

          {classCount === "multiple" && classDuration && (
            <div className="input-group">
              <label htmlFor="numberOfClasses" className="label">
                Antall klasser
              </label>
              <input
                type="number"
                id="numberOfClasses"
                className="input"
                value={numberOfClasses}
                onChange={(e) => {
                  const value = e.target.value
                  if (value === "" || /^[0-9\b]+$/.test(value)) {
                    setNumberOfClasses(value)
                  }
                }}
                min="1"
                placeholder="Antall klasser"
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
              {/* 1. First show the calculations for the base hourly rate */}
              <section className="result-section">
                <h3 className="result-subtitle">Timesats:</h3>
                <p className="result-value">
                  {Number(salary.hourlyRate).toLocaleString("no-NO", { maximumFractionDigits: 0 })} NOK
                </p>
                <p className="result-explanation">
                  Basert på {role} med {seniority} års ansiennitet
                </p>
                <p className="result-explanation">
                  For {classDuration} minutter:{" "}
                  {Number(salary.hourlyRate).toLocaleString("no-NO", { maximumFractionDigits: 0 })} NOK ×{" "}
                  {salary.classMultiplier} ={" "}
                  {Number(salary.baseSalaryPerClass).toLocaleString("no-NO", { maximumFractionDigits: 0 })} NOK
                </p>
              </section>

              <div className="separator"></div>

              {/* 2. Then show the calculations for the hourly rate + 36.8% markup */}
              <section className="result-section">
                <h3 className="result-subtitle">Timesats med påslag (36,8%):</h3>
                <p className="result-value">
                  {Number(salary.selfEmployedHourlyRate).toLocaleString("no-NO", { maximumFractionDigits: 0 })} NOK
                </p>
                <p className="result-explanation">
                  {Number(salary.hourlyRate).toLocaleString("no-NO", { maximumFractionDigits: 0 })} NOK × 1,368 ={" "}
                  {Number(salary.selfEmployedHourlyRate).toLocaleString("no-NO", { maximumFractionDigits: 0 })} NOK
                </p>
                <p className="result-explanation">
                  For {classDuration} minutter:{" "}
                  {Number(salary.selfEmployedHourlyRate).toLocaleString("no-NO", { maximumFractionDigits: 0 })} NOK ×{" "}
                  {salary.classMultiplier} ={" "}
                  {Number(salary.selfEmployedRatePerClass).toLocaleString("no-NO", { maximumFractionDigits: 0 })} NOK
                </p>
                <p className="result-explanation mt-2">Påslaget på 36,8% dekker følgende kostnader:</p>
                <ul className="result-explanation-list">
                  <li className="social-costs-item">
                    15,8% - Kompensasjon for arbeidsgiveravgift og tap av rettigheter i folketrygdloven
                  </li>
                  <li className="social-costs-item">12,0% - Kompensasjon for feriepenger</li>
                  <li className="social-costs-item">3,6% - Trygdeavgiftsforhøyelse for næringsdrivende</li>
                  <li className="social-costs-item">0,4% - Frivillig yrkesskadeforsikring</li>
                  <li className="social-costs-item">5,0% - Administrative kostnader for næringsvirksomhet</li>
                </ul>
              </section>

              {/* 3. Then show the total fee */}
              {classCount === "multiple" && (
                <>
                  <div className="separator"></div>
                  <section className="result-section">
                    <h3 className="result-subtitle">Totalt honorar:</h3>
                    <p className="result-value">
                      {Number(salary.totalSelfEmployedFee).toLocaleString("no-NO", { maximumFractionDigits: 0 })} NOK
                    </p>
                    <p className="result-explanation">
                      {Number(salary.selfEmployedRatePerClass).toLocaleString("no-NO", { maximumFractionDigits: 0 })}{" "}
                      NOK × {numberOfClasses} klasser ={" "}
                      {Number(salary.totalSelfEmployedFee).toLocaleString("no-NO", { maximumFractionDigits: 0 })} NOK
                    </p>
                  </section>
                </>
              )}
            </div>
          ) : (
            <p className="result-explanation">Vennligst fyll ut alle feltene for å se beregnet lønn.</p>
          )}
        </div>
      </div>
      <div className="clear-button-container">
        <button type="button" onClick={resetForm} className="btn btn-primary" aria-label="Nullstill alle verdier">
          Nullstill
        </button>
      </div>
    </form>
  )
}
