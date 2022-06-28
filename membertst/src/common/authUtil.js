let acl = "dbAcl";
let authUtil = {
  isAuth(vue, funCode) {

    let acls = sessionStorage.getItem(acl);
    if (acls == null) {
      vue.$router.push({ path: "/Hello" });
      return false;
    }

    let aclList = JSON.parse(acls);
    let isFind = aclList.find(function (item) {
      return item.toLowerCase() === funCode;
    });



    if (undefined === isFind) {
      vue.$router.push({ path: "/Hello" });
      return false;
    }

    return true;

  },
};

export { authUtil };