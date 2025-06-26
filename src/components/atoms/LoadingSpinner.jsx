import { motion } from 'framer-motion'
import ApperIcon from '../ApperIcon'

const LoadingSpinner = ({ 
  size = 'md', 
  color = 'primary',
  text,
  className = '' 
}) => {
  const sizes = {
    sm: 16,
    md: 24,
    lg: 32,
    xl: 48
  }
  
  const colors = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    success: 'text-success',
    warning: 'text-warning',
    error: 'text-error',
    gray: 'text-surface-400'
  }

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className={colors[color]}
      >
        <ApperIcon name="Loader2" size={sizes[size]} />
      </motion.div>
      {text && (
        <p className="mt-2 text-sm text-surface-600">{text}</p>
      )}
    </div>
  )
}

export default LoadingSpinner