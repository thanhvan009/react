import styled from 'styled-components';

export const StyledNavbar = styled.ul`
  display: flex;
  max-height: 65px;
  background-color: #dadada;
  font-weight: bold;
  padding: 20px 50px;
  margin: 0;
  align-items: center;
  list-style-type: none;

  .name-app {
    text-transform: uppercase;
    color: #329252;
    font-size: 20px;
  }

  li {
    margin-right: 30px;
  }

  a {
    text-decoration: none;
    color: #333;
    font-size: 14px;
    transition: color 0.2s ease;
    &:hover {
      color: #329252;
    }
    &.active {
      color: #329252;
    }
  }
`;