import {BackpackIcon, MagnifyingGlassIcon, RocketIcon} from "@radix-ui/react-icons";

function Main(props)
{
  return (
  <main className="absolute -z-10 top-16 w-full min-h-[calc(100vh-100px)] pb-8 grid grid-cols-1 grid-rows-1 place-items-center text-base text-gray-700 animate__animated animate__zoomIn">
    {props.children}
  </main>
  )
}

export default Main;