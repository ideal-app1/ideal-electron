/**
    An Instance of CodeLink
    This class will load an instance of CodeLink based
    on the given Widget in the constructor
 */
class CodeLink {

    #baseWidget = undefined

    /**
     * Every instance of CodeLink must be load
     * With a base Widget, give this Widget to the constructor
     */
    constructor(Widget) {
        this.#baseWidget = Widget
    }

    /** Return the base Widget of the CodeLink's instance **/
    getBaseWidget() {
        return this.#baseWidget
    }
}