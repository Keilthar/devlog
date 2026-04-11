At start of discussion, read `keilthar/README.md`.

Repository quick rules:
- This project is a Quartz-based GitHub Pages devlog.
- Source content lives under `content/`.
- `content/fr` and `content/en` are mirrored language sections and each exposes its own RSS feed.
- Use `hidden: true` for pages that should stay reachable by direct URL but stay out of discovery surfaces. Use `draft: true` for pages that must be excluded from the build.
- Prefer the repository launchers `keilthar/build-local.cmd` and `keilthar/publish-github-pages.cmd` over manually typing Quartz commands.
- Keep the same language in the chat as the current user conversation, regardless of the language used in repository files or docs.
- Do not publish or deploy unless the user explicitly asks for it.
