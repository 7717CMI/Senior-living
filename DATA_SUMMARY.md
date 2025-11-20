# Elderly Care Market Data - CSV Export

## Overview
This CSV file contains comprehensive dummy data for elderly care market analysis across European countries.

## File Information
- **Filename**: `elderly_care_market_data.csv`
- **Total Records**: 555,660
- **File Size**: ~115 MB
- **Format**: CSV (Comma-Separated Values)

## Data Structure

### Filters/Dimensions
The data includes the following dimensions that can be used for filtering and analysis:

1. **By Service Offering** (7 options):
   - Personal Care Services
   - Health Monitoring Services
   - Medication Management Services
   - Social Activities and Engagement
   - Household and Daily Life Support Services
   - Transportation Services
   - Others (Concierge and Support Services, etc.)

2. **By Care Option** (2 options):
   - Long Term Care
   - Short Term Care

3. **By Application** (9 options):
   - Dementia Care
   - Chronic & advanced heart disease
   - Alzheimer Care
   - Stroke
   - Parkinson Disease care
   - Cancer Care
   - Post-Operative Care
   - Mental Health Wellbeing
   - Other (Palliative Care, etc.)

4. **By Gender** (2 options):
   - Male
   - Female

5. **By Country** (7 European countries):
   - U.K.
   - Germany
   - France
   - Italy
   - Spain
   - Russia
   - Rest of Europe

6. **By Age Group** (3 categories):
   - Youngest old (65-74 years)
   - Middle old (75-84 years)
   - Oldest old (85 years and older)

7. **By Type** (7 options):
   - Independent Living
   - Assisted Living
   - Nursing Homes
   - Continuing Care Retirement
   - Active Adult Communities
   - Memory Care Communities
   - Others (Palliative Care, Concierge and Support Services, etc.)

### Time Period
- **Years**: 2021 to 2035 (15 years)

### Columns in CSV

| Column Name | Description | Data Type |
|------------|-------------|-----------|
| recordId | Unique identifier for each record | Integer |
| year | Year of the data point | Integer (2021-2035) |
| region | Geographic region | String (Europe) |
| country | Specific country | String |
| type | Type of elderly care facility | String |
| serviceOffering | Service offering category | String |
| careOption | Care option type | String |
| application | Application/condition treated | String |
| gender | Gender category | String |
| ageGroup | Age group category | String |
| volumeUnits | Market volume in units | Integer |
| price | Price per unit | Decimal |
| revenue | Total revenue | Decimal |
| marketValueUsd | Market value in USD | Decimal |
| marketSharePct | Market share percentage | Decimal |
| cagr | Compound Annual Growth Rate | Decimal |
| yoyGrowth | Year-over-Year Growth | Decimal |

## Data Generation Method
The data is generated using a seeded random number generator to ensure:
- Reproducibility
- Realistic value distributions
- Consistent patterns across dimensions

## Usage in Application
The Market Analysis dashboard uses this data structure to:
1. Filter data by any combination of the 6 main dimensions
2. Display market value and volume metrics
3. Show trends over time (2021-2035)
4. Compare performance across countries, age groups, and service types
5. Analyze market dynamics by different segments

## Download Feature
The application includes a "Download Data (CSV)" button that allows users to export the complete dataset for external analysis in tools like Excel, Tableau, or Python/R.

## Sample Data
```csv
recordId,year,region,country,type,serviceOffering,careOption,application,gender,ageGroup,volumeUnits,price,revenue,marketValueUsd,marketSharePct,cagr,yoyGrowth
100000,2021,Europe,U.K.,Independent Living,Personal Care Services,Long Term Care,Dementia Care,Male,Youngest old (65-74 years),177290,123.01,21808226.46,25812122.6,19.48,7.55,13.03
```

## Notes
- All monetary values are in USD
- Volume units represent the number of service units/patients
- Market share percentages are calculated relative to the total market
- CAGR and YoY growth rates are expressed as percentages
