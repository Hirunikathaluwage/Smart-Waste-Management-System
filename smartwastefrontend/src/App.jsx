import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';



function App() {
    return (
        <Router>
            <div className="min-h-screen flex flex-col">
                <Header />

                <div className="flex-1">
                    <Routes>
                         {/*Public Pages */}
                        <Route path="/" element={<Home />} />
                        <Route path="/signup" element={<SignUp />} />
                        <Route path="/signin" element={<SignIn />} />

                        {/* Collector Pages */}


                        {/* Redirect unknown paths */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </div>

                <Footer />
            </div>
        </Router>
    );
}

export default App;




