// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Authentication from './components/Authentication';
import ConfiguratorScene from './components/ConfiguratorScene';
import SavedConfigurations from './components/SavedConfigurations';
import CheckoutPage from './components/CheckoutPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/*route 1: login/register page (default) */}
        <Route path="/" element={<Authentication />} />

        {/*route 2: configurator */}
        <Route path="/design" element={<ConfiguratorScene />} />

        <Route path="/saved-configurations" element={<SavedConfigurations />} />

        <Route path="/checkout" element={<CheckoutPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;