import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Auth from "./Components/Auth";
import AdminPage from "./Components/Admin";
import User from "./Components/User";
import Developer from "./Components/Developer";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Auth />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/user" element={<User/>} />
                <Route path="/developer" element={<Developer/>} />
            </Routes>
        </Router>
    );
}

export default App;
