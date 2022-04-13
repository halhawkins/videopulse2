import axios from "axios";
import { Component } from "react";
import settings from "../settings";

class RequestPwdReset extends Component{
    constructor(props){
        super(props);

        this.state = {
            error: null
        }
    }
    
    submitPwdReset = () => {
        let email = document.getElementById('email').value;
        axios.get(`${settings.api_url}api/pwreset?email_address=${email}`)
        .then(response => {
            this.setState({
                error: false,
                message: response.data.message
            })
        })
        .catch((error) => {
            this.setState({
                error:true,
                message: error.response.data.message
            })
        })

    }

    render() {
        if(this.state.error === null)
            return (
                <div className="pwd-landing-page">
                    <div className="pwd-form-flex-container">
                        <div className="pwd-side">
                        </div>
                        <div className="pwd-form">
                            <div className="above-form"></div>
                            <div className="pwd-password">
                                <div>Email address:</div><input onKeyUp={this.handlePwdKeyUp} name="email" id="email" type="text" />
                            </div>
                            <div className="pwd-password">
                                <div className="vp-button" onClick={this.submitPwdReset}>Submit</div>
                            </div>
                            <div className="pwd-password">
                                Please look for an email from us. There will be a link to follow in order to set a new password. If you wait 
                                for a few minutes and still do not see one, please check your junk email. 
                            </div>
                        </div>
                        <div className="pwd-side"></div>
                    </div>
                    
                </div>
            )
        else if(this.state.error === true){
            return(
                <div className="pwd-landing-page">
                <div className="pwd-form-flex-container">
                    <div className="pwd-side">
                    </div>
                    <div className="pwd-form">
                        <h3 style={{color:"red",fontWeight:"600"}}>Error</h3>
                        <div className="response-message" style={{color:"white"}}>{this.state.message}</div>
                        <div className="response-message" style={{color:"white"}}><a href="?page=reqreset">Try again</a></div>
                    </div>
                    <div className="pwd-side"></div>
                </div>
                
            </div>
            )            
        }
        else if(this.state.error === false){
            return(
                <div className="pwd-landing-page">
                <div className="pwd-form-flex-container">
                    <div className="pwd-side">
                    </div>
                    <div className="pwd-form">
                        <h3 style={{color:"red",fontWeight:"600"}}>Success</h3>
                        <div className="response-message" style={{color:"white"}}>Please check your email for a message with a password 
                        reset link. Allow a couple of minutes. If you do not find an email, please check your junk mail.<br/>Thank you.</div>
                    </div>
                    <div className="pwd-side"></div>
                </div>
                
            </div>
            )            
        }
    }

}
export default RequestPwdReset;