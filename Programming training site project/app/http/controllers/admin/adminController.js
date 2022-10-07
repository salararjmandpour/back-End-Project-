const controller = require('app/http/controllers/controller');

//>---------------------- the class extends of bind module

class adminController extends controller {
    index(req, res) {
        res.json("Dashboard Page");
    }
    course(req, res) {
        res.json("Admin Course");
    }
}

//>---------------------- module export

module.exports = new adminController();