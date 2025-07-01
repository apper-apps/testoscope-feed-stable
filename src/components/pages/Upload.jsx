import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import testResultService from '@/services/api/testResultService'
import FileUploadZone from '../molecules/FileUploadZone'
import Card from '../atoms/Card'
import Button from '../atoms/Button'
import ApperIcon from '../ApperIcon'

const Upload = () => {
  const navigate = useNavigate()
  const [file, setFile] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState(null)

  const handleFileSelect = (selectedFile, fileError) => {
    setFile(selectedFile)
    setError(fileError)
  }

  const simulateAIProcessing = async () => {
    // Simulate AI processing with delays and status updates
    const steps = [
      'Analyzing PDF structure...',
      'Extracting text content...',
      'Identifying biomarkers...',
      'Parsing laboratory values...',
      'Validating data accuracy...',
      'Processing complete!'
    ]

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800))
      if (i === steps.length - 1) {
        // Simulate successful processing
        const mockData = {
          1: { markerId: 1, value: 18.5, unit: 'nmol/L', status: 'suboptimal-low' },
          2: { markerId: 2, value: 0.28, unit: 'nmol/L', status: 'suboptimal-low' },
          3: { markerId: 3, value: 12.3, unit: 'IU/L', status: 'high' },
          4: { markerId: 4, value: 15.2, unit: 'IU/L', status: 'high' },
          5: { markerId: 5, value: 45.2, unit: 'nmol/L', status: 'optimal' }
        }
        await testResultService.saveTestResults(mockData)
        toast.success('PDF processed successfully!')
        navigate('/input')
      }
    }
  }

  const handleProcessFile = async () => {
    if (!file) return

    setProcessing(true)
    setError(null)

    try {
      await simulateAIProcessing()
    } catch (err) {
      setError('Failed to process PDF. Please try manual entry.')
      toast.error('PDF processing failed')
    } finally {
      setProcessing(false)
    }
  }

  const handleManualEntry = () => {
    // Clear any existing data and proceed to manual entry
    testResultService.clearCurrentResults()
    navigate('/input')
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold text-surface-900 mb-4">
          Upload Your Blood Test Results
        </h1>
        <p className="text-lg text-surface-600 max-w-2xl mx-auto">
          Upload your PDF blood test report and let our AI extract and analyze your hormone markers. 
          We'll identify patterns and provide personalized insights for your hormone health journey.
        </p>
      </motion.div>
{/* Privacy Statement */}
      <div className="mb-8 p-4 bg-surface-50 border border-surface-200 rounded-lg">
        <div className="flex items-center justify-center">
          <div className="flex items-center space-x-6 text-sm text-surface-600">
            <div className="flex items-center">
              <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></span>
              <span>Your Privacy</span>
            </div>
            <div className="flex items-center">
              <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></span>
              <span>Session-only storage</span>
            </div>
            <div className="flex items-center">
              <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></span>
              <span>No permanent data retention</span>
            </div>
            <div className="flex items-center">
              <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></span>
              <span>Secure processing</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="">
          <Card className="p-8 border-2 border-surface-200">
            <FileUploadZone
              onFileSelect={handleFileSelect}
              loading={processing}
              error={error}
            />

            {file && !processing && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-success/10 border border-success/20 rounded-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <ApperIcon name="FileCheck" size={20} className="text-success mr-3" />
                    <div>
                      <p className="font-medium text-success">File Ready</p>
                      <p className="text-sm text-surface-600">{file.name}</p>
                    </div>
                  </div>
                  <Button onClick={handleProcessFile} size="sm">
                    Process PDF
                  </Button>
                </div>
              </motion.div>
            )}
          </Card>
        </div>

        {/* Manual Entry Option */}
        <div className="">
          <Card className="p-6 border-2 border-surface-200 h-full">
            <h3 className="font-semibold text-surface-900 mb-3 flex items-center">
              <ApperIcon name="Edit" size={18} className="mr-2 text-warning" />
              Manual Entry
            </h3>
            <p className="text-sm text-surface-600 mb-4">
              Don't have a PDF or experiencing issues? Enter your values manually.
            </p>
            <Button 
              variant="outline" 
              onClick={handleManualEntry}
              className="w-full"
              icon="ArrowRight"
            >
              Enter Manually
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Upload