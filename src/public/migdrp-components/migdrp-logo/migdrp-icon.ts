

import { MigdrpFractal , Fractals } from './MigdrpFractal';

import * as THREE from 'three';


import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';




export enum LogoVertexState {
    Reduction = 'reduction',
    Expansion = 'expansion',
    Path = 'path'
}


export class MigdrpIcon extends HTMLElement {


    
    private css():string { 
        return /*html*/ `
        <style>
            :host{
                display:flex;
                justify-content:center;
                align-items:center;
                position:relative;
                margin:0;
                padding:0;

            }
            canvas{
                z-index:1;
            }
            canvas:focus{
                outline:none;
            }
            #migdrp-fractal-circle{
                background-color:var(--migdrp-icon-circle-color, #373737);
                width:70%;
                height:70%;
                display:block;
                position:absolute;
                border-radius:44%;
                z-index:0;
                transition:all .5s ease;
            }

        </style>
        `;
    }

    private html(css:string):string {
        return  /*html*/ `
        ${css}

        <div id="migdrp-fractal-circle"></div>
        `;
    }

    private renderTemplate():void{
        this.attachShadow({mode:'open'});
        const template = this.html(this.css());
        this.shadowRoot.innerHTML += template;

        this.backgroundCircle =  <HTMLDivElement> this.shadowRoot.getElementById('migdrp-fractal-circle');
    }

    private addEventListeners():void {
        window.addEventListener('resize', this.ResizeCanvas(this.renderer, this.camera));
    }


    public Canvas: HTMLCanvasElement;
    public Fractal: MigdrpFractal = new MigdrpFractal(5, 10, Fractals.Quartet);

    private backgroundCircle: HTMLDivElement;
    
    private scene  = new THREE.Scene();
    private camera = new THREE.PerspectiveCamera( 75, this.offsetWidth / this.offsetHeight, 0.1, 1000 );
    private renderer = new THREE.WebGLRenderer( { antialias:true, alpha:true });

    private controls:OrbitControls =  new OrbitControls( this.camera, this.renderer.domElement );

 
    private levelReductionVertices:Array<Array<number>> = [];
    private levelExpansionVertices:Array<Array<number>> = [];
    private levelPathVertices:Array<Array<number>> = [];

    private animationLevel: number = 2;
    private oldAnimationLevel:number  = 1;
    private animation: string = 'growing';
    private animationStep: string = 'one';
    private rotate = true;

    private animationColors = [
        [ .47, .85, .16 ],
        [ .05, .72, .05 ],
        [ .16, .63, .12 ],
        [ .56,   1,   0 ],
        [ 0.51764, 0.78431, 0.16078 ],
        [ 0.33333, 0.73725, 0.26274 ],
        [ 0.19607, 0.57647, 0.09803 ]
    ];
  
    public constructor(){
        super();
        this.renderTemplate();
        this.addEventListeners();
       
        

        this.common();

        this.generateLineNativeLevelVertices();
        
        this.createNativeLine(4);

        this.loop();

        //console.log("Migicon started")
    }

    private common(){

        this.renderer.setClearColor (0xff0000, 0);
        this.renderer.setSize( this.offsetWidth, this.offsetHeight);
        this.renderer.setPixelRatio( window.devicePixelRatio );

        this.shadowRoot.appendChild( this.renderer.domElement );
        
        

        this.camera.position.y = 45;
        
        this.camera.near = 1;
        this.camera.far = 100;
        this.camera.focus = 1000;

        this.controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
        this.controls.dampingFactor = 0.01;
        this.controls.rotateSpeed = 1.5;

        this.controls.enablePan = false;
		this.controls.screenSpacePanning = false;

		this.controls.minDistance = 45;
		this.controls.maxDistance = 60;

        this.controls.maxPolarAngle = 0;
        
        this.camera.aspect = this.offsetWidth /  this.offsetHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize( this.offsetWidth, this.offsetHeight);

    }

