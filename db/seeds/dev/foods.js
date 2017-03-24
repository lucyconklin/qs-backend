
exports.seed = function(knex, Promise) {
  return knex.raw('TRUNCATE foods RESTART IDENTITY')
    .then(() => {
      return Promise.all([
        knex.raw(
          'INSERT INTO foods (name, calories, created_at) VALUES (?,?,?)',
          ["hot ham water", 100, new Date]
        ),
        knex.raw(
          'INSERT INTO foods (name, calories, created_at) VALUES (?,?,?)',
          ["corn balls", 50, new Date]
        ),
        knex.raw(
          'INSERT INTO foods (name, calories, created_at) VALUES (?,?,?)',
          ["frozen banana", 150, new Date]
        )
      ])
    });
};
