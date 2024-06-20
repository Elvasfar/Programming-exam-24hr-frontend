import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { Navbar, Nav, Container, Offcanvas } from "react-bootstrap";
import { FaUser, FaSignOutAlt } from "react-icons/fa";
import { AuthContext } from "../../security/AuthProvider";

export default function NavHeader() {
    const { username, signOut } = useContext(AuthContext);
    const isLoggedIn = !!username; // Check if user is logged in

    return (
        <Navbar bg="dark" variant="dark" expand="lg" style={{ height: "100px", maxHeight: "100px", width: "100%", position: "fixed", top: 0, zIndex: 1000 }}>
            <Container fluid>
                <Navbar.Toggle aria-controls="offcanvasNavbar-expand-lg" className="ms-3" />
                <Navbar.Offcanvas
                    id="offcanvasNavbar-expand-lg"
                    aria-labelledby="offcanvasNavbar-expand-lg"
                    className="bg-dark"
                    placement="start"
                    style={{ maxWidth: "70%" }}
                >
                    <Offcanvas.Header closeButton />
                    <Offcanvas.Body>
                        <Nav className="my-2 my-lg-0 gap-3">
                        <div style={{ marginRight: "10px" }}>
<img src="download.jpg" alt="Logo" style={{ height: "100px", marginRight: "50px" }} />
</div>
                            <NavLink to="/" className="text-light me-2 text-decoration-none d-flex align-items-center">
                                Forside
                            </NavLink>
                            {isLoggedIn && (
                                <NavLink to="/participants" className="text-light me-2 text-decoration-none d-flex align-items-center">
                                    Deltagere
                                </NavLink>
                            )}
                            <NavLink to="/disciplines" className={`text-light me-2 text-decoration-none d-flex align-items-center ${isLoggedIn ? "" : "disabled"}`}>
                                Discipliner
                            </NavLink>
                            <NavLink to="/results" className={`text-light me-2 text-decoration-none d-flex align-items-center ${isLoggedIn ? "" : "disabled"}`}>
                                Resultater
                            </NavLink>
                        </Nav>
                    </Offcanvas.Body>
                </Navbar.Offcanvas>
            </Container>
            <Nav className="ms-auto">
                {isLoggedIn ? (
                    <Nav.Link onClick={signOut} className="text-light me-3">
                        <FaSignOutAlt />
                    </Nav.Link>
                ) : (
                    <NavLink to="/login" className="text-light me-3">
                        <FaUser />
                    </NavLink>
                )}
            </Nav>
        </Navbar>
    );
}
