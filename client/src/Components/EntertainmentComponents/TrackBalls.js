import React from "react";
import Sketch from "react-p5";
import p5Types from "p5";
import { BackgroundColor, PrimaryColor, SecondaryColor } from "../../Styled/Colors.styled"
import { useEffect, useState } from "react";
import "./TrackBalls.css"

let numBalls = 60;
let balls = [];
let gravity = 0;  //-0.3
let damping = 0.9;  //0.8
let Wdim = 1200
let Hdim = 650


export default (props) => {
    let textures = []
    let songs = []
    let callbackFunc = undefined
    function windowResized(p5) {

        p5.resizeCanvas(Wdim, Hdim);
    }

    const preload = async (p5) => {

        // for (let i = 0; i < props.songs.length; i++) {
        //     let image = await p5.loadImage(props.songs[i].album.images[1].url)

        //     let _background = p5.createGraphics(160, 160);
        //     // let imageProc = brightness(p5, image, 0.4)
        //     let imageProc = image
        //     _background.background(imageProc)
        //     _background.textFont('Source Code Pro');
        //     _background.textAlign(p5.CENTER, p5.CENTER);
        //     _background.textSize(18);
        //     _background.fill(3, 7, 11);
        //     _background.stroke("black");
        //     _background.strokeWeight(2)
        //     _background.fill('wheat')
        //     _background.text(props.songs[i].name.toUpperCase(), 30, 0, 110, 140);
        //     textures.push(_background)
        //     songs.push(props.songs[i])
        //     callbackFunc = props.sendTrackToParent


        // }


    }

    const mouseReleased = (p5) => {
        for (let i = 0; i < props.songs.length; i++) {
            balls[i].released(p5.mouseX, p5.mouseY);
        }
    }
    const mousePressed = (_p5, event) => {
        console.log("MOUSE", _p5.mouseX, _p5.mouseY)
        if (event.button === 0) {
            for (let i = 0; i < props.songs.length; i++) {
                if (balls[i].chosen(_p5.mouseX, _p5.mouseY)) {
                    let index = balls.indexOf(balls[i])
                    if (index > -1) {
                        balls.splice(index, 1)
                    }
                };
            }
        }

        // if (event.button === 2) {

        //     for (let i = 0; i < props.songs.length; i++) {
        //         balls[i].clicked(_p5.mouseX, _p5.mouseY);
        //     }
        // }
        if (event.button === 1) {
            event.preventDefault()
            // for (let i = 0; i < props.songs.length; i++) {
            //     balls[i].vel = _p5.constructor.Vector.random2D().mult(_p5.random(20, 90));
            // }

            for (let i = 0; i < props.songs.length; i++) {
                balls[i].clicked(_p5.mouseX, _p5.mouseY);
            }
        }
    }

    function writeColor(image, x, y, red, green, blue, alpha) {
        let index = (x + y * image.width) * 4;
        image.pixels[index] = red;
        image.pixels[index + 1] = green;
        image.pixels[index + 2] = blue;
        image.pixels[index + 3] = alpha;
    }

    const brightness = (p5, image, alpha) => {
        let x, y;
        image.loadPixels()
        // fill with random colors
        for (y = 0; y < image.height; y++) {
            for (x = 0; x < image.width; x++) {
                let newPixVal = image.get(x, y)
                writeColor(image, x, y, p5.red(newPixVal) * alpha, p5.green(newPixVal) * alpha, p5.blue(newPixVal) * alpha, 255);
            }
        }
        image.updatePixels();
        return image
    }
    const setup = (p5, canvasParentRef) => {
        // use parent to render the canvas in this ref
        // (without that p5 will render the canvas outside of your component)
        //  let foreground = document.getElementsByClassName("foreground")
        // let style = getComputedStyle(foreground)
        // let width = style.getPropertyValue("width")
        // let height = style.getPropertyValue("height")
        p5.createCanvas(Wdim, Hdim, p5.WEBGL).parent(canvasParentRef);

        let dimension = 130
        // console.log(urls)
        for (let i = 0; i < props.songs.length; i++) {
            let _background = p5.createGraphics(160, 160);
            // let imageProc = brightness(p5, image, 0.4)
            // let imageProc = image
            // _background.background(imageProc)
            _background.textFont('Source Code Pro');
            _background.textAlign(p5.CENTER, p5.CENTER);
            _background.textSize(18);
            _background.fill(3, 7, 11);
            _background.stroke("black");
            _background.strokeWeight(2)
            _background.fill('wheat')
            console.log("start")
            let song = props.songs[i]
            console.log(song.name.toUpperCase())
            _background.text(song.name.toUpperCase(), 30, 0, 110, 140);


            balls.push(new Ball(
                p5.createVector(p5.random(-(p5.windowWidth / 2), (p5.windowWidth / 2)), p5.random(-(p5.windowHeight / 2), (p5.windowHeight / 2))),
                p5.constructor.Vector.random2D().mult(p5.random(10)),
                80,
                _background,
                song,
                props.sendTrackToParent,
                p5
            ));
            console.log(props.songs[i].name)
            console.log("-------------------------------------------------------------------------")


        }


    };



    const draw = (p5) => {

        p5.background("#00000081")
        for (let i = 0; i < balls.length; i++) {
            for (let j = 0; j < i; j++) {
                balls[i].res_penetration(balls[j])
                balls[i].collide(balls[j]);


            }
        }

        for (let i = 0; i < balls.length; i++) {
            balls[i].move();
            balls[i].render();

        }



    };

    return <Sketch preload={preload} setup={setup} draw={draw} windowResized={windowResized} mouseReleased={mouseReleased} mousePressed={mousePressed} />;
};



