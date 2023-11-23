import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/AuthPages/Login';
import Register from './pages/AuthPages/Register';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* <Route path="*" element={<ErrorPage />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
