import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { GoHome, GoSignOut, GoGrabber , GoX } from "react-icons/go"
import { IoPeopleSharp } from "react-icons/io5"
import { MdOutlineCardTravel, MdManageAccounts } from "react-icons/md"
import { CiCircleList } from "react-icons/ci"
import { FaRegCreditCard } from "react-icons/fa6"
import { LiaBlogSolid } from "react-icons/lia"

const SidBar = () => {
  const [isOpen, setIsOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [userRole, setUserRole] = useState(null)
  const [activeRoute, setActiveRoute] = useState("/")
  const navigate = useNavigate()
  const location = useLocation()

  // Check screen size and set mobile state
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024)
      setIsOpen(window.innerWidth >= 1024)
    }

    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)

    return () => {
      window.removeEventListener("resize", checkScreenSize)
    }
  }, [])

  // Set active route based on location
  useEffect(() => {
    setActiveRoute(location.pathname)
  }, [location])

  // Fetch user role from localStorage
  useEffect(() => {
    const role = localStorage.getItem("Role")
    if (role) {
      setUserRole(role)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("Role")
    setUserRole(null)
    navigate("/login")
  }

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  // Navigation items
  const navItems = [
    {
      name: "Accueil",
      path: "/",
      icon: <GoHome className="text-xl" />,
    },
    {
      name: "Ajouter Client",
      path: "/client",
      icon: <IoPeopleSharp className="text-xl" />,
    },
    {
      name: "Gestion du package",
      path: "/booking",
      icon: <MdOutlineCardTravel className="text-xl" />,
    },
    {
      name: "List Traite",
      path: "/kembyel",
      icon: <CiCircleList className="text-xl" />,
    },
    // {
    //   name: "List credit",
    //   path: "/credit",
    //   icon: <FaRegCreditCard className="text-xl" />,
    // },
    {
      name: "Ajouter Depence",
      path: "/depence",
      icon: <MdManageAccounts className="text-xl" />,
    }
 
  ]

  // Determine if a route is active
  const isActive = (path) => {
    return activeRoute === path
  }

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <button
        onClick={toggleSidebar}
        className={`lg:hidden fixed top-4 ${isOpen ? "left-64" : "left-4"} z-50 p-2 rounded-full bg-sky-600 text-white shadow-lg transition-all duration-300`}
      >
        {isOpen ? <GoX size={24} /> : <GoGrabber  size={24} />}
      </button>

      {/* Overlay for mobile when sidebar is open */}
      {isMobile && isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30" onClick={() => setIsOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-40
          bg-white dark:bg-gray-800 shadow-xl
          transition-all duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
          w-72 lg:w-64
          flex flex-col
          border-r border-gray-200 dark:border-gray-700
        `}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-center">
            <img src="/placeholder.svg?height=40&width=120" alt="SlimaTour Logo" className="h-10 object-contain" />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={() => isMobile && setIsOpen(false)}
                  className={`
                    flex items-center px-4 py-3 rounded-lg
                    transition-all duration-200
                    ${
                      isActive(item.path)
                        ? "bg-sky-100 text-sky-600 dark:bg-sky-900 dark:text-sky-300 font-medium"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }
                  `}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span className="text-sm">{item.name}</span>
                  {isActive(item.path) && (
                    <span className="ml-auto w-1.5 h-6 rounded-full bg-sky-600 dark:bg-sky-400"></span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer with Logout */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleLogout}
            className="
              w-full flex items-center justify-center gap-2
              bg-gradient-to-r from-sky-600 to-sky-500 
              hover:from-sky-700 hover:to-sky-600
              text-white py-3 px-4 rounded-lg
              transition-all duration-200 transform hover:scale-[1.02]
              shadow-md hover:shadow-lg
            "
          >
            <GoSignOut className="text-lg" />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Content Spacer - to push content away from sidebar */}
      <div className={`lg:pl-64 transition-all duration-300`}></div>
    </>
  )
}

export default SidBar
