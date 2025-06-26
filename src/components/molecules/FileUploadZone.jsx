import { useState } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '../ApperIcon'
import Button from '../atoms/Button'

const FileUploadZone = ({ 
  onFileSelect, 
  accept = '.pdf',
  maxSize = 10 * 1024 * 1024, // 10MB
  loading = false,
  error = null,
  className = ''
}) => {
  const [dragging, setDragging] = useState(false)

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    
    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files)
    handleFiles(files)
  }

  const handleFiles = (files) => {
    if (files.length === 0) return

    const file = files[0]
    
    // Validate file type
    if (!file.type.includes('pdf')) {
      onFileSelect(null, 'Only PDF files are allowed')
      return
    }
    
    // Validate file size
    if (file.size > maxSize) {
      onFileSelect(null, `File size must be less than ${maxSize / (1024 * 1024)}MB`)
      return
    }
    
    onFileSelect(file, null)
  }

  return (
    <div className={className}>
      <motion.div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        animate={{
          borderColor: dragging ? '#3B82F6' : error ? '#EF4444' : '#CBD5E1',
          backgroundColor: dragging ? '#EFF6FF' : '#FFFFFF',
          scale: dragging ? 1.02 : 1
        }}
        transition={{ duration: 0.2 }}
        className={`
          border-2 border-dashed rounded-xl p-8 text-center transition-all
          ${loading ? 'pointer-events-none opacity-50' : 'cursor-pointer hover:bg-surface-50'}
        `}
      >
        {loading ? (
          <div className="space-y-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <ApperIcon name="Loader2" className="w-12 h-12 mx-auto text-primary" />
            </motion.div>
            <p className="text-surface-600">Processing your PDF...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <motion.div
              animate={{ y: dragging ? -5 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ApperIcon 
                name="Upload" 
                className={`w-12 h-12 mx-auto ${dragging ? 'text-primary' : 'text-surface-400'}`} 
              />
            </motion.div>
            
            <div>
              <p className="text-lg font-medium text-surface-900 mb-2">
                {dragging ? 'Drop your PDF here' : 'Upload your blood test results'}
              </p>
              <p className="text-surface-600 mb-4">
                Drag and drop your PDF file here, or click to browse
              </p>
              
              <input
                type="file"
                accept={accept}
                onChange={handleFileInput}
                className="hidden"
                id="file-upload"
              />
              
              <Button
                as="label"
                htmlFor="file-upload"
                variant="outline"
                icon="FolderOpen"
                className="cursor-pointer"
              >
                Choose File
              </Button>
            </div>
            
            <p className="text-sm text-surface-500">
              PDF files only, maximum 10MB
            </p>
          </div>
        )}
      </motion.div>
      
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-error/10 border border-error/20 rounded-lg"
        >
          <div className="flex items-center text-error">
            <ApperIcon name="AlertCircle" size={16} className="mr-2" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default FileUploadZone