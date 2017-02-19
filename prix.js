/**
 * Created by Nick on 18/02/17.
 */

var innerWidth = window.innerWidth;
var innerHeight = window.innerHeight;
var gameRatio = innerWidth/innerHeight;

var game = new Phaser.Game(900, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

var bolt = null;

function preload() {
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.load.image('track', 'assets/track.png');
    game.load.image('finishline', 'assets/finish-line.png');
    game.load.image('backdrop', 'assets/backdrop.png');
    game.load.spritesheet('bolt', 'assets/bolt_anim.png', 173, 182);
    game.load.spritesheet('runner1', 'assets/girl_anim.png', 173, 182);
    game.load.spritesheet('runner2', 'assets/girl_anim.png', 173, 182);
    cursors = game.input.keyboard.createCursorKeys();
    timerStarted = false;
}

function create() {
    backdrop1 = game.add.tileSprite(0, 0, 8192, 512, 'backdrop');
    racetrack = game.add.sprite(0, 255, 'track');
    racetrack.scale.setTo(8,1);
    finishline = game.add.sprite(6400, 264, 'finishline');
    finishline.scale.setTo(1,0.98);

    runner2 = game.add.sprite(32, 600 - 425, 'runner2');
    runner2.scale.setTo(0.75,0.75);
    bolt = game.add.sprite(27, 600 - 365, 'bolt');
    bolt.scale.setTo(0.75,0.75);
    runner1 = game.add.sprite(32, 600 - 300, 'runner1');
    runner1.scale.setTo(0.75,0.75);

    game.physics.arcade.enable(bolt);
    game.physics.arcade.enable(runner1);
    game.physics.arcade.enable(runner2);

    game.world.setBounds(0, 0, 6700, 600);

    fbLoggedIn = false;

    var bolt_start = bolt.animations.add('start', [1, 2, 3, 4, 5, 6, 7], 12, true);
    var bolt_run = bolt.animations.add('run', [8, 9 , 10, 11, 12, 13, 14], 12, true);

    var runner1_start = runner1.animations.add('start', [1, 2, 3, 4, 5, 6, 7], 12, true);
    var runner1_run = runner1.animations.add('run', [8, 9 , 10, 11, 12, 13, 14], 12, true);

    var runner2_start = runner2.animations.add('start', [1, 2, 3, 4, 5, 6, 7], 12, true);
    var runner2_run = runner2.animations.add('run', [8, 9 , 10, 11, 12, 13, 14], 12, true);

    controller = game.input.keyboard.addKeys({enterKey : Phaser.KeyCode.ENTER, escKey : Phaser.KeyCode.ESC});

    timerText = game.add.text(790, 10, "0.00 s", {fill:"#fff"});

    userName = game.add.text(bolt.position.x, bolt.position.y, "", {fill:"#fff"});

    timerText.fixedToCamera = true;

    timer = 0.00;

    bolt_start.onComplete.add(function () {
        bolt.animations.play('run', 25, true);
        bolt.body.velocity.x = 480;
    }, this);

    runner1_start.onComplete.add(function () {
        runner1.animations.play('run', 25, true);
        runner1.body.velocity.x = 475;
    }, this);

    runner2_start.onComplete.add(function () {
        runner2.animations.play('run', 25, true);
        runner2.body.velocity.x = 472;
    }, this);

    timerText.text = timer.toFixed(2) + " s";

    game.camera.follow(bolt);

}

function update() {

    if (typeof(FB) !== "undefined" && !fbLoggedIn) {
        console.log("Hello");
        FB.getLoginStatus(function(response) {
            console.log("Goodbye");
            if (response.status === 'connected') {
                console.log('Logged in.');
                FB.api('/me', function(response) {
                    console.log(response);
                    userName.text = response.name.split(' ')[0];
                    //alert("Name: "+ response.name + "\nFirst name: "+ response.first_name + "ID: "+response.id);
                    //var img_link = "http://graph.facebook.com/"+response.id+"/picture"
                });
            }
            else {
                FB.login();
                fbLoggedIn = true;
            }
        });
    }

    //game.camera.x += 10;

    if (bolt.x > 6400) timerStarted = false;

    if (timerStarted) timerText.text = timer.toFixed(2) + " s";

    if (controller.enterKey.isDown) {

        bolt.animations.play('start', 18, false);
        bolt.body.velocity.x = 480;

        setTimeout(function () {
            runner1.body.velocity.x = 480;
            runner1.animations.play('start', 18, false)
        }, 100);

        setTimeout(function () {
            runner2.body.velocity.x = 472;
            runner2.animations.play('start', 18, false)
        }, 150);

        if (!timerStarted) {
            stopwatch = setInterval(function(){ timer += 0.01; }, 10);
            //systemclock = setInterval(function(){ gameclock += 0.01; }, 10);
            timerStarted = true;
        }
        else if (bolt.x > 300) backdrop1.tilePosition.x += 2;
    }

    if (controller.escKey.isDown) {
        clearInterval(stopwatch);
        game.state.restart();
    }

    if (timerStarted) {
        if (!cursors.right.isDown || cursors.right.duration > 250) {
            bolt.body.velocity.x = bolt.body.velocity.x - 2;
        }
        else {
            if (bolt.body.velocity.x < 500) bolt.body.velocity.x += 4;
        }
    }

    /*
     bolt.body.velocity.x = 0;

     timerText.text = timer.toFixed(2) + " s";

     if (controller.enterKey.isDown) {

     if (!timerStarted) {
     setInterval(function(){ timer += 0.01; }, 10);
     timerStarted = true;
     }

     //runner1.animations.play('run', 10, true);
     runner2.animations.play('run', 10, true);
     runner3.animations.play('run', 10, true);
     runner4.animations.play('run', 10, true);

     //runner1.body.velocity.x = Math.floor(Math.random() * (100 - 85 + 1)) + 85;
     runner2.body.velocity.x = Math.floor(Math.random() * (100 - 85 + 1)) + 85;
     runner3.body.velocity.x = Math.floor(Math.random() * (100 - 85 + 1)) + 85;
     runner4.body.velocity.x = Math.floor(Math.random() * (100 - 85 + 1)) + 85;
     }

     if (cursors.right.isDown)
     {
     if (bolt.scale.x < 0) bolt.scale.x *=-1;
     //  Move to the right
     bolt.body.velocity.x = 120;

     bolt.animations.play('run');
     }
     else if (cursors.left.isDown)
     {
     if (bolt.scale.x > 0) bolt.scale.x *=-1;
     //  Move to the right
     //bolt.body.velocity.x = -25;

     bolt.animations.play('run');
     }
     else bolt.animations.stop('run');

     */
}