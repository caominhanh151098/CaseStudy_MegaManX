let background = $("background");
let wall_img = $("wall");
let game_Over = $("gameOver");
let width_img_gameover = 250;
let character = $("megamanX");
let hpBar = $("hpBar");
let enemyImg = $("enemy")
let bulletImg = $("bullet");
let bullet_EnemyImg = $("bullet_Enemy");
let s = null;
let myInterval;
let myInterval_1;
let myInterval_2;
let myInterval_3;
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

function $(x) {
    return document.getElementById(x);
}

class Megaman {
    constructor() {
        this.default_x = 250;
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
            clearInterval(myInterval);
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
                    this.x_Basic_Mode();
                }
            }, 100);
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
        this.x_Dash = () => {
            direction = this.direction_Right ? "right" : "left";
            let dash = 0;
            clearInterval(myInterval);
            myInterval = setInterval(() => {
                window.removeEventListener("keydown", keyDown);
                window.removeEventListener("keyup", keyUp);
                this.default_y = 105;
                this.hitBox.top = this.default_y + 25;
                this.hitBox.bottom = this.default_y + 80;
                character.src = `png/dash/${direction}/${dash}.png`;
                dash++;
                if (dash == 19) {
                    this.x_Basic_Mode();
                }
                setTimeout(() => {
                    window.addEventListener("keydown", keyDown);
                    window.addEventListener("keyup", keyUp)
                }, 1100)
            }, 40);
        }

        this.hitBody = () => {
            direction = this.direction_Right ? "right" : "left";
            this.healthPoint--;
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
        this.x;
        this.y;

        this.hitPoint = { x: 0, y: 0 };

        this.direction = megaman.direction_Right ? "right" : "left";
        bulletImg.src = `png/bullet/${direction}/0.png`;
        this.shooting_bullet = () => {
            if (megaman.direction_Right) {
                this.speed = 2.5;
                this.x = megaman.default_x + 75;
                this.y = megaman.default_y + 41;
            }
            else {
                this.speed = -2.5;
                this.x = megaman.default_x + 40;
                this.y = megaman.default_y + 41;
            }
            myInterval_2 = setInterval(() => {
                this.x += this.speed;
                if (megaman.direction_Right) {
                    this.hitPoint.x = this.x + 12;
                    this.hitPoint.y = this.y + 7;
                }
                else {
                    this.hitPoint.x = this.x + 1;
                    this.hitPoint.y = this.y + 7;
                }
                if (this.hit() || this.hitScreen() || this.hitWall()) {
                    this.speed = 0;
                    this.x = -20;
                    this.y = 0;
                }
                ctx_4.drawImage(bulletImg, this.x, this.y);
            }, 5);
        }

        this.hit = () => {
            let bool = false;
            enemy_Robots.forEach((enemy, index) => {
                if (this.hitPoint.x >= enemy_Robots[index].hitBox.left + map_x &&
                    this.hitPoint.x <= enemy_Robots[index].hitBox.right + map_x &&
                    this.hitPoint.y >= enemy_Robots[index].hitBox.top &&
                    this.hitPoint.y <= enemy_Robots[index].hitBox.bottom) {
                    enemy_Robots[index].hitBody();
                    bool = true;
                }
            });
            return bool;
        }
        this.hitScreen = () => {
            if (this.hitPoint.x <= 0 ||
                this.hitPoint.x >= WIDTH_CANVAS) {
                return true;
            }
        }
        this.hitWall = () => {
            if (this.hitPoint.x >= 1680 + map_x) {
                wall.hit();
                return true;
            }
        }
    }
}

class Enemy {
    constructor(id) {
        this.x = Math.floor(Math.random() * 900 + 600);
        this.y = 105;
        this.id = id;
        this.hitBox = {
            left: this.x + 50,
            right: this.x + 65,
            top: this.y + 25,
            bottom: this.y + 70,
        }
        this.count = 0;
        this.hp_Enemy = 5;

        this.Basic_Mode = () => {
            clearInterval(myInterval_3);
            count_Enemy = 0;
            myInterval_3 = setInterval((id_0, id_1, id_2, id_3, id_4) => {
                this.count = parseInt(count_Enemy / 5);
                enemyImgs[id_0].src = `png/enemy/basic/0.${this.count}.png`;
                enemyImgs[id_1].src = `png/enemy/basic/0.${this.count}.png`;
                enemyImgs[id_2].src = `png/enemy/basic/1.${this.count}.png`;
                enemyImgs[id_3].src = `png/enemy/basic/1.${this.count}.png`;
                enemyImgs[id_4].src = `png/enemy/basic/0.${this.count}.png`;
                this.random = Math.floor(Math.random() * 1000);
                count_Enemy++;
                if (count_Enemy == 5 * 5) {
                    count_Enemy = 0;
                }
                if (this.random < 20) {
                    this.shooting();
                    let bullet_Enemys = new Array(new Bullet_Enemy(0), new Bullet_Enemy(1),
                        new Bullet_Enemy(2), new Bullet_Enemy(3), new Bullet_Enemy(4));
                    for (let bullet_Enemy of bullet_Enemys) {
                        bullet_Enemy.shooting_bullet();
                    }
                }
            }, 70, 0, 1, 2, 3, 4);
        }
        this.shooting = () => {
            clearInterval(myInterval_3);
            count_Enemy = 0;
            myInterval_3 = setInterval((id_0, id_1, id_2, id_3, id_4) => {
                this.count = parseInt(count_Enemy / 3);
                enemyImgs[id_0].src = `png/enemy/attack/0.${this.count}.png`;
                enemyImgs[id_1].src = `png/enemy/attack/0.${this.count}.png`;
                enemyImgs[id_2].src = `png/enemy/attack/1.${this.count}.png`;
                enemyImgs[id_3].src = `png/enemy/attack/1.${this.count}.png`;
                enemyImgs[id_4].src = `png/enemy/attack/0.${this.count}.png`;
                count_Enemy++;
                if (count_Enemy == 2 * 3) {
                    count_Enemy = 0;
                    this.Basic_Mode();
                }
            }, 60, 0, 1, 2, 3, 4);
        }
        this.hitBody = () => {
            this.animation = enemyImgs[this.id];
            this.hp_Enemy--;
            clearInterval(myInterval_3);
            myInterval_3 = setInterval(() => {
                this.animation.src = `png/enemy/basic/hit.png`;
                setTimeout(this.Basic_Mode, 250);
            }, 12);

            if (this.hp_Enemy < 1) {
                this.x = -100;
                this.y = 0;
                this.hitBox = 0;
            }
        }
    }
}

