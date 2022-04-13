import axios from "axios";
import { Component } from "react";
import settings from "../settings";
class PasswordLandingPage extends Component {

    constructor(props){
        super(props);
        this.state = {
            validToken: null,
            success: null,
            message: ""
        }
    }

    handlePwdKeyUp = (e) => {
        axios.get(`${settings.api_url}api/pwdscore?password=${e.target.value}`)
        .then(response => {
            let color = "red";
            let strength = "Very poor";
            switch(response.data.strength){
                case 0:
                    color = "red";
                    strength = "Very poor";
                    break;
                case 1:
                    color = "orange";
                    strength = "Poor";
                    break;
                case 2:
                    color = "yellow";
                    strength = "Average";
                    break;
                case 3:
                    color = "greenyellow";
                    strength = "Good";
                    break;
                default:
                    color = "limegreen";
                    strength = "Excellent";
                    break;
            }
            let strengthDiv = document.getElementById("strength-div")
            strengthDiv.style.fontWeight = "bold";
            strengthDiv.style.color= color;
            strengthDiv.innerText = strength;
        })
    }

    SubmitPwd = (e) => {
        axios.post(`${settings.api_url}api/resetpassword`,{
            email: this.props.email,
            newpassword: document.getElementById("newpassword").value,
            verifypassword: document.getElementById("confirmpassword").value,
            token:this.props.token
        })
        .then(response => {
            window.location = '/?page=login';
            this.setState({
                validToken: true,
                success: true
            });
        })
        .catch(error => {

            this.setState({
                validToken: true,
                success: null,
                message: <div style={{color: "white"}}><h3 style={{color:"red"}}>Error:</h3> {error.response.data.message}. Please retry.</div>
            });
            this.forceUpdate();
        });
    }

    handleConfirmKeyUp = (e) => {
        let cp = document.getElementById('confirmpassword').value;
        let pw = document.getElementById('newpassword').value;
        let confirmDiv = document.getElementById('confirm-div');
        if(cp !== pw){
            confirmDiv.style.color = "red";
            confirmDiv.innerText = "No match";
        }
        else{
            confirmDiv.style.color = "greenyellow";
            confirmDiv.innerText = "Match!"
        }
    }

    componentDidMount = () => {
        axios.get(`${settings.api_url}api/pwdresettoken?email=${this.props.email}&token=${this.props.token}`)
        .then(response => {
            let valid = false;
            if(typeof(response.data.email) !== 'undefined'){
                valid = true;
            }           
            this.setState({
                validToken: valid
            });
        })
    }

    render() {
        if(this.state.validToken && this.state.success === null)
            return (
                <div className="pwd-landing-page">
                    <div className="pwd-form-flex-container">
                        <div className="pwd-side">
                        </div>
                        <div className="pwd-form">
                            <div className="above-form"></div>
                            <div className="pwd-password">
                                <div>New Password</div><input onKeyUp={this.handlePwdKeyUp} name="newpassword" id="newpassword" type="password" />&nbsp;<div id="strength-div"></div>
                            </div>
                                <div className="pwd-password">
                                <div>Confirm Password</div><input onKeyUp={this.handleConfirmKeyUp} name="confirmpassword" id="confirmpassword" type="password" />&nbsp;<div id="confirm-div"></div></div>
                                <div className="pwd-password">
                                <div className="vp-button" onClick={this.SubmitPwd}>
                                Submit
                                </div>
                                </div>
                                <div className="above-form">{this.state.message}</div>
                            
                        </div>
                        <div className="pwd-side"></div>
                    </div>
                    
                </div>
            )
        else if(this.state.validToken === false){
            return(
            <div className="pwd-landing-page">
            <div className="pwd-form-flex-container">
                <div className="pwd-side">
                </div>
                <div className="pwd-form">
                    <div className="above-form"></div>
                    <div style={{color:"white",textAlign:"center"}}><h3>Error:</h3> Invalid or expired token. Please <span href="">reset</span> password again or login using the corner menu.</div>                    
                </div>
                <div className="pwd-side"></div>
            </div>
            
        </div>
            )
        }
        else if(this.state.validToken === null){
            return null;
        }
    }
}
export default PasswordLandingPage;