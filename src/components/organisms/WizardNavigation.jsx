import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { routeArray } from '@/config/routes'
import ApperIcon from '../ApperIcon'

const WizardNavigation = () => {
  const location = useLocation()
  
  const currentStepIndex = routeArray.findIndex(route => route.path === location.pathname)
  
  return (
    <div className="flex items-center justify-center py-4 border-t border-surface-200">
      <div className="flex items-center space-x-8">
        {routeArray.map((route, index) => {
          const isActive = index === currentStepIndex
          const isCompleted = index < currentStepIndex
          const isAccessible = index <= currentStepIndex + 1
          
          return (
            <div key={route.id} className="flex items-center">
              {/* Step Circle */}
              <motion.div
                animate={{
                  backgroundColor: isCompleted ? '#10B981' : isActive ? '#3B82F6' : '#E2E8F0',
                  borderColor: isCompleted ? '#10B981' : isActive ? '#3B82F6' : '#CBD5E1',
                  scale: isActive ? 1.1 : 1
                }}
                transition={{ duration: 0.2 }}
                className={`
                  relative flex items-center justify-center w-10 h-10 rounded-full border-2
                  ${isAccessible ? 'cursor-pointer' : 'cursor-not-allowed'}
                `}
              >
                {isCompleted ? (
                  <ApperIcon 
                    name="Check" 
                    size={16} 
                    className="text-white"
                  />
                ) : (
                  <ApperIcon 
                    name={route.icon} 
                    size={16} 
                    className={isActive ? 'text-white' : 'text-surface-400'}
                  />
                )}
                
                {/* Active Step Pulse */}
                {isActive && (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 rounded-full bg-primary"
                  />
                )}
              </motion.div>
              
              {/* Step Label */}
              <div className="ml-3">
                <p className={`
                  text-sm font-medium
                  ${isActive ? 'text-primary' : isCompleted ? 'text-success' : 'text-surface-500'}
                `}>
                  Step {route.step}
                </p>
                <p className={`
                  text-xs
                  ${isActive ? 'text-surface-900' : 'text-surface-600'}
                `}>
                  {route.label}
                </p>
              </div>
              
              {/* Connector Line */}
              {index < routeArray.length - 1 && (
                <motion.div
                  animate={{
                    backgroundColor: index < currentStepIndex ? '#10B981' : '#E2E8F0'
                  }}
                  transition={{ duration: 0.3 }}
                  className="w-12 h-0.5 mx-6"
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default WizardNavigation