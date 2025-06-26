import biomarkerData from '../mockData/biomarkers.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class BiomarkerService {
  async getAll() {
    await delay(200)
    return [...biomarkerData]
  }

  async getById(id) {
    await delay(200)
    const biomarker = biomarkerData.find(item => item.Id === parseInt(id, 10))
    return biomarker ? { ...biomarker } : null
  }

  async getByCategory(category) {
    await delay(200)
    return biomarkerData.filter(item => item.category === category)
  }

  async calculateStatus(markerId, value, age = 35) {
    await delay(200)
    const biomarker = biomarkerData.find(item => item.Id === parseInt(markerId, 10))
    if (!biomarker) return 'unknown'

    const ranges = biomarker.optimalRange
    const ageAdjustedRanges = this.getAgeAdjustedRanges(biomarker, age)

    if (value < ageAdjustedRanges.low) return 'low'
    if (value < ageAdjustedRanges.suboptimalLow) return 'suboptimal-low'
    if (value <= ageAdjustedRanges.optimal) return 'optimal'
    if (value <= ageAdjustedRanges.suboptimalHigh) return 'suboptimal-high'
    return 'high'
  }

  getAgeAdjustedRanges(biomarker, age) {
    const baseRanges = biomarker.optimalRange
    const ageAdjustment = biomarker.ageAdjustment || { rate: 0, startAge: 30 }
    
    if (age <= ageAdjustment.startAge) {
      return baseRanges
    }

    const yearsAfterStart = age - ageAdjustment.startAge
    const adjustmentFactor = 1 + (ageAdjustment.rate * yearsAfterStart / 100)

    return {
      ...baseRanges,
      low: baseRanges.low * adjustmentFactor,
      suboptimalLow: baseRanges.suboptimalLow * adjustmentFactor,
      optimal: baseRanges.optimal * adjustmentFactor,
      suboptimalHigh: baseRanges.suboptimalHigh * adjustmentFactor,
      high: baseRanges.high * adjustmentFactor
    }
  }
}

export default new BiomarkerService()