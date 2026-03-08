"use client";

import { useState, useEffect } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import {
    Youtube,
    Instagram as InstagramIcon,
    Share2,
    CheckCircle2,
    Trash2,
    AlertTriangle,
    Loader2,
    LogOut,
    UserCircle,
    Mail
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getConnectedAccounts, disconnectAccount } from "@/actions/social";
import { deleteUserAccount } from "@/actions/user";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ConnectedAccount {
    platform: string;
    platform_account_name: string;
}

export default function SettingsPage() {
    const { user, isLoaded } = useUser();
    const { signOut, openUserProfile } = useClerk();
    const [connectedAccounts, setConnectedAccounts] = useState<ConnectedAccount[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (isLoaded) {
            fetchAccounts();
        }
    }, [isLoaded]);

    const fetchAccounts = async () => {
        setLoading(true);
        const res = await getConnectedAccounts();
        if (res.success && res.data) {
            setConnectedAccounts(res.data);
        }
        setLoading(false);
    };

    const handleConnect = async (platform: string) => {
        toast.info(`Please connect your ${platform} account in your profile settings.`);
        openUserProfile();
    };

    const handleDisconnect = async (platform: string) => {
        if (!confirm(`Are you sure you want to disconnect your ${platform} account?`)) return;

        setActionLoading(platform);
        const res = await disconnectAccount(platform);
        if (res.success) {
            toast.success(`${platform} account disconnected`);
            fetchAccounts();
        } else {
            toast.error(res.error || "Failed to disconnect");
        }
        setActionLoading(null);
    };

    const handleDeleteAccount = async () => {
        setActionLoading("delete");
        const res = await deleteUserAccount();
        if (res.success) {
            toast.success("Account deleted successfully");
            await signOut();
            router.push("/");
        } else {
            toast.error(res.error || "Failed to delete account");
            setActionLoading(null);
        }
    };

    const isConnected = (platform: string) => connectedAccounts.some(acc => acc.platform === platform);
    const getAccountName = (platform: string) => connectedAccounts.find(acc => acc.platform === platform)?.platform_account_name;

    const platforms = [
        {
            id: "youtube",
            name: "Youtube",
            icon: (
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.14 1 12 1 12s0 3.86.46 5.58a2.78 2.78 0 0 0 1.94 2c1.72.42 8.6.42 8.6.42s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2c.46-1.72.46-5.58.46-5.58s0-3.86-.46-5.58z" fill="#FF0000" />
                    <path d="M9.75 15.02L15.5 12l-5.75-3.02v6.04z" fill="white" />
                </svg>
            ),
            description: "Required to schedule and publish Shorts directly."
        },
        {
            id: "instagram",
            name: "Instagram",
            icon: (
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" fill="#E4405F" />
                </svg>
            ),
            description: "Connect to share your videos as Reels."
        },
        {
            id: "tiktok",
            name: "Tiktok",
            icon: (
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19.589 6.686a4.944 4.944 0 0 1-3.778-1.787c-.19-.115-.42-.23-.62-.315-.175-.075-.365-.13-.56-.16-.305-.05-.615-.075-.925-.075h-2.11c-.254 0-.482.106-.641.303-.16.196-.226.459-.181.714.107 1.064.407 2.091.892 3.023.51.982 1.203 1.845 2.057 2.565v2.855c0 3.108-2.521 5.629-5.629 5.629s-5.63-2.521-5.63-5.629 2.521-5.63 5.63-5.63c.272 0 .542.019.808.057V5.986c0-.57-.463-1.033-1.033-1.033H4.777c-.57 0-1.033.463-1.033 1.033V17.37c0 4.135 3.364 7.499 7.499 7.499 4.135 0 7.499-3.364 7.499-7.499v-6.742c1.32.915 2.88 1.446 4.563 1.446v-3.09c-.001-1.267-.935-2.296-2.219-2.298z" fill="#000000" className="dark:fill-white" />
                </svg>
            ),
            description: "Post your creations to TikTok automatically."
        },
    ];

    if (!isLoaded) return <div className="text-gray-900 dark:text-white">Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto py-10 px-4 space-y-12">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Settings</h1>
                <p className="text-gray-500 dark:text-white/40">Manage your connected accounts and preferences.</p>
            </div>

            {/* Profile Section */}
            <section className="space-y-6">
                <div className="flex items-center gap-2 border-b border-gray-200 dark:border-white/5 pb-4">
                    <div className="w-5 h-5 rounded-full border border-indigo-500 dark:border-[#7c3aed] flex items-center justify-center text-indigo-500 dark:text-[#7c3aed]">
                        <CheckCircle2 size={12} />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Profile Information</h2>
                </div>

                <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-12 transition-all hover:border-gray-300 dark:hover:border-white/20 shadow-sm dark:shadow-none">
                    {/* Avatar with PRO Badge */}
                    <div className="relative shrink-0">
                        <div className="w-24 h-24 rounded-2xl bg-indigo-50 dark:bg-[#002b1f] flex items-center justify-center border border-indigo-100 dark:border-white/10 shadow-lg dark:shadow-2xl overflow-hidden">
                            <span className="text-5xl font-medium text-indigo-600 dark:text-white/90">
                                {user?.fullName?.[0] || user?.primaryEmailAddress?.emailAddress?.[0] || "U"}
                            </span>
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-indigo-600 dark:bg-[#4f46e5] text-white text-[10px] font-black px-2.5 py-1 rounded-lg border-4 border-white dark:border-[#0d0d14] shadow-xl tracking-tight uppercase">
                            PRO
                        </div>
                    </div>

                    <div className="flex-1 grid gap-8 sm:grid-cols-2 w-full">
                        <div className="space-y-2.5">
                            <label className="text-[10px] font-black text-gray-400 dark:text-white/30 uppercase tracking-widest">Full Name</label>
                            <div className="bg-gray-50 dark:bg-white/[0.02] text-gray-500 dark:text-white/50 font-medium px-4 py-3.5 rounded-xl border border-gray-200 dark:border-white/5 cursor-not-allowed text-[15px] shadow-inner select-none">
                                {user?.fullName || "Loading..."}
                            </div>
                        </div>
                        <div className="space-y-2.5">
                            <label className="text-[10px] font-black text-gray-400 dark:text-white/30 uppercase tracking-widest">Email Address</label>
                            <div className="bg-gray-50 dark:bg-white/[0.02] text-gray-500 dark:text-white/50 font-medium px-4 py-3.5 rounded-xl border border-gray-200 dark:border-white/5 cursor-not-allowed text-[15px] shadow-inner select-none overflow-hidden text-ellipsis">
                                {user?.primaryEmailAddress?.emailAddress || "Loading..."}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Social Accounts Section */}
            <section className="space-y-6">
                <div className="flex items-center gap-2 border-b border-gray-200 dark:border-white/5 pb-4">
                    <Share2 className="text-indigo-500 dark:text-indigo-400 transform rotate-45" size={20} />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Social Media Connections</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {platforms.map((platform) => (
                        <div key={platform.id} className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-[32px] p-8 flex flex-col items-center transition-all hover:border-gray-300 dark:hover:border-white/20 shadow-md dark:shadow-xl group">
                            {/* Platform Icon Box */}
                            <div className={`w-28 h-28 rounded-[2rem] flex items-center justify-center mb-6 border border-gray-100 dark:border-white/5 transition-transform group-hover:scale-105 ${platform.id === 'youtube' ? 'bg-rose-50 dark:bg-rose-500/10' :
                                platform.id === 'instagram' ? 'bg-pink-50 dark:bg-pink-500/10' : 'bg-gray-50 dark:bg-white/10'
                                }`}>
                                <div className="transform scale-125">
                                    {platform.icon}
                                </div>
                            </div>

                            {/* Platform Name */}
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 uppercase tracking-tight">{platform.name.split(' ')[0]}</h3>

                            {isConnected(platform.id) ? (
                                <>
                                    <p className="text-[10px] font-black text-emerald-500 dark:text-emerald-400 uppercase tracking-[0.2em] mb-8">CONNECTED</p>

                                    <div className="w-full space-y-4">
                                        {/* Account Name Pill */}
                                        <div className="w-full bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 py-4 px-4 rounded-2xl text-gray-600 dark:text-white/70 text-sm font-medium text-center truncate shadow-inner">
                                            {getAccountName(platform.id)}
                                        </div>

                                        {/* Disconnect Button */}
                                        <Button
                                            variant="ghost"
                                            className="w-full bg-transparent border border-rose-200 dark:border-rose-500/20 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-600 rounded-2xl h-14 gap-2 font-bold transition-all text-base"
                                            onClick={() => handleDisconnect(platform.id)}
                                            disabled={actionLoading === platform.id}
                                        >
                                            {actionLoading === platform.id ? (
                                                <Loader2 className="animate-spin" size={20} />
                                            ) : (
                                                <LogOut size={20} className="transform rotate-180" />
                                            )}
                                            Disconnect
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <p className="text-[10px] font-black text-gray-400 dark:text-white/20 uppercase tracking-[0.2em] mb-12">DISCONNECTED</p>
                                    <Button
                                        className="w-full bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-slate-100 font-black h-14 rounded-2xl text-base transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
                                        onClick={() => handleConnect(platform.id)}
                                        disabled={actionLoading === platform.id}
                                    >
                                        {actionLoading === platform.id ? (
                                            <Loader2 className="animate-spin" size={20} />
                                        ) : (
                                            <>
                                                <Share2 size={20} className="transform rotate-45" />
                                                Connect Account
                                            </>
                                        )}
                                    </Button>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* Danger Zone Section */}
            <section className="space-y-6 pt-10 border-t border-gray-200 dark:border-white/5">
                <div className="flex items-center gap-2 pb-4">
                    <AlertTriangle className="text-rose-500" size={20} />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Danger Zone</h2>
                </div>

                <div className="bg-rose-50 dark:bg-rose-500/5 border border-rose-200 dark:border-rose-500/20 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="text-center md:text-left">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Delete Account</h3>
                        <p className="text-gray-500 dark:text-white/40 text-sm max-w-md">
                            Permanently delete your account, all your series, and generated videos. This action is irreversible.
                        </p>
                    </div>

                    {!showDeleteConfirm ? (
                        <Button
                            variant="destructive"
                            className="bg-rose-600 hover:bg-rose-700 text-white font-bold h-12 px-8 rounded-xl shadow-lg shadow-rose-900/10 dark:shadow-rose-900/20"
                            onClick={() => setShowDeleteConfirm(true)}
                        >
                            <Trash2 size={18} className="mr-2" />
                            Delete Account
                        </Button>
                    ) : (
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Button
                                variant="ghost"
                                className="text-gray-500 dark:text-white/40 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10"
                                onClick={() => setShowDeleteConfirm(false)}
                                disabled={actionLoading === "delete"}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                className="bg-rose-600 hover:bg-rose-700 text-white font-bold h-12 px-8 rounded-xl"
                                onClick={handleDeleteAccount}
                                disabled={actionLoading === "delete"}
                            >
                                {actionLoading === "delete" ? (
                                    <Loader2 className="animate-spin mr-2" size={18} />
                                ) : (
                                    <Trash2 size={18} className="mr-2" />
                                )}
                                Confirm Delete
                            </Button>
                        </div>
                    )}
                </div>
            </section>

            {/* Loading Overlay */}
            {loading && (
                <div className="fixed inset-0 bg-white/50 dark:bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="flex flex-col items-center gap-3">
                        <Loader2 className="animate-spin text-indigo-500" size={40} />
                        <p className="text-gray-600 dark:text-white/60 font-medium">Loading settings...</p>
                    </div>
                </div>
            )}
        </div>
    );
}
