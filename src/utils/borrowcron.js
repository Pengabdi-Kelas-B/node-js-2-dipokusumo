const cron = require('node-cron');
const DB = require('../models');

cron.schedule('*/1 * * * *', async () => {
  console.log('Memperbarui status peminjaman dan menghitung denda...');

  try {
    const borrows = await DB.Borrowing.find({ status: { $in: ['ACTIVE', 'OVERDUE'] } });

    const currentDate = new Date();

    for (let borrow of borrows) {
      const dueDate = new Date(borrow.dueDate);

      if (currentDate > dueDate) {
        const diffTime = currentDate - dueDate;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        borrow.lateFee = diffDays * 3000;

        if (borrow.returnDate) {
          borrow.status = 'RETURNED';
        } else {
          borrow.status = 'OVERDUE';
        }

        await borrow.save();
      }
    }

    console.log('Status peminjaman dan denda berhasil diperbarui.');
  } catch (error) {
    console.error('Gagal memperbarui status peminjaman dan menghitung denda:', error);
  }
});

module.exports = cron;