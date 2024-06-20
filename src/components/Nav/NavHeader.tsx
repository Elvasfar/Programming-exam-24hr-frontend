import { NavLink } from "react-router-dom";
import { Navbar, Nav, Container, Offcanvas, Row, Col } from "react-bootstrap";

export default function NavHeader() {
    return (
        <Navbar bg="dark" variant="dark" expand="lg" style={{ height: "100px", maxHeight: "100px", width: "100%", position: "fixed", top: 0, zIndex: 1000 }}>
            <Container fluid>
                <Row className="w-100 align-items-center">
                    <Col className="d-flex align-items-center">
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
                                    <NavLink
                                        to="/participants"
                                        className="text-light me-2 text-decoration-none d-flex align-items-center"
                                    >
                                        Deltagere
                                    </NavLink>
                                    <NavLink
                                        to="/disciplines"
                                        className="text-light me-2 text-decoration-none d-flex align-items-center"
                                    >
                                        Discipliner
                                    </NavLink>
                                    <NavLink
                                        to="/results"
                                        className="text-light me-2 text-decoration-none d-flex align-items-center"
                                    >
                                        Resultater
                                    </NavLink>
                                </Nav>
                            </Offcanvas.Body>
                        </Navbar.Offcanvas>
                    </Col>
                </Row>
            </Container>
        </Navbar>
    );
}
