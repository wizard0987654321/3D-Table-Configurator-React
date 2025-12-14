// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Authentication from './components/Authentication';
import ConfiguratorScene from './components/ConfiguratorScene';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route 1: The Login Page (Default) */}
        <Route path="/" element={<Authentication />} />

        {/* Route 2: The Actual Configurator */}
        <Route path="/design" element={<ConfiguratorScene />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;