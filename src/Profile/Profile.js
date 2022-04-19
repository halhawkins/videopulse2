import axios from "axios";
import { Component } from "react";
import apiClient from "../api";
import FormData from "form-data";
import defaultImage from "../images/default-profile-icon-24.jpg";
import settings from "../settings";

class Profile extends Component{
    constructor(props){
        super(props);

        this.state = {
            lists: [],
            username: "",
            region_code: "",
            email: "",
            watch_providers: [],
            avatar_image: defaultImage
        }
    }

    selectImage = (e) => {
        let fileInput = document.getElementById("imageFile");
        fileInput.click();
    }

    uploadImage = (e) => {
        let fileInput = document.getElementById("imageFile");

        const formData = new FormData();
        formData.append("image", fileInput.files[0]);

        const config = {
            headers: {
                "content-type": "multipart/form-data"
            }
        };
        apiClient.post(`${settings.api_url}api/uploadImage`,formData,config)
        .then(response => {
            this.setState({
                avatar_image: `${settings.api_url}images/${response.data.image_name}`
            });
        })
        .catch(error =>{
            document.getElementById("message-div").innerText = error.response.data.message;
        });
    }

    componentDidMount = () => {
        apiClient.get('api/profile')
        .then(response => {
            let watch_providers = response.data.settings.settings.watch_providers;
            if(typeof(response.data.settings.settings.region_code) === "undefined"){
                axios.get(`${settings.api_url}api/user/location`)
                .then(res => {
                    let region_code = res.data.country_code;
                    let watch_providers = response.data.settings.settings.watch_providers;

                    apiClient.post(`${settings.api_url}api/user/region`,{region_code: region_code})
                    .then(
                        resp => {
                        apiClient.get(`${settings.api_url}api/lists`)
                        .then(data => {
                            this.listHtml = data.data.map((list,i) => {
                                return(
                                    <li>{this.isInList(list.id,list.items)?list.list_name==='Favorites'&&list.systemList===1?<div data-listid={list.id} onClick={this.removeFromList} className="heart-remove" title="Remove from Favorites"></div>:<div data-listid={list.id} onClick={this.removeFromList} className="minus-sign" title="Remove from list" alt="remove from list"></div>:list.list_name==='Favorites'&&list.systemList===1?<div data-listid={list.id} onClick={this.addToList} className="heart-add" title="Add to Favorites"></div>:<div data-listid={list.id} onClick={this.addToList} className="plus-sign" alt="add to list" title="Add to list" ></div>}{list.list_name}</li>
                                    )
                            });
                        })
                        this.props.setWatchProviders(watch_providers);

                             this.setState({
                                username: response.data.user.name,
                                email: response.data.user.email,
                                region_code: region_code,
                                watch_providers: watch_providers,
                                avatar_image: response.data.settings.avatar_image === null?defaultImage:`${settings.api_url}images/${response.data.settings.settings.settings.avatar_image}`
                            })
                    })

                })
            }
            else{ 
                
                if(watch_providers.length > 0)
                    this.watch_providers = watch_providers.map((item,i) => {
                        return <li><img src={item.logo} alt=""/><div>{item.name}<div className="cancel-sign" style={{float: "right"}}></div></div></li>
                    });
                    
                apiClient.get(`${settings.api_url}api/lists`)
                .then(data => {
                    this.props.setWatchProviders(watch_providers);

                    this.setState({
                                lists: data.data,
                                username: response.data.user.name,
                                email: response.data.user.email,
                                region_code: response.data.settings.settings.region_code,
                                avatar_image: response.data.settings.avatar_image === null?defaultImage:`${settings.api_url}images/${response.data.settings.settings.settings.avatar_image}`
                            })
                });
            }
            this.forceUpdate();
        });
    }

    render = () => {
        return(<>
            <div className="content-title"><h2 className="page-title">Profile - {this.state.username}</h2></div>
            <div className="profile-container">
                <div className="profile-content">
                    <div className="profile-flex1" id="message-div"></div>
                    <div className="profile-flex2">
                        <h2>Profile</h2>
                        <input onChange={this.uploadImage} id="imageFile" name="imageFile" type="file" style={{display:"none"}}/>
                        <div className="profile-avatar"><img id="avatar-img" onClick={this.selectImage} src={this.state.avatar_image} alt="avatar" title="Profile image"/></div>
                        <div className="profile-user-name">{this.state.username}</div>
                        <div className="profile-email">{this.state.email}</div>
                        <div className="profile-region">{this.state.region_code}</div>
                    </div>
                    <div className="profile-flex1"></div>
                </div>
                <div className="profile-content" style={{color: "white"}}>
                    <h2>My Lists</h2>
                    <div className="list-div">
                        <div className="list-list">
                        {
                            this.state.lists.length>0?this.state.lists.map((item,i) => {
                                return <div className="list-entry"><a href={`?page=list&list_id=${item.id}`}>{item.list_name}</a></div>
                            }):<></>
                        }
                        </div>
                    </div>
                </div>
                <div className="profile-content streaming-vendors">
                    <h2>My Streaming Providers</h2>
                    <div className="list-div">
                        <div className="list-list">
                    <ul>
                        {this.watch_providers}
                    </ul>
                    </div>
                    </div>
                </div>
            </div>
            </>
        );
    }
}

export default Profile;