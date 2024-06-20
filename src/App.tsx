import Layout from "./components/Layout";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Participants from "./pages/Participants";
import Disciplines from "./pages/Disciplines";
import Results from "./pages/Results";

function App() {

  return (
    <>
               <Layout>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/participants" element={<Participants />}  />
                    <Route path="/disciplines" element={<Disciplines />}  />
                    <Route path="/results" element={<Results />}  />


                </Routes>
            </Layout>
        </>
        
    );

}

export default App
