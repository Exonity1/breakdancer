import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as CANNON from 'cannon-es'
import CannonDebugger from 'cannon-es-debugger'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { SSAOPass } from 'three/addons/postprocessing/SSAOPass.js';
import { SSRPass } from 'three/addons/postprocessing/SSRPass.js';
import { TAARenderPass } from 'three/addons/postprocessing/TAARenderPass.js';
import { LoaderHelper } from './LoaderHelper.js';


// Initialisie the time variables for updateFPS() 
let lastTime = Date.now(); 
let deltaTime = 0;
let fps = 0;
let loadedclass = new LoaderHelper(2, hideLoadingScreenAndStart);
//Intialise the general variables 
let plateSpeed = 0;
let gondelSpeed = 0;
let gondelKreuze = [];
let gondeln = [];
let environment;
let basedisc;
let base;
let baseHingeConstraint;
let kreuzHingeConstraints = [];
let gondelHingeConstraints = {};

window.addEventListener('resize', onWindowResize, false);
const switchElement1 = document.getElementById('mySwitch1');
const switchElement2 = document.getElementById('mySwitch2');

const renderer = new THREE.WebGLRenderer({ antialias: true, shadowMap: { enabled: true, type: THREE.PCFSoftShadowMap } });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
const scene = new THREE.Scene();
const world = new CANNON.World({ gravity: new CANNON.Vec3(0, -9.82, 0) });
world.solver.iterations = 20;
world.solver.tolerance = 0.001;
world.allowSleep = false;
const gLTFloader = new GLTFLoader();
const cannonDebugger = new CannonDebugger(scene, world, {})
document.body.appendChild(renderer.domElement);



//Camera 1
const camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1000);
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);
camera.position.set(10,5,10);
camera.lookAt(0,0,0);
const controls = new OrbitControls(camera, renderer.domElement);

//Camera 2 (POV)
const cameraPOV = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1000);
const composerPOV = new EffectComposer(renderer);
const renderPassPOV = new RenderPass(scene, cameraPOV);
composerPOV.addPass(renderPassPOV);



startFunctions();





function innitPhysics(){
    base = new CANNON.Body({
        mass: 0,
        shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)),
        position: new CANNON.Vec3(0, 1.3, 0)
    });
    world.addBody(base);

    createBaseHinge();

    //createKreuzHinges();

    //createGondelHinges();
}

function createKreuzHinges(){
    const kreuzHingeParams = [
        { pivotA: new CANNON.Vec3(6, 0.2, 0)},
        { pivotA: new CANNON.Vec3(0, 0.2, 6)},
        { pivotA: new CANNON.Vec3(-6, 0.2, 0)},
        { pivotA: new CANNON.Vec3(0, 0.2, -6)}
    ];

    gondelKreuze.forEach((kreuz, index) => {
        const kreuzHingeConstraint = new CANNON.HingeConstraint(basedisc.body, kreuz.kreuzPhysicsBody, {
            pivotA: kreuzHingeParams[index].pivotA, // Center of the top face of the box
            axisA: new CANNON.Vec3(0, 1, 0), // Axis of rotation for the box
            pivotB: new CANNON.Vec3(0, 0.2, 0), // Center of the bottom face of the cylinder
            axisB: new CANNON.Vec3(0, 1, 0), // Axis of rotation for the cylinder
        });
        kreuzHingeConstraint.enableMotor();
        kreuzHingeConstraint.setMotorSpeed(gondelSpeed);
        kreuzHingeConstraint.setMotorMaxForce(400);
        world.addConstraint(kreuzHingeConstraint);
        kreuzHingeConstraints.push(kreuzHingeConstraint);
    });
}

function createBaseHinge(){
    const plateHingeConstraint = new CANNON.HingeConstraint(base, basedisc.body, {
        pivotA: new CANNON.Vec3(0, 0.5, 0), // Center of the top face of the box
        axisA: new CANNON.Vec3(0, 1, 0.12), // Axis of rotation for the box
        pivotB: new CANNON.Vec3(0, -0.5, 0), // Center of the bottom face of the cylinder
        axisB: new CANNON.Vec3(0, 1, 0), // Axis of rotation for the cylinder
    });
    plateHingeConstraint.enableMotor();
    plateHingeConstraint.setMotorSpeed(plateSpeed);
    plateHingeConstraint.setMotorMaxForce(120000);
    plateHingeConstraint.collideConnected = false;
    world.addConstraint(plateHingeConstraint);
    baseHingeConstraint = plateHingeConstraint;
}

