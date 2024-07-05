function ButtonPrimary({children, onClick, disabled= false})
{
  return (
    <button className={`${disabled ? "bg-gray-200 text-gray-700 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-400 hover:shadow active:shadow-inner"} 
    px-4 py-1.5 w-full text-base font-bold rounded`}
            onClick={onClick}
            disabled={disabled}>
      {children}
    </button>
  )
}
export default ButtonPrimary;