var unityInstance = UnityLoader.instantiate("unityContainer", "Build/Builds.json", {onProgress: UnityProgress});

let video;
let poseNet;
let pose;
let skeleton;

var buttonPressed = false;

async function setup() {
    createCanvas(640, 480);
    video = createCapture(VIDEO);
    video.hide();
    poseNet = ml5.poseNet(video, modelLoaded);
    poseNet.on('pose', gotPoses);
    button = createButton("start tracking");
    button.position(width,0);
    button.mousePressed(() =>{
        buttonPressed = true;
    })
}

function modelLoaded() {
    console.log('poseNet ready');
}

function gotPoses(poses) {
  if (buttonPressed && poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
    
    extractData(pose);
}
}

function draw(){
  translate(width/2,0); // move to far corner
  scale(-1.0,1.0);    // flip x-axis backwards
  image(video, 0, 0, width/2, height/2);
}

function extractData(pose){
    for (let i = 0; i < pose.keypoints.length; i++) {
        let score = pose.keypoints[i].score;
        let part = pose.keypoints[i].part;
        let x = pose.keypoints[i].position.x;
        let y = pose.keypoints[i].position.y;
        if(part=="nose"){
        let relX = map(x,0,640,-10,10)*-1;
        let relY = map(y,0,480,-5,5)*-1;
        sendMessage(part, score, relX, relY);
        }
    }
}

function sendMessage(part, score, x, y) {
    if(unityInstance != null){
        unityInstance.SendMessage("MovementController", part, score.toString().concat("|",x,"|",y));
     }
}