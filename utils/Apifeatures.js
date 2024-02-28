class Apifeatures{
    constructor(query,queryStr){
        this.query=query,
        this.queryStr=queryStr
    }

    search(){
        const keyword=this.queryStr.keyword ? {
            name:{
                $regex:this.queryStr.keyword,
                $options:"i",
            }
        }:{}
        this.query=this.query.find({...keyword})
        return this
    }

    filter(){
        const queryCopy={...this.queryStr}
        // console.log(queryCopy)
        // Removing fiels for cetogry
        const removeFiels=["keyword","page","limit"];

        removeFiels.forEach((ele,index)=>{
            delete queryCopy[ele]
        })

        // Filter for price

        let queryStr=JSON.stringify(queryCopy)
        queryStr=queryStr.replace(/\b(gt|gte|lt|lte)\b/g,key=> `$${key}`)

        // console.log(queryCopy)

        this.query=this.query.find(JSON.parse(queryStr))

        // console.log(queryStr)
        return this
    }


    pagination(resultperpage){
        const currentPage=Number(this.queryStr.page) || 1;

        const skip=resultperpage*(currentPage-1)

        this.query=this.query.limit(resultperpage).skip(skip)

        return this
    }


}


module.exports=Apifeatures