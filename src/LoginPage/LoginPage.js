import axios from "axios";
import { Component } from "react";
import settings from "../settings";
import Cookies from 'js-cookie';

class LoginPage extends Component{
    constructor(props){
        super(props);
        this.state = {
            message: ""
        }
    }
    submitLogin = () => {
        axios.post(`${settings.api_url}api/signin`,{
            email: document.getElementById('email').value,
            password: document.getElementById('password').value
        }, {withCredentials: true})
        .then(response => {
            this.token = response.data.token;
            Cookies.set('active_session',true,{expires:86400,sameSite:'lax'});
            Cookies.set('vp_token',this.token,{expires:86400,sameSite:'lax'});
            window.location = "/";
        })
        .catch(error => {
            this.setState({
                message: <div style={{color: "white"}}><h3 style={{color:"red"}}>Error:</h3> {error.response.data.error}.</div>
            });
            this.forceUpdate();
            
        })
    }

    render() {
            return (
                <>
                    <div className="content-title"><h2 className="page-title">Login</h2></div>
                    <div className="login-container">
                        <div className="profile-content">
                        <div className="profile-flex1" id="message-div"></div>
                        <div className="profile-flex3">
                            <div className="pwd-password">
                                <div>Email Address</div><input name="email" id="email" type="text" />
                            </div>
                            <div className="pwd-password">
                                <div>Password</div><input name="password" id="password" type="password" />
                            </div>
                            <div className="pwd-password">
                                <div className="videopulse-button" onClick={this.submitLogin}>
                                    Submit
                                </div>
                            </div>
                            {/* <div className="pwd-password">
                                <input type="checkbox" value="stayLoggedIn" />Keep logged in
                            </div> */}
                            <div className="pwd-password" style={{outline:"1px solid orange", color: "orange",padding: "0.3em"}}><a href="?page=forgotpwd">Click if you forgot your password</a></div>
                            <div className="above-form">{this.state.message}</div>
                            <div className="above-form" style={{color:"white"}} id="login-message"></div>
                        </div>
                        <div className="profile-flex1"></div>
                        </div>
                    </div>
                </>
            )

            // let oldstuff =    <div className="pwd-landing-page">
            //         <div className="pwd-form-flex-container">
            //             <div className="pwd-side">
            //             </div>
            //             <div className="pwd-form">
            //                 <div className="above-form"></div>
            //                 <div className="pwd-password">
            //                     <div>Email Address</div><input name="email" id="email" type="text" />
            //                 </div>
            //                     <div className="pwd-password">
            //                     <div>Password</div><input name="password" id="password" type="password" /></div>
            //                     <div className="pwd-password">
            //                     <div className="vp-button" onClick={this.submitLogin}>
            //                     Submit
            //                     </div>
            //                     </div>
            //                     <div className="above-form">{this.state.message}</div>
            //                 <div className="above-form" style={{color:"white"}} id="login-message"></div>
            //             </div>
            //             <div className="pwd-side"></div>
            //         </div>
                    
            //     </div>
            // )
    }
}
export default LoginPage;