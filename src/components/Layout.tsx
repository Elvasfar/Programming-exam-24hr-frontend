import NavHeader from "../components/Nav/NavHeader";
import Footer from "../components/Footer/Footer";

type LayoutProps = {
    children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
    return (
        <div>
            <header className="bg-dark user-select-none">
                <NavHeader />
            </header>
            <main className="user-select-none">{children}</main>
            <footer className="user-select-none">
                <Footer />
            </footer>
        </div>
    );
};

export default Layout;
