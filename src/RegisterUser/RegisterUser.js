import axios from "axios";
import { Component, createRef, useInsertionEffect } from "react";
import settings from "../settings";
import checkMark from "../images/green-check.png";
import noMatch from "../images/cancel.png";
import { toHaveStyle } from "@testing-library/jest-dom/dist/matchers";
// import Cookies from 'js-cookie';

class RegisterUser extends Component{
    constructor(props){
        super(props);
        this.nameRef = createRef(null);
        this.emailRef = createRef(null);
        this.passwordRef = createRef(null);
        this.pwdConfirmRef = createRef(null);
        this.loginMessage = createRef(null);
        this.contentRef = createRef(null);
        this.state = {
            strengthColor: "#fff0",
            message: "",
            confirmPwdImg: <></>
        }
    }

    getStrengthColor = (str) => {
        let color = "#fff0";
        let wording = "Terrible";
        switch(str){
            case 1:
                color = "orange";
                wording = "Very weak";
                break;
            case 2:
                color = "#ff0";
                wording = "fairly weak";
                break;
            case 3:
                color = "#adff2f";
                wording = "Good";
                break;
            case 4:
                color = "#00e600";
                wording = "Very strong";
                break;
            default:
                color = "#f00";
                wording = "Terrible";
                break;
        }
        this.setState({
            strengthColor: color,
            strengthWording: wording,
            strengthScore: str
        })
    }

    checkComplexity = () => {
        const pwField = this.passwordRef.current.value;
        axios.post(`${settings.api_url}api/pwdscore`,{password:pwField})
        .then(score => {
            this.getStrengthColor(score.data.strength);
            this.setState({
                strengthScore: score.data.strength,
            });
            this.confirmPassword();
        })
    }

    submitNewUser = () => {
        if(this.passwordRef.current.value !== this.pwdConfirmRef.current.value){
            this.loginMessage.current.innerText = "Passwords do not match";
        }
        axios.post(`${settings.api_url}api/create-account`,{
            name: this.nameRef.current.value,
            password: this.passwordRef.current.value,
            email_address: this.emailRef.current.value
        })
        .then(res => {
            if(res.status === 200){
                this.loginMessage.current.innerText = "";
                this.contentRef.current.innerHTML = "<strong>Notice: </strong> Please look in your inbox for an email to verify your new account.";
            }
            else{
                this.loginMessage.current.innerText = res.data.message;
            }
        });
    }

    confirmPassword = () => {
        let pwd = this.passwordRef.current.value;
        let conf = this.pwdConfirmRef.current.value;
        if(pwd !== conf){
            this.setState({confirmPwdImg: <img src={noMatch} alt="Passwords do not match" title="Passwords do not match" style={{width:"20px", height:"20px"}}/>})
        }
        else{
            this.setState({confirmPwdImg: <img src={checkMark} alt="Passwords match" title="Passwords match" style={{width:"20px", height:"20px"}}/>})
        }
    }

    render() {
            let pstrStyle = {background: this.state.strengthColor}
            return (
                <>
                    <div className="content-title"><h2 className="page-title">Create Account</h2></div>
                    <div className="login-container" style={{width: "21.5em"}}>
                        <div className="profile-content">
                        <div className="profile-flex1" id="message-div"></div>
                        <div className="profile-flex3" ref={this.contentRef}>
                            <div className="pwd-password">
                                <div>Name </div><input ref={this.nameRef} name="name" id="name" type="text" />
                            </div>  
                            <div className="pwd-password">
                                <div>Email Address</div><input ref={this.emailRef} name="email" id="email" type="text" />
                            </div>  
                            <div className="pwd-password">
                                <div>Password</div><input ref={this.passwordRef} onChange={this.checkComplexity} name="password" id="password" type="password" style={{marginRight:"0.5em"}}/><div className="pwd-strength" style={{position: "absolute", width: "6em",background: this.state.strengthColor, display: "inline-block", fontSize: "0.8em", color: "#000", padding: "0.3em"}}>{this.state.strengthWording}</div>
                            </div>
                            <div className="pwd-password">
                                <div>Confirm password</div><input onChange={this.confirmPassword} ref={this.pwdConfirmRef} name="pwd-confirm" id="pwd-confirm" type="password" /><div className="pwd-strength" style={{position: "absolute", width: "6em",display: "inline-block", fontSize: "0.8em", color: "#000", padding: "0.3em"}}>
                                    {this.state.confirmPwdImg}
                                </div>
                            </div>
                            <div className="pwd-password">
                                <div className="videopulse-button" onClick={this.submitNewUser}>
                                    Submit
                                </div>
                            </div>
                            {/* <div className="pwd-password">
                                <input type="checkbox" value="stayLoggedIn" />Keep logged in
                            </div> */}
                            <div className="above-form">{this.state.message}</div>
                            <div className="above-form" style={{color:"white"}} id="login-message" ref={this.loginMessage}></div>
                        </div>
                        <div className="profile-flex1"></div>
                        </div>
                    </div>
                </>
            )
    }
}
export default RegisterUser;