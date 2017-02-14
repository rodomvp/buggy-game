var buggy = "bug.png",
	bugsOnScreen = 8,
	bugSize = 80,
	canvasSize = { x: 800, y: 540},
	textMargin = { x: 20, y: 30 },
	score = 0, 
	time = 30,
	speed = 15, 
	bugs = [],
	START_SCREEN = Symbol(),
	GAME_SCREEN = Symbol(),
	RESULTS_SCREEN = Symbol(),
	state = START_SCREEN

function preload() {
	createBugs(bugsOnScreen)
}

function createBugs(count) {
	for (var i = 0; i < count; i++) {
		createNewBug()
	}
}

function createNewBug() {
	var axis = random([-1, 1])
	var direction = random([-1, 1])
	var x
	var y

	if (axis < 0) {
		x = random([bugSize / 2, canvasSize.x - bugSize / 2])
		y = random(bugSize / 2, canvasSize.y - bugSize / 2)
	} else {
		x = random(bugSize / 2, canvasSize.x - bugSize / 2)
		y = random([bugSize / 2, canvasSize.y - bugSize / 2])
	}

	bugs.push(new Bug(buggy, x, y, direction, axis))
}

function setup() {
	createCanvas(canvasSize.x, canvasSize.y)
	imageMode(CENTER)
}

function mouseClicked() {
	if (state == GAME_SCREEN) {
		for (var i = 0; i < bugs.length; i++) {
			if (bugs[i].squish(mouseX, mouseY, i)) {
				break
			}
		}
	}
}

function Bug(imageName, x, y, moving, axis) {
  this.spritesheet = loadImage(imageName)
  this.frame = 0
  this.x = x
  this.y = y
  this.moving = moving
  this.facing = moving
  this.axis = axis
  this.dead = false
  this.deadFrames = 0

  this.draw = function() {
    push()

    if (this.dead) {
      this.deadFrames++

      if (this.deadFrames > 60) {
        this.destroy()
      }
    }

    translate(this.x, this.y)

    if (this.facing < 0) {
      if (this.axis < 0) {
        scale(-1.0, 1.0)
      } else {
        scale(1.0, -1.0)
      }
    }

    if (this.axis > 0) {
      rotate(PI/2)
    }

    if (this.moving == 0) {
      image(this.spritesheet, 0, 0, bugSize, bugSize, 0, 0, bugSize, bugSize)
    } else {
      image(this.spritesheet, 0, 0, bugSize, bugSize, (this.frame + 1) * bugSize, 0, bugSize, bugSize);

      if (frameCount % 4 == 0) {
        this.frame = (this.frame + 1) % 5

        if (axis < 0) {
          this.x = this.x + (speed + score) * this.moving
        } else {
          this.y = this.y + (speed + score) * this.moving
        }

        if (this.axis < 0 && (this.x < 40 || this.x > canvasSize.x - 40)) {
          this.moving = -this.moving
          this.facing = -this.facing
        } else if (this.axis > 0 && (this.y < 40 || this.y > canvasSize.y - 40)) {
          this.moving = -this.moving
          this.facing = -this.facing
        }
      }
    }

    pop()
  }

  this.squish = function(x, y) {
    if (this.x - 40 < x && x < this.x + 40 && this.y - 40 < y && y < this.y + 40) {
      if (!this.dead) {
        this.moving = 0
        this.frame = 3
        this.dead = true
        score++
        return true
      }
    }
    return false
  }

  this.destroy = function() {
    bugs.forEach((bug, i) => {
      if (bug == this) {
        bugs.splice(i, 1)
      }
    })
    createNewBug()
  }
}

function keyPressed(event) {
  switch(event.key) {
    case "p": 
      if (state == START_SCREEN || state == RESULTS_SCREEN) {
        bugs = []
        createBugs(bugsOnScreen)
        score = 0
        state = GAME_SCREEN
      }
      break
    default: break
  }
}

function draw() {
  background(255, 255, 255)

  fill(0, 0, 0)

  if (state == START_SCREEN) {

    bugs.forEach(Bug => Bug.draw())

    fill(0, 0, 0, 125)

    rect(0, 0, canvasSize.x, canvasSize.y)

    fill(0, 0, 0)

    textAlign(CENTER)
    textSize(24)
    text("Bug Squash", canvasSize.x / 2, canvasSize.y / 2 - textMargin.y)
    textSize(17)
    text("You will have 30 seconds to squash as many bugs as possible.", canvasSize.x / 2, canvasSize.y / 2)
    textSize(17)
    text("To begin playing, press P.", canvasSize.x / 2, canvasSize.y / 2 + textMargin.y)

  } else if (state == GAME_SCREEN) {

    if (frameCount % 60 == 0) {
      time--

      if (time == 0) {
        state = RESULTS_SCREEN
      }
    }

    bugs.forEach(Bug => Bug.draw())

    textSize(20)
    textAlign(LEFT)
    
    if (time <= 5) {
      fill(255, 0, 0)
    } else {
      fill(0, 0, 0)
    }

    text("Time: " + time, 20, 30)
    textAlign(RIGHT)

    fill(0, 0, 0)

    text("Score: " + score, canvasSize.x - textMargin.x, textMargin.y)

  } else if (state == RESULTS_SCREEN) {
    
    bugs.forEach(Bug => Bug.draw())

    fill(0, 0, 0, 125)

    rect(0, 0, canvasSize.x, canvasSize.y)

    fill(0, 0, 0)

    textAlign(CENTER)
    textSize(24)
    text("Game Over", canvasSize.x / 2, canvasSize.y / 2 - textMargin.y)
    textSize(17)
    text("Your score: " + score, canvasSize.x / 2, canvasSize.y / 2)
    textSize(17)
    text("Press P to play again.", canvasSize.x / 2, canvasSize.y / 2 + textMargin.y)

  }
}


