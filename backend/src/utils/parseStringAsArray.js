//converte String de tecnologias em Array
module.exports = function parseStringAsArray(arrayAsString){
    //transforma arrayAsString, que é string, em array (separando onde tiver vírgula)
    //depois percorre esse array tirando os espaços antes e depois de cada item (tech.trim())
    return arrayAsString.split(',').map(tech => tech.trim())
}