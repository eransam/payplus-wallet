import type { ReactNode } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { NavLink } from "react-router-dom";

type LayoutProps = {
  children: ReactNode;
};

function Layout({ children }: LayoutProps) {
  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand as={NavLink} to="/">
            PayPlus Wallet
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="main-navbar" />
          <Navbar.Collapse id="main-navbar">
            <Nav className="ms-auto">
              <Nav.Link as={NavLink} to="/" end>
                Dashboard
              </Nav.Link>
              <Nav.Link as={NavLink} to="/merchants">
                Merchants
              </Nav.Link>
              <Nav.Link as={NavLink} to="/wallets">
                Wallets
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container>{children}</Container>
    </>
  );
}

export default Layout;
