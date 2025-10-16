import * as THREE from "three";
import { WorldGrid } from "../WorldGrid";
import { Intro } from "./Intro";
import { Castle } from "./ImportSection";

export class Base{
    constructor(scene,camera,controls){
        this.scene = scene
        this.camera = camera
        this.controls = controls
        this.grid = WorldGrid(this.scene,this.controls)
        this.introSection = new Intro(this.scene,this.camera,this.controls)
        this.castleSection = new Castle(this.scene,this.camera,this.controls,this.introSection.getLastPoint())
    }

    update(){
        this.grid.update()
        this.introSection.update()
        this.castleSection.update()
    }
}