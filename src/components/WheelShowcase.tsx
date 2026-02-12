"use client";

import { Suspense, useRef, useState, useEffect, useCallback, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useFBX, Environment, Html, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AeroLoader from "./AeroLoader";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

interface HotspotData {
    id: number;
    position: [number, number, number];
    label: string;
    info: {
        title: string;
        value: string;
        description: string;
    };
}

const hotspots: HotspotData[] = [
    {
        id: 1,
        position: [0.8, 0.5, 0.5],
        label: "Forging",
        info: {
            title: "6061-T6 Forged Alloy",
            value: "6061-T6",
            description:
                "Forged from aerospace-grade 6061-T6 aluminum under 8,000 tons of pressure. Maximum structural integrity with minimum weight.",
        },
    },
    {
        id: 2,
        position: [-0.6, -0.3, 0.7],
        label: "Weight",
        info: {
            title: "Ultra-Lightweight",
            value: "8.2 kg",
            description:
                "Each wheel weighs just 8.2 kg — 40% lighter than cast equivalents. Less unsprung mass means sharper response.",
        },
    },
    {
        id: 3,
        position: [0.2, -0.8, 0.4],
        label: "Finish",
        info: {
            title: "Brushed Titanium",
            value: "PVD Coat",
            description:
                "Physical Vapor Deposition coating provides a mirror-finish that resists brake dust, road salts, and UV degradation.",
        },
    },
];

function WheelModel({
    onHotspotClick,
}: {
    onHotspotClick: (data: HotspotData) => void;
}) {
    const groupRef = useRef<THREE.Group>(null);
    const mouseRef = useRef({ x: 0, y: 0 });
    const { viewport } = useThree();

    // Load the FBX model
    const fbx = useFBX("/media/car%20rim.fbx");

    // Traverse and apply proper MeshStandardMaterial for realistic metal
    useEffect(() => {
        fbx.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                const mesh = child as THREE.Mesh;
                mesh.castShadow = true;
                mesh.receiveShadow = true;

                // Apply a proper metallic material so it reacts to environment lighting
                mesh.material = new THREE.MeshStandardMaterial({
                    color: new THREE.Color(0x8a8a8a),
                    metalness: 0.95,
                    roughness: 0.15,
                    envMapIntensity: 1.5,
                });
            }
        });
    }, [fbx]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    useFrame(() => {
        if (groupRef.current) {
            // Smooth follow with clamped rotation to prevent extreme angles
            const targetY = mouseRef.current.x * 0.3; // Reduced sensitivity
            const targetX = mouseRef.current.y * 0.15; // Reduced sensitivity
            
            // Clamp rotation values to prevent flipping/scaling issues
            const clampedTargetY = Math.max(-0.5, Math.min(0.5, targetY));
            const clampedTargetX = Math.max(-0.3, Math.min(0.3, targetX));
            
            groupRef.current.rotation.y +=
                (clampedTargetY - groupRef.current.rotation.y) * 0.1;
            groupRef.current.rotation.x +=
                (clampedTargetX - groupRef.current.rotation.x) * 0.1;
        }
    });

    // Compute scale + center ONCE and lock it so clicks/re-renders never change the size
    const { fixedScale, fixedCenter } = useMemo(() => {
        const box = new THREE.Box3().setFromObject(fbx);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const s = Math.min((viewport.height * 0.625) / maxDim, 3.125);
        return { fixedScale: s, fixedCenter: center };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Empty deps = compute once on mount, never recalculate

    return (
        <group ref={groupRef} position={[-0.7, 0, 0]}>
            <primitive
                object={fbx}
                scale={[fixedScale, fixedScale, fixedScale]}
                rotation={[0, -Math.PI / 1.5, 0]}
                position={[-fixedCenter.x * fixedScale, -fixedCenter.y * fixedScale, -fixedCenter.z * fixedScale]}
            />
            {hotspots.map((spot) => (
                <Html
                    key={spot.id}
                    position={spot.position}
                    distanceFactor={3}
                    zIndexRange={[10, 0]}
                >
                    <div
                        className="hotspot-dot"
                        onClick={() => onHotspotClick(spot)}
                        title={spot.label}
                    />
                </Html>
            ))}
        </group>
    );
}

function LoaderFallback() {
    return (
        <div
            style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "radial-gradient(ellipse at center, #111 0%, #050505 70%)",
            }}
        >
            <AeroLoader inline />
        </div>
    );
}

