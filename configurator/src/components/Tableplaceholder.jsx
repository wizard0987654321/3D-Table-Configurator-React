// einfacher Platzhalter-Tisch nur mit Boxen
import { useConfiguratorStore } from '../store/useConfiguratorStore'

function TablePlaceholder() {
    const topColor = useConfiguratorStore((s) => s.topColor)
    const legColor = useConfiguratorStore((s) => s.legColor)
    const topMaterial = useConfiguratorStore((s) => s.topMaterial)
    const legMaterial = useConfiguratorStore((s) => s.legMaterial)
    const width = useConfiguratorStore((s) => s.width)
    const height = useConfiguratorStore((s) => s.height)
    const depth = useConfiguratorStore((s) => s.depth)

    const baseW = 120
    const baseD = 80
    const scaleX = width / baseW
    const scaleZ = depth / baseD

    const h = height / 100
    const t = 0.05
    const legY = h / 2
    const topY = h + t / 2

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

    return (
        <group>
            <mesh position={[0, topY, 0]} scale={[scaleX, 1, scaleZ]}>
                <boxGeometry args={[1, t, 1]} />
                <meshStandardMaterial color={topColor} {...topMatProps} />
            </mesh>

            {[[-0.45, -0.45], [0.45, -0.45], [-0.45, 0.45], [0.45, 0.45]].map(
                ([x, z], i) => (
                    <mesh
                        key={i}
                        position={[x * scaleX, legY, z * scaleZ]}
                        scale={[1, h, 1]}
                    >
                        <boxGeometry args={[0.1, 1, 0.1]} />
                        <meshStandardMaterial color={legColor} {...legMatProps} />
                    </mesh>
                )
            )}
        </group>
    )
}

export default TablePlaceholder
