import { Header } from "@/components/header"
import { SubmitPhotoForm } from "@/components/submit-photo-form"

export default function SubmitPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <SubmitPhotoForm />

      {/* Footer */}
      <footer className="border-t mt-20 py-12 px-4">
        <div className="container mx-auto text-center text-muted-foreground">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-2xl font-bold text-foreground">ugpicx</span>
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">🇺🇬</span>
          </div>
          <p className="mb-4">Beautiful free images and pictures from Uganda.</p>
          <div className="flex justify-center gap-6 text-sm">
            <a href="#" className="hover:text-primary transition-colors">
              About
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Guidelines
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              API
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Terms
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
