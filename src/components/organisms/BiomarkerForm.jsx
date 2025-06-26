import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import biomarkerService from '@/services/api/biomarkerService'
import FormField from '../molecules/FormField'
import CollapsibleSection from '../molecules/CollapsibleSection'
import Button from '../atoms/Button'
import SkeletonLoader from '../molecules/SkeletonLoader'
import ErrorState from '../molecules/ErrorState'

const BiomarkerForm = ({ 
  values = {}, 
  onChange, 
  onSubmit,
  loading = false 
}) => {
  const [biomarkers, setBiomarkers] = useState([])
  const [biomarkerLoading, setBiomarkerLoading] = useState(false)
  const [error, setError] = useState(null)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    const loadBiomarkers = async () => {
      setBiomarkerLoading(true)
      setError(null)
      try {
        const result = await biomarkerService.getAll()
        setBiomarkers(result)
      } catch (err) {
        setError(err.message || 'Failed to load biomarkers')
        toast.error('Failed to load biomarkers')
      } finally {
        setBiomarkerLoading(false)
      }
    }
    loadBiomarkers()
  }, [])

  const groupedBiomarkers = biomarkers.reduce((groups, biomarker) => {
    const category = biomarker.category
    if (!groups[category]) {
      groups[category] = []
    }
    groups[category].push(biomarker)
    return groups
  }, {})

  const categoryIcons = {
    'Core Hormones': 'Activity',
    'Thyroid': 'Zap',
    'Cardiovascular': 'Heart',
    'Metabolic': 'TrendingUp',
    'Blood Health': 'Droplets',
    "Men's Health": 'User'
  }

  const handleFieldChange = (biomarkerId, value, unit = null) => {
    const newValues = {
      ...values,
      [biomarkerId]: {
        markerId: biomarkerId,
        value: parseFloat(value) || 0,
        unit: unit || 'default'
      }
    }
    onChange(newValues)
    
    // Clear error for this field
    if (errors[biomarkerId]) {
      setErrors(prev => ({ ...prev, [biomarkerId]: null }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    let hasErrors = false

    // Check required core hormones
    const requiredMarkers = [1, 2, 3, 4, 5] // Core hormone IDs
    requiredMarkers.forEach(markerId => {
      if (!values[markerId] || !values[markerId].value) {
        const biomarker = biomarkers.find(b => b.Id === markerId)
        if (biomarker) {
          newErrors[markerId] = `${biomarker.name} is required`
          hasErrors = true
        }
      }
    })

    setErrors(newErrors)
    return !hasErrors
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(values)
    } else {
      toast.error('Please fill in all required fields')
    }
  }

  if (biomarkerLoading) {
    return (
      <div className="space-y-6">
        <SkeletonLoader count={5} height="h-20" />
      </div>
    )
  }

  if (error) {
    return (
      <ErrorState 
        message={error}
        onRetry={() => window.location.reload()}
      />
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {Object.entries(groupedBiomarkers).map(([category, categoryBiomarkers]) => (
        <CollapsibleSection
          key={category}
          title={category}
          icon={categoryIcons[category] || 'FileText'}
          count={categoryBiomarkers.length}
          defaultOpen={category === 'Core Hormones'}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categoryBiomarkers.map((biomarker, index) => (
              <motion.div
                key={biomarker.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <FormField
                  label={biomarker.name}
                  type="number"
                  step="0.01"
                  placeholder="Enter value"
                  value={values[biomarker.Id]?.value || ''}
                  onChange={(e) => handleFieldChange(biomarker.Id, e.target.value)}
                  error={errors[biomarker.Id]}
                  required={[1, 2, 3, 4, 5].includes(biomarker.Id)}
                  unit={biomarker.units[0]}
                />
                <p className="text-xs text-surface-500 mt-1">
                  {biomarker.description}
                </p>
              </motion.div>
            ))}
          </div>
        </CollapsibleSection>
      ))}
      
      <div className="flex justify-between pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
        >
          Back
        </Button>
        
        <Button
          type="submit"
          loading={loading}
          icon="ArrowRight"
          iconPosition="right"
        >
          Analyze Results
        </Button>
      </div>
    </form>
  )
}

export default BiomarkerForm