const controller = require('app/http/controllers/controller');


//>---------------------- the class extends of bind module

class adminController extends controller {
    index(req, res) {
        
        res.render('admin/index');
    }
    
}

//>---------------------- module export

module.exports = new adminController();