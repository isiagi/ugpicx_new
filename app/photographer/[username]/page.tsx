import { Header } from "@/components/header"
import { PhotographerProfile } from "@/components/photographer-profile"

interface PhotographerPageProps {
  params: {
    username: string
  }
}

export default function PhotographerPage({ params }: PhotographerPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <PhotographerProfile username={params.username} />
    </div>
  )
}
