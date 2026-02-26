import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-[#0a0a0b]">
            <div className="rounded-2xl border border-white/5 bg-white/5 p-4 backdrop-blur-xl">
                <SignUp
                    appearance={{
                        elements: {
                            formButtonPrimary:
                                "bg-cyan-500 hover:bg-cyan-600 text-sm normal-case",
                            card: "bg-transparent shadow-none border-none",
                            headerTitle: "text-white",
                            headerSubtitle: "text-gray-400",
                            socialButtonsBlockButton:
                                "bg-white/5 border-white/10 hover:bg-white/10 text-white",
                            socialButtonsBlockButtonText: "text-white",
                            dividerLine: "bg-white/10",
                            dividerText: "text-gray-500",
                            formFieldLabel: "text-gray-400",
                            formFieldInput:
                                "bg-white/5 border-white/10 text-white focus:border-cyan-500/50",
                            footerActionText: "text-gray-500",
                            footerActionLink: "text-cyan-500 hover:text-cyan-400",
                        },
                    }}
                />
            </div>
        </div>
    );
}
