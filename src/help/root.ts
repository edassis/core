import stripAnsi = require('strip-ansi')

import {compact} from '../util'
import * as Interfaces from '../interfaces'
import {HelpFormatter} from './formatter'

export default class RootHelp extends HelpFormatter {
  constructor(public config: Interfaces.Config, public opts: Interfaces.HelpOptions) {
    super(config, opts)
  }

  root(): string {
    let description = this.config.pjson.oclif.description || this.config.pjson.description || ''
    description = this.render(description)
    description = description.split('\n')[0]
    let output = compact([
      description,
      this.version(),
      this.usage(),
      this.description(),
    ]).join('\n\n')
    if (this.opts.stripAnsi) output = stripAnsi(output)
    return output
  }

  protected usage(): string {
    return this.section(this.opts.usageHeader || 'UTILIZACAO', this.wrap(`$ ${this.config.bin} [COMANDO]`))
  }

  protected description(): string | undefined {
    let description = this.config.pjson.oclif.description || this.config.pjson.description || ''
    description = this.render(description)
    description = description.split('\n').slice(1).join('\n')
    if (!description) return
    return this.section('DESCRICAO', this.wrap(description))
  }

  protected version(): string {
    return this.section('VERSAO', this.wrap(this.config.userAgent))
  }
}
