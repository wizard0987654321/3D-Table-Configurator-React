import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import TablePlaceholder from './TablePlaceholder.jsx'
import { useConfiguratorStore } from '../store/useConfiguratorStore'
import '../App.css'

function Sidebar() {
    const topColor = useConfiguratorStore((s) => s.topColor)
    const legColor = useConfiguratorStore((s) => s.legColor)
    const topMaterial = useConfiguratorStore((s) => s.topMaterial)
    const legMaterial = useConfiguratorStore((s) => s.legMaterial)

    const width = useConfiguratorStore((s) => s.width)
    const height = useConfiguratorStore((s) => s.height)
    const depth = useConfiguratorStore((s) => s.depth)

    const plateShape = useConfiguratorStore((s) => s.plateShape)
    const thicknessCm = useConfiguratorStore((s) => s.thicknessCm)
    const legType = useConfiguratorStore((s) => s.legType)

    const setField = useConfiguratorStore((s) => s.setField)
    const price = useConfiguratorStore((s) => s.getPrice())

    const saveConfig = useConfiguratorStore((s) => s.saveConfiguration);

    const isRound = plateShape === 'round'

    // Option 3: deaktivieren (Beispielregel für dünne Platte)
    const isLargePlate = width > 160 || depth > 100
    const thinDisabled = isLargePlate

    return (
        <div className="sidebar">
            <h2>Tisch-Konfigurator</h2>

            <label>
                Plattenform
                <select
                    value={plateShape}
                    onChange={(e) => {
                        const shape = e.target.value
                        setField('plateShape', shape)

                        // rund => Tiefe = Breite
                        if (shape === 'round') {
                            setField('depth', width)

                            // uFrame macht bei rund keinen Sinn -> wenn aktiv, auf round umstellen
                            if (legType === 'uFrame') setField('legType', 'round')
                        }

                        // wenn von rund -> rect und pedestal aktiv war -> auf round (4 Beine) zurück
                        if (shape === 'rect' && legType === 'pedestal') {
                            setField('legType', 'round')
                        }
                    }}
                >
                    <option value="rect">Rechteck</option>
                    <option value="round">Rund</option>
                </select>
            </label>

            <label>
                Plattenstärke
                <select
                    value={thicknessCm}
                    onChange={(e) => setField('thicknessCm', Number(e.target.value))}
                >
                    <option value={3} disabled={thinDisabled}>
                        3 cm {thinDisabled ? '(für große Platten deaktiviert)' : ''}
                    </option>
                    <option value={4}>4 cm</option>
                    <option value={6}>6 cm</option>
                </select>
            </label>

            <label>
                Farbe Tischplatte
                <input
                    type="color"
                    value={topColor}
                    onChange={(e) => setField('topColor', e.target.value)}
                />
            </label>

            <label>
                Breite: {width} cm
                <input
                    type="range"
                    min="100"
                    max="200"
                    value={width}
                    onChange={(e) => {
                        const w = Number(e.target.value)
                        setField('width', w)
                        if (isRound) setField('depth', w) // Kreis bleibt Kreis
                    }}
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

            <label>
                Tiefe: {depth} cm
                <input
                    type="range"
                    min="80"
                    max="200"
                    value={depth}
                    disabled={isRound}
                    onChange={(e) => setField('depth', Number(e.target.value))}
                />
                {isRound && (
                    <small style={{ display: 'block', marginTop: 6, opacity: 0.7 }}>
                        Bei „Rund“ ist Tiefe automatisch = Breite.
                    </small>
                )}
            </label>

            <label>
                Farbe Beine
                <input
                    type="color"
                    value={legColor}
                    onChange={(e) => setField('legColor', e.target.value)}
                />
            </label>

            <label>
                Material Tischplatte
                <select
                    value={topMaterial}
                    onChange={(e) => setField('topMaterial', e.target.value)}
                >
                    <option value="wood">Holz</option>
                    <option value="plastic">Kunststoff</option>
                    <option value="glass">Glas</option>
                </select>
            </label>

            <label>
                Material Beine
                <select
                    value={legMaterial}
                    onChange={(e) => setField('legMaterial', e.target.value)}
                >
                    <option value="metal">Metall</option>
                    <option value="wood">Holz</option>
                </select>
            </label>

            <label>
                Bein-Typ
                <select
                    value={legType}
                    onChange={(e) => setField('legType', e.target.value)}
                >
                    <option value="square">Vierkant</option>
                    <option value="round">Rund (4 Beine)</option>

                    <option value="uFrame" disabled={isRound}>
                        U-/Rahmen {isRound ? '(nur rechteck)' : ''}
                    </option>

                    <option value="pedestal" disabled={!isRound}>
                        Zentralfuß (nur rund)
                    </option>
                </select>

                {isRound && (
                    <small style={{ display: 'block', marginTop: 6, opacity: 0.7 }}>
                        Bei runden Tischen sind U-/Rahmenbeine deaktiviert.
                    </small>
                )}
            </label>

            <div className="price">Preis: {price} €</div>

            <button 
            className="save-btn" 
            onClick={saveConfig}
        >
            Save Configuration
        </button>
        </div>
    )
}

function ConfiguratorScene() {
    return (
        <div className="configurator-layout">
            <Sidebar />
            <div className="canvas-wrapper">
                <Canvas camera={{ position: [0, 1.5, 4], fov: 45 }}>
                    <color attach="background" args={['#f0f0f0']} />

                    {/* bessere Licht-Situation */}
                    <ambientLight intensity={0.15} />
                    <directionalLight intensity={1.1} position={[5, 6, 5]} />
                    <directionalLight intensity={0.6} position={[-5, 4, -5]} />

                    {/* DAS macht Material-Unterschiede sichtbar */}
                    <Environment preset="city" />

                    <OrbitControls />
                    <TablePlaceholder />
                </Canvas>

            </div>
        </div>
    )
}

export default ConfiguratorScene
