/**
 * WORLD VIEWVER
 * 
 * Draw a view of the world with ThreeJS
 * 
 * how it work:
 * move the camera to the center of the place targeted,
 * ask all the positions vivible from there to the backend service,
 * from all the object sending back, create a instance of objects with MODELS
 * (type will define what type of object must be instancied),
 * store all the objects in a big array called stock.
 * 
 * then if something is changing in world in realtime ?
 * WorldViewver provide functions for adding, removing or updating objects.
 * 
 * WorldViewver alsow provide basics controls to move 
 * and select positions using eventEmitters.
 * 
 */
import { EventEmitter } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import * as THREE from 'three' ;
import {  Material, Vector3 } from 'three';
import { WorldService } from '../../services/world.service';
import { WorldCapital } from './capital.world';
import { WorldChara } from './chara.world';
import { WorldFloor } from './floor.world';
import { WorldModel } from './model.world';
import { WorldMonster } from './monster.world';
import { WorldRes } from './resources.world';
import { WorldTree } from './tree.world';

export class WorldViewer {

    static WorldService : WorldService ;
    static MODELS : {[name : string] : WorldModel } = {};

    static init(worldService : WorldService){

        WorldViewer.WorldService = worldService ;
        WorldRes.init();
        WorldViewer.MODELS = {
            "floor" : new WorldFloor(),
            // "desert" : new WorldFloor(),
            // "deepdesert" : new WorldFloor('deepdesert'),
            // "neutral" : new WorldFloor('neutral'),
            "chara" : new WorldChara(),
            "monster" : new WorldMonster(),
            
            "tree" : new WorldTree(),
            "capital" : new WorldCapital()
        }
        
    }

    camera: THREE.OrthographicCamera ;
    scene : THREE.Scene ;
    renderer : THREE.WebGLRenderer ;
    
    rayon : number = 4 ;
    x : number = 0 ;
    y : number = 0 ;

    selected : WorldModel = null ;
    selectedP : { x : number, y : number } = { x : 0, y : 0};

    moverEmitter : EventEmitter<{x:number,y:number}> = new EventEmitter();
    selectEmitter : EventEmitter<WorldModel[]> = new EventEmitter();
    updateIdEmitter : EventEmitter<any> = new EventEmitter();

    moverX : THREE.Mesh = null ;
    moverMX : THREE.Mesh = null ;
    moverY : THREE.Mesh = null ;
    moverMY : THREE.Mesh = null ;

    private stock : WorldModel[] = [] ;
    animation : ReplaySubject<boolean> = new ReplaySubject();

