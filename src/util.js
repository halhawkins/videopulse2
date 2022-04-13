import Cookies from 'js-cookie';

export const uniqueID = () => {
    var id = "id" + Math.random().toString(16).slice(2);
    return id;
}
export const isLoggedIn = () => {
  return !! Cookies.get('active_session');
}

export const getParameterByName = (name, url = window.location.href) => {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
}

export const removePageParam = (url) => {
    let newurl="",args,newargs;
    url = url.substr(url.indexOf('?'));
    args = url.split('&');
    newargs = args.filter(item =>{
        let n = item.substr(0,2);
      if(n !== 'p=')
          return item;
    })
    newargs.forEach((item,i) =>{
        if(item.charAt(0) !== '?')
          newurl += '&' + item;
      else
          newurl += item;
    });
    return newurl;  
}