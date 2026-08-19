import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Inicio from "./pages/Inicio";
import Clientes from "./pages/Clientes";
import Ejercicios from "./pages/Ejercicios";
import Rutinas from "./pages/Rutinas";

function App() {

  return (
    <BrowserRouter>

      <Navbar />

      <main className="container py-4">

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

      </main>

    </BrowserRouter>
  );
}

export default App;