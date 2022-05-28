const queryTools = {};

queryTools.createSort = (plainSort) => {
    const sortStringArray = plainSort ? plainSort.split(';') : null;
    const sort = {};
    if (sortStringArray?.length) {
        sortStringArray.forEach(sortString => {
            const key = sortString.split(':')[0];
            const value = sortString.split(':')[1] === "des" ? 1 : -1;
            sort[key] = value;
        })

    }
    return sort;
}

module.exports = queryTools;