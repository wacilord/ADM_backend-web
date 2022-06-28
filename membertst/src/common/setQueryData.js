
var setItem = {
    setItem(pageName,val) {
        try{
            var json = JSON.parse(window.sessionStorage.getItem("queryData"));
            json[pageName]=val;
            window.sessionStorage.setItem("queryData",JSON.stringify(json))
      }catch(e)
      {
        var json = {};
        json[pageName]=val;
        window.sessionStorage.setItem("queryData",JSON.stringify(json));    
      }
    },
}
var setQueryData = function() {
    return setItem;
  };
export { setQueryData };
  