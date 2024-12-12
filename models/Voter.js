const mongoose = require('mongoose');


const votersSchema = new mongoose.Schema({

    voter: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    politicalParty: {
        type: String,
        required: true
    },
    apcVoteCount: {
        type: Number,
        default:0
    },
    pdpVoteCount: {
        type: Number,
        default:0,
    }
    
},
{
    timestamps: true
}
);


const Voters = mongoose.model('Voter', votersSchema);

module.exports = Voters;
    
