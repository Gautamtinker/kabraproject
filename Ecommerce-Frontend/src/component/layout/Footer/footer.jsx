import Appstore from "../../../images/Appstore.png";
import Playstore from "../../../images/playstore.png";
import "./footer.css";

export default function Footer() {
  return (
    <footer id="footer">
      <div className="leftFooter">
        <h4>DOWNLOAD OUR APP</h4>
        <p>Download App for Android and IOS mobile phone</p>
        <img src={Playstore} alt="playstore" />
        <img src={Appstore} alt="Appstore" />
      </div>

      <div className="midFooter">
        <h1>ECOMMERCE.</h1>
        <p>High Quality is our first priority</p>

        <p>Copyrights 2023 &copy; MeHimanshuChauhan</p>
      </div>

      <div className="rightFooter">
        <h4>Follow Us</h4>
        <a href="http://instagram.com/">Instagram</a>
        <a href="http://youtube.com/">Youtube</a>
        <a href="http://facebook.com/">Facebook</a>
      </div>
    </footer>
  );
}
