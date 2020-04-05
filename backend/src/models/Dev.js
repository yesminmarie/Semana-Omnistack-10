const mongoose = require('mongoose');
const PointSchema = require('./utils/PointsSchema')

const DevSchema = new mongoose.Schema({
    name: String,
    github_username: String,
    bio: String,
    avatar_url: String,
    techs: [String],
    location: {
        type: PointSchema,
        index: '2dsphere'
    }
});

//Dev é o nome que vai ser salvo no banco de dados
module.exports = mongoose.model('Dev', DevSchema);