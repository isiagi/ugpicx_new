import { Button } from "@/components/ui/button";
import { SearchBar } from "./search-bar";

export function HeroSection() {
  return (
    <section className="relative py-20 px-4 text-center bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Stunning Uganda Images
        </h1>
        {/* <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Discover over 3 million+ high quality stock images, photos and vectors showcasing the beauty of Uganda and
          beyond, shared by our talented local and international community.
        </p> */}

        <div className="relative max-w-2xl mx-auto mb-8">
          <SearchBar className="h-14 text-lg" />
        </div>

        {/* <div className="flex flex-wrap justify-center gap-2 text-sm text-muted-foreground mb-6">
          <span>Trending:</span>
          {[
            "uganda wildlife",
            "kampala city",
            "lake victoria",
            "mountain rwenzori",
            "cultural heritage",
            "landscapes",
          ].map((tag) => (
            <Button
              key={tag}
              variant="link"
              className="h-auto p-0 text-sm text-primary hover:underline"
            >
              {tag}
            </Button>
          ))}
        </div> */}

        <div className="hidden sm:flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🇺🇬</span>
            <span>Proudly Ugandan</span>
          </div>
          <div className="hidden sm:block">•</div>
          <div>Supporting local photographers</div>
          <div className="hidden sm:block">•</div>
          <div>Prices in UGX & USD</div>
        </div>
      </div>
    </section>
  );
}
