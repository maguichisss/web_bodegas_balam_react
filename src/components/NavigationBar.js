import React, { useState } from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  NavbarText
} from 'reactstrap';

const NavigationBar = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <div>
      <Navbar color="light" light expand="md">
        <NavbarBrand href="/">BodegasBalam</NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="mr-auto" navbar>
            <NavItem>
                <NavLink href="/">Home</NavLink>
            </NavItem>
            <NavItem>
                <NavLink href="/login/">Login</NavLink>
            </NavItem>
            <NavItem>
                <NavLink href="/compra/">Compras</NavLink>
            </NavItem>
            <NavItem>
                <NavLink href="/proveedor/">Proveedor</NavLink>
            </NavItem>
            <NavItem>
                <NavLink href="/proveedor/">Proveedor</NavLink>
            </NavItem>
            <NavItem>
                <NavLink href="/estatus_compra/">Estatus compra</NavLink>
            </NavItem>
            <NavItem>
                <NavLink href="/tipo_producto/">Tipo producto</NavLink>
            </NavItem>
            <NavItem>
                <NavLink href="/sucursal">Sucursales</NavLink>
            </NavItem>
          </Nav>
          <NavbarText>:D</NavbarText>
        </Collapse>
      </Navbar>
    </div>
  );
}

export default NavigationBar;