    private generateLineNativeLevelVertices(){

        const levels: number = this.Fractal.getMaxLevel();
        //console.log("Level max: ", levels);
        //console.log("Path Points: ", this.Fractal.levelPathPoints)
        //console.log("Expansion Points: ", this.Fractal.levelExpansionPoints)
        //console.log("Reduction Points: ", this.Fractal.levelReductionPoints)
        
        for (var n = 0; n < levels; n++){
            let pathPoints      = this.Fractal.levelPathPoints[n];
            let expansionPoints = this.Fractal.levelExpansionPoints[n];
            let reductionPoints = this.Fractal.levelReductionPoints[n];
            //console.log('Fractal Points:' , fractalPoints);
            let pathVertex = [];
            let expansionVertex = [];
            let reductionVertex = [];
            for(var i = 0; i < pathPoints.length; i++){
                pathVertex.push(pathPoints[i].x);
                pathVertex.push(pathPoints[i].y);
                pathVertex.push(0);
            }
            this.levelPathVertices.push(pathVertex);
            //console.log(`For level ${n} pathVertex: `, pathVertex.length);

            for(var i = 0; i < expansionPoints.length; i++){
                expansionVertex.push(expansionPoints[i].x);
                expansionVertex.push(expansionPoints[i].y);
                expansionVertex.push(0);
            }
            this.levelExpansionVertices.push(expansionVertex);
            //console.log(`For level ${n} expansionVertex: `, expansionVertex.length);

            for(var i = 0; i < reductionPoints.length; i++){
                reductionVertex.push(reductionPoints[i].x);
                reductionVertex.push(reductionPoints[i].y);
                reductionVertex.push(0);
            }
            this.levelReductionVertices.push(reductionVertex);
            //console.log(`For level ${n} reductionVertex: `, reductionVertex.length);
        }
        
    }

    private createNativeLine(startupLevel:number){
        
        var colorsmaterial = new THREE.LineBasicMaterial( { vertexColors: true, morphTargets: true } );

		var colors = [];
        var points = [];

        for (var n = 0; n < this.levelPathVertices[startupLevel].length -2; n+=3){
            points.push( new THREE.Vector3( this.levelPathVertices[startupLevel][n], this.levelPathVertices[startupLevel][n+1], this.levelPathVertices[startupLevel][n+2] ) );
            var random = Math.floor(Math.random() * (7 - 0) + 0 );
            colors.push( this.animationColors[random][0]);
			colors.push( this.animationColors[random][1] );
			colors.push( this.animationColors[random][2] );
        }
        
        var geometry = new THREE.BufferGeometry().setFromPoints( points );
        geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
        
        var line = new THREE.Line( geometry, colorsmaterial );

        line.rotateX(90 * (Math.PI/180))
       
        this.scene.add( line );
    }

