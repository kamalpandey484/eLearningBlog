const Tag= require('../models/tag');
const slugify = require('slugify');

exports.create = (req, res) => {
  const { name } = req.body;
  const slug = slugify(name).toLowerCase();
  const tag = new Tag({
    name,
    slug
  })
  tag.save((err, data) => {
    if(err){
      res.status(400).json({
        error: `Tag ${name} already exist!`
      })
    }
    res.json({
      data: data,
      message: `Tag ${name} created successfully!`
    });
  })
}

exports.list = (req, res) => {
  Tag.find({}).exec((err, data) => {
    if(err) {
      res.status(400).json({
        error: 'There is some error while fetching the tag list!'
      })
    }
    res.json(data);
  })
}

exports.read = (req, res) => {
  const slug = req.params.slug.toLowerCase();

  Tag.findOne({ slug }).exec((err, tag) => {
    if(err) {
      res.status(400).json({
        error: 'There is some error while fetching the tag!'
      })
    }
    res.json(tag);
  })
}

exports.remove = (req, res) => {
  const slug = req.params.slug.toLowerCase();

  Tag.findOneAndRemove({ slug }).exec((err, tag) => {
    if(err) {
      res.status(400).json({
        error: 'There is some error while deleting the tag!'
      })
    }
    res.json({
      message: `Tag ${slug} deleted successfully!`
    });
  })
}
