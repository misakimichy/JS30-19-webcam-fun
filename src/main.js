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
            // Take the pixels out
            let pixels = ctx.getImageData(0, 0, width, height);
            // Add effect to the pixel
            pixels = redEffect(pixels);
            // Put it back
            ctx.putImageData(pixels, 0, 0);
        }, 16);
    };

    const takePhoto = () => {
        // Play the sound
        snap.currentTime = 0;
        snap.play();
        // Take the data out of the canvas
        const data = canvas.toDataURL('images/jpeg');
        const link = document.createElement('a');
        link.href = data;
        link.setAttribute('download', 'snapshot');
        link.innerHTML = `<img src="${data}" alt="Snap shot"/>`;
        strip.insertBefore(link, strip.firstChild);
    };

    const redEffect = pixels => {
        for(let i = 0; i < pixels.data.length; i += 4) {
            pixels.data[i] = pixels.data[i] + 50; //red
            pixels.data[i + 1] = pixels.data[i + 1] - 100; // green
            pixels.data[i + 2] = pixels.data[i + 2] * 0.3; //blue
        }
        return pixels;
    };

    const greenEffect = pixels => {
        for(let i = 0; i < pixels.data.length; i += 4) {
            pixels.data[i] = pixels.data[i] - 500; //red
            pixels.data[i + 1] = pixels.data[i + 1] + 50; // green
            pixels.data[i + 2] = pixels.data[i + 2] * 0.5; //blue
        }
        return pixels;
    };

    const blueEffect = pixels => {
        for(let i = 0; i < pixels.data.length; i += 4) {
            pixels.data[i] = pixels.data[i] - 500; //red
            pixels.data[i + 1] = pixels.data[i + 1] * 0.5; // green
            pixels.data[i + 2] = pixels.data[i + 2] +50; //blue
        }
        return pixels;
    };

    const rgbSplitEffect = pixels => {
        for(let i = 0; i < pixels.data.length; i += 4) {
            pixels.data[i - 150] = pixels.data[i]; //red
            pixels.data[i + 100] = pixels.data[i + 1]; // green
            pixels.data[i - 150] = pixels.data[i + 2]; //blue
        }
        return pixels;
    };

    getVideo();
    video.addEventListener('canplay', paintCanvas);
}());