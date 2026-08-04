/**
 * Shared caption style definitions — used by both FFmpeg local rendering
 * and any future cloud render pipelines.
 */

export interface CaptionStyleConfig {
    color: string;
    fontFamily: string;
    fontWeight: string;
    shadowColor?: string;
    borderColor?: string;
}

export const CAPTION_STYLES: Record<string, CaptionStyleConfig> = {
    classic:    { color: "#ffffff", fontFamily: "Montserrat", fontWeight: "900", shadowColor: "rgba(0,0,0,0.5)",     borderColor: "black" },
    karaoke:    { color: "#FFD700", fontFamily: "Montserrat", fontWeight: "900", shadowColor: "rgba(0,0,0,0.5)",     borderColor: "black" },
    popup:      { color: "#ffffff", fontFamily: "Inter",      fontWeight: "900", shadowColor: "rgba(0,0,0,0.8)",     borderColor: "black" },
    glow:       { color: "#ffffff", fontFamily: "Montserrat", fontWeight: "900", shadowColor: "rgba(165,180,252,0.8)", borderColor: "#A5B4FC" },
    gradient:   { color: "#ffffff", fontFamily: "Montserrat", fontWeight: "900", shadowColor: "rgba(192,132,252,0.8)", borderColor: "#C084FC" },
    typewriter: { color: "#ffffff", fontFamily: "Courier New", fontWeight: "700", shadowColor: "rgba(0,0,0,0.5)",    borderColor: "black" },
};
