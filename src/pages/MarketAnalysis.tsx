import { useState, useMemo } from 'react'
import { ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'
import { getData, filterDataframe, formatWithCommas, FilterOptions, downloadCSV } from '../utils/dataGenerator'
import { StatBox } from '../components/StatBox'
import { FilterDropdown } from '../components/FilterDropdown'
import { SegmentGroupedBarChart } from '../components/SegmentGroupedBarChart'
import { RegionCountryStackedBarChart } from '../components/RegionCountryStackedBarChart'
import { CrossSegmentStackedBarChart } from '../components/CrossSegmentStackedBarChart'
import { DemoNotice } from '../components/DemoNotice'
import { useTheme } from '../context/ThemeContext'
import { InfoTooltip } from '../components/InfoTooltip'

interface MarketAnalysisProps {
  onNavigate: (page: string) => void
}

type MarketEvaluationType = 'By Value' | 'By Volume'
type SegmentType = 'By Type' | 'By Service Offering' | 'By Care Option' | 'By Application' | 'By Gender' | 'By Age Group'

interface MarketAnalysisFilters extends FilterOptions {
  // Main filters from excel sheet
  year?: number[]
  serviceOffering?: string[]
  careOption?: string[]
  application?: string[]
  gender?: string[]
  country?: string[]
  ageGroup?: string[]
  marketEvaluation?: MarketEvaluationType
  // Cross-segment analysis filters
  crossSegmentPrimary?: SegmentType
  crossSegmentPrimaryType?: string[]
  crossSegmentPrimaryServiceOffering?: string[]
  crossSegmentPrimaryCareOption?: string[]
  crossSegmentPrimaryApplication?: string[]
  crossSegmentPrimaryGender?: string[]
  crossSegmentPrimaryAgeGroup?: string[]
  crossSegment?: SegmentType
  crossSegmentType?: string[]
  crossSegmentServiceOffering?: string[]
  crossSegmentCareOption?: string[]
  crossSegmentApplication?: string[]
  crossSegmentGender?: string[]
  crossSegmentAgeGroup?: string[]
}

export function MarketAnalysis({ onNavigate }: MarketAnalysisProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  
  let data: any[] = []
  try {
    data = getData()
  } catch (error) {
    console.error('Error loading data:', error)
    data = []
  }
  
  const [filters, setFilters] = useState<MarketAnalysisFilters>(() => {
    try {
      // Get available options for new filters
      const availableYears = [...new Set(data.map(d => d.year))].sort()
      const availableServiceOfferings = [...new Set(data.map(d => d.serviceOffering))].sort()
      const availableCareOptions = [...new Set(data.map(d => d.careOption))].sort()
      const availableApplications = [...new Set(data.map(d => d.application))].sort()
      const availableGenders = [...new Set(data.map(d => d.gender))].sort()
      const availableCountries = [...new Set(data.map(d => d.country))].sort()
      const availableAgeGroups = [...new Set(data.map(d => d.ageGroup))].sort()
      
      // Default year selection - select 2021 and 2022
      const defaultYear = availableYears.includes(2021) && availableYears.includes(2022)
        ? [2021, 2022]
        : availableYears.length >= 2 
          ? availableYears.slice(-2) 
          : availableYears.length === 1 
            ? [availableYears[0]] 
            : []
      
      // Default selections - select first 2 items for each filter
      const defaultServiceOfferings = availableServiceOfferings.length >= 2 
        ? availableServiceOfferings.slice(0, 2)
        : availableServiceOfferings
      
      const defaultCareOptions = availableCareOptions.length >= 2
        ? availableCareOptions.slice(0, 2)
        : availableCareOptions
      
      const defaultApplications = availableApplications.length >= 2
        ? availableApplications.slice(0, 2)
        : availableApplications
      
      const defaultGenders = availableGenders // Select all genders by default
      
      const defaultCountries = availableCountries.length >= 2
        ? availableCountries.slice(0, 2)
        : availableCountries
      
      const defaultAgeGroups = availableAgeGroups // Select all age groups by default
      
      return {
        year: defaultYear,
        serviceOffering: defaultServiceOfferings,
        careOption: defaultCareOptions,
        application: defaultApplications,
        gender: defaultGenders,
        country: defaultCountries,
        ageGroup: defaultAgeGroups,
        marketEvaluation: 'By Value',
      }
    } catch (error) {
      console.error('Error initializing filters:', error)
      return {
        year: [],
        serviceOffering: [],
        careOption: [],
        application: [],
        gender: [],
        country: [],
        ageGroup: [],
        marketEvaluation: 'By Value',
      }
    }
  })

  const filteredData = useMemo(() => {
    if (!data || data.length === 0) return []
    
    try {
      let filtered = data
      
      // Apply new filters
      if (filters.year && filters.year.length > 0) {
        filtered = filtered.filter(d => filters.year!.includes(d.year))
      }
      
      if (filters.serviceOffering && filters.serviceOffering.length > 0) {
        filtered = filtered.filter(d => filters.serviceOffering!.includes(d.serviceOffering))
      }
      
      if (filters.careOption && filters.careOption.length > 0) {
        filtered = filtered.filter(d => filters.careOption!.includes(d.careOption))
      }
      
      if (filters.application && filters.application.length > 0) {
        filtered = filtered.filter(d => filters.application!.includes(d.application))
      }
      
      if (filters.gender && filters.gender.length > 0) {
        filtered = filtered.filter(d => filters.gender!.includes(d.gender))
      }
      
      if (filters.country && filters.country.length > 0) {
        filtered = filtered.filter(d => filters.country!.includes(d.country))
      }
      
      if (filters.ageGroup && filters.ageGroup.length > 0) {
        filtered = filtered.filter(d => filters.ageGroup!.includes(d.ageGroup))
      }
      
      return filtered
    } catch (error) {
      console.error('Error filtering data:', error)
      return []
    }
  }, [data, filters])

  // Get unique options for the new filters
  const uniqueOptions = useMemo(() => {
    try {
      if (!data || data.length === 0) {
        return {
          years: [],
          serviceOfferings: [],
          careOptions: [],
          applications: [],
          genders: [],
          countries: [],
          ageGroups: [],
        }
      }
      
      return {
        years: [...new Set(data.map(d => d.year))].sort(),
        serviceOfferings: [...new Set(data.map(d => d.serviceOffering))].sort(),
        careOptions: [...new Set(data.map(d => d.careOption))].sort(),
        applications: [...new Set(data.map(d => d.application))].sort(),
        genders: [...new Set(data.map(d => d.gender))].sort(),
        countries: [...new Set(data.map(d => d.country))].sort(),
        ageGroups: [...new Set(data.map(d => d.ageGroup))].sort(),
      }
    } catch (error) {
      console.error('Error calculating unique options:', error)
      return {
        years: [],
        serviceOfferings: [],
        careOptions: [],
        applications: [],
        genders: [],
        countries: [],
        ageGroups: [],
      }
    }
  }, [data, filters])

  // Active filters label helper
  const activeFiltersLabel = useMemo(() => {
    return {
      year: filters.year && filters.year.length > 0 
        ? filters.year.join(', ') 
        : 'All Years',
      serviceOffering: filters.serviceOffering && filters.serviceOffering.length > 0 
        ? filters.serviceOffering.join(', ') 
        : 'All',
      careOption: filters.careOption && filters.careOption.length > 0 
        ? filters.careOption.join(', ') 
        : 'All',
      application: filters.application && filters.application.length > 0 
        ? filters.application.join(', ') 
        : 'All',
      gender: filters.gender && filters.gender.length > 0 
        ? filters.gender.join(', ') 
        : 'All',
      country: filters.country && filters.country.length > 0 
        ? filters.country.join(', ') 
        : 'All',
      ageGroup: filters.ageGroup && filters.ageGroup.length > 0 
        ? filters.ageGroup.join(', ') 
        : 'All',
      marketEvaluation: filters.marketEvaluation || 'By Value',
    }
  }, [filters])

  // Get data value based on market evaluation type - MUST be defined before useMemo hooks that use it
  const getDataValue = (d: any): number => {
    if (filters.marketEvaluation === 'By Volume') {
      return d.volumeUnits || 0
    }
    return (d.marketValueUsd || 0) / 1000 // Convert to millions
  }

  const getDataLabel = (): string => {
    return filters.marketEvaluation === 'By Volume' ? 'Market Volume (Units)' : 'Market Value (US$ Million)'
  }

  // Graph 1: Market Value by Type (grouped by Year)
  // X axis: Year, Y axis: Market Value, grouped by Type
  const marketValueByTypeData = useMemo(() => {
    const years = [...new Set(filteredData.map(d => d.year))].sort()
    const types = [...new Set(filteredData.map(d => d.type))].sort()
    
    if (years.length === 0 || types.length === 0) return []
    
    return years.map((year) => {
      const entry: Record<string, number | string> = { year: String(year) }
      types.forEach((type) => {
        const yearData = filteredData.filter(d => d.year === year && d.type === type)
        entry[type] = yearData.reduce((sum, d) => sum + getDataValue(d), 0)
      })
      return entry
    })
  }, [filteredData, filters.marketEvaluation])

  // Graph 2: Market Value by Country by Year
  // X axis: Country, Y axis: Market Value, grouped by Year
  const marketValueByCountryData = useMemo(() => {
    const years = [...new Set(filteredData.map(d => d.year))].sort()
    const countries = [...new Set(filteredData.map(d => d.country))].sort()
    
    if (years.length === 0 || countries.length === 0) return []
    
    return years.map((year) => {
      const entry: Record<string, number | string> = { year: String(year) }
      countries.forEach((country) => {
        const yearData = filteredData.filter(d => d.year === year && d.country === country)
        entry[country] = yearData.reduce((sum, d) => sum + getDataValue(d), 0)
      })
      return entry
    })
  }, [filteredData, filters.marketEvaluation])

  // Graph 3: Region chart showing percentage distribution of countries within each region
  const regionCountryPercentageData = useMemo(() => {
    const regionData: Record<string, Record<string, number>> = {}
    
    // Group data by region and country
    filteredData.forEach((d) => {
      if (!regionData[d.region]) {
        regionData[d.region] = {}
      }
      regionData[d.region][d.country] = (regionData[d.region][d.country] || 0) + getDataValue(d)
    })
    
    // Calculate percentages for each region
    return Object.entries(regionData).map(([region, countriesData]) => {
      const totalValue = Object.values(countriesData).reduce((sum, val) => sum + val, 0)
      const countries = Object.keys(countriesData).sort()
      
      return countries.map((country) => {
        const value = countriesData[country] || 0
        const percentage = totalValue > 0 ? ((value / totalValue) * 100) : 0
        
        return {
          region,
          country,
          value,
          percentage: parseFloat(percentage.toFixed(1))
        }
      })
    }).flat()
  }, [filteredData, filters.marketEvaluation])

  // All available segments from Excel sheet
  const allAvailableSegments = useMemo(() => {
    const allSegments: SegmentType[] = ['By Type', 'By Service Offering', 'By Care Option', 'By Application', 'By Gender', 'By Age Group']
    // Filter based on marketEvaluation: hide By Age Group and By Gender when By Volume is selected
    return filters.marketEvaluation === 'By Volume'
      ? allSegments.filter(s => s !== 'By Age Group' && s !== 'By Gender')
      : allSegments
  }, [filters.marketEvaluation])

  // Available segments for primary dropdown (exclude the cross-segment selection)
  const availablePrimarySegments = useMemo(() => {
    return allAvailableSegments.filter(s => s !== filters.crossSegment && s !== null)
  }, [allAvailableSegments, filters.crossSegment])

  // Available cross-segments for standalone cross-analysis (exclude the primary cross-segment)
  const availableCrossSegmentsForStandalone = useMemo(() => {
    return allAvailableSegments.filter(s => s !== filters.crossSegmentPrimary && s !== null)
  }, [allAvailableSegments, filters.crossSegmentPrimary])

  // Standalone cross-segment filtered data (apply crossSegmentPrimary filters)
  const standaloneCrossSegmentFilteredData = useMemo(() => {
    if (!filters.crossSegmentPrimary) return filteredData
    
    let filtered = filteredData
    
    // Apply segment-specific filters for crossSegmentPrimary
    if (filters.crossSegmentPrimary === 'By Type') {
      if (filters.crossSegmentPrimaryType && filters.crossSegmentPrimaryType.length > 0) {
        filtered = filtered.filter(d => filters.crossSegmentPrimaryType!.includes(d.type))
      }
    } else if (filters.crossSegmentPrimary === 'By Service Offering') {
      if (filters.crossSegmentPrimaryServiceOffering && filters.crossSegmentPrimaryServiceOffering.length > 0) {
        filtered = filtered.filter(d => filters.crossSegmentPrimaryServiceOffering!.includes(d.serviceOffering))
      }
    } else if (filters.crossSegmentPrimary === 'By Care Option') {
      if (filters.crossSegmentPrimaryCareOption && filters.crossSegmentPrimaryCareOption.length > 0) {
        filtered = filtered.filter(d => filters.crossSegmentPrimaryCareOption!.includes(d.careOption))
      }
    } else if (filters.crossSegmentPrimary === 'By Application') {
      if (filters.crossSegmentPrimaryApplication && filters.crossSegmentPrimaryApplication.length > 0) {
        filtered = filtered.filter(d => filters.crossSegmentPrimaryApplication!.includes(d.application))
      }
    } else if (filters.crossSegmentPrimary === 'By Gender') {
      if (filters.crossSegmentPrimaryGender && filters.crossSegmentPrimaryGender.length > 0) {
        filtered = filtered.filter(d => filters.crossSegmentPrimaryGender!.includes(d.gender))
      }
    } else if (filters.crossSegmentPrimary === 'By Age Group') {
      if (filters.crossSegmentPrimaryAgeGroup && filters.crossSegmentPrimaryAgeGroup.length > 0) {
        filtered = filtered.filter(d => filters.crossSegmentPrimaryAgeGroup!.includes(d.ageGroup))
      }
    }
    
    return filtered
  }, [filteredData, filters.crossSegmentPrimary, filters.crossSegmentPrimaryType, filters.crossSegmentPrimaryServiceOffering, filters.crossSegmentPrimaryCareOption, filters.crossSegmentPrimaryApplication, filters.crossSegmentPrimaryAgeGroup, filters.crossSegmentPrimaryGender])

  // Cross-segment analysis data for graph display
  const crossSegmentAnalysisData = useMemo(() => {
    if (!filters.crossSegmentPrimary || !filters.crossSegment || filters.crossSegmentPrimary === filters.crossSegment) return []
    
    let filtered = standaloneCrossSegmentFilteredData
    
    // Apply cross-segment filters
    if (filters.crossSegment === 'By Type') {
      if (filters.crossSegmentType && filters.crossSegmentType.length > 0) {
        filtered = filtered.filter(d => filters.crossSegmentType!.includes(d.type))
      }
    } else if (filters.crossSegment === 'By Service Offering') {
      if (filters.crossSegmentServiceOffering && filters.crossSegmentServiceOffering.length > 0) {
        filtered = filtered.filter(d => filters.crossSegmentServiceOffering!.includes(d.serviceOffering))
      }
    } else if (filters.crossSegment === 'By Care Option') {
      if (filters.crossSegmentCareOption && filters.crossSegmentCareOption.length > 0) {
        filtered = filtered.filter(d => filters.crossSegmentCareOption!.includes(d.careOption))
      }
    } else if (filters.crossSegment === 'By Application') {
      if (filters.crossSegmentApplication && filters.crossSegmentApplication.length > 0) {
        filtered = filtered.filter(d => filters.crossSegmentApplication!.includes(d.application))
      }
    } else if (filters.crossSegment === 'By Age Group') {
      if (filters.crossSegmentAgeGroup && filters.crossSegmentAgeGroup.length > 0) {
        filtered = filtered.filter(d => filters.crossSegmentAgeGroup!.includes(d.ageGroup))
      }
    } else if (filters.crossSegment === 'By Gender') {
      if (filters.crossSegmentGender && filters.crossSegmentGender.length > 0) {
        filtered = filtered.filter(d => filters.crossSegmentGender!.includes(d.gender))
      }
    }
    
    // Get segment keys
    let primarySegmentKey = ''
    if (filters.crossSegmentPrimary === 'By Type') primarySegmentKey = 'type'
    else if (filters.crossSegmentPrimary === 'By Service Offering') primarySegmentKey = 'serviceOffering'
    else if (filters.crossSegmentPrimary === 'By Care Option') primarySegmentKey = 'careOption'
    else if (filters.crossSegmentPrimary === 'By Application') primarySegmentKey = 'application'
    else if (filters.crossSegmentPrimary === 'By Age Group') primarySegmentKey = 'ageGroup'
    else if (filters.crossSegmentPrimary === 'By Gender') primarySegmentKey = 'gender'
    
    let crossSegmentKey = ''
    if (filters.crossSegment === 'By Type') crossSegmentKey = 'type'
    else if (filters.crossSegment === 'By Service Offering') crossSegmentKey = 'serviceOffering'
    else if (filters.crossSegment === 'By Care Option') crossSegmentKey = 'careOption'
    else if (filters.crossSegment === 'By Application') crossSegmentKey = 'application'
    else if (filters.crossSegment === 'By Age Group') crossSegmentKey = 'ageGroup'
    else if (filters.crossSegment === 'By Gender') crossSegmentKey = 'gender'
    
    if (!primarySegmentKey || !crossSegmentKey) return []
    
    // Get unique values
    const primaryValues = [...new Set(filtered.map(d => d[primarySegmentKey as keyof typeof d] as string))].sort()
    const crossValues = [...new Set(filtered.map(d => d[crossSegmentKey as keyof typeof d] as string))].sort()
    
    if (primaryValues.length === 0 || crossValues.length === 0) return []
    
    // Create data: X-axis = primary segment values, stacked bars = cross segment values
    return primaryValues.map((primaryValue) => {
      const entry: Record<string, number | string> = { name: primaryValue }
      
      crossValues.forEach((crossValue) => {
        const matchingData = filtered.filter(d => 
          d[primarySegmentKey as keyof typeof d] === primaryValue &&
          d[crossSegmentKey as keyof typeof d] === crossValue
        )
        entry[crossValue] = matchingData.reduce((sum, d) => sum + getDataValue(d), 0)
      })
      
      return entry
    })
  }, [standaloneCrossSegmentFilteredData, filters.crossSegmentPrimary, filters.crossSegment, filters.crossSegmentType, filters.crossSegmentServiceOffering, filters.crossSegmentCareOption, filters.crossSegmentApplication, filters.crossSegmentAgeGroup, filters.crossSegmentGender, filters.marketEvaluation])

  // Get cross-segment data keys for the chart
  const crossSegmentDataKeys = useMemo(() => {
    if (!filters.crossSegment || crossSegmentAnalysisData.length === 0) return []
    
    let crossSegmentKey = ''
    if (filters.crossSegment === 'By Type') crossSegmentKey = 'type'
    else if (filters.crossSegment === 'By Service Offering') crossSegmentKey = 'serviceOffering'
    else if (filters.crossSegment === 'By Care Option') crossSegmentKey = 'careOption'
    else if (filters.crossSegment === 'By Application') crossSegmentKey = 'application'
    else if (filters.crossSegment === 'By Age Group') crossSegmentKey = 'ageGroup'
    else if (filters.crossSegment === 'By Gender') crossSegmentKey = 'gender'
    
    if (!crossSegmentKey) return []
    
    // Get all unique cross-segment values from the filtered data
    const crossValues = [...new Set(standaloneCrossSegmentFilteredData.map(d => d[crossSegmentKey as keyof typeof d] as string))].sort()
    return crossValues
  }, [filters.crossSegment, crossSegmentAnalysisData, standaloneCrossSegmentFilteredData])

  // Standalone cross-segment analysis data - Individual level granularity
  // This creates data grouped by primary segment with cross-segment breakdown
  // Note: Currently not used but kept for potential future features
  const _standaloneCrossSegmentData = useMemo(() => {
    if (!filters.crossSegmentPrimary || !filters.crossSegment || filters.crossSegmentPrimary === filters.crossSegment) return []
    
    let filtered = standaloneCrossSegmentFilteredData
    
    // Apply cross-segment filters if they exist
    if (filters.crossSegment === 'By Type') {
      if (filters.crossSegmentType && filters.crossSegmentType.length > 0) {
        filtered = filtered.filter(d => filters.crossSegmentType!.includes(d.type))
      }
    } else if (filters.crossSegment === 'By Service Offering') {
      if (filters.crossSegmentServiceOffering && filters.crossSegmentServiceOffering.length > 0) {
        filtered = filtered.filter(d => filters.crossSegmentServiceOffering!.includes(d.serviceOffering))
      }
    } else if (filters.crossSegment === 'By Care Option') {
      if (filters.crossSegmentCareOption && filters.crossSegmentCareOption.length > 0) {
        filtered = filtered.filter(d => filters.crossSegmentCareOption!.includes(d.careOption))
      }
    } else if (filters.crossSegment === 'By Application') {
      if (filters.crossSegmentApplication && filters.crossSegmentApplication.length > 0) {
        filtered = filtered.filter(d => filters.crossSegmentApplication!.includes(d.application))
      }
    } else if (filters.crossSegment === 'By Age Group') {
      if (filters.crossSegmentAgeGroup && filters.crossSegmentAgeGroup.length > 0) {
        filtered = filtered.filter(d => filters.crossSegmentAgeGroup!.includes(d.ageGroup))
      }
    } else if (filters.crossSegment === 'By Gender') {
      if (filters.crossSegmentGender && filters.crossSegmentGender.length > 0) {
        filtered = filtered.filter(d => filters.crossSegmentGender!.includes(d.gender))
      }
    }
    
    // Get keys for both segments
      let primarySegmentKey = ''
    if (filters.crossSegmentPrimary === 'By Type') primarySegmentKey = 'type'
    else if (filters.crossSegmentPrimary === 'By Service Offering') primarySegmentKey = 'serviceOffering'
    else if (filters.crossSegmentPrimary === 'By Care Option') primarySegmentKey = 'careOption'
    else if (filters.crossSegmentPrimary === 'By Application') primarySegmentKey = 'application'
    else if (filters.crossSegmentPrimary === 'By Age Group') primarySegmentKey = 'ageGroup'
    else if (filters.crossSegmentPrimary === 'By Gender') primarySegmentKey = 'gender'
      
      let crossSegmentKey = ''
      if (filters.crossSegment === 'By Type') crossSegmentKey = 'type'
      else if (filters.crossSegment === 'By Service Offering') crossSegmentKey = 'serviceOffering'
      else if (filters.crossSegment === 'By Care Option') crossSegmentKey = 'careOption'
      else if (filters.crossSegment === 'By Application') crossSegmentKey = 'application'
      else if (filters.crossSegment === 'By Age Group') crossSegmentKey = 'ageGroup'
      else if (filters.crossSegment === 'By Gender') crossSegmentKey = 'gender'
      
      if (!primarySegmentKey || !crossSegmentKey) return []
      
    // Get unique values for grouping
    const primaryValues = [...new Set(filtered.map(d => d[primarySegmentKey as keyof typeof d] as string))].sort()
    const crossValues = [...new Set(filtered.map(d => d[crossSegmentKey as keyof typeof d] as string))].sort()
    
    if (primaryValues.length === 0 || crossValues.length === 0) return []
    
    // Create granular data: Group by primary segment value, with cross-segment values as separate bars
    // X-axis: Primary segment values (e.g., Brand names)
    // Y-axis: Market Value
    // Groups: Years (each year shows bars for each cross-segment value)
    const years = [...new Set(filtered.map(d => d.year))].sort()
    
    return primaryValues.map((primaryValue) => {
      const entry: Record<string, number | string> = { 
        primarySegment: primaryValue 
      }
      
      // For each year, create a value for each cross-segment value
      years.forEach((year) => {
        crossValues.forEach((crossValue) => {
          const yearData = filtered.filter(d => 
                d.year === year && 
                d[primarySegmentKey as keyof typeof d] === primaryValue &&
                d[crossSegmentKey as keyof typeof d] === crossValue
              )
          // Store individual values - granular level
          const value = yearData.reduce((sum, d) => sum + getDataValue(d), 0)
          // Create key as "year-crossValue" for granular display
          entry[`${year}-${crossValue}`] = value
        })
      })
      
      return entry
    })
  }, [standaloneCrossSegmentFilteredData, filters.crossSegmentPrimary, filters.crossSegment, filters.crossSegmentBrand, filters.crossSegmentAgeGroup, filters.crossSegmentGender, filters.crossSegmentRoa, filters.crossSegmentDosageForm, filters.crossSegmentProcurementType, filters.marketEvaluation])

  // Get standalone cross-segment keys for chart - Individual granular keys
  // Used for secondary chart view (currently not displayed but kept for future use)
  const _standaloneCrossSegmentKeys = useMemo(() => {
    if (!filters.crossSegmentPrimary || !filters.crossSegment || filters.crossSegmentPrimary === filters.crossSegment) return []
    
    let filtered = standaloneCrossSegmentFilteredData
    
    // Apply cross-segment filters if they exist
    if (filters.crossSegment === 'By Brand') {
      if (filters.crossSegmentBrand && filters.crossSegmentBrand.length > 0) {
        filtered = filtered.filter(d => filters.crossSegmentBrand!.includes(d.brand))
      }
    } else if (filters.crossSegment === 'By Age') {
      if (filters.crossSegmentAgeGroup && filters.crossSegmentAgeGroup.length > 0) {
        filtered = filtered.filter(d => filters.crossSegmentAgeGroup!.includes(d.ageGroup))
      }
    } else if (filters.crossSegment === 'By Gender') {
      if (filters.crossSegmentGender && filters.crossSegmentGender.length > 0) {
        filtered = filtered.filter(d => filters.crossSegmentGender!.includes(d.gender))
      }
    } else if (filters.crossSegment === 'By ROA') {
      if (filters.crossSegmentRoa && filters.crossSegmentRoa.length > 0) {
        filtered = filtered.filter(d => filters.crossSegmentRoa!.includes(d.roa))
      }
    } else if (filters.crossSegment === 'By FDF') {
      if (filters.crossSegmentDosageForm && filters.crossSegmentDosageForm.length > 0) {
        filtered = filtered.filter(d => filters.crossSegmentDosageForm!.includes(d.fdf))
      }
    } else if (filters.crossSegment === 'By Procurement') {
      if (filters.crossSegmentProcurementType && filters.crossSegmentProcurementType.length > 0) {
        filtered = filtered.filter(d => filters.crossSegmentProcurementType!.includes(d.publicPrivate))
      }
    }
      
      let crossSegmentKey = ''
      if (filters.crossSegment === 'By Brand') crossSegmentKey = 'brand'
      else if (filters.crossSegment === 'By Age') crossSegmentKey = 'ageGroup'
      else if (filters.crossSegment === 'By Gender') crossSegmentKey = 'gender'
    else if (filters.crossSegment === 'By ROA') crossSegmentKey = 'roa'
      else if (filters.crossSegment === 'By FDF') crossSegmentKey = 'fdf'
      else if (filters.crossSegment === 'By Procurement') crossSegmentKey = 'publicPrivate'
      
    if (!crossSegmentKey) return []
    
    const years = [...new Set(filtered.map(d => d.year))].sort()
    const crossValues = [...new Set(filtered.map(d => d[crossSegmentKey as keyof typeof d] as string))].sort()
    
    // Create granular keys: "year-crossValue" for individual level display
      const combinations: string[] = []
    years.forEach((year) => {
        crossValues.forEach((crossValue) => {
        combinations.push(`${year}-${crossValue}`)
      })
    })
    
    return combinations
  }, [standaloneCrossSegmentFilteredData, filters.crossSegmentPrimary, filters.crossSegment, filters.crossSegmentBrand, filters.crossSegmentAgeGroup, filters.crossSegmentGender, filters.crossSegmentRoa, filters.crossSegmentDosageForm, filters.crossSegmentProcurementType, filters.crossSegmentCountry])

  // Alternative: Grouped by primary segment, showing cross-segment values grouped by year
  const standaloneCrossSegmentGroupedData = useMemo(() => {
    if (!filters.crossSegmentPrimary || !filters.crossSegment || filters.crossSegmentPrimary === filters.crossSegment) return []
    
    let filtered = standaloneCrossSegmentFilteredData
    
    // Apply cross-segment filters if they exist
    if (filters.crossSegment === 'By Brand') {
      if (filters.crossSegmentBrand && filters.crossSegmentBrand.length > 0) {
        filtered = filtered.filter(d => filters.crossSegmentBrand!.includes(d.brand))
      }
    } else if (filters.crossSegment === 'By Age') {
      if (filters.crossSegmentAgeGroup && filters.crossSegmentAgeGroup.length > 0) {
        filtered = filtered.filter(d => filters.crossSegmentAgeGroup!.includes(d.ageGroup))
      }
    } else if (filters.crossSegment === 'By Gender') {
      if (filters.crossSegmentGender && filters.crossSegmentGender.length > 0) {
        filtered = filtered.filter(d => filters.crossSegmentGender!.includes(d.gender))
      }
    } else if (filters.crossSegment === 'By ROA') {
      if (filters.crossSegmentRoa && filters.crossSegmentRoa.length > 0) {
        filtered = filtered.filter(d => filters.crossSegmentRoa!.includes(d.roa))
      }
    } else if (filters.crossSegment === 'By FDF') {
      if (filters.crossSegmentDosageForm && filters.crossSegmentDosageForm.length > 0) {
        filtered = filtered.filter(d => filters.crossSegmentDosageForm!.includes(d.fdf))
      }
    } else if (filters.crossSegment === 'By Procurement') {
      if (filters.crossSegmentProcurementType && filters.crossSegmentProcurementType.length > 0) {
        filtered = filtered.filter(d => filters.crossSegmentProcurementType!.includes(d.publicPrivate))
      }
    } else if (filters.crossSegment === 'By Country') {
      if (filters.crossSegmentCountry && filters.crossSegmentCountry.length > 0) {
        filtered = filtered.filter(d => filters.crossSegmentCountry!.includes(d.country))
      }
    }
    
        let primarySegmentKey = ''
    if (filters.crossSegmentPrimary === 'By Brand') primarySegmentKey = 'brand'
    else if (filters.crossSegmentPrimary === 'By Age') primarySegmentKey = 'ageGroup'
    else if (filters.crossSegmentPrimary === 'By Gender') primarySegmentKey = 'gender'
    else if (filters.crossSegmentPrimary === 'By ROA') primarySegmentKey = 'roa'
    else if (filters.crossSegmentPrimary === 'By FDF') primarySegmentKey = 'fdf'
    else if (filters.crossSegmentPrimary === 'By Procurement') primarySegmentKey = 'publicPrivate'
    else if (filters.crossSegmentPrimary === 'By Country') primarySegmentKey = 'country'
        
        let crossSegmentKey = ''
        if (filters.crossSegment === 'By Brand') crossSegmentKey = 'brand'
        else if (filters.crossSegment === 'By Age') crossSegmentKey = 'ageGroup'
        else if (filters.crossSegment === 'By Gender') crossSegmentKey = 'gender'
    else if (filters.crossSegment === 'By ROA') crossSegmentKey = 'roa'
        else if (filters.crossSegment === 'By FDF') crossSegmentKey = 'fdf'
        else if (filters.crossSegment === 'By Procurement') crossSegmentKey = 'publicPrivate'
        else if (filters.crossSegment === 'By Country') crossSegmentKey = 'country'
        
    if (!primarySegmentKey || !crossSegmentKey) return []
    
    const primaryValues = [...new Set(filtered.map(d => d[primarySegmentKey as keyof typeof d] as string))].sort()
    const crossValues = [...new Set(filtered.map(d => d[crossSegmentKey as keyof typeof d] as string))].sort()
    const years = [...new Set(filtered.map(d => d.year))].sort()
    
    if (primaryValues.length === 0 || crossValues.length === 0 || years.length === 0) return []
    
    // Create data grouped by primary segment, with cross-segment values as separate series
    // Each year shows bars for each cross-segment value
    return years.map((year) => {
      const entry: Record<string, number | string> = { year: String(year) }
      
      primaryValues.forEach((primaryValue) => {
        crossValues.forEach((crossValue) => {
          const yearData = filtered.filter(d => 
            d.year === year && 
            d[primarySegmentKey as keyof typeof d] === primaryValue &&
            d[crossSegmentKey as keyof typeof d] === crossValue
          )
          // Key format: "primaryValue × crossValue" for individual granular display
          const combinedKey = `${primaryValue} × ${crossValue}`
          entry[combinedKey] = yearData.reduce((sum, d) => sum + getDataValue(d), 0)
        })
      })
      
      return entry
    })
  }, [standaloneCrossSegmentFilteredData, filters.crossSegmentPrimary, filters.crossSegment, filters.crossSegmentBrand, filters.crossSegmentAgeGroup, filters.crossSegmentGender, filters.crossSegmentRoa, filters.crossSegmentDosageForm, filters.crossSegmentProcurementType, filters.marketEvaluation])

  // Keys for grouped data chart
  const standaloneCrossSegmentGroupedKeys = useMemo(() => {
    if (!filters.crossSegmentPrimary || !filters.crossSegment || filters.crossSegmentPrimary === filters.crossSegment) return []
    
    let filtered = standaloneCrossSegmentFilteredData
    
    // Apply cross-segment filters if they exist
    if (filters.crossSegment === 'By Brand') {
      if (filters.crossSegmentBrand && filters.crossSegmentBrand.length > 0) {
        filtered = filtered.filter(d => filters.crossSegmentBrand!.includes(d.brand))
      }
    } else if (filters.crossSegment === 'By Age') {
      if (filters.crossSegmentAgeGroup && filters.crossSegmentAgeGroup.length > 0) {
        filtered = filtered.filter(d => filters.crossSegmentAgeGroup!.includes(d.ageGroup))
      }
    } else if (filters.crossSegment === 'By Gender') {
      if (filters.crossSegmentGender && filters.crossSegmentGender.length > 0) {
        filtered = filtered.filter(d => filters.crossSegmentGender!.includes(d.gender))
      }
    } else if (filters.crossSegment === 'By ROA') {
      if (filters.crossSegmentRoa && filters.crossSegmentRoa.length > 0) {
        filtered = filtered.filter(d => filters.crossSegmentRoa!.includes(d.roa))
      }
    } else if (filters.crossSegment === 'By FDF') {
      if (filters.crossSegmentDosageForm && filters.crossSegmentDosageForm.length > 0) {
        filtered = filtered.filter(d => filters.crossSegmentDosageForm!.includes(d.fdf))
      }
    } else if (filters.crossSegment === 'By Procurement') {
      if (filters.crossSegmentProcurementType && filters.crossSegmentProcurementType.length > 0) {
        filtered = filtered.filter(d => filters.crossSegmentProcurementType!.includes(d.publicPrivate))
      }
    } else if (filters.crossSegment === 'By Country') {
      if (filters.crossSegmentCountry && filters.crossSegmentCountry.length > 0) {
        filtered = filtered.filter(d => filters.crossSegmentCountry!.includes(d.country))
      }
    }
    
      let primarySegmentKey = ''
    if (filters.crossSegmentPrimary === 'By Brand') primarySegmentKey = 'brand'
    else if (filters.crossSegmentPrimary === 'By Age') primarySegmentKey = 'ageGroup'
    else if (filters.crossSegmentPrimary === 'By Gender') primarySegmentKey = 'gender'
    else if (filters.crossSegmentPrimary === 'By ROA') primarySegmentKey = 'roa'
    else if (filters.crossSegmentPrimary === 'By FDF') primarySegmentKey = 'fdf'
    else if (filters.crossSegmentPrimary === 'By Procurement') primarySegmentKey = 'publicPrivate'
    else if (filters.crossSegmentPrimary === 'By Country') primarySegmentKey = 'country'
      
      let crossSegmentKey = ''
      if (filters.crossSegment === 'By Brand') crossSegmentKey = 'brand'
      else if (filters.crossSegment === 'By Age') crossSegmentKey = 'ageGroup'
      else if (filters.crossSegment === 'By Gender') crossSegmentKey = 'gender'
    else if (filters.crossSegment === 'By ROA') crossSegmentKey = 'roa'
      else if (filters.crossSegment === 'By FDF') crossSegmentKey = 'fdf'
      else if (filters.crossSegment === 'By Procurement') crossSegmentKey = 'publicPrivate'
      else if (filters.crossSegment === 'By Country') crossSegmentKey = 'country'
      
      if (!primarySegmentKey || !crossSegmentKey) return []
    
    const primaryValues = [...new Set(filtered.map(d => d[primarySegmentKey as keyof typeof d] as string))].sort()
    const crossValues = [...new Set(filtered.map(d => d[crossSegmentKey as keyof typeof d] as string))].sort()
      
    // Create all combinations for granular display
      const combinations: string[] = []
      primaryValues.forEach((primaryValue) => {
        crossValues.forEach((crossValue) => {
          combinations.push(`${primaryValue} × ${crossValue}`)
        })
      })
      
    return combinations
  }, [standaloneCrossSegmentFilteredData, filters.crossSegmentPrimary, filters.crossSegment, filters.crossSegmentBrand, filters.crossSegmentAgeGroup, filters.crossSegmentGender, filters.crossSegmentRoa, filters.crossSegmentDosageForm, filters.crossSegmentProcurementType, filters.crossSegmentCountry])

  // KPIs
  const kpis = useMemo(() => {
    if (filteredData.length === 0) {
      return {
        totalValue: 'N/A',
        yoyGrowth: 'N/A',
      }
    }

    const totalValue = filteredData.reduce((sum, d) => sum + getDataValue(d), 0)

    // Calculate YoY Growth
    const years = [...new Set(filteredData.map(d => d.year))].sort()
    let yoyGrowth = 0
    if (years.length >= 2) {
      const latestYear = years[years.length - 1]
      const prevYear = years[years.length - 2]
      const latestValue = filteredData.filter(d => d.year === latestYear).reduce((sum, d) => sum + getDataValue(d), 0)
      const prevValue = filteredData.filter(d => d.year === prevYear).reduce((sum, d) => sum + getDataValue(d), 0)
      yoyGrowth = prevValue > 0 ? ((latestValue - prevValue) / prevValue) * 100 : 0
    }

    return {
      totalValue: filters.marketEvaluation === 'By Volume' 
        ? `${formatWithCommas(totalValue / 1000, 1)}K Units`
        : `${formatWithCommas(totalValue, 1)}M`,
      yoyGrowth: `${yoyGrowth > 0 ? '+' : ''}${formatWithCommas(yoyGrowth, 1)}%`,
    }
  }, [filteredData, filters.marketEvaluation])

  const updateFilter = (key: keyof MarketAnalysisFilters, value: any) => {
    let normalizedValue: any
    
    // Handle year separately - convert strings to numbers
    if (key === 'year') {
      normalizedValue = Array.isArray(value) 
        ? value.map(v => Number(v))
        : [Number(value)]
    } else {
      normalizedValue = Array.isArray(value) 
      ? value.map(v => String(v))
      : String(value)
    }
    
    const newFilters = { ...filters, [key]: normalizedValue }
    
    // Auto-select "By Type" segment when vaccineType is selected
    if (key === 'vaccineType' && Array.isArray(normalizedValue) && normalizedValue.length > 0) {
      newFilters.segment = 'By Type'
      
      // Get available types for the selected vaccine types
      const baseData = filterDataframe(data, {
        year: newFilters.year,
        disease: normalizedValue,
        country: newFilters.country,
      } as FilterOptions)
      const availableTypes = [...new Set(baseData.map(d => d.type))].sort()
      
      // Ensure at least 2 types are selected
      if (!newFilters.type || newFilters.type.length < 2) {
        if (availableTypes.length >= 2) {
          newFilters.type = availableTypes.slice(0, 2)
        } else if (availableTypes.length === 1) {
          newFilters.type = [availableTypes[0]]
        } else {
          newFilters.type = []
        }
      } else {
        // Keep only types that are still available
        const validTypes = newFilters.type.filter(b => availableTypes.includes(b))
        if (validTypes.length < 2 && availableTypes.length >= 2) {
          // If we have less than 2 valid types, add more to reach at least 2
          const neededTypes = availableTypes.filter(b => !validTypes.includes(b)).slice(0, 2 - validTypes.length)
          newFilters.type = [...validTypes, ...neededTypes].slice(0, Math.max(2, validTypes.length + neededTypes.length))
        } else if (validTypes.length > 0) {
          newFilters.type = validTypes
        } else if (availableTypes.length >= 2) {
          newFilters.type = availableTypes.slice(0, 2)
        } else {
          newFilters.type = availableTypes.slice(0, 1)
        }
      }
    }
    
    // Prevent clearing the last item in each filter category
    if (key === 'year' && Array.isArray(normalizedValue) && normalizedValue.length === 0 && uniqueOptions.years.length > 0) {
      const defaultYear = uniqueOptions.years.includes(2025) 
        ? 2025 
        : uniqueOptions.years[uniqueOptions.years.length - 1]
      newFilters.year = [defaultYear]
    } else if (key === 'vaccineType' && Array.isArray(normalizedValue) && normalizedValue.length === 0 && uniqueOptions.diseases.length > 0) {
      newFilters.vaccineType = [uniqueOptions.diseases[0]]
    } else if (key === 'country' && Array.isArray(normalizedValue) && normalizedValue.length === 0 && uniqueOptions.countries.length > 0) {
      newFilters.country = [uniqueOptions.countries[0]]
    }
    
    // Final safety check
    if (!newFilters.year || !Array.isArray(newFilters.year) || newFilters.year.length === 0) {
      if (uniqueOptions.years.length > 0) {
      const defaultYear = uniqueOptions.years.includes(2025) 
          ? 2025 
          : uniqueOptions.years[uniqueOptions.years.length - 1]
      newFilters.year = [defaultYear]
    }
    }
    if (!newFilters.vaccineType || !Array.isArray(newFilters.vaccineType) || newFilters.vaccineType.length === 0) {
      if (uniqueOptions.diseases.length > 0) {
      newFilters.vaccineType = [uniqueOptions.diseases[0]]
    }
    }
    if (!newFilters.country || !Array.isArray(newFilters.country) || newFilters.country.length === 0) {
      if (uniqueOptions.countries.length > 0) {
      newFilters.country = [uniqueOptions.countries[0]]
      }
    }
    
    setFilters(newFilters)
  }

  const updateMarketEvaluation = (value: MarketEvaluationType) => {
    const newFilters = { ...filters, marketEvaluation: value }
    
    // When switching to "By Volume", clear By Age and By Gender selections
    if (value === 'By Volume') {
      // Clear cross-segment primary if it's By Age or By Gender
      if (newFilters.crossSegmentPrimary === 'By Age' || newFilters.crossSegmentPrimary === 'By Gender') {
        delete newFilters.crossSegmentPrimary
        delete newFilters.crossSegmentPrimaryAgeGroup
        delete newFilters.crossSegmentPrimaryGender
      }
      // Clear cross-segment if it's By Age or By Gender
      if (newFilters.crossSegment === 'By Age' || newFilters.crossSegment === 'By Gender') {
        delete newFilters.crossSegment
        delete newFilters.crossSegmentAgeGroup
        delete newFilters.crossSegmentGender
      }
    }
    
    setFilters(newFilters)
  }

  const updateSegment = (value: SegmentType) => {
    const newFilters = { ...filters, segment: value }
    
    // Clear segment-specific filters when changing segment
    if (value !== 'By Type') {
      delete newFilters.type
    }
    if (value !== 'By Service Offering') {
      delete newFilters.serviceOffering
    }
    if (value !== 'By Care Option') {
      delete newFilters.careOption
    }
    if (value !== 'By Application') {
      delete newFilters.application
    }
    if (value !== 'By Gender') {
      delete newFilters.gender
    }
    if (value !== 'By Age Group') {
      delete newFilters.ageGroup
    }
    
    // Auto-select defaults based on segment type
    if (value === 'By Type' && (!newFilters.type || newFilters.type.length < 2)) {
      // If switching to "By Type", ensure at least 2 types are selected
      const baseData = filterDataframe(data, {
        year: newFilters.year,
        disease: newFilters.vaccineType,
        country: newFilters.country,
      } as FilterOptions)
      const availableTypes = [...new Set(baseData.map(d => d.type))].sort()
      if (availableTypes.length >= 2) {
        newFilters.type = availableTypes.slice(0, 2)
      } else if (availableTypes.length === 1) {
        newFilters.type = [availableTypes[0]]
      } else {
        newFilters.type = []
      }
    }
    
    // Reset cross-segment when main segment changes
    if (value === null || value === filters.segment) {
      // Keep cross-segment if same segment or clearing segment
    } else {
      // Clear cross-segment when changing main segment
      delete newFilters.crossSegment
    }
    
    setFilters(newFilters)
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onNavigate('Home')}
          className="flex items-center gap-2 px-5 py-2.5 bg-electric-blue text-white rounded-lg hover:bg-blue-600 transition-colors shadow-md"
        >
          <ArrowLeft size={20} />
          Back to Home
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={downloadCSV}
          className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md"
        >
          Download Data (CSV)
        </motion.button>
      </div>

      {/* Page Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <InfoTooltip content="• Provides insights into market value and volume analysis\n• Analyze data by segments, countries, and years (granular view)\n• Use filters to explore market trends\n• Charts show market value (US$ Million) or volume (Units) by selected segments\n• Understand market dynamics at granular level">
          <h1 className="text-4xl font-bold text-text-primary-light dark:text-text-primary-dark mb-3 cursor-help">
            Market Analysis
          </h1>
        </InfoTooltip>
        <p className="text-xl text-text-secondary-light dark:text-text-secondary-dark">
          Market value and volume analysis by segments, countries, and years
        </p>
      </motion.div>

      {!data || data.length === 0 ? (
        <div className={`p-8 rounded-2xl shadow-xl ${isDark ? 'bg-navy-card border-2 border-navy-light' : 'bg-white border-2 border-gray-300'}`}>
          <div className="text-center py-12">
            <p className="text-lg text-text-secondary-light dark:text-text-secondary-dark mb-4">
              No data available. Please check the data source.
            </p>
            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
              If this issue persists, please refresh the page or contact support.
            </p>
          </div>
        </div>
      ) : (
        <>
      <DemoNotice />

      {/* Filters Section */}
      <div className={`p-8 rounded-2xl mb-8 shadow-xl ${isDark ? 'bg-navy-card border-2 border-navy-light' : 'bg-white border-2 border-gray-300'}`}>
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-1 h-8 rounded-full ${isDark ? 'bg-cyan-accent' : 'bg-electric-blue'}`}></div>
            <h3 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
              Filter Data
            </h3>
          </div>
          <p className="text-base text-text-secondary-light dark:text-text-secondary-dark ml-4">
            Select filters to analyze market data. Changes will update all charts below.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <FilterDropdown
            label="Year"
            value={(filters.year || []).map(y => String(y))}
            onChange={(value) => setFilters({ ...filters, year: (value as string[]).map(v => Number(v)) })}
            options={uniqueOptions.years.map(y => String(y))}
          />
          <FilterDropdown
            label="By Service Offering"
            value={filters.serviceOffering || []}
            onChange={(value) => setFilters({ ...filters, serviceOffering: value as string[] })}
            options={uniqueOptions.serviceOfferings}
          />
          <FilterDropdown
            label="By Care Option"
            value={filters.careOption || []}
            onChange={(value) => setFilters({ ...filters, careOption: value as string[] })}
            options={uniqueOptions.careOptions}
          />
          <FilterDropdown
            label="By Application"
            value={filters.application || []}
            onChange={(value) => setFilters({ ...filters, application: value as string[] })}
            options={uniqueOptions.applications}
          />
          <FilterDropdown
            label="By Gender"
            value={filters.gender || []}
            onChange={(value) => setFilters({ ...filters, gender: value as string[] })}
            options={uniqueOptions.genders}
          />
          <FilterDropdown
            label="By Country"
            value={filters.country || []}
            onChange={(value) => setFilters({ ...filters, country: value as string[] })}
            options={uniqueOptions.countries}
          />
          <FilterDropdown
            label="By Age Group"
            value={filters.ageGroup || []}
            onChange={(value) => setFilters({ ...filters, ageGroup: value as string[] })}
            options={uniqueOptions.ageGroups}
          />
        </div>

        {/* Active Filters Display */}
        <div className="mt-6 pt-6 border-t-2 border-gray-300 dark:border-navy-light">
          <div className={`p-4 rounded-lg ${isDark ? 'bg-navy-dark' : 'bg-blue-50'}`}>
            <p className="text-base font-semibold text-text-primary-light dark:text-text-primary-dark mb-2">
              Currently Viewing:
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <div>
                <span className="font-medium text-text-secondary-light dark:text-text-secondary-dark">Service Offering:</span>
                <span className="ml-2 font-semibold text-electric-blue dark:text-cyan-accent">{activeFiltersLabel.serviceOffering}</span>
              </div>
              <div>
                <span className="font-medium text-text-secondary-light dark:text-text-secondary-dark">Care Option:</span>
                <span className="ml-2 font-semibold text-electric-blue dark:text-cyan-accent">{activeFiltersLabel.careOption}</span>
              </div>
              <div>
                <span className="font-medium text-text-secondary-light dark:text-text-secondary-dark">Application:</span>
                <span className="ml-2 font-semibold text-electric-blue dark:text-cyan-accent">{activeFiltersLabel.application}</span>
              </div>
              <div>
                <span className="font-medium text-text-secondary-light dark:text-text-secondary-dark">Gender:</span>
                <span className="ml-2 font-semibold text-electric-blue dark:text-cyan-accent">{activeFiltersLabel.gender}</span>
              </div>
              <div>
                <span className="font-medium text-text-secondary-light dark:text-text-secondary-dark">Country:</span>
                <span className="ml-2 font-semibold text-electric-blue dark:text-cyan-accent">{activeFiltersLabel.country}</span>
              </div>
              <div>
                <span className="font-medium text-text-secondary-light dark:text-text-secondary-dark">Age Group:</span>
                <span className="ml-2 font-semibold text-electric-blue dark:text-cyan-accent">{activeFiltersLabel.ageGroup}</span>
              </div>
              <div>
                <span className="font-medium text-text-secondary-light dark:text-text-secondary-dark">Evaluation:</span>
                <span className="ml-2 font-semibold text-electric-blue dark:text-cyan-accent">{activeFiltersLabel.marketEvaluation}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cross Segment Analysis Button Section - Between Filters and Key Metrics */}
      <div className={`p-8 rounded-2xl mb-8 shadow-xl ${isDark ? 'bg-navy-card border-2 border-navy-light' : 'bg-white border-2 border-gray-300'}`}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-3">
              Cross Segment Analysis
            </h3>
            <p className="text-base text-text-secondary-light dark:text-text-secondary-dark">
              Analyze relationships between different segments (e.g., Age × ROA, Brand × Gender) to understand how market dynamics vary across segment combinations.
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              const element = document.getElementById('cross-segment-analysis')
              if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }
            }}
            className="px-6 py-3 bg-electric-blue text-white rounded-lg hover:bg-blue-600 transition-colors shadow-md font-semibold whitespace-nowrap"
          >
            View Cross Segment Analysis
          </motion.button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="mb-10">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-1 h-8 rounded-full ${isDark ? 'bg-cyan-accent' : 'bg-electric-blue'}`}></div>
            <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
              Key Metrics
            </h2>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
          <div className={`p-7 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ${isDark ? 'bg-navy-card border-2 border-navy-light' : 'bg-white border-2 border-gray-200'}`}>
            <StatBox
              title={kpis.totalValue}
              subtitle={`Total ${filters.marketEvaluation === 'By Volume' ? 'Volume' : 'Market Value'}`}
            />
          </div>
        </div>
      </div>

      {/* Graph 1: Market Value by Type (grouped by Year) */}
      {marketValueByTypeData.length > 0 && (() => {
        const types = [...new Set(filteredData.map(d => d.type))].sort()
        
        return (
        <div className="mb-20">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-1 h-10 rounded-full ${isDark ? 'bg-cyan-accent' : 'bg-electric-blue'}`}></div>
                <InfoTooltip content={`• Shows ${filters.marketEvaluation === 'By Volume' ? 'market volume' : 'market value'} by care type grouped by year\n• X-axis: Year\n• Y-axis: ${filters.marketEvaluation === 'By Volume' ? 'Market Volume' : 'Market Value'}\n• Compare care type performance across years`}>
                <h2 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark cursor-help">
                    {filters.marketEvaluation === 'By Volume' ? 'Market Volume' : 'Market Value'} by Care Type
                </h2>
              </InfoTooltip>
            </div>
            <p className="text-base text-text-secondary-light dark:text-text-secondary-dark ml-4 mb-2">
                Care type performance comparison by year
            </p>
          </div>
          <div className={`p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 h-[550px] flex flex-col ${isDark ? 'bg-navy-card border-2 border-navy-light' : 'bg-white border-2 border-gray-200'}`}>
            <div className="mb-4 pb-4 border-b border-gray-200 dark:border-navy-light">
              <h3 className="text-lg font-bold text-electric-blue dark:text-cyan-accent mb-1">
                  {filters.marketEvaluation === 'By Volume' ? 'Market Volume' : 'Market Value'} Performance by Year
              </h3>
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                  {getDataLabel()}
              </p>
            </div>
            <div className="flex-1 flex items-center justify-center min-h-0 pt-2">
                <SegmentGroupedBarChart
                  data={marketValueByTypeData.map((entry) => ({
                    year: entry.year,
                    ...types.reduce((acc, type) => {
                      acc[type] = entry[type] as number || 0
                      return acc
                    }, {} as Record<string, number>)
                  }))}
                  segmentKeys={types}
                  xAxisLabel="Year"
                  yAxisLabel={getDataLabel()}
                />
            </div>
          </div>
        </div>
        )
      })()}

      {/* Graph 2: Market Value by Country by Year */}
      {marketValueByCountryData.length > 0 && (() => {
        const countries = [...new Set(filteredData.map(d => d.country))].sort()
        
        return (
        <div className="mb-20">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-1 h-10 rounded-full ${isDark ? 'bg-cyan-accent' : 'bg-electric-blue'}`}></div>
                <InfoTooltip content={`• Shows ${filters.marketEvaluation === 'By Volume' ? 'market volume' : 'market value'} by country grouped by year\n• X-axis: Country\n• Y-axis: ${filters.marketEvaluation === 'By Volume' ? 'Market Volume' : 'Market Value'}\n• Compare country performance across years`}>
                <h2 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark cursor-help">
                    {filters.marketEvaluation === 'By Volume' ? 'Market Volume' : 'Market Value'} by Country by Year
                </h2>
              </InfoTooltip>
            </div>
            <p className="text-base text-text-secondary-light dark:text-text-secondary-dark ml-4 mb-2">
              Country-wise breakdown grouped by year
            </p>
          </div>
          <div className={`p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 h-[550px] flex flex-col ${isDark ? 'bg-navy-card border-2 border-navy-light' : 'bg-white border-2 border-gray-200'}`}>
            <div className="mb-4 pb-4 border-b border-gray-200 dark:border-navy-light">
              <h3 className="text-lg font-bold text-electric-blue dark:text-cyan-accent mb-1">
                  {filters.marketEvaluation === 'By Volume' ? 'Market Volume' : 'Market Value'} Performance by Year
              </h3>
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                {getDataLabel()}
              </p>
            </div>
            <div className="flex-1 flex items-center justify-center min-h-0 pt-2">
                <SegmentGroupedBarChart
                  data={marketValueByCountryData.map((entry) => ({
                    year: entry.year,
                    ...countries.reduce((acc, country) => {
                      acc[country] = entry[country] as number || 0
                      return acc
                    }, {} as Record<string, number>)
                  }))}
                  segmentKeys={countries}
                xAxisLabel="Year"
                yAxisLabel={getDataLabel()}
              />
            </div>
          </div>
        </div>
        )
      })()}

      {/* Graph 3: Region chart showing percentage distribution of countries within each region */}
      {regionCountryPercentageData.length > 0 && (() => {
        return (
          <div className="mb-20">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-1 h-10 rounded-full ${isDark ? 'bg-cyan-accent' : 'bg-electric-blue'}`}></div>
                <InfoTooltip content={`• Shows percentage distribution of countries within each region\n• Each region shows what percentage each country contributes\n• Compare regional market share distribution`}>
                <h2 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark cursor-help">
                    {filters.marketEvaluation === 'By Volume' ? 'Market Volume' : 'Market Value'} by Region & Country
                </h2>
              </InfoTooltip>
            </div>
              {filters.marketEvaluation === 'By Value' && (
            <p className="text-base text-text-secondary-light dark:text-text-secondary-dark ml-4 mb-2">
                  Percentage distribution of countries within each region
                </p>
              )}
            </div>
            <div className={`p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 h-[550px] flex flex-col ${isDark ? 'bg-navy-card border-2 border-navy-light' : 'bg-white border-2 border-gray-200'}`}>
              <div className="mb-4 pb-4 border-b border-gray-200 dark:border-navy-light">
                <h3 className="text-lg font-bold text-electric-blue dark:text-cyan-accent mb-1">
                  Regional Distribution
                </h3>
              </div>
              <div className="flex-1 flex items-center justify-center min-h-0 pt-2">
                <RegionCountryStackedBarChart
                  data={regionCountryPercentageData.map(d => ({
                    region: d.region,
                    country: d.country,
                    value: filters.marketEvaluation === 'By Volume' ? d.value : d.percentage
                  }))}
                  dataKey="value"
                  xAxisLabel="Region"
                  yAxisLabel={filters.marketEvaluation === 'By Volume' ? 'Volume (Units)' : 'Percentage (%)'}
                  showPercentage={filters.marketEvaluation === 'By Value'}
                />
              </div>
            </div>
          </div>
        )
      })()}

      {/* Cross Segment Analysis Section */}
        <div id="cross-segment-analysis" className="mb-12">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-1 h-10 rounded-full ${isDark ? 'bg-cyan-accent' : 'bg-electric-blue'}`}></div>
            <InfoTooltip content="• Analyze data across two different segments\n• Select a primary segment and a cross segment\n• View how segments interact with each other">
                <h2 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark cursor-help">
                Cross Segment Analysis
                </h2>
              </InfoTooltip>
            </div>
            <p className="text-base text-text-secondary-light dark:text-text-secondary-dark ml-4 mb-2">
            Analyze relationships between different segments
            </p>
          </div>

        {/* Cross Segment Filters */}
        <div className={`p-8 rounded-2xl mb-8 shadow-xl ${isDark ? 'bg-navy-card border-2 border-navy-light' : 'bg-white border-2 border-gray-300'}`}>
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-1 h-8 rounded-full ${isDark ? 'bg-cyan-accent' : 'bg-electric-blue'}`}></div>
              <h3 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
                Cross Segment Filters
              </h3>
            </div>
            <p className="text-base text-text-secondary-light dark:text-text-secondary-dark ml-4">
              Select two segments to analyze their relationship.
              </p>
            </div>
          
          {/* Two Filter Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* First Filter: Primary Segment Selector */}
            <div className="w-full">
              <label className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-2">
                Segment
              </label>
              <select
                value={filters.crossSegmentPrimary || ''}
                onChange={(e) => {
                  const newPrimary = e.target.value as SegmentType || undefined
                  const newFilters: MarketAnalysisFilters = { ...filters, crossSegmentPrimary: newPrimary }
                  
                  // Clear cross-segment if it matches the new primary
                  if (newPrimary && filters.crossSegment === newPrimary) {
                    newFilters.crossSegment = undefined
                  }
                  
                  // Clear segment-specific filters when changing primary segment
                  delete newFilters.crossSegmentPrimaryType
                  delete newFilters.crossSegmentPrimaryServiceOffering
                  delete newFilters.crossSegmentPrimaryCareOption
                  delete newFilters.crossSegmentPrimaryApplication
                  delete newFilters.crossSegmentPrimaryAgeGroup
                  delete newFilters.crossSegmentPrimaryGender
                  
                  // Auto-populate defaults if needed
                  if (newPrimary === 'By Type') {
                    const availableTypes = [...new Set(filteredData.map(d => d.type))].sort()
                    if (availableTypes.length >= 2) {
                      newFilters.crossSegmentPrimaryType = availableTypes.slice(0, 2)
                    } else if (availableTypes.length === 1) {
                      newFilters.crossSegmentPrimaryType = [availableTypes[0]]
                    }
                  } else if (newPrimary === 'By Service Offering') {
                    const availableServiceOfferings = [...new Set(filteredData.map(d => d.serviceOffering))].sort()
                    if (availableServiceOfferings.length >= 2) {
                      newFilters.crossSegmentPrimaryServiceOffering = availableServiceOfferings.slice(0, 2)
                    } else if (availableServiceOfferings.length === 1) {
                      newFilters.crossSegmentPrimaryServiceOffering = [availableServiceOfferings[0]]
                    }
                  } else if (newPrimary === 'By Care Option') {
                    const availableCareOptions = [...new Set(filteredData.map(d => d.careOption))].sort()
                    if (availableCareOptions.length >= 2) {
                      newFilters.crossSegmentPrimaryCareOption = availableCareOptions.slice(0, 2)
                    } else if (availableCareOptions.length === 1) {
                      newFilters.crossSegmentPrimaryCareOption = [availableCareOptions[0]]
                    }
                  } else if (newPrimary === 'By Application') {
                    const availableApplications = [...new Set(filteredData.map(d => d.application))].sort()
                    if (availableApplications.length >= 2) {
                      newFilters.crossSegmentPrimaryApplication = availableApplications.slice(0, 2)
                    } else if (availableApplications.length === 1) {
                      newFilters.crossSegmentPrimaryApplication = [availableApplications[0]]
                    }
                  } else if (newPrimary === 'By Age Group') {
                    const availableAgeGroups = [...new Set(filteredData.map(d => d.ageGroup))].sort()
                    newFilters.crossSegmentPrimaryAgeGroup = availableAgeGroups
                  } else if (newPrimary === 'By Gender') {
                    const availableGenders = [...new Set(filteredData.map(d => d.gender))].sort()
                    newFilters.crossSegmentPrimaryGender = availableGenders
                  }
                  
                  setFilters(newFilters)
                }}
                className={`w-full px-4 py-2 rounded-lg border ${
                  isDark 
                    ? 'bg-navy-card border-navy-light text-text-primary-dark hover:border-electric-blue' 
                    : 'bg-white border-gray-300 text-text-primary-light hover:border-electric-blue'
                } focus:outline-none focus:ring-2 focus:ring-electric-blue transition-all`}
              >
                <option value="">Select Segment</option>
                {availablePrimarySegments.map((segment) => (
                  <option key={segment || ''} value={segment || ''}>
                    {segment}
                  </option>
                ))}
              </select>
          </div>

            {/* Second Filter: Cross Segment */}
            <div className="w-full">
              <label className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-2">
                Cross Segment{filters.crossSegmentPrimary ? ` (View ${filters.crossSegmentPrimary.replace('By ', '')} by:)` : ''}
              </label>
              <select
                value={filters.crossSegment || ''}
                onChange={(e) => {
                  const newCrossSegment = (e.target.value as SegmentType) || undefined
                  const newFilters: MarketAnalysisFilters = { ...filters, crossSegment: newCrossSegment }
                  
                  // Clear cross-segment specific filters when changing cross-segment
                  delete newFilters.crossSegmentType
                  delete newFilters.crossSegmentServiceOffering
                  delete newFilters.crossSegmentCareOption
                  delete newFilters.crossSegmentApplication
                  delete newFilters.crossSegmentAgeGroup
                  delete newFilters.crossSegmentGender
                  
                  // Auto-select all available options for the new cross-segment
                  if (newCrossSegment) {
                    if (newCrossSegment === 'By Type') {
                      const availableTypes = [...new Set(filteredData.map(d => d.type))].sort()
                      if (availableTypes.length >= 2) {
                        newFilters.crossSegmentType = availableTypes.slice(0, 2)
                      } else if (availableTypes.length === 1) {
                        newFilters.crossSegmentType = [availableTypes[0]]
                      }
                    } else if (newCrossSegment === 'By Service Offering') {
                      const availableServiceOfferings = [...new Set(filteredData.map(d => d.serviceOffering))].sort()
                      if (availableServiceOfferings.length >= 2) {
                        newFilters.crossSegmentServiceOffering = availableServiceOfferings.slice(0, 2)
                      } else if (availableServiceOfferings.length === 1) {
                        newFilters.crossSegmentServiceOffering = [availableServiceOfferings[0]]
                      }
                    } else if (newCrossSegment === 'By Care Option') {
                      const availableCareOptions = [...new Set(filteredData.map(d => d.careOption))].sort()
                      if (availableCareOptions.length >= 2) {
                        newFilters.crossSegmentCareOption = availableCareOptions.slice(0, 2)
                      } else if (availableCareOptions.length === 1) {
                        newFilters.crossSegmentCareOption = [availableCareOptions[0]]
                      }
                    } else if (newCrossSegment === 'By Application') {
                      const availableApplications = [...new Set(filteredData.map(d => d.application))].sort()
                      if (availableApplications.length >= 2) {
                        newFilters.crossSegmentApplication = availableApplications.slice(0, 2)
                      } else if (availableApplications.length === 1) {
                        newFilters.crossSegmentApplication = [availableApplications[0]]
                      }
                    } else if (newCrossSegment === 'By Age Group') {
                      const availableAgeGroups = [...new Set(filteredData.map(d => d.ageGroup))].sort()
                      newFilters.crossSegmentAgeGroup = availableAgeGroups
                    } else if (newCrossSegment === 'By Gender') {
                      const availableGenders = [...new Set(filteredData.map(d => d.gender))].sort()
                      newFilters.crossSegmentGender = availableGenders
                    }
                  }
                  
                  setFilters(newFilters)
                }}
                disabled={!filters.crossSegmentPrimary}
                className={`w-full px-4 py-2 rounded-lg border ${
                  isDark 
                    ? 'bg-navy-card border-navy-light text-text-primary-dark hover:border-electric-blue' 
                    : 'bg-white border-gray-300 text-text-primary-light hover:border-electric-blue'
                } focus:outline-none focus:ring-2 focus:ring-electric-blue transition-all ${!filters.crossSegmentPrimary ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <option value="">Select Cross Segment</option>
                {availableCrossSegmentsForStandalone.map((segment) => (
                  <option key={segment || ''} value={segment || ''}>
                    {segment}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Segment-Specific Sub-Filters */}
          {filters.crossSegmentPrimary === 'By Brand' && (
            <div className="mb-6 pt-4 border-t border-gray-300 dark:border-navy-light">
              <FilterDropdown
                label="Brand (Minimum 2 required)"
                value={(filters.crossSegmentPrimaryBrand || []) as string[]}
                onChange={(value) => {
                  if (!Array.isArray(value)) return
                  const brandValues = value as string[]
                  const currentBrands = (filters.crossSegmentPrimaryBrand || []) as string[]
                  
                  if (brandValues.length < 2 && uniqueOptions.brands.length >= 2) {
                    if (currentBrands.length >= 2) {
                      const newBrands = brandValues.filter(b => currentBrands.includes(b))
                      if (newBrands.length >= 2) {
                        setFilters({ ...filters, crossSegmentPrimaryBrand: newBrands })
                      } else {
                        setFilters({ ...filters, crossSegmentPrimaryBrand: currentBrands.slice(0, 2) })
                      }
                    } else {
                      const availableBrands = uniqueOptions.brands.filter(b => !currentBrands.includes(b))
                      const neededBrands = availableBrands.slice(0, Math.max(0, 2 - currentBrands.length))
                      setFilters({ ...filters, crossSegmentPrimaryBrand: [...currentBrands, ...neededBrands].slice(0, 2) })
                    }
                  } else if (brandValues.length >= 2) {
                    setFilters({ ...filters, crossSegmentPrimaryBrand: brandValues })
                  } else if (brandValues.length === 1 && uniqueOptions.brands.length === 1) {
                    setFilters({ ...filters, crossSegmentPrimaryBrand: brandValues })
                  } else if (brandValues.length > 0 && brandValues.length < 2 && uniqueOptions.brands.length >= 2) {
                    const availableBrands = uniqueOptions.brands.filter(b => !brandValues.includes(b))
                    const neededBrands = availableBrands.slice(0, 2 - brandValues.length)
                    setFilters({ ...filters, crossSegmentPrimaryBrand: [...brandValues, ...neededBrands].slice(0, 2) })
                  }
                }}
                options={uniqueOptions.brands}
              />
              </div>
            )}
          
          {filters.crossSegmentPrimary === 'By Age' && (
            <div className="mb-6 pt-4 border-t border-gray-300 dark:border-navy-light">
              <FilterDropdown
                label="Age Group"
                value={(filters.crossSegmentPrimaryAgeGroup || []) as string[]}
                onChange={(value) => setFilters({ ...filters, crossSegmentPrimaryAgeGroup: value as string[] })}
                options={uniqueOptions.ageGroups}
              />
          </div>
          )}
          
          {filters.crossSegmentPrimary === 'By Gender' && (
            <div className="mb-6 pt-4 border-t border-gray-300 dark:border-navy-light">
              <FilterDropdown
                label="Gender"
                value={(filters.crossSegmentPrimaryGender || []) as string[]}
                onChange={(value) => setFilters({ ...filters, crossSegmentPrimaryGender: value as string[] })}
                options={uniqueOptions.genders}
              />
                  </div>
          )}
          
          {filters.crossSegmentPrimary === 'By ROA' && (
            <div className="mb-6 pt-4 border-t border-gray-300 dark:border-navy-light">
              <FilterDropdown
                label="ROA"
                value={(filters.crossSegmentPrimaryRoa || []) as string[]}
                onChange={(value) => setFilters({ ...filters, crossSegmentPrimaryRoa: value as string[] })}
                options={uniqueOptions.roaTypes}
              />
                      </div>
                    )}
          
          {filters.crossSegmentPrimary === 'By FDF' && (
            <div className="mb-6 pt-4 border-t border-gray-300 dark:border-navy-light">
              <FilterDropdown
                label="Dosage Form"
                value={(filters.crossSegmentPrimaryDosageForm || []) as string[]}
                onChange={(value) => setFilters({ ...filters, crossSegmentPrimaryDosageForm: value as string[] })}
                options={uniqueOptions.fdfTypes}
              />
                  </div>
          )}
          
          {filters.crossSegmentPrimary === 'By Procurement' && (
            <div className="mb-6 pt-4 border-t border-gray-300 dark:border-navy-light">
              <FilterDropdown
                label="Procurement Type"
                value={(filters.crossSegmentPrimaryProcurementType || []) as string[]}
                onChange={(value) => setFilters({ ...filters, crossSegmentPrimaryProcurementType: value as string[] })}
                options={uniqueOptions.procurementTypes}
              />
            </div>
          )}

          {filters.crossSegmentPrimary === 'By Country' && (
            <div className="mb-6 pt-4 border-t border-gray-300 dark:border-navy-light">
              <FilterDropdown
                label="Country (Minimum 2 required)"
                value={(filters.crossSegmentPrimaryCountry || []) as string[]}
                onChange={(value) => {
                  if (!Array.isArray(value)) return
                  const countryValues = value as string[]
                  const currentCountries = (filters.crossSegmentPrimaryCountry || []) as string[]
                  
                  if (countryValues.length < 2 && uniqueOptions.countries.length >= 2) {
                    if (currentCountries.length >= 2) {
                      const newCountries = countryValues.filter(c => currentCountries.includes(c))
                      if (newCountries.length >= 2) {
                        setFilters({ ...filters, crossSegmentPrimaryCountry: newCountries })
                      } else {
                        setFilters({ ...filters, crossSegmentPrimaryCountry: currentCountries.slice(0, 2) })
                      }
                    } else {
                      const availableCountries = uniqueOptions.countries.filter(c => !currentCountries.includes(c))
                      const neededCountries = availableCountries.slice(0, Math.max(0, 2 - currentCountries.length))
                      setFilters({ ...filters, crossSegmentPrimaryCountry: [...currentCountries, ...neededCountries].slice(0, 2) })
                    }
                  } else if (countryValues.length >= 2) {
                    setFilters({ ...filters, crossSegmentPrimaryCountry: countryValues })
                  }
                }}
                options={uniqueOptions.countries}
              />
            </div>
          )}

          {/* Cross Segment Sub-Filters */}
          {filters.crossSegment === 'By Brand' && (
            <div className="mb-6 pt-4 border-t border-gray-300 dark:border-navy-light">
              <FilterDropdown
                label="Cross Segment Brand (Minimum 2 required)"
                value={(filters.crossSegmentBrand || []) as string[]}
                onChange={(value) => {
                  if (!Array.isArray(value)) return
                  const brandValues = value as string[]
                  const currentBrands = (filters.crossSegmentBrand || []) as string[]
                  
                  if (brandValues.length < 2 && uniqueOptions.brands.length >= 2) {
                    if (currentBrands.length >= 2) {
                      const newBrands = brandValues.filter(b => currentBrands.includes(b))
                      if (newBrands.length >= 2) {
                        setFilters({ ...filters, crossSegmentBrand: newBrands })
                      } else {
                        setFilters({ ...filters, crossSegmentBrand: currentBrands.slice(0, 2) })
                      }
                    } else {
                      const availableBrands = uniqueOptions.brands.filter(b => !currentBrands.includes(b))
                      const neededBrands = availableBrands.slice(0, Math.max(0, 2 - currentBrands.length))
                      setFilters({ ...filters, crossSegmentBrand: [...currentBrands, ...neededBrands].slice(0, 2) })
                    }
                  } else if (brandValues.length >= 2) {
                    setFilters({ ...filters, crossSegmentBrand: brandValues })
                  }
                }}
                options={uniqueOptions.brands}
              />
              </div>
          )}

          {filters.crossSegment === 'By Age' && (
            <div className="mb-6 pt-4 border-t border-gray-300 dark:border-navy-light">
              <FilterDropdown
                label="Cross Segment Age Group"
                value={(filters.crossSegmentAgeGroup || []) as string[]}
                onChange={(value) => setFilters({ ...filters, crossSegmentAgeGroup: value as string[] })}
                options={uniqueOptions.ageGroups}
              />
            </div>
          )}

          {filters.crossSegment === 'By Gender' && (
            <div className="mb-6 pt-4 border-t border-gray-300 dark:border-navy-light">
              <FilterDropdown
                label="Cross Segment Gender"
                value={(filters.crossSegmentGender || []) as string[]}
                onChange={(value) => setFilters({ ...filters, crossSegmentGender: value as string[] })}
                options={uniqueOptions.genders}
              />
            </div>
          )}

          {filters.crossSegment === 'By ROA' && (
            <div className="mb-6 pt-4 border-t border-gray-300 dark:border-navy-light">
              <FilterDropdown
                label="Cross Segment ROA"
                value={(filters.crossSegmentRoa || []) as string[]}
                onChange={(value) => setFilters({ ...filters, crossSegmentRoa: value as string[] })}
                options={uniqueOptions.roaTypes}
              />
            </div>
          )}

          {filters.crossSegment === 'By FDF' && (
            <div className="mb-6 pt-4 border-t border-gray-300 dark:border-navy-light">
              <FilterDropdown
                label="Cross Segment Dosage Form"
                value={(filters.crossSegmentDosageForm || []) as string[]}
                onChange={(value) => setFilters({ ...filters, crossSegmentDosageForm: value as string[] })}
                options={uniqueOptions.fdfTypes}
              />
                      </div>
          )}

          {filters.crossSegment === 'By Procurement' && (
            <div className="mb-6 pt-4 border-t border-gray-300 dark:border-navy-light">
              <FilterDropdown
                label="Cross Segment Procurement Type"
                value={(filters.crossSegmentProcurementType || []) as string[]}
                onChange={(value) => setFilters({ ...filters, crossSegmentProcurementType: value as string[] })}
                options={uniqueOptions.procurementTypes}
                        />
                      </div>
          )}

          {filters.crossSegment === 'By Country' && (
            <div className="mb-6 pt-4 border-t border-gray-300 dark:border-navy-light">
              <FilterDropdown
                label="Cross Segment Country (Minimum 2 required)"
                value={(filters.crossSegmentCountry || []) as string[]}
                onChange={(value) => {
                  if (!Array.isArray(value)) return
                  const countryValues = value as string[]
                  const currentCountries = (filters.crossSegmentCountry || []) as string[]
                  
                  if (countryValues.length < 2 && uniqueOptions.countries.length >= 2) {
                    if (currentCountries.length >= 2) {
                      const newCountries = countryValues.filter(c => currentCountries.includes(c))
                      if (newCountries.length >= 2) {
                        setFilters({ ...filters, crossSegmentCountry: newCountries })
                      } else {
                        setFilters({ ...filters, crossSegmentCountry: currentCountries.slice(0, 2) })
                      }
                    } else {
                      const availableCountries = uniqueOptions.countries.filter(c => !currentCountries.includes(c))
                      const neededCountries = availableCountries.slice(0, Math.max(0, 2 - currentCountries.length))
                      setFilters({ ...filters, crossSegmentCountry: [...currentCountries, ...neededCountries].slice(0, 2) })
                    }
                  } else if (countryValues.length >= 2) {
                    setFilters({ ...filters, crossSegmentCountry: countryValues })
                  }
                }}
                options={uniqueOptions.countries}
              />
            </div>
          )}
          
          {/* Analysis Status */}
          {filters.crossSegmentPrimary && filters.crossSegment && (
            <div className={`p-4 rounded-lg ${isDark ? 'bg-navy-dark' : 'bg-blue-50'}`}>
              <p className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">
                Analyzing: <span className="text-electric-blue dark:text-cyan-accent">{filters.crossSegmentPrimary}</span> × <span className="text-electric-blue dark:text-cyan-accent">{filters.crossSegment}</span>
              </p>
                    </div>
          )}
                  </div>

        {/* Cross Segment Analysis Chart */}
        {filters.crossSegmentPrimary && filters.crossSegment && crossSegmentAnalysisData.length > 0 && crossSegmentDataKeys.length > 0 && (
          <div className="mb-20" id="cross-segment-analysis">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-1 h-10 rounded-full ${isDark ? 'bg-cyan-accent' : 'bg-electric-blue'}`}></div>
                <h2 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark">
                  Cross Segment Analysis: {filters.crossSegmentPrimary} × {filters.crossSegment}
                </h2>
              </div>
              <p className="text-base text-text-secondary-light dark:text-text-secondary-dark ml-4 mb-2">
                Analyzing {filters.crossSegmentPrimary.replace('By ', '')} breakdown by {filters.crossSegment.replace('By ', '')}
              </p>
            </div>
            <div className={`p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 h-[550px] flex flex-col ${isDark ? 'bg-navy-card border-2 border-navy-light' : 'bg-white border-2 border-gray-200'}`}>
              <div className="mb-4 pb-4 border-b border-gray-200 dark:border-navy-light">
                <h3 className="text-lg font-bold text-electric-blue dark:text-cyan-accent mb-1">
                  {filters.marketEvaluation === 'By Volume' ? 'Market Volume' : 'Market Value'} by {filters.crossSegmentPrimary.replace('By ', '')} and {filters.crossSegment.replace('By ', '')}
                </h3>
                <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                  {getDataLabel()} • Stacked bars show {filters.crossSegment.replace('By ', '')} breakdown for each {filters.crossSegmentPrimary.replace('By ', '')}
                </p>
              </div>
              <div className="flex-1 flex items-center justify-center min-h-0">
                <CrossSegmentStackedBarChart
                  data={crossSegmentAnalysisData}
                  dataKeys={crossSegmentDataKeys}
                  xAxisLabel={filters.crossSegmentPrimary.replace('By ', '')}
                  yAxisLabel={getDataLabel()}
                  nameKey="name"
                />
              </div>
            </div>
          </div>
        )}
      </div>
            </>
      )}
    </div>
  )
}
