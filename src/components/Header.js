import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import NavbarCollapse from "react-bootstrap/esm/NavbarCollapse";
import { Navigation } from "./Navigation";
// import { Navbar } from "reactstrap";

export function Header(props) {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand>Film Stack OverView</Navbar.Brand>
        <Navbar.Toggle aria-controls="main-nav" />
        <NavbarCollapse id="main-nav">
          <Navigation />
        </NavbarCollapse>
      </Container>
    </Navbar>
  );
}
