import { Component, createRef } from "react";
import { isLoggedIn} from '../util';
import Cookies from "js-cookie";
import apiClient from "../api";
import settings from "../settings";
import axios from "axios";

class UserMenu extends Component{
    constructor(props){
        super(props);
        this.searchForm = createRef(null);
        this.state = {
            open: true
        }
    }
    getCookie(cname) {
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for(let i = 0; i <ca.length; i++) {
          let c = ca[i];
          while (c.charAt(0) === ' ') {
            c = c.substring(1);
          }
          if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
          }
        }
        return "";
      }

    logout = () => {
        this.props.toggleMenu();
        apiClient.get(`${settings.api_url}sanctum/csrf-cookie`)
            .then(()=>{
            apiClient.post(`${settings.api_url}signout`,{withCredentials:true})
            .then(() => {
                Cookies.remove('active_session', {expires: 86400, sameSite: 'lax'});
                this.popout.current.classList.remove('popout-menu-show');
                this.popout.current.classList.add('popout-menu-hidden');
            })
            .catch(error =>{
                if (error.response) {
                    console.log("logout error data: ",error.response.data);
                    console.log("logout error status: ",error.response.status);
                    console.log("logout error headers: ",error.response.headers);
                } else if (error.request) {
                    console.log("logout error request: ",error.request);
                } else {
                    console.log('logout Error ', error.message);
                }
                console.log('logout config ',error.config);
            })
        })
    }
    
  login = () => {
    window.location = "?page=login";
    /**
     * 
     * see https://dev.to/nicolus/laravel-sanctum-explained-spa-authentication-45g1
     * 
     * 
     */

    axios.get(`${settings.api_url}sanctum/csrf-cookie`, {withCredentials: true})
    .then(() => {
        axios.post(`${settings.api_url}signin`,{
            headers: {'Content-Type':'application/x-www-form-urlencoded'},
            
            email: document.getElementById('email').value,
            password: document.getElementById('password').value
        }, {withCredentials: true})
        .then(data => {
            this.token = data.data.token;
            this.popout.current.classList.remove('popout-menu-show');
            this.popout.current.classList.add('popout-menu-hidden');
            Cookies.set('active_session',true,{expires:86400,sameSite:'lax'});
            Cookies.set('vp_token',this.token,{expires:86400,sameSite:'lax'});
        })
        .catch(response => {
        })
    })
  }

  profile = () => {
        window.location = "?page=profile";
    }

    showLists = () => {
        window.location = "?page=lists";
    }

    showFavorites = () => {
        window.location = "?page=favorites";
    }

    render = () => {
        let menu;
        if(isLoggedIn()){
            menu = <>
            <div className="menu-item" onClick={this.showLists}><div className="lists-icon"></div><div className="menu-label">Lists</div></div>
            <div className="menu-item" onClick={this.showFavorites}><div className="favorites-icon"></div><div className="menu-label">Favorites</div></div>
            <div className="menu-item" onClick={this.profile}><div className="profile-icon"></div><div className="menu-label">Profile <em>{this.props.username}</em></div></div>
            <div className="menu-item" onClick={this.logout}><div className="logout-icon"></div><div className="menu-label">Log out</div></div>
        </>
        }
        else{
            menu = <>
            <div className="menu-item"><div className="login-icon"></div><div className="menu-label"><a href="?page=login">Log in</a></div></div>
            <div className="menu-item"><div className="register-icon"></div><div className="menu-label"><a href="?page=register">Register</a></div></div>
            {/* <div className="login-icon"></div><div className="menu-item"><a href="?page=login"><div className="menu-label">Log in</a></div> */}
            {/* <div className="register-icon"></div><div className="menu-item"><a href="?page=register"><div className="menu-label">Register</a></div> */}
        </>
        }
        return (
            <div className="user-menu-popup">
                <div className="user-menu-popup-inner">
                { menu }
                </div>
            </div>
        )
    }   
}
export default UserMenu;