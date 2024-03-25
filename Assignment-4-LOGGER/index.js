import express from 'express'
import https from 'https'
import fs from 'fs'
import cors from 'cors'
import 'dotenv/config'
import axios from 'axios'
import { DateTime } from 'luxon'
import { getLoggerInstance } from './logger.js'

const logger = getLoggerInstance('HTTPSServer')
const app = express()

app.use((req, res, next) => {
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || "N/A"
    logger.info('Received a request', { ipAddress })
    next()
})

const httpsOptions = {
    key: fs.readFileSync('./ssl/key.key'),
    cert: fs.readFileSync('./ssl/cert.pem')
}

const server = https.createServer(httpsOptions, app)

app.use(cors())
app.use(express.json())
app.post('/settings', async (req, res) => {
    try {
        const githubResponse = await axios.get('https://api.github.com/repos/Mousse789/CS548/contents/github_settings.json', {
            headers: {
                'Authorization': `Bearer ${process.env.GITHUB_API_TOKEN}`
            }
        })

        const githubContent = Buffer.from(githubResponse.data.content, 'base64').toString('utf-8')
        const settings = JSON.parse(githubContent)
        const address = settings.storeAddressModel.address
        const hasGroceryDelivery = settings.storeAddressModel.storeRewards.hasGroceryDelivery
        const tailoredResponse = {
            city: address.city,
            state: address.state,
            zipcode: address.zipcode,
            datetime: DateTime.now().setZone('local').toISO(),
            ipAddress: req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || "N/A",
            location: `${address.city}, ${address.state}`,
            hasGroceryDelivery: hasGroceryDelivery
        }

        logger.info('Tailored settings response sent', {
            datetime: tailoredResponse.datetime,
            ipAddress: tailoredResponse.ipAddress,
            response: tailoredResponse,
            function: 'settingsEndpoint'
        })

        res.json(tailoredResponse)
    } catch (error) {
        logger.error('Error in /settings endpoint', {
            error: error.toString(),
            datetime: new Date().toISOString(),
            ipAddress: req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || "N/A",
            function: 'settingsEndpoint'
        })
        res.status(500).json({ error: 'Failed to send data and fetch GitHub settings' })
    }
})

server.listen(8080, () => {
    logger.info('Server is up and running')
})