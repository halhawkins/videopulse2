import { Component, createRef } from 'react';
import AppContent from './AppContent/AppContent';
import './vp.css';
import './devices.css';
import { getParameterByName } from './util';
import PageShortcuts from './PageShortcuts/PageShortcuts';
import UserMenu from './UserMenu/UserMenu';
import FooterComponent from './FooterComponent/FooterComponent';
import SearchBar from './SearchBar/SearchBar';

class App extends Component{
  constructor(props){
    super(props);
    this.showMenu = false;
    this.appContentRef = createRef(null);

    this.state = {
      contentView: "trending",
      userMenuVisible: false
    };
  }

  setUserName = (name) => {
    this.userName = name;
  }

  componentDidMount = () => {
    let content;
    if(getParameterByName("page") === null)
      content = "trending";
    else
      content = getParameterByName("page");
    
    this.userName = this.appContentRef.current.getUserName();
    
    this.setState({
      contentView: content
    });
  }

  updateTitle = (title) =>{
    document.title = title;
  }

  toggleUserMenu = (e) => {
    if(this.state.userMenuVisible){
      this.showMenu = false;
    }
    else{
      this.showMenu = true;
    }
    this.setState({
      userMenuVisible: this.showMenu
    })
    this.forceUpdate();
  }

  morepaginators = () => {
  }

  render = () => {
    let topSection = [];
    if(
      this.state.contentView === 'trending' || 
      this.state.contentView === 'topratedtv' || 
      this.state.contentView === 'populartv' || 
      this.state.contentView === 'popularmovies' || 
      this.state.contentView === 'discover' ||
      this.state.contentView === 'discover_results' ||
      this.state.contentView === 'list' ||
      this.state.contentView === 'search' ||
      this.state.contentView === 'profile' ||
      this.state.contentView === 'pwdlanding' ||
      this.state.contentView === 'reqreset' ||
      this.state.contentView === 'login'
    ){
      topSection = 
        <>
        <div onClick={this.toggleUserMenu} className="user-menu">
        <svg viewBox="0 0 100 80" width="40" height="40">
          <rect width="100" height="10" rx="8" fill="currentcolor"></rect>
          <rect y="30" width="100" height="10" rx="8" fill="currentcolor"></rect>
          <rect y="60" width="100" height="10" rx="8" fill="currentcolor"></rect>
        </svg>
        </div>
          <SearchBar/>
          <PageShortcuts activeScreen={this.state.contentView}/>
        </>        
    }
    else{
      topSection = 
      <>
      <div className="user-menu" onClick={this.toggleUserMenu}>
        <svg viewBox="0 0 100 80" width="40" height="40">
          <rect width="100" height="10" rx="8" fill="currentcolor"></rect>
          <rect y="30" width="100" height="10" rx="8" fill="currentcolor"></rect>
          <rect y="60" width="100" height="10" rx="8" fill="currentcolor"></rect>
        </svg>
      </div>
      <SearchBar username={this.userName}/>
      <PageShortcuts activeScreen={this.state.contentView}/>
    </>
    }
    return (
      <div className="page-container" onClick={this.morepaginators}>
        {
          this.state.userMenuVisible?<UserMenu username={this.userName} showMenu={"show"} toggleMenu={() => this.toggleUserMenu()} />:<></>
        }

        {topSection}
          <AppContent setname={this.setUserName} ref={this.appContentRef} contentScreen={this.state.contentView} itemType={getParameterByName('itemType')} itemID={getParameterByName('itemID')} updateTitle={(title) => this.updateTitle(title)}/>
          <FooterComponent />
      </div>
    );
  }
}

export default App;
