import { useConfiguratorStore } from '../store/useConfiguratorStore'
import { useTexture } from '@react-three/drei'
import { RepeatWrapping } from 'three'
import { useEffect, useMemo } from 'react'

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
    const topTexture = useConfiguratorStore((s) => s.topTexture)

    // --- DYNAMIC TEXTURE LOADING ---
    
    // 1. Determine the filename
    // If 'none' is selected, we fallback to 'placeholder' to keep the hook running safely.
    // If 'oak_natural' is selected, we load 'oak_natural'
    const textureFile = topTexture === 'none' ? 'placeholder' : topTexture;

    // 2. Load the specific file
    // IMPORTANT: Make sure your files in /public/textures/ are named exactly like the IDs!
    // Example: public/textures/oak_natural.jpg
    const texture = useTexture(`/textures/${textureFile}.jpg`);

    // 3. Configure texture settings
    useEffect(() => {
        if (texture) {
            texture.wrapS = texture.wrapT = RepeatWrapping;
            texture.repeat.set(1, 1);
            // Optional: If textures look blurry, try: texture.anisotropy = 16;
        }
    }, [texture]); // This runs every time the texture file changes

    // --- DIMENSIONS ---
    const baseW = 120;
    const baseD = 80;
    const scaleX = width / baseW;
    const scaleZ = depth / baseD;
    const h = height / 100;
    const t = thicknessCm / 100;
    const topY = h + t / 2;
    const legY = h / 2;

    // --- MATERIALS ---
    const topMatProps = useMemo(() => {
        if (topMaterial === 'glass') {
            return {
                roughness: 0.0, metalness: 0.0, transparent: true, opacity: 0.35,
                transmission: 1, thickness: 0.05, ior: 1.45,
            };
        }
        if (topMaterial === 'wood') return { roughness: 0.95, metalness: 0.0 };
        return { roughness: 0.25, metalness: 0.0 };
    }, [topMaterial]);

    const legMatProps = useMemo(() => {
        return legMaterial === 'metal' 
            ? { roughness: 0.35, metalness: 1.0 } 
            : { roughness: 0.8, metalness: 0.0 };
    }, [legMaterial]);

    // --- RENDER ---
    const renderTop = () => {
        const showTexture = topTexture !== 'none' && topMaterial !== 'glass';
        
        // Ensure the key changes when the texture file changes
        const activeKey = showTexture ? `texture-${topTexture}` : 'texture-off';

        const material = (
            <meshStandardMaterial 
                key={activeKey}
                color={topColor} 
                map={showTexture ? texture : null} 
                {...topMatProps} 
            />
        );

        if (plateShape === 'round') {
            const radius = 0.5 * scaleX
            return (
                <mesh position={[0, topY, 0]}>
                    <cylinderGeometry args={[radius, radius, t, 48]} />
                    {material}
                </mesh>
            )
        }

        return (
            <mesh position={[0, topY, 0]} scale={[scaleX, 1, scaleZ]}>
                <boxGeometry args={[1, t, 1]} />
                {material}
            </mesh>
        )
    }

    const renderLegs = () => {
        const halfW = 0.5 * scaleX;
        const halfD = 0.5 * scaleZ;
        const edgeOffset = 0.08;
        const positions = plateShape === 'round' 
            ? [0, 90, 180, 270].map(d => [(Math.cos(d * Math.PI / 180)) * (halfW - edgeOffset), (Math.sin(d * Math.PI / 180)) * (halfW - edgeOffset)])
            : [[-halfW + edgeOffset, -halfD + edgeOffset], [halfW - edgeOffset, -halfD + edgeOffset], [-halfW + edgeOffset, halfD - edgeOffset], [halfW - edgeOffset, halfD - edgeOffset]];

        if (legType === 'round' || legType === 'square') {
            return positions.map(([x, z], i) => (
                <mesh key={i} position={[x, legY, z]}>
                    {legType === 'round' ? <cylinderGeometry args={[0.04, 0.04, h, 32]} /> : <boxGeometry args={[0.085, h, 0.085]} />}
                    <meshStandardMaterial color={legColor} {...legMatProps} />
                </mesh>
            ));
        }
        
        if (legType === 'uFrame') {
             const bar = 0.08; const frameX = halfW - 0.12; const frameZ = halfD - 0.12;
             return [-frameX, frameX].map((sx, idx) => (
                <group key={idx} position={[sx, 0, 0]}>
                    <mesh position={[0, h/2, -frameZ]}><boxGeometry args={[bar, h, bar]} /><meshStandardMaterial color={legColor} {...legMatProps} /></mesh>
                    <mesh position={[0, h/2, frameZ]}><boxGeometry args={[bar, h, bar]} /><meshStandardMaterial color={legColor} {...legMatProps} /></mesh>
                    <mesh position={[0, 0.02, 0]}><boxGeometry args={[bar, 0.08, frameZ*2]} /><meshStandardMaterial color={legColor} {...legMatProps} /></mesh>
                </group>
             ));
        }

        if (legType === 'pedestal') {
            const radiusPlate = Math.min(halfW, halfD); const baseRadius = radiusPlate * 0.60;
            return (
                <group>
                    <mesh position={[0, 0.015, 0]}><cylinderGeometry args={[baseRadius, baseRadius, 0.03, 48]} /><meshStandardMaterial color={legColor} {...legMatProps} /></mesh>
                    <mesh position={[0, h/2, 0]}><cylinderGeometry args={[0.07, 0.1, h, 32]} /><meshStandardMaterial color={legColor} {...legMatProps} /></mesh>
                </group>
            )
        }
        return null;
    }

    return (
        <group>
            {renderTop()}
            {renderLegs()}
        </group>
    )
}

export default TablePlaceholder