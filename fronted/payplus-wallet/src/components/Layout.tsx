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
            PayPlus ארנק
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="main-navbar" />
          <Navbar.Collapse id="main-navbar">
            <Nav className="me-auto">
              <Nav.Link as={NavLink} to="/" end>
                לוח בקרה
              </Nav.Link>
              <Nav.Link as={NavLink} to="/merchants">
                סוחרים
              </Nav.Link>
              <Nav.Link as={NavLink} to="/wallets">
                ארנקים
              </Nav.Link>
              <Nav.Link as={NavLink} to="/transactions">
                עסקאות
              </Nav.Link>
              <Nav.Link as={NavLink} to="/learn">
                למידה
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
