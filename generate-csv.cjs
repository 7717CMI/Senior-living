// Simple Node.js script to generate CSV data
const fs = require('fs');

// Age groups
const ageGroups = ["Youngest old (65-74 years)", "Middle old (75-84 years)", "Oldest old (85 years and older)"];

// Service offerings
const serviceOfferings = [
  "Personal Care Services",
  "Health Monitoring Services",
  "Medication Management Services",
  "Social Activities and Engagement",
  "Household and Daily Life Support Services",
  "Transportation Services",
  "Others (Concierge and Support Services, etc.)"
];

// Care options
const careOptions = ["Long Term Care", "Short Term Care"];

// Applications
const applications = [
  "Dementia Care",
  "Chronic & advanced heart disease",
  "Alzheimer Care",
  "Stroke",
  "Parkinson Disease care",
  "Cancer Care",
  "Post-Operative Care",
  "Mental Health Wellbeing",
  "Other (Palliative Care, etc.)"
];

// Genders
const genders = ["Male", "Female"];

// Countries
const countries = ["U.K.", "Germany", "France", "Italy", "Spain", "Russia", "Rest of Europe"];

// Types
const types = [
  "Independent Living",
  "Assisted Living",
  "Nursing Homes",
  "Continuing Care Retirement",
  "Active Adult Communities",
  "Memory Care Communities",
  "Others (Palliative Care, Concierge and Support Services, etc.)"
];

// Years
const years = Array.from({ length: 15 }, (_, i) => 2021 + i);

// Seeded random function
let seed = 42;
const seededRandom = () => {
  seed = (seed * 9301 + 49297) % 233280;
  return seed / 233280;
};

// Generate data
const data = [];
let recordId = 100000;

for (const year of years) {
  for (const country of countries) {
    for (const type of types) {
      for (const serviceOffering of serviceOfferings) {
        for (const careOption of careOptions) {
          for (const application of applications) {
            for (const gender of genders) {
              for (const ageGroup of ageGroups) {
                // Generate random values
                const volumeUnits = Math.floor((1 + seededRandom() * 199) * 1000);
                const price = 2 + seededRandom() * 148;
                const revenue = price * volumeUnits;
                const marketValueUsd = revenue * (0.8 + seededRandom() * 0.4);
                const marketSharePct = 1 + seededRandom() * 24;
                const cagr = -2 + seededRandom() * 17;
                const yoyGrowth = -5 + seededRandom() * 25;

                data.push({
                  recordId: recordId++,
                  year,
                  region: "Europe",
                  country,
                  type,
                  serviceOffering,
                  careOption,
                  application,
                  gender,
                  ageGroup,
                  volumeUnits: Math.round(volumeUnits),
                  price: Math.round(price * 100) / 100,
                  revenue: Math.round(revenue * 100) / 100,
                  marketValueUsd: Math.round(marketValueUsd * 100) / 100,
                  marketSharePct: Math.round(marketSharePct * 100) / 100,
                  cagr: Math.round(cagr * 100) / 100,
                  yoyGrowth: Math.round(yoyGrowth * 100) / 100
                });
              }
            }
          }
        }
      }
    }
  }
}

// Convert to CSV
const headers = Object.keys(data[0]);
const csvHeader = headers.join(',');
const csvRows = data.map(row => {
  return headers.map(header => {
    const value = row[header];
    if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }).join(',');
});

const csv = [csvHeader, ...csvRows].join('\n');

// Write to file
fs.writeFileSync('elderly_care_market_data.csv', csv);
console.log(`Generated ${data.length} records`);
console.log('CSV file created: elderly_care_market_data.csv');
