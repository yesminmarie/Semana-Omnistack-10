const Dev = require('../models/Dev')
const parseStringAsArray = require('../utils/parseStringAsArray');

module.exports = {
    async index(request, response){
        //2 filtros
        //Buscar todos devs num raio de 10Km
        //Filtrar por tecnologias
        const { latitude, longitude, techs } = request.query;

        const techsArray = parseStringAsArray(techs);
        
        const devs = await Dev.find({
            techs: {
                //$in é um operador lógico de dentro do Mongo, 
                //vai listar os devs que possuem alguma das tecnologias pesquisadas
                $in: techsArray,
            },
            location: {
                // $near consegue encontrar objetos perto de uma localização
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [longitude, latitude],
                    },
                    //distância máxima de 10Km
                    $maxDistance: 10000,
                },
            },
        });

        return response.json({ devs })
    }
}