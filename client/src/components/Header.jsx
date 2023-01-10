import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import { Link } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';

function Header() {
    return (
        <>
            <Navbar bg="light" variant="light">
                <Container>
                    <Navbar.Brand >EGOLD/EINR</Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/EINR">EINR</Nav.Link>
                        <Nav.Link as={Link} to="/EGOLD">EGOLD</Nav.Link>
                        <Nav.Link as={Link} to="/EGOLDConfig">EGOLDConfig</Nav.Link>
                        <Nav.Link as={Link} to="/ContractConfig">ContractConfig</Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
        </>
    );
}

export default Header;