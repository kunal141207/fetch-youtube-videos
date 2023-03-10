const videoModel = require("./video.model").model;

class videoHelper {
    /**
     * getLogObject Get video object
     * @param  {String} videoTitle
     * @param  {Number} limit
     * @param  {Number} skip
     * @return {Object} log object
     */
    async getVideos(videoTitle = "", limit = 10, skip = 0) {
        try {
            const search = " ";
            const replacer = new RegExp(search, 'g')
            const sSearch = videoTitle.replace(replacer, ")(?=.*");
            const regex = new RegExp(`^(?=.*` + sSearch + ").*$");
            console.log("regex", regex)
            return await videoModel.find({
                $or: [
                    { 'title': { $regex: regex } },
                    { 'decription': { $regex: regex } },
                ]
            }).sort({ "published_at": -1 }).skip(skip).limit(limit).exec() || []
        }
        catch (err) {
            console.log('err in getVideos', err)
            throw err
        }
    }

    /**
     * getLogObject Get log object
     * @param  {Array} docArr
     * @return {Object} 
     */
    async populateVideos(docArr) {
        try {
            console.log("populating videos to db")
            if (docArr.length > 0) {
                return await videoModel.insertMany(docArr)
            }
        }
        catch (err) {
            console.log("err in populateVideos", err)
        }
    }

    /**
     * getLatestpublishedAt
     * @return {String} 
     */
    async getLatestpublishedAt() {
        try {
            const latestVideo = await videoModel.find().sort({ "published_at": -1 }).limit(1).exec()
            return latestVideo[0]["published_at"]
        }
        catch (err) {
            console.log("err in getLatestpublishedAt", err)
        }
    }
}

module.exports = new videoHelper()