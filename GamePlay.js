document.getElementById('canvas').style.display = 'none';
document.getElementById('PlayGame2').style.display = 'none';


var myCannon;
var mybubble = [];
var easiness;
var mybullet = [];
var myScore;
var flag;
var pause;


  if(localStorage.getItem("wannaReplay")===1)
  {
   var selfclicker = document.getElementById("PlayGame1");
   selfclicker.click();
  }


document.getElementById("PlayGame1").onclick = function() {
  localStorage.setItem("wannaReplay",0);
  document.getElementById('loadtext').style.display = 'none';
  document.getElementById('PlayGame1').style.display = 'none';
  document.getElementById('inst').style.display = 'none';
  document.getElementById('canvas').style.display = 'block';
  document.getElementById('screen1').style.display = 'none';

  gameArea.start();
};
document.getElementById("PlayGame2").onclick = function() {
  localStorage.setItem("wannaReplay",1);
  location.reload();

};

gameArea = {
  canvas: document.getElementById('canvas'),

  start: function() {
    this.canvas.width = 500;
    this.canvas.height = innerHeight - 20;
    this.context = this.canvas.getContext("2d");
    easiness = 500;
    flag=0;
    pause=false;
    myCannon = new cannon(210, innerHeight - 50, 80, 30);
    myScore = new score(375, 30);
    myCannon.cannonDraw();
    if (sessionStorage.getItem("Highscore") == null) {
      sessionStorage.setItem("Highscore", 0);
    }

    var interval = setInterval(gameupdater, 20);
    this.frameNo = 1;

    window.addEventListener("keydown", function(e) {
      gameArea.keys = (gameArea.keys || []);
      gameArea.keys[e.keyCode] = true;
    });
    window.addEventListener("keyup", function(e) {
      gameArea.keys[e.keyCode] = false;
    });

  },
  clear: function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
  resume: function()
	 {
		 interval=setInterval(updateGameArea,20);
	 },
  stop: function() {
    clearInterval(this.interval);
  }

};

