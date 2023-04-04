let background = $("background");
let wall_img = $("wall");
let game_Over = $("gameOver");
let width_img_gameover = 250;
let character = $("megamanX");
let hpBar = $("hpBar");
let bossImg = $("boss");
let hpBarBoss = $("hpBarBoss");
let bulletImg = $("bullet");
let bullet_EnemyImg = $("bullet_Enemy");
let s = null;
let myInterval;
let myInterval_1;
let myInterval_2;
let myInterval_3;
let myInterval_4;
let direction;
let canvas = $("myCanvas")
let WIDTH_CANVAS = canvas.width;
let ctx = canvas.getContext("2d");
let ctx_1 = canvas.getContext("2d");
let ctx_2 = canvas.getContext("2d");
let ctx_3 = canvas.getContext("2d");
let ctx_4 = canvas.getContext("2d");
let ctx_5 = canvas.getContext("2d");
let speed_X = 2;
let map_x = 0;
let count = 0;
let count_Enemy = 0;
let step = 0;
let random = 0;
let keyC = false,
    keyLeft = false,
    keyRight = false;

function $(x) {
    return document.getElementById(x);
}

class Megaman {
    constructor() {
        this.default_x = 150;
        this.default_y = 105;
        this.healthPoint = 5;
        this.direction_Right = true;

        this.hitBox = {
            left: this.default_x + 40,
            right: this.default_x + 75,
            top: this.default_y + 25,
            bottom: this.default_y + 70,
        }

        this.x_First_Tele = () => {
            count = 0;
            myInterval = setInterval(() => {
                character.src = `png/first_Tele/${count}.png`;
                count++;
                if (count == 18) {
                    this.x_Basic_Mode();
                }
            }, 60);
        }
        this.x_Basic_Mode = () => {
            clearInterval(myInterval);
            direction = this.direction_Right ? "right" : "left";
            count = 0;
            myInterval = setInterval(() => {
                this.default_y = 105;
                this.hitBox.top = this.default_y + 25;
                this.hitBox.bottom = this.default_y + 70;
                character.src = `png/basic/${direction}/${count}.png`;
                count++;
                if (count == 10) {
                    count = 0;
                }
            }, 100);
        }

        this.move = () => {
            if (keyLeft == true) {
                this.direction_Right = false;
                this.x_Moving();
            }
            if (keyRight == true) {
                this.direction_Right = true;
                this.x_Moving();
            }
        }

        this.x_Moving = () => {
            direction = this.direction_Right ? "right" : "left";
            step++;
            this.hitBox.top = this.default_y + 25;
            this.hitBox.bottom = this.default_y + 70;
            let x = parseInt(step / 4);
            character.src = `png/moving/${direction}/${x}.png`;
            if (step == 13 * 4) {
                step = 0;
            }
        }
        this.x_Shooting = () => {
            direction = this.direction_Right ? "right" : "left";
            let shot = 0;
            clearInterval(myInterval);
            myInterval = setInterval(() => {
                this.default_y = 105;
                this.hitBox.top = this.default_y + 25;
                this.hitBox.bottom = this.default_y + 70;
                character.src = `png/shooting/${direction}/${shot}.png`;
                shot++;
                if (shot == 6) {
                    this.x_Basic_Mode();
                }
            }, 60);
        }
        this.x_Jumping = () => {
            direction = this.direction_Right ? "right" : "left";
            let jump = 0;
            clearInterval(myInterval);
            myInterval = setInterval(() => {
                window.removeEventListener("keydown", keyDown);
                window.removeEventListener("keyup", keyUp);
                this.default_y = -23;
                this.hitBox.top = this.default_y + 25;
                this.hitBox.bottom = this.default_y + 70;
                character.src = `png/jumping/${direction}/${jump}.png`;
                jump++;
                if (jump == 22) {
                    this.x_Basic_Mode();
                }
                setTimeout(() => {
                    window.addEventListener("keydown", keyDown);
                    window.addEventListener("keyup", keyUp)
                }, 1100)

            }, 40);

        }

        this.hitBody = (x) => {
            direction = this.direction_Right ? "right" : "left";
            this.healthPoint -= x;
            hpBar.src = `png/hp_Bar/${this.healthPoint}.png`;
            clearInterval(myInterval);
            myInterval = setInterval(() => {
                character.src = `png/hit/${direction}/0.png`;
                setTimeout(this.x_Basic_Mode, 250);
            }, 60);
            if (this.healthPoint < 1) {
                this.healthPoint = 1;
                window.removeEventListener("keydown", keyDown);
                window.removeEventListener("keyup", keyUp);
                game_Over.src = `png/game_over/1.png`;
                $("btnTry").style = "";
            }
        }
    }
}

