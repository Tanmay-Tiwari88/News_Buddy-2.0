const mongoose = require('mongoose');



const ArticleUrlSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true

    },

    source: {
        type: String,
        required: true

    },
    description: {
        type: String,
        required: true
    }
});




const CreatDocument = async (AlbumName, urlin, titlein, sourcein, descriptionin) => {
    try {
        mongoose.pluralize(null);
        const CatArticle = new mongoose.model(AlbumName, ArticleUrlSchema);
        const catArticle = new CatArticle({
            url: urlin,
            title: titlein,
            source: sourcein,
            description: descriptionin
        })
        const result = await catArticle.save();


    } catch (err) {
        console.log(err);
    }
}

const getDocument = async (AlbumName) => {
    try {

        mongoose.pluralize(null);
        const CatArticle = new mongoose.model(AlbumName, ArticleUrlSchema);
        const catArticle = await CatArticle.find({}, {}, {
            lean: true
        });

        return catArticle;
    } catch (err) {
        console.log(err);
    }
}

const deletDocument = async (AlbumName, urlin) => {
    mongoose.pluralize(null);
    const CatArticle = new mongoose.model(AlbumName, ArticleUrlSchema);

    const catArticle = await CatArticle.deleteOne({
        url: urlin
    }, (err) => {
        if (err) console.log(err);
        else console.log("Deletion Succesull");
    });

}

const getCount = async (AlbumName) => {

    mongoose.pluralize(null);
    const CatArticle = new mongoose.model(AlbumName, ArticleUrlSchema);
    const catArticle = await CatArticle.countDocuments({}, (err, result) => {
        if (err)
            console.log(err);
        else {
            return result;
        }

    });
    return catArticle;


}

const dropCollection = (AlbumName) => {
    mongoose.connection.db.dropCollection(AlbumName, (err) => {
        if (err) console.log(err);
        else console.log("collection Deleted Succesfully");
    })
}

module.exports = {
    CreatDocument,
    getDocument,
    deletDocument,
    getCount,
    dropCollection
}