import './App.css'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import TablePlaceholder from './components/TablePlaceholder.jsx'
import { useConfiguratorStore } from './store/useConfiguratorStore'

function Sidebar() {
    const color = useConfiguratorStore((s) => s.color)
    const width = useConfiguratorStore((s) => s.width)
    const height = useConfiguratorStore((s) => s.height)
    const setField = useConfiguratorStore((s) => s.setField)
    const price = useConfiguratorStore((s) => s.getPrice())

    return (
        <div className="sidebar">
            <h2>Tisch-Konfigurator</h2>

            <label>
                Farbe Tischplatte
                <input
                    type="color"
                    value={color}
                    onChange={(e) => setField('color', e.target.value)}
                />
            </label>

            <label>
                Breite: {width} cm
                <input
                    type="range"
                    min="100"
                    max="200"
                    value={width}
                    onChange={(e) => setField('width', Number(e.target.value))}
                />
            </label>

            <label>
                Höhe: {height} cm
                <input
                    type="range"
                    min="60"
                    max="110"
                    value={height}
                    onChange={(e) => setField('height', Number(e.target.value))}
                />
            </label>

            <div className="price">Preis: {price} € (Test)</div>
        </div>
    )
}

function App() {
    return (
        <div className="App">
            <Sidebar />
            <div className="canvas-wrapper">
                <Canvas camera={{ position: [0, 1.5, 4], fov: 45 }}>
                    <color attach="background" args={['#ffffff']} />
                    <ambientLight intensity={0.4} />
                    <directionalLight intensity={1} position={[5, 5, 5]} />
                    <OrbitControls />
                    <TablePlaceholder />
                </Canvas>
            </div>
        </div>
    )
}

export default App
