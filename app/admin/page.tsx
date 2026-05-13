import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import {
  User, FolderKanban, Code2, Briefcase, GraduationCap, Share2, ArrowRight,
  Eye, Users, MousePointerClick, Clock, Globe, Monitor, Smartphone,
  BarChart2, RefreshCw, Award, FileText
} from "lucide-react"
import {
  getStats, getPageviews, getTopPages, getTopReferrers,
  getTopCountries, getTopBrowsers, getTopDevices
} from "@/lib/umami"
import { StatCard } from "@/components/admin/analytics/stat-card"
import { MetricList } from "@/components/admin/analytics/metric-list"
import { PageviewsChart } from "@/components/admin/analytics/pageviews-chart"

export const revalidate = 300 // refresh every 5 minutes

async function getPortfolioStats() {
  const supabase = await createClient()
  const [projects, skills, experiences, educations, socials, certifications, blogs, recentWorks] = await Promise.all([
    supabase.from("projects").select("id", { count: "exact" }),
    supabase.from("skills").select("id", { count: "exact" }),
    supabase.from("experiences").select("id", { count: "exact" }),
    supabase.from("educations").select("id", { count: "exact" }),
    supabase.from("socials").select("id", { count: "exact" }),
    supabase.from("certifications").select("id", { count: "exact" }),
    supabase.from("blogs").select("id", { count: "exact" }),
    supabase.from("recent_works").select("id", { count: "exact" }),
  ])
  return {
    projects: projects.count || 0,
    skills: skills.count || 0,
    experiences: experiences.count || 0,
    educations: educations.count || 0,
    socials: socials.count || 0,
    certifications: certifications.count || 0,
    blogs: blogs.count || 0,
    recentWorks: recentWorks.count || 0,
  }
}

