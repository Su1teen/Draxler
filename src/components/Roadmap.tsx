"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

type StepActionType = "catalog" | "quote" | "configurator";

interface StepAction {
    label: string;
    variant: "primary" | "secondary";
    action: StepActionType;
}

interface RoadmapStep {
    number: string;
    title: string;
    desc: string;
    actions: StepAction[];
}

const steps: RoadmapStep[] = [
    {
        number: "01",
        title: "Consultation & Design",
        desc: "Start by selecting a model from our Signature Collection, providing your own sketches, or collaborating with our designers to create a unique masterpiece from scratch.",
        actions: [
            { label: "Explore Catalog", variant: "primary", action: "catalog" },
            { label: "Request Quote", variant: "secondary", action: "quote" },
        ],
    },
    {
        number: "02",
        title: "Engineering & FEA",
        desc: "Safety is paramount. Every design undergoes Finite Element Analysis (FEA). We optimize the 3D model for your specific vehicle parameters to guarantee performance.",
        actions: [{ label: "Request Quote", variant: "secondary", action: "quote" }],
    },
    {
        number: "03",
        title: "Interactive 3D Configuration",
        desc: "Immerse yourself in our real-time 3D studio. Select your vehicle, experiment with finishes, and inspect the wheel geometry from every angle.",
        actions: [{ label: "Explore Configurator", variant: "primary", action: "configurator" }],
    },
    {
        number: "04",
        title: "Precision CNC Machining",
        desc: "Precision in motion. Our multi-axis CNC mills carve the design with micron-level tolerance, transforming the raw forged billet into a work of engineering art.",
        actions: [{ label: "Request Quote", variant: "secondary", action: "quote" }],
    },
    {
        number: "05",
        title: "Hand Finishing",
        desc: "The final touch. From hand-brushing to powder coating, our artisans apply the finish with meticulous care. Every wheel undergoes a rigorous quality control inspection.",
        actions: [{ label: "Request Quote", variant: "secondary", action: "quote" }],
    },
];

