"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function Preloader({ onComplete }: { onComplete: () => void }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const counterRef = useRef<HTMLDivElement>(null);
    const lineRef = useRef<HTMLDivElement>(null);
    const [count, setCount] = useState(0);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Counter animation
            const obj = { val: 0 };
            gsap.to(obj, {
                val: 100,
                duration: 2.5,
                ease: "power2.inOut",
                onUpdate: () => {
                    setCount(Math.round(obj.val));
                },
                onComplete: () => {
                    // Line flash
                    gsap.to(lineRef.current, {
                        scaleX: 1,
                        duration: 0.4,
                        ease: "power3.out",
                    });

                    // Curtain slide up
                    gsap.to(containerRef.current, {
                        y: "-100%",
                        duration: 1,
                        ease: "power3.inOut",
                        delay: 0.5,
                        onComplete: () => {
                            onComplete();
                        },
                    });
                },
            });

            // Line grows with counter
            gsap.to(lineRef.current, {
                scaleX: 1,
                duration: 2.5,
                ease: "power2.inOut",
            });
        });

        return () => ctx.revert();
    }, [onComplete]);

    return (
        <div ref={containerRef} className="preloader">
            <div ref={counterRef} className="preloader-counter">
                {count}
            </div>
            <div className="preloader-label">Loading Experience</div>
            <div
                ref={lineRef}
                className="preloader-line"
                style={{ transform: "scaleX(0)" }}
            />
        </div>
    );
}
