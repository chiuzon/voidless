import { derived, Readable, writable } from 'svelte/store'
import { providers, utils } from 'ethers'


const createENSStore = (provider: Readable<providers.BaseProvider>, address: Readable<string>, defaultValue?: string, format?: (ensOrAddress: string) => string) => {

    const ens = derived([provider, address], ([$provider, $address], set) => {
        if (!utils.isAddress($address)) {
            set(format !== undefined ? format($address) : $address)
            return;
        }

        $provider.lookupAddress($address).then((ensName) => {
            set(format !== undefined ? format(ensName as string) : ensName as string)
        }).catch((err) => {
            if ((window as any)['voidless_debug']) {
                console.error(err)
            }

            set(format !== undefined ? format($address) : $address)
        })
    }, defaultValue || "")

    return ens
}

export default createENSStore