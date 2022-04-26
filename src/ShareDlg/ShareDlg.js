import { Component } from "react";
import {
    EmailShareButton,
    FacebookShareButton,
    LinkedinShareButton,
    RedditShareButton,
    TwitterShareButton,
    FacebookIcon,
    TwitterIcon,
    LinkedinIcon,
    EmailIcon,
    RedditIcon
} from "react-share";
    
class ShareDlg extends Component{

    constructor(props){
        super(props);

        this.shareDlg = [];
        
        this.state = {
            email: false,
            facebook: false,
            twitter: false,
            linkedIn: false
        };
    }

    closeDlg = () => {
        this.props.close();
    }
    share = (e) => {
        const network = e.target.getAttribute("data-social");

    }

    render = () => {
        return (
            <div className="modal-screen">
                {this.state.facebook===true?<></>:<></>}
            <div className="dialog">
                <div className="dlg-title">Share this page</div>
                <div className="dlg-content">
                    <ul style={{listStyle: "none"}}>
                        <li data-social="email" style={{cursor: "pointer"}}>
                            <EmailShareButton
                                url={document.location.href}
                                style={{marginLeft:"-2em"}}>
                            <EmailIcon size={48} round /></EmailShareButton>
                            <span style={{color: "orange",position: "relative", top: "-1em"}}>Share via email</span>
                        </li>
                        <li data-social="twitter" style={{cursor: "pointer",}}>
                            <TwitterShareButton
                                url={document.location.href}
                                style={{marginLeft:"-2em"}}>
                            <TwitterIcon size={48} round /></TwitterShareButton>
                            <span style={{color: "orange",position: "relative", top: "-1em"}}>Share on Twitter</span>
                        </li>
                        <li data-social="facebook" style={{cursor: "pointer"}}>
                            <FacebookShareButton
                                url={document.location.href}
                                style={{marginLeft:"-2em"}}>
                            <FacebookIcon size={48} round /></FacebookShareButton>
                            <span style={{color: "orange",position: "relative", top: "-1em"}}>Share on Facebook</span>
                        </li>
                        {/* <li data-social="linkedin" style={{cursor: "pointer"}}>
                            <LinkedinShareButton
                                url={document.location.href}
                                style={{marginLeft:"-2em"}}>
                            <LinkedinIcon size={48} round /></LinkedinShareButton>
                            <span style={{color: "orange",position: "relative", top: "-1em"}}>Share on LinkedIn</span>
                        </li> */}
                        <li data-social="linkedin" style={{cursor: "pointer"}}>
                            <RedditShareButton
                                url={document.location.href}
                                style={{marginLeft:"-2em"}}>
                            <RedditIcon size={48} round /></RedditShareButton>
                            <span style={{color: "orange",position: "relative", top: "-1em"}}>Share on Reddit</span>
                        </li>
                    </ul>
                    <div onClick={this.closeDlg} className="vp-button" style={{color: "white", textAlign:"center"}}>Close</div> 
                </div>
            </div>
        </div>
        );
    }
}
export default ShareDlg;