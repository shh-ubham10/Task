import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import TestForm from "./pages/TestForm/TestForm";
import Question from "./pages/Questions/Question";
import Preview from "./pages/Preview/Preview";
import ProtectedRoute from "./routes/ProtectedRoute";
import "./styles/layout.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/tests" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/tests/create" element={<ProtectedRoute><TestForm /></ProtectedRoute>} />
        <Route path="/tests/edit/:id" element={<ProtectedRoute><TestForm /></ProtectedRoute>} />
        <Route path="/questions" element={<ProtectedRoute><Question /></ProtectedRoute>} />
        <Route path="/preview" element={<ProtectedRoute><Preview /></ProtectedRoute>} />
        <Route path="/preview/:id" element={<ProtectedRoute><Preview /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;