const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function create(parameter){

    const today = new Date();

    await prisma.urlModel.create({
        data:{
            longUrl: parameter.longUrl,
            shortUrl: parameter.shortUrl,
            delete: false,
            deletedAt: null
        }
     });
}

async function recoveryLong(_shortUrl){

    shortUrl = `${process.env.DOMAIN}/${_shortUrl}`

    const urlObj = await prisma.urlModel.findFirst({
        where: {
          shortUrl: shortUrl,
          delete: false,
        }
    });

    const resultObj = {
            id: null,
            success: false,
            longUrl: '',
            message: ''
    }

    if(urlObj === null){

        resultObj.message = 'URL corta no existe';

        return resultObj;
    }

    resultObj.id = urlObj.id,
    resultObj.success = true;
    resultObj.longUrl = urlObj.longUrl;

    console.log(resultObj);

    return resultObj;
}

async function deleteByShort(_shortUrl){

    const resultObj = await recoveryLong(_shortUrl);
    
    if(!resultObj.success){

        return resultObj;
    }
    
    shortUrl = `${process.env.DOMAIN}/${_shortUrl}`

    const urlObj = await prisma.urlModel.update({
        where: {
            id: resultObj.id
        },
        data: {
            delete: true,
            deletedAt: new Date()
        }
    });

    resultObj.success = urlObj != null;
    resultObj.longUrl = urlObj.longUrl;
    resultObj.message = urlObj == null? 'Error al actualizar objeto' : '1 documento actualizado';

    return resultObj;
}

async function deleteByLong(_longUrl){

    const urlObj = await prisma.urlModel.updateMany({
        where: {
            longUrl: _longUrl,
            delete: false
        },
        data: {
            delete: true,
            deletedAt: new Date()
        }
    });

    const resultObj = {
        id: null,
        success: true,
        longUrl: '',
        message: `${urlObj.count} documento(s) actualizado(s)`
    }

    return resultObj;
}

module.exports = {
    create,
    recoveryLong,
    deleteByShort,
    deleteByLong
};