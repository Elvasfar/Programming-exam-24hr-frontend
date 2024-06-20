import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./security/AuthProvider";
import NavHeader from "./components/Nav/NavHeader";
import Home from "./pages/Home";
import Participants from "./pages/Participants";
import Disciplines from "./pages/Disciplines";
import Results from "./pages/Results";
import Login from "./security/Login";

function App() {
    return (
        <AuthProvider>
            <NavHeader />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/participants" element={<Participants />} />
                <Route path="/disciplines" element={<Disciplines />} />
                <Route path="/results" element={<Results />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </AuthProvider>
    );
}

export default App;