    private animationLineNativeTest01(){
        let logoObj = (this.scene.children[0] as any);


        let drawCountPerLevelForLinesNative = [
            {
                reduction:5,
                path:6,
                expansion:21
            },
            {
                reduction:21,
                path:26,
                expansion:101
            },
            {
                reduction:101,
                path:126,
                expansion:501
            },
            {
                reduction:501,
                path:626,
                expansion:2501
            },
            {
                reduction:2501,
                path:3126,
                expansion:12501
            }
        ]


        var time = Date.now() * 0.001;
        var trigonomertyRandom = .8;
        var gainRandom = 1;
        
        var speedChanges =  Math.sqrt((Math.atan( time * trigonomertyRandom) * gainRandom)) - (Math.sin( time * trigonomertyRandom) );
        
        var newAnimLevel:number = this.animationLevel;
        var oldAnimLevel:number = this.oldAnimationLevel;
        var anim = this.animation;
        var animStep = this.animationStep;



        let oldLevelState:LogoVertexState;
        let newLevelState:LogoVertexState;

        let oldVertecesReferences = {
            reduction: this.levelReductionVertices[oldAnimLevel],
            expansion: this.levelExpansionVertices[oldAnimLevel],
            path: this.levelPathVertices[oldAnimLevel]
        }

        let newVertecesReferences = {
            reduction: this.levelReductionVertices[newAnimLevel],
            expansion: this.levelExpansionVertices[newAnimLevel],
            path: this.levelPathVertices[newAnimLevel]
        }

        let oldDrawCount:number;
        let newDrawCount:number;


        if (anim === 'growing'){

            var comparator:number[] = [];
            var speed = .01 * (20 / newAnimLevel) + speedChanges;

            oldLevelState = LogoVertexState.Expansion;
            newLevelState = LogoVertexState.Reduction;

            oldDrawCount = drawCountPerLevelForLinesNative[oldAnimLevel][oldLevelState]
            newDrawCount = drawCountPerLevelForLinesNative[newAnimLevel][newLevelState]

            if (animStep === 'one'){
                // El ciclo asigna a los vertices del objeto las posiciones predefinidas para expandirse al siguiente nivel
                
                logoObj.geometry.setDrawRange( 0, newDrawCount );
                for (var n = 0; n < oldVertecesReferences[oldLevelState].length; n++){
                    logoObj.geometry.attributes.position.array[n]  = oldVertecesReferences[oldLevelState][n];  
                }
                this.animationStep = 'two';
            }
            
            if (animStep === 'two'){
                
                logoObj.geometry.setDrawRange( 0, newDrawCount );
                // El ciclo mueve los vertices asignados en el ciclo anterior a las posiciones del proximo nivel
                for (var n = 0; n < oldVertecesReferences[oldLevelState].length; n++){
                    var d = Math.abs(logoObj.geometry.attributes.position.array[n] - newVertecesReferences[newLevelState][n]);

                    if ( d > .1 * speed){
                        if(logoObj.geometry.attributes.position.array[n] < newVertecesReferences[newLevelState][n]){
                            logoObj.geometry.attributes.position.array[n] += .1 * speed;
                        }
    
                        else if(logoObj.geometry.attributes.position.array[n] > newVertecesReferences[newLevelState][n]){
                            logoObj.geometry.attributes.position.array[n] -= .1 * speed;  
                        }  
                    }
                    else {
                        logoObj.geometry.attributes.position.array[n] = newVertecesReferences[newLevelState][n];
                        comparator.push(1);
                    }
                }

                if(comparator.length === oldVertecesReferences[oldLevelState].length ){
                    comparator = [];
                    this.animationStep = 'one';

                  

                    if (this.animationLevel < Math.floor(Math.random() * (5 - 4) + 4)){
                        this.oldAnimationLevel = this.animationLevel;
                        this.animationLevel ++;
                    } else {
                        this.oldAnimationLevel = this.animationLevel;
                        this.animationLevel --;
                        this.animation = 'shrinking';
                    }
                }
            }
        }

        if (anim === 'shrinking'){

            var comparator:number[] = [];
            var speed = .01 * (20 / oldAnimLevel) + speedChanges;
            oldLevelState = LogoVertexState.Reduction;
            newLevelState = LogoVertexState.Expansion;

            oldDrawCount = drawCountPerLevelForLinesNative[oldAnimLevel][oldLevelState]
            newDrawCount = drawCountPerLevelForLinesNative[newAnimLevel][newLevelState]

            if (animStep === 'one'){
                
                logoObj.geometry.setDrawRange( 0, newDrawCount );
                for (var n = 0; n < oldVertecesReferences[oldLevelState].length; n++){
                    logoObj.geometry.attributes.position.array[n]  = oldVertecesReferences[oldLevelState][n];  
                }
                this.animationStep = 'two';
            }
            
            if (animStep === 'two'){
                
                logoObj.geometry.setDrawRange( 0, newDrawCount );
                for (var n = 0; n < oldVertecesReferences[oldLevelState].length; n++){
                    var d = Math.abs(logoObj.geometry.attributes.position.array[n] - newVertecesReferences[newLevelState][n]);

                    if ( d > .1 * speed){
                        if(logoObj.geometry.attributes.position.array[n] < newVertecesReferences[newLevelState][n]){
                            logoObj.geometry.attributes.position.array[n] += .1 * speed;
                        }
    
                        else if(logoObj.geometry.attributes.position.array[n] > newVertecesReferences[newLevelState][n]){
                            logoObj.geometry.attributes.position.array[n] -= .1 * speed;  
                        }  
                    }
                    else {
                        logoObj.geometry.attributes.position.array[n] = newVertecesReferences[newLevelState][n];
                        comparator.push(1);
                    }
                }

                if(comparator.length === oldVertecesReferences[oldLevelState].length ){
                    comparator = [];
                    this.animationStep = 'one';

                   

                    if (this.animationLevel > Math.floor(Math.random() * (3 - 1) + 1)){
                        this.oldAnimationLevel = this.animationLevel;
                        this.animationLevel --;
                    } else {
                        
                        this.oldAnimationLevel = this.animationLevel;
                        this.animationLevel ++;
                        trigonomertyRandom = Math.random() * (.8 - .2) + .8;
                        gainRandom = Math.random() * (.8 - .5) + .5;
                        this.animation = 'growing';
                        
                    }
                    
                }
            }
        }

       
        if(this.rotate){
            var rz = Math.sin( time * 0.5 ) * 0.01;
            logoObj.rotation.z += rz / (speedChanges * .3);
        }
        
		logoObj.material.size = 1 / (oldAnimLevel * 1);
        logoObj.geometry.attributes.position.needsUpdate = true;
        logoObj.material.needsUpdate = true;

    }

    private loop():void {

        requestAnimationFrame(this.loop.bind(this))

        this.animationLineNativeTest01();
        
        this.controls.update();
        this.renderer.render( this.scene, this.camera );
    }



    private ResizeCanvas ( render:THREE.Renderer, camera:THREE.PerspectiveCamera ){
        return () => {
            //console.log(`Resized canvas from <mig-engine>:   (offsetw:${this.offsetWidth} ,offseth:${this.offsetHeight}) `);
            camera.aspect = this.offsetWidth /  this.offsetHeight;
            camera.updateProjectionMatrix();
            render.setSize( this.offsetWidth, this.offsetHeight);
        }     
    }


}

window.customElements.define('migdrp-icon', MigdrpIcon);