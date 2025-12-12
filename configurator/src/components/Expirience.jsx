// src/components/Expirience.jsx
import {Box, PresentationControls, Stage} from '@react-three/drei'

function Expirience() {
    return (
        <PresentationControls speed={1.5} global zoom={0.7} polar={[-0.1,Math.PI/4]}>
            <Stage environment={"city"} intensity={0.6} contactShadow={false} >
                <mesh>
                    <boxGeometry/>
                    <meshNormalMaterial/>
                </mesh>
            </Stage>

        </PresentationControls>
        )
}

export default Expirience
