interface CategoryHeaderProps {
  category: string
  description: string
  photoCount: number
}

export function CategoryHeader({ category, description, photoCount }: CategoryHeaderProps) {
  return (
    <div className="py-12 px-4 text-center bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 capitalize">{category} Photography</h1>
        <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">{description}</p>
        <div className="text-sm text-muted-foreground">
          {photoCount.toLocaleString()} free and premium {category} photos
        </div>
      </div>
    </div>
  )
}
