const express = require('express');
const app = express();
const port = 5000;
const connectDb = require('./db');
const Users = require('./models/User');
const Voters = require('./models/Voter');
const cors = require('cors');

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// cors middleware
app.use(cors(
    {
        origin:"*"
    }
));


app.post('/register', async(req,res)=>{
    const {name, email, voterId, age, gender, address } = req.body;
    if (!name || !email || !age || !gender || !address){
        res.status(401).json({error:"all data required"});
    }

    const alreadyUser = await Users.findOne({email})

    if (alreadyUser){
        return res.status(409).json({error:"User already exists"});
    }
    const userId = Math.floor(100000 + Math.random() * 900000);
    const newUser = new Users({name, email, voterId, age, gender, address, voterId:userId });
    await newUser.save();
    res.status(201).json({message: "new user created", newUser});
});

app.get('/users', async (req,res)=>{
    const users = await Users.find({});
    res.json(users);
});

app.get('/user-id/:id', async (req,res)=>{
    const {id} = req.params;
    const user = await Users.findById(id);

    if (!user){
        return res.status(404).json({error: "User not found"});
    }
    res.json(user);
});

app.get('/user-email/:email', async (req,res)=>{
    const {email} = req.params;
    const user = await Users.findOne({email});
     
    if (!user){
        return res.status(404).json({error: "User not found"});
    }
    res.json(user);
});

app.patch('/users/:id', async (req,res)=>{
    const {id} = req.params;
    const users = await Users.findByIdAndUpdate(id, req.body, {new: true});

    if (!users){
        return res.status(404).json({message: "User not found"});
    }
    res.json(users);
});

app.delete('/user/:id', async (req,res)=>{
    const {id} = req.params;
    const users = await Users.findByIdAndDelete(id);

    if (!users){
        res.status(404).json({message: "User not found"});
    }
    res.json({message: "User deleted successfully"});
}); 



// TO BE ABLE TO CAST A VOTE******
//    {
//     "voterId":"454207",
//     "politicalParty":"apc"
//    }

app.post('/vote', async (req, res) => {
    const {voterId, politicalParty} = req.body;
    const user = await Users.findOne({voterId});

    if (!user){
        return res.status(404).json({message: "you can not vote here"});
    }

    if (user.hasVote){
        return res.status(409).json({message: "you have already voted"});
    }

    const vote = new Voters({
        voter : user._id,
        politicalParty,

    })

    if(politicalParty === "apc"){
        vote.apcVoteCount += 1
    }

    if(politicalParty === "pdp"){
        vote.pdpVoteCount += 1
    }

    user.hasVote = true;
    await user.save();
    const userVote = await vote.save();
    res.json({message: "your vote has been counted", userVote});
});

app.get('/total-vote', async (req, res) => {
    const totalVotes = await Voters.find().countDocuments()
    res.json({totalVotes});

});

app.get('/apc-VoteCount', async (req, res) => {
    const apcVoteCount = await Voters.find({politicalParty: 'apc'}).countDocuments()
    res.json({apcVoteCount});
});

app.get('/pdp-voteCount', async (req, res) => {
    const pdpVoteCount = await Voters.find({politicalParty: 'pdp'}).countDocuments()
    res.json({pdpVoteCount});
});



app.listen(port, ()=>{
    connectDb();
    console.log(`Server is running on http://localhost:${port}`);
});