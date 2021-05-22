import {
  NavLink
} from 'react-router-dom';
import { StyledNavbar } from './styled';

function Navbar() {
  return (
    <StyledNavbar>
      <li className="name-app">HOMEWORK</li>
      <li>
        <NavLink exact to="/">Counter</NavLink>
      </li>
      <li>
        <NavLink to="/employee-management">Employee</NavLink>
      </li>
    </StyledNavbar>
  );
}

export default Navbar;
