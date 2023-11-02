
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mysql = require ("mysql");




const db = mysql.createConnection ({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE
});

exports.register = (req, res) => {
    console.log(req.body);

  

    const { name, email, pass, cpass} = req.body;
    db.query('SELECT email FROM login WHERE email = ? ', [email], async (error, results) => {
        if(error) {
            console.log(error);
        }

        if(results.length > 0 ){
            return res.render('register', {
                message: 'Email is already in use'
            })
        } else if(pass !== cpass){
            return res.render('register', {
                message: "Password does'nt match"
            });
        }

        let hPass = await bcrypt.hash(pass, -2);
        console.log(hPass);

        db.query('INSERT INTO login SET ?', {name: name, email: email, password: hPass}, (error, results) =>{
            if(error){
                console.log(error);
            } else {
                console.log(results);
                return res.render('login', {
                    message: 'User registered'
                });
            }
        })
    });

  
};


exports.login = (req, res) => {
    const { email, pass } = req.body;
    if(email !== ""){
        if(pass !== ""){           
            db.query('SELECT email, password FROM login WHERE email = ?', [email], async (error, results) => {
                if (error) {
                    console.error("Database query error:", error);
                    return res.status(500).send("Internal Server Error");
                }

                if (results.length === 1) {
                    const storedPassword = results[0].password;

                    const passwordMatch = await bcrypt.compare(pass, storedPassword);

                    if (passwordMatch) {
                        return res.render('index');
                    } else {
                        console.log("Password does not match.");
                        return res.render('login', {
                            message: "Credential Error"
                        });
                    }
                } else {
                    console.log(`Email not found in the database: ${email}`);
                    return res.render('login', {
                        message: "Email is not Registered"
                    });
                }
            });
        }else{
            return res.render('login', {
                pmessage: "You must have to Enter Password also"
            });
        }
    }else{
        return res.render('login', {
            emessage: "You must have to enter Email"
        });
    }
}

// exports.login = (req, res) => {
   

  

//     const {  email, pass} = req.body;
//     db.query('SELECT email FROM login WHERE email = ? ', [email], async (error, results) => {
//         if(error) {
//             console.log(error);
//             return res.render('login', {
//                 message: "Email is not Registered"
//             });
//         }

        

//         if(results.length > 0 ){
//             let hPass = await bcrypt.hash(pass, -2);
            
//             db.query('SELECT password FROM login WHERE password = ? ', [hPass], (error) => {
//                 if(error) {
//                     console.log(error);
//                     return res.render('login', {
//                         message: "Credential Error"
//                     });
//                 }else{
//                     return res.render('index')
//                 }
                
//             })
           
//         } 

       

        
//     });

  
// }



