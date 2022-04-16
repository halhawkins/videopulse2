import axios from "axios";
import { Component } from "react";
import settings from "../settings";

class VerifyAccount extends Component{

    constructor(props){
        super(props);
        this.verificationMessage = "";
        this.state = {
            token: "",
            email: ""
        }
    }

    componentDidUpdate = (prevprops) => {
        if(prevprops.token !== this.props.token){
            axios.get(`${settings.api_url}api/verifyaccount`,{
                token: this.props.token,
                email: this.props.email
            })
            .then(res => {
                if(res.status === 200){
                    this.verificationMessage = "Welcome to VideoPulse! Your account has been verified. Please login.";
                }
                else{
                    this.verificationMessage = res.data.message;
                }
            });
                
        }
    }

    componentDidMount = () => {
        axios.post(`${settings.api_url}api/verifyaccount`,{
            token: this.props.token,
            email: this.props.email
        })
        .then(res => {
        
            if(res.status === 200){
                this.setState({
                    message:<div>Welcome to VideoPulse! Your account has been verified. Please <a href="?page=login" style={{color: "orange"}} >login.</a></div>
                })
            }
            else{
                this.verificationMessage = this.state.message;
                this.forceUpdate();
            }
        })
        .catch(r => {
                this.setState({
                    message: <div>Verification was unsuccessful. Please <a href="?page=register" style={{color: "orange"}}>re-register.</a></div>
                })
        });
    }

    render() {
        // alert(JSON.stringify(this.props));
        return(
            <>
                <div className="content-title"><h2 className="page-title">Verify Account</h2></div>
                <div className="login-container">
                        <div className="profile-content">
                        <div className="profile-flex1" id="message-div"></div>
                        <div className="profile-flex3" ref={this.contentRef}>
                            {this.verificationMessage}
                            <div className="above-form">{this.state.message}</div>
                            <div className="above-form" style={{color:"white"}} id="login-message" ref={this.loginMessage}></div>
                        </div>
                        <div className="profile-flex1"></div>
                        </div>
                    </div>
            </>    
        );
    }
}

export default VerifyAccount;