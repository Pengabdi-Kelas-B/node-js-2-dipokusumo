const DB = require('../models');
const ResponseHelper = require('../utils/response');

class AuthorController  {

  static async getAll(req, res) {
    try {
      const items = await DB.Author.find().populate({ path: 'books', select: 'title description' });

      return ResponseHelper.success(res, items);
    } catch (error) {
      return ResponseHelper.error(res, error.message);
    }
  }

  static async getById(req, res) {
    try {
      const items = await DB.Author.findById(req.params.id).populate({ path: 'books', select: 'title description' })

      return ResponseHelper.success(res, items);
    } catch (error) {
      return ResponseHelper.error(res, error.message);
    }
  }

  static async create(req, res) {
    try {
      const items = await DB.Author.create(req.body);
      
      return ResponseHelper.success(res, items);
    } catch (error) {
      return ResponseHelper.error(res, error.message);
    }
  }

  static async update(req, res) {
    try {
        if (!req.params.id) {
            return ResponseHelper.error(res, 'ID not provided!', 400);
        }

        const existingAuthor = await DB.Author.findById(req.params.id);

        if (!existingAuthor) {
            return ResponseHelper.error(res, 'Author not found!', 404);
        }

        const oldBooks = existingAuthor.books;

        const updatedAuthor = await DB.Author.findByIdAndUpdate(req.params.id, req.body, { new: true, useFindAndModify: false });

        if (req.body.books) {
            const removedBooks = oldBooks.filter(book => !req.body.books.includes(book.toString()));
            if (removedBooks.length > 0) {
                await DB.Book.updateMany(
                    { _id: { $in: removedBooks } },
                    { $set: { authorId: null } }
                );
            }

            const newBooks = req.body.books.filter(book => !oldBooks.includes(book));
            if (newBooks.length > 0) {
                await DB.Book.updateMany(
                    { _id: { $in: newBooks } },
                    { $set: { authorId: updatedAuthor._id } }
                );
            }
        }

        return ResponseHelper.success(res, updatedAuthor);
    } catch (error) {
        return ResponseHelper.error(res, error.message);
    }
  }

  static async delete(req, res) {
    try {
        if (!req.params.id) {
            return ResponseHelper.error(res, 'ID not provided!', 400);
        }

        const items = await DB.Author.findById(req.params.id);

        if (!items) {
            return ResponseHelper.error(res, 'Author not found!', 404);
        }

        await DB.Book.updateMany(
            { authorId: items._id },
            { $set: { authorId: null } }
        );

        await items.deleteOne();

        return ResponseHelper.success(res, items);
    } catch (error) {
        return ResponseHelper.error(res, error.message);
    }
  }

  static async uploadImage(req, res) {
    try {
      
      if(!req.body.id) {
        return ResponseHelper.error(res, 'ID not provided!', 400);
      }

      const item = await DB.Author.findById(req.body.id);

      item.photoUrl = req.body.photoUrl

      await item.save()

      return ResponseHelper.success(res, item);
    } catch (error) {
      return ResponseHelper.error(res, error.message);
    }
  }
}

module.exports = AuthorController