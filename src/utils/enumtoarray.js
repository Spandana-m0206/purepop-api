exports.enumToArray = (enumObj)=>{
    return Object.keys(enumObj).map((key) => enumObj[key]);
}