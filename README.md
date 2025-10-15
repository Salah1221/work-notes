# Work Notes Quartz Site

This repository contains the Quartz v4 setup that powers the public website for these notes. Quartz is a static-site generator tailored for digital gardens, making it easy to publish Markdown content from the `content/` directory.

## Prerequisites

- Node.js ≥ 22 and npm ≥ 10.9.2 (see `package.json`)
- Optional but highly recommended: [Obsidian](https://obsidian.md/) for editing Markdown notes

## Install Dependencies

```bash
npm install
```

Run this once after cloning (and again whenever dependencies change).

## Preview Locally

```bash
npx quartz build --serve
```

Quartz builds the site and serves it with live reload. Follow the terminal link to browse the local preview while you edit notes.

## Publish Changes

```bash
npx quartz sync
```

This command commits the latest build output to the configured deployment target. Make sure your Git remotes and credentials are set up before running it.

## Editing Content with Obsidian

- Open Obsidian and choose **Open folder as vault**, then select the repository’s `content/` directory. Obsidian will treat each Markdown file in that folder as a note.
- Use Obsidian’s **Properties** panel (top-right in the default theme) to manage front matter for each note:
  - **title**: Sets the display title on the site without renaming the note file. Ideal for keeping short filenames while showing a descriptive heading online.
  - **tags**: Add one or more tags (e.g. `project/alpha`, `status/in-progress`) to help Quartz group and render content by topics.
  - **author**: Specify who wrote the note. Use a single string or an array if multiple authors collaborated.
  - **aliases** (optional): Provide alternate titles or search terms so Quartz can resolve different queries to the same note.
- Obsidian writes these properties as YAML front matter at the top of the Markdown file. A note with the properties above looks like:

```markdown
---
title: Quarterly Planning Notes
author:
  - Jane Doe
tags:
  - planning
  - q4
aliases:
  - Q4 Planning
---
```

Feel free to add additional metadata such as `description`, `created`, or `updated`—Quartz will pass these through to your layouts for custom use.

With the vault open in Obsidian and the local server running, you can iterate quickly: edit notes, check the live preview, then sync when you are ready to publish.

## Credits

This site is built with [Quartz](https://quartz.jzhao.xyz/). Huge thanks to the Quartz community for maintaining the tooling that powers this workflow.
