/**
 * CRON SYSTEM
 * 
 * pass a round each day
 * 
 */

const cron = require('node-cron');
import { PatternHandler } from '../patterns/index.patterns';
cron.schedule('0 0 0 * * *', () => {
    PatternHandler.pass()
}, {
    timezone : "Europe/Paris"
})