//--------------------------Cannon-------------------------//
function cannon(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.move = 0;

  this.cannonDraw = function() {
    var ctx = gameArea.context;
    ctx.fillStyle = "#ff4949";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  };

  this.newPos = function() {
    if (this.move > 0) {
      if (this.x + this.width < gameArea.canvas.width)
        this.x += this.move;
    } else if (this.move < 0) {
      if (this.x > 0)
        this.x += this.move;
    }
  };
  this.crashWith = function(object) {
    var crash = false;

    if (object.x < this.x + this.width + object.radius && object.x > this.x - object.radius &&
      object.y < this.y + this.height + object.radius && object.y > this.y - object.radius)

      crash = true;

    return crash;
  };
}
//--------------------------Bullet-------------------------//
function bullet(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.alive=1;

  this.bulletDraw = function() {
    var ctx = gameArea.context;
    ctx.fillStyle = "#fcd307";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  };

  this.newPos = function() {
    this.y -= 10;
  };
}
//--------------------------Score-------------------------//
function score(x, y, width, height) {
  this.x = x;
  this.y = y;

  this.update = function() {
    ctx = gameArea.context;
    ctx.fillStyle = "black";
    ctx.font = "20px Times New Roman";
    ctx.fillText(this.scoreText, this.x, this.y);
  };
}
//--------------------------Bubbles-------------------------//
function bubble(x, y, radius, x_velocity) {
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.x_velocity = x_velocity;
  this.y_velocity = 0;
  this.alive = 1;
  this.crash=0;

  this.bubbleDraw = function() {
    ctx = gameArea.context;
    ctx.beginPath();
    ctx.fillStyle = "#6c5ce7";
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.closePath();
  };
  this.newPos = function() {
    if (this.y >= innerHeight - 20 - this.radius) {
      this.y_velocity = -1 * this.y_velocity;
    } else
      this.y_velocity += 0.2;

    if (this.x > 500 - this.radius) {
      this.x_velocity *= -1;
    }
    if (this.x < 0 + this.radius) {
      this.x_velocity *= -1;
    }
    this.x += this.x_velocity;
    this.y += this.y_velocity;
  };

  this.crashWith = function(object) {
    this.crash=false;

    var distX = Math.abs(this.x - object.x-object.width/2);
    var distY = Math.abs(this.y - object.y-object.height/2);

    if (distX > (object.width/2 + this.radius)) { return false; }
    if (distY > (object.height/2 + this.radius)) { return false; }

    if (distX <= (object.width/2)) { return true; }
    if (distY <= (object.height/2)) { return true; }

    var dx=distX-object.width/2;
    var dy=distY-object.height/2;
    if(dx*dx+dy*dy<=(this.radius*this.radius))
    {this.crash=true;}

    return this.crash;
  };

  this.strike = function(object) {
    object.alive = 0;
    this.radius -= 1;
    if(this.radius <=15)
      this.alive = 0;
  };
}
//--------------------------Game Updater-------------------------//
function gameupdater() {

  for (var i = 0; i < mybubble.length; i++) {
    if(mybubble[i].alive==1)
    {
    if (myCannon.crashWith(mybubble[i])) {
      if (flag > (sessionStorage.getItem("Highscore")))
        sessionStorage.setItem("Highscore", flag);
      gameArea.stop();
      doThis();
      return;
     }
    }
  }
function doThis(){
  document.getElementById('loadtext').style.display = 'block';
  document.getElementById('PlayGame2').style.display = 'block';
  document.getElementById('inst').style.display = 'block';
  document.getElementById('canvas').style.display = 'none';
  document.getElementById('screen1').style.display = 'block';
  document.getElementById('loadtext').innerHTML="Cannon Crashed!!";
  document.getElementById('inst').innerHTML="Your Score is : "+flag;
  document.getElementById('PlayGame2').innerHTML="Start a New Game";
}

  for (i = 0; i < mybubble.length; i++) {
    for (var j = 0; j < mybullet.length; j++) {
      if (mybubble[i].alive == 1 && mybullet[j].alive == 1)
      {
        if (mybubble[i].crashWith(mybullet[j])) {
          mybubble[i].strike(mybullet[j]);
          flag++;
        }
      }
    }
  }
  gameArea.clear();

  myCannon.move = 0;
  if (gameArea.keys && gameArea.keys[37] == true) {
    moveLeft();
  }
  if (gameArea.keys && gameArea.keys[39] == true) {
    moveRight();
  }
  if (gameArea.keys && gameArea.keys[39] == true) {
    pauseGame();
  }
  if (gameArea.keys && gameArea.keys[82] == true) {
    resumeGame();
  }
  var a;
  if(flag<30)
  a=7;
  else if(flag<60)
  a=6;
  else if(flag<90)
  a=5;
  else if(flag<120)
  a=4;
  else
  a=3;
  if (gameArea.keys && gameArea.keys[32] == true && gameArea.frameNo % a == 0) {
    mybullet.push(new bullet(myCannon.x + myCannon.width / 2 - 5, myCannon.y, 10, 20));
  }

  gameArea.frameNo += 1;
  if (gameArea.frameNo == 2 || gameArea.frameNo % easiness == 0) {
    var rad = 15 + Math.floor(Math.random() * 20);
    mybubble.push(new bubble(rad + 5, 40, rad, 5));
    if (easiness > 50) {
      easiness -= 20;
    }
  }

  for (i = 0; i < mybubble.length; i++) {
    if(mybubble[i].alive==1)
    {
    mybubble[i].newPos();
    mybubble[i].bubbleDraw();
    }
  }

  for (i = 0; i < mybullet.length; i++) {
    if(mybullet[i].alive==1)
    {
    mybullet[i].newPos();
    mybullet[i].bulletDraw();
    }
  }

  myCannon.newPos();
  myCannon.cannonDraw();
  myScore.scoreText = "SCORE :" + flag;
  myScore.update();

}

function moveLeft() {
  myCannon.move = -15;
}

function moveRight() {
  myCannon.move = +15;
}

function pauseGame()
 {
	 if (!pause)
	 {
	 pause=true;
	 gameArea.stop();
	 return;
	 }
 }

function resumeGame()
{
	 if(pause)
	 {
     pause=false;
	   gameArea.resume();
		 return;
    }
  }