class Bullet {
    constructor() {
        this.x = megaman.default_x - map_x;
        this.y;

        this.hitPoint = { x: 0, y: 0 };

        this.direction = megaman.direction_Right ? "right" : "left";
        bulletImg.src = `png/bullet/${direction}/0.png`;

        this.shooting_bullet = () => {
            if (megaman.direction_Right) {
                this.speed = 2.5;
                this.x = megaman.default_x - map_x + 75;
                this.y = megaman.default_y + 41;
            }
            else {
                this.speed = -2.5;
                this.x = megaman.default_x - map_x + 40;
                this.y = megaman.default_y + 41;
            }

            setInterval(() => {
                this.x += this.speed;
                if (megaman.direction_Right) {
                    this.hitPoint.x = this.x + 12;
                    this.hitPoint.y = this.y + 7;
                }
                else {
                    this.hitPoint.x = this.x + 1;
                    this.hitPoint.y = this.y + 7;
                }
                if (this.hit() || this.hitScreen()) {
                    this.speed = 0;
                    this.x = -100;
                    this.y = 0;
                }
                ctx_4.drawImage(bulletImg, this.x, this.y);
            }, 5);
        }

        this.hit = () => {
            if (this.hitPoint.x >= boss.hitBox.left &&
                this.hitPoint.x <= boss.hitBox.right &&
                this.hitPoint.y >= boss.hitBox.top &&
                this.hitPoint.y <= boss.hitBox.bottom
            ) {
                boss.hitBody();
                return true;
            }
        }
        this.hitScreen = () => {
            if (this.hitPoint.x <= 0 ||
                this.hitPoint.x >= WIDTH_CANVAS) {
                return true;
            }
        }
    }
}

class Boss {
    constructor() {
        this.x = 740;
        this.y = -130;
        this.hitBox = {
            left: this.x - 10,
            right: this.x + 45,
            top: this.y + 280,
            bottom: this.y + 290,
        }
        this.count = 0;
        this.hp_Enemy = 30;

        this.First_Tele = () => {
            clearInterval(myInterval_3);
            count_Enemy = 0;
            myInterval_3 = setInterval(() => {
                if (this.x > 600) {
                    this.x--;
                    this.y++;
                }
                else {
                    count_Enemy++;
                    this.count = parseInt(count_Enemy / 50);
                    bossImg.src = `png/boss/first_Tele/${this.count}.png`;

                    if (count_Enemy > 3 * 50) {
                        count_Enemy = 3 * 50
                        setTimeout(() => this.Basic_Mode(), 1500);
                    }
                }
            }, 5,);
        }

        this.Basic_Mode = () => {
            this.y = 10;
            clearInterval(myInterval_3);
            count_Enemy = 0;
            bossImg.src = `png/boss/basic/1.png`;
            myInterval_3 = setInterval(() => {
                this.random = Math.floor(Math.random() * 3000);
                if (this.random < 20) {
                    this.shooting_High();
                    let bullet_Enemy = new Bullet_Boss(0);
                    setTimeout(() => bullet_Enemy.shooting_bullet(), 950);
                }
                else if (this.random < 40) {
                    this.shooting_Low();
                    let bullet_Enemy = new Bullet_Boss(10);
                    setTimeout(() => bullet_Enemy.shooting_bullet(), 950);
                }
                else if (this.random < 50) {
                    this.burst_Shoot();
                    let bullet_Enemy = new Bullet_Boss(0);
                    setTimeout(() => bullet_Enemy.burst_bullet(), 1700);
                }
            }, 17,);
        }
        this.shooting_High = () => {
            clearInterval(myInterval_3);
            count_Enemy = 0;
            myInterval_3 = setInterval(() => {
                count_Enemy++;
                this.count = parseInt(count_Enemy / 50);
                bossImg.src = `png/boss/attack/0.${this.count}.png`;
                if (count_Enemy == 2 * 50) {
                    count_Enemy = 0;
                    this.Basic_Mode();
                }
            }, 17);
        }
        this.shooting_Low = () => {
            this.y = 30;
            clearInterval(myInterval_3);
            count_Enemy = 0;
            myInterval_3 = setInterval(() => {
                count_Enemy++;
                this.count = parseInt(count_Enemy / 50);
                bossImg.src = `png/boss/attack/1.${this.count}.png`;
                if (count_Enemy == 2 * 50) {
                    count_Enemy = 0;
                    this.Basic_Mode();
                }
            }, 17);
        }
        this.burst_Shoot = () => {
            clearInterval(myInterval_3);
            count_Enemy = 0;
            myInterval_3 = setInterval(() => {
                count_Enemy++;
                this.count = parseInt(count_Enemy / 100);
                bossImg.src = `png/boss/attack/2.${this.count}.png`;
                if (count_Enemy == 2 * 100) {
                    count_Enemy = 0;
                    this.Basic_Mode();
                }
            }, 17);
        }
        this.hitBody = () => {
            this.hp_Enemy--;
            let hp = Math.ceil(this.hp_Enemy / 2);
            hpBarBoss.src = `png/boss/hp_Bar/${hp}.png`;
            clearInterval(myInterval_3);
            myInterval_3 = setInterval(() => {
                bossImg.src = `png/boss/basic/hit1.png`;
                setTimeout(this.Basic_Mode, 250);
                if (this.hp_Enemy < 1) {
                    this.hp_Enemy = 1;
                    this.x = -200;
                    this.y = 0;
                    this.hitBox = 0;
                }
            }, 17);
        }
    }
}

