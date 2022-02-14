/*COMMENT*/
import {serve} from '../libs/serve.mjs'
serve(...["child","kill","log"])
console.log(process.pid)
