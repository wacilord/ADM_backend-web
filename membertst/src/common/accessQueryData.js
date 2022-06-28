let queryKey = "queryKey";
let accessQueryData = {
  getQueryObject() {
    let queryString = sessionStorage.getItem(queryKey);
    if (queryString == null) {
      let queryObject = {};
      queryString = JSON.stringify(queryObject);
      sessionStorage.setItem(queryKey, queryString);
      return queryObject;
    } else {
      let queryObject = JSON.parse(queryString);
      return queryObject;
    }
  },
  setQueryObject(queryObject) {
    let queryString = JSON.stringify(queryObject);
    sessionStorage.setItem(queryKey, queryString);
  },
  setQueryData(key, parameters) {
    let queryObject = this.getQueryObject();
    queryObject[key] = parameters;
    this.setQueryObject(queryObject);
  },
  getQueryData(key) {
    let queryObject = this.getQueryObject();
    if (queryObject.hasOwnProperty(key)) {
      return queryObject[key];
    }
    return null;
  },
  getParameters(key, defaultObject) {
    // console.log('key', key);
    // console.log('obj', defaultObject)

    let obj = this.getQueryData(key);
    if (obj == null) {
      return defaultObject;
    }
    return obj;
  }
};

export { accessQueryData };
