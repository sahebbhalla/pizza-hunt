const {Comments,Pizza} = require('../models');

const commentController ={
    addComment(req,res){
        console.log(req.params);
        Comments.create(req.body)
        .then(({_id})=>{
          return Pizza.findOneAndUpdate(
            {_id:req.params.pizzaId},
            {$push :{comments:_id}},
            {new:true}
          );
        }).then(dbPizzaData=>{
            if(!dbPizzaData){
                res.status(404).json({message:'No Pizza Found'})
                return;
            }
            res.json(dbPizzaData);
        }).catch(err=>res.json(err));
    },
    removeComment({ params }, res){
        Comments.findOneAndDelete({_id:params.commentId})
        .then(deleteComment=>{
            if(!deleteComment){
                return res.status(404).json({message:'Does not exist'})
            }
            return Pizza.findOneAndUpdate(
                {_id:params.pizzaId},
                {$pull:{Comments:params.commentId}},
                {new:true}
            )
        }).then(dbPizzaData=>{
            if(!dbPizzaData){
                res.status(404).json({message:'No Pizza Found with this Id'})
                return
            }
            res.json(dbPizzaData);
        }).catch(err=>res.json(err));
    }
}
module.exports = commentController;