class Ball {
    constructor(pos, vel, radius, texture, songEl, callbackFunc, p5) {
        this.dragging = false;
        this.pos = pos;
        this.vel = vel;
        this.pvel = 0;
        this.radius = radius; // Can be interpreted as mass
        // this.color = [p5.random(255), p5.random(255), p5.random(255)];
        this.p5 = p5;
        this.texture = texture;
        this.songEl = songEl;
        this.callbackFunc = callbackFunc;
        this.asleep = false;
        console.log("Object created With", songEl.name)
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
        let X = x - (Wdim / 2)
        let Y = y - (Hdim / 2)
        let d = this.p5.dist(X, Y, this.pos.x, this.pos.y)
        // console.log(d)
        if (d < this.radius) {
            console.log("You clicked a Ball", this.songEl.name)
            this.dragging = true;
            this.pos.x = X;
            this.pos.y = Y;
        } else {
            this.dragging = false;
        }
    }
    chosen(x, y) {
        let X = x - (Wdim / 2)
        let Y = y - (Hdim / 2)
        let d = this.p5.dist(X, Y, this.pos.x, this.pos.y)
        // console.log(d)
        if (d < this.radius) {
            console.log("You chose a Ball")
            return true
        } else {
            return false
        }
    }


    released(x, y) {
        if (this.dragging) {
            let X = x - (Wdim / 2)
            let Y = y - (Hdim / 2)

            this.pos.x = X;

            this.pos.y = Y;



            this.dragging = false;
        }
    }


    move() {
        // this.vel.y += 0.1;
        if (this.dragging) {
            this.pos.x = this.p5.mouseX - Wdim / 2;
            this.pos.y = this.p5.mouseY - Hdim / 2;
            this.vel.x = (this.p5.mouseX - this.p5.pmouseX);
            this.vel.y = (this.p5.mouseY - this.p5.pmouseY);
        } else {
            this.vel.y -= gravity
            this.pos.add(this.vel);
        }
        if (this.pos.x < -(Wdim / 2) + this.radius) {

            this.pos.x = -(Wdim / 2) + this.radius;
            this.vel.x = -this.vel.x * damping;
            this.dragging = false;
        }
        if (this.pos.x > (Wdim / 2) - this.radius) {

            this.pos.x = (Wdim / 2) - this.radius;
            this.vel.x = -this.vel.x * damping;
            this.dragging = false;
        }
        if (this.pos.y < -(Hdim / 2) + this.radius) {

            this.pos.y = -(Hdim / 2) + this.radius;
            this.vel.y = -this.vel.y * damping;
            this.dragging = false;
        }
        if (this.pos.y > (Hdim / 2) - this.radius) {

            this.pos.y = (Hdim / 2) - this.radius;
            this.vel.y = -this.vel.y * damping;
            this.dragging = false;

        }

    }
    render() {

        // this.p5.fill("#00000069");
        this.p5.ellipse(this.pos.x, this.pos.y, this.radius * 2);
        this.p5.ellipse(this.pos.x, this.pos.y, this.radius * 2);
        this.p5.stroke(255)
        this.p5.strokeWeight(3)
        this.p5.texture(this.texture);
        if (this.songEl.name === "peter pan") {
            console.log(this.pos.x, this.pos.y)
        }
        // this.p5.texture(this.text)


    }
}


