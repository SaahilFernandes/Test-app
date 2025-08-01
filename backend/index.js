const express = require('express');
const cors = require('cors');

const feedbackRoutes = require('./routes/feedback');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/feedback', feedbackRoutes);
app.use('/auth', authRoutes);

app.get('/', async (req, res) => {
  res.send("replace 5000 in url with 5173");
 });
 

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
