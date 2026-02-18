"use client";

import {
    Suspense,
    useRef,
    useState,
    useEffect,
    useMemo,
    useCallback,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
    useGLTF,
    Environment,
    MeshReflectorMaterial,
    SoftShadows,
    OrbitControls,
} from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ConfiguratorHUD from "./ConfiguratorHUD";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

/* ─── Camera positions ─── */
const CAM_START: [number, number, number] = [0, 12, 2]; // top-down
const CAM_END: [number, number, number] = [6, 3, 10]; // front/side eye-level
const LOOK_AT = new THREE.Vector3(0, 0.5, 0);

/* ─── Scene colours ─── */
const BG = "#f2f2f5";
const SUN = "#fff0dd";

/* ================================================================== */
/*  ScrollCamera – GSAP-driven camera that animates from top to front */
/* ================================================================== */
function ScrollCamera({
    scrollProgress,
    isActive,
}: {
    scrollProgress: React.MutableRefObject<number>;
    isActive: boolean;
}) {
    const { camera } = useThree();

    useFrame(() => {
        if (isActive) return; // OrbitControls take over

        const t = scrollProgress.current;
        camera.position.set(
            THREE.MathUtils.lerp(CAM_START[0], CAM_END[0], t),
            THREE.MathUtils.lerp(CAM_START[1], CAM_END[1], t),
            THREE.MathUtils.lerp(CAM_START[2], CAM_END[2], t)
        );
        camera.lookAt(LOOK_AT);
    });

    return null;
}

/* ================================================================== */
/*  CarModel – loads the GLB, scales & centres it                     */
/* ================================================================== */
function CarModel() {
    const { scene } = useGLTF("/car-models/2020_bmw_m340i_xdrive-v1.glb", true);
    const groupRef = useRef<THREE.Group>(null);

    // Compute bounding-box based scale + centre offset once
    const { scale, center } = useMemo(() => {
        const box = new THREE.Box3().setFromObject(scene);
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        // Target ~6 units wide so it fills the viewport nicely
        const s = 6 / maxDim;
        const c = box.getCenter(new THREE.Vector3()).multiplyScalar(-s);
        // Sit on the floor: offset so bottom of bounding box == y:0
        c.y = -box.min.y * s;
        return { scale: s, center: c };
    }, [scene]);

    useEffect(() => {
        scene.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                const mesh = child as THREE.Mesh;
                mesh.castShadow = true;
                mesh.receiveShadow = true;
            }
        });
    }, [scene]);

    return (
        <group ref={groupRef} scale={scale} position={[center.x, center.y, center.z]}>
            <primitive object={scene} />
        </group>
    );
}

useGLTF.preload("/car-models/g-wagon-draco.glb", true);

/* ================================================================== */
/*  ReflectiveFloor                                                   */
/* ================================================================== */
function ReflectiveFloor() {
    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
            <planeGeometry args={[80, 80]} />
            <MeshReflectorMaterial
                blur={[300, 100]}
                resolution={1024}
                mixBlur={1}
                mixStrength={0.5}
                roughness={0.7}
                depthScale={1.2}
                minDepthThreshold={0.4}
                maxDepthThreshold={1.4}
                color={BG}
                metalness={0.5}
                mirror={0.5}
            />
        </mesh>
    );
}

/* ================================================================== */
/*  Main export                                                       */
/* ================================================================== */
export default function CarConfigurator() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const scrollProgress = useRef(0);
    const [isActive, setIsActive] = useState(false);
    const [showButton, setShowButton] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);

    /* ── GSAP: pin section + drive scrollProgress ── */
    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const ctx = gsap.context(() => {
            ScrollTrigger.create({
                trigger: section,
                start: "top top",
                end: "+=200%",
                pin: true,
                scrub: 1,
                onUpdate: (self) => {
                    scrollProgress.current = self.progress;

                    // Show button when scroll finishes
                    if (self.progress > 0.95 && !isActive) {
                        setShowButton(true);
                    } else if (self.progress <= 0.95) {
                        setShowButton(false);
                    }
                },
            });
        });

        return () => ctx.revert();
    }, [isActive]);

    /* ── Fade button in/out ── */
    useEffect(() => {
        if (!buttonRef.current) return;
        if (showButton && !isActive) {
            gsap.to(buttonRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power3.out",
                pointerEvents: "auto",
            });
        } else {
            gsap.to(buttonRef.current, {
                opacity: 0,
                y: 20,
                duration: 0.4,
                ease: "power2.in",
                pointerEvents: "none",
            });
        }
    }, [showButton, isActive]);

    const handleEnter = useCallback(() => {
        setIsActive(true);
        setShowButton(false);
    }, []);

    const handleExit = useCallback(() => {
        setIsActive(false);
    }, []);

    return (
        <section ref={sectionRef} className="car-configurator-section" id="configurator">
            {/* 3D Canvas */}
            <Canvas
                dpr={[1, 2]}
                shadows
                camera={{
                    fov: 45,
                    near: 0.1,
                    far: 200,
                    position: CAM_START,
                }}
                gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.1 }}
                style={{ width: "100%", height: "100%" }}
            >
                {/* Background + Fog */}
                <color attach="background" args={[BG]} />
                <fog attach="fog" args={[BG, 15, 60]} />

                {/* Lighting */}
                <SoftShadows size={25} samples={16} focus={0.5} />
                <ambientLight intensity={0.3} color="#e8e0d4" />
                <directionalLight
                    castShadow
                    position={[8, 12, 5]}
                    intensity={2.5}
                    color={SUN}
                    shadow-mapSize-width={2048}
                    shadow-mapSize-height={2048}
                    shadow-camera-far={50}
                    shadow-camera-left={-15}
                    shadow-camera-right={15}
                    shadow-camera-top={15}
                    shadow-camera-bottom={-15}
                    shadow-bias={-0.0004}
                />
                <directionalLight
                    position={[-5, 6, -3]}
                    intensity={0.6}
                    color="#c4d4f0"
                />

                {/* Environment (lighting only, no bg) */}
                <Environment preset="sunset" background={false} />

                {/* Camera controller */}
                <ScrollCamera scrollProgress={scrollProgress} isActive={isActive} />

                {/* OrbitControls – only when configurator is active */}
                {isActive && (
                    <OrbitControls
                        enablePan={false}
                        minPolarAngle={0}
                        maxPolarAngle={Math.PI / 2 - 0.1}
                        minDistance={4}
                        maxDistance={20}
                        target={[0, 0.5, 0]}
                    />
                )}

                {/* Scene */}
                <Suspense fallback={null}>
                    <CarModel />
                    <ReflectiveFloor />
                </Suspense>
            </Canvas>

            {/* UI Overlay */}
            <div className="car-config-overlay">
                {/* Title (visible during scroll) */}
                <div className={`car-config-title ${isActive ? "car-config-title--hidden" : ""}`}>
                    <span className="car-config-label">Interactive Experience</span>
                    <h2 className="car-config-heading">The Rolls-Royce Ghost</h2>
                </div>

                {/* Enter button */}
                <button
                    ref={buttonRef}
                    className="car-config-enter-btn"
                    onClick={handleEnter}
                >
                    Enter Configurator
                </button>

                {/* Exit button — visible only in configurator mode */}
                {isActive && (
                    <button className="car-config-exit-btn" onClick={handleExit}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                        <span>Exit</span>
                    </button>
                )}
            </div>

            {/* HUD Sidebars – only when configurator is active */}
            <ConfiguratorHUD
                active={isActive}
                onSelectModel={() => {}}
            />
        </section>
    );
}
