const path = require('path');
const autoBind = require("auto-bind");

module.exports = class Helpers {
    
    constructor(req, res) {

        autoBind(this);
        this.req = req;
        this.res = res;
        this.formData = req.flash('formData')[0];  // set and save data user in field

    }

    getObjects() {

        return {

            auth: this.auth(),
            viewPath: this.viewPath,
            ...this.getGlobalVariables(),
            old: this.old,

        }

    }

    auth() {

        return {

            check: this.req.isAuthenticated(),
            user: this.req.user

        }

    }

    viewPath(dir) {

        return path.resolve(config.layout.view_drc + '/' + dir);

    }


    //>------------------------ show error handel
    
    getGlobalVariables() {

        return {

            errors: this.req.flash('errors'),

        }

    }

    //>---------------------- set and save data user in field

    old(field, defaultValue) {

        return this.formData && this.formData.hasOwnProperty(field) ? this.formData[field] : defaultValue;

    }


}