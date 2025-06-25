"use client"

import { Globe } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSearch } from "./search-provider"

const currencies = [
  { code: "UGX", name: "Ugandan Shilling", symbol: "UGX", flag: "🇺🇬" },
  { code: "USD", name: "US Dollar", symbol: "$", flag: "🇺🇸" },
]

export function CurrencySelector() {
  const { currency, setCurrency } = useSearch()

  return (
    <Select value={currency} onValueChange={(value: "UGX" | "USD") => setCurrency(value)}>
      <SelectTrigger className="w-auto border-0 bg-transparent">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          <SelectValue />
        </div>
      </SelectTrigger>
      <SelectContent>
        {currencies.map((curr) => (
          <SelectItem key={curr.code} value={curr.code}>
            <div className="flex items-center gap-2">
              <span>{curr.flag}</span>
              <span>{curr.code}</span>
              <span className="text-muted-foreground">({curr.symbol})</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
