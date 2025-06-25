import { Button } from "@/components/ui/button"

const categories = [
  "All",
  "Nature",
  "Architecture",
  "People",
  "Animals",
  "Food",
  "Travel",
  "Technology",
  "Art",
  "Sports",
]

export function CategoryFilter() {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((category) => (
        <Button
          key={category}
          variant={category === "All" ? "default" : "outline"}
          size="sm"
          className="whitespace-nowrap"
        >
          {category}
        </Button>
      ))}
    </div>
  )
}
