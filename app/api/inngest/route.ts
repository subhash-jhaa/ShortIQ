import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { generateVideo } from "@/inngest/functions";
import { seriesScheduler, dailyWorkflow } from "@/inngest/scheduling";



export const { GET, POST, PUT } = serve({
    client: inngest,
    functions: [
        generateVideo,
        seriesScheduler,
        dailyWorkflow,
    ],
});
