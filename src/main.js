import './styles.css';
(function(){
  const canvas = document.querySelector('.photo');
  const ctx = canvas.getContext('2d');
  const video = document.querySelector('.player');
  const strip = document.querySelector('.strip');
  const snap = document.querySelector('.snap');

  const getVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(localMediaStream => {
            video.src = window.URL.createObjectURL(localMediaStream);
            video.play();
        });
  };
  getVideo();
}());