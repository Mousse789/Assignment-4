import { IP2LOCATION_API_KEY } from "../settings.js"
import axios from "axios"
import fs from 'fs'
import { getLoggerInstance } from "../logger.js"

const logger = getLoggerInstance('StoreDetailsService')

export const getStoreDetails = async (userIp) => {
    logger.info('Entering getStoreDetails', { functionName: 'getStoreDetails', location: './getStoreDetails.js' })

    try {
        const ip2locationUrl = `https://api.ip2location.io/?key=${IP2LOCATION_API_KEY}&ip=${userIp}`
        const response = await axios.get(ip2locationUrl)
        const settingsJson = fs.readFileSync('./github_settings.json', 'utf8')
        const settings = JSON.parse(settingsJson)
        const addressInfo = settings.storeAddressModel.address

        logger.info('Fetched store address details', { meta: { addressInfo } })

        return { ...response.data, addressInfo }
    } catch (error) {
        logger.error(`Error fetching location details: ${error}`)
        throw error
    }
}