import { motion } from 'framer-motion'
import ApperIcon from '../ApperIcon'
import Button from '../atoms/Button'

const EmptyState = ({ 
  icon = 'FileText',
  title,
  description,
  actionLabel,
  onAction,
  className = ''
}) => {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className={`text-center py-12 ${className}`}
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        className="mb-6"
      >
        <ApperIcon name={icon} className="w-16 h-16 text-surface-300 mx-auto" />
      </motion.div>
      
      {title && (
        <h3 className="text-lg font-medium text-surface-900 mb-2">{title}</h3>
      )}
      
      {description && (
        <p className="text-surface-600 mb-6 max-w-sm mx-auto">{description}</p>
      )}
      
      {actionLabel && onAction && (
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button onClick={onAction} variant="primary">
            {actionLabel}
          </Button>
        </motion.div>
      )}
    </motion.div>
  )
}

export default EmptyState