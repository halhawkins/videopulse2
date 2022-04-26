import { Component } from "react";

class FooterComponent extends Component{

    render = () => {
        return(
            <footer className="footer-div">
                <div><a href={"?page=about"}>About</a></div><div><a href={"?page=tos"}>Terms of Service</a></div><div><a href={"?page=privacy"}>Privacy Policy</a></div>
            </footer>
        );
    }
}

export default FooterComponent;