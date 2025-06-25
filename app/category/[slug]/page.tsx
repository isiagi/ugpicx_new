import { Header } from "@/components/header";
import { CategoryHeader } from "@/components/category-header";
import { PhotoGrid } from "@/components/photo-grid";

const categoryData = {
  nature: {
    name: "Nature",
    description:
      "Discover breathtaking landscapes, wildlife, and natural wonders captured by talented photographers around the world.",
    photoCount: 15420,
  },
  architecture: {
    name: "Architecture",
    description:
      "Explore stunning buildings, modern structures, and architectural marvels from cities across the globe.",
    photoCount: 8930,
  },
  people: {
    name: "People",
    description:
      "Beautiful portraits, candid moments, and human stories told through the lens of our community.",
    photoCount: 12650,
  },
  animals: {
    name: "Animals",
    description:
      "Amazing wildlife photography featuring creatures big and small in their natural habitats.",
    photoCount: 6780,
  },
  food: {
    name: "Food",
    description:
      "Delicious food photography, culinary art, and gastronomic inspiration for food lovers.",
    photoCount: 4320,
  },
  travel: {
    name: "Travel",
    description:
      "Wanderlust-inspiring destinations, cultural experiences, and adventures from around the world.",
    photoCount: 11200,
  },
  technology: {
    name: "Technology",
    description:
      "Modern tech, gadgets, digital concepts, and the intersection of technology with daily life.",
    photoCount: 3450,
  },
  art: {
    name: "Art",
    description:
      "Creative expressions, artistic photography, and visual art that inspires and captivates.",
    photoCount: 5670,
  },
  sports: {
    name: "Sports",
    description:
      "Dynamic sports photography capturing the energy, passion, and athleticism of various sports.",
    photoCount: 2890,
  },
};

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const category = categoryData[params.slug as keyof typeof categoryData];

  console.log(category.name, "pars");

  if (!category) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl font-bold mb-4">Category Not Found</h1>
          <p className="text-muted-foreground">
            The category you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CategoryHeader
        category={category.name}
        description={category.description}
        photoCount={category.photoCount}
      />

      <main className="container mx-auto px-4 py-8">
        <PhotoGrid category={category.name} />

        <div className="text-center mt-12">
          <button className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
            Load More {category.name} Photos
          </button>
        </div>
      </main>
    </div>
  );
}
