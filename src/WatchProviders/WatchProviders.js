import axios from "axios";
import { Component, createRef } from "react";
import settings from "../settings";
import watchmodeLogo from "../images/watchmode-logo.png";


class WatchProviders extends Component{

    constructor(props){
        super(props);

        this.regionSelect = [];
        this.countryListRef = createRef(null);
        this.formatSelectRef = createRef(null);
        this.state = { 
            region: 'US',
            regionName: 'Canada',
            rent: [],
            buy: [],
            sub: []
        }
    }

    componentDidMount = () => {

        let mediaID = this.props.mediaID;
        let mediaType = this.props.mediaType;
        let defaultRegion = this.props.region;
        let season = this.props.season;
        let episode_number = this.props?.episode;
        let rent=[],buy=[],sub=[];

        let url = "";
        sub = ["sdfm","sdg","asdfg"];
        if(mediaType !== 'tv' && mediaType !== 'episode'){
            axios.get(`${settings.api_url}api/regioncodes`)
            .then(countries => {
                this.regionSelect = countries.data;
                if(mediaType === 'tv' || mediaType === 'episode' || mediaType === 'tvshow'){
                    url = `${settings.api_url}api/watchproviders?tmdb_id=${mediaID}&media_type=${mediaType}&season=`;
                }
                else{
                    url = `${settings.api_url}api/watchproviders?tmdb_id=${mediaID}&media_type=${mediaType}`;
                }
                axios.get(url)
                .then(response => {
                    if(typeof episode_number !== 'undefined')
                    {
                        let epArray = response.data.providers_json.filter(snum => {
                            return snum.season_number===parseInt(season,10);
                        }).find(epnum => {return epnum.episode_number===parseInt(episode_number,10)});
                        rent = epArray?.sources?.filter(rsources => {return rsources.type === 'rent'});
                        buy = epArray?.sources?.filter(bsources => {return bsources.type === 'buy'});
                        sub = epArray?.sources?.filter(ssources => {return ssources.type === 'sub'});
                    }
                    else{
                        rent = response.data.providers_json?.filter(wtype => {
                            return wtype.type === 'rent';
                        });
                        buy = response.data.providers_json?.filter(wtype => {
                            return wtype.type === 'buy';
                        });
                        sub = response.data.providers_json?.filter(wtype => {
                            return wtype.type === 'sub';
                        });
                    }

                    let regionName = countries?.data?.find(r => r.code === defaultRegion)?.country;
                    axios.get(`${settings.api_url}api/watchsources`)
                    .then(sources => {
                        this.setState({
                            sources: sources.data,
                            regionName: regionName,
                            rent: rent,
                            buy: buy,
                            sub: sub,
                            format: "4K"
                        });
                    });
                    this.forceUpdate();
                })
            });
        }
    }

    getLogo = (id) => {
        let provider = this.state?.sources?.find(logoItem => {
            return logoItem.id === id?true:false;
        })
        return provider?.logo_100px;
    }

    setRegion = (e) => {
        let regionCode,regionName;
        if(e.target.tagName === "IMG"){
            regionCode = e.target.parentNode.parentNode.getAttribute("data-region");
            regionName = e.target.parentNode.parentNode.getAttribute("data-region-name");
        }
        else{
            regionCode = e.target.parentNode.getAttribute("data-region");
            regionName = e.target.parentNode.getAttribute("data-region-name");
        } 
        this.setState({
            showReqionList: false,
            region: regionCode,
            regionName: regionName
        })
        this.forceUpdate();
    }

    handleFormatSelect = (e) => {
        let selectedVal = e.target.value;
        this.setState({
            format: selectedVal
        });
        this.forceUpdate();
    }
    
    toggleRegionList = () => {
        let reg;
        reg = this.state.showReqionList?false:true;
        this.setState({
            showReqionList: reg
        });
        this.forceUpdate();
    }

