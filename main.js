var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame ||
            window.msRequestAnimationFrame;
        var cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;
        var start = window.mozAnimationStartTime; // Only supported in FF. Other browsers can use something like Date.now().
        var container = document.getElementById('container');
        var basketContainer = document.getElementById('basket-сontainer');
        var score;
        var totalBad;
        var gameplay = false;

        var keys = {
            ArrowUp: false,
            ArrowDown: false,
            ArrowLeft: false,
            ArrowRight: false
        }

        var basket = {
            x: basketContainer.offsetLeft,
            y: basketContainer.offsetLeft,
            el: basketContainer,
            width: basketContainer.offsetWidth,
            height: basketContainer.offsetHeight,
            left: basketContainer.offsetLeft,
            top: basketContainer.offsetTop
        }

        var myContainer = {
            width: container.offsetWidth,
            height: container.offsetHeight,
            left: container.offsetLeft,
            top: container.offsetTop
        }

        var speed = 3;
        document.querySelector('.btn-start').addEventListener('click', startGame);
        document.addEventListener('keydown', pressKeyOn);
        document.addEventListener('keyup', pressKeyOff);
        var enemy = [];

        function startGame() {
            if (!gameplay) {
                document.querySelector('.gameover').style.display = 'none';
                score = 0;
                totalBad = 100;
                if (enemy.length == 0) setupBadGuys(8);
                requestAnimationFrame(playGame);
                gameplay = true;
            }
        }

        function endGame() {
            var gameOverMessage = document.querySelector('.gameover');
            gameOverMessage.style.display = 'block';
            gameOverMessage.innerHTML = "GAME OVER";
            gameplay = false;
            for (var x = 0; x < enemy.length; x++) {
                enemy[x].y = -400;
                enemy[x].el.style.top = enemy[x].y + 'px';
            }
        }

        function setupBadGuys(num) {
            for (var x = 0; x < num; x++) {
                var temp = x + 1;
                var div = document.createElement('div');
                div.innerHTML = temp;
                div.setAttribute('class', 'baddy');
                div.setAttribute('id', temp);
                container.appendChild(div);
                enemy.push({
                    x: 0,
                    y: 0,
                    el: div,
                    speed: 5
                })
                makeBad(enemy[x]);
            }
        }

        function makeBad(e) {
            if (totalBad < 1) {
                endGame();
            }
            totalBad--;
            var randomWidth = Math.floor(Math.random() * 50) + 50;
            e.x = Math.floor(Math.random() * (myContainer.width - randomWidth));
            e.y = Math.floor(Math.random() * 500) * -1;
            e.speed = Math.ceil(Math.random() * 10) + 2;
            e.el.style.left = e.x + 'px';
            e.el.style.width = randomWidth + 'px';
            e.el.style.backgroundColor = randomColor();
        }

        function randomColor() {
            function c() {
                var hex = Math.floor(Math.random() * 256).toString(16);
                return ('0' + String(hex)).substr(-2)
            }
            return '#' + c() + c() + c();
        }

        function bgMover(e) {
            e.y += e.speed;
            if (e.y > myContainer.height) {
                makeBad(e)
            }
            if (colDetection(basket.el, e.el)) {
                scoreUpdate();
                makeBad(e);                
            }
            e.el.style.top = e.y + 'px';
        }

        function scoreUpdate() {
            score++;
            document.querySelector('.score').innerText = score;
        }

        function playGame() {
            if (gameplay) {
                if (keys.ArrowUp && basket.y < (myContainer.height - basket.height))
                    basket.y += speed;
                if (keys.ArrowDown && basket.y > 0)
                    basket.y -= speed;
                if (keys.ArrowRight && basket.x < (myContainer.width - basket.width))
                    basket.x += speed;
                if (keys.ArrowLeft && basket.x > 0)
                    basket.x -= speed;

                basket.el.style.left = basket.x + 'px';
                basket.el.style.bottom = basket.y + 'px';

                for (var i = 0; i < enemy.length; i++) {
                    bgMover(enemy[i])
                }

                requestAnimationFrame(playGame);
            }
        }

        function colDetection(first, second) {
            var a = first.getBoundingClientRect();
            var b = second.getBoundingClientRect();
            return !(
                ((a.top + a.height) < (b.top)) || (a.top > (b.top + b.height)) || ((a.left + a.width) < b.left) ||
                (a.left > (b.left + b.width)));
        }

        function pressKeyOn(event) {
            event.preventDefault();
            keys[event.key] = true;
        }

        function pressKeyOff(event) {
            event.preventDefault();
            keys[event.key] = false;
        }