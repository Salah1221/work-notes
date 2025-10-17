import { pathToRoot } from "../util/path"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import { i18n } from "../i18n"

const PageTitle: QuartzComponent = ({ fileData, cfg, displayClass }: QuartzComponentProps) => {
  const title = cfg?.pageTitle ?? i18n(cfg.locale).propertyDefaults.title
  const baseDir = pathToRoot(fileData.slug!)
  return (
    <h2 class={classNames(displayClass, "page-title")}>
      <a href={baseDir}>
        <svg
          width="36"
          height="37"
          viewBox="0 0 36 37"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={"nesco-icon"}
          style={{ marginInlineEnd: "0.65rem", verticalAlign: "text-bottom" }}
        >
          <path
            d="M7.88843 31.3313C8.49674 31.6904 9.15806 31.9688 9.85913 32.1497V33.6897C8.75148 33.4535 7.71848 33.0178 6.79858 32.4211L7.88843 31.3313ZM16.7576 32.4202C15.8379 33.0165 14.8063 33.4536 13.699 33.6897V32.1497C14.3998 31.9689 15.0606 31.6902 15.6687 31.3313L16.7576 32.4202ZM4.35522 26.6467C4.53594 27.3475 4.81472 28.0084 5.17358 28.6165L4.08472 29.7053C3.48844 28.7857 3.05119 27.7539 2.81519 26.6467H4.35522ZM20.7429 26.6467C20.5069 27.7541 20.0688 28.7856 19.4724 29.7053L18.3835 28.6165C18.7425 28.0083 19.0221 27.3476 19.2029 26.6467H20.7429ZM5.17358 20.8362C4.81451 21.4444 4.53605 22.1059 4.35522 22.8069H2.81519C3.05131 21.6995 3.48821 20.6671 4.08472 19.7473L5.17358 20.8362ZM9.85913 17.303C9.15817 17.4838 8.49667 17.7623 7.88843 18.1213L6.79956 17.0325C7.71926 16.436 8.7518 16 9.85913 15.7639V17.303Z"
            fill="var(--secondary, #5a9fd6)"
            className={"fill"}
          />
          <path
            d="M17.6882 24.7393C17.6882 28.0097 15.037 30.6609 11.7666 30.6609C8.49616 30.6609 5.84496 28.0097 5.84496 24.7393C5.84496 21.4689 8.49616 18.8177 11.7666 18.8177C15.037 18.8177 17.6882 21.4689 17.6882 24.7393Z"
            fill="var(--secondary, #5a9fd6)"
            className={"fill"}
          />
          <path
            d="M9.85949 16.5318V13.9478H13.6986V16.5318M19.9741 22.8073H22.5581V26.6464H19.9741M18.9311 29.1642L20.7583 30.9914L18.0436 33.7061L16.2164 31.8789M13.6986 32.9218V35.5059H9.8595V32.9218M7.34166 31.8789L5.51449 33.7061L2.79983 30.9914L4.627 29.1642M3.58402 26.6464H1V22.8073H3.58402M4.62701 20.2894L2.79983 18.4622L5.51449 15.7475L7.34167 17.5747M17.6882 24.7393C17.6882 28.0097 15.037 30.6609 11.7666 30.6609C8.49616 30.6609 5.84496 28.0097 5.84496 24.7393C5.84496 21.4689 8.49616 18.8177 11.7666 18.8177C15.037 18.8177 17.6882 21.4689 17.6882 24.7393Z"
            stroke="var(--secondary, #5a9fd6)"
            stroke-width="1.5"
            stroke-linecap="round"
            className={"stroke"}
          />
          <path
            d="M11.7896 9.73999C21.1554 9.74 26.8627 17.4604 26.8627 24.8132"
            stroke="var(--secondary, #5a9fd6)"
            stroke-width="1.5"
            stroke-linecap="round"
            className={"stroke"}
          />
          <path
            d="M11.7896 5.54517C23.7393 5.54518 31.0211 15.3955 31.0211 24.7767"
            stroke="var(--secondary, #5a9fd6)"
            stroke-width="1.5"
            stroke-linecap="round"
            className={"stroke"}
          />
          <path
            d="M11.7896 1.56641C26.2116 1.56642 35.0001 13.4547 35.0001 24.7769"
            stroke="var(--secondary, #5a9fd6)"
            stroke-width="1.5"
            stroke-linecap="round"
            className={"stroke"}
          />
        </svg>

        {title}
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
  .fill,
  .stroke {
    transition: fill 0.2s, stroke 0.2s;
  }
  .page-title a:hover .fill {
    fill: var(--tertiary, #ffb88c);
  }
  .page-title a:hover .stroke {
    stroke: var(--tertiary, #ffb88c);
  }
  @media (max-width: 800px) {
    .nesco-icon {
      margin-inline: 0.5rem;
    }
  }
`

export default (() => PageTitle) satisfies QuartzComponentConstructor
