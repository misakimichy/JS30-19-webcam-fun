import './styles.css';
(function(){
    const canvas = document.querySelector('.photo');
    const ctx = canvas.getContext('2d');
    const video = document.querySelector('.player');
    const strip = document.querySelector('.strip');
    const snap = document.querySelector('.snap');
    let filter = '';

    const getVideo = () => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: false })
            .then(MediaStream => {
                video.srcObject = MediaStream;
                video.play();
            }).catch(error => {
                console.log('You denied the webcam access', error);
        });
    };

    const paintCanvas = () => {
        const width = video.videoWidth;
        const height = video.videoHeight;
        canvas.width = width;
        canvas.height = height;

        return setInterval(() => {
            ctx.drawImage(video, 0, 0, width, height);
            //take the pixels out
            let pixels = ctx.getImageData(0, 0, width, height);
        }, 16);
    };

    const takePhoto = () => {
        // play the sound
        snap.currentTime = 0;
        snap.play();
        //take the data out of the canvas
        const data = canvas.toDataURL('images/jpeg');
        const link = document.createElement('a');
        link.href = data;
        link.setAttribute('download', 'handsome');
        link.textContent = 'Download Image';
        strip.insertBefore(link, strip.firstChild);
        };

    getVideo();
    video.addEventListener('canplay',paintCanvas);
}());