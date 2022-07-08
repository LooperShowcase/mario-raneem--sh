kaboom({
  global: true,
  scale: 2,
  fullscreen: true,
  clearColor: [0, 1, 0.3, 1],
  debug: true,
});

loadRoot("./sprites/");

loadSprite("spongebob", "spongebob.png");
loadSprite("surprise", "surprise.png");
loadSprite("mario", "mario.png");
loadSprite("block", "block.png");
loadSprite("coin", "coin.png");
loadSprite("mushroom", "mushroom.png");
loadSprite("unboxed", "unboxed.png");
loadSprite("goomba","evil_mushroom.png");
loadSprite("castle","castle.png");

loadSound("gamesound", "gameSound.mp3");
loadSound("jumpsound", "jumpSound.mp3");

scene("begin",() => {
  add([
    text("welcome to super morio bros", 20),
    origin("center"),
    pos(width()/2,height()/2 -100),
  ]);
  const btn=add([rect(80,60),
    origin("center"),
    pos(width()/2,height()/2) ,
  ]);
  
  add([
    text("start",14),
    origin("center"),
    pos(width()/2,height()/2),
    color(0.1,0.1,0.1),
  ]);
  btn.action(() => {
    if (btn.isHovered()){
      btn.color=rgb(0.5,0.5,0.5);
      if(mouseIsClicked()){
      go("game");
    }
    }else{
      btn.color=rgb(1,1,1);
    }
  
    
  })
});



scene("over", (score) =>
{
  add([
    text("game over! \n\nscore:"+ score ,24),
    origin("center"),
    pos(width() / 2 , height() / 2 )

  ]);
  scene("win",(score)=>{
    add([
      text("you win\n score:"+score,24),
      origin("centre"),
      pos(width()/2,heght()/2)
    ])
  })
});


scene("game", () => {
  layers(["bg", "obj", "ui"], "obj");
  
  const key = {
    height: 20,
    width: 20,
    "=": [sprite("block"), solid()],
    "?": [sprite("surprise"), solid(), "surprise-coin"],
    "!": [sprite("surprise"), solid(), "surprise-mushroom"],
    $: [sprite("coin"), "coin"],
    m: [sprite("mushroom"), "mushroom",body(),solid()],
    x: [sprite("unboxed"), solid()],
    "^":[sprite("goomba"),solid(), body(),"goomba"],
    "C":[sprite("castle"),solid(),body()],
  };

  const map = [
    "                                                                                                                       ",
    "                                                                                                                       ",
    "                                                                                                                       ",
    "                                                                                                                       ",
    "                                                                                                                       ",
    "                                                                                                                       ",
    "                                                                                                                       ",
    "                                                                                                                       ",
    "                                                                                                                       ",
    "                                        ==?             =====?                                                         ",
    "                                !==                                                                                 C   ",
    "                       ===               ^         =======                                                             ",
    "                                    ^                        ===                                                       ",
    "===========================================================================  ==========================================",   
    "===========================================================================  ==========================================",
    "===========================================================================  ==========================================",
  ];

  const gameLevel = addLevel(map, key);

  const jumpforce = 360;
  const speed = 120;
  let score=0
  const player = add([
    sprite("mario"),
    solid(),
    pos(30, 0),
    body(),
    origin("bot"),
    big(jumpforce),
  ]);
  const scorelabel=add([
    text("score \n"+ score),
    origin("center"),
    pos(30,230),
    layer("ui"),
    {
      value:score,
    },
  ]);

  keyDown("right", () => {
    player.move(speed, 0);
  });

  keyDown("left", () => {
    player.move(-speed, 0);
  });
  
  keyPress("space", () => {
    if (player.grounded()) {
        isjumping=true;
        player.jump(jumpforce);
        play("jumpsound");
      }
  });


  player.on("headbump", (obj) => {

    if (obj.is("surprise-coin")) {
      gameLevel.spawn("$", obj.gridPos.sub(0, 1));
      destroy(obj);
      gameLevel.spawn("x", obj.gridPos);
    }

    if (obj.is("surprise-mushroom")) {
      gameLevel.spawn("m", obj.gridPos.sub(0, 1));
      destroy(obj);
      gameLevel.spawn("x", obj.gridPos);
    }
  });

  
  player.collides("coin", (x) => {
    destroy(x);
    scorelabel.value+=100;
    scorelabel.taxt="score\n" + scorelabel.value;
  });

  player.collides("mushroom", (x) => {
    destroy(x)
    player.biggify(10);
    scorelabel.value
  });
  
      
  action("mushroom", (x) => {
    x.move(20, 0);
  });

  action('goomba', (x) => {  
    x.move(-20,0);
  });


  player.collides('goomba', (x) => {  
      if(isjumping){
        destroy(x);
      }else{
        destroy(player);
        go("over",scorelabel.value);
      }
  });

  player.action(() =>{
    camPos(player.pos);
    scorelabel.pos.x=player.pos.x -320
    if(player.grounded()){
      isjumping=false;
    }
    else
    {
      isjumping=true;
    }
    if(player.pos.y >= height()+200){
      go("over",scorelabel.value)
    }
    if(player.pos.x>=width()/2  );
  });

});

start("begin");