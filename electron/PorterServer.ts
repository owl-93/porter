import {getPorts} from './PorterService'
import { Request, Response} from 'express'
import { PortData} from './PorterService'
require('dotenv').config()
const express = require('express')
const cors = require('cors')

let server = express()
server.use(cors())


server.get('/ports', (req: Request, res: Response, next: () => void) => {
    const timestamp = new Date().toISOString()
    const start = Number(req.query.start || 3000)
    const end = Number(req.query.end || 10000)
    getPorts((result?: PortData[], error?: any) => {
        if(error) {
            console.warn([`{timestamp}`],error)
            res.status(500).send(error)
        } else if(!result) {
            console.log(`[${timestamp}] no results`);
            res.sendStatus(204)
        } else {
            console.log(`[${timestamp}] found ${result.length} processes`)
            res.status(200).send(result)
        }
    }, start, end)
})

module.exports = server