let video;
let handPose;
let hands = [];
let circleX = 320;
let circleY = 240;
let startTime;
let leftHandScore = 0;
let rightHandScore = 0;
let displayText = "";

function preload() {
  try {
    handPose = ml5.handPose({ flipped: true });
    console.log("HandPose model loaded successfully.");
  } catch (error) {
    console.error("Failed to load HandPose model:", error);
  }
}

function setup() {
  try {
    createCanvas(windowWidth, windowHeight); // Fullscreen canvas
    video = createCapture(VIDEO);
    video.size(windowWidth, windowHeight);
    video.hide();

    // Start detecting hands
    handPose.on("predict", gotHands);
    handPose.start(video);

    startTime = millis(); // Record the start time
  } catch (error) {
    console.error("Setup failed:", error);
  }
}

function gotHands(results) {
  hands = results;
}

function draw() {
  image(video, 0, 0, windowWidth, windowHeight); // Adjust video to fullscreen

  // Draw a circle controlled by the hand position
  fill(255, 0, 0);
  noStroke();

  if (hands.length > 0) {
    let hand = hands[0]; // Use the first detected hand
    let indexFinger = hand.annotations.indexFinger; // Get index finger keypoints

    if (indexFinger && indexFinger.length > 0) {
      let tip = indexFinger[3]; // Tip of the index finger
      circleX = lerp(circleX, tip[0], 0.2); // Smooth movement
      circleY = lerp(circleY, tip[1], 0.2);
    }
  }

  ellipse(circleX, circleY, 30, 30);

  // Display text in the center-top
  fill(255);
  textSize(20);
  textAlign(CENTER, TOP);
  text("TKUET413730861魏彤紜", width / 2, 10);

  // Display elapsed time in the top-right corner
  let elapsedTime = floor((millis() - startTime) / 1000); // Convert to seconds
  textAlign(RIGHT, TOP);
  text(elapsedTime + " 秒", width - 10, 10);

  // Display score and text
  textAlign(CENTER, CENTER);
  textSize(30);
  fill(255);
  text(displayText, width / 2, height / 2);
}

function mousePressed() {
  if (hands.length > 0) {
    let hand = hands[0]; // Use the first detected hand
    let indexFinger = hand.annotations.indexFinger; // Get index finger keypoints

    if (indexFinger && indexFinger.length > 0) {
      let tip = indexFinger[3]; // Tip of the index finger
      let distance = dist(circleX, circleY, tip[0], tip[1]);

      if (distance < 30) { // Check if the finger is close to the circle
        if (hand.label === "left") {
          leftHandScore++;
          displayText = "教育科技";
        } else if (hand.label === "right") {
          rightHandScore++;
          displayText = "淡江大學";
        }
      }
    }
  }
}
