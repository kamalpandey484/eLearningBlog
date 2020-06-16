const Blog = require('../models/blog');
const Category = require('../models/category');
const Tag = require('../models/tag');
const formidable = require('formidable');
const slugify = require('slugify');
const stripHtml = require('string-strip-html');
const _ = require('lodash');
const fs = require('fs');

exports.create = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if(err) {
      return res.status(400).json({
        error: 'Image could not upload!'
      })
    }

    const { title, body, categories, tags } = fields;

    if (!title || !title.length) {
      return res.status(400).json({
          error: 'title is required!'
      });
    }

    if (!body || body.length < 200) {
        return res.status(400).json({
            error: 'Content is too short!'
        });
    }

    if (!categories || categories.length === 0) {
        return res.status(400).json({
            error: 'At least one category is required!'
        });
    }

    if (!tags || tags.length === 0) {
        return res.status(400).json({
            error: 'At least one tag is required!'
        });
    }

    let blog = new Blog();
    blog.title = title;
    blog.body = body;
    blog.slug = slugify(title).toLowerCase();
    blog.excerpt = stripHtml(body.substring(0, 320)).concat('...');
    blog.metaTitle = `${title} | ${process.env.SITE}`;
    blog.metaDesc = stripHtml(body.substring(0, 160));
    blog.postedBy = req.user._id;

    const arrayOfCategories = categories && categories.split(',');
    const arrayOfTags = tags && tags.split(',');


    if(files.photo) {
      if(files.photo.size > 1000000) {
        return res.status(400).json({
          error: 'Image should be less then 1mb in size!'
        })
      }
      blog.photo.data = fs.readFileSync(files.photo.path);
      blog.photo.contentType = files.photo.type;
    }

    blog.save((err, result) => {
      if(err) {
        return res.status(400).json({
          error: 'Post with this title already exist!'
        })
      }
      // res.json(result);
      Blog.findByIdAndUpdate(result._id, {$push: {categories: arrayOfCategories}}, {new: true}).exec((err, result) => {
        if(err) {
          return res.status(400).json({
            error: 'There is some error with categories while adding this blog post!'
          })
        } else {
          Blog.findByIdAndUpdate(result._id, {$push: {tags: arrayOfTags}}, {new: true}).exec((err, result) => {
            if(err) {
              return res.status(400).json({
                error: 'There is some error with tags while adding this blog post!'
              })
            } else {
              res.json({
                data: result,
                message: `Blog ${title} created successfully!`
              });
            }
          })
        }
      });
    })
  })
}

exports.list = (req, res) => {
  Blog.find({})
    .populate('categories', '_id name slug')
    .populate('tags', '_id name slug')
    .populate('postedBy', '_id name username')
    .select('_id title slug excerpt categories tags postedBy createdAt updatedAt')
    .exec((err, data) => {
      if(err) {
        return res.status(400).json({
          error: 'Error while fetching all blogs'
        })
      }
      res.json(data);
    })
}

exports.listAllBlogsWithCategoriesAndTags = (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : 10;
  const skip = req.query.skip ? parseInt(req.query.skip) : 0;

  let blogs;
  let categories;
  let tags;

  Blog.find({})
    .populate('categories', '_id name slug')
    .populate('tags', '_id name slug')
    .populate('postedBy', '_id name username profile')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .select('_id title slug excerpt categories tags postedBy createdAt updatedAt')
    .exec(async(err, data) => {
      if(err) {
        return await res.status(400).json({
          error: 'Error while fetching blogs'
        })
      }
      blogs = data;
      Category.find({})
        .exec(async(err, category)=>{
          if(err) {
            return await res.status(400).json({
              error: 'Error while fetching Categories'
            })
          }
          categories = category;
          Tag.find({})
            .exec(async(err, tag)=>{
              if(err) {
                return await res.status(400).json({
                  error: 'Error while fetching Categories'
                })
              }
              tags = tag;
              res.json({
                blogs,
                categories,
                tags,
                size: blogs.length,
              })
            })
        })
    })
}


exports.read = (req, res) => {
  const slug = req.params.slug.toLowerCase();
  Blog.findOne({ slug }) 
    .populate('categories', '_id name slug')
    .populate('tags', '_id name slug')
    .populate('postedBy', '_id name username profile')
    .select('_id title body slug metaTitle, metaDesc categories tags postedBy createdAt updatedAt')
    .exec((err, data)=>{
      if(err) {
        return res.status(400).json({
          error: 'Error while fetching Categories'
        })
      }
      res.json(data);
    })
}


exports.remove = (req, res) => {
  const slug = req.params.slug.toLowerCase();
  Blog.findOneAndRemove({ slug })
    .exec((err, data) => {
      if(err) {
        return res.status(400).json({
          error: 'Error while fetching Categories'
        })
      }
      res.json({
        message: "Blog deleted successfully!"
      });
    })
}

exports.update = (req, res) => {
  const slug = req.params.slug.toLowerCase();

  Blog.findOne({ slug }).exec((err, oldBlog) => {
      if (err) {
          return res.status(400).json({
              error: 'Error updating the blog.'
          });
      }

      let form = new formidable.IncomingForm();
      form.keepExtensions = true;

      form.parse(req, (err, fields, files) => {
          if (err) {
              return res.status(400).json({
                  error: 'Image could not upload'
              });
          }

          let slugBeforeMerge = oldBlog.slug;
          oldBlog = _.merge(oldBlog, fields);
          oldBlog.slug = slugBeforeMerge;

          const { body, desc, categories, tags } = fields;

          if (body) {
              oldBlog.excerpt = smartTrim(body, 320, ' ', ' ...');
              oldBlog.desc = stripHtml(body.substring(0, 160));
          }

          if (categories) {
              oldBlog.categories = categories.split(',');
          }

          if (tags) {
              oldBlog.tags = tags.split(',');
          }

          if (files.photo) {
              if (files.photo.size > 10000000) {
                  return res.status(400).json({
                      error: 'Image should be less then 1mb in size'
                  });
              }
              oldBlog.photo.data = fs.readFileSync(files.photo.path);
              oldBlog.photo.contentType = files.photo.type;
          }

          oldBlog.save((err, result) => {
              if (err) {
                  return res.status(400).json({
                      error: 'Error updating the blog.'
                  });
              }
              // result.photo = undefined;
              res.json(result);
          });
      });
  });
};

exports.photo = (req, res) => {
  const slug = req.params.slug.toLowerCase();
  Blog.findOne({slug})
    .select('photo')
    .exec((err, result) => {
      if(err || !result) {
        return res.status(400).json({
          error: 'Error fetching images.'
        })
      }
      res.set('Content-type', result.photo.contentType);
      return res.send(result.photo.data);
    })
}

exports.listRelatedBlogs = ( req, res ) => {
  console.log('req.body', req.body);
  const limit = 3;
  const {_id, categories} = req.body;
  Blog.find({_id: {$ne: _id}, categories: {$in: categories}})
    .limit(limit)
    .populate('postedBy', '_id name profile')
    .select('title slug excerpt postedBy createdAt updatedAt')
    .exec(async(err, blog) => {
      if (err) {
        return await res.status(400).json({
            error: 'Blogs not found.'
        });
      }
      res.json(blog);
    })

}
