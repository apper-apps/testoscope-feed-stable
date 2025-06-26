import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import testResultService from '@/services/api/testResultService'
import biomarkerService from '@/services/api/biomarkerService'
import patternService from '@/services/api/patternService'
import BiomarkerForm from '../organisms/BiomarkerForm'
import Card from '../atoms/Card'
import LoadingSpinner from '../atoms/LoadingSpinner'

const Input = () => {
  const navigate = useNavigate()
  const [testResults, setTestResults] = useState({})
  const [age, setAge] = useState(35)
  const [loading, setLoading] = useState(false)
  const [initialLoad, setInitialLoad] = useState(true)

  useEffect(() => {
    const loadExistingResults = async () => {
      try {
        const existing = await testResultService.getCurrentResults()
        if (existing && Object.keys(existing).length > 0) {
          setTestResults(existing)
        }
      } catch (err) {
        console.error('Failed to load existing results:', err)
      } finally {
        setInitialLoad(false)
      }
    }
    loadExistingResults()
  }, [])

  const handleFormChange = (newValues) => {
    setTestResults(newValues)
  }

  const handleSubmit = async (values) => {
    setLoading(true)
    
    try {
      // Calculate status for each marker
      const processedResults = {}
      
      for (const [markerId, result] of Object.entries(values)) {
        const status = await biomarkerService.calculateStatus(markerId, result.value, age)
        processedResults[markerId] = {
          ...result,
          status
        }
      }

      // Save processed results
      await testResultService.saveTestResults(processedResults)
      
      // Generate analysis
      const analysis = await patternService.analyzePattern(processedResults, age)
      
      // Save analysis results
      sessionStorage.setItem('testoscope_analysis', JSON.stringify(analysis))
      
      toast.success('Analysis complete! Reviewing your results...')
      navigate('/analysis')
      
    } catch (err) {
      console.error('Analysis failed:', err)
      toast.error('Failed to analyze results. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (initialLoad) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" text="Loading form..." />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold text-surface-900 mb-4">
          Enter Your Test Values
        </h1>
        <p className="text-lg text-surface-600 max-w-2xl mx-auto">
          Fill in your blood test values below. Required core hormone markers are highlighted. 
          We'll analyze your results and identify patterns to provide personalized insights.
        </p>
      </motion.div>

      {/* Age Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-8"
      >
        <Card className="p-6">
          <div className="flex items-center space-x-6">
            <div>
              <label className="block text-sm font-medium text-surface-900 mb-2">
                Your Age (for age-adjusted analysis)
              </label>
              <input
                type="number"
                min="18"
                max="100"
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value, 10) || 35)}
                className="w-24 px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
            <div className="text-sm text-surface-600">
              <p>Age is used to calculate optimal ranges based on natural hormone decline patterns.</p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Biomarker Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="p-8">
          <BiomarkerForm
            values={testResults}
            onChange={handleFormChange}
            onSubmit={handleSubmit}
            loading={loading}
          />
        </Card>
      </motion.div>

      {/* Help Text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-8 text-center"
      >
        <p className="text-sm text-surface-500">
          💡 Tip: Required fields are marked with an asterisk (*). 
          Optional markers help provide more comprehensive analysis but aren't necessary for pattern identification.
        </p>
      </motion.div>
    </div>
  )
}

export default Input