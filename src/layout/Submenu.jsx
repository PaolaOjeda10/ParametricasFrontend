import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import styled from 'styled-components';

const SidebarLink = styled(Link)`
display: flex;
width:100px
color: #fafafa;
justify-content: space-between;
align-items: center;
padding: 20px;
list-style: none;
height: 60px;
text-decoration: none;
font-size: 18px;

&:hover {
	background: #252831;
	border-left: 4px solid #fafafa;
	cursor: pointer;
}
`;

const SidebarLabel = styled.span`
  margin-left: 16px;
  color: #fafafa;
`;

const DropdownLink = styled(Link)`
  background: #252831;
  height: 60px;
  padding-left: 3rem;
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #fafafa;
  font-size: 18px;

  &:hover {
    background: green;
    cursor: pointer;
  }
`;

const Submenu = ({ item }) => {
  const [subnav, setSubnav] = useState(false);

  const showSubnav = () => setSubnav(!subnav);

  return (
    <>
      <SidebarLink to={item.path} onClick={showSubnav}>
        <div>
          {item.icon}
          <SidebarLabel>{item.title}</SidebarLabel>
        </div>
        <div>
          {item?.subnav && subnav ? item?.iconOpened : item?.iconClosed}
        </div>
      </SidebarLink>
      {subnav &&
        item?.subnav?.map((subnavItem, index) => {
          return (
            <DropdownLink
              to={'#'}
              onClick={
                (window.localStorage.removeItem('token'),
                window.localStorage.removeItem('usuario'))
              }
              key={index}
            >
              <SidebarLabel>{''}</SidebarLabel>
            </DropdownLink>
          );
        })}
    </>
  );
};

export default Submenu;
