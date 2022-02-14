var socket = io()
import {dom, log} from '../libs/concise.mjs';

const sargs = ['child','kill','log']

dom.idGet('kill' ).addEventListener('click', () => socket.emit('kill'))
dom.idGet('serve').addEventListener('click', () => socket.emit('serve', sargs))
