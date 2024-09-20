const express = require('express')
const router = express.Router();
const { sendMail,applyMail} = require('../controllers/sendMail');
const path = require('path');
const fs = require('fs');




router.post('/enquiry', async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;
        const adminemail = process.env.adminEmail
        const adminMessage = `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Enquiry Notification</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f4f4f4;  
              }
        
              .container {
                max-width: 600px;
                margin: 20px auto;
                padding: 20px;
                background-color: #ffffff;
                border-radius: 8px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
              }
        
              h2 {
                color: #333333;
                margin-top: 0;
              }
        
              table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 20px;
              }
        
              table,
              th,
              td {
                border: 1px solid #dddddd;
                text-align: left;
              }
        
              th,
              td {
                padding: 10px;
              }
        
              .header {
                background-color: #f9f9f9;
                padding: 20px 0;
                text-align: center;
                border-top-left-radius: 8px;
                border-top-right-radius: 8px;
              }
        
              .footer {
                background-color: #f9f9f9;
                padding: 20px;
                text-align: center;
                border-bottom-left-radius: 8px;
                border-bottom-right-radius: 8px;
              }
        
              .footer p {
                color: #666666;
                font-size: 12px;
                margin: 0;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2>Enquiry From Job Portal  </h2>
              </div>
              <div class="content">
                <p>Hello Admin,</p>
                <p>. Below are the details:</p>
                <table>
                  <tr>
                    <th>Name</th>
                    <td>${name.replace(/\b\w/g,c=>c.toUpperCase())}</td>
                  
                  </tr>
                  <tr>
                    <th>Email</th>
                   <td><a href="mailto:${email}">${email}</a></td> 
                  
                  </tr>
                  <tr>
                    <th>Phone Number</th>
                    <td>${phone}</td>
                  </tr>
                  <tr>
                    <th>Message</th>
                    <td>${message}</td>
                  </tr>
                </table>
                <p>Please take necessary action.</p>
              </div>
              <div class="footer">
                <p>Best Regards,<br /></p>
                <a target="_blank" href="https://www.skylarkjobs.com/#/findcandidate">
                  Skylarkjobs.com</a
                >
              </div>
            </div>
          </body>
        </html>
        `

        const userContentPath = path.join(__dirname, '../mailtemp.html');
        const userContentHtml = fs.readFileSync(userContentPath, 'utf8');

        const attachments = [
            { filename: 'Main-Bcgk.png', path: path.join(__dirname, '../images/Main-Bcgk.png'), cid: 'mainBg' },
            { filename: 'skylarklogo1.png', path: path.join(__dirname, '../images/skylarklogo1.png'), cid: 'logo' },
            { filename: 'facebook2x.png', path: path.join(__dirname, '../images/facebook2x.png'), cid: 'fb' },
            { filename: 'instagram2x.png', path: path.join(__dirname, '../images/instagram2x.png'), cid: 'insta' },
            { filename: 'whatsapp2x.png', path: path.join(__dirname, '../images/whatsapp2x.png'), cid: 'wa' },
            { filename: 'linkedin2x.png', path: path.join(__dirname, '../images/linkedin2x.png'), cid: 'linkedin' },
        ];

        const userContent = userContentHtml.replace('{{name}}', name);
//         const usercontent = `<!DOCTYPE html>

// <html lang="en" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">
// <head>
// <title></title>
// <meta content="text/html; charset=utf-8" http-equiv="Content-Type"/>
// <meta content="width=device-width, initial-scale=1.0" name="viewport"/><!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]--><!--[if !mso]><!-->
// <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900" rel="stylesheet" type="text/css"/>
// <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&display=swap" rel="stylesheet" type="text/css"/><!--<![endif]-->
// <style>
// 		* {
// 			box-sizing: border-box;
// 		}

// 		body {
// 			margin: 0;
// 			padding: 0;
// 		}

// 		a[x-apple-data-detectors] {
// 			color: inherit !important;
// 			text-decoration: inherit !important;
// 		}

// 		#MessageViewBody a {
// 			color: inherit;
// 			text-decoration: none;
// 		}

// 		p {
// 			line-height: inherit
// 		}

// 		.desktop_hide,
// 		.desktop_hide table {
// 			mso-hide: all;
// 			display: none;
// 			max-height: 0px;
// 			overflow: hidden;
// 		}

// 		.image_block img+div {
// 			display: none;
// 		}

// 		@media (max-width:710px) {

// 			.desktop_hide table.icons-inner,
// 			.social_block.desktop_hide .social-table {
// 				display: inline-block !important;
// 			}

// 			.icons-inner {
// 				text-align: center;
// 			}

// 			.icons-inner td {
// 				margin: 0 auto;
// 			}

// 			.mobile_hide {
// 				display: none;
// 			}

// 			.row-content {
// 				width: 100% !important;
// 			}

// 			.stack .column {
// 				width: 100%;
// 				display: block;
// 			}

// 			.mobile_hide {
// 				min-height: 0;
// 				max-height: 0;
// 				max-width: 0;
// 				overflow: hidden;
// 				font-size: 0px;
// 			}

// 			.desktop_hide,
// 			.desktop_hide table {
// 				display: table !important;
// 				max-height: none !important;
// 			}

// 			.row-1 .column-1 .block-5.spacer_block {
// 				height: 45px !important;
// 			}

// 			.row-1 .column-1 .block-6.heading_block h1 {
// 				font-size: 33px !important;
// 			}

// 			.row-1 .column-1 .block-7.heading_block h2 {
// 				font-size: 16px !important;
// 			}

// 			.row-1 .column-1 .block-10.paragraph_block td.pad {
// 				padding: 10px 15px 15px !important;
// 			}
// 		}
// 	</style>
// </head>
// <body class="body" style="background-color: #fdeef1; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
// <table border="0" cellpadding="0" cellspacing="0" class="nl-container" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #fdeef1;" width="100%">
// <tbody>
// <tr>
// <td>
// <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-size: auto;" width="100%">
// <tbody>
// <tr>
// <td>
// <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-size: auto; background-color: #c2f3f8; background-image: url(../images/Main-Bcgk.png}); background-position: top center; background-repeat: no-repeat; color: #000000; width: 690px; margin: 0 auto;" width="690">
// <tbody>
// <tr>
// <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
// <div class="spacer_block block-1" style="height:60px;line-height:60px;font-size:1px;"> </div>
// <div class="spacer_block block-2" style="height:60px;line-height:60px;font-size:1px;"> </div>
// <div class="spacer_block block-3" style="height:60px;line-height:60px;font-size:1px;"> </div>
// <table border="0" cellpadding="0" cellspacing="0" class="image_block block-4" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
// <tr>
// <td class="pad" style="width:100%;padding-right:0px;padding-left:0px;">
// <div align="center" class="alignment" style="line-height:10px">
// <div style="max-width: 138px;"><img height="auto" src="https://www.skylarkjobs.com/assets/skylarklogo1-n-uUECbI.png" style="display: block; height: auto; border: 0; width: 100%;" width="138"/></div>
// </div>
// </td>
// </tr>
// </table>
// <div class="spacer_block block-5" style="height:75px;line-height:75px;font-size:1px;"> </div>
// <table border="0" cellpadding="0" cellspacing="0" class="heading_block block-6" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
// <tr>
// <td class="pad" style="padding-top:10px;text-align:center;width:100%;">
// <h1 style="margin: 0; color: #2c2b2b; direction: ltr; font-family: 'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; font-size: 38px; font-weight: 700; letter-spacing: normal; line-height: 150%; text-align: center; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 57px;"><span class="tinyMce-placeholder">THANK YOU!</span></h1>
// </td>
// </tr>
// </table>
// <table border="0" cellpadding="0" cellspacing="0" class="heading_block block-7" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
// <tr>
// <td class="pad" style="padding-bottom:10px;text-align:center;width:100%;">
// <h2 style="margin: 0; color: #454545; direction: ltr; font-family: 'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; font-size: 22px; font-weight: 400; letter-spacing: normal; line-height: 120%; text-align: center; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 26.4px;">for reaching out to us!</h2>
// </td>
// </tr>
// </table>
// <table border="0" cellpadding="10" cellspacing="0" class="divider_block block-8" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
// <tr>
// <td class="pad">
// <div align="center" class="alignment">
// <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="55%">
// <tr>
// <td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 1px solid #575757;"><span> </span></td>
// </tr>
// </table>
// </div>
// </td>
// </tr>
// </table>
// <div class="spacer_block block-9" style="height:25px;line-height:25px;font-size:1px;"> </div>
// <table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-10" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
// <tr>
// <td class="pad" style="padding-bottom:15px;padding-top:10px;">
// <div style="color:#454545;direction:ltr;font-family:'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:14px;font-weight:300;letter-spacing:0px;line-height:150%;text-align:center;mso-line-height-alt:21px;">
// <p style="margin: 0; margin-bottom: 16px;"> </p>
// <p style="margin: 0; margin-bottom: 16px;">We appreciate your interest and will get back to you as soon as possible with the</p>
// <p style="margin: 0;">information you need.<br/><br/>with love,<br/>Support Team</p>
// </div>
// </td>
// </tr>
// </table>
// <div class="spacer_block block-11" style="height:20px;line-height:20px;font-size:1px;"> </div>
// <div class="spacer_block block-12" style="height:165px;line-height:165px;font-size:1px;"> </div>
// </td>
// </tr>
// </tbody>
// </table>
// </td>
// </tr>
// </tbody>
// </table>
// <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
// <tbody>
// <tr>
// <td>
// <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #fbd3dc; border-radius: 0; color: #000000; width: 690px; margin: 0 auto;" width="690">
// <tbody>
// <tr>
// <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
// <table border="0" cellpadding="0" cellspacing="0" class="divider_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
// <tr>
// <td class="pad" style="padding-bottom:10px;">
// <div align="center" class="alignment">
// <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
// <tr>
// <td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 1px solid #000000;"><span> </span></td>
// </tr>
// </table>
// </div>
// </td>
// </tr>
// </table>
// </td>
// </tr>
// </tbody>
// </table>
// </td>
// </tr>
// </tbody>
// </table>
// <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
// <tbody>
// <tr>
// <td>
// <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #fbd3dc; border-radius: 0; color: #000000; width: 690px; margin: 0 auto;" width="690">
// <tbody>
// <tr>
// <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 10px; padding-left: 10px; padding-right: 10px; padding-top: 10px; vertical-align: middle; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="50%">
// <table border="0" cellpadding="0" cellspacing="0" class="text_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
// <tr>
// <td class="pad" style="padding-bottom:5px;padding-left:10px;padding-right:10px;padding-top:5px;">
// <div style="font-family: 'Trebuchet MS', Tahoma, sans-serif">
// <div class="" style="font-size: 12px; font-family: 'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #ffffff; line-height: 1.2;">
// <p style="margin: 0; font-size: 18px; text-align: left; mso-line-height-alt: 21.599999999999998px;"><strong><span style="font-size:14px;color:#000000;"><span style="">Social media</span></span></strong></p>
// </div>
// </div>
// </td>
// </tr>
// </table>
// <table border="0" cellpadding="0" cellspacing="0" class="text_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
// <tr>
// <td class="pad" style="padding-bottom:10px;padding-left:10px;padding-right:20px;padding-top:10px;">
// <div style="font-family: Arial, sans-serif">
// <div class="" style="font-size: 12px; font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #C0C0C0; line-height: 1.2;">
// <p style="margin: 0; font-size: 14px; text-align: left; mso-line-height-alt: 16.8px;"><span style="color:#454545;font-size:12px;">Stay up-to-date with current activities by following us on your favorite social media channels.</span></p>
// </div>
// </div>
// </td>
// </tr>
// </table>
// <table border="0" cellpadding="0" cellspacing="0" class="social_block block-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
// <tr>
// <td class="pad" style="text-align:left;padding-right:0px;padding-left:0px;">
// <div align="left" class="alignment">
// <table border="0" cellpadding="0" cellspacing="0" class="social-table" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; display: inline-block;" width="144px">
// <tr>
// <td style="padding:0 4px 0 0;"><a href="https://www.facebook.com/skylarkhrsolutions" target="_blank"><img alt="Facebook" height="auto" src= "https://www.skylarkjobs.com/assets/facebook-ejnf6rkB.png" style="display: block; height: auto; border: 0;" title="Facebook" width="32"/></a></td>
// <td style="padding:0 4px 0 0;"><a href="https://www.instagram.com/skylark_fun_at_work/" target="_blank"><img alt="Instagram" height="auto" src="https://www.skylarkjobs.com/assets/instagram-CVFJBcOL.png" style="display: block; height: auto; border: 0;" title="Instagram" width="32"/></a></td>
// <td style="padding:0 4px 0 0;"><a href="https://wa.me/8610010780?text=Hello%20there!Its%20Skylark%20Job%20Portal%20Feel%20free%20to%20contact" target="_blank"><img alt="WhatsApp" height="auto" src="https://www.skylarkjobs.com/assets/whatsapp-BtCgz4Tn.png" style="display: block; height: auto; border: 0;" title="WhatsApp" width="32"/></a></td>
// <td style="padding:0 4px 0 0;"><a href="https://www.linkedin.com/company/skylark-hr-solutions/" target="_blank"><img alt="LinkedIn" height="auto" src="https://www.skylarkjobs.com/assets/linkedin-DYsRWqBD.png" style="display: block; height: auto; border: 0;" title="LinkedIn" width="32"/></a></td>
// </tr>
// </table>
// </div>
// </td>
// </tr>
// </table>
// </td>
// <td class="column column-2" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 10px; padding-left: 10px; padding-right: 10px; padding-top: 10px; vertical-align: middle; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="50%">
// <table border="0" cellpadding="0" cellspacing="0" class="text_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
// <tr>
// <td class="pad" style="padding-bottom:5px;padding-left:10px;padding-right:10px;padding-top:5px;">
// <div style="font-family: 'Trebuchet MS', Tahoma, sans-serif">
// <div class="" style="font-size: 12px; font-family: 'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #ffffff; line-height: 1.2;">
// <p style="margin: 0; font-size: 18px; text-align: left; mso-line-height-alt: 21.599999999999998px;"><span style="font-size:14px;color:#000000;"><strong><span style="">Where to find us</span></strong></span></p>
// </div>
// </div>
// </td>
// </tr>
// </table>
// <table border="0" cellpadding="0" cellspacing="0" class="text_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
// <tr>
// <td class="pad" style="padding-bottom:5px;padding-left:10px;padding-right:10px;padding-top:10px;">
// <div style="font-family: Arial, sans-serif">
// <div class="" style="font-size: 12px; font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #3f3f3f; line-height: 1.2;">
// <p style="margin: 0; font-size: 14px; text-align: left; mso-line-height-alt: 16.8px;"><span style="color:#454545;font-size:12px;">With Love, Skylark jobs<br/><br/></span></p>
// </div>
// </div>
// </td>
// </tr>
// </table>
// </td>
// </tr>
// </tbody>
// </table>
// </td>
// </tr>
// </tbody>
// </table>
// <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-4" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff;" width="100%">
// <tbody>
// <tr>
// <td>
// <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000; width: 690px; margin: 0 auto;" width="690">
// <tbody>
// <tr>
// <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
// <table border="0" cellpadding="0" cellspacing="0" class="icons_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; text-align: center;" width="100%">
// <tr>
// <td class="pad" style="vertical-align: middle; color: #1e0e4b; font-family: 'Inter', sans-serif; font-size: 15px; padding-bottom: 5px; padding-top: 5px; text-align: center;">
// <table cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
// <tr>
// <td class="alignment" style="vertical-align: middle; text-align: center;"><!--[if vml]><table align="center" cellpadding="0" cellspacing="0" role="presentation" style="display:inline-block;padding-left:0px;padding-right:0px;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"><![endif]-->
// <!--[if !vml]><!-->
// <table cellpadding="0" cellspacing="0" class="icons-inner" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; display: inline-block; margin-right: -4px; padding-left: 0px; padding-right: 0px;"><!--<![endif]-->
// <tr>
// </tr>
// </table>
// </td>
// </tr>
// </table>
// </td>
// </tr>
// </table>
// </td>
// </tr>
// </tbody>
// </table>
// </td>
// </tr>
// </tbody>
// </table>
// </td>
// </tr>
// </tbody>
// </table><!-- End -->
// </body>
// </html>`
        sendMail(adminemail, 'Enquiry Notification From Skylark Jobs', adminMessage);
        applyMail(email, 'Thank You For Your Enquiry', userContent,attachments);
          res.status(201).json({ message: 'Enquiry sent successfully' });
        
    } catch (error) {
        console.log("Error occured in Enquiry : ",error.message)
    }
});

module.exports = router;