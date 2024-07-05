function IconButton({animated = false, children, onClick, className="text-blue-600 hover:text-blue-500 active:text-blue-400 hover:shadow active:shadow-inner"}) {
  return (
    <button className={`h-fit rounded ${className} ${animated && "animate__animated animate__fadeIn"}`} onClick={onClick}>
      {children}
    </button>
  )
}

export default IconButton;