export default async function AdminDashboard() {
  const [portfolioStats, umamiStats, pageviewsData, topPages, topReferrers, topCountries, topBrowsers, topDevices] =
    await Promise.all([
      getPortfolioStats(),
      getStats(),
      getPageviews(),
      getTopPages(),
      getTopReferrers(),
      getTopCountries(),
      getTopBrowsers(),
      getTopDevices(),
    ])

  const bounceRate = umamiStats
    ? ((umamiStats.bounces / (umamiStats.visits || 1)) * 100)
    : null

  const avgSessionTime = umamiStats
    ? Math.round(umamiStats.totaltime / (umamiStats.visits || 1))
    : null

  const cmsCards = [
    { label: "Projects", count: portfolioStats.projects, icon: FolderKanban, href: "/admin/projects", color: "text-blue-500" },
    { label: "Recent Works", count: portfolioStats.recentWorks, icon: Briefcase, href: "/admin/recent-works", color: "text-indigo-500" },
    { label: "Skills", count: portfolioStats.skills, icon: Code2, href: "/admin/skills", color: "text-green-500" },
    { label: "Experience", count: portfolioStats.experiences, icon: Briefcase, href: "/admin/experience", color: "text-purple-500" },
    { label: "Education", count: portfolioStats.educations, icon: GraduationCap, href: "/admin/education", color: "text-orange-500" },
    { label: "Certifications", count: portfolioStats.certifications, icon: Award, href: "/admin/certifications", color: "text-yellow-500" },
    { label: "Blog Posts", count: portfolioStats.blogs, icon: FileText, href: "/admin/blog", color: "text-rose-500" },
    { label: "Social Links", count: portfolioStats.socials, icon: Share2, href: "/admin/socials", color: "text-pink-500" },
  ]

  const hasAnalytics = !!umamiStats
  const analyticsConfigured = !!(process.env.UMAMI_API_KEY && process.env.UMAMI_WEBSITE_ID)

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Portfolio analytics & content overview</p>
        </div>
        <Link href="/" target="_blank"
          className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <Globe className="w-4 h-4" /> View Site
        </Link>
      </div>

      {/* Quick profile link */}
      <Link href="/admin/profile"
        className="flex items-center justify-between rounded-xl border border-primary/20 bg-gradient-to-r from-primary/10 to-primary/5 p-5 hover:border-primary/40 transition-colors group">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/20 rounded-lg">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">Profile & About</h2>
            <p className="text-sm text-muted-foreground">Edit your personal information, hero section, and CV</p>
          </div>
        </div>
        <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
      </Link>

      {/* ── Analytics Section ─────────────────────────────────────────── */}
      <section>
        <div className="mb-4 flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Analytics — Last 30 Days</h2>
          {!hasAnalytics && (
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
              {analyticsConfigured ? 'API error — check server logs' : 'Add UMAMI_API_KEY to .env to enable'}
            </span>
          )}
        </div>

        {hasAnalytics ? (
          <>
            {/* KPI cards */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 mb-6">
              <StatCard
                label="Pageviews"
                value={umamiStats!.pageviews}
                icon={<Eye className="w-4 h-4" />}
                previous={umamiStats!.comparison?.pageviews}
                color="text-primary"
              />
              <StatCard
                label="Unique Visitors"
                value={umamiStats!.visitors}
                icon={<Users className="w-4 h-4" />}
                previous={umamiStats!.comparison?.visitors}
                color="text-blue-500"
              />
              <StatCard
                label="Sessions"
                value={umamiStats!.visits}
                icon={<MousePointerClick className="w-4 h-4" />}
                previous={umamiStats!.comparison?.visits}
                color="text-indigo-500"
              />
              <StatCard
                label="Bounce Rate"
                value={bounceRate ?? 0}
                icon={<RefreshCw className="w-4 h-4" />}
                format="percent"
                color="text-orange-500"
              />
              <StatCard
                label="Avg. Session"
                value={avgSessionTime ?? 0}
                icon={<Clock className="w-4 h-4" />}
                format="time"
                color="text-emerald-500"
              />
            </div>

            {/* Pageviews chart */}
            {pageviewsData && (
              <div className="mb-6">
                <PageviewsChart
                  pageviews={pageviewsData.pageviews}
                  sessions={pageviewsData.sessions}
                />
              </div>
            )}

            {/* Breakdown grids */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <MetricList title="Top Pages" data={topPages} />
              <MetricList title="Top Referrers" data={topReferrers} emptyText="No referrer data" />
              <MetricList title="Countries" data={topCountries} />
              <MetricList title="Browsers" data={topBrowsers} />
              <MetricList title="Devices" data={topDevices} />
            </div>
          </>
        ) : (
          <div className="rounded-xl border border-dashed border-border bg-muted/30 p-8 text-center">
            <BarChart2 className="mx-auto mb-3 h-10 w-10 text-muted-foreground/40" />
            {analyticsConfigured ? (
              <>
                <p className="text-sm font-medium text-foreground">Analytics API returned no data</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Check your server logs for the Umami API error. The key and website ID are set but the request failed.
                </p>
              </>
            ) : (
              <>
                <p className="text-sm font-medium text-foreground">Analytics not configured</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Add <code className="rounded bg-muted px-1 py-0.5">UMAMI_API_KEY</code>,{' '}
                  <code className="rounded bg-muted px-1 py-0.5">UMAMI_WEBSITE_ID</code>, and{' '}
                  <code className="rounded bg-muted px-1 py-0.5">UMAMI_API_URL</code> to your .env file.
                </p>
              </>
            )}
          </div>
        )}
      </section>

      {/* ── CMS Content Section ───────────────────────────────────────── */}
      <section>
        <div className="mb-4 flex items-center gap-2">
          <FolderKanban className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Content</h2>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {cmsCards.map((card) => (
            <Link key={card.href} href={card.href}
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 hover:border-primary/50 transition-colors group">
              <card.icon className={`w-5 h-5 shrink-0 ${card.color}`} />
              <div className="min-w-0">
                <p className="text-xl font-bold text-foreground leading-none">{card.count}</p>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">{card.label}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
