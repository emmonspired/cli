import { wrapCommand } from '../utils/wrapCommand'
import { Decentraland } from '../lib/Decentraland'
import { Analytics } from '../utils/analytics'
import { success, notice } from '../utils/logging'
import opn = require('opn')

export function command(vorpal: any) {
  vorpal
    .command('link')
    .description('Link scene to Ethereum.')
    .option('-p, --port <number>', 'Linker app server port (default is 4044).')
    .action(
      wrapCommand(async function(args: any, callback: () => void) {
        const dcl = new Decentraland()

        dcl.on('link:ready', async url => {
          await Analytics.sceneLink()
          vorpal.log(notice('Linking app ready.'))
          vorpal.log(`Please proceed to ${url}`)
          opn(url)
        })

        dcl.on('link:success', async () => {
          await Analytics.sceneLinkSuccess()
          vorpal.log(success('Project successfully linked to the blockchain'))
        })

        await dcl.link(args.port)
      })
    )
}
