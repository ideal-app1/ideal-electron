fs = require('fs');


/*
    This class represent a Block of code in CodeLink
 */
class Block {
    #Observers = []
    #BlockRef = ""
    #Code = ""
    static #ListRef = []

    /**
     * Give the constructor the path of the code
     * to load in order to generate a CodeLink's block
     * @param Path to load
     */
    constructor(Path) {
        this.generateUniqueRef()
        this.getBlockCode(Path);

    }

    /**
     * Generate an unique an unique identifier for the Block
     * Add the reference to a list of unique references
     */
    generateUniqueRef() {
        do {
            this.#BlockRef = (Math.random() * 1000000000).toString()
        } while (Block.#ListRef.find(value => value === this.#BlockRef) !== undefined)
        Block.#ListRef.push(this.#BlockRef)
    }

    /**
     * Get the related code information thanks to the Path
     * @param Path to load
     */
    getBlockCode(Path) {
        fs.readFile(Path, 'utf8',  (err,data) => {
            if (err) {
                //Handle error... to implement.
            }
            const parsed = JSON.parse(data)

            this.#Code = parsed.code;

        });
    }

    /**
     * Get the Block's ref
     * @returns the Block's ref
     */
    getRef() {
        return this.#BlockRef
    }

    /**
     * Get the Block's code
     * @returns the Block code
     */
    getCode() {
        return this.#Code
    }

    /**
     * Add an observer
     * @param newObserver
     */
    addObservers(newObserver) {
        this.#Observers.push(newObserver);
    }

    /**
     * Call this function when the Block is updating
     */
    onUpdate() {
        this.#Observers.forEach(Observer => {
            Observer.update(this);
        })
    }
}

