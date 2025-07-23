
var express=require("express");    
var fileuploader=require('express-fileupload');
var cloudinary=require("cloudinary").v2;
var mysql2=require("mysql2");
var app=express();//app() returns an Object:app

app.use(fileuploader()); //we use this for receiving files from client and save them on server files and write this line under where we define app

app.use(express.static("public"));


app.listen(2000,function(){
    console.log("Server Started at Port no: 2000")
})



app.get("/",function(req,resp)
{
    console.log(__dirname);
    console.log(__filename);

    let path=__dirname+"/public/index.html";
    resp.sendFile(path);

})



let dbConfig = "mysql://avnadmin:AVNS_HlH0PVgle85DMW4OCsL@mysql-2cbf41c8-tusharbansal054322-9457.c.aivencloud.com:25009/defaultdb";

let mySqlVen=mysql2.createPool(dbConfig);
console.log("aiven connected successfully");
// mySqlVen.connect(function(errKuch){

//     if(errKuch==null)
//     {
//         console.log("aiven connected successfully");
//     }
//     else
//         console.log(errKuch); 
// })

app.get("/signup",function(req,resp){

    
        let emailid=req.query.txtEmail;
        let pwd=req.query.txtPwd;
        let usertype=req.query.txtUser; 


       mySqlVen.query("insert into sport2025 values(?,?,?,current_date(),1)",[emailid,pwd,usertype],function(errKuch)
       {

                if(errKuch==null)
                    resp.send("Record Saved Successfully");
                else 
                     resp.send("ERROR" + errKuch.message);
       })
   

})



app.get("/login",function(req,resp){

    
        let emailid=req.query.txtEmail2;
        let pwd=req.query.txtPwd2;
        


       mySqlVen.query("select * from sport2025 where emailid=? and pwd=?",[emailid,pwd],function(errKuch,allRecords)
    {

       if (allRecords.length == 0) {
            resp.send("Invalid");
            return;
        }
        else if (allRecords[0].status == 0) {
            resp.send("Blocked");
        }
        else
            resp.send(allRecords[0].usertype);





    })

})



app.get("/org-dash", function (req, resp) {


    let path = __dirname + "/public/org-dash.html";
    resp.sendFile(path);
})


app.get("/org-details", function (req, resp) {


    let path = __dirname + "/public/org-details.html";
    resp.sendFile(path);
})




cloudinary.config({ 
            cloud_name: 'dbizjpurt', 
            api_key: '918536126548825', 
            api_secret: 'NcpfNRO-itUmVC96fLtZuNp4zXQ' // Click 'View API Keys' above to copy your API secret
        });

app.post("/server-details-safe", async function (req, resp) {
    let email3 = req.body.txtEmail3;
    let org_name3 = req.body.txtOrgName;
    let registeration_num3 = req.body.txtRegName;
    let address3 = req.body.txtAddress;
    let city3 = req.body.txtCity;
    let sports3 = req.body.txtDeals;
    let website3 = req.body.txtWeb;
    let insta3 = req.body.txtInsta;
    let head3 = req.body.txtHead;
    let contact3 = req.body.txtContact;
    let other_info3 = req.body.txtInfo;
    
    let picurl3 = "";
    if (req.files != null) {
        let fName = req.files.ProfilePic.name;
        let fullPath = __dirname + "/public/uploads/" + fName;
        req.files.ProfilePic.mv(fullPath);

        await cloudinary.uploader.upload(fullPath).then(function (picUrlResult) {
            picurl3 = picUrlResult.url;   

            console.log(picurl3);
        });
    }
    else
        picurl3 = "nopic.jpg";




    mySqlVen.query("insert into orgdetail values(?,?,?,?,?,?,?,?,?,?,?,?)", [email3, org_name3,registeration_num3,address3,city3,sports3,website3,insta3,head3,contact3,picurl3,other_info3], function (errKuch) {
        if (errKuch == null)
            resp.send("Record Saved Successfully");
        else
            resp.send(errKuch.message)

    })
})



app.get("/get-one",function(req,resp)
{
    mySqlVen.query("select * from orgdetail where email3=?",[req.query.txtEmail3],function(err,allRecords) 
    {

        if(allRecords.length==0)
            resp.send("no records");
        else
            resp.json(allRecords);
    })

})





