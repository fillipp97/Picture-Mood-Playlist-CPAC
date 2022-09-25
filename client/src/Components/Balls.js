import React from "react";
import Sketch from "react-p5";
import p5Types from "p5";
import { BackgroundColor, PrimaryColor, SecondaryColor } from "../Styled/Colors.styled"
import { useEffect, useState } from "react";
import "./Balls.css"

let numBalls = 25;
let balls = [];
let gravity = -0.2;  //-0.3
let damping = 0.9;  //0.8

export default (props) => {
    let images = []
    function windowResized(p5) {

        p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
    }

    const preload = async (p5) => {
        for (let i = 0; i < numBalls; i++) {
            let image = await p5.loadImage(props.songs[i].track.album.images[2].url)
            console.log(image)
            images.push(image)
        }

    }

    const mouseReleased = (p5) => {
        for (let i = 0; i < numBalls; i++) {
            balls[i].released(p5.mouseX, p5.mouseY);
        }
    }
    const mousePressed = (_p5, event) => {
        if (event.button === 0) {
            for (let i = 0; i < numBalls; i++) {
                balls[i].clicked(_p5.mouseX, _p5.mouseY);
            }
        }
        if (event.button === 1) {
            for (let i = 0; i < numBalls; i++) {
                balls[i].vel = _p5.constructor.Vector.random2D().mult(_p5.random(20, 90));
            }
        }
    }
    const setup = (p5, canvasParentRef) => {
        // use parent to render the canvas in this ref
        // (without that p5 will render the canvas outside of your component)
        p5.createCanvas(p5.windowWidth, p5.windowHeight, p5.WEBGL).parent(canvasParentRef);

        // console.log(urls)
        for (let i = 0; i < numBalls; i++) {
            balls.push(new Ball(
                p5.createVector(p5.random(-(p5.windowWidth / 2), (p5.windowWidth / 2)), p5.random(-(p5.windowHeight / 2), (p5.windowHeight / 2))),
                p5.constructor.Vector.random2D().mult(p5.random(10)),
                p5.random(50, 80),
                images[i % images.length],
                p5
            ));


        }


    };



    const draw = (p5) => {
        p5.background(BackgroundColor);

        for (let i = 0; i < balls.length; i++) {
            for (let j = 0; j < i; j++) {
                balls[i].res_penetration(balls[j])
                balls[i].collide(balls[j]);


            }
        }
        // let ballArea = balls.map((ball) => { return 2 * 3.14 * ball.radius ^ 2 })
        // let totalBalls = ballArea.reduce((partial, x) => partial + x, 0)

        // if (p5.windowHeight * p5.windowWidth <= 10 * totalBalls) {
        //     balls.pop()
        // }


        for (let i = 0; i < balls.length; i++) {
            balls[i].move();
            balls[i].render();

        }



    };

    return <Sketch preload={preload} setup={setup} draw={draw} windowResized={windowResized} mouseReleased={mouseReleased} mousePressed={mousePressed} />;
};



class Ball {
    constructor(pos, vel, radius, url, p5) {
        this.dragging = false;
        this.pos = pos;
        this.vel = vel;
        this.pvel = 0;
        this.radius = radius; // Can be interpreted as mass
        this.color = [p5.random(255), p5.random(255), p5.random(255)];
        this.p5 = p5;
        this.image = url
        this.asleep = false;
    }
    collide(other) {
        if (other == this) {
            return;
        }
        let relative = this.p5.constructor.Vector.sub(other.pos, this.pos);
        let dist = relative.mag() - (this.radius + other.radius);
        if (dist < 0) {
            this.res_penetration(other)
            let movement = relative.copy().setMag(this.p5.abs(dist / 2));
            this.pos.sub(movement);
            other.pos.add(movement);

            let thisToOtherNormal = relative.copy().normalize();
            let approachSpeed = this.vel.dot(thisToOtherNormal) + -other.vel.dot(thisToOtherNormal) * damping;
            let approachVector = thisToOtherNormal.copy().setMag(approachSpeed);

            this.vel.sub(approachVector);
            other.vel.add(approachVector);
            // console.log(this.asleep)
            if (this.vel.mag() <= 0.5) {
                this.asleep = true;
                this.pvel = this.vel
            } else {
                this.asleep = false;
            }
        }
    }

    res_penetration(other) {
        let relative = this.p5.constructor.Vector.sub(other.pos, this.pos);
        let dist = relative.mag();
        let pen_depth = this.radius + other.radius - dist;
        // console.log(pen_depth)
        let dir = relative.setMag(1);
        let pen_res = dir.mult(pen_depth / 2)
        if (pen_res > 0) {
            this.pos = this.pos.add(pen_res)
            other.pos = other.pos.add(pen_res.mult(-1))
        }
    }

    clicked(x, y) {
        let X = x - (this.p5.windowWidth / 2)
        let Y = y - (this.p5.windowHeight / 2)
        let d = this.p5.dist(X, Y, this.pos.x, this.pos.y)
        // console.log(d)
        if (d < this.radius) {
            console.log("You clicked a Ball")
            this.dragging = true;
            this.pos.x = X;
            this.pos.y = Y;
        } else {
            this.dragging = false;
        }
    }

    released(x, y) {
        if (this.dragging) {
            let X = x - (this.p5.windowWidth / 2)
            let Y = y - (this.p5.windowHeight / 2)

            this.pos.x = X;

            this.pos.y = Y;



            this.dragging = false;
        }
    }


    move() {
        // this.vel.y += 0.1;
        if (this.dragging) {
            this.pos.x = this.p5.mouseX - this.p5.windowWidth / 2;
            this.pos.y = this.p5.mouseY - this.p5.windowHeight / 2;
            this.vel.x = (this.p5.mouseX - this.p5.pmouseX);
            this.vel.y = (this.p5.mouseY - this.p5.pmouseY);
        } else {
            this.vel.y -= gravity
            this.pos.add(this.vel);
        }
        if (this.pos.x < -(this.p5.windowWidth / 2) + this.radius) {

            this.pos.x = -(this.p5.windowWidth / 2) + this.radius;
            this.vel.x = -this.vel.x * damping;
            this.dragging = false;
        }
        if (this.pos.x > (this.p5.windowWidth / 2) - this.radius) {

            this.pos.x = (this.p5.windowWidth / 2) - this.radius;
            this.vel.x = -this.vel.x * damping;
            this.dragging = false;
        }
        if (this.pos.y < -(this.p5.windowHeight / 2) + this.radius) {

            this.pos.y = -(this.p5.windowHeight / 2) + this.radius;
            this.vel.y = -this.vel.y * damping;
            this.dragging = false;
        }
        if (this.pos.y > (this.p5.windowHeight / 2) - this.radius) {

            this.pos.y = (this.p5.windowHeight / 2) - this.radius;
            this.vel.y = -this.vel.y * damping;
            this.dragging = false;

        }

    }
    render() {
        this.p5.fill(this.color);
        this.p5.ellipse(this.pos.x, this.pos.y, this.radius * 2);
        this.p5.stroke(255)
        this.p5.strokeWeight(5)
        // this.p5.texture(this.image);


    }
}


