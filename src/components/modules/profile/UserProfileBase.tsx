"use client";

import {
  IconCalendar,
  IconCheck,
  IconId,
  IconMail,
  IconShieldCheck,
} from "@tabler/icons-react";
import UserProfileEditModal from "@/components/modals/UserProfileEditModal";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { TaskOrbitRole, UserProfile } from "@/types";
import formatDate from "@/utils/formatDate";
import Detail from "./ProfileItemDetail";

const roleNames: Record<TaskOrbitRole, string> = {
  ADMIN: "Administrator",
  PROJECT_MANAGER: "Project Manager",
  TEAM_MEMBER: "Team Member",
};

export default function UserProfileBase({ profile }: { profile: UserProfile }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal details</CardTitle>
        <CardDescription>
          Your account and membership information
        </CardDescription>
        <CardAction>
          <UserProfileEditModal profile={profile} />
        </CardAction>
      </CardHeader>
      <Separator />
      <CardContent className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
        <Detail icon={IconId} label="Name" value={profile.name} />
        <Detail icon={IconMail} label="Email" value={profile.email} />
        <Detail
          icon={IconShieldCheck}
          label="Role"
          value={roleNames[profile.role]}
        />
        <Detail
          icon={IconCheck}
          label="Email verification"
          value={profile.is_verified ? "Verified" : "Not verified"}
        />
        <Detail
          icon={IconShieldCheck}
          label="Account status"
          value={profile.user_status === "ACTIVE" ? "Active" : "Restricted"}
        />
        <Detail
          icon={IconCalendar}
          label="Member since"
          value={formatDate(profile.created_at)}
        />
        <Detail
          icon={IconCalendar}
          label="Last updated"
          value={formatDate(profile.updated_at)}
        />
      </CardContent>
    </Card>
  );
}
