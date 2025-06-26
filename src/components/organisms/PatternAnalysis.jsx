import { motion } from 'framer-motion'
import Card from '../atoms/Card'
import StatusBadge from '../atoms/StatusBadge'
import TrafficLightGauge from '../molecules/TrafficLightGauge'
import CollapsibleSection from '../molecules/CollapsibleSection'
import ApperIcon from '../ApperIcon'

const PatternAnalysis = ({ analysis, testResults, biomarkers = [] }) => {
  if (!analysis || !analysis.pattern) {
    return null
  }

  const { pattern, recommendations, keyMarkers } = analysis

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return 'success'
    if (confidence >= 0.6) return 'warning'
    return 'error'
  }

  const getMarkerData = (markerId) => {
    const biomarker = biomarkers.find(b => b.Id === parseInt(markerId, 10))
    const result = testResults[markerId]
    return { biomarker, result }
  }

  return (
    <div className="space-y-8">
      {/* Executive Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="p-8 bg-gradient-to-br from-primary/5 to-accent/5">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-surface-900 mb-2">
                🧠 {pattern.type} Detected
              </h2>
              <p className="text-surface-600 max-w-2xl">
                {pattern.description}
              </p>
            </div>
            <StatusBadge 
              status={getConfidenceColor(pattern.confidence)}
              size="lg"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-surface-900 mb-2 flex items-center">
                <ApperIcon name="Target" size={16} className="mr-2" />
                🎯 The Likely Culprit
              </h3>
              <p className="text-surface-700">{pattern.likelyCulprit}</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-surface-900 mb-2 flex items-center">
                <ApperIcon name="GitBranch" size={16} className="mr-2" />
                🔄 Contributing Factors
              </h3>
              <ul className="text-surface-700 space-y-1">
                {pattern.contributingFactors?.map((factor, index) => (
                  <li key={index} className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></span>
                    {factor}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Key Markers */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="p-6">
          <h3 className="text-xl font-semibold text-surface-900 mb-6 flex items-center">
            <ApperIcon name="Key" size={20} className="mr-2" />
            🔑 Key Markers
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {keyMarkers?.map((markerId, index) => {
              const { biomarker, result } = getMarkerData(markerId)
              if (!biomarker || !result) return null

              return (
                <motion.div
                  key={markerId}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <TrafficLightGauge
                    value={result.value}
                    ranges={biomarker.optimalRange}
                    unit={result.unit}
                    title={biomarker.name}
                    size="sm"
                  />
                </motion.div>
              )
            })}
          </div>
        </Card>
      </motion.div>

      {/* Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <CollapsibleSection
          title="📋 Recommended Actions"
          icon="ClipboardList"
          defaultOpen={true}
        >
          <div className="space-y-4">
            {recommendations?.map((recommendation, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-start p-4 bg-white rounded-lg border border-surface-200"
              >
                <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                  <span className="text-primary font-semibold text-sm">
                    {index + 1}
                  </span>
                </div>
                <p className="text-surface-700 flex-1">{recommendation}</p>
              </motion.div>
            ))}
          </div>
        </CollapsibleSection>
      </motion.div>

      {/* All Markers Detail */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <CollapsibleSection
          title="📊 Detailed Marker Analysis"
          icon="BarChart3"
          count={Object.keys(testResults).length}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(testResults).map(([markerId, result], index) => {
              const { biomarker } = getMarkerData(markerId)
              if (!biomarker) return null

              return (
                <motion.div
                  key={markerId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="p-4 h-full">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-medium text-surface-900 text-sm">
                        {biomarker.name}
                      </h4>
                      <StatusBadge status={result.status} size="sm" />
                    </div>
                    
                    <div className="text-2xl font-bold text-surface-900 mb-1">
                      {result.value} <span className="text-sm font-normal text-surface-500">{result.unit}</span>
                    </div>
                    
                    <p className="text-xs text-surface-600">
                      {biomarker.description}
                    </p>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </CollapsibleSection>
      </motion.div>
    </div>
  )
}

export default PatternAnalysis