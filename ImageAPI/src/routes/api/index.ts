import express from 'express'
import sharp from 'sharp'
import fs from 'fs'
import NodeCache from 'node-cache'
import logging from '../logging/index'

const image = express.Router()
const imageCache = new NodeCache({ stdTTL: 18 })
const outputFolder = 'images/thumb'
const inputFolder = 'images/full'
const extension = '.jpg'
const STEP_NUMBER = 3

image.get('/images', logging, (req, res) => {
    const url = req.url
    const filename = req.query.filename
    const width = req.query.width
    const height = req.query.height
    //if already exist cache then get image from memory, otherwire create new cache
    if (imageCache.has(url)) {
        res.sendFile(imageCache.get(url)!)
    } else {
        resizeImage(filename as string, width as string, height as string)
            .then((data) => {
                setTimeout(() => {
                    imageCache.set(url, data)
                    res.sendFile(data)
                }, 1000)
            })
            .catch((err) => {
                console.log(err)
                res.send(err)
            })
    }
})

const resizeImage = (
    filename: string,
    width_: string,
    height_: string
): Promise<string> => {
    const width = parseInt(width_)
    const height = parseInt(height_)
    const arrPath = __dirname.split('\\')
    const relativeDirPath = arrPath
        .slice(0, arrPath.length - STEP_NUMBER)
        .join('\\')
    const originImagePath = `${relativeDirPath}\\${inputFolder}\\${filename}${extension}`
    const outputImagePath = `${relativeDirPath}\\${outputFolder}\\${filename}${extension}`

    return new Promise((resolve, reject) => {
        if (isNaN(width) || isNaN(height)) {
            reject('Invalid height/width parameters')
        }
        else {
            fs.access(originImagePath, (err) => {
                if (err) {
                    reject('Invalid original file names')
                } else {
                    //if exit image then clone new one ,resize new image and move to folder
                    sharp(originImagePath)
                        .resize({ height: height, width: width })
                        .toFile(outputImagePath)
                        .then(() => {
                            resolve(outputImagePath)
                        })
                        .catch(function (err) {
                            reject(err)
                        })
                }
            })
        }
    })
}

export default { image, resizeImage }
