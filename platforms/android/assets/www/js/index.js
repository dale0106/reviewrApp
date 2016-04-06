
var app = {
   // "use strict";
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
   
    bindEvents: function() {
        document.addEventListener('DOMContentLoaded', app.onDeviceReady, false);
    },
   
    onDeviceReady: function() {
        
    var addBtn = document.getElementById("add");
    addBtn.addEventListener("click", app.createPage); //app and this are interchangable here
    
    var hammer = new Hammer(addBtn);
  //  hammer.on("doubletap", app.createPage);
    hammer.on("swipe", function(){
        
        console.log("swiped");
        
    });
   
    
    },
    
    createPage: function(){
        
        document.getElementById("lists").className = "inactive";
        document.getElementById("create").className = "active";
        // show the create page
        
        var cameraBtn = document.getElementById("cameraBtn");
        cameraBtn.addEventListener("click", app.takePic);
        // run the camera plugin onclick camBtn
        
        var submitBtn =  document.getElementById("submit");
        submitBtn.addEventListener("click", app.goBack);
      //  submitBtn.addEventListener("submit", app.appendNew, false);
     
        
        var cancelBtn  = document.getElementById("cancel");
        cancelBtn.addEventListener("click", app.goBack);
        //just return back to the list page        
    },
    
    upload: function(imageData){
    // if you click the cam btn:
        
       
        
        var xhr = new XMLHttpRequest();
        var url = "https://griffis.edumedia.ca/mad9022/reviewr/review/set/";
        xhr.open("POST" ,url);
        xhr.addEventListener("load", app.gotResponse);
        xhr.addEventListener("error", app.handleError);
        
        var params = new FormData();
        params.append("uuid", device.uuid);
        params.append("action", "insert");
        params.append("title", document.getElementById("getTitle").value);
        params.append("review_txt", document.getElementById("getReview").value);
        params.append("rating", 4 );
        params.append("img", imageData);
    
        xhr.send(params);
       
},
    
    gotResponse: function(eval){
        
        var xhr = new XMLHttpRequest();
        var url = "https://griffis.edumedia.ca/mad9022/reviewr/reviews/get/";
        xhr.open("POST" ,url);
        xhr.addEventListener("load", app.buildList);
        xhr.addEventListener("error", app.buildProblem);
        
         var params = new FormData();
        params.append("uuid", device.uuid);
        
        xhr.send(params);
           
       // console.log("gotResponse");
      //console.log(eval.target.responseText);    
            
    },
    
    buildList: function(ev){
        
        var data = JSON.parse(ev.target.responseText);
        
        
         if (data.code == 0 ){
            
            console.log(data);
            var ul = document.getElementById("appendLists");
            var numReviews = data.reviews.length;
            if(numReviews > 0){
                
                for(var i=0; i< numReviews; i++){
                    var li = document.createElement("li");
                    li.textContent = data.reviews[i].title;
                    ul.appendChild(li);
                     
                }
                
              
               // var li = document.querySelectorAll("li")
                //li.addEventListener("click", app.listPage);
            
             
        }
         else{
            
            console.log("Something went wrong when building the reviews list");
            
        }
        
    }
    },
    
    openDetails: function(ev){
        
        
          var li = document.getElementsByTagName("li");
         // li[0].addEventListener("click", app.listPage);
                
            for(var i=0; i<li.length; i++){
                                  
            li[i].addEventListener("click", app.listPage);
           // li[0].addEventListener("click", app.listPage);        

             } 
        
    },
    
    buildProblem: function(){
        
        
        console.log("something went wrong with the build");
    },
    
    listPage: function(){
        
     console.log("in List page");
        
    },
    
    handleError: function(message){
        
        
        console.log("Something went wrong -- " + message);
        
    },
    
    goBack: function(){
        // if you click the CANCEL btn:
    
    document.getElementById("lists").className = "active";
    document.getElementById("create").className = "inactive";
        //returns to list reviews 
    
},
    
    takePic: function(ev){
        //if you click the CAMERA btn:
        
        ev.preventDefault();
        var cameraOptions = {
            quality: 50,
            sourceType: Camera.PictureSourceType.CAMERA,
            targetWidth: 200,
            targetHeight: 300,
            destinationType: Camera.DestinationType.DATA_URL
        };
        
      navigator.camera.getPicture(function(fileURI){
          
          
        var img = document.getElementById("preview");
        img.src = fileURI;
        app.upload();
          
      }, app.cameraError, cameraOptions);
        // this is what actually opens the camera app
    
           
    },
    
    cameraSuccess: function(imageData){
        //imageData is the object that holds my image in a string format (i think)
        var xhr = new XMLHttpRequest();
        var url = "set-review.php";
        xhr.open("POST" , "set-review.php");
        xhr.addEventListener("load", app.gotResponse);
     
        
        var params = new FormData();
        params.append("img", imageData);
        params.append("review_id", device.uuid);
        params.append("action", "update");
        xhr.send(params);
        console.log("camera success");
        
        
    },
    
    cameraError: function(message){
        
        console.log(message);
    }

   
};

app.initialize();