const controller = require('app/http/controllers/controller');
const Course = require('app/models/course');

//>---------------------- the class extends of bind module

class courseController extends controller {
    index(req, res) {

        res.render('admin/course/index', { title: "دوره ها" });
    }

    create(req, res) {

        res.render('admin/course/create');
    }

    async store(req, res) {


        let status = await this.validationData(req);
        if (status) {
            return this.back(req, res);
        }


        

            const images = req.body.images;
            const { title, body, type, price, tags } = req.body;

            const newCourse = new Course({
                user: req.user._id,
                title,
                slug: this.slug(title),
                body,
                type,
                images,
                price,
                tags,
            });

            await newCourse.save();

            return res.redirect('/admin/course');

        
    }


    slug(title) {
        return title.replace(/([^0-9آ-یa-z0-9]|-)+/g, "-");
    }

}

//>---------------------- module export

module.exports = new courseController();