    render = () => {
        let dropdown = [];
        if(this.state.showReqionList === true){
            dropdown = <div className="country-option-list" ref={this.countryListRef}>
                            {this.regionSelect?.map(country => {
                                return <div id={country.code} data-region-name={country.country} data-region={country.code} onClick={this.setRegion} className="country-option"><div><img src={settings.api_url + `images/flags/${country.code.toLowerCase()}.png`} alt="" /></div><div>{country.country}</div></div>
                            })}
                        </div>
            this.countryListRef = createRef(null);

        }
        else{
            dropdown = <></>
        }
        if(this.props.mediaType === 'tv' || this.props.mediaType === 'episode'){
            return <div className="reviews-container">
                <h3>Where to watch</h3>
                <div className="watchproviders-section">
                    <div class="white-text" style={{fontSize:"1.5em"}}>Direct viewing links for television episodes coming soon.</div>
                </div>
            </div>
        }
        else{
            return(
                <>
                <div className="reviews-container">
                    <h3>Where to watch</h3> <div className="watchmode-logo"><a href="https://www.watchmode.com/">Powered by <img src={watchmodeLogo} alt="Watchmode" /></a></div>
                    <div>
                        <div className="watch-options">
                            <div className="white-text">Your location:</div>
                            <div className="country-select">
                                <div className="country-select-set-option">
                                    <div onClick={this.toggleRegionList} className="country-option">
                                        <div><img src={`${settings.api_url}images/flags/${this.state.region?.toLowerCase()}.png`} alt="" /></div><div>{this.state.regionName}</div><div>&#5167;</div>
                                    </div>  
                                </div>
                                {dropdown}
                            </div>
                        </div>
                        <div className="watch-options">
                            <div className="white-text">Format</div>
                            <div className="format-select">
                                <select onChange={this.handleFormatSelect} id="formatSelect" ref={this.formatSelectRef}>
                                    <option value={"4K"}>4K</option>
                                    <option value={"HD"}>HD</option>
                                    <option value={"SD"}>SD</option>
                                </select>
                            </div>
                        </div>
                            <div className="watchproviders-section">
                                <div className="watch-category"><div className="white-text" style={{flex:"1 0 100%"}}><h4 style={{fontSize: "1.3em"}}>Buy</h4></div>
                                    {
                                        this.state?.buy?.filter(format => {return (format.format === this.state.format || format.format === null)}).map(item => {
                                            return <div className="watch-category-item"><a href={item.web_url} ><div className="watch-provider-logo"><img src={this.getLogo(item.source_id)} alt=""/></div></a><div className="watch-provider-name">{item.name+" "}<span style={{color:"orange"}}>{item.format}</span><br/>${item.price}</div></div>
                                        })
                                    }
                                </div>
                            </div>
                            <div className="watchproviders-section">
                                <div className="watch-category"><div className="white-text" style={{flex:"1 0 100%"}}><h4 style={{fontSize: "1.3em"}}>Rent</h4></div>
                                    {
                                        this.state?.rent?.filter(format => format.format === this.state.format).map(item => {
                                            return <div className="watch-category-item"><a href={item.web_url} ><div className="watch-provider-logo"><img src={this.getLogo(item.source_id)} alt=""/></div></a><div className="watch-provider-name">{item.name+" "}<span style={{color:"orange"}}>{item.format}</span><br/>${item.price}</div></div>
                                        })
                                    }
                                </div>
                            </div>
                            <div className="watchproviders-section">
                                <div className="watch-category"><div className="white-text" style={{flex:"1 0 100%"}}><h4 style={{fontSize: "1.3em"}}>Streaming Providers</h4></div>
                                    {
                                        this.state?.sub?.map(item => {
                                            return <div className="watch-category-item"><a href={item.web_url} ><div className="watch-provider-logo"><img src={this.getLogo(item.source_id)} alt=""/></div></a><div className="watch-provider-name">{item.name+" "}<span style={{color:"orange"}}>{item.format}</span></div></div>
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                    </div>

                </>
            ); 
        }
    }
}
export default WatchProviders;
