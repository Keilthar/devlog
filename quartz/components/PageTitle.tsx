import { pathToRoot } from "../util/path"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import { i18n } from "../i18n"

const PageTitle: QuartzComponent = ({ fileData, cfg, displayClass }: QuartzComponentProps) => {
  const title = cfg?.pageTitle ?? i18n(cfg.locale).propertyDefaults.title
  const baseDir = pathToRoot(fileData.slug!)
  const basePath = cfg.baseUrl.includes("/") ? "/" + cfg.baseUrl.split("/").slice(1).join("/") : ""
  const logoSrc = `${basePath}/static/logo.png`
  return (
    <h2 class={classNames(displayClass, "page-title")}>
      <a href={baseDir} class="page-title-link">
        <img src={logoSrc} alt="Keilthar logo" class="page-title-logo" />
        <span>{title}</span>
      </a>
    </h2>
  )
}

PageTitle.css = `
.page-title {
  font-size: 1.75rem;
  margin: 0;
  font-family: var(--titleFont);
}
.page-title-link {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  text-decoration: none;
}
.page-title-logo {
  width: 2.5rem;
  height: 2.5rem;
  object-fit: cover;
  border-radius: 4px;
}
`

export default (() => PageTitle) satisfies QuartzComponentConstructor
