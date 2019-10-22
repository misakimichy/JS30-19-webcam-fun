import './styles.css';
(function(){
    const button = document.querySelector('#photo-btn');
    const canvas = document.querySelector('.photo');
    const ctx = canvas.getContext('2d');
    const video = document.querySelector('.player');
    const strip = document.querySelector('.strip');
    const snap = document.querySelector('.snap');
    const rgb = document.querySelector('.rgb');
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
            switch(filter) {
                case 'red' :
                    pixels = redEffect(pixels);
                    ctx.globalAlpha = 1;
                    rgb.style.display = 'none';
                    break;
                case 'green' :
                    pixels = greenEffect(pixels);
                    ctx.globalAlpha = 1;
                    rgb.style.display = 'none';
                    break;
                case 'blue' :
                    pixels = blueEffect(pixels);
                    ctx.globalAlpha = 1;
                    rgb.style.display = 'none';
                    break;
                case 'rgb' :
                    pixels = rgbSplitEffect(pixels);
                    ctx.globalAlpha = 0.3;
                    rgb.style.display = 'none';
                    break;
                case 'greenScreen' :
                    pixels = greenScreen(pixels);
                    ctx.globalAlpha = 1;
                    rgb.style.display = 'block';
                    break;
            }
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
        link.innerHTML = `<img src="${data}" alt="Snapshot"/>`;
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
            pixels.data[i + 300] = pixels.data[i + 1]; // green
            pixels.data[i - 150] = pixels.data[i + 2]; //blue
        }
        return pixels;
    };

    const greenScreen = pixels => {
        const levels = {};
        document.querySelectorAll('.rgb input').forEach(input => {
            levels[input.name] = input.value;
        });
        for(let i = 0; i < pixels.data.length; i += 4) {
            let red = pixels.data[i];
            let green = pixels.data[i + 1];
            let blue = pixels.data[i + 2];
            let alpha = pixels.data[i + 3];

            if(red >= levels.rmin &&
                green >= levels.gmin &&
                blue >= levels.bmin &&
                red <= levels.rmax &&
                green <= levels.gmax &&
                blue <= levels.bmax) {
                    pixels.data[i + 3] = 0;
                }
        }
        return pixels;
    };

    button.addEventListener('click', takePhoto);
    getVideo();
    video.addEventListener('canplay', paintCanvas);
}());