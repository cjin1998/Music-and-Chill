//global stuff

function checkCircleCollision(obj1, obj2) {
	if (obj1.radius === undefined) obj1.radius = 1;
	if (obj2.radius === undefined) obj2.radius = 1;

	let dist = Math.sqrt(Math.pow(obj1.x - obj2.x, 2) + Math.pow(obj1.y - obj2.y, 2));
	return dist < obj1.radius + obj2.radius;
}

class Circle extends Actor {
	constructor(x, y, user = { displayName: 'Anonymous' }) {
		super(x, y);
		this.radius = 75;
		this.targetRadius = this.radius;
		this.xVel = 0;
		this.yVel = -3 * (Math.random() * 0.5 + 0.5);
		this.xVelImpulse = 0;
		this.yVelImpulse = 0;

		this.gradient = this.ctx.createLinearGradient(-this.radius * (Math.random() + 0.2) * 2, -this.radius * (Math.random() + 0.2) * 2, this.radius * (Math.random() + 0.2) * 2, this.radius * (Math.random() + 0.2) * 2);
		this.gradient.addColorStop(0, '#161896');
		// this.gradient.addColorStop(0.32, '#2720DB');
		this.gradient.addColorStop(0.9, '#20B6DB');

		this.moveTimer = 0;

		this.user = user;

		this.userName = new Text(0, -20);
		this.userName.fillStyle = "#FFF";
		this.userName.justify = "center";
		this.userName.text = user.displayName; /////
	}

	update() {
		const prevx = this.x;

		if (mouse.clicking === true && mouse.prevClicking === false && checkCircleCollision(this, mouse)) {
			window.location.href = `/rooms/${this.user._id}`
		}

		//movement and slowing down
		this.x += this.xVel;
		this.y += this.yVel;
		this.xVel *= 0.99;
		this.yVel *= 0.99;

		//bounded on the left and right sides
		if (this.x + this.radius >= window.innerWidth / 2 / FRAME.scaleX || this.x - this.radius <= -window.innerWidth / 2 / FRAME.scaleX) {
			this.x = prevx;
			this.xVel *= -0.5;
		}

		this.xVel += this.xVelImpulse;
		this.yVel += this.yVelImpulse;

		//for font size of center text
		this.userName.setFontSize(this.userName.fontSize + 1);
		while (this.userName.width > this.radius * 1.9) {
			this.userName.setFontSize(this.userName.fontSize - 1);
		}

		//for moving randomly
		this.moveTimer--;
		if (this.moveTimer <= 0) {
			this.xVelImpulse = (Math.random() - 0.5) * 0.01;
			this.yVelImpulse = (Math.random() - 0.9) * 0.01;
			this.moveTimer = 60;
		}

		if (this.y + this.radius <= -window.innerHeight / 2 / FRAME.scaleY) {
			this.dead = true;
		}

		//seperate from any other circles that are overlapping
		for (let i = 0; i < circleCollection.objects.length; i++) {
			if (this !== circleCollection.objects[i] && checkCircleCollision(this, circleCollection.objects[i])) {
				this.xVel -= (circleCollection.objects[i].x - this.x) * 0.0001;
				this.yVel -= (circleCollection.objects[i].y - this.y) * 0.0001;
				circleCollection.objects[i].xVel += (circleCollection.objects[i].x - this.x) * 0.0001;
				circleCollection.objects[i].yVel += (circleCollection.objects[i].y - this.y) * 0.0001;
			}
		}

		//on mouse collision, get bigger and slow down
		if (checkCircleCollision(this, mouse)) {
			this.xVel *= 0.95;
			this.yVel *= 0.95;
			this.targetRadius = 100;
		}
		else {
			this.targetRadius = 75;
		}

		this.radius += (this.targetRadius - this.radius) * 0.1;
	}

	render() {
		this.ctx.shadowBlur = 1;
		this.ctx.shadowOffsetY = 2;
		this.ctx.shadowColor = "#222";
		this.ctx.fillStyle = this.gradient;
		this.ctx.beginPath();
		this.ctx.ellipse(0, 0, this.radius, this.radius, 0, 0, Math.PI * 2);
		this.ctx.fill();
		this.ctx.shadowBlur = 0;
		this.ctx.shadowOffsetY = 0;

		this.userName.draw();
	}
}

class BackgroundGradient extends Actor {
	constructor() {
		super();
		this.width = FRAME.width;
		this.height = FRAME.height;

		this.gradient = this.ctx.createLinearGradient(-500, -500, 500, 500);
		// this.gradient.addColorStop(0.1, '#B76858');
		this.gradient.addColorStop(0.1, '#E44E4E');
		// this.gradient.addColorStop(0.5, '#B76858');
		this.gradient.addColorStop(1, '#4EE4E4');
	}

	update() {
		this.width = window.innerWidth / FRAME.scaleX;
		this.height = window.innerHeight / FRAME.scaleY;
	}

	render() {
		this.ctx.fillStyle = this.gradient;
		this.ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
	}
}

window.onload = function () {
	FRAME.init(800, 600);
	FRAME.defaultFont = 'Open Sans';

	mouse = new Mouse();

	mainCollection = new Collection();
	mainCollection.add(new BackgroundGradient());

	circleCollection = new Collection();

	// circleCollection.add(new Circle((window.innerWidth/FRAME.scaleX-150)*(Math.random()-0.5), 200));
	// circleCollection.add(new Circle((window.innerWidth/FRAME.scaleX-150)*(Math.random()-0.5), 400));

	main();
}

function main() {
	FRAME.clearScreen();
	mouse.update();

	mainCollection.update();
	circleCollection.update();

	if (circleCollection.objects.length < 5) {
		let user = users[Math.floor(Math.random() * users.length)];
		let isGood = true;
		for (let i = 0; i < circleCollection.objects.length; i++) {
			if (user === circleCollection.objects[i].user) {
				isGood = false;
				break;
			}
		}

		if (isGood)
			circleCollection.add(new Circle((window.innerWidth / FRAME.scaleX - 150) * (Math.random() - 0.5), window.innerHeight / FRAME.scaleY / 2 + 75, user));
	}

	mainCollection.draw();
	circleCollection.draw();

	requestFrame(main);
}
