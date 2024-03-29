'use strict';

const util = require('util');
const fs = require('fs');
const path = require('path');

class Confenv {
    constructor() {
        // Holds the config object
        this._configPath = process.env['CONFIG_PATH'] || process.cwd();
        this._config = {};


        //this._log = logger.getLogger('config');
        // Caches the path to configs
        this._paths = [];
    }

    /*
     * Used to reload configuration which already loaded
     *
     * return void
     */
    reload() {
        //this._log.info('Reloading configs: %j', this._paths);
        this._paths.forEach((filepath) => this._read(filepath));
    }

    /*
     * Used to load configuration
     *
     * return this
     */
    read(file) {
        let filepath = this._findConfig(file);

        if (!filepath) {
            //this._log.warn('Error read config `%s`: file not found', file);
            throw new Error(util.format('Error read config `%s`: file not found', file));
        } else {
            //this._log.debug('Found config `%s` in path `%s`', file, filepath);
            // Cache the path
            this._paths.push(path.resolve(filepath, file));
            this._read(this._paths.slice(-1)[0]);
        }

        return this;
    }

    /*
     * Return the whole config object
     *
     * return config
     */
    getAll() {
        return new Object(this._config);
    }

    /*
     * Returns string from config.
     * If key points to group, returns group
     * If key not found, returns undefined
     *
     * return string|object|undefined
     */
    get(key) {
        let value = spread(this._config, key);
        if (typeof value === 'string') {
            return value;
        } else if (typeof value === 'undefined') {
            return value;
        } else {
            return Object.assign({}, value);
        }
    }

    /*
     * Returns parseInt(string) from config
     *
     * return number
     */
    getInt(key) {
        return parseInt(this.get(key));
    }

    /*
     * Returns parseFloat(string) from config
     *
     * return number
     */
    getFloat(key) {
        return parseFloat(this.get(key));
    }

    /*
     * Returns boolean presentation of string
     *
     * return boolean
     */
    getBool(key) {
        let val = this.get(key);
        if (typeof val === 'string') {
            val = val.toLowerCase();
            return (val === 'true' || !!parseInt(val) || val === 't');
        }

        return !!val;
    }

    /*
     * Returns array of strings
     * Splits string by separator. Default separator is coma
     *
     * return array
     */
    getArray(key, separator) {
        // Support for v4 version
        if (typeof separator === 'undefined') {
            separator = ',';
        }

        let string = this.get(key);
        let arr;
        if (typeof string === 'string') {
            arr = string.split(separator);
        } else if (typeof string === 'object') {
            if (Object.values) {
                arr = Object.values(string);
            } else {
                // Support for v6 version
                arr = Object.keys(string).map(function (v) {
                    return string[v];
                });
            }

        } else {
            arr = [];
        }

        return arr.map(function (v) {
            return (v && (typeof v === 'string') && v.trim()) || v;
        });
    }

    _findConfig(file) {
        let filepath = this._configPath,
            flag = true;

        // Seek config file in cwd and parent directories
        do {
            try {
                fs.accessSync(path.resolve(filepath, file), fs.F_OK);
                flag = false;
            } catch (e) {
                filepath = filepath.split(path.sep).slice(0, -1).join(path.sep);
            }
        } while (filepath.length > 0 && flag);

        return filepath;
    }

    _read(filepath) {
        let file;
        try {
            file = fs.readFileSync(filepath, {encoding: 'utf-8'});
            file = file.split('\n');
        } catch (e) {
            //this._log.error('Error read config `%s`: ', filepath, e);
            throw new Error(util.format('Error read config `%s`: %j', filepath, e));
        }

        file.reduce((config, str) => {
            // Remove comments from the end of config line
            str = str.split('#')[0].trim();

            // Check config line is not empty
            if (str.length > 0) {
                str = str.split('=');
                let key = str.shift().trim().split('.');
                let value = str.join('=').trim();

                spread(config, key, value);
            }

            return config;
        }, this._config);

        //this._log.info('Config `%s` loaded', filepath);

        return this._config;
    }
}

function spread(obj, is, value) {
    if (typeof is == 'string') {
        return spread(obj, is.split('.'), value);
    } else if (is.length == 1 && value !== undefined) {
        return obj[is[0]] = value;
    } else if (is.length == 0) {
        return obj;
    } else if (!obj[is[0]] && undefined == value) {
        return undefined;
    } else {
        return spread(obj[is[0]] || (obj[is[0]] = {}), is.slice(1), value);
    }
}

module.exports = (new Confenv());
