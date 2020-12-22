const express = require("express");
const app = express();
const path = require('path')
const bodyParser = require('body-parser')
const paypal = require('paypal-rest-sdk')
const mongo = require('./public/js/mongo')
const userSchema = require('./public/js/schemas/user-schema')

let var_arr = ['Refresh the browser to see your events!']

//configure paypal api
paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': 'Abx9eip8NMYAbzTDvwsZXwR8ZN1hxrHZiv6sycHpCKQoJjCpw_2Ph_KJ6yEmPgow5iSV-qnTAuPBlmbZ',
  'client_secret': 'EMsblehmrYEl_knQMXqqtlfpYPUshBZrMsdUjv4ifXHQIqyAX47WOzXzp4JUwIlJlI3wzHZKaZ7hctRt'
});


app.set("view engine", "ejs");
// middleware and static files
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, 'public')))
app.engine('html', require('ejs').renderFile)
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

// routes for each page. index page

app.get("/", (req, res) => {
  // 2nd way.ejs view engine.
  res.render("index", { title: "Home" });
});

// Dummy page or future tutoring page

app.get("/tutor", (req, res) => {
  // 2nd way.ejs view engine.
  res.render("tutor", { title: "Tutor", });
});

// Nadias Page for Google Calendar 

app.get("/calendar", (req, res) => {
  res.render("calendar", { title: "Calendar" });
});


app.post('/', (req, res) =>{
  const tkn = req.body.token;
  const fs = require('fs');
  // const readline = require('readline');
  const {google} = require('googleapis');
  
  // If modifying these scopes, delete token.json.
  const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
  // The file token.json stores the user's access and refresh tokens, and is
  // created automatically when the authorization flow completes for the first
  // time.
  const TOKEN_PATH = 'token.json';
  
  // Load client secrets from a local file.
  fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Calendar API.
    authorize(JSON.parse(content), listEvents);
  });
  
  /**
   * Create an OAuth2 client with the given credentials, and then execute the
   * given callback function.
   * @param {Object} credentials The authorization client credentials.
   * @param {function} callback The callback to call with the authorized client.
   */
  function authorize(credentials, callback) {
    const {client_secret, client_id, redirect_uris} = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);
  
    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
      if (err) return getAccessToken(oAuth2Client, callback);
      oAuth2Client.setCredentials(JSON.parse(token));
      callback(oAuth2Client);
    });
  }
  
  /**
   * Get and store new token after prompting for user authorization, and then
   * execute the given callback with the authorized OAuth2 client.
   * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
   * @param {getEventsCallback} callback The callback for the authorized client.
   */
  function getAccessToken(oAuth2Client, callback) {
      oAuth2Client.getToken(tkn, (err, token) => {
        if (err) return console.error('Error retrieving access token', err);
        oAuth2Client.setCredentials(token);
        // Store the token to disk for later program executions
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
          if (err) return console.error(err);
          console.log('Token stored to', TOKEN_PATH);
        });
        callback(oAuth2Client);
      });
  }
    
  
  
  /**
   * Lists the next 10 events on the user's primary calendar.
   * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
   */
  function listEvents (auth) {
      async function fun() {
    const calendar = await google.calendar({version: 'v3', auth});
    calendar.events.list({
      calendarId: 'primary',
      timeMin: (new Date()).toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    }, (err, res) => {
      if (err) return console.log('The API returned an error: ' + err);
      const events = res.data.items;
      if (events.length) {
        console.log('Upcoming 10 events:');
        events.map((event, i) => {
            var_arr.push(event)  
        });
      } else {
        console.log('No upcoming events found.');
      }
    });
  }
  
  fun()
  }
      res.send(var_arr)
      res.render('index',{ title: "Calendar" })
  });
  
  app.post('/events', (req, res)=>{
      const {google} = require('googleapis')
      const {OAuth2} = google.auth
      const oAuth2Client = new OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET)
  
      oAuth2Client.setCredentials({
          refresh_token:process.env.REFRESH_TOKEN
      })
  
      const calendar = google.calendar({version: 'v3', auth: oAuth2Client})
     const eventStartTime = new Date()
      eventStartTime.setDate(eventStartTime.getDay() + 2)
  
      const eventEndTime = new Date()
      eventEndTime.setDate(eventEndTime.getDay() + 2)
      eventEndTime.setMinutes(eventEndTime.getMinutes()+ 60)
  
      const event = {
          summary: `${req.body.summary}`,
          location: '8040 Strawberry Ln, New_York, NC 28277',
          description: `${req.body.description}`,
          start:{
            dateTime: eventStartTime, 
            timeZone: 'America/New_York',
          },
          end:{
            dateTime: eventEndTime,
            timeZone: 'America/New_York',
          },
          colorId: 3,
        
        }
        calendar.freebusy.query({
          resource:{
            timeMin: eventStartTime,
            timeMax: eventEndTime,
            timeZone: 'America/New_York',
            items:[{id: 'primary'}],
          },
        }, 
        (err, res) => {
          if(err) 
          return console.error('Free Busy Query Error:', err)
          
          const eventsArr = res.data.calendars.primary.busy
        
          if(eventsArr.length === 0) 
          return calendar.events.insert(
              {calendarId: 'primary', resource: event}, 
          err => {
            if (err) return console.error('Calendar Event Creation Error:',err)
        return console.log('Calendar Event Created')
        
          })
          return console.log(`Hey, I'm Busy`)
        })
        
        console.log(req.body)
      const sgMail = require('@sendgrid/mail')
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    const msg = {
      to: req.body.to, // Change to your recipient
      from: 'nadiaoberry@gmail.com', 
      subject: req.body.summary,
      text: req.body.description,
      html: req.body.description,
    }
    sgMail
      .send(msg)
      .then(() => {
        console.log('Email sent')
      })
      .catch((error) => {
        console.error(error)
      })
      res.render('events')
  })

  app.get("/events", (req, res) => {
    res.render("events");
  });
  


