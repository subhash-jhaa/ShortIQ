import { currentUser } from "@clerk/nextjs/server";
import { getUserProfile } from "@/actions/user";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { RecentProjects } from "@/components/dashboard/RecentProjects";
import { QuickActions } from "@/components/dashboard/QuickActions";

export default async function DashboardPage() {
    const user = await currentUser();
    const profile = await getUserProfile();

    return (
        <div className="space-y-10">
            <DashboardHeader firstName={user?.firstName} />

            {/* Stats Grid */}
            <StatsGrid credits={profile?.credits} />

            {/* Content Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Active Projects */}
                <RecentProjects />

                {/* Right Column / Quick Actions */}
                <QuickActions />
            </div>
        </div>
    );
}
