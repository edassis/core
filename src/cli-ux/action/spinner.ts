import * as chalk from 'chalk'
import * as supportsColor from 'supports-color'
const stripAnsi = require('strip-ansi')
const ansiStyles = require('ansi-styles')
const ansiEscapes = require('ansi-escapes')
import {errtermwidth} from '../../screen'
import spinners from './spinners'
import {ActionBase, ActionType} from './base'

function color(s: string): string {
  if (!supportsColor) return s
  const has256 = supportsColor.stdout ? supportsColor.stdout.has256 : (process.env.TERM || '').includes('256')
  return has256 ? `\u001B[38;5;104m${s}${ansiStyles.reset.open}` : chalk.magenta(s)
}

export default class SpinnerAction extends ActionBase {
  public type: ActionType = 'spinner'

  spinner?: NodeJS.Timeout

  frames: any

  frameIndex: number

  constructor() {
    super()
    this.frames = spinners[process.platform === 'win32' ? 'line' : 'dots2'].frames
    this.frameIndex = 0
  }

  protected _start(): void {
    this._reset()
    if (this.spinner) clearInterval(this.spinner)
    this._render()
    this.spinner = setInterval(icon =>
      this._render.bind(this)(icon),
    process.platform === 'win32' ? 500 : 100,
    'spinner',
    )
    const interval = this.spinner
    interval.unref()
  }

  protected _stop(status: string): void {
    if (this.task) this.task.status = status
    if (this.spinner) clearInterval(this.spinner)
    this._render()
    this.output = undefined
  }

  protected _pause(icon?: string): void {
    if (this.spinner) clearInterval(this.spinner)
    this._reset()
    if (icon) this._render(` ${icon}`)
    this.output = undefined
  }

  protected _frame(): string {
    const frame = this.frames[this.frameIndex]
    this.frameIndex = ++this.frameIndex % this.frames.length
    return color(frame)
  }

  private _render(icon?: string) {
    const task = this.task
    if (!task) return
    this._reset()
    this._flushStdout()
    const frame = icon === 'spinner' ? ` ${this._frame()}` : icon || ''
    const status = task.status ? ` ${task.status}` : ''
    this.output = `${task.action}...${frame}${status}\n`
    this._write(this.std, this.output)
  }

  private _reset() {
    if (!this.output) return
    const lines = this._lines(this.output)
    this._write(this.std, ansiEscapes.cursorLeft + ansiEscapes.cursorUp(lines) + ansiEscapes.eraseDown)
    this.output = undefined
  }

  private _lines(s: string): number {
    return (stripAnsi(s).split('\n') as any[])
    .map(l => Math.ceil(l.length / errtermwidth))
    .reduce((c, i) => c + i, 0)
  }
}
