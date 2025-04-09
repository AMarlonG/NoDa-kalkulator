"use client"

import { useState, useCallback, useEffect } from "react"
import { DancerCalculator } from "@/components/DancerCalculator"
import { ChoreographerCalculator } from "@/components/ChoreographerCalculator"
import { DancerChoreographerCalculator } from "@/components/DancerChoreographerCalculator"
import { TeacherCalculator } from "@/components/TeacherCalculator"
import "./styles/page.css"

function isViewTransitionSupported() {
  return Boolean(document.startViewTransition)
}

export default function Home() {
  const [activeCalculator, setActiveCalculator] = useState<
    "dancer" | "choreographer" | "dancerChoreographer" | "teacher" | null
  >(null)

  const updateActiveCalculatorWithTransition = useCallback((newCalculator: typeof activeCalculator) => {
    if (isViewTransitionSupported()) {
      document.startViewTransition(() => {
        setActiveCalculator(newCalculator)
      })
    } else {
      setActiveCalculator(newCalculator)
    }
  }, [])

  useEffect(() => {
    if (isViewTransitionSupported()) {
      document.documentElement.style.display = "none"
      document.documentElement.offsetHeight
      document.documentElement.style.display = ""
    }
  }, [])

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.altKey) {
        switch (event.key) {
          case "1":
            updateActiveCalculatorWithTransition("dancer")
            break
          case "2":
            updateActiveCalculatorWithTransition("choreographer")
            break
          case "3":
            updateActiveCalculatorWithTransition("dancerChoreographer")
            break
          case "4":
            updateActiveCalculatorWithTransition("teacher")
            break
        }
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => {
      window.removeEventListener("keydown", handleKeyPress)
    }
  }, [updateActiveCalculatorWithTransition])

  return (
    <main className="main">
      <a href="#calculator-section" className="sr-only focus-visible:not-sr-only">
        Hopp til hovedinnhold
      </a>
      <header className="header">
        <div className="title-container">
          <h1 className="title">NoDas lønnskalkulator</h1>
          <p className="description">Beregn din rettferdige lønn</p>
        </div>
        <div className="nav-container">
          <div className="nav-row">
            <button
              className={`nav-button ${activeCalculator === "dancer" ? "nav-button-active" : "nav-button-inactive"}`}
              onClick={() => updateActiveCalculatorWithTransition("dancer")}
            >
              Danser
            </button>
            <button
              className={`nav-button ${activeCalculator === "choreographer" ? "nav-button-active" : "nav-button-inactive"}`}
              onClick={() => updateActiveCalculatorWithTransition("choreographer")}
            >
              Koreograf
            </button>
          </div>
          <div className="nav-row">
            <button
              className={`nav-button ${
                activeCalculator === "dancerChoreographer" ? "nav-button-active" : "nav-button-inactive"
              }`}
              onClick={() => updateActiveCalculatorWithTransition("dancerChoreographer")}
            >
              Danser & Koreograf
            </button>
            <button
              className={`nav-button ${activeCalculator === "teacher" ? "nav-button-active" : "nav-button-inactive"}`}
              onClick={() => updateActiveCalculatorWithTransition("teacher")}
            >
              Pedagog
            </button>
          </div>
        </div>
      </header>

      <section id="calculator-section" className="calculator-section" aria-label="Lønnskalkulator">
        {activeCalculator === "dancer" && <DancerCalculator />}
        {activeCalculator === "choreographer" && <ChoreographerCalculator />}
        {activeCalculator === "dancerChoreographer" && <DancerChoreographerCalculator />}
        {activeCalculator === "teacher" && <TeacherCalculator />}
      </section>

      <footer className="footer">
        <p>Kalkulatoren er basert på gjeldende tariffavtaler og veiledende satser.</p>
        <p>
          For mer informasjon, se{" "}
          <a
            href="https://norskedansekunstnere.no/lonn-og-arbeidsliv/veiledende-satser"
            target="_blank"
            rel="noopener noreferrer"
          >
            NoDas oversikt over veiledende satser.
          </a>
        </p>
      </footer>
    </main>
  )
}
