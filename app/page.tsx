import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { CategoryFilter } from "@/components/category-filter";
import { PhotoGrid } from "@/components/photo-grid";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <CategoryFilter />
        </div>

        <PhotoGrid />
        {/* 
        <div className="text-center mt-12">
          <button className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
            Load More Photos
          </button>
        </div> */}
      </main>

      <footer className="border-t mt-20 py-12 px-4">
        <div className="container mx-auto text-center text-muted-foreground">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-2xl font-bold text-foreground">ugpicx</span>
          </div>
          <p className="mb-4">
            Beautiful free images and pictures for everyone.
          </p>
          <div className="flex justify-center gap-6 text-sm">
            <a href="/about" className="hover:text-primary transition-colors">
              About
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Blog
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              API
            </a>
            <a href="/privacy" className="hover:text-primary transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Terms
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
