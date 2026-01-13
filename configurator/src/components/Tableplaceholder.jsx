import { useConfiguratorStore } from '../store/useConfiguratorStore'

function TablePlaceholder() {
    const topColor = useConfiguratorStore((s) => s.topColor)
    const legColor = useConfiguratorStore((s) => s.legColor)
    const topMaterial = useConfiguratorStore((s) => s.topMaterial)
    const legMaterial = useConfiguratorStore((s) => s.legMaterial)

    const plateShape = useConfiguratorStore((s) => s.plateShape)
    const thicknessCm = useConfiguratorStore((s) => s.thicknessCm)
    const legType = useConfiguratorStore((s) => s.legType)

    const width = useConfiguratorStore((s) => s.width)
    const height = useConfiguratorStore((s) => s.height)
    const depth = useConfiguratorStore((s) => s.depth)

    // Basismaße in cm
    const baseW = 120
    const baseD = 80

    // Skalierung (Box ist 1 breit/tief)
    const scaleX = width / baseW
    const scaleZ = depth / baseD

    // cm -> Scene Units
    const h = height / 100
    const t = thicknessCm / 100

    // Positionen
    const legY = h / 2
    const topY = h + t / 2

    // Materialien (wie bei dir)
    const topMatProps =
        topMaterial === 'glass'
            ? {
                roughness: 0.0,
                metalness: 0.0,
                transparent: true,
                opacity: 0.35,
                clearcoat: 1,
                clearcoatRoughness: 0.0,
                transmission: 1,      // echtes Glas

                thickness: 0.05,     // 🔥 SEHR WICHTIG: klein = klar
                ior: 1.45,           // Glas-Brechungsindex
                envMapIntensity: 1.5,
            }
            : topMaterial === 'wood'
                ? {
                    roughness: 0.95,      // sehr matt
                    metalness: 0.0,
                    envMapIntensity: 0.1, // kaum Spiegelung
                }
                : {
                    // Kunststoff
                    roughness: 0.25,      // sichtbar glänzend
                    metalness: 0.0,
                    envMapIntensity: 1.2, // klare Lichtreflexe
                }



    const legMatProps =
        legMaterial === 'metal'
            ? { roughness: 0.35, metalness: 1.0 }
            : { roughness: 0.8, metalness: 0.0 }

    const renderTop = () => {
        if (plateShape === 'round') {
            const radius = 0.5 * scaleX
            return (
                <mesh position={[0, topY, 0]}>
                    <cylinderGeometry args={[radius, radius, t, 48]} />
                    <meshStandardMaterial color={topColor} {...topMatProps} />
                </mesh>
            )
        }

        return (
            <mesh position={[0, topY, 0]} scale={[scaleX, 1, scaleZ]}>
                <boxGeometry args={[1, t, 1]} />
                <meshStandardMaterial color={topColor} {...topMatProps} />
            </mesh>
        )
    }

    const renderLegs = () => {
        // Platte "Halbmaße" in Scene Units
        const halfW = 0.5 * scaleX
        const halfD = 0.5 * scaleZ

        // Abstand vom Rand (anpassen wenn du willst)
        const edgeOffset = 0.08

        // Rechteck: Beine nahe Ecken (berühren Platte sicher)
        const rectLegs = [
            [-halfW + edgeOffset, -halfD + edgeOffset],
            [ halfW - edgeOffset, -halfD + edgeOffset],
            [-halfW + edgeOffset,  halfD - edgeOffset],
            [ halfW - edgeOffset,  halfD - edgeOffset],
        ]

        // Rund: Beine auf Kreis verteilt (macht Sinn)
        const radius = Math.min(halfW, halfD)
        const legCircleRadius = radius - edgeOffset
        const roundLegs = [0, 90, 180, 270].map((deg) => {
            const a = (deg * Math.PI) / 180
            return [Math.cos(a) * legCircleRadius, Math.sin(a) * legCircleRadius]
        })

        const positions = plateShape === 'round' ? roundLegs : rectLegs

        // Rund (4 Beine)
        if (legType === 'round') {
            const r = 0.04
            return positions.map(([x, z], i) => (
                <mesh key={i} position={[x, legY, z]}>
                    <cylinderGeometry args={[r, r, h, 32]} />
                    <meshStandardMaterial color={legColor} {...legMatProps} />
                </mesh>
            ))
        }

        // Vierkant
        if (legType === 'square') {
            const s = 0.085
            return positions.map(([x, z], i) => (
                <mesh key={i} position={[x, legY, z]} scale={[1, h, 1]}>
                    <boxGeometry args={[s, 1, s]} />
                    <meshStandardMaterial color={legColor} {...legMatProps} />
                </mesh>
            ))
        }

        // U-Frame (nur rechteckig gedacht)
        if (legType === 'uFrame') {
            const bar = 0.08
            const bottomY = 0.02

            // Rahmen sitzen innen unter der Platte
            const frameX = halfW - 0.12
            const frameZ = halfD - 0.12

            return [-frameX, frameX].map((sx, idx) => (
                <group key={idx} position={[sx, 0, 0]}>
                    <mesh position={[0, h / 2, -frameZ]}>
                        <boxGeometry args={[bar, h, bar]} />
                        <meshStandardMaterial color={legColor} {...legMatProps} />
                    </mesh>

                    <mesh position={[0, h / 2, frameZ]}>
                        <boxGeometry args={[bar, h, bar]} />
                        <meshStandardMaterial color={legColor} {...legMatProps} />
                    </mesh>

                    <mesh position={[0, bottomY, 0]}>
                        <boxGeometry args={[bar, bar, frameZ * 2]} />
                        <meshStandardMaterial color={legColor} {...legMatProps} />
                    </mesh>
                </group>
            ))
        }

        // Zentralfuß (nur rund)
        if (legType === 'pedestal') {
            const radiusPlate = Math.min(halfW, halfD)

            // Fuß deutlich kleiner als Platte
            const baseRadius = radiusPlate * 0.60
            const baseHeight = 0.035

            const columnTopRadius = 0.07
            const columnBottomRadius = 0.10
            const columnHeight = h - 0.02

            return (
                <group>
                    <mesh position={[0, baseHeight / 2, 0]}>
                        <cylinderGeometry args={[baseRadius, baseRadius, baseHeight, 48]} />
                        <meshStandardMaterial color={legColor} {...legMatProps} />
                    </mesh>

                    <mesh position={[0, columnHeight / 2, 0]}>
                        <cylinderGeometry
                            args={[columnTopRadius, columnBottomRadius, columnHeight, 32]}
                        />
                        <meshStandardMaterial color={legColor} {...legMatProps} />
                    </mesh>

                    <mesh position={[0, h - 0.01, 0]}>
                        <cylinderGeometry args={[0.14, 0.14, 0.02, 32]} />
                        <meshStandardMaterial color={legColor} {...legMatProps} />
                    </mesh>
                </group>
            )
        }

        return null
    }

    return (
        <group>
            {renderTop()}
            {renderLegs()}
        </group>
    )
}

export default TablePlaceholder