export default function Roadmap() {
    const router = useRouter();
    const sectionRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [activeStep, setActiveStep] = useState<number | null>(null);
    const timelineRef = useRef<gsap.core.Timeline | null>(null);
    const hasAutoOpenedRef = useRef(false);

    const smoothScrollTo = useCallback((targetY: number, duration = 1300) => {
        const startY = window.scrollY || window.pageYOffset;
        const distance = targetY - startY;
        const startTime = performance.now();

        const easeInOutCubic = (time: number) =>
            time < 0.5 ? 4 * time * time * time : 1 - Math.pow(-2 * time + 2, 3) / 2;

        const stepFrame = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = easeInOutCubic(progress);

            window.scrollTo(0, startY + distance * eased);

            if (progress < 1) {
                requestAnimationFrame(stepFrame);
            }
        };

        requestAnimationFrame(stepFrame);
    }, []);

    const handleAction = useCallback((action: StepActionType) => {
        if (action === "catalog" || action === "quote") {
            router.push("/catalog");
            return;
        }

        const configurator = document.querySelector(".car-configurator-section") as HTMLElement | null;
        if (!configurator) return;

        const target = configurator.getBoundingClientRect().top + window.scrollY;
        smoothScrollTo(target, 1400);
    }, [router, smoothScrollTo]);

    // Entrance animation
    useEffect(() => {
        const ctx = gsap.context(() => {
            // Fade in the header
            gsap.from(".roadmap-header", {
                y: 40,
                opacity: 0,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 75%",
                },
            });

            // Stagger the timeline nodes
            gsap.from(".rm-node", {
                y: 30,
                opacity: 0,
                duration: 0.7,
                ease: "power3.out",
                stagger: 0.12,
                scrollTrigger: {
                    trigger: ".rm-timeline",
                    start: "top 85%",
                },
            });

            // Animate the connecting line width
            gsap.from(".rm-line-fill", {
                scaleX: 0,
                duration: 1.2,
                ease: "power2.inOut",
                scrollTrigger: {
                    trigger: ".rm-timeline",
                    start: "top 85%",
                },
            });
        });

        return () => ctx.revert();
    }, []);

    useEffect(() => {
        if (!sectionRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                if (!entry || !entry.isIntersecting) return;
                if (hasAutoOpenedRef.current) return;

                hasAutoOpenedRef.current = true;
                setActiveStep(0);
            },
            {
                threshold: 0.35,
            }
        );

        observer.observe(sectionRef.current);

        return () => observer.disconnect();
    }, []);

    const handleStepClick = useCallback((index: number) => {
        // Kill any running animation
        if (timelineRef.current) {
            timelineRef.current.kill();
        }

        // If clicking the same step, close it
        if (activeStep === index) {
            const tl = gsap.timeline();
            tl.to(".rm-reveal", {
                opacity: 0,
                y: 30,
                duration: 0.4,
                ease: "power2.in",
                onComplete: () => setActiveStep(null),
            });
            timelineRef.current = tl;
            return;
        }

        // If there's an active step, animate out first, then in
        if (activeStep !== null) {
            const tl = gsap.timeline();
            tl.to(".rm-reveal", {
                opacity: 0,
                y: 20,
                duration: 0.3,
                ease: "power2.in",
            });
            tl.call(() => setActiveStep(index));
            timelineRef.current = tl;
        } else {
            setActiveStep(index);
        }
    }, [activeStep]);

    // Animate content in when activeStep changes
    useEffect(() => {
        if (activeStep === null || !contentRef.current) return;

        const tl = gsap.timeline();

        // Set initial state
        gsap.set(".rm-reveal", { opacity: 0, y: 40 });
        gsap.set(".rm-reveal-image", { scale: 1.15, opacity: 0 });
        gsap.set(".rm-reveal-label", { x: -20, opacity: 0 });
        gsap.set(".rm-reveal-heading", { y: 20, opacity: 0 });
        gsap.set(".rm-reveal-desc", { y: 20, opacity: 0 });
        gsap.set(".rm-reveal-btn", { y: 15, opacity: 0 });

        // Container slides up and fades in
        tl.to(".rm-reveal", {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
        });

        // Image zooms to fit and fades in
        tl.to(".rm-reveal-image", {
            scale: 1,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
        }, "-=0.4");

        // Label slides in
        tl.to(".rm-reveal-label", {
            x: 0,
            opacity: 1,
            duration: 0.5,
            ease: "power3.out",
        }, "-=0.5");

        // Heading rises up
        tl.to(".rm-reveal-heading", {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: "power3.out",
        }, "-=0.35");

        // Description fades in
        tl.to(".rm-reveal-desc", {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: "power3.out",
        }, "-=0.3");

        // Button rises up
        tl.to(".rm-reveal-btn", {
            y: 0,
            opacity: 1,
            duration: 0.5,
            ease: "power3.out",
        }, "-=0.3");

        timelineRef.current = tl;
    }, [activeStep]);

    const active = activeStep !== null ? steps[activeStep] : null;

    return (
        <section ref={sectionRef} className="rm-section" id="roadmap">
            <div className="rm-inner">
                {/* Header */}
                <div className="roadmap-header">
                    <div className="rm-label">Manufacturing Process</div>
                    <h2 className="rm-title">From Billet to Brilliance</h2>
                </div>

                {/* Timeline bar */}
                <div className="rm-timeline">
                    <div className="rm-line">
                        <div className="rm-line-fill" />
                    </div>
                    {steps.map((step, i) => (
                        <button
                            key={i}
                            className={`rm-node ${activeStep === i ? "rm-node--active" : ""}`}
                            onClick={() => handleStepClick(i)}
                        >
                            <div className="rm-dot" />
                            <span className="rm-number">{step.number}</span>
                            <span className="rm-step-title">{step.title}</span>
                        </button>
                    ))}
                </div>

                {/* Reveal content area */}
                <div ref={contentRef} className="rm-content-area">
                    {active && (
                        <div className="rm-reveal" key={activeStep}>
                            <div className="rm-reveal-grid">
                                {/* Image side */}
                                <div className="rm-reveal-image-wrap">
                                    <img
                                        src="/media/car-image-2.jpg"
                                        alt={active.title}
                                        className="rm-reveal-image"
                                    />
                                </div>

                                {/* Text side */}
                                <div className="rm-reveal-text">
                                    <div className="rm-reveal-label">
                                        Step {active.number}
                                    </div>
                                    <h3 className="rm-reveal-heading">{active.title}</h3>
                                    <p className="rm-reveal-desc">{active.desc}</p>
                                    <div className="rm-reveal-actions">
                                        {active.actions.map((action) => (
                                            <button
                                                key={action.label}
                                                className={`rm-reveal-btn rm-reveal-btn--${action.variant}`}
                                                onClick={() => handleAction(action.action)}
                                            >
                                                {action.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
