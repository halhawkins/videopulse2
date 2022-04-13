import { Component, createRef } from "react";
import SearchTags from "../SearchTags/SearchTags";

class SearchTagsDialog extends Component {
    constructor(props){
        super(props);

        this.dialogRef = createRef(null);
        this.searchtags = createRef(null);

        this.state = {
            acceptedTags: []
        }
    }

    handleAccept = (e) => {
        this.setState({
            acceptedTags: this.searchtags.current.getTags()
        });
        this.props.getTags();
    }

    getTags = () => {
        return this.searchtags.current.getTags();
    }

    render = () => {
        let dlgTitle = "";
        let dlgHeight;
        switch(this.props.tagType){
            case "cast":
                dlgTitle = "Select Cast Members";
                dlgHeight = "350px";
                break;
            case "crew":
                dlgTitle = "Select Crew Members";
                dlgHeight = "350px";
                break;
            case "providers":
                dlgTitle = "Select Watch Providers";
                dlgHeight = "225px";
                break;
            case "keywords":
                dlgTitle = "Select Keywords";
                dlgHeight = "225px";
                break;
            case "genres":
                dlgTitle = "Select Genres";
                dlgHeight = "225px";
                break;
            default:
                dlgTitle = "Select";
                dlgHeight = "225px";
                break;
        }
        return (
            <div ref={this.dialogRef} className="dialog" style={{padding: "1em",width:"535px",height:dlgHeight}}>
                <div className="dlg-title">{dlgTitle}</div>
                    <SearchTags ref={this.searchtags} tagType={this.props.tagType} label={this.props.label}/>
                <button onClick={this.handleAccept} className="vp-button" style={{position: "absolute", bottom: "0px", marginBottom: "1em", right: "0px", marginRight:"1em"}}>Accept</button>
            </div>
        );
        }
}
export default SearchTagsDialog;