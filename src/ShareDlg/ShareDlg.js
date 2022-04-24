import { Component } from "react";
import twitterIcon from "../images/twitter-grey.png";
import facebookIcon from "../images/fb-grey.png";
import linkedInIcon from "../images/linkedin-grey.png";
class ShareDlg extends Component{

    closeDlg = () => {
        this.props.close();
    }
    render = () => {
        return (
            <div className="modal-screen">
            <div className="dialog">
                <div className="dlg-title">Share this page</div>
                <div className="dlg-content">
                    <ul style={{listStyle: "none"}}>
                        <li onClick={this.share} data-social="twitter" style={{cursor: "pointer",}}><img src={twitterIcon} alt="Share on Twitter" title="Share on Twitter" style={{width: "48px", margin:"0 0.8em 0 -2em"}}/><span style={{color: "orange",position: "relative", top: "-1em"}}>Share on Twitter</span></li>
                        <li onClick={this.share} data-social="facebook" style={{cursor: "pointer"}}><img src={facebookIcon} alt="Share on Facebook" title="Share on Facebook" style={{width: "48px", margin:"0 0.8em 0 -2em"}}/><span style={{color: "orange",position: "relative", top: "-1em"}}>Share on Facebook</span></li>
                        <li onClick={this.share} data-social="linkedin" style={{cursor: "pointer"}}><img src={linkedInIcon} alt="Share on LinkedIn" title="Share on LinkedIn" style={{width: "48px", margin:"0 0.8em 0 -2em"}}/><span style={{color: "orange",position: "relative", top: "-1em"}}>Share on LinkedIn</span></li>
                    </ul>
                    <div onClick={this.closeDlg} className="vp-button" style={{color: "white", textAlign:"center"}}>Close</div> 
                </div>
            </div>
        </div>
        );
    }
}
export default ShareDlg;