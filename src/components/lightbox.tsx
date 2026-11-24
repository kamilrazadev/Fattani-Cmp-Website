"use client"

import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel"
import { cn } from "@/lib/utils"
import { Img } from "@/components/img"

/** Full-screen image viewer: swipe, arrow keys, prev/next buttons and a thumbnail strip. */
export function Lightbox({ images, title, open, index, onOpenChange }: { images: string[]; title: string; open: boolean; index: number; onOpenChange: (v: boolean) => void }) {
  const [api, setApi] = useState<CarouselApi>()
  const [cur, setCur] = useState(index)

  useEffect(() => { if (open) { setCur(index); api?.scrollTo(index, true) } }, [open, index, api])
  useEffect(() => {
    if (!api) return
    const f = () => setCur(api.selectedScrollSnap())
    api.on("select", f)
    return () => { api.off("select", f) }
  }, [api])
  useEffect(() => {
    if (!open) return
    const k = (e: KeyboardEvent) => { if (e.key === "ArrowRight") api?.scrollNext(); if (e.key === "ArrowLeft") api?.scrollPrev() }
    window.addEventListener("keydown", k)
    return () => window.removeEventListener("keydown", k)
  }, [open, api])

  const nav = "absolute top-1/2 z-10 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white ring-1 ring-white/20 backdrop-blur transition hover:bg-white hover:text-ink disabled:opacity-30 max-md:hidden"
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="flex h-dvh max-h-none w-screen max-w-none flex-col gap-0 rounded-none border-0 bg-[#071219] p-0 text-white ring-0 sm:max-w-none">
        <div className="flex items-center justify-between px-4 py-3 md:px-6">
          <DialogTitle className="truncate font-heading text-base font-bold text-white md:text-lg">{title}</DialogTitle>
          <div className="flex items-center gap-3">
            <span className="num font-mono text-sm text-white/60">{cur + 1} / {images.length}</span>
            <button aria-label="Close" onClick={() => onOpenChange(false)} className="grid size-10 place-items-center rounded-full bg-white/10 hover:bg-white hover:text-ink"><X className="size-5" /></button>
          </div>
        </div>

        <div className="relative min-h-0 flex-1">
          <Carousel setApi={setApi} opts={{ loop: images.length > 1, startIndex: index }} className="h-full [&>div]:h-full">
            <CarouselContent className="ml-0 h-full">
              {images.map((src, k) => (
                <CarouselItem key={src} className="grid h-full place-items-center pl-0">
                  <div className="grid h-full w-full max-w-5xl place-items-center px-4 md:px-20">
                    <Img src={src} width={1200} height={900} sizes="(min-width:1024px) 900px, 100vw" quality={80} alt={`${title} — image ${k + 1}`} className="max-h-[66dvh] max-w-full rounded-2xl bg-white object-contain p-4 md:p-8" />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          {images.length > 1 && <>
            <button aria-label="Previous image" onClick={() => api?.scrollPrev()} className={cn(nav, "left-6")}><ChevronLeft className="size-6" /></button>
            <button aria-label="Next image" onClick={() => api?.scrollNext()} className={cn(nav, "right-6")}><ChevronRight className="size-6" /></button>
          </>}
        </div>

        <div className="pb-safe flex justify-center gap-2 overflow-x-auto px-4 py-4">
          {images.map((src, k) => (
            <button key={src} onClick={() => api?.scrollTo(k)} aria-label={`Show image ${k + 1}`}
              className={cn("grid size-16 shrink-0 place-items-center rounded-xl bg-white p-1.5 transition", k === cur ? "ring-2 ring-sky" : "opacity-50 hover:opacity-90")}>
              <Img src={src} alt="" className="max-h-full mix-blend-multiply" />
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
