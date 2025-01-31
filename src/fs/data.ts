import * as Crypto from "../components/crypto/implementation.js"

import * as DID from "../did/index.js"
import * as FileSystem from "../fs/types.js"
import * as Path from "../path/index.js"
import * as Sharing from "./share.js"

import { Branch } from "../path/index.js"


export async function addSampleData(fs: FileSystem.API): Promise<void> {
  await fs.mkdir({ directory: [ Branch.Private, "Apps" ] })
  await fs.mkdir({ directory: [ Branch.Private, "Audio" ] })
  await fs.mkdir({ directory: [ Branch.Private, "Documents" ] })
  await fs.mkdir({ directory: [ Branch.Private, "Photos" ] })
  await fs.mkdir({ directory: [ Branch.Private, "Video" ] })
  await fs.publish()
}

/**
 * Stores the public part of the exchange key in the DID format,
 * in the `/public/.well-known/exchange/DID_GOES_HERE/` directory.
 */
export async function addPublicExchangeKey(
  crypto: Crypto.Implementation,
  fs: FileSystem.API
): Promise<void> {
  const publicDid = await DID.exchange(crypto)

  await fs.mkdir(
    Path.combine(Sharing.EXCHANGE_PATH, Path.directory(publicDid))
  )
}


/**
 * Checks if the public exchange key was added in the well-known location.
 * See `addPublicExchangeKey()` for the exact details.
 */
export async function hasPublicExchangeKey(
  crypto: Crypto.Implementation,
  fs: FileSystem.API
): Promise<boolean> {
  const publicDid = await DID.exchange(crypto)

  return fs.exists(
    Path.combine(Sharing.EXCHANGE_PATH, Path.directory(publicDid))
  )
}