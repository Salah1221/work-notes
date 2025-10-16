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

## Credits

![Quartz OG Image](./quartz/static/og-image.png)

This site is built with [Quartz](https://quartz.jzhao.xyz/). Huge thanks to the Quartz community for maintaining the tooling that powers this workflow.
