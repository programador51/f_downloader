import fanslyIcon from "data-base64:~assets/fansly.svg"
import popup from "./popup.module.scss"

function IndexPopup() {
  return (
    <div
      className={popup.container}
      style={{
        background: "#212529"
      }}>
      <div className={popup.header}>
        <img
          className={popup.customizedFanslyIcon}
          src={fanslyIcon}
          alt="fansly_icon"
        />

        <h1 className="text-light">Fansly Downloader</h1>
      </div>
      <small className="d-flex justify-content-center m-0 text-center text-light text-body-secondary">
        <strong>v1.0.1</strong>
      </small>
      <p>
        The extension, so far, is able to download{" "}
        <strong> only the pictures content</strong>
      </p>
      <p>
        <b>NOTE:</b> You must have the content's creator unlocked, by following,
        suscribing or buying to him/her
      </p>

      <ol>
        <li>
          Go to{" "}
          <a href="https://fansly.com" target="_blank">
            https://fansly.com
          </a>
        </li>
        <li>Open the fansly post</li>
        <li>Nav between images media</li>
        <li>Click Download</li>
      </ol>

      {/* <hr />

      <h2>Features incoming</h2>
      <ul>
        <li>Download videos</li>
        <li>Download audios</li>
        <li>Download storys</li>
        <li>Bulk download (maybe)</li>
      </ul> */}

      <hr />

      <p className="text-center">
        Join the{" "}
        <a href="https://t.me/fansly_downloader" target="_blank">
          telegram group
        </a>{" "}
        for support and feedback
      </p>

      <hr />

      <h2 className="text-center">Pre-purchase vip features</h2>

      <a className={popup.supportMeLink} href="https://ko-fi.com/programador51" target="_blank">
        <div className={popup.supportMe}>
          <img
            src="https://storage.ko-fi.com/cdn/brandasset/v2/support_me_on_kofi_badge_dark.png?_gl=1*1frted2*_gcl_aw*R0NMLjE3Mzk0NjYzMjIuQ2p3S0NBaUF6YmE5QmhCaEVpd0E3Z2xiYWs5OTIxRE5CbVFmRno0VGR3Sm1PcnRaMWdGYVUxN01zemhPeTE4M3pwTXdDc05RbDB1bm1Cb0NVZW9RQXZEX0J3RQ..*_gcl_au*MjM4NjM5NzAxLjE3Mzk0NjYzMTI.*_ga*NzQ1MTY1ODg5LjE3MzA5NDkzMDU.*_ga_M13FZ7VQ2C*MTc0MTc2MTA4OC4zNS4xLjE3NDE3NjEzNDUuMzguMC4w"
            alt="kofi"
          />
          <small>$5.00 USD</small>
        </div>
      </a>
    </div>
  )
}

export default IndexPopup
