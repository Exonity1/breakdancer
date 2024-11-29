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
let loadedclass = new LoaderHelper(6, hideLoadingScreen);



const switchElement1 = document.getElementById('mySwitch1');
const switchElement2 = document.getElementById('mySwitch2');

const renderer = new THREE.WebGLRenderer({ antialias: true, shadowMap: { enabled: true, type: THREE.PCFSoftShadowMap } });
renderer.setSize(window.innerWidth, window.innerHeight);
const scene = new THREE.Scene();
const world = new CANNON.World({ gravity: new CANNON.Vec3(0, -9.82, 0) });
world.solver.iterations = 20;
world.solver.tolerance = 0.001;
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

hideLoadingScreen();

function animate() {
    requestAnimationFrame(animate);
    
    world.step(1 / 60, deltaTime, 10);
    
    //renderer.render(scene, camera);
    if (switchElement1.checked){
        composer.render();
    }else{
        composerPOV.render();
    }
    if(switchElement2.checked){
        cannonDebugger.update();
    }

    controls.update();
    

    //syncObjectWithBody(ThreeCarBody, car.carBody);
    
    updateFPS();
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
    scene.environment = envMap;
    scene.background = envMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.3;
});

}

function syncObjectWithBody(threeObject, cannonBody) {
    threeObject.position.copy(cannonBody.position);
    threeObject.quaternion.copy(cannonBody.quaternion);
}

window.addEventListener('resize', onWindowResize, false);



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


function hideLoadingScreen() {
    document.getElementById('loadingdiv').style.display = 'none';
    animate();
}

function refreshLoadingScreen(){
    let loadingText = document.getElementById('loadingstuff');
    if(loadingText.innerText === "Stuff is Still Loading /"){
        loadingText.innerText = "Stuff is Still Loading -";
    }else{
        loadingText.innerText = "Stuff is Still Loading /";
    }
}

function errorAlert(){
    document.getElementById('loadingstuff').innerText = "An Error Occured While Loading";
    document.getElementById('loadingstuff').style.color = "red";
}


/*
function loadStreetModel() {

    gLTFloader.load(

        'models/streetassetver3.glb',


        function(gltf) {
            console.log("Model loaded");
            const model = gltf.scene;
            model.castShadow = true;
            model.receiveShadow = true;
            groundPlane1 = model;
            setStreet();
            loadedclass.add();
        },
        // Called while loading is progressing
        function(xhr) {
            refreshLoadingScreen();
        },

        // Called when loading has errors
        function(error) {
            console.log('An error happened', error);
            errorAlert();
        }
    );
}
*/

function startFunctions(){
    
    loadHDRI('textures/hdri/nightsky.hdr');
}