class Bullet_Boss {
    constructor(add_y) {
        this.x = boss.x + 70;
        this.y = boss.y + 90 + add_y;
        this.speed = 1.5;
        this.hitPoint = { x: 0, y: 0 };
        this.count = 0;
        this.animation = burst_Enemy;
        this.shooting_bullet = () => {
            clearInterval(myInterval_4);
            myInterval_4 = setInterval(() => {
                this.count++;
                this.x -= this.speed;
                this.hitPoint.x = this.x + 30;
                this.hitPoint.y = this.y + 30;
                if (this.count < 100) {
                    this.animation.src = "png/boss/bullet/0.0.png";
                }
                else {
                    this.animation.src = "png/boss/bullet/0.1.png";
                }
                ctx_5.drawImage(this.animation, this.x, this.y);
                if (this.hit(1)) {
                    this.x = - 100;
                    this.y = 0;
                    this.speed = 0;
                }
            }, 2);
        }
        this.burst_bullet = () => {
            clearInterval(myInterval_4);
            myInterval_4 = setInterval(() => {
                this.count++;
                this.x -= this.speed * 2;
                this.hitPoint.x = this.x;
                this.hitPoint.y = this.y + 25;
                if (this.count < 60) {
                    this.animation.src = "png/boss/bullet/1.0.png";
                }
                else if (this.count < 120) {
                    this.animation.src = "png/boss/bullet/1.1.png";
                }
                else {
                    this.animation.src = "png/boss/bullet/1.2.png";
                }
                ctx_5.drawImage(this.animation, this.x, this.y);
                if (this.hit(2)) {
                    this.x = - 100;
                    this.y = 0;
                    this.speed = 0;
                }
            }, 5);
        }
        this.hit = (x) => {
            if (this.hitPoint.x <= megaman.hitBox.right - map_x &&
                this.hitPoint.x >= megaman.hitBox.left - map_x &&
                this.hitPoint.y >= megaman.hitBox.top - 40 &&
                this.hitPoint.y <= megaman.hitBox.bottom) {
                megaman.hitBody(x);
                return true;
            }
        }
    }
}

let megaman = new Megaman();
let boss = new Boss();

$("btnTry").addEventListener("click", () => {
    window.location.reload();
});

window.onload = function () {
    megaman.x_First_Tele();
    setTimeout(() => {
        window.addEventListener("keydown", keyDown);
        window.addEventListener("keyup", keyUp);
    }, 1100);
    boss.First_Tele();

}
window.setInterval(() => {
    ctx_1.reset();

    ctx.drawImage(background, 0, 0);
    if (map_x < 195 && map_x > -770) {
        ctx_1.drawImage(character, megaman.default_x - map_x, megaman.default_y);
    }
    else
        if (map_x >= 195) {
            map_x = 195;
            ctx_1.drawImage(character, megaman.default_x - map_x, megaman.default_y);
        }
        else {
            map_x = -770;
            ctx_1.drawImage(character, megaman.default_x - map_x, megaman.default_y);
        }
    ctx.drawImage(hpBar, 10, 10);

    ctx.drawImage(game_Over, WIDTH_CANVAS / 2 - width_img_gameover, 20);

    ctx_1.drawImage(bossImg, boss.x, boss.y);
    ctx.drawImage(hpBarBoss, 550, 10);
}, 17);

function keyDown(event) {
    if (event.keyCode == 88) {
        keyX = true;
        megaman.x_Jumping();
    }

    if (event.keyCode == 67) {
        keyC = true;
        megaman.x_Shooting();
        let bullet = new Bullet();
        bullet.shooting_bullet();
    }
    if (event.keyCode == 37) {
        keyLeft = true;
        clearInterval(myInterval_1);
        myInterval_1 = setInterval(() => {
            map_x += speed_X;
            megaman.move();
        }, 11);
    }
    if (event.keyCode == 39) {
        keyRight = true;
        clearInterval(myInterval_1);
        myInterval_1 = setInterval(() => {
            map_x -= speed_X;
            megaman.move();
        }, 11);
    }
}

function keyUp(event) {
    clearInterval(myInterval_1);
    if (event.keyCode == 88) {
        keyX = false;
    }
    if (event.keyCode == 67) {
        keyC = false;
    }

    if (event.keyCode == 37) {
        keyLeft = false;
        megaman.x_Basic_Mode();
    }

    if (event.keyCode == 39) {
        keyRight = false;
        megaman.x_Basic_Mode();
    }
}
