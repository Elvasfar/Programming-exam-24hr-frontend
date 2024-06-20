function Footer() {
    return (
        <footer className="bg-dark text-white py-3" style={{ width: "100%", position: "fixed", bottom: 0 }}>
            <div className="container text-center">
                <ul className="nav justify-content-center">
                    <li className="nav-item">
                        <a className="nav-link text-white" href="#">FAQ</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link text-white" href="#">About</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link text-white" href="#">Contact</a>
                    </li>
                </ul>
            </div>
        </footer>
    );
}

export default Footer;