    constructor( parent : HTMLDivElement, x = 0, y = 0 ){

        this.x = x ;
        this.y = y ;

        const unit = parent.offsetWidth*(25/360) ;
        this.camera = new THREE.OrthographicCamera(
            -parent.offsetWidth/2/unit,
            parent.offsetWidth/2/unit,
            parent.offsetHeight/2/unit,
            -parent.offsetHeight/2/unit,
            0.1,
            1000
        )

        this.scene = new THREE.Scene() ;
        this.renderer = new THREE.WebGLRenderer({
            alpha: true
        });
        this.camera.up.set(0,0,1);

        const geoMover = new THREE.PlaneGeometry(2,2);
        const matMover = WorldRes.MATS['arrow'] ;// new THREE.MeshBasicMaterial ;

        this.moverX = new THREE.Mesh(geoMover, matMover);
        this.moverX.position.x = this.x + this.rayon + 2 ;
        this.moverX.rotation.z = Math.PI ;
        this.moverMX = new THREE.Mesh(geoMover, matMover);
        this.moverMX.position.x = this.x - this.rayon - 2 ;
        this.moverY = new THREE.Mesh(geoMover, matMover);
        this.moverY.rotation.z = -Math.PI/2 ;
        this.moverY.position.y = this.y + this.rayon + 2 ;
        this.moverMY = new THREE.Mesh(geoMover, matMover);
        this.moverMY.position.y = this.y - this.rayon - 2 ;
        this.moverMY.rotation.z = Math.PI/2 ;


        this.scene.add(this.moverX);
        this.scene.add(this.moverMX);
        this.scene.add(this.moverY);
        this.scene.add(this.moverMY);

        this.updateMovers();

        this.renderer.autoClear = false ;
        this.renderer.setClearColor( 0x000000, 0 );
        this.renderer.setSize(parent.offsetWidth, parent.offsetHeight);

        this.camera.position.x = 10 ;
        this.camera.position.y = 10 ;
        this.camera.position.z = 10 ;
        
        this.camera.lookAt(new Vector3(0,0,0));

        this.camera.position.x += this.x ;
        this.camera.position.y += this.y ;

        this.selectedP.x = this.x ;
        this.selectedP.y = this.y ;

        this.renderer.setAnimationLoop( anim => {
            this.animation.next();
            this.renderer.render(this.scene, this.camera);
        });
        this.initCases();

    }
    renderOn( element : HTMLDivElement ){

        const mouse = new THREE.Vector2();
        const rayTracer = new THREE.Raycaster();

        const touchCase = (x:number,y:number): {x:number,y:number} | WorldModel[] => {


            mouse.x = x ;// (event.clientX - element.getBoundingClientRect().left)/element.getBoundingClientRect().width * 2 -1 ;
            mouse.y = y ;//- (event.clientY - element.getBoundingClientRect().top)/element.getBoundingClientRect().height * 2 + 1 ;

            rayTracer.setFromCamera(mouse, this.camera);
            const intercects = rayTracer.intersectObjects(this.scene.children);

            let mover = null ;
            let move = {x : 0, y : 0} ;
            for ( let row of intercects ){
                if ( row.object === this.moverX ){
                    mover = row.object ;
                    move.x = 1 ;
                }else if ( row.object === this.moverMX ){
                    mover = row.object ;
                    move.x = -1 ;
                }else if ( row.object === this.moverY ){
                    mover = row.object ;
                    move.y = 1 ;
                }else if ( row.object === this.moverMY ){
                    mover = row.object ;
                    move.y = -1 ;
                }
            }

            if ( mover ){
                // this.moverEmitter.emit(move);
                return move ;
            }else{

                const targets = this.stock.filter( row => {
                    const isIn = intercects.reduce((acc,rowI) => {
                        if ( rowI.object === row.mesh && row instanceof WorldFloor){
                            acc = true ;
                        }
                        return acc ;
                    }, false);
                    if ( isIn ){
                        return true ;
                    }
                });
     
                return targets ;

            }



        }

        let lastClick = Date.now();

        element.appendChild(this.renderer.domElement );
        element.addEventListener('mousedown', event => {
            lastClick = Date.now();
            mouse.x = (event.clientX - element.getBoundingClientRect().left)/element.getBoundingClientRect().width * 2 -1 ;
            mouse.y = - (event.clientY - element.getBoundingClientRect().top)/element.getBoundingClientRect().height * 2 + 1 ;

            const tch = touchCase(mouse.x,mouse.y) ;
            console.log(tch)
            if ( Array.isArray(tch) ){
                if ( tch.length > 0 ){
                    this.select(tch[0]);
                }
            }else if ( tch ){
                this.moverEmitter.emit(tch);
            }

        });

        let mousOn = null ;

        element.addEventListener('mousemove', event => {

            const mx = (event.clientX - element.getBoundingClientRect().left) ;
            const my = (event.clientY - element.getBoundingClientRect().top) ;
            mouse.x = (event.clientX - element.getBoundingClientRect().left)/element.getBoundingClientRect().width * 2 -1 ;
            mouse.y = - (event.clientY - element.getBoundingClientRect().top)/element.getBoundingClientRect().height * 2 + 1 ;

            let tch = touchCase(mouse.x,mouse.y) ;

            const changMouseOn = (tch) => {
                if ( (!mousOn && tch ) || ( mousOn.x !== tch.x || mousOn.y !== tch.y )){
                    mousOn = tch ;
                    setTimeout(()=> {
                        if ( mousOn === tch && Date.now() - lastClick > 1000){
                            const doc = document.querySelector('#mouseOnPosition') as HTMLDivElement;
                            doc.style.left = `${mx-doc.offsetWidth/2}px` ;
                            doc.style.top = `${my-doc.offsetHeight}px` ;
                            doc.innerHTML = `${-tch.y}x ${-tch.x}y`;
                            doc.style.opacity = "1" ;
                            setTimeout(()=> {
                                doc.style.opacity = "0";
                            },1000);

                            console.log(doc );
                        }
                    },500);
                }
            }

            if ( Array.isArray(tch) ){
                if ( tch.length > 0 ){
                    tch = { x : tch[0].x, y : tch[0].y};
                    changMouseOn(tch);
                }
            }else{
                changMouseOn(tch);
            }



        })
        this.updateSelection();
    }

