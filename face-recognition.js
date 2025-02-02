const video = document.getElementById('video');
const startButton = document.getElementById('startButton');
const resultsDiv = document.getElementById('results');

async function loadModels() {
  await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
  await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
  await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
  await faceapi.nets.faceExpressionNet.loadFromUri('/models');
}

async function startVideo() {
  const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
  video.srcObject = stream;
}

async function startRecognition() {
  video.addEventListener('play', async () => {
    const canvas = faceapi.createCanvasFromMedia(video);
    document.getElementById('video-container').append(canvas);
    const displaySize = { width: video.width, height: video.height };
    faceapi.matchDimensions(canvas, displaySize);

    setInterval(async () => {
      const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
      faceapi.draw.drawDetections(canvas, resizedDetections);
      faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
      faceapi.draw.drawFaceExpressions(canvas, resizedDetections);

      // Display results
      resultsDiv.innerHTML = JSON.stringify(detections, null, 2);

      // Redirect to teste.html after recognition
      if (detections.length > 0) {
        setTimeout(() => {
          window.location.href = 'teste.html';
        }, 3000); // Redirect after 3 seconds
      }
    }, 100);
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  await loadModels();
  startButton.addEventListener('click', startRecognition);
});
