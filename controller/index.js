module.exports = {
    index:function(req,res){
        res.end(JSON.stringify({
            id:1,
            msg:'请求成功'
        }))
    }
}