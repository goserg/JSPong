winH = window.innerWidth/16*9;
winW = window.innerWidth;

const board = document.querySelector("#board");
board.style.outline = "solid 1px black";
board.style.width = winW + "px";
board.style.height = winH + "px";

controls = {
    "Up": false,
    "Down": false,
}

document.addEventListener("keydown", e => {
    if (e.key === "ArrowUp") {
        controls.Up = true;
    } else if (e.key === "ArrowDown") {
        controls.Down = true;
    } else {
        controls.Up = false;
        controls.Down = false;
    }
})

document.addEventListener("keyup", e => {
    if (e.key === "ArrowUp") {
        controls.Up = false;
    } else if (e.key === "ArrowDown") {
        controls.Down = false;
    }
})

class Actor {
    constructor(div, width, height) {
        this.div = div;
        this.width = width;
        this.height = height;
        this.left = 0;
        this.top = window.innerWidth/4*3 / 2 - this.height/2;
        this.div.style.position = "absolute";
        this.div.style.backgroundColor = "grey";
        this.speedY = 0;
    }

    move() {
        this.top += this.speedY;

        if (this.top < 0) {
            this.top = 0;
            this.speedY = -this.speedY;
        } else if (this.top > winH - this.height) {
            this.top = winH - this.height;
            this.speedY = -this.speedY;
        }
    }

    update() {
        this.div.style.height = this.height + "px";
        this.div.style.width = this.width + "px";
        this.div.style.left = this.left + "px";
        this.div.style.top = this.top + "px";
    }
}

class Player extends Actor{
    constructor(div, width, height, isRight) {
        super(div, width, height);
        if (isRight) {
            this.left = window.innerWidth - this.width;
        } else {
            this.left = 0;
        }
        this.update();
    }

    move() {
        this.getControls();
        super.move();
    }

    getControls() {
        if (controls.Up) this.speedY = -2;
        else if (controls.Down) this.speedY = 2;
        else this.speedY = 0;
    }
}

class AI extends Actor {
    constructor(div, width, height, isRight) {
        super(div, width, height);
        if (isRight) {
            this.left = window.innerWidth - this.width;
        } else {
            this.left = 0;
        }
        this.update();
    }

    move() {
        this.decide();
        super.move();
    }

    decide() {
        if (ball.speedX > 0 && ball.left < this.left ||
            ball.speedX < 0 && ball.left > this.left) {
            if (ball.top + ball.height > this.top + this.height) {
                this.speedY = 2;
            } else if (ball.top < this.top) {
                this.speedY = -2;
            } else {
                this.speedY = 0;
            }
        } else {
            this.speedY = 0;
        }
    }
}

class Ball extends Actor {
    constructor(div, width) {
        super(div, width, width);
        this.left = window.innerWidth/2 - this.width/2;
        this.speedX = 2;
        this.speedY = 1;
        this.update();
    }
    move() {
        super.move();
        this.getCollision();

        this.left += this.speedX;

        if (this.left < 0) {
            this.left = 0;
            this.speedX = -this.speedX;
        } else if (this.left > winW - this.width) {
            this.left = winW - this.width;
            this.speedX = -this.speedX;
        }
    }

    getCollision(){
        if (this.speedX < 0 &&
        this.left <= player1.width
        ) {
            if (this.top + this.height >= player1.top &&
            this.top <= player1.height + player1.top) {
                this.speedX = -this.speedX;
            }
        }
        if (this.speedX > 0 &&
            this.left + this.width >= player2.left
        ) {
            if (this.top + this.height >= player2.top &&
                this.top <= player2.height + player2.top) {
                this.speedX = -this.speedX;
            }
        }
    }
}

const player1 = new AI(
    document.querySelector("#player1"),
    Number(board.style.width.slice(0, -2))/30,
    Number(board.style.height.slice(0, -2))/5,
)

const player2 = new AI(
    document.querySelector("#player2"),
    Number(board.style.width.slice(0, -2))/30,
    Number(board.style.height.slice(0, -2))/5,
    true,
)

const ball = new Ball(
    document.querySelector("#ball"),
    Number(board.style.width.slice(0, -2))/30,
)


function run() {
    console.log("running");
    setTimeout(run, 1);
    ball.move();
    ball.update();

    player1.move();
    player1.update();

    player2.move();
    player2.update();
}

run();