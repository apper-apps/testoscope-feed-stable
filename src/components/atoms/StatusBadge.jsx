import { motion } from 'framer-motion'

const StatusBadge = ({ status, size = 'md', className = '' }) => {
  const statusConfig = {
    low: {
      color: 'bg-error text-white',
      label: 'Low'
    },
    'suboptimal-low': {
      color: 'bg-warning text-white',
      label: 'Suboptimal'
    },
    optimal: {
      color: 'bg-success text-white',
      label: 'Optimal'
    },
    'suboptimal-high': {
      color: 'bg-warning text-white',
      label: 'Suboptimal'
    },
    high: {
      color: 'bg-error text-white',
      label: 'High'
    },
    unknown: {
      color: 'bg-surface-400 text-white',
      label: 'Unknown'
    }
  }

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  }

  const config = statusConfig[status] || statusConfig.unknown
  const sizeClasses = sizes[size]

  return (
    <motion.span
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className={`
        inline-flex items-center rounded-full font-medium
        ${config.color} ${sizeClasses} ${className}
      `}
    >
      {config.label}
    </motion.span>
  )
}

export default StatusBadge