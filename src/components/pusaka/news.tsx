"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { ArrowRight, CalendarDays, Newspaper, UserRound, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { FadeIn, SectionHeading } from "@/components/pusaka/fade-in";
import { NEWS_CATEGORY_META, getNews, type NewsArticleT } from "@/lib/pusaka";
import { useI18n } from "@/lib/i18n/provider";

const SLUG_IMAGES: Record<string, string> = {
  "luncurkan-sertifikasi-digital-qr-verified": "/images/news-qr.png",
  "kerja-sama-strategis-pusaka-iata": "/images/news-iata.png",
  "sop-baru-penanganan-kesehatan-jemaah": "/images/news-health.png",
  "musyawarah-nasional-dewan-pakar-2025": "/images/munas.png",
};

/** Kategori berita yang dikenal (dari DB) — label UI-nya diterjemahkan via kamus. */
const NEWS_CATEGORIES = ["PENGUMUMAN", "REGULASI", "KEGIATAN", "KEMITRAAN"] as const;

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
  const { t, formatDate, timeAgo } = useI18n();
  const [articles, setArticles] = useState<NewsArticleT[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selected, setSelected] = useState<NewsArticleT | null>(null);
  const [category, setCategory] = useState<string>("ALL");

  useEffect(() => {
    let alive = true;
    getNews()
      .then((data) => {
        if (alive) setArticles(data);
      })
      .catch(() => {
        if (alive) setError(true);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  const filtered = useMemo(
    () =>
      category === "ALL"
        ? articles
        : articles.filter((a) => a.category === category),
    [articles, category]
  );

  const { featured, rest } = useMemo(() => {
    if (filtered.length === 0) return { featured: null, rest: [] as NewsArticleT[] };
    const f = filtered.find((a) => a.featured) ?? filtered[0];
    return { featured: f, rest: filtered.filter((a) => a.id !== f.id) };
  }, [filtered]);

  /** Label kategori terlokalisasi; kategori tak dikenal dari DB ditampilkan apa adanya. */
  const categoryLabel = (c: string) =>
    (NEWS_CATEGORIES as readonly string[]).includes(c) ? t(`news.categories.${c}`) : c;

  return (
    <section id="berita" className="scroll-mt-20 bg-card py-16 sm:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t("news.eyebrow")}
          title={t("news.title")}
          subtitle={t("news.subtitle")}
        />

        {/* filter kategori */}
        {!loading && !error && articles.length > 0 ? (
          <FadeIn className="mt-8" delay={0.05}>
            <div
              className="flex flex-wrap items-center justify-center gap-2"
              role="group"
              aria-label={t("news.filter.aria")}
            >
              <button
                type="button"
                onClick={() => setCategory("ALL")}
                aria-pressed={category === "ALL"}
                className={`h-10 rounded-full px-4 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  category === "ALL"
                    ? "bg-emerald-700 text-white hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-700"
                    : "border border-border bg-background text-muted-foreground hover:border-emerald-500/40 hover:text-emerald-800 dark:hover:text-emerald-300"
                }`}
              >
                {t("news.filter.all")}
              </button>
              {NEWS_CATEGORIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  aria-pressed={category === c}
                  className={`h-10 rounded-full px-4 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                    category === c
                      ? "bg-emerald-700 text-white hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-700"
                      : "border border-border bg-background text-muted-foreground hover:border-emerald-500/40 hover:text-emerald-800 dark:hover:text-emerald-300"
                  }`}
                >
                  {categoryLabel(c)}
                </button>
              ))}
            </div>
          </FadeIn>
        ) : null}

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
            <p className="text-sm text-muted-foreground">{t("news.error.load")}</p>
          </div>
        ) : !featured ? (
          <p className="mt-10 text-center text-sm text-muted-foreground">{t("news.empty")}</p>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* featured */}
            <FadeIn>
              <button
                type="button"
                onClick={() => setSelected(featured)}
                className="group block w-full text-start"
              >
                <Card className="h-full overflow-hidden border-border p-0 transition-all hover:-translate-y-1 hover:shadow-xl">
                  <div className="relative h-64 w-full overflow-hidden sm:h-72">
                    <NewsImage article={featured} large />
                    <Badge
                      className={`absolute start-4 top-4 border-transparent ${
                        NEWS_CATEGORY_META[featured.category] ?? "bg-muted text-muted-foreground"
                      }`}
                    >
                      {categoryLabel(featured.category)}
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
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 transition-colors group-hover:text-emerald-800 dark:text-emerald-300 dark:group-hover:text-emerald-200">
                      {t("news.readMore")}
                      <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden />
                    </span>
                  </CardContent>
                </Card>
              </button>
            </FadeIn>

            {/* list kecil */}
            <div className="flex flex-col gap-4">
              {rest.map((a, idx) => (
                <FadeIn key={a.id} delay={idx * 0.06}>
                  <button type="button" onClick={() => setSelected(a)} className="group block w-full text-start">
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
                            {categoryLabel(a.category)}
                          </Badge>
                          <h4 className="font-display mt-1.5 line-clamp-2 text-sm font-bold leading-snug text-foreground transition-colors group-hover:text-emerald-800 dark:group-hover:text-emerald-300">
                            {a.title}
                          </h4>
                          <p className="mt-1.5 line-clamp-1 text-xs text-muted-foreground">{a.excerpt}</p>
                          <p className="mt-1.5 text-[11px] text-muted-foreground">
                            {timeAgo(a.publishedAt)}
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
                  {categoryLabel(selected.category)}
                </Badge>
                <DialogTitle className="font-display pt-2 text-start text-xl font-bold leading-snug">
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
