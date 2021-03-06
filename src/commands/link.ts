import { wrapCommand } from '../utils/wrapCommand'
import { Decentraland } from '../lib/Decentraland'
import { Analytics } from '../utils/analytics'
import { success, notice } from '../utils/logging'
import opn = require('opn')

export interface IArguments {
  options: {
    port?: number
  }
}

export function link(vorpal: any) {
  vorpal
    .command('link')
    .description('Link scene to Ethereum.')
    .option('-p, --port <number>', 'linker app server port (default is 4044).')
    .action(
      wrapCommand(async function(args: IArguments) {
        const dcl = new Decentraland({
          linkerPort: args.options.port
        })

        dcl.on('link:ready', async url => {
          await Analytics.sceneLink()
          vorpal.log(notice('Linking app ready.'))
          vorpal.log(`Please proceed to ${url}`)
          opn(url)
        })

        dcl.on('link:success', async () => {
          await Analytics.sceneLinkSuccess()
          vorpal.log(success('Project successfully linked to the blockchain'))
          process.exit(1)
        })

        await dcl.link()
      })
    )
}
