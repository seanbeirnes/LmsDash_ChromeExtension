function PrimaryCard({children, fixedWidth=true})
{
  return (
    <div className={`grid grid-cols-1 grid-flow-row min-h-72 min-w-72 bg-gray-50 p-4 rounded-lg ${fixedWidth && "w-72"}`}>
      {children}
    </div>
  )
}

export default PrimaryCard;