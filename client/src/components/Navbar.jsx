import { useState, useEffect } from "react";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItems,
  MenuItem,
} from "@headlessui/react";
import {
  Bars3Icon,
  BellIcon,
  XMarkIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";
import { NavLink, useNavigate } from "react-router-dom";
// import logo from "/logo.png";
import logo from "../assets/logo2.jpg";
import defaultImg from "/dp.png";

const publicNavigation = [
  { name: "Home", href: "/" },
  { name: "Chat with AI", href: "/chat" },
];

const privateNavigation = [
  { name: "Schemes", href: "/schemes" },
  { name: "Learn", href: "/learn" },
  { name: "Blogs", href: "/blogs" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const navigate = useNavigate();
  const [auth, setAuth] = useState({ auth: false }); // Default auth state

  useEffect(() => {
    const localAuth = localStorage.getItem("auth");
    if (!localAuth) {
      localStorage.setItem(
        "auth",
        JSON.stringify({ name: "", email: "", auth: false, role: "" })
      );
    }
    setAuth(JSON.parse(localAuth));
  }, []);

  const signOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("auth");
    setAuth({ auth: false });
    navigate("/");
    window.location.reload();
  };

  return (
    <Disclosure
      as="nav"
      className="bg-black bg-opacity-50 backdrop-blur-md shadow-md fixed top-0 left-0 w-full z-10"
    >
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-18 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <DisclosureButton className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-500 hover:bg-gray-200 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-600">
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="block h-6 w-6" />
              <XMarkIcon aria-hidden="true" className="hidden h-6 w-6" />
            </DisclosureButton>
          </div>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex flex-shrink-0 items-center">
              <img
                alt="Your Company"
                src={logo}
                className="h-[60px] w-[60px] bg-white rounded-full p-1 m-1 object-cover"
              />
            </div>
            <div className="hidden sm:ml-6 sm:flex items-center">
              <div className="flex space-x-4">
                {publicNavigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) =>
                      classNames(
                        isActive
                          ? "bg-white rounded-full text-black"
                          : "text-white hover:text-black",
                        "rounded-md px-3 py-2 text-sm font-medium transition-all duration-300"
                      )
                    }
                  >
                    {item.name}
                  </NavLink>
                ))}
                {auth.auth &&
                  privateNavigation.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      className={({ isActive }) =>
                        classNames(
                          isActive
                            ? "bg-white rounded-full text-black"
                            : "text-white hover:text-black",
                          "rounded-md px-3 py-2 text-sm font-medium transition-all duration-300"
                        )
                      }
                    >
                      {item.name}
                    </NavLink>
                  ))}
                {auth.auth && auth.role === "farmer" && (
                  <NavLink
                    to="/sell"
                    className={({ isActive }) =>
                      classNames(
                        isActive
                          ? "bg-white rounded-full text-black"
                          : "text-white hover:text-black",
                        "rounded-md px-3 py-2 text-sm font-medium transition-all duration-300"
                      )
                    }
                  >
                    Sell
                  </NavLink>
                )}
                {auth.auth && auth.role === "businessman" && (
                  <NavLink
                    to="/buy"
                    className={({ isActive }) =>
                      classNames(
                        isActive
                          ? "bg-white rounded-full text-black"
                          : "text-white hover:text-black",
                        "rounded-md px-3 py-2 text-sm font-medium transition-all duration-300"
                      )
                    }
                  >
                    Buy
                  </NavLink>
                )}
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center sm:static sm:inset-auto sm:ml-6 sm:pr-0 gap-2">
            {auth.auth ? (
              <>
                {auth.role === "businessman" && (
                  <button
                    type="button"
                    className="relative rounded-full bg-white p-1 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600"
                    onClick={() => navigate("/cart")}
                  >
                    <span className="sr-only">View notifications</span>
                    <ShoppingCartIcon aria-hidden="true" className="h-6 w-6" />
                  </button>
                )}
                <button
                  type="button"
                  className="relative rounded-full bg-white p-1 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600"
                >
                  <span className="sr-only">View notifications</span>
                  <BellIcon aria-hidden="true" className="h-6 w-6" />
                </button>

                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3">
                  <div>
                    <MenuButton className="relative flex rounded-full bg-white object-contain text-sm focus:outline-none focus:ring-2 focus:ring-gray-600">
                      <span className="sr-only">Open user menu</span>
                      <img
                        alt=""
                        src={auth.img || defaultImg}
                        className="h-12 w-12 rounded-full p-0 m-0 object-cover"
                      />
                    </MenuButton>
                  </div>

                  <MenuItems
                    as="div"
                    className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none max-h-60 overflow-y-auto"
                  >
                    <MenuItem disabled>
                      <div className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font-bold">
                        Hi!, {auth.name}
                      </div>
                    </MenuItem>
                    <MenuItem>
                      <a
                        href="#"
                        onClick={signOut}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sign out
                      </a>
                    </MenuItem>
                  </MenuItems>
                </Menu>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <NavLink to="/signin" className="text-white hover:text-black">
                  <button className="py-2 px-6 rounded-md text-white">
                    Sign in now to unlock additional features and enhance your
                    experience!
                  </button>
                </NavLink>
              </div>
            )}
          </div>
        </div>
      </div>

      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pb-3 pt-2">
          {publicNavigation.map((item) => (
            <DisclosureButton
              key={item.name}
              as={NavLink}
              to={item.href}
              className={({ isActive }) =>
                classNames(
                  isActive
                    ? "bg-white text-black"
                    : "text-white hover:text-black",
                  "block rounded-md px-3 py-2 text-base font-medium transition-all duration-300"
                )
              }
            >
              {item.name}
            </DisclosureButton>
          ))}
          {auth.auth &&
            privateNavigation.map((item) => (
              <DisclosureButton
                key={item.name}
                as={NavLink}
                to={item.href}
                className={({ isActive }) =>
                  classNames(
                    isActive
                      ? "bg-white text-black"
                      : "text-white hover:text-black",
                    "block rounded-md px-3 py-2 text-base font-medium transition-all duration-300"
                  )
                }
              >
                {item.name}
              </DisclosureButton>
            ))}
          {auth.auth && auth.role === "farmer" && (
            <DisclosureButton
              as={NavLink}
              to="/sell"
              className={({ isActive }) =>
                classNames(
                  isActive
                    ? "bg-white text-black rounded-md"
                    : "text-white hover:text-black",
                  "block rounded-md px-3 py-2 text-base font-medium transition-all duration-300"
                )
              }
            >
              Sell
            </DisclosureButton>
          )}
          {auth.auth && auth.role === "businessman" && (
            <DisclosureButton
              as={NavLink}
              to="/buy"
              className={({ isActive }) =>
                classNames(
                  isActive
                    ? "bg-white text-black rounded-md"
                    : "text-white hover:text-black",
                  "block rounded-md px-3 py-2 text-base font-medium transition-all duration-300"
                )
              }
            >
              Buy
            </DisclosureButton>
          )}
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}
