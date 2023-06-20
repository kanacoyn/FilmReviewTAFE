import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import NavbarCollapse from "react-bootstrap/esm/NavbarCollapse";
import { Navigation } from "./Navigation";
import movieIcon from "../movieIcon.png";

export function Header(props) {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand>
          <a href="/" className="home-link">
            <img
              src={movieIcon}
              alt="Movie Icon"
              width="40"
              height="40"
              className="movie-icon"
            />
          </a>
          Film Stack OverView
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-nav" />
        <NavbarCollapse id="main-nav">
          <Navigation />
        </NavbarCollapse>
      </Container>
    </Navbar>
  );
}
