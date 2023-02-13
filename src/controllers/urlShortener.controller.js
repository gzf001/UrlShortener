const prisma = require("../services/prisma");

const nanoid = require('nanoid');

async function createShort(req, res) {

    const longUrl = req.body.longUrl;

    if (!longUrl.includes("http://") && !longUrl.includes("https://")) {
        
        res.status(400).send("URL larga no válida. Debe tener presente prefijo http://");
    }

    const id = nanoid.nanoid(6).toLowerCase();

    const domain = process.env.DOMAIN;

    const shortUrl = `${domain}/${id}`;

    let parameter = {
        longUrl: req.body.longUrl,
        shortUrl: shortUrl
    }

    _ = await prisma.create(parameter);

    res.status(200).send(shortUrl);
}

async function recoveryLong(req, res) {

    const {shortUrl} = req.params;

    let resultObject = await prisma.recoveryLong(shortUrl)

    if(resultObject.success){

        return res.status(200).send(resultObject.longUrl);
    }
    
    res.status(404).send(resultObject.message);
}
  
module.exports = {
    createShort,
    recoveryLong
};