// Jareds page for donation and Paypal. 

app.get("/donate", (req, res) => {
  res.render("donate", { title: "Donate" });
});

//post method for paypal
app.post('/pay', (req, res) => {

  const create_payment_json = {
      "intent": "sale",
      "payer": {
          "payment_method": "paypal"
      },
      "redirect_urls": {
          "return_url": "http://localhost:3025/success",
          "cancel_url": "http://localhost:3025/fail"
      },
      "transactions": [{
          "item_list": {
              "items": [{
                  "name": "Donation",
                  "sku": "item",
                  "price": "5.00",
                  "currency": "USD",
                  "quantity": 1
              }]
          },
          "amount": {
              "currency": "USD",
              "total": "5.00"
          },
          "description": "$5 Donation to How-Was-School"
      }]
  };

  paypal.payment.create(create_payment_json, function (error, payment) {
      if (error) {
          throw error;
      } else {
          for(let i = 0; i < payment.links.length; i++){
              if(payment.links[i].rel === 'approval_url')
              res.redirect(payment.links[i].href)

          }
      }
  });
  
})

//success/fail for paypal
app.get('/success', (req, res) => {


  const payerId = req.query.PayerID

  const paymentId = req.query.paymentId

  const execute_payment_json = {
      "payer_id": payerId,
      'transactions': [{
          "amount" : {
              "currency": "USD",
              "total": "5.00"
          }
          
      }]
  }

  paypal.payment.execute(paymentId, execute_payment_json, (error, payment) => {
      if(error) {
          console.log(error.response)
          throw error
      } else {
          console.log('Get Payment Response')
          console.log(JSON.stringify(payment))
          res.render('success')
      }
  })
  app.get("/success", (req, res) => {
    res.render("success", {title: "Success"})
  })
})

app.get('/fail', (req, res) => res.send('Donation Failed! Please Try Again.'))

//post method for signup
app.post('/tutor', (req, res) => {

  const connectToMongoDB = async () => {
    await mongo().then(async (mongoose) => {
      try{
        console.log('connected to mongo db')
  
        const user = {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          subject: req.body.subject,
          description: req.body.description,
        }
  
        await new userSchema(user).save()
      }finally{
        mongoose.connection.close()
      }
    })
  }
  
  connectToMongoDB()
})




//404 page  needs to go to the bottom. must use status(404).
app.use((req, res) => {
  // first way
  // res.status(404).sendFilesendFile('./views/404.html', { root: __dirname})
  res.status(404).render("404", { title: "404" });
});

// ports page

app.listen(3025, () =>{
  console.log(`I'm listening from port 3025`)
})
