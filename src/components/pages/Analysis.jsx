import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import testResultService from '@/services/api/testResultService'
import biomarkerService from '@/services/api/biomarkerService'
import PatternAnalysis from '../organisms/PatternAnalysis'
import Button from '../atoms/Button'
import Card from '../atoms/Card'
import LoadingSpinner from '../atoms/LoadingSpinner'
import ErrorState from '../molecules/ErrorState'
import EmptyState from '../molecules/EmptyState'

const Analysis = () => {
  const navigate = useNavigate()
  const [analysis, setAnalysis] = useState(null)
  const [testResults, setTestResults] = useState({})
  const [biomarkers, setBiomarkers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadAnalysisData = async () => {
      setLoading(true)
      setError(null)
      
      try {
        // Load analysis results
        const analysisData = sessionStorage.getItem('testoscope_analysis')
        if (!analysisData) {
          setError('No analysis data found. Please complete the input step first.')
          return
        }
        
        const parsedAnalysis = JSON.parse(analysisData)
        setAnalysis(parsedAnalysis)
        
        // Load test results
        const results = await testResultService.getCurrentResults()
        if (!results || Object.keys(results).length === 0) {
          setError('No test results found. Please complete the input step first.')
          return
        }
        setTestResults(results)
        
        // Load biomarkers
        const biomarkerData = await biomarkerService.getAll()
        setBiomarkers(biomarkerData)
        
      } catch (err) {
        console.error('Failed to load analysis data:', err)
        setError('Failed to load analysis results')
        toast.error('Failed to load analysis results')
      } finally {
        setLoading(false)
      }
    }
    
    loadAnalysisData()
  }, [])

  const handleStartOver = () => {
    // Clear all session data
    testResultService.clearCurrentResults()
    sessionStorage.removeItem('testoscope_analysis')
    navigate('/')
    toast.info('Analysis cleared. Starting fresh.')
  }

  const handleBackToInput = () => {
    navigate('/input')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="xl" text="Analyzing your results..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <ErrorState 
          message={error}
          onRetry={() => navigate('/input')}
        />
      </div>
    )
  }

  if (!analysis || !testResults || Object.keys(testResults).length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <EmptyState
          icon="FileX"
          title="No Analysis Available"
          description="We couldn't find any test results to analyze. Please complete the input step first."
          actionLabel="Go to Input"
          onAction={() => navigate('/input')}
        />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold text-surface-900 mb-4">
          Your Hormone Analysis Results
        </h1>
        <p className="text-lg text-surface-600 max-w-2xl mx-auto">
          Based on your blood test values, we've identified patterns and provided personalized recommendations 
          to help optimize your hormone health.
        </p>
      </motion.div>

      {/* Analysis Results */}
      <PatternAnalysis 
        analysis={analysis}
        testResults={testResults}
        biomarkers={biomarkers}
      />

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="mt-12"
      >
        <Card className="p-8 text-center bg-gradient-to-br from-surface-50 to-primary/5">
          <h3 className="text-xl font-semibold text-surface-900 mb-4">
            What's Next?
          </h3>
          <p className="text-surface-600 mb-6 max-w-2xl mx-auto">
            Take these results to your healthcare provider to discuss next steps. 
            Consider retesting in 3-6 months to track your progress.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="outline"
              onClick={handleBackToInput}
              icon="Edit"
            >
              Modify Values
            </Button>
            
            <Button
              variant="primary"
              onClick={handleStartOver}
              icon="RotateCcw"
            >
              New Analysis
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Disclaimer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
        className="mt-8 p-6 bg-warning/10 border border-warning/20 rounded-lg"
      >
        <div className="flex items-start">
          <div className="flex-shrink-0 mr-3">
            ⚠️
          </div>
          <div>
            <h4 className="font-medium text-warning-800 mb-2">Medical Disclaimer</h4>
            <p className="text-sm text-warning-700">
              This analysis is for educational purposes only and should not replace professional medical advice. 
              Always consult with a qualified healthcare provider before making any medical decisions or changes to your treatment.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Analysis