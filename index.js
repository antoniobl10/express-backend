const express = require('express');

const { createClient } = require('@supabase/supabase-js');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

const allowedOrigins = [
  'http://localhost:4321',
  'https://finanzassalvajes.com',
];

app.use(cors({
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

// using morgan for logs
app.use(morgan('combined'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const supabaseUrl = 'https://jwvvkwfuqwijyjsmydkw.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3dnZrd2Z1cXdpanlqc215ZGt3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDg1OTU1ODksImV4cCI6MjAyNDE3MTU4OX0.rAGPkg9UPcadPtAnuvMt-xr3zgPz9H_RxGIP3cbD1TA'
const supabase = createClient(supabaseUrl, supabaseKey)

app.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    })
    if (error) {
      res.send(error.message);
    } else {
      res.send({ email: email, accesToken: data.session.access_token });
    }
  } catch (err) {
    res.send(err);
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })
    if (error) {
      res.send(error.message);
    } else {
      res.send({ email: email, accesToken: data.session.access_token });
    }
  } catch (err) {
    res.send(err);
  }
});

app.get('/promociones', async (req, res) => {
  const { data, error } = await supabase
    .from('promociones')
    .select()
  res.send(data);
});

app.get('/promociones/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('promociones')
    .select()
    .eq('id', req.params.id);
  if (data === null) {
    res.send("No promocion found with id: " + req.params.id + "!!)");
  }
  res.send(data);
});

app.post('/promociones', async (req, res) => {
  const { error } = await supabase
    .from('promociones')
    .insert(req.body)
  if (error) {
    res.send(error);
  }
  res.send("created!!");
});

app.put('/promociones/:id', async (req, res) => {
  const { error } = await supabase
    .from('promociones')
    .update(req.body)
    .eq('id', req.params.id)
  if (error) {
    res.send(error);
  }
  res.send("updated " + req.params.id + "!!)");
});

app.patch('/promociones/:id', async (req, res) => {
  const { error } = await supabase
    .from('promociones')
    .update(req.body)
    .eq('id', req.params.id)
  if (error) {
    res.send(error);
  }
  res.send("updated " + req.params.id + "!!)");
});

app.delete('/promociones/:id', async (req, res) => {
  const { error } = await supabase
    .from('promociones')
    .delete()
    .eq('id', req.params.id)
  if (error) {
    res.send(error);
  }
  res.send("deleted " + req.params.id + "!!)")
});

app.get('/', (req, res) => {
  res.send(`Hello, world! ${port}`);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});