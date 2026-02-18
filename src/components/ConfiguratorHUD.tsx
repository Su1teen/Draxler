"use client";

import Image from "next/image";
import { useMemo, useState, useEffect, useRef, type WheelEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CarBrand {
    name: string;
    logoPath: string;
    models: string[];
}

const CAR_BRANDS: CarBrand[] = [
    { name: "Mercedes", logoPath: "/logos_names/Mercedes-Logo.svg.png", models: ["S-class", "G-class"] },
    { name: "Audi", logoPath: "/logos_names/audi.png", models: ["Q8", "A6"] },
    { name: "BMW", logoPath: "/logos_names/BMW.svg.png", models: ["M340i", "X5", "M5"] },
    { name: "Lamborghini", logoPath: "/logos_names/lamborghini-logo.png", models: ["Urus", "Huracan"] },
    { name: "Rolls-Royce", logoPath: "/logos_names/rr.png", models: ["Wraith", "Cullinan", "Ghost"] },
    { name: "Toyota", logoPath: "/logos_names/toyota.png", models: ["Tundra"] },
    { name: "Lexus", logoPath: "/logos_names/Lexus.png", models: ["GX", "LC500"] },
    { name: "Cadillac", logoPath: "/logos_names/cadillac.png", models: ["Escalade"] },
    { name: "Ford", logoPath: "/logos_names/ford.png", models: ["F-150", "Mustang"] },
    { name: "Porsche", logoPath: "/logos_names/Porsche_logo.png", models: ["911", "Cayenne"] },
    { name: "Bentley", logoPath: "/logos_names/bentley-logo.png", models: ["Continental", "Bentayga"] },
    { name: "McLaren", logoPath: "/logos_names/mclaren.png", models: ["720", "650"] },
    { name: "Chevrolet", logoPath: "/logos_names/chevrolet.png", models: ["Corvette", "Camaro"] },
    { name: "Dodge", logoPath: "/logos_names/dodge.png", models: ["Challenger", "Ram TRX"] },
    { name: "Land Rover", logoPath: "/logos_names/land rover.png", models: ["Range Rover", "Defender"] },
];

const WHEEL_MODELS = [
    { id: "DRX-101", image: "/logos_names/DRX_101.png" },
    { id: "DRX-102", image: "/logos_names/DRX_102.png" },
    { id: "DRX-103", image: "/logos_names/DRX_103.png" },
];

const WHEEL_CATEGORIES = ["Off-Road", "VIP", "Sport"] as const;

const LIGHT_TILE_BRANDS = new Set([
    "Mercedes",
    "Audi",
    "BMW",
    "Rolls-Royce",
    "Toyota",
    "Lexus",
    "Ford",
    "Porsche",
    "Cadillac",
]);

export default function ConfiguratorHUD({
    active,
    onSelectModel,
    onSelectWheelModel,
    onOpenFinalize,
}: {
    active: boolean;
    onSelectModel: (label: string) => void;
    onSelectWheelModel: (wheel: string) => void;
    onOpenFinalize: () => void;
}) {
    const [openSection, setOpenSection] = useState<"vehicle" | "wheels" | null>("vehicle");
    const [selectedBrand, setSelectedBrand] = useState<string>("BMW");
    const [selectedModelLabel, setSelectedModelLabel] = useState<string>("BMW M340i");
    const [selectedWheelCategory, setSelectedWheelCategory] = useState<(typeof WHEEL_CATEGORIES)[number]>("Off-Road");
    const [selectedWheelModel, setSelectedWheelModel] = useState<string>("DRX-101");
    const panelScrollRef = useRef<HTMLDivElement>(null);

    const activeBrand = useMemo(
        () => CAR_BRANDS.find((brand) => brand.name === selectedBrand) ?? CAR_BRANDS[0],
        [selectedBrand]
    );

    useEffect(() => {
        if (!active) return;
        onSelectModel(selectedModelLabel);
        onSelectWheelModel(selectedWheelModel);
    }, [active, onSelectModel, onSelectWheelModel, selectedModelLabel, selectedWheelModel]);

    const currentCategoryWheels = useMemo(
        () => WHEEL_MODELS.map((wheel) => ({ ...wheel, category: selectedWheelCategory })),
        [selectedWheelCategory]
    );

    const handlePanelWheel = (event: WheelEvent<HTMLElement>) => {
        event.stopPropagation();

        const scroller = panelScrollRef.current;
        if (!scroller) return;

        if (scroller.scrollHeight > scroller.clientHeight) {
            event.preventDefault();
            scroller.scrollTop += event.deltaY;
        }
    };

    return (
        <AnimatePresence>
            {active && (
                <>
                    <motion.aside
                        className="fixed bottom-6 right-4 top-24 z-30 w-[400px] overflow-hidden rounded-[10px] border border-white/10 bg-[#111]/80 text-white backdrop-blur-xl"
                        onWheelCapture={handlePanelWheel}
                        initial={{ opacity: 0, x: 56 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 56 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <div className="flex h-full flex-col">
                            <div ref={panelScrollRef} className="flex-1 overflow-y-auto px-6 pb-6 pt-8">
                                <button
                                    className="flex w-full items-center justify-between border-b border-white/10 pb-4 text-left"
                                    onClick={() => setOpenSection((prev) => (prev === "vehicle" ? null : "vehicle"))}
                                >
                                    <span className="text-[11px] font-medium uppercase tracking-[0.36em] text-white/80">Vehicle</span>
                                    <span className="text-white/60">{openSection === "vehicle" ? "−" : "+"}</span>
                                </button>

                                <AnimatePresence initial={false}>
                                    {openSection === "vehicle" && (
                                        <motion.div
                                            key="vehicle"
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.24, ease: "easeInOut" }}
                                            className="overflow-hidden"
                                        >
                                            <div className="grid grid-cols-3 gap-2 pt-4">
                                                {CAR_BRANDS.map((brand) => {
                                                    const isActiveBrand = selectedBrand === brand.name;
                                                    const needsLightTile = LIGHT_TILE_BRANDS.has(brand.name);

                                                    return (
                                                        <button
                                                            key={brand.name}
                                                            onClick={() => {
                                                                setSelectedBrand(brand.name);
                                                                const modelLabel = `${brand.name} ${brand.models[0]}`;
                                                                setSelectedModelLabel(modelLabel);
                                                                onSelectModel(modelLabel);
                                                            }}
                                                            className={`rounded-lg border p-2 transition ${
                                                                isActiveBrand
                                                                    ? "border-white/60 bg-white/10"
                                                                    : "border-white/10 bg-white/[0.03] hover:border-white/30"
                                                            }`}
                                                            aria-label={`Select ${brand.name}`}
                                                        >
                                                            <div
                                                                className={`flex h-[58px] items-center justify-center rounded-md ${
                                                                    needsLightTile ? "bg-white/90" : "bg-transparent"
                                                                }`}
                                                            >
                                                                <Image
                                                                    src={brand.logoPath}
                                                                    alt={brand.name}
                                                                    width={90}
                                                                    height={46}
                                                                    className="h-[42px] w-auto object-contain"
                                                                />
                                                            </div>
                                                        </button>
                                                    );
                                                })}
                                            </div>

                                            <div className="mt-4 space-y-2">
                                                <div className="text-[10px] uppercase tracking-[0.32em] text-white/50">Models</div>
                                                {activeBrand.models.map((model) => {
                                                    const modelLabel = `${activeBrand.name} ${model}`;
                                                    const isActiveModel = selectedModelLabel === modelLabel;

                                                    return (
                                                        <button
                                                            key={model}
                                                            className={`w-full rounded-md border px-3 py-2 text-left text-sm tracking-[0.12em] transition ${
                                                                isActiveModel
                                                                    ? "border-white/60 bg-white/15 text-white"
                                                                    : "border-white/10 bg-white/[0.02] text-white/70 hover:border-white/35 hover:text-white"
                                                            }`}
                                                            onClick={() => {
                                                                setSelectedModelLabel(modelLabel);
                                                                onSelectModel(modelLabel);
                                                            }}
                                                        >
                                                            {model}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <button
                                    className="mt-6 flex w-full items-center justify-between border-b border-white/10 pb-4 text-left"
                                    onClick={() => setOpenSection((prev) => (prev === "wheels" ? null : "wheels"))}
                                >
                                    <span className="text-[11px] font-medium uppercase tracking-[0.36em] text-white/80">Wheels</span>
                                    <span className="text-white/60">{openSection === "wheels" ? "−" : "+"}</span>
                                </button>

                                <AnimatePresence initial={false}>
                                    {openSection === "wheels" && (
                                        <motion.div
                                            key="wheels"
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.24, ease: "easeInOut" }}
                                            className="overflow-hidden"
                                        >
                                            <div className="pt-5">
                                                <div className="mb-4 grid grid-cols-3 gap-2">
                                                    {WHEEL_CATEGORIES.map((category) => (
                                                        <button
                                                            key={category}
                                                            className={`rounded-md border px-2 py-2 text-[11px] uppercase tracking-[0.16em] transition ${
                                                                selectedWheelCategory === category
                                                                    ? "border-white/70 bg-white/15 text-white"
                                                                    : "border-white/10 bg-white/[0.03] text-white/65 hover:border-white/30 hover:text-white"
                                                            }`}
                                                            onClick={() => {
                                                                setSelectedWheelCategory(category);
                                                                setSelectedWheelModel("DRX-101");
                                                                onSelectWheelModel("DRX-101");
                                                            }}
                                                        >
                                                            {category}
                                                        </button>
                                                    ))}
                                                </div>

                                                <motion.div
                                                    key={selectedWheelCategory}
                                                    className="mx-auto w-[98%] space-y-3"
                                                    initial={{ opacity: 0, scale: 0.98 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ duration: 0.22, ease: "easeOut" }}
                                                >
                                                    {currentCategoryWheels.map((wheel) => (
                                                        <button
                                                            key={`${selectedWheelCategory}-${wheel.id}`}
                                                            className={`w-full rounded-xl border p-3 text-left transition ${
                                                                selectedWheelModel === wheel.id
                                                                    ? "border-white/70 bg-white/14"
                                                                    : "border-white/10 bg-white/[0.02] hover:border-white/35"
                                                            }`}
                                                            onClick={() => {
                                                                setSelectedWheelModel(wheel.id);
                                                                onSelectWheelModel(wheel.id);
                                                            }}
                                                        >
                                                            <div className="flex h-[235px] w-full items-center justify-center">
                                                                <Image
                                                                    src={wheel.image}
                                                                    alt={wheel.id}
                                                                    width={360}
                                                                    height={235}
                                                                    className="h-[235px] w-full object-contain"
                                                                />
                                                            </div>
                                                            <div className="mt-2 text-base uppercase tracking-[0.2em] text-white/92">{wheel.id}</div>
                                                        </button>
                                                    ))}
                                                </motion.div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="border-t border-white/10 p-6">
                                <button
                                    className="w-full rounded-full bg-white px-5 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-black transition hover:bg-white/90"
                                    onClick={onOpenFinalize}
                                >
                                    Finalize Configuration
                                </button>
                            </div>
                        </div>
                    </motion.aside>

                    <motion.div
                        className="pointer-events-none absolute bottom-6 left-6 z-20 flex items-center gap-3 text-[10px] uppercase tracking-[0.24em] text-black/55"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            transition: { delay: 0.5, duration: 0.6 },
                        }}
                        exit={{ opacity: 0, y: 10 }}
                    >
                        <span className="h-[5px] w-[5px] rounded-full bg-black/30" />
                        <span>Drag to Rotate</span>
                        <span className="opacity-45">|</span>
                        <span>Shift + Scroll to Zoom</span>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
