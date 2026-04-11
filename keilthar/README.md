# Project Description

This project is a **Github Page** dedicated to a devlog about **game development (Unity)** and **tech (tooling, methodology, actuality...)**.

`quartz` is used to build the static site, made of `markdown` files.

## Site structure

All the content of the site is located under the local repository `/content`.

Homepage : `/content/index.md` is used only to redirect the reader to sub-sections per language :
- french : `/content/fr`
- english : `/content/en`

Each one has its own homepage `index.md` that introduce myself and the blog context to the reader.
- Both sections are mirrored : they replicate the exact same content, just translated in the corresponding language.
- When editing article content or site structure for one language, update the corresponding mirrored page in the other language too, unless the user explicitly asks for a single-language change.
- Each section exposes its own `RSS feed`.
- Pages can use `hidden: true` in frontmatter to stay accessible by direct URL while being excluded from RSS, search, graph, backlinks, and folder/tag listings.
- Pages can use `draft: true` in frontmatter to be fully excluded from the build.

For each section, several subfolders are created to regroup articles by topics. Articles are divided into 3 main categories with a specific emoji marker :
- 📖 : **tutorials** (dev tips, tooling...)
- 💡 : **vulgarization** (game dev and tech topics)
- ✏️ : **opinion pieces** (commenting on actuality and personal thoughts)

## Commands

- Keep the same language in the chat as the current user conversation, regardless of the language used in the files you read.

- Prefer the repository launchers in `/keilthar` so Quartz always starts from the correct repository root.

- To **build the project** for testing, use:

```powershell
.\keilthar\build-local.cmd
```

The site will be available on http://localhost:8080/

- To **publish** the project to **GitHub Pages**, use only if the user explicitly asks for deployment :
```powershell
.\keilthar\publish-github-pages.cmd
```

Content will be pushed quickly, but structural changes will require several minutes to be available on https://keilthar.github.io/devlog/
