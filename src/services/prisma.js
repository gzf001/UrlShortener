const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function create(parameter){

    const today = new Date();

    await prisma.urlModel.create({
        data:{
            longUrl: parameter.longUrl,
            shortUrl: parameter.shortUrl,
            delete: false
        }
     });
}

async function recoveryLong(shortUrl){

    shortUrl = `${process.env.DOMAIN}/${shortUrl}`

    let urlObj = await prisma.urlModel.findFirst({
        where: {
          shortUrl: shortUrl,
          delete: false,
        }
    });

    let resultObj = {
        success: false,
        longUrl: '',
        message: ''
    }

    if(urlObj === null){

        resultObj.message = 'URL corta no existe';

        return resultObj;
    }
    
    resultObj.success = true;
    resultObj.longUrl = urlObj.longUrl;

    return resultObj;
}

module.exports = {
    create,
    recoveryLong
};