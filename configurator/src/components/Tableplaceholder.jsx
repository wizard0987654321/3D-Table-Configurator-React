// einfacher Platzhalter-Tisch nur mit Boxen
import { useConfiguratorStore } from '../store/useConfiguratorStore'

function TablePlaceholder() {
    const color = useConfiguratorStore((s) => s.color)
    const width = useConfiguratorStore((s) => s.width)
    const height = useConfiguratorStore((s) => s.height)
    const depth = useConfiguratorStore((s) => s.depth)

    // Basismaße
    const baseW = 120
    const baseH = 75
    const baseD = 80

    const scaleX = width / baseW
    const scaleY = height / baseH
    const scaleZ = depth / baseD

    return (
        <group>
            {/* Tischplatte */}
            <mesh position={[0, height / 100 + 0.05, 0]} scale={[scaleX, 0.1, scaleZ]}>
                <boxGeometry args={[1, 0.1, 1]} />
                <meshStandardMaterial color={color} />
            </mesh>

            {/* vier Beine */}
            {[[-0.45, 0, -0.45], [0.45, 0, -0.45], [-0.45, 0, 0.45], [0.45, 0, 0.45]].map(
                ([x, y, z], i) => (
                    <mesh key={i} position={[x * scaleX, height / 200, z * scaleZ]} scale={[0.1, height / 75, 0.1]}>
                        <boxGeometry args={[0.1, 1, 0.1]} />
                        <meshStandardMaterial color="#555" />
                    </mesh>
                )
            )}
        </group>
    )
}

export default TablePlaceholder;
