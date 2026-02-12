"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Brand data ─── */
interface CarBrand {
    name: string;
    models: string[];
}

const CAR_BRANDS: CarBrand[] = [
    { name: "Porsche", models: ["911 Turbo", "Taycan", "Cayenne", "Panamera"] },
    { name: "Audi", models: ["RS7", "R8", "e-tron GT", "Q8"] },
    { name: "BMW", models: ["M4 CSL", "M8", "iX", "7 Series"] },
    { name: "Ferrari", models: ["F8 Tributo", "Roma", "SF90", "296 GTB"] },
    { name: "Lamborghini", models: ["Huracán", "Urus", "Revuelto"] },
    { name: "Bentley", models: ["Continental GT", "Flying Spur", "Bentayga"] },
];

const WHEEL_BRANDS = ["Vossen", "Brixton", "PowerWheels", "Giovanna"];

/* ─── Animation variants ─── */
const panelLeft = {
    hidden: { opacity: 0, x: -40, filter: "blur(8px)" },
    visible: {
        opacity: 1,
        x: 0,
        filter: "blur(0px)",
        transition: { duration: 0.6, ease: "easeOut" as const },
    },
    exit: { opacity: 0, x: -30, filter: "blur(6px)", transition: { duration: 0.3 } },
};

const panelRight = {
    hidden: { opacity: 0, x: 40, filter: "blur(8px)" },
    visible: {
        opacity: 1,
        x: 0,
        filter: "blur(0px)",
        transition: { duration: 0.6, ease: "easeOut" as const, delay: 0.1 },
    },
    exit: { opacity: 0, x: 30, filter: "blur(6px)", transition: { duration: 0.3 } },
};

const modelListVariants = {
    hidden: { height: 0, opacity: 0 },
    visible: {
        height: "auto",
        opacity: 1,
        transition: { duration: 0.3, ease: "easeOut" as const },
    },
    exit: { height: 0, opacity: 0, transition: { duration: 0.2 } },
};

/* ─── Component ─── */
export default function ConfiguratorHUD({
    active,
    onSelectModel,
}: {
    active: boolean;
    onSelectModel: (label: string) => void;
}) {
    const [expandedBrand, setExpandedBrand] = useState<string | null>(null);
    const [selectedWheel, setSelectedWheel] = useState<string>("Vossen");
    const panelRef = useRef<HTMLDivElement>(null);

    // Close expanded brand on outside click
    useEffect(() => {
        if (!expandedBrand) return;
        const handler = (e: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
                setExpandedBrand(null);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [expandedBrand]);

    return (
        <AnimatePresence>
            {active && (
                <>
                    {/* ── Left Panel: Car Brands ── */}
                    <motion.div
                        ref={panelRef}
                        className="hud-panel hud-panel--left"
                        variants={panelLeft}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        <div className="hud-panel-header">Vehicle</div>
                        <div className="hud-panel-list">
                            {CAR_BRANDS.map((brand) => (
                                <div key={brand.name} className="hud-brand-group">
                                    <button
                                        className={`hud-brand-row ${
                                            expandedBrand === brand.name ? "hud-brand-row--active" : ""
                                        }`}
                                        onClick={() =>
                                            setExpandedBrand((prev) =>
                                                prev === brand.name ? null : brand.name
                                            )
                                        }
                                    >
                                        <span className="hud-brand-mono">
                                            {brand.name[0]}
                                        </span>
                                        <span className="hud-brand-name">{brand.name}</span>
                                        <svg
                                            className={`hud-brand-chevron ${
                                                expandedBrand === brand.name
                                                    ? "hud-brand-chevron--open"
                                                    : ""
                                            }`}
                                            width="14"
                                            height="14"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <polyline points="9 18 15 12 9 6" />
                                        </svg>
                                    </button>

                                    <AnimatePresence>
                                        {expandedBrand === brand.name && (
                                            <motion.div
                                                className="hud-model-list"
                                                variants={modelListVariants}
                                                initial="hidden"
                                                animate="visible"
                                                exit="exit"
                                            >
                                                {brand.models.map((model) => (
                                                    <button
                                                        key={model}
                                                        className="hud-model-item"
                                                        onClick={() => {
                                                            onSelectModel(
                                                                `${brand.name} ${model}`
                                                            );
                                                            setExpandedBrand(null);
                                                        }}
                                                    >
                                                        {model}
                                                    </button>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* ── Right Panel: Wheel Brands ── */}
                    <motion.div
                        className="hud-panel hud-panel--right"
                        variants={panelRight}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        <div className="hud-panel-header">Wheels</div>
                        <div className="hud-panel-list">
                            {WHEEL_BRANDS.map((name) => (
                                <button
                                    key={name}
                                    className={`hud-wheel-item ${
                                        selectedWheel === name ? "hud-wheel-item--active" : ""
                                    }`}
                                    onClick={() => setSelectedWheel(name)}
                                >
                                    <span className="hud-wheel-radio" />
                                    <span>{name}</span>
                                </button>
                            ))}
                        </div>
                    </motion.div>

                    {/* ── Bottom centre tag ── */}
                    <motion.div
                        className="hud-bottom-tag"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            transition: { delay: 0.5, duration: 0.6 },
                        }}
                        exit={{ opacity: 0, y: 10 }}
                    >
                        <span className="hud-bottom-dot" />
                        <span>Drag to Rotate</span>
                        <span className="hud-bottom-sep">|</span>
                        <span>Scroll to Zoom</span>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
