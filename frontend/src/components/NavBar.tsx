import { NavLink } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

export default function NavBar() {
  return (
    <nav className="flex justify-center gap-5 p-3">
      <NavLink className="p-4 text-xl bg-blue-400 hover:bg-blue-500 rounded-md font-medium text-white" to={"/"}>
        All Entries
      </NavLink>
      <NavLink className="p-4 text-xl bg-blue-400 hover:bg-blue-500 rounded-md font-medium text-white" to={"/create"}>
        New Entry
      </NavLink>
      <div className="items-self-end">
        <ThemeToggle />
      </div>
    </nav>
  );
}
