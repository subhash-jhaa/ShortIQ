/**
 * Shared SRT parser — used by both FFmpeg and Creatomate renderers.
 */

export interface Caption {
    start: number;
    end: number;
    text: string;
}

/**
 * Parse SRT content into an array of caption objects.
 */
export function parseSrt(srtContent: string): Caption[] {
    if (!srtContent || !srtContent.trim()) return [];
    const blocks = srtContent.trim().split(/\n\s*\n/);
    return blocks.map((block) => {
        const lines = block.split("\n");
        if (lines.length < 3) return null;
        const timeLine = lines[1] || "";
        const text = lines.slice(2).join(" ").trim();
        const [startStr, endStr] = timeLine.split(" --> ");
        if (!startStr || !endStr) return null;
        const parseTime = (ts: string) => {
            const cleanTs = ts.trim().replace(",", ".");
            const [hms, ms = "000"] = cleanTs.split(".");
            const [h = 0, m = 0, s = 0] = hms.split(":").map(Number);
            return h * 3600 + m * 60 + s + Number(ms) / 1000;
        };
        return { start: parseTime(startStr), end: parseTime(endStr), text };
    }).filter((c): c is Caption => c !== null && Boolean(c.text));
}
