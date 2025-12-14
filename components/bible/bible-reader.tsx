"use client"

import { useState, useMemo } from "react"
import useSWR from "swr"
import { bibleBooks, type BibleBookLocal } from "@/lib/bible-data"
import { getChapter, type ChapterResponse } from "@/lib/bible-api"

const highlightColors = [
  { name: "Amarillo", class: "bg-yellow-500/30" },
  { name: "Verde", class: "bg-green-500/30" },
  { name: "Azul", class: "bg-blue-500/30" },
  { name: "Rosa", class: "bg-pink-500/30" },
  { name: "Naranja", class: "bg-orange-500/30" },
]

// Fetcher para SWR
const fetcher = async ([bookId, chapter]: [string, number]): Promise<ChapterResponse> => {
  return getChapter(bookId, chapter)
}

export function BibleReader() {
  const [selectedBook, setSelectedBook] = useState<BibleBookLocal>(bibleBooks.nuevoTestamento[3]) // Juan por defecto
  const [selectedChapter, setSelectedChapter] = useState(1)
  const [selectedVerses, setSelectedVerses] = useState<number[]>([])
  const [highlights, setHighlights] = useState<Record<string, Record<number, string>>>({})
  const [showBookSelector, setShowBookSelector] = useState(false)
  const [showChapterSelector, setShowChapterSelector] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredBooks = useMemo(() => {
    if (!searchQuery) {
      return {
        at: bibleBooks.antiguoTestamento,
        nt: bibleBooks.nuevoTestamento,
      }
    }

    const query = searchQuery.toLowerCase()
    return {
      at: bibleBooks.antiguoTestamento.filter(
        (book) => book.nombre.toLowerCase().includes(query) || book.abreviatura.toLowerCase().includes(query),
      ),
      nt: bibleBooks.nuevoTestamento.filter(
        (book) => book.nombre.toLowerCase().includes(query) || book.abreviatura.toLowerCase().includes(query),
      ),
    }
  }, [searchQuery])

  const {
    data: chapterData,
    error,
    isLoading,
  } = useSWR<ChapterResponse>([selectedBook.id, selectedChapter], fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  })
}
