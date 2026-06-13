import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  Menu,
  X,
  ShoppingCart,
  Heart,
  Package
} from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";

import { mainLinks } from "@/config/navigation";

import Searchbar from "../UI/Searchbar";
import NavItem from "./Navbar/NavItem";
import UserMenu from "./UserMenu";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

export default function Navbar() {

  const [open, setOpen] = useState(false);

  const { user, logout, isAuthenticated } = useAuth();

  const { getCartItemCount } = useCart();

  const navigate = useNavigate();

  const cartCount = getCartItemCount();

  const handleLogout = () => {

    logout();

    navigate("/");

    setOpen(false);

  };

  const location = useLocation();
  
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [open]);

  return (

    <nav
      className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-2xl border-b border-white/10 shadow-lg
      "
    >

      <div className="mx-auto max-w-7xl px-4">

        {/* DESKTOP */}

        <div className="hidden md:flex h-16 items-center gap-6">

          {/* LOGO */}

          <Link
            to="/"
            className="
            text-2xl

            font-extrabold

            tracking-tight

            text-white

            shrink-0
            "
          >

            Vincy

            <span className="text-violet-500">

              Shop

            </span>

          </Link>


          {/* LINKS */}

          <div className="flex items-center gap-6">

            {mainLinks.map((link) => (

              <NavItem

                key={link.path}

                to={link.path}

              >

                {link.name}

              </NavItem>

            ))}

          </div>


          {/* SEARCH */}

          <div className="flex-1 flex justify-center">

            <Searchbar className=" w-full max-w-xl" />

          </div>


          {/* ACTIONS */}

          <div className="flex items-center gap-5">

            {isAuthenticated && (

              <>

                <Link to="/wishlist" className=" text-slate-300
                  hover:text-white
                  transition
                  "  >

                  <Heart className="w-5 h-5"/>

                </Link>

                <Link

                  to="/orders" className="
                  text-slate-300
                  hover:text-white
                  transition
                  "
                >

                  <Package className="w-5 h-5"/>

                </Link>

              </>

            )}


            {/* CART */}

            <Link

              to="/cart"

              className="relative group"

            >

              <ShoppingCart className="w-6 h-6  text-slate-300  group-hover:text-white group-hover:scale-110 transition"

              />

              {

                cartCount > 0 && (

                  <span className="absolute-top-2-right-2 h-5 min-w-5 px-1 rounded-full bg-violet-600
                    text-white text-[10px] font-bold flex items-center justify-center" >

                    {cartCount}

                  </span>

                )

              }

            </Link>


            {

              isAuthenticated

              ?

              (

                <UserMenu

                  user={user}

                  logout={handleLogout}

                />

              )

              :

              (

                <>

                  <NavItem to="/login">

                    Login

                  </NavItem>

                  <Link

                    to="/register" className=" px-4  py-2 rounded-full
                    bg-violet-600
                    hover:bg-violet-700
                    text-white
                    font-medium
                    transition
                    "
                  >

                    Sign Up

                  </Link>

                </>

              )

            }

          </div>

        </div>


        {/* MOBILE HEADER */}

        <div
          className="
          md:hidden
          h-16
          flex
          items-center
          justify-between
          "
        >

          <Link
            to="/"
            className="
            text-2xl
            font-extrabold
            text-white
            "
          >

            Vincy
            <span className="text-violet-500">
              Shop
            </span>
          </Link>

          <div className="flex items-center gap-4">

            <Link

              to="/cart"

              className="relative"

            >

              <ShoppingCart className="w-6 h-6 text-white"/>

              {

                cartCount > 0 && (

                  <span
                    className="absolute-top-2-right-2  h-5 min-w-5 rounded-full bg-violet-600 text-white text-[10px]
                    font-bold
                    flex
                    items-center
                    justify-center
                    "
                  >

                    {cartCount}

                  </span>

                )

              }

            </Link>


            <button

              onClick={() => setOpen(true)}

              className="text-white"

            >

              <Menu className="w-7 h-7"/>

            </button>

          </div>

        </div>

      </div>


      {/* BACKDROP */}

      {

        open && (

          <div className="fixed inset-0 bg-black/50 z-40 "onClick={() => setOpen(false)}  />

        )

      }


      {/* DRAWER */}

      <div

        className={`fixed top-0 right-0 h-dvh w-[85%] max-w-sm bg-slate-950 backdrop-blur-2xl border-l border-white/10 shadow-2xl z-50 p-6 transition-transform duration-300

        ${open

          ?

          "translate-x-0"

          :

          "translate-x-full"

        }

        `}

      >

        {/* HEADER */}

        <div

          className="

          flex

          items-center

          justify-between

          mb-6

          "

        >

          <h2

            className="

            text-xl

            font-bold

            text-white

            "

          >

            Menu

          </h2>

          <button

            onClick={() => setOpen(false)}

            className="text-white"

          >

            <X/>

          </button>

        </div>


        {/* SEARCH */}

        <Searchbar className="mb-8"/>


        {/* SHOP */}

        <div className="space-y-2 overflow-y-auto max-h-[calc(100dvh-120px)]">

          <p className="text-xs uppercase tracking-widest text-slate-500 mb-2">

            Shop

          </p>


          {

            mainLinks.map((link)=>(

              <NavItem

                key={link.path}

                to={link.path}

                onClick={() => setOpen(false)}

              >

                {link.name}

              </NavItem>

            ))

          }

        </div>


        {/* USER */}

        {

          isAuthenticated && (

            <div className="mt-8 space-y-2">

              <p

                className="

                text-xs

                uppercase

                tracking-widest

                text-slate-500

                "

              >

                You

              </p>

              <NavItem

                to="/wishlist"

                onClick={() => setOpen(false)}

              >

                Wishlist

              </NavItem>

              <NavItem

                to="/orders"

                onClick={() => setOpen(false)}

              >

                Orders

              </NavItem>

              <NavItem

                to="/profile"

                onClick={() => setOpen(false)}

              >

                Profile

              </NavItem>

              {

                user?.role === "admin" && (

                  <NavItem to="/admin" onClick={() => setOpen(false)}>

                    Admin Dashboard

                  </NavItem>

                )

              }

              <button onClick={handleLogout} className=" text-red-400 hover:text-red-300 mt-4
                "

              >

                Logout

              </button>

            </div>

          )

        }

      </div>

    </nav>

  );

}