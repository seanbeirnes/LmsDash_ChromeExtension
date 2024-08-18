function PrimaryCard({children, className = "", fixedWidth=true, minHeight = true})
{
  return (
    <div className={`grid grid-cols-1 grid-flow-row ${minHeight ? "min-h-72" : ""} min-w-72 bg-gray-50 p-4 rounded-lg ${fixedWidth ? "w-72" : ""} ${className}`}>
      {children}
    </div>
  )
}

export default PrimaryCard;