function query(pool, sql) {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, conn) => {
      if (err) {
        reject(err);
      } else {
        conn.on("error", (err) => {
          conn.release();
          reject(err);
        });

        conn.query(sql, (err, results) => {
          conn.release();
          if (err) {
            reject(err);
          }

          resolve(results);
        });
      }
    });
  });
}

module.exports = query;
