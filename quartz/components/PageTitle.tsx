import { pathToRoot, joinSegments } from "../util/path"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import { i18n } from "../i18n"

const PageTitle: QuartzComponent = ({ fileData, cfg, displayClass }: QuartzComponentProps) => {
  const title = cfg?.pageTitle ?? i18n(cfg.locale).propertyDefaults.title
  const baseDir = pathToRoot(fileData.slug!)
  const logoSrc = joinSegments(baseDir, "static/logo.png")
  return (
    <div class={classNames(displayClass, "page-title")}>
      <a href={baseDir} class="page-title-link">
        <img src={logoSrc} alt="Keilthar logo" class="page-title-logo" />
        <h2 class="page-title-text">{title}</h2>
      </a>
    </div>
  )
}

PageTitle.css = `
.page-title {
  margin: 0;
}
.page-title-link {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.4rem;
  text-decoration: none;
}
.page-title-text {
  font-size: 1.75rem;
  margin: 0;
  font-family: var(--titleFont);
}
.page-title-logo {
  width: 14rem;
  height: 14rem;
  object-fit: cover;
  border-radius: 4px;
}
`

export default (() => PageTitle) satisfies QuartzComponentConstructor