class Bullet_Enemy {
    constructor(id) {
        this.id = id;
        this.x = enemy_Robots[id].x + 40;
        this.y = enemy_Robots[id].y + 40;
        this.speed = 1;
        this.hitPoint = { x: 0, y: 0 };
        this.shooting_bullet = () => {
            setInterval(() => {
                this.x -= this.speed;
                this.hitPoint.x = this.x + 1;
                this.hitPoint.y = this.y + 6;
                ctx_5.drawImage(bullet_EnemyImg, this.x + map_x, this.y);
                if (this.hit() || this.hitScreen()) {
                    this.x = -20;
                    this.y = 0;
                    this.speed = 0;
                }
            }, 5);
        }

        this.hit = () => {
            if (this.hitPoint.x <= megaman.hitBox.right - map_x &&
                this.hitPoint.x >= megaman.hitBox.left - map_x &&
                this.hitPoint.y >= megaman.hitBox.top &&
                this.hitPoint.y <= megaman.hitBox.bottom) {
                megaman.hitBody();
                return true;
            }
        }
        this.hitScreen = () => {
            if (this.hitPoint.x <= - map_x ||
                this.hitPoint.x >= WIDTH_CANVAS - map_x) {
                return true;
            }
        }
    }
}

class Wall {
    constructor() {
        this.default_x = 1640;
        this.default_y = 110;
        this.hpWall = 20;

        this.hit = () => {
            this.hpWall--;
            wall_img.src = "png/hit_Wall/hit.png";
            setTimeout(() => wall_img.src = "png/hit_Wall/wall.png", 500);
            if (this.hpWall < 1) {
                window.removeEventListener("keydown", keyDown);
                window.removeEventListener("keyup", keyUp);
                window.location = "./screen2.html";
            }
        }
    }
}

let megaman = new Megaman();
let wall = new Wall();
let enemy_Robots = [new Enemy(0), new Enemy(1), new Enemy(2), new Enemy(3), new Enemy(4),];
let enemyImgs = new Array(enemy_Robots.length);
enemy_Robots.forEach((enemy, index) => {
    document.getElementsByClassName("data")[0].innerHTML += `<img id="enemy_${index}">`;
    enemyImgs[index] = $(`enemy_${index}`);
});
$("btnStart").addEventListener("click", () => {
    enemy_Robots.forEach((enemy, index) => {
        enemy.Basic_Mode();
    })
    megaman.x_First_Tele();
    setTimeout(() => {
        window.addEventListener("keydown", keyDown);
        window.addEventListener("keyup", keyUp);
    }, 1100);
    $("btnStart").style.display = "none";
});
$("btnTry").addEventListener("click", () => {
    window.location.reload();
});

window.setInterval(() => {
    ctx_1.reset();
    if (map_x <= 0) {
        ctx.drawImage(background, map_x, 0);
        ctx_1.drawImage(character, megaman.default_x, megaman.default_y);
    }
    else {
        map_x = 0;
        ctx.drawImage(background, 0, 0);
        ctx_1.drawImage(character, megaman.default_x, megaman.default_y);
    }
    if (map_x <= -1300) {
        map_x += speed_X + 1;
    }
    ctx.drawImage(hpBar, 10, 10);
    enemy_Robots.forEach((enemy, index) => {
        ctx_3.drawImage(enemyImgs[index], enemy_Robots[index].x + map_x, enemy_Robots[index].y);
    })
    ctx.drawImage(game_Over, WIDTH_CANVAS / 2 - width_img_gameover, 20);
    ctx.drawImage(wall_img, 1640 + map_x, 110);

}, 17);

function keyDown(event) {
    if (event.keyCode == 88) {
        megaman.x_Jumping();
    }

    if (event.keyCode == 67) {
        megaman.x_Shooting();
        let bullet = new Bullet();
        bullet.shooting_bullet();
    }
    if (event.keyCode == 37) {
        megaman.direction_Right = false;
        clearInterval(myInterval_1);
        myInterval_1 = setInterval(() => {
            map_x += speed_X;
            megaman.x_Moving();
        }, 11);
    }
    if (event.keyCode == 39) {
        megaman.direction_Right = true;
        clearInterval(myInterval_1);
        myInterval_1 = setInterval(() => {
            map_x -= speed_X;
            megaman.x_Moving();
        }, 11);
    }
    if (event.keyCode == 90) {
        megaman.x_Dash();

        clearInterval(myInterval_1);
        myInterval_1 = setInterval(() => {
            if (megaman.direction_Right) {
                map_x -= speed_X * 3;
            }
            else {
                map_x += speed_X * 3;
            }
            setTimeout(() => clearInterval(myInterval_1), 750);
        }, 17);
    }
}

function keyUp(event) {
    clearInterval(myInterval_1);

    if (event.keyCode == 37) {
        megaman.x_Basic_Mode();
    }

    if (event.keyCode == 39) {
        megaman.x_Basic_Mode();
    }
}
