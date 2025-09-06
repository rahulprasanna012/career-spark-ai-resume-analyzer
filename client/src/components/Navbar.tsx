
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { FileChartLine, History, LogOutIcon, Sparkles } from "lucide-react";
import { logout } from "../services/auth";

const tabBase =
  "w-full font-semibold flex justify-center items-center p-3 md:px-3 cursor-pointer md:rounded-xl border-t-2 border-b-2 md:border-0 border-gray-100 text-gray-600 ";
const tabActive =
  "text-indigo-700 bg-indigo-200 md:bg-indigo-200 border-b-2 border-b-indigo-600";




const Navbar = () => {

  const location = useLocation();
  const analyzeActive = location.pathname === "/" || location.pathname.startsWith("/analyze");

 const navigate=useNavigate()

 const handleLogout=()=>{

    logout()
    navigate("/login")
 }


  return (
    <header className="md:p-2 md:border-b-2 bg-white border-gray-100 flex flex-col md:flex-row md:justify-between md:items-center md:px-16">
      {/* Brand + Mobile Auth */}
      <div className="flex items-center justify-between p-3 px-6 w-full md:w-auto">
        <div className="flex items-center">
          <Sparkles
            className="text-white bg-gradient-to-r from-indigo-600 to-indigo-800 p-2 mr-2 rounded-xl shadow-2xl shadow-indigo-600 hover:opacity-80"
            size={42}
            aria-hidden
          />
          <div>
            <h1 className="font-bold text-xl">Resume Builder</h1>
            <p className="text-gray-400 text-sm">AI-Powered Career Intelligence</p>
          </div>
        </div>

     
   
            <div className="flex items-center gap-2 md:hidden">
          
                <button className="p-2 rounded-xl text-gray-600 hover:bg-gray-100" type="button" onClick={handleLogout}>
                  <LogOutIcon size={20} />
                </button>
         
            </div>
         
      </div>

      {/* Tabs + Desktop Auth */}
      <div className="flex items-center mt-2 gap-2 px-3 md:px-0">
        <NavLink
          to="/analyze"
          className={() => `${tabBase} ${analyzeActive ? tabActive : "hover:bg-gray-50"}`}
        >
          <FileChartLine size={16} />
          <span className="ml-2">Analyze</span>
        </NavLink>

        <NavLink
          to="/history"
          className={({ isActive }) => `${tabBase} ${isActive ? tabActive : "hover:bg-gray-50"}`}
        >
          <History size={16} />
          <span className="ml-2">History</span>
        </NavLink>

        {/* Auth section visible only on desktop */}
        
            <div className="hidden md:flex items-center gap-2 ml-2">
            
                <button className={`${tabBase} md:rounded-xl hover:bg-gray-50`} type="button" onClick={handleLogout}>
                  <LogOutIcon size={16} />
                  <span className="ml-2">Logout</span>
                </button>
             
            </div>
          
      </div>
    </header>
  );
};

export default Navbar;
