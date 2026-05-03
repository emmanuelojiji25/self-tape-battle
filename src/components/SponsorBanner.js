import "./SponsorBanner.scss"
import banner_desktop from "../media/banner-desktop.png"
import banner_mobile from "../media/banner-mobile.png"

const SponsorBanner = () => {
    return (
        <div className="SponsorBanner">
            <a href="https://apps.apple.com/gb/app/audition-tracker/id6740004926" target="_blank">
                <img src={banner_mobile} className="banner mobile"></img>
            </a>
        </div>
    )
}

export default SponsorBanner;