export default function WheelShowcase() {
    const [activeHotspot, setActiveHotspot] = useState<HotspotData>(hotspots[0]);
    const [isMobile, setIsMobile] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);
    const infoRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setIsMobile(window.innerWidth < 768);
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(sectionRef.current, {
                opacity: 0,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 80%",
                    end: "top 40%",
                    scrub: true,
                },
            });
        });
        return () => ctx.revert();
    }, []);

    const handleHotspotClick = useCallback((data: HotspotData) => {
        setActiveHotspot(data);
        if (infoRef.current) {
            gsap.fromTo(
                infoRef.current,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }
            );
        }
    }, []);

    return (
        <section ref={sectionRef} className="wheel-section" id="wheel">
            {/* Left: Info Panel */}
            <div className="wheel-info">
                <div className="wheel-info-label">Interactive Showcase</div>
                <h2 className="wheel-info-title">
                    Engineered
                    <br />
                    Without Compromise
                </h2>
                <p className="wheel-info-desc">
                    Every AERO wheel begins as a single billet of aerospace-grade aluminum,
                    forged under immense pressure and precision-machined to tolerances
                    measured in microns.
                </p>

                <div ref={infoRef}>
                    <div
                        style={{
                            padding: "1.5rem",
                            background: "var(--card-bg)",
                            borderRadius: "12px",
                            border: "1px solid var(--card-border)",
                            marginBottom: "2rem",
                        }}
                    >
                        <div
                            style={{
                                fontFamily: "'Manrope', sans-serif",
                                fontSize: "0.7rem",
                                letterSpacing: "0.3em",
                                textTransform: "uppercase" as const,
                                color: "var(--accent)",
                                marginBottom: "0.5rem",
                            }}
                        >
                            {activeHotspot.label}
                        </div>
                        <div
                            style={{
                                fontFamily: "'Manrope', sans-serif",
                                fontSize: "1.8rem",
                                fontWeight: 800,
                                marginBottom: "0.5rem",
                            }}
                        >
                            {activeHotspot.info.value}
                        </div>
                        <div
                            style={{
                                fontSize: "0.85rem",
                                lineHeight: 1.7,
                                color: "var(--accent)",
                            }}
                        >
                            {activeHotspot.info.description}
                        </div>
                    </div>
                </div>

                <div className="wheel-specs">
                    <div className="wheel-spec-item">
                        <div className="wheel-spec-value">8.2</div>
                        <div className="wheel-spec-label">Weight (kg)</div>
                    </div>
                    <div className="wheel-spec-item">
                        <div className="wheel-spec-value">6061</div>
                        <div className="wheel-spec-label">Alloy Grade</div>
                    </div>
                    <div className="wheel-spec-item">
                        <div className="wheel-spec-value">PVD</div>
                        <div className="wheel-spec-label">Finish</div>
                    </div>
                </div>
            </div>

            {/* Right: 3D Canvas */}
            <div className="wheel-canvas-wrapper">
                {isMobile ? (
                    <LoaderFallback />
                ) : (
                    <Suspense fallback={<LoaderFallback />}>
                        <Canvas
                            camera={{ position: [0, 0, 4], fov: 45 }}
                            style={{ width: "100%", height: "100%" }}
                            gl={{ antialias: true, alpha: true }}
                        >
                            <ambientLight intensity={0.4} />
                            <spotLight
                                position={[5, 5, 5]}
                                angle={0.3}
                                penumbra={0.8}
                                intensity={2}
                                castShadow
                                color="#fff"
                            />
                            <spotLight
                                position={[-5, -2, 3]}
                                angle={0.4}
                                penumbra={1}
                                intensity={1}
                                color="#b0b0b0"
                            />
                            <directionalLight
                                position={[0, 5, -5]}
                                intensity={0.6}
                                color="#e0d0b8"
                            />
                            <WheelModel onHotspotClick={handleHotspotClick} />
                            <ContactShadows
                                position={[0, -1.5, 0]}
                                opacity={0.4}
                                scale={5}
                                blur={2.5}
                            />
                            <Environment preset="city" />
                        </Canvas>
                    </Suspense>
                )}
            </div>
        </section>
    );
}
