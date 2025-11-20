# CSV Data Generation Guide

## Quick Start

### Method 1: Using the Web Application
1. Start the development server:
   ```bash
   npm run dev
   ```
2. Navigate to the Market Analysis page
3. Click the **"Download Data (CSV)"** button in the top-right corner
4. The CSV file will be downloaded to your browser's download folder

### Method 2: Using the Node.js Script
1. Navigate to the project directory:
   ```bash
   cd vaccine-final
   ```
2. Run the generation script:
   ```bash
   node generate-csv.cjs
   ```
3. The CSV file `elderly_care_market_data.csv` will be created in the current directory

## Generated Data

### File Details
- **Filename**: `elderly_care_market_data.csv`
- **Records**: 555,660 rows
- **Size**: ~115 MB
- **Format**: Standard CSV with comma delimiters

### Data Dimensions
The generated data includes all combinations of:
- 15 years (2021-2035)
- 7 countries (U.K., Germany, France, Italy, Spain, Russia, Rest of Europe)
- 7 types of care facilities
- 7 service offerings
- 2 care options
- 9 applications
- 2 genders
- 3 age groups

**Total combinations**: 15 × 7 × 7 × 7 × 2 × 9 × 2 × 3 = 555,660 records

## Data Fields

Each record contains:
- **Identifiers**: recordId, year, region, country
- **Dimensions**: type, serviceOffering, careOption, application, gender, ageGroup
- **Metrics**: volumeUnits, price, revenue, marketValueUsd, marketSharePct, cagr, yoyGrowth

## Using the Data

### In Excel
1. Open Excel
2. Go to Data → From Text/CSV
3. Select `elderly_care_market_data.csv`
4. Click Import

### In Python (Pandas)
```python
import pandas as pd

# Load the data
df = pd.read_csv('elderly_care_market_data.csv')

# Example: Filter for U.K. data
uk_data = df[df['country'] == 'U.K.']

# Example: Group by age group
age_summary = df.groupby('ageGroup')['marketValueUsd'].sum()
```

### In R
```r
# Load the data
data <- read.csv('elderly_care_market_data.csv')

# Example: Filter for 2025
data_2025 <- subset(data, year == 2025)

# Example: Aggregate by country
country_summary <- aggregate(marketValueUsd ~ country, data, sum)
```

### In Tableau
1. Open Tableau
2. Connect to Data → Text File
3. Select `elderly_care_market_data.csv`
4. Drag dimensions and measures to create visualizations

## Regenerating Data

To regenerate the data with different parameters:
1. Edit `generate-csv.cjs`
2. Modify the arrays for any dimension (e.g., add more countries, change years)
3. Run `node generate-csv.cjs` again

## Notes
- The data is generated using a seeded random number generator for reproducibility
- All monetary values are in USD
- Market values and volumes are realistic but synthetic
- The data is designed to support the Market Analysis dashboard filters
