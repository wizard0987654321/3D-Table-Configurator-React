import { useConfiguratorStore } from '../store/useConfiguratorStore'

function TablePlaceholder() {
    const topColor = useConfiguratorStore((s) => s.topColor)
    const legColor = useConfiguratorStore((s) => s.legColor)
    const topMaterial = useConfiguratorStore((s) => s.topMaterial)
    const legMaterial = useConfiguratorStore((s) => s.legMaterial)
    const legType = useConfiguratorStore((s) => s.legType)

    const width = useConfiguratorStore((s) => s.width)
    const height = useConfiguratorStore((s) => s.height)
    const depth = useConfiguratorStore((s) => s.depth)

    // Basismaße in cm
    const baseW = 120
    const baseD = 80

    // Skalierung in X/Z relativ zu Basis
    const scaleX = width / baseW
    const scaleZ = depth / baseD

    // cm -> Scene Units (Meter-ish)
    const h = height / 100
    const t = 0.05

    const legY = h / 2
    const topY = h + t / 2

    // eure Material-Presets (unverändert)
    const topMatProps =
        topMaterial === 'glass'
            ? { roughness: 0.05, metalness: 0.0, transparent: true, opacity: 0.55 }
            : topMaterial === 'wood'
                ? { roughness: 0.8, metalness: 0.0 }
                : { roughness: 0.6, metalness: 0.0 }

    const legMatProps =
        legMaterial === 'metal'
            ? { roughness: 0.35, metalness: 1.0 }
            : { roughness: 0.8, metalness: 0.0 }

    // Eck-Positionen (bleiben gleich)
    const cornerPos = [
        [-0.45, -0.45],
        [0.45, -0.45],
        [-0.45, 0.45],
        [0.45, 0.45],
    ]

    // Beinmaße
    const squareSize = 0.1
    const roundRadius = 0.055

    // U-Frame Parameter (für Bild 1 Look)
    const frameInset = 0.42     // Abstand zur Mitte (x)
    const frameWidth = 0.55     // Breite des U-Beins (z)
    const frameBar = 0.08       // Dicke der Streben
    const frameBottomY = 0.02   // Bodensteg leicht über 0

    const renderLegs = () => {
        if (legType === 'round') {
            return cornerPos.map(([x, z], i) => (
                <mesh key={i} position={[x * scaleX, legY, z * scaleZ]}>
                    <cylinderGeometry args={[roundRadius, roundRadius, h, 24]} />
                    <meshStandardMaterial color={legColor} {...legMatProps} />
                </mesh>
            ))
        }

        if (legType === 'uFrame') {
            const sideX = [-frameInset, frameInset] // links/rechts
            return sideX.map((sx, idx) => (
                <group key={idx} position={[sx * scaleX, 0, 0]}>
                    {/* linke Strebe */}
                    <mesh position={[0, h / 2, (-frameWidth / 2) * scaleZ]}>
                        <boxGeometry args={[frameBar, h, frameBar]} />
                        <meshStandardMaterial color={legColor} {...legMatProps} />
                    </mesh>

                    {/* rechte Strebe */}
                    <mesh position={[0, h / 2, (frameWidth / 2) * scaleZ]}>
                        <boxGeometry args={[frameBar, h, frameBar]} />
                        <meshStandardMaterial color={legColor} {...legMatProps} />
                    </mesh>

                    {/* Bodensteg */}
                    <mesh position={[0, frameBottomY, 0]}>
                        <boxGeometry args={[frameBar, frameBar, frameWidth * scaleZ]} />
                        <meshStandardMaterial color={legColor} {...legMatProps} />
                    </mesh>
                </group>
            ))
        }

        // default: 'square'
        return cornerPos.map(([x, z], i) => (
            <mesh
                key={i}
                position={[x * scaleX, legY, z * scaleZ]}
                scale={[1, h, 1]}
            >
                <boxGeometry args={[squareSize, 1, squareSize]} />
                <meshStandardMaterial color={legColor} {...legMatProps} />
            </mesh>
        ))
    }

    return (
        <group>
            {/* Tischplatte */}
            <mesh position={[0, topY, 0]} scale={[scaleX, 1, scaleZ]}>
                <boxGeometry args={[1, t, 1]} />
                <meshStandardMaterial color={topColor} {...topMatProps} />
            </mesh>

            {/* Beine */}
            {renderLegs()}
        </group>
    )
}

export default TablePlaceholder
