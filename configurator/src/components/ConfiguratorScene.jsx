import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import TablePlaceholder from './TablePlaceholder.jsx'
import { useConfiguratorStore } from '../store/useConfiguratorStore' // Note the '..' to go up a folder
import '../App.css' // Import CSS here

function Sidebar() {
    const color = useConfiguratorStore((s) => s.color)
    const width = useConfiguratorStore((s) => s.width)
    const height = useConfiguratorStore((s) => s.height)
    const depth         =useConfiguratorStore((s=>s.depth))
    const setField = useConfiguratorStore((s) => s.setField)
    const price = useConfiguratorStore((s) => s.getPrice())
    const topColor = useConfiguratorStore((s) => s.topColor)
    const legColor = useConfiguratorStore((s) => s.legColor)
    const topMaterial = useConfiguratorStore((s) => s.topMaterial)
    const legMaterial = useConfiguratorStore((s) => s.legMaterial)
    const legType = useConfiguratorStore((s) => s.legType)

    return (
        <div className="sidebar">
            <h2>Tisch-Konfigurator</h2>
            <label>
                Farbe Tischplatte
                <input type="color" value={color} onChange={(e) => setField('color', e.target.value)} />
            </label>
            <label>
                Breite: {width} cm
                <input type="range" min="100" max="200" value={width} onChange={(e) => setField('width', Number(e.target.value))} />
            </label>
            <label>
                Höhe: {height} cm
                <input type="range" min="60" max="110" value={height} onChange={(e) => setField('height', Number(e.target.value))} />
            </label>
            <label>
                Tiefe: {depth} cm
                <input type="range" min="80" max="200" value={depth} onChange={(e)=>setField('depth',Number(e.target.value))}/>
            </label>
            <label>
                Farbe Tischplatte
                <input type="color" value={topColor} onChange={(e) => setField('topColor', e.target.value)} />
            </label>

            <label>
                Farbe Beine
                <input type="color" value={legColor} onChange={(e) => setField('legColor', e.target.value)} />
            </label>

            <label>
                Material Tischplatte
                <select value={topMaterial} onChange={(e) => setField('topMaterial', e.target.value)}>
                    <option value="wood">Holz</option>
                    <option value="plastic">Kunststoff</option>
                    <option value="glass">Glas</option>
                </select>
            </label>

            <label>
                Material Beine
                <select value={legMaterial} onChange={(e) => setField('legMaterial', e.target.value)}>
                    <option value="metal">Metall</option>
                    <option value="wood">Holz</option>
                </select>
            </label>
            <label>
                Bein-Typ
                <select value={legType} onChange={(e) => setField('legType', e.target.value)}>
                    <option value="square">Vierkant</option>
                    <option value="round">Rund</option>
                    <option value="uFrame">U-/Rahmen</option>
                </select>
            </label>
            <div className="price">Preis: {price} €</div>
            
            {/* Save Button for later */}
            <button style={{marginTop: '20px'}}>Save Config</button>
        </div>
    )
}

function ConfiguratorScene() {
    return (
        <div className="configurator-layout">
            <Sidebar />
            <div className="canvas-wrapper">
                <Canvas camera={{ position: [0, 1.5, 4], fov: 45 }}>{/*Canvas ist der Einstiegspunkt für die 3D-Szene. Er erstellt den WebGL-Renderer (Three.js im Hintergrund), eine Szene und eine Kamera.*/}
                    <color attach="background" args={['#f0f0f0']} />
                    <ambientLight intensity={0.4} />
                    <directionalLight intensity={1} position={[5, 5, 5]} />
                    <OrbitControls />{/*OrbitControls sorgt dafür, dass der Nutzer die Kamera mit der Maus steuern kann.*/}
                    <TablePlaceholder />
                </Canvas>
            </div>
        </div>
    )
}

export default ConfiguratorScene;