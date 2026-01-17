// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Authentication from './components/Authentication';
import ConfiguratorScene from './components/ConfiguratorScene';
import SavedConfigurations from './components/SavedConfigurations';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/*route 1: login/register page (default) */}
        <Route path="/" element={<Authentication />} />

        {/*route 2: configurator */}
        <Route path="/design" element={<ConfiguratorScene />} />

        <Route path="/saved-configurations" element={<SavedConfigurations />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;