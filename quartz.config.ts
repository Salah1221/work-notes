import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "Work Notes",
    pageTitleSuffix: "",
    enableSPA: true,
    enablePopovers: true,
    analytics: {
      provider: "plausible",
    },
    locale: "en-US",
    baseUrl: "quartz.jzhao.xyz",
    ignorePatterns: ["private", "templates", ".obsidian"],
    defaultDateType: "modified",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: "Schibsted Grotesk",
        body: "Source Sans Pro",
        code: "IBM Plex Mono",
      },
      colors: {
        lightMode: {
          light: "#f8f9fa",      // soft mist background (neutral, not green)
          lightgray: "#e6e8eb",  // pale stone gray
          gray: "#8a9299",       // muted slate gray
          darkgray: "#2f3b44",   // grounding slate/stone
          dark: "#1c252c",       // deep ink
          secondary: "#3A6EA5",  // blue-slate for links/buttons (water element)
          tertiary: "#FFB88C",   // warm coral/amber accent (sunlight)
          highlight: "rgba(58, 110, 165, 0.15)",  // blue-tinted selection
          textHighlight: "#ffb88c66",             // coral overlay for text
        },
        darkMode: {
          light: "#13181d",      // near-black ink
          lightgray: "#1d242b",  // deep slate surface
          gray: "#6f7c85",       // soft slate gray
          darkgray: "#d9dee2",   // pale stone mist
          dark: "#f8f9fa",       // light mist for text
          secondary: "#5A9FD6",  // brighter blue-slate for dark mode links/buttons
          tertiary: "#F4978E",   // soft coral accent
          highlight: "rgba(90, 159, 214, 0.25)", // blue glow
          textHighlight: "#ffb88c66",             // coral overlay
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "git", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.Favicon(),
      Plugin.NotFoundPage(),
      // Comment out CustomOgImages to speed up build time
      Plugin.CustomOgImages(),
    ],
  },
}

export default config
