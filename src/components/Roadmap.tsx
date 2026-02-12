"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const steps = [
    {
        number: "01",
        title: "Design",
        desc: "Every wheel begins as a digital sculpture. Our engineers use parametric CAD to define spoke geometry, load paths, and aerodynamic profiles before a single gram of metal is cut.",
    },
    {
        number: "02",
        title: "Engineering",
        desc: "Finite Element Analysis simulates extreme forces — cornering, braking, curb impacts — ensuring each design exceeds JWL, VIA, and TÜV load ratings with margin to spare.",
    },
    {
        number: "03",
        title: "Forging",
        desc: "A solid billet of 6061-T6 aluminium is pressed under 8,000 tonnes of force. The grain structure aligns directionally, delivering strength-to-weight ratios cast wheels cannot achieve.",
    },
    {
        number: "04",
        title: "Machining",
        desc: "5-axis CNC machines carve each spoke face, barrel, and lip to ±0.02 mm tolerance. Diamond-tipped tools produce surfaces so precise they become mirrors.",
    },
    {
        number: "05",
        title: "Finishing",
        desc: "Layers of primer, pigmented base coat, and PVD clear seal protect against UV, brake dust, and road salts. Each wheel is hand-inspected under polarized light before shipping.",
    },
];

export default function Roadmap() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [activeStep, setActiveStep] = useState<number | null>(null);
    const timelineRef = useRef<gsap.core.Timeline | null>(null);

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
                                    <button className="rm-reveal-btn">Details</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
