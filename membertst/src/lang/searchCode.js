
// var gameTypeNameTable = [
//     { typeCode: 1, value: "老虎机" },
//     { typeCode: 2, value: "捕鱼机" },
//     { typeCode: 3, value: "棋牌" },
//     { typeCode: 4, value: "小游戏" },
//     { typeCode: 5, value: "开房类游戏" }
// ]




var codeTransferName = {
    transGameTypeName(code) {
        var gameTypeName = JSON.parse(sessionStorage.getItem("gameTypeName"));
        let name = gameTypeName.find(res => {
            return res.typeCode == code;
        })
        return name.value;
    }
}

export { codeTransferName };
