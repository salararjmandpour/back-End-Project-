const controller = require('app/http/controllers/controller');


//>---------------------- the class extends of bind module

class courseController extends controller {
    index(req, res) {
        
        res.render('admin/course/index',{title:"دوره ها"});
    }

    create(req, res) {
        
        res.render('admin/course/create');
    }
    
}

//>---------------------- module export

module.exports = new courseController();