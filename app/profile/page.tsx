import { Header } from "@/components/header"
import { UserProfile } from "@/components/user-profile"

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <UserProfile />
    </div>
  )
}
