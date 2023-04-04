let background = $("background");
let doorImg = $("door");
let game_Over = $("gameOver");
let width_img_gameover = 250;
let character = $("megamanX");
let hpBar = $("hpBar");
let enemyImg = $("enemy")
let bulletImg = $("bullet");
let bullet_EnemyImg = $("bullet_Enemy");
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
let ctx_6 = canvas.getContext("2d");
let speed_X = 2;
let map_x = 0;
let map_y = 0;
let count = 0;
let count_Enemy = 0;
let final_step = 0;
let step = 0;
let random = 0;
let count_open_door = 0;
let X = 0;
let keyC = false,
    keyLeft = false,
    keyRight = false;

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
            bottom: this.default_y + 80,
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
                this.hitBox.bottom = this.default_y + 80;
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
            this.hitBox.bottom = this.default_y + 80;
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
                this.hitBox.bottom = this.default_y + 80;
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
                this.hitBox.bottom = this.default_y + 80;
                character.src = `png/jumping/${direction}/${jump}.png`;
                jump++;
                if (jump == 22) {
                    this.x_Basic_Mode();
                }
                setTimeout(() => {
                    window.addEventListener("keydown", keyDown);
                    window.addEventListener("keyup", keyUp)
                }, 1100)
            }, 60);
        }

        this.hitBody = (x) => {
            direction = this.direction_Right ? "right" : "left";
            this.healthPoint -= x;
            clearInterval(myInterval);
            myInterval = setInterval(() => {
                character.src = `png/hit/${direction}/0.png`;
                setTimeout(this.x_Basic_Mode, 250);
            }, 60);
            if (this.healthPoint < 1) {
                this.healthPoint = 0;
                window.removeEventListener("keydown", keyDown);
                window.removeEventListener("keyup", keyUp);
                game_Over.src = `png/game_over/1.png`;
                $("btnTry").style = "";
            }
            hpBar.src = `png/hp_Bar/${this.healthPoint}.png`;
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
            setInterval(() => {
                let ratio = map_x / 4;
                this.x += this.speed;

                if (megaman.direction_Right) {
                    this.hitPoint.x = this.x + 12;
                }
                else {
                    this.hitPoint.x = this.x + 1;
                }
                if (map_x >= -370) {
                    this.hitPoint.y = this.y + 7;
                }
                else
                    if (map_x >= -890) {
                        this.hitPoint.y = this.y - 95 - ratio;
                    }
                    else {
                        ratio = -915 / 4;
                        this.hitPoint.y = this.y - 95 - ratio;
                    }
                if (this.hit() || this.hitScreen() || this.hitSoldier()) {
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
        this.hitSoldier = () => {
            if (this.hitPoint.x >= enemy_Soldier.hitBox.left + map_x &&
                this.hitPoint.x <= enemy_Soldier.hitBox.right + map_x &&
                this.hitPoint.y >= enemy_Soldier.hitBox.top &&
                this.hitPoint.y <= enemy_Soldier.hitBox.bottom) {
                enemy_Soldier.hitBody();
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

class Enemy {
    constructor(id) {
        this.x = Math.floor(Math.random() * 750 + 600);
        if (this.x < 1150) {
            this.ratio = this.x / 4;
            this.y = -50 + this.ratio;
        }
        else {
            this.y = 230;
        }
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
            clearInterval(myInterval_2);
            count_Enemy = 0;
            myInterval_2 = setInterval((id_0, id_1, id_2, id_3) => {
                this.count = parseInt(count_Enemy / 5);
                enemyImgs[id_0].src = `png/enemy/basic/0.${this.count}.png`;
                enemyImgs[id_1].src = `png/enemy/basic/1.${this.count}.png`;
                enemyImgs[id_2].src = `png/enemy/basic/0.${this.count}.png`;
                enemyImgs[id_3].src = `png/enemy/basic/0.${this.count}.png`;
                this.random = Math.floor(Math.random() * 1000);
                count_Enemy++;
                if (count_Enemy == 5 * 5) {
                    count_Enemy = 0;
                }
                if (this.random < 20) {
                    this.shooting();
                    let bullet_Enemys = new Array(new Bullet_Enemy(0), new Bullet_Enemy(1)
                    , new Bullet_Enemy(2), new Bullet_Enemy(3));
                    for (let bullet_Enemy of bullet_Enemys) {
                        bullet_Enemy.shooting_bullet();
                    }
                }
            }, 70, 0, 1, 2, 3);
        }
        this.shooting = () => {
            clearInterval(myInterval_2);
            count_Enemy = 0;
            myInterval_2 = setInterval((id_0, id_1, id_2, id_3) => {
                this.count = parseInt(count_Enemy / 3);
                enemyImgs[id_0].src = `png/enemy/attack/0.${this.count}.png`;
                enemyImgs[id_1].src = `png/enemy/attack/1.${this.count}.png`;
                enemyImgs[id_2].src = `png/enemy/attack/0.${this.count}.png`;
                enemyImgs[id_3].src = `png/enemy/attack/0.${this.count}.png`;
                count_Enemy++;
                if (count_Enemy == 2 * 3) {
                    count_Enemy = 0;
                    this.Basic_Mode();
                }
            }, 60, 0, 1, 2, 3);
        }
        this.hitBody = () => {
            this.animation = enemyImgs[this.id];
            this.hp_Enemy--;
            clearInterval(myInterval_2);
            myInterval_2 = setInterval((id_0, id_1) => {
                this.animation.src = `png/enemy/basic/hit.png`;
                setTimeout(this.Basic_Mode, 250);
            }, 12, 0, 1);

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
        let ratio = map_x / 4;
        if (map_x >= -370) {
            this.y = enemy_Robots[id].y + 40;
        }
        else
            if (map_x >= -890) {
                this.y = enemy_Robots[id].y + 131 + ratio;
            }
            else {
                ratio = -890 / 4;
                this.y = enemy_Robots[id].y + 131 + ratio;
            }

        this.hitPoint = { x: 0, y: 0 }
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
                megaman.hitBody(1);
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

class Enemy_Soldier {
    constructor() {
        this.x = Math.floor(Math.random() * 200 + 1300);
        this.y = 200;
        let ratio = map_x / 4;
        this.hitBox = {
            left: this.x + 60,
            right: this.x + 90,
            top: this.y + 40,
            bottom: this.y + 105,
        }
        this.count = 0;
        this.hp_Soldie = 20;
        this.bool = false;

        this.Basic_Mode = () => {
            clearInterval(myInterval_3);
            this.count = 0;
            myInterval_3 = setInterval(() => {
                let s = parseInt(this.count / 5);
                enemyImg.src = `png/enemy/basic/2.${s}.png`;
                this.random = Math.floor(Math.random() * 500);
                this.count++;
                if (this.count == 4 * 5) {
                    this.count = 0;
                }
                if (this.random < 20) {
                    this.attacking();
                }
            }, 70);
        }
        this.attacking = () => {
            clearInterval(myInterval_3);
            this.count = 0;
            myInterval_3 = setInterval(() => {
                let bool = false;
                let ratio = -890 / 4;
                this.attackBox = {
                    left: this.x + map_x,
                    right: this.x + map_x + 60,
                    top: this.y + ratio + 118,
                    bottom: this.y + ratio + 226,
                }
                let s = parseInt(this.count / 5);
                enemyImg.src = `png/enemy/attack/2.${s}.png`;
                this.count++;
                if (this.count == 8 * 5) {
                    this.count = 0;
                    this.Basic_Mode();
                }
                if (this.count == 35) {
                    if (this.attackBox.left <= megaman.hitBox.right &&
                        this.attackBox.right >= megaman.hitBox.left &&
                        this.attackBox.top <= megaman.hitBox.bottom &&
                        this.attackBox.bottom >= megaman.hitBox.top) {
                        return megaman.hitBody(2);
                    }
                }
            }, 20);
        }

        this.hitBody = () => {
            this.hp_Soldie--;
            clearInterval(myInterval_3);
            myInterval_3 = setInterval(() => {
                enemyImg.src = `png/enemy/basic/hit.1.png`;
                setTimeout(this.Basic_Mode, 250);
            }, 12);

            if (this.hp_Soldie < 1) {
                this.x = -100;
                this.y = 0;
                this.hitBox = 0;
            }
        }
    }
}
class Door {
    constructor() {
        this.x = 1872;
        this.y = 223;
    }
}

let door = new Door();
let megaman = new Megaman();
let enemy_Soldier = new Enemy_Soldier();
let enemy_Robots = [new Enemy(0), new Enemy(1), new Enemy(2), new Enemy(3)];
let enemyImgs = new Array(enemy_Robots.length);
enemy_Robots.forEach((enemy, index) => {
    document.getElementsByClassName("data")[0].innerHTML += `<img id="enemy_${index}">`;
    enemyImgs[index] = $(`enemy_${index}`);

});
$("btnTry").addEventListener("click", () => {
    window.location.reload();
});

window.onload = function () {
    enemy_Robots.forEach((enemy, index) => {
        enemy.Basic_Mode();
    })
    megaman.x_First_Tele();
    enemy_Soldier.Basic_Mode();
    setTimeout(() => {
        window.addEventListener("keydown", keyDown);
        window.addEventListener("keyup", keyUp);
    }, 1100);

}
let x = 0;
window.setInterval(() => {
    ctx_1.reset();
    if (map_x > 0) {
        map_x = 0;
        ctx.drawImage(background, 0, map_y);
        ctx_1.drawImage(character, megaman.default_x, megaman.default_y);

    }
    else {
        ctx.drawImage(background, map_x, map_y);
        ctx_1.drawImage(character, megaman.default_x, megaman.default_y);
        ctx_2.drawImage(enemyImg, enemy_Soldier.x + map_x, enemy_Soldier.y);
        enemy_Robots.forEach((enemy, index) => {
            ctx_3.drawImage(enemyImgs[index], enemy_Robots[index].x + map_x, enemy_Robots[index].y);
        });
    }
    if (map_x <= -370 && map_x >= -890) {
        ctx.reset();
        let x = 370 + map_x;
        map_y = x / 4;
        ctx.drawImage(background, map_x, map_y);
        ctx_1.drawImage(character, megaman.default_x, megaman.default_y);
        ctx_2.drawImage(enemyImg, enemy_Soldier.x + map_x, enemy_Soldier.y + map_y);
        enemy_Robots.forEach((enemy, index) => {
            ctx_3.drawImage(enemyImgs[index], enemy_Robots[index].x + map_x, enemy_Robots[index].y + map_y);
        });
    }
    else {
        ctx_3.reset();
        ctx.drawImage(background, map_x, map_y);
        ctx_1.drawImage(character, megaman.default_x, megaman.default_y);
        ctx_2.drawImage(enemyImg, enemy_Soldier.x + map_x, enemy_Soldier.y + map_y);
        enemy_Robots.forEach((enemy, index) => {
            ctx_3.drawImage(enemyImgs[index], enemy_Robots[index].x + map_x, enemy_Robots[index].y + map_y);
        });
    }
    if (map_x <= -1230) {
        if (enemy_Soldier.x < 0) {
            ctx.reset();
            speed_X = 0;
            clearInterval(myInterval_4);
            myInterval_4 = setInterval(() => {
                count_open_door++;
                let s = parseInt(count_open_door / 20);
                doorImg.src = `png/Map/Door/${s}.png`
                if (count_open_door >= 12 * 20) {
                    doorImg.src = `png/Map/Door/12.png`
                }
                ctx_1.drawImage(character, megaman.default_x + count_open_door, megaman.default_y);
            }, 1);
            window.removeEventListener("keydown", keyDown);
            window.removeEventListener("keyup", keyUp);
            megaman.x_Moving();
            ctx.drawImage(background, map_x, map_y);
            if (count_open_door > 600) {
                window.location = "./screen3.html";
            }
        }
        else {
            map_x += speed_X + 2;
        }
    }
    ctx_6.drawImage(doorImg, door.x + map_x, door.y + map_y);

    ctx.drawImage(hpBar, 10, 10);
    ctx.drawImage(game_Over, WIDTH_CANVAS / 2 - width_img_gameover, 20);
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
