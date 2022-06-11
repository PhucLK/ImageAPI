import express from 'express'

const logging = (
    req: express.Request,
    res: express.Response,
    next: Function
): void => {
    const filename = req.query.filename
    const width = req.query.width
    const height = req.query.height
    console.log('New request')
    console.log('FileName : ' + filename)
    console.log('Width : ' + width)
    console.log('Height : ' + height)
    if (filename && width && height) {
        next()
    } else {
        console.log('Request was rejected ')
        res.send('Your request URL is not correct !')
    }
}

export default logging
