import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/footer.scss"
import { version } from "../../package.json"
import { i18n } from "../i18n"

export default (() => {
  const Footer: QuartzComponent = ({ displayClass, cfg }: QuartzComponentProps) => {
    const year = new Date().getFullYear()
    return (
      <footer class={`${displayClass ?? ""}`}>
        <p>
          © {year}{" "}
          <a target={"_blank"} href="https://www.nesco.com.lb/">
            NESCO
          </a>{" "}
          <br />
          {i18n(cfg.locale).components.footer.createdWith}{" "}
          <a target={"_blank"} href="https://quartz.jzhao.xyz/">
            Quartz v{version}
          </a>
        </p>
      </footer>
    )
  }

  Footer.css = style
  return Footer
}) satisfies QuartzComponentConstructor
