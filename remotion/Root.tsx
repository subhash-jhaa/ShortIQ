import React from "react";
import { Composition } from "remotion";
import { Main, mainSchema } from "./Main";

export const RemotionRoot: React.FC = () => {
    return (
        <>
            <Composition
                id="MainVideo"
                component={Main}
                durationInFrames={1800} // Default 60s @ 30fps, will be overridden
                fps={30}
                width={1080}
                height={1920}
                schema={mainSchema}
                defaultProps={{
                    audioUrl: "",
                    srtContent: "",
                    imageUrls: [],
                    videoStyle: "realistic",
                    captionStyle: "classic",
                    durationInFrames: 1800,
                }}
            />
        </>
    );
};
