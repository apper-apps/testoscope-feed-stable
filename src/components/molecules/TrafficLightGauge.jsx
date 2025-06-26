import { motion } from 'framer-motion'

const TrafficLightGauge = ({ 
  value, 
  ranges,
  unit,
  title,
  size = 'md',
  className = ''
}) => {
  const getStatusColor = (value, ranges) => {
    if (value < ranges.low) return '#EF4444' // red
    if (value < ranges.suboptimalLow) return '#F59E0B' // yellow
    if (value <= ranges.optimal) return '#10B981' // green
    if (value <= ranges.suboptimalHigh) return '#F59E0B' // yellow
    return '#EF4444' // red
  }

  const getStatusLabel = (value, ranges) => {
    if (value < ranges.low) return 'Low'
    if (value < ranges.suboptimalLow) return 'Suboptimal'
    if (value <= ranges.optimal) return 'Optimal'
    if (value <= ranges.suboptimalHigh) return 'Suboptimal'
    return 'High'
  }

  const getPercentage = (value, ranges) => {
    const max = ranges.high
    const min = 0
    return Math.min(Math.max((value / max) * 100, 0), 100)
  }

  const statusColor = getStatusColor(value, ranges)
  const statusLabel = getStatusLabel(value, ranges)
  const percentage = getPercentage(value, ranges)
  
  const sizes = {
    sm: { gauge: 80, stroke: 6, text: 'text-sm' },
    md: { gauge: 120, stroke: 8, text: 'text-base' },
    lg: { gauge: 160, stroke: 10, text: 'text-lg' }
  }
  
  const config = sizes[size]
  const radius = (config.gauge - config.stroke) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="relative">
        <svg 
          width={config.gauge} 
          height={config.gauge} 
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={config.gauge / 2}
            cy={config.gauge / 2}
            r={radius}
            fill="transparent"
            stroke="#E2E8F0"
            strokeWidth={config.stroke}
          />
          
          {/* Progress circle */}
          <motion.circle
            cx={config.gauge / 2}
            cy={config.gauge / 2}
            r={radius}
            fill="transparent"
            stroke={statusColor}
            strokeWidth={config.stroke}
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
          />
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="text-center"
          >
            <div className={`font-bold text-surface-900 ${config.text}`}>
              {value}
            </div>
            {unit && (
              <div className="text-xs text-surface-500 mt-1">
                {unit}
              </div>
            )}
          </motion.div>
        </div>
      </div>
      
      <div className="mt-4 text-center">
        {title && (
          <h3 className="font-medium text-surface-900 mb-2">{title}</h3>
        )}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
          className={`
            inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white
          `}
          style={{ backgroundColor: statusColor }}
        >
          {statusLabel}
        </motion.div>
      </div>
    </div>
  )
}

export default TrafficLightGauge