    updateMovers(){
        this.moverX.position.x = this.x + this.rayon + 2 ;
        this.moverX.position.y = this.y;

        this.moverMX.position.x = this.x - this.rayon - 2 ;
        this.moverMX.position.y = this.y ;


        this.moverY.position.x = this.x ;
        this.moverY.position.y = this.y + this.rayon + 2 ;

        this.moverMY.position.x = this.x ;
        this.moverMY.position.y = this.y - this.rayon - 2 ;
    }
    updateSelection(){

        this.selectByPosition(this.selectedP.x, this.selectedP.y);
    }

    updateById(id:string, obj : any){

        this.stock.map( row  => {
            if ( row['_id'] === id  ){
                const objUpdated = row.update(obj) ;
                this.updateIdEmitter.emit(objUpdated);
                return objUpdated;
            }else{
                return row ;
            }
        });

    }

    private select(target){

        if ( this.selected ){
            (this.selected.mesh.material as THREE.MeshLambertMaterial).emissiveIntensity = 1 ;
        }

        target.mesh.material.emissiveIntensity = 1.5 ;
        this.selected = target ;
        this.selectedP.x = target.x ;
        this.selectedP.y =  target.y

        const selecteds = this.stock.filter( row =>row.x === this.selected.x && row.y === this.selected.y );

        this.selectEmitter.emit(selecteds) ;
       
    }
    selectByPosition(x:number, y:number ){
        const rows = this.stock.filter( row => {
            if( row.x === x && row.y === y && row instanceof WorldFloor ){
                return true ;
            }
            return false ;
        });
        if ( rows.length > 0 ){
            this.select(rows[0]);
        }
    }
    buildObj( key : string, x, y, params ){
        let obj = null ;
        if ( WorldViewer.MODELS[key] ){
            obj = WorldViewer.MODELS[key].create(this.scene,x, y, params);
            if ( obj ){
                this.stock.push(obj);
            }
        }
        return obj ;
    }
    updatesObjs( datas : any[] ){

        console.log('updateObjs', datas);

        this.stock.forEach( obj => {

            datas.forEach( dat => {
                if ( (obj['_id'] && dat['_id'] === obj['_id']) || 
                (obj['datas']['_id'] === dat['_id'])
                ){

                obj.update(dat);
            }

            });

        });


        this.selectByPosition(this.selectedP.x, this.selectedP.y);


    }
    
    initCases(){

        const arr = [] ;
        for ( let x = 0 ; x < this.rayon*2+1 ; x ++ ){
            for ( let y = 0 ; y < this.rayon*2+1 ; y ++ ){
                arr.push({
                    x : this.x + x - this.rayon,
                    y : this.y + y - this.rayon
                })
            }
        }
        WorldViewer.WorldService.getCasesArr(arr, cases => {

            console.log('init cases', cases );

            for ( let cc of cases ){
                this.addInCase(cc.x,cc.y, cc);
            }
            this.updateSelection();
        });

    }
    addInCase(x:number,y:number, datas : { type : string} ){

        const localX = x-this.x+this.rayon;
        const localY = y-this.y+this.rayon;

        if ( localX >= 0 && localX <=  this.rayon*2 && 
            localY >= 0 && localY <= this.rayon*2 ){

                console.log('add ', datas.type);

            this.buildObj(datas.type, x, y, datas );

        }

    }
    isInCases(px: number, py: number ){
        if ( px >= this.x - this.rayon  && px <= this.x + this.rayon 
            && py >= this.y - this.rayon && py <= this.y + this.rayon ){
                return true ;
        }
        return false ;
    }
    isInFictiveCases(fictiveX : number, fictiveY: number, px: number, py : number ){
        if ( px >= fictiveX - this.rayon && px <= fictiveX + this.rayon
            && py >= fictiveY - this.rayon && py <= fictiveY + this.rayon ){
                return true ;
        }
        return false ;
    }

