import React from "react";
import {
    AbsoluteFill,
    Img,
    interpolate,
    useCurrentFrame,
    useVideoConfig,
} from "remotion";

interface SceneProps {
    imageUrl: string;
    index: number;
    imageDuration: number;
}

export const Scene: React.FC<SceneProps> = ({ imageUrl, index, imageDuration }) => {
    const frame = useCurrentFrame();
    const { width, height } = useVideoConfig();

    // Animation cycle: 
    // 0: Fade In + Zoom In
    // 1: Zoom Out + Slow Pan Left
    // 2: Slight Tilt + Zoom In
    // 3: Slow Pan Right
    const animType = index % 4;

    let animation = {};

    if (animType === 0) {
        // Zoom In
        const scale = interpolate(frame, [0, imageDuration], [1, 1.2]);
        const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
        animation = { transform: `scale(${scale})`, opacity };
    } else if (animType === 1) {
        // Zoom Out + Pan
        const scale = interpolate(frame, [0, imageDuration], [1.3, 1.1]);
        const x = interpolate(frame, [0, imageDuration], [0, -50]);
        animation = { transform: `scale(${scale}) translateX(${x}px)` };
    } else if (animType === 2) {
        // Zoom In + Pan Up
        const scale = interpolate(frame, [0, imageDuration], [1, 1.15]);
        const y = interpolate(frame, [0, imageDuration], [0, -30]);
        animation = { transform: `scale(${scale}) translateY(${y}px)` };
    } else {
        // Zoom Out + Pan Right
        const scale = interpolate(frame, [0, imageDuration], [1.2, 1]);
        const x = interpolate(frame, [0, imageDuration], [0, 50]);
        animation = { transform: `scale(${scale}) translateX(${x}px)` };
    }

    return (
        <AbsoluteFill className="overflow-hidden">
            <Img
                src={imageUrl}
                style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    ...animation,
                }}
            />
            {/* Subtle vignette for better text readability */}
            <AbsoluteFill
                style={{
                    background: "radial-gradient(circle, transparent 40%, rgba(0,0,0,0.4) 100%)"
                }}
            />
        </AbsoluteFill>
    );
};
