var unityInstance = UnityLoader.instantiate("unityContainer", "Build/WEBGL.json", {onProgress: UnityProgress});

let video;
let poseNet;
let pose;
let skeleton;

var buttonPressed = false;

async function setup() {
    let canvas = createCanvas(640, 480);
    video = createCapture(VIDEO);
    
    video.hide();
    //noCanvas();
    poseNet = ml5.poseNet(video, modelLoaded);
    poseNet.on('pose', gotPoses);
    button = createButton("start tracking");
    button.position(0,0);
    button.mousePressed(() =>{
        buttonPressed = true;
        button.hide();
    });
    canvas.position(0,0,"fixed");
}

function modelLoaded() {
    console.log('poseNet ready');
}

function gotPoses(poses) {
  if (buttonPressed && poses.length > 0) {
    var poseMessage = "";
    var len = poses.length>1?2:1;
    for (index = 0; index < len; index++) { 
        if(poses[index].pose.score>0.5){
            var message = extractData(poses[index].pose);
            poseMessage = poseMessage.concat(message,"~");
        }
    }
    console.log(poseMessage);
    sendMessage(poseMessage);
    }
}



function extractData(pose, index){
    var message = '';
    var avgPosX = 0.0;
    var avgPosY = 0.0;
    var avgPosCount = 0;
    var avgString = "";
        
    for (let i = 0; i < pose.keypoints.length; i++) {
        let score = pose.keypoints[i].score;
        let part = pose.keypoints[i].part;
        let x = pose.keypoints[i].position.x;
        let y = pose.keypoints[i].position.y;
        let relX = map(x,0,640,-10,10)*-1;
        let relY = map(y,0,480,-5,5)*-1;

        if(part == "nose" || part == "leftShoulder" || part == "rightShoulder"){
            avgPosX += parseFloat(relX);
            avgPosY += parseFloat(relY);
            avgPosCount++;
        }
        message = message.concat(part,"|",score,"|",relX,"|",relY,"`");
    }
    if(avgPosCount!=0){
        avgString = avgString.concat(avgPosX/avgPosCount,"#",avgPosY/avgPosCount,"$");
        console.log("Outgoing avgPos "+ avgString);
    }
    message = avgString.concat(message);
    return message;
}

function sendMessage(poseMessage) {
    if(unityInstance != null){
        unityInstance.SendMessage("MovementController", "getMessage", poseMessage);
     }
}
function draw(){
    translate(width/2,0); // move to far corner
    scale(-1.0,1.0);    // flip x-axis backwards
    image(video, 0, 0, width/2, height/2);
  }