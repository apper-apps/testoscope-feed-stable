import biomarkerService from './biomarkerService'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class PatternService {
  async analyzePattern(testResults, age = 35) {
    await delay(500)
    
    const patterns = await this.identifyPatterns(testResults, age)
    const primaryPattern = this.selectPrimaryPattern(patterns)
    const recommendations = await this.generateRecommendations(primaryPattern, testResults, age)
    
    return {
      pattern: primaryPattern,
      allPatterns: patterns,
      recommendations,
      confidence: primaryPattern.confidence,
      keyMarkers: primaryPattern.keyMarkers
    }
  }

  async identifyPatterns(testResults, age) {
    const patterns = []
    
    // Central Hypogonadism Pattern
    const centralPattern = await this.checkCentralHypogonadism(testResults, age)
    if (centralPattern.confidence > 0.3) patterns.push(centralPattern)
    
    // Primary Hypogonadism Pattern
    const primaryPattern = await this.checkPrimaryHypogonadism(testResults, age)
    if (primaryPattern.confidence > 0.3) patterns.push(primaryPattern)
    
    // SHBG Issues Pattern
    const shbgPattern = await this.checkSHBGIssues(testResults, age)
    if (shbgPattern.confidence > 0.3) patterns.push(shbgPattern)
    
    // Mixed Pattern
    const mixedPattern = await this.checkMixedPattern(testResults, age)
    if (mixedPattern.confidence > 0.3) patterns.push(mixedPattern)
    
    // Normal/Optimal Pattern
    if (patterns.length === 0) {
      patterns.push(await this.checkOptimalPattern(testResults, age))
    }
    
    return patterns
  }

  async checkCentralHypogonadism(testResults, age) {
    const testosterone = this.getMarkerValue(testResults, 'testosterone')
    const lh = this.getMarkerValue(testResults, 'lh')
    const fsh = this.getMarkerValue(testResults, 'fsh')
    
    let confidence = 0
    const keyMarkers = []
    
    if (testosterone && testosterone.status === 'low') {
      confidence += 0.4
      keyMarkers.push('testosterone')
      
      if (lh && (lh.status === 'low' || lh.status === 'optimal')) {
        confidence += 0.3
        keyMarkers.push('lh')
      }
      
      if (fsh && (fsh.status === 'low' || fsh.status === 'optimal')) {
        confidence += 0.3
        keyMarkers.push('fsh')
      }
    }
    
    return {
      type: 'Central Hypogonadism',
      confidence: Math.min(confidence, 1.0),
      keyMarkers,
      description: 'Low testosterone with low or normal LH/FSH indicates potential brain or pituitary dysfunction',
      likelyCulprit: 'Hypothalamic-pituitary axis dysfunction',
      contributingFactors: ['Stress', 'Sleep disorders', 'Medications', 'Pituitary issues']
    }
  }

  async checkPrimaryHypogonadism(testResults, age) {
    const testosterone = this.getMarkerValue(testResults, 'testosterone')
    const lh = this.getMarkerValue(testResults, 'lh')
    const fsh = this.getMarkerValue(testResults, 'fsh')
    
    let confidence = 0
    const keyMarkers = []
    
    if (testosterone && testosterone.status === 'low') {
      confidence += 0.4
      keyMarkers.push('testosterone')
      
      if (lh && lh.status === 'high') {
        confidence += 0.3
        keyMarkers.push('lh')
      }
      
      if (fsh && fsh.status === 'high') {
        confidence += 0.3
        keyMarkers.push('fsh')
      }
    }
    
    return {
      type: 'Primary Hypogonadism',
      confidence: Math.min(confidence, 1.0),
      keyMarkers,
      description: 'Low testosterone with elevated LH/FSH indicates testicular dysfunction',
      likelyCulprit: 'Testicular dysfunction or damage',
      contributingFactors: ['Age-related decline', 'Varicocele', 'Previous infections', 'Genetic factors']
    }
  }

  async checkSHBGIssues(testResults, age) {
    const testosterone = this.getMarkerValue(testResults, 'testosterone')
    const freeTestosterone = this.getMarkerValue(testResults, 'free_testosterone')
    const shbg = this.getMarkerValue(testResults, 'shbg')
    
    let confidence = 0
    const keyMarkers = []
    
    if (testosterone && testosterone.status === 'optimal' && 
        freeTestosterone && freeTestosterone.status === 'low') {
      confidence += 0.5
      keyMarkers.push('testosterone', 'free_testosterone')
      
      if (shbg && shbg.status === 'high') {
        confidence += 0.4
        keyMarkers.push('shbg')
      }
    }
    
    return {
      type: 'SHBG Binding Issues',
      confidence: Math.min(confidence, 1.0),
      keyMarkers,
      description: 'Normal total testosterone but low free testosterone suggests binding protein issues',
      likelyCulprit: 'Elevated SHBG reducing bioavailable testosterone',
      contributingFactors: ['Liver dysfunction', 'Thyroid issues', 'Aging', 'Medications']
    }
  }

  async checkMixedPattern(testResults, age) {
    const abnormalMarkers = Object.values(testResults).filter(marker => 
      marker.status === 'low' || marker.status === 'high'
    )
    
    let confidence = 0
    const keyMarkers = []
    
    if (abnormalMarkers.length >= 3) {
      confidence = 0.6 + (abnormalMarkers.length * 0.1)
      keyMarkers.push(...abnormalMarkers.slice(0, 5).map(m => m.markerId))
    }
    
    return {
      type: 'Mixed Pattern',
      confidence: Math.min(confidence, 1.0),
      keyMarkers,
      description: 'Multiple abnormalities across different hormone systems',
      likelyCulprit: 'Complex multi-system dysfunction',
      contributingFactors: ['Metabolic syndrome', 'Chronic stress', 'Multiple health conditions', 'Lifestyle factors']
    }
  }

  async checkOptimalPattern(testResults, age) {
    const optimalMarkers = Object.values(testResults).filter(marker => 
      marker.status === 'optimal'
    )
    
    return {
      type: 'Optimal Pattern',
      confidence: 0.8,
      keyMarkers: optimalMarkers.slice(0, 3).map(m => m.markerId),
      description: 'Hormone levels within optimal ranges for health and vitality',
      likelyCulprit: 'Excellent hormone health',
      contributingFactors: ['Good lifestyle habits', 'Proper nutrition', 'Regular exercise', 'Adequate sleep']
    }
  }

  selectPrimaryPattern(patterns) {
    return patterns.reduce((primary, current) => 
      current.confidence > primary.confidence ? current : primary
    )
  }

  async generateRecommendations(pattern, testResults, age) {
    const recommendations = []
    
    switch (pattern.type) {
      case 'Central Hypogonadism':
        recommendations.push(
          'Consult endocrinologist for pituitary evaluation',
          'Sleep study if sleep issues present',
          'Stress management and cortisol testing',
          'Review medications affecting hormones'
        )
        break
      case 'Primary Hypogonadism':
        recommendations.push(
          'Testosterone replacement therapy evaluation',
          'Testicular ultrasound if indicated',
          'Lifestyle optimization for testosterone',
          'Follow-up testing in 3-6 months'
        )
        break
      case 'SHBG Binding Issues':
        recommendations.push(
          'Liver function assessment',
          'Thyroid optimization',
          'Consider free testosterone supplementation',
          'Dietary modifications to lower SHBG'
        )
        break
      case 'Mixed Pattern':
        recommendations.push(
          'Comprehensive metabolic evaluation',
          'Lifestyle modification program',
          'Specialist consultation recommended',
          'Systematic approach to multiple issues'
        )
        break
      default:
        recommendations.push(
          'Maintain current healthy lifestyle',
          'Annual hormone monitoring',
          'Continue exercise and nutrition focus',
          'Preventive health optimization'
        )
    }
    
    return recommendations
  }

  getMarkerValue(testResults, markerId) {
    return testResults[markerId] || null
  }
}

export default new PatternService()