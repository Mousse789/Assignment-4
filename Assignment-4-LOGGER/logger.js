import winston, {format, transports} from "winston"
import {DateTime} from 'luxon'

const customLogFormat = format.printf(info => {
    const { level, message, timestamp, service, ipAddress, ...meta } = info
    const functionName = meta.functionName || ''
    const location = meta.location || ''
    const companyName = 'Safeway'
    const customMessage = meta.customMessage || ''
  
    let msg = `${DateTime.now().setZone('local').toFormat('yyyy-LL-dd HH:mm:ss')} | ${level} | ${service} | ${ipAddress} | ${functionName} | ${location} | ${companyName} | ${customMessage} | ${message}`;
  
    if (Object.keys(meta).length) {
      msg += ` | ${JSON.stringify(meta)}`
    }
  
    return msg
  })

export const getLoggerInstance = (serviceName = 'GeneralService', ipAddress = 'N/A') => {
    return winston.createLogger({
        level: 'info',
        format: format.combine(
            format.timestamp(),
            customLogFormat
        ),
        defaultMeta: { service: serviceName, ipAddress },
        transports: [
            new transports.Console(),
        ],
    })
}
