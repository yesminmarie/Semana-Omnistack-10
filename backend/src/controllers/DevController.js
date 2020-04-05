const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');
const { findConnections, sendMessage } = require('../websocket');

module.exports = {
    async index(request, response){
        //lista os desenvolvedores
        const devs = await Dev.find();

        return response.json(devs);
    },

    async store(request, response) {
        //essas informações vem de dentro do corpo da requisição
        const  { github_username, techs, latitude, longitude } = request.body;
        
        let dev = await Dev.findOne( { github_username });

        if (!dev) {
            //busca o usuário do github
            const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);

            //pega apenas name, avatar e bio do github
            //no github, o nome não é obrigatório, então se o nome não existir, pode-se usar o usuário de login (name = login)
            const { name = login, avatar_url, bio } = apiResponse.data;

            //chama a função que está dentro de utils/parseStringAsArray, que vai transformar a String em Array
            const techsArray = parseStringAsArray(techs);

            const location = {
                type: 'Point',
                coordinates: [longitude, latitude],
            };

            dev = await Dev.create({
                github_username,
                name,
                avatar_url,
                bio,
                techs: techsArray,
                location,
            })

            //Filtrar as conexões que estão há no máximo 10Km de distância
            // e que o novo dev tenha pelo menos uma das tecnologias filtradas

            const sendSocketMessageTo = findConnections(
                { latitude, longitude },
                techsArray,
            )
            
            sendMessage(sendSocketMessageTo, 'new-dev', dev);
            //console.log(sendSocketMessageTo);
        }
        
        return response.json(dev);
    }
};