import { Root } from "hast"
import { toHtml } from "hast-util-to-html"
import { getDate } from "../../components/Date"
import { escapeHTML } from "../../util/escape"
import { FilePath, FullSlug, SimpleSlug, joinSegments, simplifySlug } from "../../util/path"
import { QuartzEmitterPlugin } from "../types"
import { write } from "./helpers"
import { isDiscoverablePage } from "../../util/visibility"

type ContentDetails = {
  slug: FullSlug
  filePath: FilePath
  title: string
  content: string
  richContent?: string
  date?: Date
  description?: string
}

type ContentIndexMap = Map<FullSlug, ContentDetails>

interface Options {
  includePrefix: string
  feedTitle: string
  feedDescription: string
  feedLink: string
  language?: string
  rssSlug: string
  rssLimit?: number
  rssFullHtml: boolean
  includeEmptyFiles: boolean
}

const defaultOptions = {
  rssLimit: 10,
  rssFullHtml: false,
  includeEmptyFiles: true,
} satisfies Pick<Options, "rssLimit" | "rssFullHtml" | "includeEmptyFiles">

function normalizePrefix(prefix: string): string {
  return prefix.replace(/^\/+|\/+$/g, "")
}

function shouldInclude(slug: FullSlug, prefix: string): boolean {
  const normalizedPrefix = normalizePrefix(prefix)
  return slug.startsWith(`${normalizedPrefix}/`) && !slug.endsWith("/index")
}

function generateRSSFeed(idx: ContentIndexMap, opts: Options, baseUrl: string): string {
  const createURLEntry = (slug: SimpleSlug, content: ContentDetails): string => `<item>
    <title>${escapeHTML(content.title)}</title>
    <link>https://${joinSegments(baseUrl, encodeURI(slug))}</link>
    <guid>https://${joinSegments(baseUrl, encodeURI(slug))}</guid>
    <description><![CDATA[ ${content.richContent ?? content.description} ]]></description>
    <pubDate>${content.date?.toUTCString()}</pubDate>
  </item>`

  const items = Array.from(idx)
    .sort(([_, f1], [__, f2]) => {
      if (f1.date && f2.date) {
        return f2.date.getTime() - f1.date.getTime()
      } else if (f1.date && !f2.date) {
        return -1
      } else if (!f1.date && f2.date) {
        return 1
      }

      return f1.title.localeCompare(f2.title)
    })
    .map(([slug, content]) => createURLEntry(simplifySlug(slug), content))
    .slice(0, opts.rssLimit ?? idx.size)
    .join("")

  const languageTag = opts.language ? `\n      <language>${escapeHTML(opts.language)}</language>` : ""

  return `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
    <channel>
      <title>${escapeHTML(opts.feedTitle)}</title>
      <link>https://${joinSegments(baseUrl, opts.feedLink)}</link>
      <description>${escapeHTML(opts.feedDescription)}</description>
      <generator>Quartz -- quartz.jzhao.xyz</generator>${languageTag}
      ${items}
    </channel>
  </rss>`
}

export const LocalizedRSSFeed: QuartzEmitterPlugin<Partial<Options>> = (userOpts) => {
  const opts = { ...defaultOptions, ...userOpts }

  return {
    name: "LocalizedRSSFeed",
    async *emit(ctx, content) {
      if (!opts.includePrefix || !opts.feedTitle || !opts.feedDescription || !opts.feedLink || !opts.rssSlug) {
        throw new Error("LocalizedRSSFeed requires includePrefix, feedTitle, feedDescription, feedLink, and rssSlug")
      }

      const baseUrl = ctx.cfg.configuration.baseUrl ?? ""
      const linkIndex: ContentIndexMap = new Map()

      for (const [tree, file] of content) {
        const slug = file.data.slug!
        const date = getDate(ctx.cfg.configuration, file.data) ?? new Date()

        if (!shouldInclude(slug, opts.includePrefix) || !isDiscoverablePage(file.data)) {
          continue
        }

        if (opts.includeEmptyFiles || (file.data.text && file.data.text !== "")) {
          linkIndex.set(slug, {
            slug,
            filePath: file.data.relativePath!,
            title: file.data.frontmatter?.title!,
            content: file.data.text ?? "",
            richContent: opts.rssFullHtml
              ? escapeHTML(toHtml(tree as Root, { allowDangerousHtml: true }))
              : undefined,
            date,
            description: file.data.description ?? "",
          })
        }
      }

      yield write({
        ctx,
        content: generateRSSFeed(linkIndex, opts as Options, baseUrl),
        slug: opts.rssSlug as FullSlug,
        ext: ".xml",
      })
    },
  }
}
