"use client";

import {
    Suspense,
    useRef,
    useState,
    useEffect,
    useMemo,
    useCallback,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
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
import { Check, LoaderCircle, X } from "lucide-react";
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
    const [selectedModel, setSelectedModel] = useState("BMW M340i");
    const [selectedWheelModel, setSelectedWheelModel] = useState("DRX-101");
    const [showFinalize, setShowFinalize] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [isShiftPressed, setIsShiftPressed] = useState(false);

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

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Shift") setIsShiftPressed(true);
        };

        const onKeyUp = (event: KeyboardEvent) => {
            if (event.key === "Shift") setIsShiftPressed(false);
        };

        const onBlur = () => setIsShiftPressed(false);

        window.addEventListener("keydown", onKeyDown);
        window.addEventListener("keyup", onKeyUp);
        window.addEventListener("blur", onBlur);

        return () => {
            window.removeEventListener("keydown", onKeyDown);
            window.removeEventListener("keyup", onKeyUp);
            window.removeEventListener("blur", onBlur);
        };
    }, []);

    const handleEnter = useCallback(() => {
        setIsActive(true);
        setShowButton(false);
    }, []);

    const handleExit = useCallback(() => {
        setIsActive(false);
        setShowFinalize(false);
    }, []);

    const canShowActionButton = isActive || showButton;

    const handleCloseFinalize = useCallback(() => {
        setShowFinalize(false);
        setSubmitSuccess(false);
        setIsSubmitting(false);
    }, []);

    const handleSubmitLead = useCallback(async () => {
        if (!name.trim() || !email.trim() || !phone.trim()) return;

        setIsSubmitting(true);
        try {
            const response = await fetch("/api/configurator-lead", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    selectedCarModel: selectedModel,
                    selectedWheelModel,
                    customer: {
                        name: name.trim(),
                        email: email.trim(),
                        phone: phone.trim(),
                    },
                }),
            });

            if (!response.ok) throw new Error("Failed to submit lead");

            setSubmitSuccess(true);
            setTimeout(() => {
                setShowFinalize(false);
                setName("");
                setEmail("");
                setPhone("");
                setSubmitSuccess(false);
            }, 1300);
        } catch {
            setSubmitSuccess(false);
        } finally {
            setIsSubmitting(false);
        }
    }, [email, name, phone, selectedModel, selectedWheelModel]);

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
                        enableZoom={isShiftPressed}
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
                <div className={`car-config-title ${isActive ? "car-config-title--hidden" : ""}`}>
                    <span className="car-config-label">Interactive Experience</span>
                    <h2 className="car-config-heading" style={{ fontWeight: 600, color: "#000000" }}>
                        The BMW M340i
                    </h2>
                </div>

                <AnimatePresence>
                    {canShowActionButton && (
                        <motion.div
                            className="car-config-action-anchor"
                            style={{
                                position: "absolute",
                                bottom: "80px",
                                left: "50%",
                                transform: "translateX(-50%)",
                                zIndex: 50,
                            }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <AnimatePresence mode="wait">
                                {!isActive ? (
                                    <motion.button
                                        key="enter"
                                        className="car-config-action-btn"
                                        onClick={handleEnter}
                                        initial={{ opacity: 0, scale: 0.94, filter: "blur(6px)" }}
                                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                                        exit={{ opacity: 0, scale: 1.03, filter: "blur(4px)" }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        Enter Configurator
                                    </motion.button>
                                ) : (
                                    <motion.button
                                        key="exit"
                                        className="car-config-action-btn car-config-action-btn--exit"
                                        onClick={handleExit}
                                        initial={{ opacity: 0, scale: 0.96, filter: "blur(6px)" }}
                                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                                        exit={{ opacity: 0, scale: 1.03, filter: "blur(4px)" }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <X size={16} />
                                        <span>Exit</span>
                                    </motion.button>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <ConfiguratorHUD
                active={isActive}
                onSelectModel={(label) => setSelectedModel(label)}
                onSelectWheelModel={(wheel) => setSelectedWheelModel(wheel)}
                onOpenFinalize={() => setShowFinalize(true)}
            />

            <AnimatePresence>
                {isActive && !showFinalize && (
                    <motion.div
                        className="car-config-summary"
                        initial={{ opacity: 0, x: 26, y: 18 }}
                        animate={{ opacity: 1, x: 0, y: 0 }}
                        exit={{ opacity: 0, x: 16, y: 10 }}
                    >
                        <span className="car-config-summary-label">Current Build</span>
                        <h4>Your {selectedModel} on {selectedWheelModel}</h4>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isActive && showFinalize && (
                    <motion.div
                        className="config-lead-modal-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="config-lead-modal"
                            initial={{ opacity: 0, y: 30, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 18, scale: 0.98 }}
                        >
                            <button className="config-lead-close" onClick={handleCloseFinalize}>
                                <X size={15} />
                            </button>

                            <h3>Request Quote</h3>
                            <p>Your {selectedModel} on {selectedWheelModel}</p>

                            <div className="config-lead-step-content">
                                <label>Name</label>
                                <input
                                    className="config-lead-input"
                                    value={name}
                                    onChange={(event) => setName(event.target.value)}
                                    placeholder="Your name"
                                />

                                <label>Email</label>
                                <input
                                    className="config-lead-input"
                                    type="email"
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                    placeholder="name@email.com"
                                />

                                <label>Phone</label>
                                <input
                                    className="config-lead-input"
                                    value={phone}
                                    onChange={(event) => setPhone(event.target.value)}
                                    placeholder="+1 (___) ___-____"
                                />

                                <div className="config-lead-actions">
                                    <button
                                        className="config-lead-submit"
                                        onClick={handleSubmitLead}
                                        disabled={!name.trim() || !email.trim() || !phone.trim() || isSubmitting || submitSuccess}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <LoaderCircle size={16} className="spin" />
                                                <span>Sending...</span>
                                            </>
                                        ) : submitSuccess ? (
                                            <>
                                                <Check size={16} />
                                                <span>Sent</span>
                                            </>
                                        ) : (
                                            <span>Send Request</span>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
