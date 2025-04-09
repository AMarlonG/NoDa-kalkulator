export interface ClassLengthCalculation {
  "Undervisningstid (min)": number
  "Undervisningstid (timer)": string
  Utregning: string
}

export const classLengthCalculationData: ClassLengthCalculation[] = [
  {
    "Undervisningstid (min)": 60,
    "Undervisningstid (timer)": "1",
    Utregning: "Timespris × 1.0",
  },
  {
    "Undervisningstid (min)": 75,
    "Undervisningstid (timer)": "1,25",
    Utregning: "Timespris × 1.25",
  },
  {
    "Undervisningstid (min)": 90,
    "Undervisningstid (timer)": "1,5",
    Utregning: "Timespris × 1.5",
  },
  {
    "Undervisningstid (min)": 120,
    "Undervisningstid (timer)": "2",
    Utregning: "Timespris × 2.0",
  },
  {
    "Undervisningstid (min)": 150,
    "Undervisningstid (timer)": "2,5",
    Utregning: "Timespris × 2.5",
  },
  {
    "Undervisningstid (min)": 180,
    "Undervisningstid (timer)": "3",
    Utregning: "Timespris × 3.0",
  },
  {
    "Undervisningstid (min)": 210,
    "Undervisningstid (timer)": "3,5",
    Utregning: "Timespris × 3.5",
  },
  {
    "Undervisningstid (min)": 240,
    "Undervisningstid (timer)": "4",
    Utregning: "Timespris × 4.0",
  },
  {
    "Undervisningstid (min)": 270,
    "Undervisningstid (timer)": "4,5",
    Utregning: "Timespris × 4.5",
  },
  {
    "Undervisningstid (min)": 300,
    "Undervisningstid (timer)": "5",
    Utregning: "Timespris × 5.0",
  },
]

// Helper function to get the multiplier for a given class length in minutes
export function getMultiplierForClassLength(minutes: number): number {
  const classLength = classLengthCalculationData.find((item) => item["Undervisningstid (min)"] === minutes)
  if (classLength) {
    // Extract the multiplier from the "Utregning" string (e.g., "Timespris × 1.5" -> 1.5)
    const multiplierMatch = classLength.Utregning.match(/(\d+\.\d+)/)
    return multiplierMatch ? Number.parseFloat(multiplierMatch[0]) : 1.0
  }
  return 1.0 // Default to 1.0 if no match is found
}
