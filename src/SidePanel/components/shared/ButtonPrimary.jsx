function ButtonPrimary(props)
{

  return (
    <button className="px-2 py-4 bg-blue-400 hover:bg-blue-500 rounded" onClick={props.onClick}>
      {props.children}
    </button>
  )
}
export default ButtonPrimary;