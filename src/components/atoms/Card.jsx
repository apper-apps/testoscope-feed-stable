import { motion } from 'framer-motion'

const Card = ({ 
  children, 
  className = '', 
  hover = false,
  onClick,
  ...props 
}) => {
  const baseClasses = 'bg-white rounded-xl border border-surface-200 shadow-sm'
  const hoverClasses = hover ? 'hover:shadow-md cursor-pointer' : ''
  
  const cardClasses = `${baseClasses} ${hoverClasses} ${className}`

  if (onClick || hover) {
    return (
      <motion.div
        whileHover={{ y: hover ? -2 : 0, scale: hover ? 1.01 : 1 }}
        whileTap={{ scale: onClick ? 0.99 : 1 }}
        className={cardClasses}
        onClick={onClick}
        {...props}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <div className={cardClasses} {...props}>
      {children}
    </div>
  )
}

export default Card