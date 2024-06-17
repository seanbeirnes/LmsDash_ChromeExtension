function Header({children}) {
  return (
    <div className="fixed top-0 grid grid-cols-6 p-2 bg-white shadow w-full h-16">
      <div>{children}</div>
      <div className="flex col-span-4 items-center justify-center text-blue-600 font-bold text-2xl animate__animated animate__fadeIn">
        <img className="max-h-12" src="/img/icon-color.svg" alt="LMS Dash logo" /> LMS Dash
      </div>
      <div></div>
    </div>
  )
}
export default Header