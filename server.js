require('dotenv').config()

const express = require ('express')
const app = express()
const jwt = require('jsonwebtoken')

app.use(express.json())

const posts=[
    {
        id: 1,
        title: 'First Post',
        username: 'hannah',
        content: 'This is the first blog post!'
    }
    ,{
        id: 2,
        title: 'Second Post',
        username: 'james',
        content: 'This is the second blog post!'
    }
    ,{
        id: 3,
        title: 'Third Post',
        username: 'sarah',
        content: 'This is the third blog post!'
    }
]
app.get('/posts', authenticateToken,(req,res)=>{
    res.json(posts.filter(post=>post.username === req.user.name))
    })
app.post('/login',(req,res)=>{
    const username = req.body.username
    const user ={name:username}
    const accessToken = jwt.sign(user,process.env.ACCESS_TOKEN_SECRET)
    res.json({accessToken:accessToken})
})
function authenticateToken(req, res,next){
    const authHeader = req.headers['authorization']
    if(authHeader){
        const token = authHeader && authHeader.split(' ')[1]
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if(err){
                return res.sendStatus(403)
            }
            req.user = user
            next()
        })
    }else{
        return res.sendStatus(401)
    }
}
app.listen(3000)
