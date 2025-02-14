/**
 * A wrapper around process.stdout and process.stderr that allows us to mock out the streams for testing.
 */
class Stream {
  public constructor(public channel: 'stdout' | 'stderr') {}

  public get isTTY(): boolean {
    return process[this.channel].isTTY
  }

  public getWindowSize(): number[] {
    return process[this.channel].getWindowSize()
  }

  public write(data: string): boolean {
    return process[this.channel].write(data)
  }

  public read(): boolean {
    return process[this.channel].read()
  }

  public on(event: string, listener: (...args: any[]) => void): Stream {
    process[this.channel].on(event, listener)
    return this
  }

  public once(event: string, listener: (...args: any[]) => void): Stream {
    process[this.channel].once(event, listener)
    return this
  }

  public emit(event: string, ...args: any[]): boolean {
    return process[this.channel].emit(event, ...args)
  }
}

export const stdout = new Stream('stdout')
export const stderr = new Stream('stderr')
