const News = require('../models/News');

exports.listNews = async (req, res, next) => {
  try {
    const news = await News.find()
      .populate('category', 'name description')
      .sort({ publishedDate: -1 });
    res.json({ data: news });
  } catch (err) {
    next(err);
  }
};

exports.getNews = async (req, res, next) => {
  try {
    const news = await News.findById(req.params.id)
      .populate('category', 'name description');
    if (!news) return res.status(404).json({ error: 'News not found' });
    res.json({ data: news });
  } catch (err) {
    next(err);
  }
};
