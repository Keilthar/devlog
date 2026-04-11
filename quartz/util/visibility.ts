import { QuartzPluginData } from "../plugins/vfile"

export function isHiddenPage(file: QuartzPluginData): boolean {
  return file.frontmatter?.hidden === true || file.frontmatter?.hidden === "true"
}

export function isDiscoverablePage(file: QuartzPluginData): boolean {
  return !isHiddenPage(file)
}

export function filterDiscoverablePages(files: QuartzPluginData[]): QuartzPluginData[] {
  return files.filter(isDiscoverablePage)
}
