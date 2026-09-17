"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { CalendarDays, Newspaper, UserRound, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { FadeIn, SectionHeading } from "@/components/pusaka/fade-in";
import { NEWS_CATEGORY_META, formatDate, getNews, type NewsArticleT } from "@/lib/pusaka";

const SLUG_IMAGES: Record<string, string> = {
  "luncurkan-sertifikasi-digital-qr-verified": "/images/news-qr.png",
  "kerja-sama-strategis-pusaka-iata": "/images/news-iata.png",
  "sop-baru-penanganan-kesehatan-jemaah": "/images/news-health.png",
  "musyawarah-nasional-dewan-pakar-2025": "/images/munas.png",
};

function NewsImage({ article, large }: { article: NewsArticleT; large?: boolean }) {
  const src = SLUG_IMAGES[article.slug];
  if (src) {
    return (
      <Image
        src={src}
        alt={article.title}
        fill
        sizes={large ? "(max-width: 1024px) 100vw, 60vw" : "(max-width: 640px) 100vw, 240px"}
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
    );
  }
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-800 via-emerald-700 to-emerald-900">
      <Newspaper className="h-10 w-10 text-emerald-300/60" aria-hidden />
    </div>
  );
}

export function News() {
  const [articles, setArticles] = useState<NewsArticleT[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<NewsArticleT | null>(null);

  useEffect(() => {
    let alive = true;
    getNews()
      .then((data) => {
        if (alive) setArticles(data);
      })
      .catch((e) => {
        if (alive) setError(e instanceof Error ? e.message : "Gagal memuat berita.");
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  const { featured, rest } = useMemo(() => {
    if (articles.length === 0) return { featured: null, rest: [] as NewsArticleT[] };
    const f = articles.find((a) => a.featured) ?? articles[0];
    return { featured: f, rest: articles.filter((a) => a.id !== f.id) };
  }, [articles]);

  return (
    <section id="berita" className="scroll-mt-20 bg-card py-16 sm:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Ruang Berita"
          title="Kabar & Pengumuman Resmi"
          subtitle="Rilis regulasi, kegiatan Dewan Pakar, dan kemitraan strategis terbaru dari lingkungan PUSAKA."
        />

        {loading ? (
          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Skeleton className="h-80 rounded-2xl" />
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-xl" />
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="mt-10 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-14 text-center">
            <X className="h-8 w-8 text-muted-foreground/50" aria-hidden />
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        ) : !featured ? (
          <p className="mt-10 text-center text-sm text-muted-foreground">Belum ada berita diterbitkan.</p>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* featured */}
            <FadeIn>
              <button
                type="button"
                onClick={() => setSelected(featured)}
                className="group block w-full text-left"
              >
                <Card className="h-full overflow-hidden border-border p-0 transition-all hover:-translate-y-1 hover:shadow-xl">
                  <div className="relative h-64 w-full overflow-hidden sm:h-72">
                    <NewsImage article={featured} large />
                    <Badge
                      className={`absolute left-4 top-4 border-transparent ${
                        NEWS_CATEGORY_META[featured.category] ?? "bg-muted text-muted-foreground"
                      }`}
                    >
                      {featured.category}
                    </Badge>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-display text-xl font-bold leading-snug text-foreground transition-colors group-hover:text-emerald-800 dark:group-hover:text-emerald-300">
                      {featured.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                      {featured.excerpt}
                    </p>
                    <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <CalendarDays className="h-3.5 w-3.5" aria-hidden />
                        {formatDate(featured.publishedAt)}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <UserRound className="h-3.5 w-3.5" aria-hidden />
                        {featured.author}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </button>
            </FadeIn>

            {/* list kecil */}
            <div className="flex flex-col gap-4">
              {rest.map((a, idx) => (
                <FadeIn key={a.id} delay={idx * 0.06}>
                  <button type="button" onClick={() => setSelected(a)} className="group block w-full text-left">
                    <Card className="overflow-hidden border-border p-0 transition-all hover:-translate-y-0.5 hover:shadow-lg">
                      <CardContent className="flex gap-4 p-4">
                        <div className="relative h-24 w-28 shrink-0 overflow-hidden rounded-lg sm:w-36">
                          <NewsImage article={a} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <Badge
                            className={`border-transparent text-[10px] ${
                              NEWS_CATEGORY_META[a.category] ?? "bg-muted text-muted-foreground"
                            }`}
                          >
                            {a.category}
                          </Badge>
                          <h4 className="font-display mt-1.5 line-clamp-2 text-sm font-bold leading-snug text-foreground transition-colors group-hover:text-emerald-800 dark:group-hover:text-emerald-300">
                            {a.title}
                          </h4>
                          <p className="mt-1.5 line-clamp-1 text-xs text-muted-foreground">{a.excerpt}</p>
                          <p className="mt-1.5 text-[11px] text-muted-foreground">
                            {formatDate(a.publishedAt)}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </button>
                </FadeIn>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* dialog konten */}
      <Dialog open={!!selected} onOpenChange={(open) => (open ? undefined : setSelected(null))}>
        <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
          {selected ? (
            <>
              <DialogHeader>
                <Badge
                  className={`w-fit border-transparent ${
                    NEWS_CATEGORY_META[selected.category] ?? "bg-muted text-muted-foreground"
                  }`}
                >
                  {selected.category}
                </Badge>
                <DialogTitle className="font-display pt-2 text-left text-xl font-bold leading-snug">
                  {selected.title}
                </DialogTitle>
                <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5" aria-hidden />
                    {formatDate(selected.publishedAt)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <UserRound className="h-3.5 w-3.5" aria-hidden />
                    {selected.author}
                  </span>
                </div>
              </DialogHeader>
              <div className="relative mb-4 h-48 w-full overflow-hidden rounded-xl sm:h-60">
                <NewsImage article={selected} large />
              </div>
              <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                {selected.content}
              </p>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </section>
  );
}
