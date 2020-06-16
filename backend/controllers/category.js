const Category = require('../models/category');
const slugify = require('slugify');

exports.create = (req, res) => {
  const { name } = req.body;
  const slug = slugify(name).toLowerCase();
  const category = new Category({ name, slug });
  category.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error: `Category ${name} already exist!`
      })
    }
    res.json({
      data: data,
      message: `Category ${name} created successfully!`
    });
  });
}

exports.list = (req, res) => {
  Category.find({}).exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: 'There is some error while fetching the category list!'
      })
    }
    res.json(data);
  })
}

exports.read = (req, res) => {
  const slug = req.params.slug.toLowerCase();

  Category.findOne({ slug }).exec((err, category) => {
    if (err) {
      return res.status(400).json({
        error: 'There is some error while fetching the category!'
      })
    }
    res.json(data);
  })
}

exports.remove = (req, res) => {
  const slug = req.params.slug.toLowerCase();

  Category.findOneAndRemove({ slug }).exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: 'There is some error while deleting the category!'
      })
    }
    res.json({
      message: `Category ${slug} deleted successfully!`
    });
  })
}
