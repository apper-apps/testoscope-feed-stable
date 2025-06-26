import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import EmptyState from '../molecules/EmptyState'

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-96 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <EmptyState
          icon="MapPin"
          title="Page Not Found"
          description="The page you're looking for doesn't exist. Let's get you back to analyzing your hormone health."
          actionLabel="Start Analysis"
          onAction={() => navigate('/')}
        />
      </motion.div>
    </div>
  )
}

export default NotFound