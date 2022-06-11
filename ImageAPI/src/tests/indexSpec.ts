import supertest from 'supertest'
import app from '../index'
import api from '../routes/api/index'

describe('Test endpoint responses', function () {
    it('gets the api/images enpoint', function (done) {
        supertest(app)
            .get('/api/images?filename=encenadaport&width=400&height=500')
            .then((result) => {
                expect(result.status).toBe(200)
            })
        done()
    })
})

describe('Image transform function should resolve or reject', function () {
    beforeAll(function () {
        console.log('beforeAll : Prepare images before start testing')
        const fse = require('fs-extra')
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 4000
        const arrPath = __dirname.split('\\')
        const relativeDirPath = arrPath.slice(0, arrPath.length - 2).join('\\')
        const srcDir = `${relativeDirPath}\\images`
        const destDir = `${relativeDirPath}\\build\\images`

        // copy images to build folder
        fse.copySync(
            srcDir,
            destDir,
            { overwrite: true },
            function (err: string) {
                if (err) {
                    console.error(err)
                }
            }
        )
    })
    it('Expect transform to not throw error', function (done) {
        expectAsync(api.resizeImage('encenadaport', '100', '100')).toBeResolved()
        done()
    })

    it('Expect transform to throw specific error', function (done) {
        expectAsync(api.resizeImage('nothing', '100', '100')).toBeRejectedWith('Invalid original file names')
        done()
    })
})
