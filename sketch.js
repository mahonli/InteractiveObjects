    //breakout close (core mechanics)
    //mouse to control the paddle, click to start

    /*
    written 2 Oct 2015
    by Tom Igoe
    */

    // Declare a "SerialPort" object
    var serial;
    // fill in the name of your serial port here:
    var portName = "/dev/cu.usbmodem1461";
    var textXpos = 50;
    var paddle, wallTop, wallBottom, wallLeft, wallRight;
    var droppable;
    var MAX_SPEED = 9;
    var WALL_THICKNESS = 30;
    var BRICK_W = 40;
    var BRICK_H = 20;
    var BRICK_MARGIN = 4;
    var ROWS = 9;
    var COLUMNS = 16;
    var SPAWN_COUNT = 5;
    var paddleImage, donutImage, coffeeImage, codeImage;
    var portlist;
    var donutScore = 0;
    var coffeeScore = 0;
    var timer = 30;

    function preload(){
        paddleImage = loadImage("assets/icons8-espresso-cup-100.png");
        donutImage = loadImage("assets/icons8-doughnut-100.png");
        coffeeImage = loadImage("assets/icons8-java-bean-480.png");
        codeImage = loadImage("assets/QR_code.png")
    }

    function setup() {

    //paddleImage.loadPixels();

    createCanvas(800, 600);

    // make an instance of the SerialPort object
    serial = new p5.SerialPort();

    // Get a list the ports available
    // You should have a callback defined to see the results. See gotList, below:
    serial.list();
    
    // Assuming our Arduino is connected,  open the connection to it
    serial.open(portName);

    // When you some data from the serial port
    serial.on('data', gotData);

    // When you get a list of serial ports that are available
    serial.on('list', gotList);

    // When our serial port is opened and ready for read/write
    serial.on('open', gotOpen);

    // create a paddle with sprite
        
    paddle = createSprite(width / 2, height - 50, 100, 100);
    paddle.immovable = true;
    //var paddleImage = loadImage(".\images\logo.png");
    // paddle.shapeColor = color(255, 255, 255);
    //paddle.addImage("starbuckLogo", paddleImage);

    paddle.draw = function(){
        image(paddleImage, 0, 0, this.width, this.height);
    }
        
    wallTop = createSprite(width/2, -WALL_THICKNESS/2, width+WALL_THICKNESS*2, WALL_THICKNESS);
    wallTop.immovable = true;

    wallBottom = createSprite(width/2, height+WALL_THICKNESS/2, width+WALL_THICKNESS*2, WALL_THICKNESS);
    wallBottom.immovable = true;

    wallLeft = createSprite(-WALL_THICKNESS/2, height/2, WALL_THICKNESS, height);
    wallLeft.immovable = true;

    wallRight = createSprite(width+WALL_THICKNESS/2, height/2, WALL_THICKNESS, height);
    wallRight.immovable = true;
    
        
    droppable = new Group();
    setInterval(spawnDropable, 2000);
    setInterval(timerCounter, 1000);
        
        
    //  bricks = new Group();
    //
    //  var offsetX = width/2-(COLUMNS-1)*(BRICK_MARGIN+BRICK_W)/2;
    //  var offsetY = 80;

    //  for(var r = 0; r<ROWS; r++)
    //    for(var c = 0; c<COLUMNS; c++) {
    //      var brick = createSprite(offsetX+c*(BRICK_W+BRICK_MARGIN), offsetY+r*(BRICK_H+BRICK_MARGIN), BRICK_W, BRICK_H);
    //      brick.shapeColor = color(255, 255, 255);
    //      bricks.add(brick);
    //      brick.immovable = true;
    //    }

    //  the easiest way to avoid pesky multiple collision is to
    //  have the ball bigger than the bricks
    //  ball = createSprite(width/2, height-200, 11, 11);
    //  ball.maxSpeed = MAX_SPEED;
    //  paddle.shapeColor = ball.shapeColor = color(255, 255, 255);


    }

    function randomRange(min, max) {
        return Math.random() * (max - min) + min;
    }    


    function spawnDropable(){
        
        console.log("Spawning objects");
        
        for(var i =0; i < SPAWN_COUNT; i++) {
        
            if(Math.random() > 0.5) {
                // spawn donuts
                var donut = createSprite(width * Math.random() ,10, 50, 50);
                donut.maxSpeed = MAX_SPEED;
                donut.setVelocity(randomRange(-5,5), randomRange(5,10));
                
                donut.draw = function(){
                    image(donutImage, 0, 0, this.width, this.height);
                    
                    if(this.position.y > height + 100) this.remove();
                    this.bounce(paddle,paddleHit);
                    this.bounce(wallLeft);
                    this.bounce(wallRight);
                }
                
                donut.myType = "donut";
                
                droppable.add(donut);

            } else {
                // spawn coffee
                var coffee = createSprite(width * Math.random() ,10, 50, 50);
                coffee.maxSpeed = MAX_SPEED;

                coffee.draw = function(){
                    image(coffeeImage, 0, 0, this.width, this.height);
                    
                    if(this.position.y > height + 100) this.remove();
                    this.bounce(paddle,paddleHit);
                    this.bounce(wallLeft);
                    this.bounce(wallRight);
                }
                coffee.setVelocity(randomRange(-5,5), randomRange(5,10));
                
                coffee.myType = "coffee";
                
                droppable.add(coffee);
            }
        }
        
    }

    // Got the list of ports
    function gotList(thelist) {
        
        console.log("List of Serial Ports:");
        // theList is an array of their names
            for (var i = 0; i < thelist.length; i++) {
            // Display in the console
                console.log(i + " " + thelist[i]);
        }
    }

    // We are connected and ready to go
    function serverConnected() {
        print("We are connected!");
    }

    // Called when there is data available from the serial port
    function gotData() {
        var currentString = serial.readLine();  // read the incoming data
        trim(currentString);                    // trim off trailing whitespace
        if (!currentString) return;             // if the incoming string is empty, do no more
        //console.log(currentString);
            if (!isNaN(currentString)) {  // make sure the string is a number (i.e. NOT Not a Number (NaN))
            textXpos = currentString;   // save the currentString to use for the text position in draw()
        }
    }

    // Connected to our serial device
    function gotOpen() {
      print("Serial Port is open!");
    }

    function draw() {
        
        background(173, 216, 230);
        
        if(timer >= 0) {


            //  ball.bounce(wallTop);
            //  ball.bounce(wallBottom);
            //  ball.bounce(wallLeft);
            //  ball.bounce(wallRight);
            //
            //  if(ball.bounce(paddle))
            //  {
            //    var swing = (ball.position.x-paddle.position.x)/3;
            //    ball.setSpeed(MAX_SPEED, ball.getDirection()+swing);
            //  }
            //
            //  ball.bounce(bricks, brickHit);
            drawSprites();
            
            // show text
            textSize(32);
            fill(255, 255, 255);
            text('Timer: ' + timer, width / 2, 60);
            text('Donut: ' + donutScore, 10, 60);
            text('Coffee: ' + coffeeScore, 10, 100);

            paddle.position.x = constrain((textXpos*1.15), paddle.width/2, width-paddle.width/2);
        } else {
            
            textSize(64);
            fill(255, 255, 255);
            
            if(donutScore > coffeeScore) {
                text("You won a donut!",0 ,height / 2);
            } else if(donutScore < coffeeScore){
                text("You won a coffee!", 0, height / 2);

            } else {
                text("You won both!", 0, height / 2);
            }
        }
    }

    function mousePressed() {
        if(timer <= 0) {
            // restart the game
            coffeeScore = 0;
            donutScore = 0;
            timer = 30;
        }
    }


    function timerCounter(){
        if(timer >= 0) timer --;
    }

    function paddleHit(object, paddleObj){
        if(object.myType == "coffee") coffeeScore++;
        if(object.myType == "donut") donutScore++;
        
        object.remove();
    }
