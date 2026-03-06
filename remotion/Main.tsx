import React from "react";
import { z } from "zod";
import {
    AbsoluteFill,
    Audio,
    Sequence,
    useVideoConfig,
    useCurrentFrame,
    interpolate,
} from "remotion";
import { Scene } from "./components/Scene";
import { Captions } from "./components/Captions";

export const mainSchema = z.object({
    audioUrl: z.string(),
    srtContent: z.string(),
    imageUrls: z.array(z.string()),
    videoStyle: z.string(),
    captionStyle: z.string(),
    durationInFrames: z.number(),
});

export const Main: React.FC<z.infer<typeof mainSchema>> = ({
    audioUrl,
    srtContent,
    imageUrls,
    videoStyle,
    captionStyle,
    durationInFrames,
}) => {
    const { fps } = useVideoConfig();

    // Calculate duration per image
    const imageDuration = Math.floor(durationInFrames / imageUrls.length);

    return (
        <AbsoluteFill className="bg-black">
            {/* 1. Background Audio */}
            {audioUrl && <Audio src={audioUrl} />}

            {/* 2. Image Sequences */}
            {imageUrls.map((url, index) => (
                <Sequence
                    key={url}
                    from={index * imageDuration}
                    durationInFrames={imageDuration + (index === imageUrls.length - 1 ? 30 : 0)}
                >
                    <Scene
                        imageUrl={url}
                        index={index}
                        imageDuration={imageDuration}
                    />
                </Sequence>
            ))}

            {/* 3. Captions Overlay */}
            <Captions
                srtContent={srtContent}
                style={captionStyle}
            />
        </AbsoluteFill>
    );
};
