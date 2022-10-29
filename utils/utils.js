const mergeObjectsInsideArray = (array) => {
    let generalObject = {}
    array.forEach(element => {
        generalObject = {...generalObject, ...element};
    });
    return generalObject
}

module.exports.mergeObjectsInsideArray = mergeObjectsInsideArray