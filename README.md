# Uday Kiran — Portfolio

This is a small static portfolio site (HTML/CSS/JS) showcasing projects, skills and contact info. I added an enhanced project details modal that opens when the "More" button is clicked.

## Quick start (Windows / PowerShell)
From the project root (`index.html` is here), run a simple static server and open the site:

```powershell
Set-Location 'C:\Users\uday kiran\OneDrive\Desktop\projects\Portfolio'
python -m http.server 8000
# then open http://localhost:8000 in your browser
```

Or use a Node-based static server:

```powershell
npx serve -s .
```

## What I changed (recent edits)
- Enhanced the projects modal to show image, description, features and tech badges.
- Prevented accidental navigation when clicking "More".
- Added keyboard accessibility:
  - Focus trap (Tab / Shift+Tab) while modal is open.
  - Close on Escape and clicking outside.
  - Restores focus to the previously focused element on close.
- Added stronger background isolation (inert behavior): background elements are visually dimmed and removed from the tab order while modal is open.
- Removed placeholder "No live" / "No source" buttons — action buttons only show when a real URL is provided.

Files touched:
- `script.js` — modal rendering, focus trap, inert background handling, projects data structure
- `styles.css` — modal styles, `.inert` visual lockdown
- `index.html` — unchanged except for the existing modal markup

## How to edit project details
Open `script.js` and find the `projects` object near the top. Each entry can contain:

- `title` (string)
- `desc` (string)
- `image` (URL string)
- `tech` (array of strings)
- `features` (array of strings)
- `year` (string)
- `live` (URL string) — leave as `"#"` or remove for no live link
- `source` (URL string) — leave as `"#"` or remove for no source link

Example:
```js
'example-project': {
  title: 'Example',
  desc: 'Short description',
  image: 'https://.../image.jpg',
  tech: ['HTML','CSS','JS'],
  features: ['Feature A','Feature B'],
  year: '2024',
  live: 'https://example.com',
  source: 'https://github.com/username/repo'
}
```

If `live` or `source` are absent or `"#"`, the corresponding action link is not rendered.

## Testing the modal behavior
1. Open the page and scroll to the Projects section.
2. Click a project's "More" button. The modal should:
   - Appear centered with an image, description, features and tech chips.
   - Dim and block interaction with the background.
   - Keep keyboard focus inside the modal (Tab / Shift+Tab).
   - Close on `Esc`, on the × close button, or by clicking outside.
3. After closing the modal, focus should return to the "More" button you clicked.

## Accessibility notes
- Background is marked with `aria-hidden="true"` when the modal is open, and focusable elements get `tabindex="-1"` so screen readers and keyboard users don't accidentally move to background content.
- Focus is trapped within the modal and restored when closed.

## Next improvements (suggestions)
- Add a focus trap library or `inert` polyfill for broader compatibility.
- Add entrance animations for modal elements.
- Replace placeholders with real project URLs and high-resolution screenshots.
- Convert the modal into a template/component for easier reuse.

---
If you'd like, I can hide the entire action row when there are no action links, wire real project links, or add entrance animations next — tell me which and I'll implement it.