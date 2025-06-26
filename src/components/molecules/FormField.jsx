import Input from '../atoms/Input'

const FormField = ({ 
  label, 
  value, 
  onChange, 
  error, 
  type = 'text',
  placeholder,
  required = false,
  disabled = false,
  icon,
  unit,
  className = ''
}) => {
  return (
    <div className={className}>
      <Input
        label={label}
        type={type}
        value={value}
        onChange={onChange}
        error={error}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        icon={icon}
        unit={unit}
      />
    </div>
  )
}

export default FormField