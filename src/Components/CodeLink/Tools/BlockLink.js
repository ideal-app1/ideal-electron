/**
 * This class represent a Link from a block to another
 */

class BlockLink {
    #LinkRef = ""
    static #ListRef = []
    #Links = []

    constructor() {
        this.generateUniqueRef()
    }

    /**
     * Generate an unique an unique identifier for the Block
     * Add the reference to a list of unique references
     */
    generateUniqueRef() {
        do {
            this.#LinkRef = (Math.random() * 1000000000).toString()
        } while (BlockLink.#ListRef.find(value => value === this.#LinkRef) !== undefined)
        BlockLink.#ListRef.push(this.#LinkRef)
    }

    /**
     * Add a new Link to the Block
     * @param newLink
     */
    addALink(newLink) {
        if (this.#Links.find(Link => Link.valueOf() === newLink.valueOf()) !== undefined)
            return
        this.#Links.push(newLink)
    }

    /**
     * Remove a Link from the Block
     * @param toRemove
     */
    removeALink(toRemove) {
        this.#Links = this.#Links.filter(Link => Link.valueOf() === toRemove.valueOf())
    }

    /**
     * Override valueOf so it's easy to compare
     * @returns {string}
     */
    valueOf() {
        return this.#LinkRef
    }
}