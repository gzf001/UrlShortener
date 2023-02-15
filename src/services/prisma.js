const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function create(parameter){

    try{
    
        await prisma.urlModel.create({
            data:{
                longUrl: parameter.longUrl,
                shortUrl: parameter.shortUrl,
                delete: false,
                deletedAt: null
            }
        });
    }
    catch(ex){
        console.log(ex);
        //Reintento BD espejo
    }
}

async function recoveryLong(_shortUrl){

    try{

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
    catch(ex){

        //Reintento BD espejo
    }
}

async function deleteByShort(_shortUrl){

    try{

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
    catch(ex){

        //Reintento BD espejo
    }
}

async function deleteByLong(_longUrl){

    try{
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
    catch(ex){

        //Reintento BD espejo
    }
}

async function recordStatistics(parameter){

    try{
    
        await prisma.statisticsModel.create({
            data:{
                longUrl: parameter.longUrl,
                shortUrl: parameter.shortUrl,
                success: parameter.success
            }
        });
    }
    catch(ex){

        console.log(ex);
        //Reintento BD espejo
    }
}

module.exports = {
    create,
    recoveryLong,
    deleteByShort,
    deleteByLong,
    recordStatistics
};