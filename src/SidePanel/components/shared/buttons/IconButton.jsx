function IconButton({animated = false, children, onClick}) {
  return (
    <button className={`h-fit text-blue-600 rounded hover:text-blue-500 hover:shadow active:shadow-inner active:text-blue-400 ${animated && "animate__animated animate__fadeIn"}`} onClick={onClick}>
      {children}
    </button>
  )
}

export default IconButton;