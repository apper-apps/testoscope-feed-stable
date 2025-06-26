import { useState } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '../ApperIcon'

const Input = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  disabled = false,
  required = false,
  icon,
  unit,
  className = '',
  ...props
}) => {
  const [focused, setFocused] = useState(false)
  const hasValue = value && value.toString().length > 0

  return (
    <div className={`relative ${className}`}>
      {/* Floating Label */}
      {label && (
        <motion.label
          initial={false}
          animate={{
            scale: focused || hasValue ? 0.85 : 1,
            y: focused || hasValue ? -24 : 0,
            color: focused ? '#3B82F6' : error ? '#EF4444' : '#64748B'
          }}
          transition={{ duration: 0.2 }}
          className="absolute left-3 top-3 pointer-events-none origin-left font-medium"
        >
          {label} {required && <span className="text-error">*</span>}
        </motion.label>
      )}

      <div className="relative">
        {/* Icon */}
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400">
            <ApperIcon name={icon} size={16} />
          </div>
        )}

        {/* Input Field */}
        <input
          type={type}
          placeholder={focused ? placeholder : ''}
          value={value || ''}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={disabled}
          className={`
            w-full px-3 py-3 border rounded-lg transition-colors
            ${icon ? 'pl-10' : ''}
            ${unit ? 'pr-16' : ''}
            ${error 
              ? 'border-error focus:border-error focus:ring-error' 
              : 'border-surface-300 focus:border-primary focus:ring-primary'
            }
            ${disabled ? 'bg-surface-100 cursor-not-allowed' : 'bg-white'}
            focus:outline-none focus:ring-2 focus:ring-opacity-20
          `}
          {...props}
        />

        {/* Unit Display */}
        {unit && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-surface-500 text-sm font-medium">
            {unit}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-sm text-error flex items-center"
        >
          <ApperIcon name="AlertCircle" size={14} className="mr-1" />
          {error}
        </motion.p>
      )}
    </div>
  )
}

export default Input