app.post("/update-user",async function(req,resp)
{
    let picurl3="";
    if(req.files!=null)
    {
        let fname=req.files.ProfilePic.name;

        let fullpath=__dirname+"/public/uploads/"+fname;
        req.files.ProfilePic.mv(fullpath);


          await cloudinary.uploader.upload(fullpath).then(function(picUrlResult){
          picurl3=picUrlResult.url;   //will give u the url of ur pic on cloudinary server
          console.log(picurl3);
        });

    }   
    else
        
    picurl3=req.body.hdn;

        

let email3 = req.body.txtEmail3;
    let org_name3 = req.body.txtOrgName;
    let registeration_num3 = req.body.txtRegName;
    let address3 = req.body.txtAddress;
    let city3 = req.body.txtCity;
    let sports3 = req.body.txtDeals;
    let website3 = req.body.txtWeb;
    let insta3 = req.body.txtInsta;
    let head3 = req.body.txtHead;
    let contact3 = req.body.txtContact;
    let other_info3 = req.body.txtInfo;

 mySqlVen.query("update orgdetail set org_name3=?,registeration_num3=?,address3=?,city3=?,sports3=?,website3=?,insta3=?,head3=?,contact3=?,picurl3=?,other_info3=? where email3=?",[org_name3,registeration_num3,address3,city3,sports3,website3,insta3,head3,contact3,picurl3,other_info3,email3],function(errKuch,result)
       {

         if(errKuch==null)
                {
                    if(result.affectedRows==1)
                    {
                        

                        resp.send("udpated sucessfully");
                         
                    }     
                    else
                        resp.send("invalid");
                }
                else
                resp.send(errKuch);


       })


})



app.get("/player-dash", function (req, resp) {


    let path = __dirname + "/public/player-dash.html";
    resp.sendFile(path);
})



app.get("/player-details", function (req, resp) {


    let path = __dirname + "/public/player-details.html";
    resp.sendFile(path);
})



app.post("/player-details-safe", async function (req, resp) {

    let picurl4 = "";
    if (req.files != null) {
        let fName = req.files.ProfilePic2.name;
        let fullPath = __dirname + "/public/uploads/" + fName;
        req.files.ProfilePic2.mv(fullPath);

        await cloudinary.uploader.upload(fullPath).then(function (picUrlResult) {
            picurl4 = picUrlResult.url;   

            console.log(picurl4);
        });
    }
    else
        picurl4 = "nopic.jpg";
   


   

    let picurl5 = "";     
    if (req.files != null) {
        let fName = req.files.ProfilePic3.name;
        let fullPath = __dirname + "/public/uploads/" + fName;
        req.files.ProfilePic3.mv(fullPath);


           try {
            await cloudinary.uploader.upload(fullPath).then(async function (picUrlResult) {

                let jsonData = await RajeshBansalKaChirag(picUrlResult.url);
                console.log(jsonData);
              
               
                picurl5 = picUrlResult.url;



                let name5 = jsonData.name;
                let dob5 = jsonData.dob;
                let gender5 = jsonData.gender;
                let email5 = req.body.txtEmail5;
                // let name5 = req.body.txtName5;
                let address5 = req.body.txtAddress5;
                // let dob5 = req.body.txtDate5;
                // let gender5 = req.body.txtGen5;
                let game5 = req.body.txtSports5;
                let contact5 = req.body.txtContact5;
                let info5 = req.body.txtInfo5;

               


                mySqlVen.query("insert into playerdetail values(?,?,?,?,?,?,?,?,?,?)", [email5,picurl5,picurl4,name5,dob5,gender5,address5,contact5,game5,info5 ], function (errKuch) {
                if (errKuch == null)
                    resp.send("Record Saved Successfully");
                else
                    resp.send(errKuch.message)
                })

              
            });

        }
        catch (err) {
            resp.send(err.message)
        }

    }    


})




app.get("/post-tournaments", function (req, resp) {


    let path = __dirname + "/public/post-tournaments.html";
    resp.sendFile(path);
})




app.get("/server-tournaments-safe", async function (req, resp) {

    let emailid = req.query.txtEmail4;
    let event = req.query.txtTitle4;                               
    let doi = req.query.txtDate4;
    let toe = req.query.txtTime4;
    let adress = req.query.txtAddress4;
    let city = req.query.txtCity4;
    let sports = req.query.txtSports4;
    let minage = req.query.txtMinAge4;
    let maxage = req.query.txtMaxAge4;
    let lastdate = req.query.txtLDR4;
    let fee = req.query.txtFee4;
    let prize = req.query.txtPrize4;
    let contact = req.query.txtCNum4;



    mySqlVen.query("insert into tournamentdetail values(?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [null,emailid,event,doi,toe,adress,city,sports,minage,maxage,lastdate,fee,prize,contact], function (errKuch) {
        if (errKuch == null)
            resp.send("Record Saved Successfully");
        else
            resp.send(errKuch.message)

    })
})





app.get("/tournamentManager", function (req, resp) {


    let path = __dirname + "/public/managing-tournaments.html";
    resp.sendFile(path);
})



