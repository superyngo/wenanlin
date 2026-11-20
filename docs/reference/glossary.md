# Glossary

Canonical vocabulary for the studio website. Bolded terms inside a definition are other entries.

**Production**:
One showcased tool or app, a Markdown file in the `productions` content collection
(`src/content/productions/`), rendered as a production page.
_Avoid_: Project, product, app page.

**Post**:
One blog entry, a Markdown file in the `blog` content collection (`src/content/blog/`).
_Avoid_: Article, entry.

**Tag**:
A frontmatter label on a **Post** or **Production** used for filtering and tag pages.
_Avoid_: Category, label.

**Stats baseline**:
Frontmatter values (GitHub stars, App Store version) used when the build-time fetch in
`src/lib/stats.ts` fails.
_Avoid_: Fallback stats, default stats.
