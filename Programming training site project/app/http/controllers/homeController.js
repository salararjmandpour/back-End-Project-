const controller = require('app/http/controllers/controller');


//>---------------------- the class extends of bind module

class homeController extends controller {
    index(req, res) {
        res.render('home/index');
        // res.json(req.user);
    }
    
}

//>---------------------- module export

module.exports = new homeController();