var mongoose    = require("mongoose"),
    Nature      = require("./models/nature.js"),
    Comment     = require("./models/comment.js");

var data = [
        {title: "Winter", source: "https://farm5.staticflickr.com/4074/5439086890_237050458d.jpg", description: "Bacon ipsum dolor amet swine pork loin tri-tip bacon, sausage meatball meatloaf corned beef. Cow brisket biltong andouille beef, spare ribs kielbasa. Flank rump frankfurter venison pork chop alcatra picanha jerky. Fatback leberkas bacon burgdoggen kielbasa chuck shank jerky. Shoulder meatball flank t-bone, ribeye short loin pork belly pastrami pancetta spare ribs chicken kevin hamburger. "},
        {title: "Buckeye", source: "https://farm7.staticflickr.com/6046/6331265673_873a932f55.jpg", description: "Bacon ipsum dolor amet swine pork loin tri-tip bacon, sausage meatball meatloaf corned beef. Cow brisket biltong andouille beef, spare ribs kielbasa. Flank rump frankfurter venison pork chop alcatra picanha jerky. Fatback leberkas bacon burgdoggen kielbasa chuck shank jerky. Shoulder meatball flank t-bone, ribeye short loin pork belly pastrami pancetta spare ribs chicken kevin hamburger. "},
        {title: "Lake", source: "https://farm1.staticflickr.com/66/158583580_79e1c5f121.jpg", description: "Bacon ipsum dolor amet swine pork loin tri-tip bacon, sausage meatball meatloaf corned beef. Cow brisket biltong andouille beef, spare ribs kielbasa. Flank rump frankfurter venison pork chop alcatra picanha jerky. Fatback leberkas bacon burgdoggen kielbasa chuck shank jerky. Shoulder meatball flank t-bone, ribeye short loin pork belly pastrami pancetta spare ribs chicken kevin hamburger. "},
        {title: "Monsoon", source: "https://farm9.staticflickr.com/8083/8279448370_d3eb4c3a46.jpg", description: "Bacon ipsum dolor amet swine pork loin tri-tip bacon, sausage meatball meatloaf corned beef. Cow brisket biltong andouille beef, spare ribs kielbasa. Flank rump frankfurter venison pork chop alcatra picanha jerky. Fatback leberkas bacon burgdoggen kielbasa chuck shank jerky. Shoulder meatball flank t-bone, ribeye short loin pork belly pastrami pancetta spare ribs chicken kevin hamburger. "}
    ];

function seedDB(){
    Comment.remove({}, function(err){
        if(err){
            console.log(err);
        }
        else{
            console.log("Remove comment Successfully");
            Nature.remove({}, function(err){
                if(err){
                    console.log(err);
                }
                // else{
                //     console.log("Remove Photo Successfully");
                //         data.forEach(function(photo){
                //             Nature.create(photo, function(err, photo){
                //                 if(err){
                //                     console.log(err);
                //                 }
                //                 else{
                //                     console.log("add a photo");
                //                     Comment.create({text: "Wonderful world!!!", author:"Shane"}, function(err, comment){
                //                         if(err){
                //                             console.log(err);
                //                         }
                //                         else{
                //                             photo.comments.push(comment);
                //                             photo.save();
                //                             console.log("Creat a comment");
                //                         }
                //                     });
                //                 }
                //             });
                //         });
                // }
            });            
        }
    });

}

module.exports = seedDB;