    remove(x:number, y:number){

        for ( let i = this.stock.length-1 ; i >= 0 ; i -- ){
            const st = this.stock[i] ;
            if ( st.x === x && st.y === y ){
                st.destroy(this.scene);
                this.stock.splice(i,1);
            }
        }

    }
    removeObj(_id : string){
        for ( let i = this.stock.length-1 ; i >= 0 ; i -- ){
            if ( _id === this.stock[i]['_id'] ){

                this.stock[i].destroy(this.scene);
                this.stock.splice(i,1);

            }
        }
    }

    move(mx:number, my: number){

        const news = [] ;
        for ( let x = 0 ; x < this.rayon*2+1 ; x ++ ){
            for ( let y = 0 ; y < this.rayon*2+1 ; y ++ ){
                
                let actualX = this.x + x - this.rayon ;
                let actualY = this.y + y - this.rayon ;
                if ( !this.isInFictiveCases(this.x + mx, this.y + my, actualX, actualY )){

                    this.remove(actualX, actualY);

                }

                let nmx = this.x + x - this.rayon + mx ;
                let nmy = this.y + y - this.rayon + my ;
                if( !this.isInCases(nmx, nmy) ){

                    news.push({
                        x : nmx, 
                        y : nmy
                    });
                }

            }
        }

        this.x += mx ;
        this.y += my ;
        this.updateMovers();
        this.camera.position.x += mx ;
        this.camera.position.y += my ;


        WorldViewer.WorldService.getCasesArr(news, cases => {

            for ( let c of cases ){
                this.buildObj(c.type,c.x,c.y, c);
            }
            this.updateSelection();

        });
    }
    moveTo(mx:number, my: number){

        const news = [] ;
        for ( let x = 0 ; x < this.rayon*2+1 ; x ++ ){
            for ( let y = 0 ; y < this.rayon*2+1 ; y ++ ){
                
                let actualX = this.x + x - this.rayon ;
                let actualY = this.y + y - this.rayon ;
                if ( !this.isInFictiveCases(mx, my, actualX, actualY )){

                    this.remove(actualX, actualY);

                }

                let nmx = x - this.rayon + mx ;
                let nmy = y - this.rayon + my ;
                if( !this.isInCases(nmx, nmy) ){

                    news.push({
                        x : nmx, 
                        y : nmy
                    });
                }

            }
        }

        this.x = mx ;
        this.y = my ;
        this.updateMovers();
        this.camera.position.x = mx ;
        this.camera.position.y = my ;

        WorldViewer.WorldService.getCasesArr(news, cases => {

            for ( let c of cases ){
                this.buildObj(c.type,c.x,c.y, c);
            }
            this.updateSelection();

        });
    }
    moveObjById(id:string, x : number, y : number){

        this.stock.forEach( row => {
            if ( row['_id'] && row['_id'] === id ){
                row.move(x,y);
            }
        });
        this.updateSelection();

    }
    moveObjOnPositionById(id:string, x: number, y : number){

        this.stock.forEach( row => {
            if ( row['_id'] && row['_id'] === id ){
                const px = x-row.x ;
                const py = y-row.y ;
                row.move(px,py).then( moveEnd => {


                    if ( !this.isInCases(row.x, row.y) ){

                        this.removeObj(row['_id']);

                    }

                });
            }
        });
        this.updateSelection();
    }


}