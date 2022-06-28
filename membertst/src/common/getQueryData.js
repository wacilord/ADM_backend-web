var getItem = {
    getItem(pageName) {
        try{
            var json = JSON.parse(window.sessionStorage.getItem("queryData"));
            return json[pageName];
      }catch(e)
      {
          return {};
      }
    },
}
var getQueryData = function() {
    return getItem;
  };
export { getQueryData };

