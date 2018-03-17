var mysql   = require("mysql");

function REST_ROUTER(router,connection,md5) {
    var self = this;
    self.handleRoutes(router,connection,md5);
}

REST_ROUTER.prototype.handleRoutes = function(router,connection,md5) {
    var self = this;
    router.get("/",function(req,res){
        res.json({"Message" : "Hello World !"});
    });

     router.get("/searchproducts",function(req,res){
        var query = "select pc.id, concat(b2.b_name,' vs ',b1.b_name) as title1, concat(pc.retailer_pname,' vs ',pc.brand_pname) as title2,rb.retailer_name from product_comp pc join brands b1 on b1.bid=pc.brand_bid join brands b2 on b2.bid=pc.retailer_bid join retail_brand rb on rb.bid=b2.bid";
        query = mysql.format(query);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                
                res.json({"Error" : false, "Message" : "Success", "Search_Results" : rows});
            }
        });
    });

    router.get("/products/:product_id",function(req,res){
        var query = "select  distinct pc.id,  b1.b_name as brand_name,b2.b_name as retailer_brand, concat(pc.retailer_pname,' vs ',pc.brand_pname) as title2,rb.retailer_name,pc.image_link,pc.overall_similarity,pc.ingredient_match,pc.b_review, (select count(pr.id) from product_reviews pr where pr.p_id=pc.id)as review_count from product_comp pc join brands b1 on b1.bid=pc.brand_bid join brands b2 on b2.bid=pc.retailer_bid join retail_brand rb on rb.bid=b2.bid where pc.id =?";
        var table = [req.params.product_id];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json({"Error" : false, "Message" : "Success", "product_info" : rows});
            }
        });
    });
    
     router.get("/reviews/:product_id",function(req,res){
        var query = "select pr.p_id, pr.uname, pr.review,date_added from product_reviews pr where p_id=?";
        var table = [req.params.product_id];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json({"Error" : false, "Message" : "Success", "Reviews" : rows});
            }
        });
    });
    
    router.post("/review",function(req,res){
        console.log(req.body);
        var query = "INSERT INTO product_reviews(p_id,uname,email,review,date_added) VALUES (?,?,?,?,now())";
        var table = [req.body.pid,req.body.name,req.body.email,req.body.review];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                console.log(err);
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json({"Error" : false, "Message" : "Review Added !"});
            }
        });
    });
    
    router.post("/requestreview",function(req,res){
        console.log(req.body);
        var query = "INSERT INTO product_review_request(product_name,store_name,email,can_help,date_added) VALUES (?,?,?,?,now())";
        var table = [req.body.product_name,req.body.store_name,req.body.email,req.body.can_help];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                console.log(err);
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json({"Error" : false, "Message" : "Review Request Added !"});
            }
        });
    });
    
     router.post("/subscribe",function(req,res){
        console.log(req.body);
        var query = "INSERT INTO subscribers(email,date_added) VALUES (?,now())";
        var table = [req.body.email];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                console.log(err);
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json({"Error" : false, "Message" : "Subscriber Added !"});
            }
        });
    });
    
    
      router.post("/feedback",function(req,res){
        console.log(req.body);
        var query = "INSERT INTO feedback(fname,email,message,date_added) VALUES (?,?,?,now())";
        var table = [req.body.fname,req.body.email,req.body.message];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                console.log(err);
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json({"Error" : false, "Message" : "Feedback Added !"});
            }
        });
    });

   /* router.post("/users",function(req,res){
        var query = "INSERT INTO ??(??,??) VALUES (?,?)";
        var table = ["user_login","user_email","user_password",req.body.email,md5(req.body.password)];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json({"Error" : false, "Message" : "User Added !"});
            }
        });
    });

    router.put("/users",function(req,res){
        var query = "UPDATE ?? SET ?? = ? WHERE ?? = ?";
        var table = ["user_login","user_password",md5(req.body.password),"user_email",req.body.email];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json({"Error" : false, "Message" : "Updated the password for email "+req.body.email});
            }
        });
    });

    router.delete("/users/:email",function(req,res){
        var query = "DELETE from ?? WHERE ??=?";
        var table = ["user_login","user_email",req.params.email];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json({"Error" : false, "Message" : "Deleted the user with email "+req.params.email});
            }
        });
    });*/
}

module.exports = REST_ROUTER;
