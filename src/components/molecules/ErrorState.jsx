import { motion } from 'framer-motion'
import ApperIcon from '../ApperIcon'
import Button from '../atoms/Button'

const ErrorState = ({ 
  message = 'Something went wrong',
  onRetry,
  className = ''
}) => {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className={`text-center py-12 ${className}`}
    >
      <div className="mb-6">
        <ApperIcon name="AlertTriangle" className="w-16 h-16 text-error mx-auto" />
      </div>
      
      <h3 className="text-lg font-medium text-surface-900 mb-2">Error</h3>
      <p className="text-surface-600 mb-6 max-w-sm mx-auto">{message}</p>
      
      {onRetry && (
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button onClick={onRetry} variant="outline" icon="RefreshCw">
            Try Again
          </Button>
        </motion.div>
      )}
    </motion.div>
  )
}

export default ErrorState