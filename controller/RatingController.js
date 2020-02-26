const db = require('../database')


const getRatingById = async(req, res, next)=>{
    const id = req.params.id
    const [rows] = await db.query('select * from rating where id = ?', [id])
    if(rows.length > 0){
        res.json({
            "success" : true,
            "rating" : rows[0]
        })
    }else{
        res.status(404)
        const error = new Error("Rating not found")
        next(error)
    }
}

const getPostRating = async(req, res, next)=>{
    const id_post = req.params.id_post
    const [result] = await db.query('select postRating from post where id = ?', [id_post])
    if(result.length > 0){
        res.json({
            "success" : true,
            "message" : result
        })
    }else{
        res.status(404)
        const error = new Error("User not found")
        next(error)
    }
}

const ratePost = (req, res, next)=>{
    const rating = req.body.rating
    const id_post = req.params.id_post
    if(rating <= 5 && rating >= 0){
        db.query('insert into rating(rating, id_post) values(?, ?)', [rating, id_post])
        .then(()=>{
            res.json({
                "success" : true,
                "message" : "post rated!"
            })
        })
        .catch((err)=>{
            next(err)
        })
    }else{
        res.status(409)
        const error = new Error("Rating is between 1 to 5")
        next(error)
    }
}

const changeRating = (req, res, next)=>{
    const rating = req.body.rating
    const id_post = req.params.id_post
    if(rating <= 5 && rating >= 0){
        db.query('update rating set rating = ? where id_post = ?', [rating, id_post])
            .then(()=>{
                res.json({
                    "success" : true,
                    "message" : "rating updated"
                })
            })
            .catch(()=>{
                res.status(404)
                const error = new Error("post not found")
                next(error)
            })
    }else{
        res.status(409)
        const error = new Error("Rating is between 1 to 5")
        next(error)
    }
}

const totalPostRating = async (req, res, next)=>{
    const id_post = req.params.id_post
    const [totalRating] = await db.query('select AVG(rating) as ratings from rating where id_post = ?', [id_post])
    db.query('update post set postRating = ? where id = ?', [totalRating[0].ratings, id_post])
        .then(()=>{
            res.json({
                "success" : true,
                "message" : "Rating updated"
            })
        })
        .catch(()=>{
            res.status(404)
            const error = new Error("Post not found")
            next(error)
        })
}

const deleteRating = (req, res, next)=>{
    const id_post = req.params.id_post
    db.query('delete from rating where id_post = ?', [id_post])
    .then(()=>{
        res.json({
            "success" : true,
            "message" : "delete success"
        })
    })
    .catch((err)=>{
        next(err)
    })
}

const ratingController = {
    ratePost,
    changeRating,
    totalPostRating,
    deleteRating,
    getRatingById,
    getPostRating
}

module.exports = ratingController