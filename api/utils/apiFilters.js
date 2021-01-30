class APIFilters {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    filter() {
        const queryCopy = {...this.queryStr}

        // Removing fields from the query
        const removeFields = ['sort'];
        removeFields.forEach(element => delete queryCopy[element]);

        // Advanced filter using: lt(<), lte(<=), gt(>), gte(>=)
        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }

    sort() {
        if(this.queryStr.sort) {
            // Handling sorting multiple values
            const sortBy = this.queryStr.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        } else {
            // If sort is not specify ps. to inverse sort put - infron (-sid)
            this.query = this.query.sort('sid');
        }

        return this
    }
}

module.exports = APIFilters;