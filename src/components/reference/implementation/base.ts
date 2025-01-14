import { Implementation } from "../implementation"

import * as Crypto from "../../../components/crypto/implementation.js"
import * as Manners from "../../../components/manners/implementation.js"
import * as Storage from "../../../components/storage/implementation.js"

import * as CIDLogRepo from "../../../repositories/cid-log.js"
import * as UcansRepo from "../../../repositories/ucans.js"

import * as DOH from "../dns-over-https.js"


// 🧩


export type Dependencies = {
  crypto: Crypto.Implementation
  manners: Manners.Implementation
  storage: Storage.Implementation
}



// 🛳


export async function implementation(dependencies: Dependencies): Promise<Implementation> {
  return {
    dataRoot: {
      domain: () => { throw new Error("Not implemented") },
      lookup: () => { throw new Error("Not implemented") },
      update: () => { throw new Error("Not implemented") }
    },
    didRoot: {
      lookup: () => { throw new Error("Not implemented") }
    },
    dns: {
      lookupDnsLink: DOH.lookupDnsLink,
      lookupTxtRecord: DOH.lookupTxtRecord,
    },
    repositories: {
      cidLog: await CIDLogRepo.create({ storage: dependencies.storage }),
      ucans: await UcansRepo.create({ storage: dependencies.storage })
    },
  }
}