function createGondelHinges() {
    const gondelHingeParams = [
        { pivotA: new CANNON.Vec3(3.4, 0.8, 0), axisA: new CANNON.Vec3(-0.3, 1, 0) },
        { pivotA: new CANNON.Vec3(-3.4, 0.8, 0), axisA: new CANNON.Vec3(0.3, 1, 0) },
        { pivotA: new CANNON.Vec3(0, 0.8, 3.4), axisA: new CANNON.Vec3(0, 1, -0.3) },
        { pivotA: new CANNON.Vec3(0, 0.8, -3.4), axisA: new CANNON.Vec3(0, 1, 0.3) }
    ];

    let i = 0;

    gondelKreuze.forEach((kreuz) => {
        for(let j = 0; j < 4; j++){
            const gondelHingeConstraint = new CANNON.HingeConstraint(kreuz.kreuzPhysicsBody, gondeln[i].gondelPhysicsBody, {
                pivotA: gondelHingeParams[j].pivotA, 
                axisA: gondelHingeParams[j].axisA,  
                pivotB: new CANNON.Vec3(0.2, -0.5, 0), 
                axisB: new CANNON.Vec3(0, 1, 0), 
            });
            world.addConstraint(gondelHingeConstraint);
            kreuzHingeConstraints.push(gondelHingeConstraint);
            i++
        }
    });
    
}

async function loadBaseDisc(){
    // Create cylinder
    const cylinderShape = new CANNON.Cylinder(8, 8, 0.1, 12);
    const cylinderBody = new CANNON.Body({ mass: 12000, shape: cylinderShape });
    basedisc = {
        model: await loadModel('models/DancerDisc.glb'),
        body: cylinderBody
    };
    scene.add(basedisc.model);
    world.addBody(basedisc.body);
    loadedclass.add();
}

async function loadBackgroundScene(){
    environment = await loadModel('models/breakerBackground1.glb');
    scene.add(environment);
    loadedclass.add();
}

async function loadGondelModels(){
    for(let i = 0; i < 16; i++){
        let gondel = {
            gondelBody: await loadModel('models/breakerGondel.glb'),
            gondelPhysicsBody: new CANNON.Body({ mass: 250, shape: new CANNON.Box(new CANNON.Vec3(0.75, 0.45, 0.45)) })
        }
        gondeln.push(gondel);
        scene.add(gondel.gondelBody);
        world.addBody(gondel.gondelPhysicsBody);
        loadedclass.add();
    }
}

async function loadKreuze(){
    for(let i = 0; i < 4; i++){
        let kreuz = {
            kreuzBody: await loadModel('models/breakerKreuz.glb'),
            kreuzPhysicsBody: new CANNON.Body({ mass: 1000, shape: new CANNON.Cylinder(4, 4, 0.1, 12), collisionFilterGroup: 0, collisionFilterMask: 0 })
        }
        gondelKreuze.push(kreuz);
        scene.add(kreuz.kreuzBody);
        world.addBody(kreuz.kreuzPhysicsBody);
        loadedclass.add();
    }
}




function animate() {
    requestAnimationFrame(animate);
    //cannonDebugger.update();
    
    world.step(1 / 60, deltaTime, 10);
    
    //renderer.render(scene, camera);
    if (!switchElement1.checked){
        composer.render();
    }else{
        composerPOV.render();
    }
    if(switchElement2.checked){
        cannonDebugger.update();
    }


    controls.update();
    driveBreaker();
    syncBodies();
    updateFPS();
}







