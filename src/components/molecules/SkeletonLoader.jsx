import { motion } from 'framer-motion'

const SkeletonLoader = ({ 
  count = 1, 
  height = 'h-4',
  className = '' 
}) => {
  return (
    <div className={className}>
      {[...Array(count)].map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 }}
          className={`bg-gradient-to-r from-surface-200 via-surface-300 to-surface-200 rounded ${height} mb-4 last:mb-0`}
          style={{
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite'
          }}
        />
      ))}
      
      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  )
}

export default SkeletonLoader