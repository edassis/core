import {expect} from 'chai'
import {Config} from '../../src'
import {userInfo as osUserInfo} from 'node:os'
import {sep} from 'node:path'

const getShell = () => osUserInfo().shell?.split(sep)?.pop() || 'unknown'

describe('config shell', () => {
  it('has a default shell', () => {
    const config = new Config({root: '/tmp'})
    // @ts-ignore
    expect(config._shell()).to.equal(getShell(), `SHELL: ${process.env.SHELL} COMSPEC: ${process.env.COMSPEC}`)
  })
})
