import { SignIn } from "@clerk/nextjs";
import AuthLayout from "@/components/auth/AuthLayout";

export default function Page() {
    return (
        <AuthLayout
            heading="Welcome Back"
            headingSubtitle="Log in to your account to continue"
        >
            <SignIn
                appearance={{
                    elements: {
                        rootBox: "w-full mx-auto",
                        card: "bg-white/80 backdrop-blur-xl shadow-xl shadow-indigo-500/10 border border-white/60 rounded-2xl p-6 w-full",
                        headerTitle: "hidden",
                        headerSubtitle: "hidden",
                        socialButtonsBlockButton: "border border-gray-200 hover:bg-gray-50 text-gray-600 transition-all font-medium h-12 rounded-xl",
                        dividerRow: "my-5",
                        dividerText: "text-gray-400 text-[10px] font-bold uppercase tracking-widest",
                        formFieldLabel: "text-gray-700 font-semibold text-xs mb-1.5",
                        formFieldInput: "h-11 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500/20 rounded-xl transition-all text-sm",
                        formButtonPrimary: "bg-gradient-to-r from-indigo-600 via-violet-600 to-rose-500 hover:opacity-90 text-white font-bold h-12 rounded-xl shadow-lg shadow-indigo-500/20 transition-all text-sm normal-case",
                        footerActionText: "text-gray-500 font-medium text-xs",
                        footerActionLink: "text-indigo-600 hover:text-violet-600 font-bold text-xs",
                        formFieldAction: "text-indigo-600 hover:text-violet-600 font-bold text-xs",
                        identityPreviewText: "text-gray-600 font-medium text-sm",
                        identityPreviewEditButton: "text-indigo-600 hover:text-violet-600 font-bold text-xs",
                    },
                    variables: {
                        colorPrimary: "#6366f1",
                        fontFamily: "var(--font-sans)",
                        borderRadius: "0.75rem",
                    }
                }}
            />
        </AuthLayout>
    );
}
