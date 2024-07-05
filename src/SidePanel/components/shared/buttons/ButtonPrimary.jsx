function ButtonPrimary({children, onClick})
{
  return (
    <button className="px-4 py-2 w-full bg-blue-500 hover:bg-blue-400 hover:shadow active:shadow-inner rounded" onClick={onClick}>
      {children}
    </button>
  )
}
export default ButtonPrimary;