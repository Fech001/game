var PLAY = 1;
var END = 0;
var gameState = PLAY;


var character, character_running, character_collided;
var backgroundImg;
var score = 0;
var carsGroup, car1, car2;
var jumpSound, collidedSound;
var ground, groundImg

var gameOver, restart;



function preload() {
  
  jumpSound = loadSound("jumpingSound.wav")
  collidedSound = loadSound("collidedSound.wav")
  
  backgroundImg = loadImage("backgroundImg.png")
  
  character_running = loadAnimation("character1.png","character2.png");
  character_collided = loadAnimation("collided.png");
  
  groundImage = loadImage("ground.png");
  
  car1 = loadImage("car1.png");
  car2 = loadImage("car2.png")
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  character = createSprite(50,height-70,20,50);
  
  
  character.addAnimation("running", character_running);
  character.addAnimation("collided", character_collided);
  character.setCollider('circle',0,0,350)
  character.scale = 0.1;
  
  invisibleGround = createSprite(width/2,height-10,width,125);  
  invisibleGround.shapeColor = "white";
  
  ground = createSprite(width/2,height/1.05,width,2);
  ground.addImage("ground",groundImage);
  ground.x = width/2
  ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(width/2,height/2- 50);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.1;

  gameOver.visible = false;
  restart.visible = false;
  
 
  // invisibleGround.visible =false

  carsGroup = new Group();
  
  score = 0;
}

function draw() {
  //trex.debug = true;
  background(backgroundImg);
  textSize(20);
  fill("black")
  text("Score: "+ score,30,50);
  
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
    
    if((touches.length > 0 || keyDown("SPACE")) && character.y  >= height-120) {
      jumpSound.play( )
      character.velocityY = -10;
       touches = [];
    }
    
    character.velocityY = character.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    character.collide(invisibleGround);
    spawnCars();
  
  
    if(carsGroup.isTouching(character)){
        collidedSound.play()
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    character.velocityY = 0;
    carsGroup.setVelocityXEach(0);
    
    //change the trex animation
    character.changeAnimation("collided",character_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    
    carsGroup.setLifetimeEach(-1);
    
    if(touches.length>0 || keyDown("SPACE") || mousePressedOver(restart)) {      
      reset();
      touches = []
    }
  }
  
  
  drawSprites();
}

function spawnCars() {
  if(frameCount % 90 === 0) {
    var car = createSprite(1700,height-95,20,30);
    car.setCollider('circle',0,0,45)
    // obstacle.debug = true
  
    car.velocityX = -(6 + 3*score/500);
    
    //generate random obstacles
    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: car.addImage(car1);
              break;
      case 2: car.addImage(car2);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    car.scale = 0.08;
    car.lifetime = 300;
    car.depth = character.depth;
    character.depth +=1;
    //add each obstacle to the group
    carsGroup.add(car);
  }
}


function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  
  carsGroup.destroyEach();
  
  character.changeAnimation("running",character_running);
  
  score = 0;
  
}

  