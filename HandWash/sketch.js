var unityInstance = UnityLoader.instantiate("unityContainer", "Build/WEBGL.json", {onProgress: UnityProgress});

let video;
let poseNet;
let pose;
let skeleton;

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.hide();
  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on('pose', gotPoses);
}

function gotPoses(poses) {
  //console.log(poses);
  if (poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
  }
}

function modelLoaded() {
  console.log('poseNet ready');
}

function draw() {
  
  if (pose) {
    let eyeR = pose.rightEye;
    let eyeL = pose.leftEye;
    let d = dist(eyeR.x, eyeR.y, eyeL.x, eyeL.y);
 
    var keyPos = new Array(pose.keypoints.length);

    for (let i = 0; i < pose.keypoints.length; i++) {
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      keyPos[i] = new Array(2);
      keyPos[i][0] = x;
      keyPos[i][1] = x;

      fill(0, 255, 0);
      ellipse(x, y, 16, 16);
    }
    
  }
}