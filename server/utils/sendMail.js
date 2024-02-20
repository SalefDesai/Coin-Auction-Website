// "use strict";
// const nodemailer = require("nodemailer");
import nodemailer from 'nodemailer';
import cron from 'node-cron';
import Coin from '../models/coin.js';
import User from '../models/user.js';

export const sendMail = (to,subject,text,html) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        // port: 465,
        // secure: true,
        auth: {
          user: process.env.MAIL_ID,
          pass: process.env.MAIL_PASSWORD,
        },
      });
      
      const mailOptions = {
          from: {
              name:"Salef Desai",
              address : process.env.MAIL_ID
          }, 
          to: to, 
          subject: subject, 
          text: text,
          html: html,
      };
      
      
      // how to send attacthments, add this below html
      // {
      //     filename:'test.pdf',
      //     path: path.join(__dirname,'test.pdf'),
      //     contentType: 'application/pdf'
      // }
      
      const send = async(transporter,mailOptions) => {
          try {
              const info = await transporter.sendMail(mailOptions);
      
            //   console.log("mail send, id is : ", info.messageId)
          } catch (error) {
              console.log("error in sending mail : ", error);
          }
      }

      send(transporter,mailOptions);
}




cron.schedule('0 */1 * * *', async() => {
    console.log("running ...............");

    const events = await Coin.find(
        { "auctionStartDateAndTime": { $gte: new Date() ,$lte: new Date(Date.now() + 2 * 60 * 60 * 1000) } },
        {name:true,description:true,material:true,auctionStartDateAndTime:true,auctionDuration:true,initialPrice:true,participants:true}
      );
    console.log("events : ",events)

    
    events.map( async(element) => {
      if (element.participants.length !== 0 ) {

        element.participants.map( async (userId) => {

          const userData = await User.findById(userId,{email:true,name:true,_id:false});

          console.log(userData);

          const text = `Dear ${userData.name},

          This is a reminder that the auction for the following coin will start in one hour:
          
          Coin Name: ${element.name}
          Description: ${element.description}
          Start Time: ${element.auctionStartDateAndTime}
          Duration: ${element.auctionDuration}
          Material: ${element.material}
          Starting Bid: ${element.initialPrice}
          
          We look forward to your participation in the auction!
          
          Best regards,
          Coin Auction Website Team
          `; 

          const html = `<!DOCTYPE html>
          <html>
          <head>
              <title>Reminder: Auction Starts in One Hour</title>
              <style>
                  body {
                      font-family: Arial, sans-serif;
                      margin: 0;
                      padding: 0;
                      background-color: #f4f4f4;
                  }
          
                  .container {
                      max-width: 600px;
                      margin: 0 auto;
                      padding: 20px;
                      background-color: #ffffff;
                      border-radius: 5px;
                      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                  }
          
                  h1 {
                      color: #333333;
                  }
          
                  p {
                      color: #555555;
                      margin-bottom: 10px;
                  }
          
                  ul {
                      list-style-type: none;
                      padding: 0;
                  }
          
                  li {
                      margin-bottom: 5px;
                  }
          
                  .footer {
                      margin-top: 20px;
                      text-align: center;
                      color: #999999;
                  }
              </style>
          </head>
          <body>
              <div class="container">
                  <h1>Reminder: Auction Starts in One Hour</h1>
                  <p>Dear ${userData.name},</p>
                  <p>This is a reminder that the auction for the following coin will start in one hour:</p>
                  <ul>
                    <li><strong>Name:</strong> ${element.name}</li>
                    <li><strong>Description:</strong> ${element.description}</li>
                    <li><strong>Start Time:</strong> ${element.auctionStartDateAndTime}</li>
                    <li><strong>Duration:</strong> ${element.auctionDuration}</li>
                    <li><strong>Material:</strong> ${element.material}</li>
                    <li><strong>Starting Bid:</strong> ${element.initialPrice}</li>
                  </ul>
                  <p>We look forward to your participation in the auction!</p>
                  <p class="footer">Best regards,<br/>Coin Auction Website Team</p>
              </div>
          </body>
          </html>
          `;

          sendMail(userData.email,'Reminder: Auction Starts in One Hour',text,html)

          
        })

        const updatedCoin = await Coin.findByIdAndUpdate(
          { _id: element._id },
          { $set: { participants: [] } },
          { new: true }
        );

      } 
    })

})
