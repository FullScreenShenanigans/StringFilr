interface IStringFilrSettings {
    library: any;
    normal?: string;
    requireNormalKey?: boolean;
}

/**
 * A general utility for retrieving data from an Object based on nested class
 * names. You can think of the internal "library" Object as a tree structure,
 * such that you can pass in a listing (in any order) of the path to data for 
 * retrieval.
 * 
 * @author "Josh Goldberg" <josh@fullscreenmario.com>
 */
class StringFilr {
    // The library of data.
    private library: any;

    // Listing of previously found lookups, for speed"s sake.
    private cache: any;

    // Optional default class to use when no suitable option is found.
    private normal: string;

    // Whether to crash when a sub-object in reset has no normal child.
    private requireNormalKey: boolean;

    /**
     * Resets the StringFilr.
     * 
     * @constructor
     * @param {Object} library   An Object containing data stored as children
     *                           of sub-Objects.
     * @param {String} [normal]   A String to use as a default key to recurse 
     *                            on. Defaults to undefined, so falsy.
     * @param {Boolean} [requireNormalKey]   Whether it"s ok for the library to 
     *                                   have Objects that don"t contain the
     *                                   normal key. Defaults to false.
     */
    constructor(settings: IStringFilrSettings) {
        if (!settings) {
            throw new Error("No settings given to StringFilr.");
        }

        if (!settings.library) {
            throw new Error("No library given to StringFilr.");
        }
        this.library = settings.library;

        this.normal = settings.normal;
        this.requireNormalKey = settings.requireNormalKey;

        this.cache = {};

        if (this.requireNormalKey) {
            if (typeof this.normal === "undefined") {
                throw new Error("StringFilr is given requireNormalKey, but no normal class.");
            }

            this.ensureLibraryNormal();
        }
    }

    /**
     * @return {Object} The base library of stored information.
     */
    getLibrary(): any {
        return this.library;
    }

    /**
     * @return {Object} The complete cache of cached output.
     */
    getCache(): any {
        return this.cache;
    }

    /**
     * Completely clears the cache Object.  
     */
    clearCache(): void {
        this.cache = {};
    }

    /**
     * Clears the cached entry for a key.
     * 
     * @param {String} key
     */
    clearCached(key: string): void {
        if (this.normal) {
            key = key.replace(this.normal, "");
        }

        delete this.cache[key];
    }

    /**
     * Retrieves the deepest matching data in the library for a key. 
     * 
     * @param {String} key
     * @return {Mixed}
     */
    get(key: string): any {
        var result: any;

        if (this.normal) {
            key = key.replace(this.normal, "");
        }

        // Quickly return a cached result if it exists
        if (this.cache.hasOwnProperty(key)) {
            return this.cache[key];
        }

        // Since no existed, it must be found deep within the library
        result = this.followClass(key.split(/\s+/g), this.library);

        this.cache[key] = result;
        return result;
    }

    /**
     * Utility helper to recursively check for tree branches in the library 
     * that don"t have a key equal to the normal. For each sub-directory that
     * is caught, the path to it is added to output.
     * 
     * @param {Object} current   The current location being searched within
     *                           the library.
     * @param {String} path   The current path within the library.
     * @param {String[]} output   An Array of the String paths to parts that
     *                           don"t have a matching key.
     * @return {String[]} output
     */
    findLackingNormal(current: any, path: string, output: string[]): string[] {
        var i: string;

        if (!current.hasOwnProperty(this.normal)) {
            output.push(path);
        }

        if (typeof current[i] === "object") {
            for (i in current) {
                if (current.hasOwnProperty(i)) {
                    this.findLackingNormal(current[i], path + " " + i, output);
                }
            }
        }

        return output;
    }

    /**
     * Utility function to follow a path into the library (this is the driver 
     * for searching into the library). For each available key, if it matches
     * a key in current, it is removed from keys and recursion happens on the
     * sub-directory in current.
     * 
     * @param {String[]} keys   The currently available keys to search within.
     * @param {Object} current   The current location being searched within
     *                           the library.
     * @return {Mixed} The most deeply matched part of the library.
     */
    private followClass(keys: string[], current: any): any {
        var key: string,
            i: number;

        // If keys runs out, we"re done
        if (!keys || !keys.length) {
            return current;
        }

        // For each key in the current array...
        for (i = 0; i < keys.length; i += 1) {
            key = keys[i];

            // ...if it matches, recurse on the other keys
            if (current.hasOwnProperty(key)) {
                keys.splice(i, 1);
                return this.followClass(keys, current[key]);
            }
        }

        // If no key matched, try the normal (default)
        if (this.normal && current.hasOwnProperty(this.normal)) {
            return this.followClass(keys, current[this.normal]);
        }

        // Nothing matches anything; we"re done.
        return current;
    }

    private ensureLibraryNormal(): void {
        var caught: string[] = this.findLackingNormal(this.library, "base", []);

        if (caught.length) {
            throw new Error("Found " + caught.length + " library "
                + "sub-directories missing the normal: "
                + "\r\n  " + caught.join("\r\n  "));
        }
    }
}
