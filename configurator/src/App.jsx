// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Authentication from './components/Authentication';
import ConfiguratorScene from './components/ConfiguratorScene';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/*route 1: login/register page (default) */}
        <Route path="/" element={<Authentication />} />

        {/*route 2: configurator */}
        <Route path="/design" element={<ConfiguratorScene />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;