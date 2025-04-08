"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface CategoryFilterProps {
  onCategoryChange: (category: string) => void
}

export function CategoryFilter({ onCategoryChange }: CategoryFilterProps) {
  const [category, setCategory] = useState("all")

  const handleCategoryChange = (value: string) => {
    setCategory(value)
    onCategoryChange(value)
  }

  return (
    <div className="flex flex-wrap gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            カテゴリー
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-chevron-down ml-2"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>カテゴリーを選択</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={category} onValueChange={handleCategoryChange}>
            <DropdownMenuRadioItem value="all">すべて</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="一般知識">一般知識</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="エンタメ">エンタメ</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="スポーツ">スポーツ</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="歴史">歴史</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="科学">科学</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="地理">地理</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

