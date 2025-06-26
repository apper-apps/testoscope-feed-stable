import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from '../ApperIcon'

const CollapsibleSection = ({ 
  title, 
  children, 
  defaultOpen = false,
  icon,
  count,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className={`border border-surface-200 rounded-xl overflow-hidden ${className}`}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ backgroundColor: '#F8FAFC' }}
        className="w-full px-6 py-4 text-left flex items-center justify-between bg-white border-b border-surface-200 last:border-b-0"
      >
        <div className="flex items-center">
          {icon && (
            <ApperIcon name={icon} size={20} className="mr-3 text-primary" />
          )}
          <span className="font-medium text-surface-900">{title}</span>
          {count !== undefined && (
            <span className="ml-2 px-2 py-1 bg-surface-100 text-surface-600 text-xs rounded-full">
              {count}
            </span>
          )}
        </div>
        
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ApperIcon name="ChevronDown" size={20} className="text-surface-400" />
        </motion.div>
      </motion.button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="p-6 bg-surface-50">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default CollapsibleSection