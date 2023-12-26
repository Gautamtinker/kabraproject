class ApiFeature {
    constructor(query, value) {
        this.query = query;
        this.value = value;
    }

    search() {
        const keyword = this.value.keyword ? {
            name: {
                $regex: this.value.keyword,
                $options: "i",
            },
        } : {};


        this.query = this.query.find({ ...keyword });

        return this;
    }

    filter() {
        const filterQuery = { ...this.value };

        const remove = ["keyword", "page", "limit"];

        remove.forEach(ele => {
            delete filterQuery[ele]
        });

        let queryStr = JSON.stringify(filterQuery);

        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, key => `$${key}`);

        this.query = this.query.find(JSON.parse(queryStr));

        return this;
    }

    pagination(resPerPage){
        const currentPage = this.value.page || 1;

        const skip = resPerPage * (currentPage - 1);

        this.query = this.query.limit(resPerPage).skip(skip);

        return this;

    }

}

export default ApiFeature;