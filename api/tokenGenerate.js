const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d"
  });
}

module.exports = generateToken;



// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZDQxNDEwODk3NmQxZTk5YzY3Yzg2OCIsImlhdCI6MTcyNTE3NTQxOCwiZXhwIjoxNzI3NzY3NDE4fQ.QhZum51IlhhArkPXRQ12_tyzlyLA52hQWKrDBGhewMc
// 66d414108976d1e99c67c868