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
            apiClient.post(`${settings.api_url}signout`,{withCredentials:true})//,{},{withCredentials:true}
            .then(data => {
                console.log("adag erg q qer q gqerg qe dfvq evefq wsseas xca")
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

    submitSearch = (e) => {
        this.searchForm.current.submit();
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
        console.log("UserMenu 103 ",this.props);

        return (
            <div className="user-menu-popup">
                <div className="user-menu-popup-inner">
                <div className="search-menu-item" >
                    <form action="?page=search" method="get" ref={this.searchForm}>
                    <input tabIndex={"1"} type="text" name="q" className="search-input"/><input type={"hidden"} name="p" value="1" /><input type="hidden" name="page" value="search" />
                    <div onClick={this.submitSearch} onKeyDown={this.submitSearch} tabIndex={"2"} role="button" className="search-button-div" value="submit">
                        <img src="data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M0 0h24v24H0z' fill='orange'/%3E%3Cpath d='M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z'/%3E%3C/svg%3E" alt="search button" />
                    </div>
                    </form>
                </div>
                <div className="menu-item"><hr /></div>
                { 
                    isLoggedIn()?<>
                        <div className="menu-item" onClick={this.showLists}>Lists</div>
                        <div className="menu-item" onClick={this.showFavorites}>Favorites</div>
                        <div className="menu-item" onClick={this.profile}>Profile</div>
                        <div className="menu-item" onClick={this.logout}>Log out</div>
                    </>:
                    <>
                        <div className="menu-item"><a href="?page=login">Log in</a></div>
                        <div className="menu-item"><a href="?page=register">Register</a></div>
                    </>
                }
                </div>
            </div>
        )
    }   
}
export default UserMenu;