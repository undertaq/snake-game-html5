const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const scale = 20;
const rows = canvas.height / scale;
const columns = canvas.width / scale;

let snake;

// Define the interval variable outside the setup function so it can be accessed globally
let interval;

(function setup() {
    snake = new Snake();
    fruit = new Fruit();
    fruit.pickLocation();

    // Assign the interval to a variable
    interval = window.setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        fruit.draw();
        snake.update();
        snake.draw();
        drawScore();

        if (snake.eat(fruit)) {
            fruit.pickLocation();
            // Increment the score (total) inside the eat function of Snake
        }

        if (snake.checkCollision()) {
            drawEndScreen();
            // Stop the game loop by clearing the interval
            clearInterval(interval);
        }
    }, 250);
}());

window.addEventListener('keydown', e => {
    const direction = e.key.replace('Arrow', '');
    snake.changeDirection(direction);
});

function Snake() {
    this.x = 0;
    this.y = 0;
    this.xSpeed = scale * 1;
    this.ySpeed = 0;
    this.total = 0;
    this.tail = [];

    this.draw = function() {
        ctx.fillStyle = "#00FF00";

        for (let i=0; i<this.tail.length; i++) {
            ctx.fillRect(this.tail[i].x, this.tail[i].y, scale, scale);
        }

        ctx.fillRect(this.x, this.y, scale, scale);
    };

    this.update = function() {
        for (let i=0; i<this.tail.length - 1; i++) {
            this.tail[i] = this.tail[i+1];
        }

        this.tail[this.total - 1] = { x: this.x, y: this.y };

        this.x += this.xSpeed;
        this.y += this.ySpeed;

        if (this.x >= canvas.width) {
            this.x = 0;
        }

        if (this.y >= canvas.height) {
            this.y = 0;
        }

        if (this.x < 0) {
            this.x = canvas.width - scale;
        }

        if (this.y < 0) {
            this.y = canvas.height - scale;
        }
    };

    this.changeDirection = function(direction) {
        switch(direction) {
            case 'Up':
                if (this.ySpeed === 0) {
                    this.xSpeed = 0;
                    this.ySpeed = -scale * 1;
                }
                break;
            case 'Down':
                if (this.ySpeed === 0) {
                    this.xSpeed = 0;
                    this.ySpeed = scale * 1;
                }
                break;
            case 'Left':
                if (this.xSpeed === 0) {
                    this.xSpeed = -scale * 1;
                    this.ySpeed = 0;
                }
                break;
            case 'Right':
                if (this.xSpeed === 0) {
                    this.xSpeed = scale * 1;
                    this.ySpeed = 0;
                }
                break;
        }
    };

}

function Fruit() {
    this.x;
    this.y;

    this.pickLocation = function() {
        this.x = (Math.floor(Math.random() * columns - 1) + 1) * scale;
        this.y = (Math.floor(Math.random() * rows - 1) + 1) * scale;
    };

    this.draw = function() {
        ctx.fillStyle = "#FF0000";
        ctx.fillRect(this.x, this.y, scale, scale);
    };
}

// Modify the Snake's eat method to increment the total there
Snake.prototype.eat = function(fruit) {
    if (this.x === fruit.x && this.y === fruit.y) {
        this.total++;
        return true; // Fruit eaten
    }
    return false;
};

// Adjust the checkCollision method to only check for collisions
Snake.prototype.checkCollision = function() {
    for (let i = 0; i < this.tail.length; i++) {
        if (this.x === this.tail[i].x && this.y === this.tail[i].y) {
            return true; // Collision detected
        }
    }
    return false;
};

function drawScore() {
    ctx.fillStyle = "#555";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + snake.total, canvas.width - 120, 20);
}

function drawEndScreen() {
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#000";
    ctx.font = "40px Arial";
    ctx.fillText("Game Over!", canvas.width / 2 - 120, canvas.height / 2);
    ctx.font = "20px Arial";
    ctx.fillText("Final Score: " + snake.total, canvas.width / 2 - 70, canvas.height / 2 + 40);
}