function syncBodies(){
    syncObjectWithBody(basedisc.model, basedisc.body);
    gondelKreuze.forEach(kreuz => {
        syncObjectWithBody(kreuz.kreuzBody, kreuz.kreuzPhysicsBody);
    });
    gondeln.forEach(gondel => {
        syncObjectWithBody(gondel.gondelBody, gondel.gondelPhysicsBody);
    });
}

function driveBreaker(){
    kreuzHingeConstraints.forEach((constraint) => {
        constraint.setMotorSpeed(gondelSpeed);
    });
    baseHingeConstraint.setMotorSpeed(plateSpeed);
}    

function updateFPS() {
    const now = Date.now();
    deltaTime = (now - lastTime) / 1000; // Zeit in Sekunden
    lastTime = now;

    if (deltaTime > 0) {
        fps = Math.round(1 / deltaTime); // FPS berechnen
    }

    document.getElementById('fpsCounter').textContent = `FPS: ${fps}`;
}

function loadHDRI(path) {

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const hdriLoader = new RGBELoader();

    hdriLoader.load(path, function(texture) {
        const envMap = pmremGenerator.fromEquirectangular(texture).texture;
        texture.dispose();
        pmremGenerator.dispose();
        //scene.environment = envMap;
        scene.background = envMap;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 0.3;
    });

}

function syncObjectWithBody(threeObject, cannonBody) {
    threeObject.position.copy(cannonBody.position);
    threeObject.quaternion.copy(cannonBody.quaternion);
}

function onWindowResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    cameraPOV.aspect = width / height;
    cameraPOV.updateProjectionMatrix();
    
    renderer.setSize(width, height);
    composer.setSize(width, height);
    composerPOV.setSize(width, height);
    //SSAOPass.setSize(width, height);
    //ssaoPassPOV.setSize(width, height);
    //ssrPass.setSize(width, height);
    //ssrPassPOV.setSize(width, height);
}

function hideLoadingScreenAndStart() {
    document.getElementById('loadingdiv').style.display = 'none';
    innitPhysics();
    animate();
}

function refreshLoadingScreen(){
    let loadingText = document.getElementById('loadingstuff');
    if(loadingText.innerText === "- Stuff is Still Loading /"){
        loadingText.innerText = "/ Stuff is Still Loading -";
    }else{
        loadingText.innerText = "- Stuff is Still Loading /";
    }
}

function errorAlert(){
    document.getElementById('loadingstuff').innerText = "An Error Occured While Loading";
    document.getElementById('loadingstuff').style.color = "red";
}

async function loadModel(path) {
    try {
        const gltf = await gLTFloader.loadAsync(path, refreshLoadingScreen);
        console.log("Model loaded");
        let model = gltf.scene;
        model.castShadow = true;
        model.receiveShadow = true;
        return model;
    } catch (error) {
        console.log('An error happened', error);
        errorAlert();
        throw error;
    }
}

function startFunctions(){
    //loadGondelModels();
    //loadKreuze();
    loadBaseDisc();
    loadBackgroundScene();
    loadHDRI('textures/hdri/nightsky.hdr');
    createSunLight();
}

document.getElementById('resetButton').addEventListener('click', resetVelocity);

function resetVelocity() {
    gondeln.forEach(gondel => {;
        gondel.gondelPhysicsBody.angularVelocity.set(0,0,0);
    });
}

slider1.addEventListener('input', () => {
    const value = parseFloat(slider1.value);
    
    plateSpeed = value * 0.001 *1.39 *-1.25;
});

slider2.addEventListener('input', () => {
    const value = parseFloat(slider2.value);
    
    gondelSpeed = value * 0.001 * 3.5 *1.2;  

});

function createSunLight(){
    const sunLight = new THREE.DirectionalLight(0x5a729e, 6.5);
    sunLight.position.set(10, 10, 10);
    sunLight.target.position.set(0, 0, 0);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.top = 1000;
    sunLight.shadow.camera.bottom = -1000;
    sunLight.shadow.camera.left = -1000;
    sunLight.shadow.camera.right = 1000;
    sunLight.shadow.camera.near = 0.100;
    sunLight.shadow.camera.far = 10000;
    scene.add(sunLight);
    scene.add(new THREE.AmbientLight(0xffffff, 0.1));
}