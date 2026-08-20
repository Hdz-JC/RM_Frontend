import {
  BrowserRouter,
  Routes,
  Route,
  useLocation
} from "react-router-dom";

import Navbar from "./components/Navbar";

import Inicio from "./pages/Inicio";
import Clientes from "./pages/Clientes";
import Ejercicios from "./pages/Ejercicios";
import Rutinas from "./pages/Rutinas";

function Paginas() {
  const location = useLocation();

  return (
    <main className="container py-4">
      <div
        key={location.pathname}
        className="page-transition"
      >
        <Routes>
          <Route
            path="/"
            element={<Inicio />}
          />

          <Route
            path="/clientes"
            element={<Clientes />}
          />

          <Route
            path="/ejercicios"
            element={<Ejercicios />}
          />

          <Route
            path="/rutinas"
            element={<Rutinas />}
          />
        </Routes>
      </div>
    </main>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Paginas />
    </BrowserRouter>
  );
}

export default App;