app.get("/do-fetch-all-users",function(req,resp)
{
      let emailid = req.query.txtEmail8;
        mySqlVen.query("select * from tournamentdetail where emailid=?",[emailid],function(err,allRecords)
        {
                    resp.send(allRecords);
        })
})
    
    
app.get("/delete-one",function(req,resp)
{
    console.log(req.query);
    let rid=req.query.ridKuch;
    

    mySqlVen.query("delete from tournamentdetail where rid=?",[rid],function(errKuch,result)
    {
        if(errKuch==null)
                {
                    if(result.affectedRows==1)
                        resp.send(" Deleted Successfully");
                    else
                        resp.send("Invalid rid");
                }
                else
                resp.send(errKuch);


    })
}) 



app.get("/admin-dash", function (req, resp) {


    let path = __dirname + "/public/admin-dash.html";
    resp.sendFile(path);
})




app.get("/admin-details", function (req, resp) {


    let path = __dirname + "/public/users-admin-consol.html";
    resp.sendFile(path);
})






app.get("/do-fetch-all-users2",function(req,resp)
{
        mySqlVen.query("select * from sport2025",function(err,allRecords)
        {
                    resp.send(allRecords);
        })
})
    
    
app.get("/delete-one2",function(req,resp)
{
    console.log(req.query);
    let emailid=req.query.emailidKuch;
    

    mySqlVen.query("update  sport2025 set status = 0  where emailid=?",[emailid],function(errKuch,result)
    {
        if(errKuch==null)
                {
                    if(result.affectedRows==1)
                        resp.send(" blocked Successfully");
                    else
                        resp.send("Invalid emamilid");
                }
                else
                resp.send(errKuch);

    })
}) 


    
app.get("/resume-one2",function(req,resp)
{
    console.log(req.query);
    let emailid=req.query.emailidKuch2;
    

    mySqlVen.query("update  sport2025 set status = 1  where emailid=?",[emailid],function(errKuch,result)
    {
        if(errKuch==null)
                {
                    if(result.affectedRows==1)
                        resp.send(" unobstructed Successfully");
                    else
                        resp.send("Invalid emamilid");
                }
                else
                resp.send(errKuch);

    })
}) 






// =============  AI STARTS===============


var fs = require("fs");


const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("AIzaSyBkOTsS9cALDReSUvGAoQOdPDLtiGcsGvQ");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });


app.use(express.urlencoded(true)); //convert POST data to JSON object






async function RajeshBansalKaChirag(imgurl)
{
const myprompt = "Read the text on picture and tell all the information in adhaar card and give output STRICTLY in JSON format { name:'', gender:'', dob: ''}. Dont give output as string. Also fix dob according to date datatype of sql" 
    const imageResp = await fetch(imgurl)
        .then((response) => response.arrayBuffer());

    const result = await model.generateContent([
        {
            inlineData: {
                data: Buffer.from(imageResp).toString("base64"),
                mimeType: "image/jpeg",
            },
        },
        myprompt,
    ]);
    console.log(result.response.text())
            
            const cleaned = result.response.text().replace(/```json|```/g, '').trim();
            const jsonData = JSON.parse(cleaned);
            console.log(jsonData);

    return jsonData

}

//======================================================== AI ENDS



app.get("/explore-events", function (req, resp) {


    let path = __dirname + "/public/check-tournaments.html";
    resp.sendFile(path);
})



app.get("/do-fetch-all-users3",function(req,resp)
{
        
  console.log(req.query)
        mySqlVen.query("select * from tournamentdetail where city=? and sports=?",[req.query.kuchCity,req.query.kuchGame],function(err,allRecords)
        {
          console.log(allRecords)
                    resp.send(allRecords);
        })
})



app.get("/do-fetch-all-cities",function(req,resp)
{
        mySqlVen.query("select distinct city from tournamentdetail",function(err,allRecords)
        {
                    resp.send(allRecords);
        })
})



app.get("/organ-admin-details", function (req, resp) {


    let path = __dirname + "/public/org-admin-consol.html";
    resp.sendFile(path);
})


app.get("/do-fetch-all-users4",function(req,resp)
{
        mySqlVen.query("select * from orgdetail",function(err,allRecords)
        {
                    resp.send(allRecords);
        })
})
    



app.get("/player-admin-details", function (req, resp) {


    let path = __dirname + "/public/players-admin-consol.html";
    resp.sendFile(path);
})


app.get("/do-fetch-all-users5",function(req,resp)
{
        mySqlVen.query("select * from playerdetail",function(err,allRecords)
        {
                    resp.send(allRecords);
        })
})
    




app.get("/settings-changepwd",async function(req,resp)
{
   
        

let emailid = req.query.txtEmail6;
    let pwd = req.query.txtPwd6;
    let pwd1 = req.query.txtPwd7;
  

mySqlVen.query("update sport2025 set pwd=? where emailid=? and pwd=?",[pwd1,emailid,pwd],function(errKuch,result)
       {

         if(errKuch==null)
                {
                    if(result.affectedRows==1)
                    {
                        

                        resp.send("udpated sucessfully");
                         
                    }     
                    else
                        resp.send("invalid");
                }
                else
                resp.send(errKuch);


       })


})
