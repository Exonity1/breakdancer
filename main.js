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



const switchElement = document.getElementById('mySwitch');

const scene = new THREE.Scene();

const world = new CANNON.World();
world.gravity.set(0, -9.82, 0);

const gLTFloader = new GLTFLoader();

const camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const composer = new EffectComposer(renderer);

const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight), 
  0.5,    // strength
  1,    // radius
  2    // threshold
);
//composer.addPass(bloomPass);

const ssaoPass = new SSAOPass(scene, camera, window.innerWidth, window.innerHeight);
ssaoPass.kernelRadius = 0.4; // Adjust the radius for the spread of shadows
ssaoPass.minDistance = 0.005;
ssaoPass.maxDistance = 0.5;
composer.addPass(ssaoPass);
const ssrPass = new SSRPass({
    renderer,
    scene,
    camera: camera,
    width: window.innerWidth,
    height: window.innerHeight,
    groundReflector: null, // Optionally, add a plane for specific reflections like water
    selects: null, // Optionally, specify which objects should have reflections
    opacity: 1.0,
    thickness: 0.518,
    maxDistance: 5,
});
//composer.addPass(ssrPass);


let plateSpeed = 0;

let gondelSpeed = 0;



let kreuzA;
let kreuzB;
let kreuzC;
let kreuzD;

let gondel1;
let gondel2;
let gondel3;
let gondel4;
let gondel5;
let gondel6;
let gondel7;
let gondel8;
let gondel9;
let gondel10;
let gondel11;
let gondel12;
let gondel13;
let gondel14;
let gondel15;
let gondel16;

function loadGondelModel(i) {

  // Load GLB model
  gLTFloader.load(
    // Resource URL
    'models/breakdancegondel3.glb',
    // Called when the resource is loaded
    function(gltf) {
      console.log("Model loaded");

      // Get the model's scene
      let modelScene = gltf.scene;

      // Iterate over the model's children
      modelScene.traverse(function(child) {
        if (child.isMesh) {
          // Apply the materials from the GLB file to the mesh
          child.material = child.material;
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      // Add the entire scene to the appropriate gondel variable
      switch (i) {
        case 0:
          gondel1 = modelScene;
          scene.add(gondel1);
          break;
        case 1:
          gondel2 = modelScene;
          scene.add(gondel2);
          break;
        case 2:
          gondel3 = modelScene;
          scene.add(gondel3);
          break;
        case 3:
          gondel4 = modelScene;
          scene.add(gondel4);
          break;
        case 4:
          gondel5 = modelScene;
          scene.add(gondel5);
          break;
        case 5:
          gondel6 = modelScene;
          scene.add(gondel6);
          break;
        case 6:
          gondel7 = modelScene;
          scene.add(gondel7);
          break;
        case 7:
          gondel8 = modelScene;
          scene.add(gondel8);
          break;
        case 8:
          gondel9 = modelScene;
          scene.add(gondel9);
          break;
        case 9:
          gondel10 = modelScene;
          scene.add(gondel10);
          break;
        case 10:
          gondel11 = modelScene;
          scene.add(gondel11);
          break;
        case 11:
          gondel12 = modelScene;
          scene.add(gondel12);
          break;
        case 12:
          gondel13 = modelScene;
          scene.add(gondel13);
          break;
        case 13:
          gondel14 = modelScene;
          scene.add(gondel14);
          break;
        case 14:
          gondel15 = modelScene;
          scene.add(gondel15);
          break;
        case 15:
          gondel16 = modelScene;
          scene.add(gondel16);
          break;
        default:
          console.log("Invalid value of i");
      }

    },
    function(xhr) {
      console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function(error) {
      console.log('An error happened', error);
    }
  );
}


for(let i =0; i<17; i++){
  
  loadGondelModel(i)
}


let mainbackground;

function loadBackgroundObject(onLoadCallback) {
  // Instantiate a GLTFLoader

  // Load a glTF resource
  gLTFloader.load(
    // Resource URL
    'models/breakerbackgrund.glb',

    // Called when the resource is loaded
    function(gltf) {
      console.log("Model loaded");

      // Get the loaded scene (model) from the glTF file
      const model = gltf.scene;

      // Enable shadows for the entire model
      model.castShadow = true;
      model.receiveShadow = true;

      // Traverse through the model to ensure materials are applied
      model.traverse(function(child) {
        if (child.isMesh) {
          // Enable shadows for each mesh in the model
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      // Add the model to the scene
      mainbackground = model;
      scene.add(mainbackground);

      // Call the onLoadCallback function if provided
      if (onLoadCallback) {
        onLoadCallback(model);
      }
    },

    // Called while loading is progressing
    function(xhr) {
      console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },

    // Called when loading has errors
    function(error) {
      console.log('An error happened', error);
    }
  );
}

loadBackgroundObject();


let basedisc;

function loadBasedisc(onLoadCallback) {
  // Instantiate a GLTFLoader

  // Load a glTF resource
  gLTFloader.load(
    // Resource URL
    'models/breakderdisc.glb',

    // Called when the resource is loaded
    function(gltf) {
      console.log("Model loaded");

      // Get the loaded scene (model) from the glTF file
      const model = gltf.scene;

      // Enable shadows for the entire model
      model.castShadow = true;
      model.receiveShadow = true;

      // Traverse through the model to ensure materials are applied
      model.traverse(function(child) {
        if (child.isMesh) {
          // Enable shadows for each mesh in the model
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      // Add the model to the scene
      basedisc = model;
      scene.add(basedisc);

      // Call the onLoadCallback function if provided
      if (onLoadCallback) {
        onLoadCallback(model);
      }
    },

    // Called while loading is progressing
    function(xhr) {
      console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },

    // Called when loading has errors
    function(error) {
      console.log('An error happened', error);
    }
  );
}


loadBasedisc();



/*


// Create a ground body
const groundBody = new CANNON.Body({
    mass: 0, // Mass 0 makes it static
    shape: new CANNON.Plane(), // Create a plane shape
});
groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2); // Rotate it to be flat
world.addBody(groundBody); // Add the ground body to the world
*/



// Create box
const mainShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));
const mainBody = new CANNON.Body({ mass: 0, shape: mainShape });
mainBody.position.set(0, 2.3, 0);
world.addBody(mainBody);



// Create cylinder
const cylinderShape = new CANNON.Cylinder(12.5, 12.5, 0.2, 12);
const cylinderBody = new CANNON.Body({ mass: 20000, shape: cylinderShape });
cylinderBody.position.set(0, 4, 0);
world.addBody(cylinderBody);



// Create hinge constraint
const plateHingeConstraint = new CANNON.HingeConstraint(mainBody, cylinderBody, {
  pivotA: new CANNON.Vec3(0, 0.5, 0), // Center of the top face of the box
  axisA: new CANNON.Vec3(0, 1, 0.12), // Axis of rotation for the box
  pivotB: new CANNON.Vec3(0, -0.5, 0), // Center of the bottom face of the cylinder
  axisB: new CANNON.Vec3(0, 1, 0), // Axis of rotation for the cylinder
});
world.addConstraint(plateHingeConstraint);

plateHingeConstraint.enableMotor();
plateHingeConstraint.setMotorSpeed(plateSpeed);
plateHingeConstraint.setMotorMaxForce(120000);


function loadKreuzModel(i) {

  // Load GLB model
  gLTFloader.load(
    // Resource URL
    'models/breakdancekreuzee.glb',
    // Called when the resource is loaded
    function(gltf) {
      console.log("Model loaded");

      // Get the model's scene
      let modelScene = gltf.scene;

      // Iterate over the model's children
      modelScene.traverse(function(child) {
        if (child.isMesh) {
          // Apply the materials from the GLB file to the mesh
          child.material = child.material;
        }
      });

      // Add the entire scene to the appropriate kreuz variable
      if (i == 0) {
        kreuzA = modelScene;
        scene.add(kreuzA);
      } else if (i == 1) {
        kreuzB = modelScene;
        scene.add(kreuzB);
      } else if (i == 2) {
        kreuzC = modelScene;
        scene.add(kreuzC);
      } else if (i == 3) {
        kreuzD = modelScene;
        scene.add(kreuzD);
      }

    },

    function(xhr) {
      console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },

    function(error) {
      console.log('An error happened', error);
    }
  );

}

     
loadKreuzModel(0);
loadKreuzModel(1);
loadKreuzModel(2);
loadKreuzModel(3);

      


/*
// Create box
const kreuzAHShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.05, 0.5));
const kreuzAHBody = new CANNON.Body({ mass: 1000, shape: kreuzAHShape });
kreuzAHBody.position.set(8, 2.5, 0);
world.addBody(kreuzAHBody);


const kreuzAFixedConstraint = new CANNON.LockConstraint(cylinderBody, kreuzAHBody);
world.addConstraint(kreuzAFixedConstraint);
*/

const kreuzAShape = new CANNON.Cylinder(4.5, 4.5, 0.2, 12);
const kreuzABody = new CANNON.Body({ mass: 3000, shape: kreuzAShape });
kreuzABody.position.set(2, 3, 0);
kreuzABody.collisionFilterGroup = 0; 
kreuzABody.collisionFilterMask = 0;
world.addBody(kreuzABody);

const kreuzAHingeConstraint = new CANNON.HingeConstraint(cylinderBody, kreuzABody, {
  pivotA: new CANNON.Vec3(8, 0.2, 0), // Center of the top face of the box
  axisA: new CANNON.Vec3(0, 1, 0), // Axis of rotation for the box
  pivotB: new CANNON.Vec3(0, 0.2, 0), // Center of the bottom face of the cylinder
  axisB: new CANNON.Vec3(0, 1, 0), // Axis of rotation for the cylinder
});
world.addConstraint(kreuzAHingeConstraint);

kreuzAHingeConstraint.enableMotor();
kreuzAHingeConstraint.setMotorSpeed(gondelSpeed);
kreuzAHingeConstraint.setMotorMaxForce(400);
/*
// Create box
const kreuzBHShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.05, 0.5));
const kreuzBHBody = new CANNON.Body({ mass: 1000, shape: kreuzBHShape });
kreuzBHBody.position.set(0, 2.5, 8);
world.addBody(kreuzBHBody);


const kreuzBFixedConstraint = new CANNON.LockConstraint(cylinderBody, kreuzBHBody);
world.addConstraint(kreuzBFixedConstraint);
*/

const kreuzBShape = new CANNON.Cylinder(4.5, 4.5, 0.2, 12);
const kreuzBBody = new CANNON.Body({ mass: 3000, shape: kreuzBShape });
kreuzBBody.position.set(2, 3, 0);
kreuzBBody.collisionFilterGroup = 0; 
kreuzBBody.collisionFilterMask = 0;
world.addBody(kreuzBBody);

const kreuzBHingeConstraint = new CANNON.HingeConstraint(cylinderBody, kreuzBBody, {
  pivotA: new CANNON.Vec3(0, 0.2, 8), // Center of the top face of the box
  axisA: new CANNON.Vec3(0, 1, 0), // Axis of rotation for the box
  pivotB: new CANNON.Vec3(0, 0.2, 0), // Center of the bottom face of the cylinder
  axisB: new CANNON.Vec3(0, 1, 0), // Axis of rotation for the cylinder
});
world.addConstraint(kreuzBHingeConstraint);

kreuzBHingeConstraint.enableMotor();
kreuzBHingeConstraint.setMotorSpeed(gondelSpeed);
kreuzBHingeConstraint.setMotorMaxForce(400);
/*
// Create box
const kreuzCHShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.05, 0.5));
const kreuzCHBody = new CANNON.Body({ mass: 1000, shape: kreuzCHShape });
kreuzCHBody.position.set(-8, 2.5, 0);
world.addBody(kreuzCHBody);


const kreuzCFixedConstraint = new CANNON.LockConstraint(cylinderBody, kreuzCHBody);
world.addConstraint(kreuzCFixedConstraint);
*/

const kreuzCShape = new CANNON.Cylinder(4.5, 4.5, 0.2, 12);
const kreuzCBody = new CANNON.Body({ mass: 3000, shape: kreuzCShape });
kreuzCBody.position.set(2, 3, 0);
kreuzCBody.collisionFilterGroup = 0; 
kreuzCBody.collisionFilterMask = 0;
world.addBody(kreuzCBody);

const kreuzCHingeConstraint = new CANNON.HingeConstraint(cylinderBody, kreuzCBody, {
  pivotA: new CANNON.Vec3(-8, 0.2, 0), // Center of the top face of the box
  axisA: new CANNON.Vec3(0, 1, 0), // Axis of rotation for the box
  pivotB: new CANNON.Vec3(0, 0.2, 0), // Center of the bottom face of the cylinder
  axisB: new CANNON.Vec3(0, 1, 0), // Axis of rotation for the cylinder
});
world.addConstraint(kreuzCHingeConstraint);

kreuzCHingeConstraint.enableMotor();
kreuzCHingeConstraint.setMotorSpeed(gondelSpeed);
kreuzCHingeConstraint.setMotorMaxForce(400);
/*
// Create box
const kreuzDHShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.05, 0.5));
const kreuzDHBody = new CANNON.Body({ mass: 1000, shape: kreuzDHShape });
kreuzDHBody.position.set(0, 2.5, -8);
world.addBody(kreuzDHBody);


const kreuzDFixedConstraint = new CANNON.LockConstraint(cylinderBody, kreuzDHBody);
world.addConstraint(kreuzDFixedConstraint);
*/

const kreuzDShape = new CANNON.Cylinder(4.5, 4.5, 0.2, 12);
const kreuzDBody = new CANNON.Body({ mass: 3000, shape: kreuzDShape });
kreuzDBody.position.set(2, 3, 0);
kreuzDBody.collisionFilterGroup = 0; 
kreuzDBody.collisionFilterMask = 0;
world.addBody(kreuzDBody);

const kreuzDHingeConstraint = new CANNON.HingeConstraint(cylinderBody, kreuzDBody, {
  pivotA: new CANNON.Vec3(0, 0.2, -8), // Center of the top face of the box
  axisA: new CANNON.Vec3(0, 1, 0), // Axis of rotation for the box
  pivotB: new CANNON.Vec3(0, 0.2, 0), // Center of the bottom face of the cylinder
  axisB: new CANNON.Vec3(0, 1, 0), // Axis of rotation for the cylinder
});
world.addConstraint(kreuzDHingeConstraint);

kreuzDHingeConstraint.enableMotor();
kreuzDHingeConstraint.setMotorSpeed(gondelSpeed);
kreuzDHingeConstraint.setMotorMaxForce(400);











// Create box
const gondel1Shape = new CANNON.Box(new CANNON.Vec3(1, 0.6, 0.6));
const gondel1Body = new CANNON.Body({ mass: 250, shape: gondel1Shape });
gondel1Body.position.set(6, 4, 0);
world.addBody(gondel1Body);

// Create hinge constraint
const gondel1HingeConstraint = new CANNON.HingeConstraint(kreuzABody, gondel1Body, {
  pivotA: new CANNON.Vec3(3.9, 0.8, 0), // Center of the top face of the box
  axisA: new CANNON.Vec3(-0.2, 1, 0), // Axis of rotation for the box
  pivotB: new CANNON.Vec3(0.2, -0.5, 0), // Center of the bottom face of the cylinder
  axisB: new CANNON.Vec3(0, 1, 0), // Axis of rotation for the cylinder
});
world.addConstraint(gondel1HingeConstraint);






// Create box
const gondel2Shape = new CANNON.Box(new CANNON.Vec3(1, 0.6, 0.6));
const gondel2Body = new CANNON.Body({ mass: 250, shape: gondel2Shape });
gondel2Body.collisionFilterGroup = 0; 
gondel2Body.collisionFilterMask = 0;

world.addBody(gondel2Body);

// Create hinge constraint
const gondel2HingeConstraint = new CANNON.HingeConstraint(kreuzABody, gondel2Body, {
  pivotA: new CANNON.Vec3(-3.9, 0.8, 0), // Center of the top face of the box
  axisA: new CANNON.Vec3(0.3, 1, 0), // Axis of rotation for the box
  pivotB: new CANNON.Vec3(0.2, -0.5, 0), // Center of the bottom face of the cylinder
  axisB: new CANNON.Vec3(0, 1, 0), // Axis of rotation for the cylinder
});
world.addConstraint(gondel2HingeConstraint);

// Create box
const gondel3Shape = new CANNON.Box(new CANNON.Vec3(1, 0.6, 0.6));
const gondel3Body = new CANNON.Body({ mass: 250, shape: gondel3Shape });
gondel3Body.collisionFilterGroup = 0; 
gondel3Body.collisionFilterMask = 0;

world.addBody(gondel3Body);

// Create hinge constraint
const gondel3HingeConstraint = new CANNON.HingeConstraint(kreuzABody, gondel3Body, {
  pivotA: new CANNON.Vec3(0, 0.8, 3.9), // Center of the top face of the box
  axisA: new CANNON.Vec3(0, 1, -0.3), // Axis of rotation for the box
  pivotB: new CANNON.Vec3(0.2, -0.5, 0), // Center of the bottom face of the cylinder
  axisB: new CANNON.Vec3(0, 1, 0), // Axis of rotation for the cylinder
});
world.addConstraint(gondel3HingeConstraint);

// Create box
const gondel4Shape = new CANNON.Box(new CANNON.Vec3(1, 0.6, 0.6));
const gondel4Body = new CANNON.Body({ mass: 250, shape: gondel4Shape });
gondel4Body.collisionFilterGroup = 0; 
gondel4Body.collisionFilterMask = 0;

world.addBody(gondel4Body);

// Create hinge constraint
const gondel4HingeConstraint = new CANNON.HingeConstraint(kreuzABody, gondel4Body, {
  pivotA: new CANNON.Vec3(0, 0.8, -3.9), // Center of the top face of the box
  axisA: new CANNON.Vec3(0, 1, 0.3), // Axis of rotation for the box
  pivotB: new CANNON.Vec3(0.2, -0.5, 0), // Center of the bottom face of the cylinder
  axisB: new CANNON.Vec3(0, 1, 0), // Axis of rotation for the cylinder
});
world.addConstraint(gondel4HingeConstraint);




// Create box
const gondel5Shape = new CANNON.Box(new CANNON.Vec3(1, 0.6, 0.6));
const gondel5Body = new CANNON.Body({ mass: 250, shape: gondel5Shape });
gondel5Body.position.set(6, 4, 0);
world.addBody(gondel5Body);

// Create hinge constraint
const gondel5HingeConstraint = new CANNON.HingeConstraint(kreuzBBody, gondel5Body, {
  pivotA: new CANNON.Vec3(3.9, 0.8, 0), // Center of the top face of the box
  axisA: new CANNON.Vec3(-0.3, 1, 0), // Axis of rotation for the box
  pivotB: new CANNON.Vec3(0.2, -0.5, 0), // Center of the bottom face of the cylinder
  axisB: new CANNON.Vec3(0, 1, 0), // Axis of rotation for the cylinder
});
world.addConstraint(gondel5HingeConstraint);


// Create box
const gondel6Shape = new CANNON.Box(new CANNON.Vec3(1, 0.6, 0.6));
const gondel6Body = new CANNON.Body({ mass: 250, shape: gondel6Shape });
gondel6Body.collisionFilterGroup = 0; 
gondel6Body.collisionFilterMask = 0;

world.addBody(gondel6Body);

// Create hinge constraint
const gondel6HingeConstraint = new CANNON.HingeConstraint(kreuzBBody, gondel6Body, {
  pivotA: new CANNON.Vec3(-3.9, 0.8, 0), // Center of the top face of the box
  axisA: new CANNON.Vec3(0.3, 1, 0), // Axis of rotation for the box
  pivotB: new CANNON.Vec3(0.2, -0.5, 0), // Center of the bottom face of the cylinder
  axisB: new CANNON.Vec3(0, 1, 0), // Axis of rotation for the cylinder
});
world.addConstraint(gondel6HingeConstraint);

// Create box
const gondel7Shape = new CANNON.Box(new CANNON.Vec3(1, 0.6, 0.6));
const gondel7Body = new CANNON.Body({ mass: 250, shape: gondel7Shape });
gondel7Body.collisionFilterGroup = 0; 
gondel7Body.collisionFilterMask = 0;

world.addBody(gondel7Body);

// Create hinge constraint
const gondel7HingeConstraint = new CANNON.HingeConstraint(kreuzBBody, gondel7Body, {
  pivotA: new CANNON.Vec3(0, 0.8, 3.9), // Center of the top face of the box
  axisA: new CANNON.Vec3(0, 1, -0.3), // Axis of rotation for the box
  pivotB: new CANNON.Vec3(0.2, -0.5, 0), // Center of the bottom face of the cylinder
  axisB: new CANNON.Vec3(0, 1, 0), // Axis of rotation for the cylinder
});
world.addConstraint(gondel7HingeConstraint);

// Create box
const gondel8Shape = new CANNON.Box(new CANNON.Vec3(1, 0.6, 0.6));
const gondel8Body = new CANNON.Body({ mass: 250, shape: gondel8Shape });
gondel8Body.collisionFilterGroup = 0; 
gondel8Body.collisionFilterMask = 0;

world.addBody(gondel8Body);

// Create hinge constraint
const gondel8HingeConstraint = new CANNON.HingeConstraint(kreuzBBody, gondel8Body, {
  pivotA: new CANNON.Vec3(0, 0.8, -3.9), // Center of the top face of the box
  axisA: new CANNON.Vec3(0, 1, 0.3), // Axis of rotation for the box
  pivotB: new CANNON.Vec3(0.2, -0.5, 0), // Center of the bottom face of the cylinder
  axisB: new CANNON.Vec3(0, 1, 0), // Axis of rotation for the cylinder
});
world.addConstraint(gondel8HingeConstraint);



// Create box
const gondel9Shape = new CANNON.Box(new CANNON.Vec3(1, 0.6, 0.6));
const gondel9Body = new CANNON.Body({ mass: 250, shape: gondel9Shape });
gondel9Body.position.set(6, 4, 0);
world.addBody(gondel9Body);

// Create hinge constraint
const gondel9HingeConstraint = new CANNON.HingeConstraint(kreuzCBody, gondel9Body, {
  pivotA: new CANNON.Vec3(3.9, 0.8, 0), // Center of the top face of the box
  axisA: new CANNON.Vec3(-0.3, 1, 0), // Axis of rotation for the box
  pivotB: new CANNON.Vec3(0.2, -0.5, 0), // Center of the bottom face of the cylinder
  axisB: new CANNON.Vec3(0, 1, 0), // Axis of rotation for the cylinder
});
world.addConstraint(gondel9HingeConstraint);


// Create box
const gondel10Shape = new CANNON.Box(new CANNON.Vec3(1, 0.6, 0.6));
const gondel10Body = new CANNON.Body({ mass: 250, shape: gondel10Shape });
gondel10Body.collisionFilterGroup = 0; 
gondel10Body.collisionFilterMask = 0;

world.addBody(gondel10Body);

// Create hinge constraint
const gondel10HingeConstraint = new CANNON.HingeConstraint(kreuzCBody, gondel10Body, {
  pivotA: new CANNON.Vec3(-3.9, 0.8, 0), // Center of the top face of the box
  axisA: new CANNON.Vec3(0.3, 1, 0), // Axis of rotation for the box
  pivotB: new CANNON.Vec3(0.2, -0.5, 0), // Center of the bottom face of the cylinder
  axisB: new CANNON.Vec3(0, 1, 0), // Axis of rotation for the cylinder
});
world.addConstraint(gondel10HingeConstraint);

// Create box
const gondel11Shape = new CANNON.Box(new CANNON.Vec3(1, 0.6, 0.6));
const gondel11Body = new CANNON.Body({ mass: 250, shape: gondel11Shape });
gondel11Body.collisionFilterGroup = 0; 
gondel11Body.collisionFilterMask = 0;

world.addBody(gondel11Body);

// Create hinge constraint
const gondel11HingeConstraint = new CANNON.HingeConstraint(kreuzCBody, gondel11Body, {
  pivotA: new CANNON.Vec3(0, 0.8, 3.9), // Center of the top face of the box
  axisA: new CANNON.Vec3(0, 1, -0.3), // Axis of rotation for the box
  pivotB: new CANNON.Vec3(0.2, -0.5, 0), // Center of the bottom face of the cylinder
  axisB: new CANNON.Vec3(0, 1, 0), // Axis of rotation for the cylinder
});
world.addConstraint(gondel11HingeConstraint);

// Create box
const gondel12Shape = new CANNON.Box(new CANNON.Vec3(1, 0.6, 0.6));
const gondel12Body = new CANNON.Body({ mass: 250, shape: gondel12Shape });
gondel12Body.collisionFilterGroup = 0; 
gondel12Body.collisionFilterMask = 0;

world.addBody(gondel12Body);

// Create hinge constraint
const gondel12HingeConstraint = new CANNON.HingeConstraint(kreuzCBody, gondel12Body, {
  pivotA: new CANNON.Vec3(0, 0.8, -3.9), // Center of the top face of the box
  axisA: new CANNON.Vec3(0, 1, 0.3), // Axis of rotation for the box
  pivotB: new CANNON.Vec3(0.2, -0.5, 0), // Center of the bottom face of the cylinder
  axisB: new CANNON.Vec3(0, 1, 0), // Axis of rotation for the cylinder
});
world.addConstraint(gondel12HingeConstraint);

// Create box
const gondel13Shape = new CANNON.Box(new CANNON.Vec3(1, 0.6, 0.6));
const gondel13Body = new CANNON.Body({ mass: 250, shape: gondel13Shape });
gondel13Body.position.set(6, 4, 0);
world.addBody(gondel13Body);

// Create hinge constraint
const gondel13HingeConstraint = new CANNON.HingeConstraint(kreuzDBody, gondel13Body, {
  pivotA: new CANNON.Vec3(3.9, 0.8, 0), // Center of the top face of the box
  axisA: new CANNON.Vec3(-0.3, 1, 0), // Axis of rotation for the box
  pivotB: new CANNON.Vec3(0.2, -0.5, 0), // Center of the bottom face of the cylinder
  axisB: new CANNON.Vec3(0, 1, 0), // Axis of rotation for the cylinder
});
world.addConstraint(gondel13HingeConstraint);


// Create box
const gondel14Shape = new CANNON.Box(new CANNON.Vec3(1, 0.6, 0.6));
const gondel14Body = new CANNON.Body({ mass: 250, shape: gondel14Shape });
gondel14Body.collisionFilterGroup = 0; 
gondel14Body.collisionFilterMask = 0;

world.addBody(gondel14Body);

// Create hinge constraint
const gondel14HingeConstraint = new CANNON.HingeConstraint(kreuzDBody, gondel14Body, {
  pivotA: new CANNON.Vec3(-3.9, 0.8, 0), // Center of the top face of the box
  axisA: new CANNON.Vec3(0.3, 1, 0), // Axis of rotation for the box
  pivotB: new CANNON.Vec3(0.2, -0.5, 0), // Center of the bottom face of the cylinder
  axisB: new CANNON.Vec3(0, 1, 0), // Axis of rotation for the cylinder
});
world.addConstraint(gondel14HingeConstraint);

// Create box
const gondel15Shape = new CANNON.Box(new CANNON.Vec3(1, 0.6, 0.6));
const gondel15Body = new CANNON.Body({ mass: 250, shape: gondel15Shape });
gondel15Body.collisionFilterGroup = 0; 
gondel15Body.collisionFilterMask = 0;

world.addBody(gondel15Body);

// Create hinge constraint
const gondel15HingeConstraint = new CANNON.HingeConstraint(kreuzDBody, gondel15Body, {
  pivotA: new CANNON.Vec3(0, 0.8, 3.9), // Center of the top face of the box
  axisA: new CANNON.Vec3(0, 1, -0.3), // Axis of rotation for the box
  pivotB: new CANNON.Vec3(0.2, -0.5, 0), // Center of the bottom face of the cylinder
  axisB: new CANNON.Vec3(0, 1, 0), // Axis of rotation for the cylinder
});
world.addConstraint(gondel15HingeConstraint);

// Create box
const gondel16Shape = new CANNON.Box(new CANNON.Vec3(1, 0.6, 0.6));
const gondel16Body = new CANNON.Body({ mass: 250, shape: gondel16Shape });
gondel16Body.collisionFilterGroup = 0; 
gondel16Body.collisionFilterMask = 0;

world.addBody(gondel16Body);

// Create hinge constraint
const gondel16HingeConstraint = new CANNON.HingeConstraint(kreuzDBody, gondel16Body, {
  pivotA: new CANNON.Vec3(0, 0.8, -3.9), // Center of the top face of the box
  axisA: new CANNON.Vec3(0, 1, 0.3), // Axis of rotation for the box
  pivotB: new CANNON.Vec3(0.2, -0.5, 0), // Center of the bottom face of the cylinder
  axisB: new CANNON.Vec3(0, 1, 0), // Axis of rotation for the cylinder
});
world.addConstraint(gondel16HingeConstraint);





const groundPlaneGeometry = new THREE.PlaneGeometry(100, 100);
const groundPlane = applyMaterial(groundPlaneGeometry, "textures/asphalt/Asphalt026C_1K-JPG_Color.jpg", "textures/asphalt/Asphalt026C_1K-JPG_NormalDX.jpg", "textures/asphalt/Asphalt026C_1K-JPG_Roughness.jpg")
groundPlane.rotation.x = -Math.PI / 2;
scene.add(groundPlane);



camera.position.x = 0;
camera.position.y = 8;
camera.position.z = 15;
camera.lookAt(0, 3, 0)


const controls = new OrbitControls(camera, renderer.domElement);
const cannonDebugger = new CannonDebugger(scene, world, {

})








function syncObjectWithBody(threeObject, cannonBody) {
  threeObject.position.copy(cannonBody.position);
  threeObject.quaternion.copy(cannonBody.quaternion);
}

function applyMaterial(object, colorTexturePath, normalTexturePath, roughnessTexturePath) {
  // Load textures
  const loader = new THREE.TextureLoader();
  const colorTexture = loader.load(colorTexturePath);
  const normalTexture = loader.load(normalTexturePath);
  const roughnessTexture = loader.load(roughnessTexturePath);

  // Scale the textures (adjust the scale as needed)
  colorTexture.repeat.set(20, 20);
  normalTexture.repeat.set(20, 20);
  roughnessTexture.repeat.set(20, 20);

  normalTexture.invert = true;

  colorTexture.wrapS = THREE.RepeatWrapping;
  colorTexture.wrapT = THREE.RepeatWrapping;
  normalTexture.wrapS = THREE.RepeatWrapping;
  normalTexture.wrapT = THREE.RepeatWrapping;
  roughnessTexture.wrapS = THREE.RepeatWrapping;
  roughnessTexture.wrapT = THREE.RepeatWrapping;

  // Create MeshPhysicalMaterial
  const material = new THREE.MeshPhysicalMaterial({
    map: colorTexture,
    normalMap: normalTexture,
    roughnessMap: roughnessTexture,
  });

  // Apply material to object
  const mesh = new THREE.Mesh(object, material);

  // Enable shadows
  mesh.castShadow = true;     // Object will cast shadows
  mesh.receiveShadow = true;  // Object will receive shadows

  return mesh;
}


function loadHDRI(path) {

  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  const hdriLoader = new RGBELoader()
  hdriLoader.load(path, function(texture) {
    const envMap = pmremGenerator.fromEquirectangular(texture).texture;
    texture.dispose();
    scene.environment = envMap
  });

}




let lastTime = Date.now(); // Initialisiere die letzte Zeit
let deltaTime = 0;
let fps = 0;

function updateFPS() {
    const now = Date.now();
    deltaTime = (now - lastTime) / 1000; // Zeit in Sekunden
    lastTime = now;

    if (deltaTime > 0) {
        fps = Math.round(1 / deltaTime); // FPS berechnen
    }

    document.getElementById('fpsCounter').textContent = `FPS: ${fps}`;
}





function animate() {
    requestAnimationFrame(animate);


    // Führe die Physik-Update-Schritt aus
    world.step(1 / 60, deltaTime, 3);
    

    // Rendern und Steuerung aktualisieren
    //renderer.render(scene, camera);
    composer.render();
    controls.update();

    // Synchronisiere Objekte mit den Körpern
    
    //cannonDebugger.update();

    if (kreuzA != null) syncObjectWithBody(kreuzA, kreuzABody);
    if (kreuzB != null) syncObjectWithBody(kreuzB, kreuzBBody);
    if (kreuzC != null) syncObjectWithBody(kreuzC, kreuzCBody);
    if (kreuzD != null) syncObjectWithBody(kreuzD, kreuzDBody);
    if (gondel1 != null) syncObjectWithBody(gondel1, gondel1Body);
    if (gondel2 != null) syncObjectWithBody(gondel2, gondel2Body);
    if (gondel3 != null) syncObjectWithBody(gondel3, gondel3Body);
    if (gondel4 != null) syncObjectWithBody(gondel4, gondel4Body);
    if (gondel5 != null) syncObjectWithBody(gondel5, gondel5Body);
    if (gondel6 != null) syncObjectWithBody(gondel6, gondel6Body);
    if (gondel7 != null) syncObjectWithBody(gondel7, gondel7Body);
    if (gondel8 != null) syncObjectWithBody(gondel8, gondel8Body);
    if (gondel9 != null) syncObjectWithBody(gondel9, gondel9Body);
    if (gondel10 != null) syncObjectWithBody(gondel10, gondel10Body);
    if (gondel11 != null) syncObjectWithBody(gondel11, gondel11Body);
    if (gondel12 != null) syncObjectWithBody(gondel12, gondel12Body);
    if (gondel13 != null) syncObjectWithBody(gondel13, gondel13Body);
    if (gondel14 != null) syncObjectWithBody(gondel14, gondel14Body);
    if (gondel15 != null) syncObjectWithBody(gondel15, gondel15Body);
    if (gondel16 != null) syncObjectWithBody(gondel16, gondel16Body); 
    if (basedisc != null) syncObjectWithBody(basedisc, cylinderBody);

    plateHingeConstraint.setMotorSpeed(plateSpeed);
    kreuzAHingeConstraint.setMotorSpeed(-1 * gondelSpeed);
    kreuzBHingeConstraint.setMotorSpeed(-1 * gondelSpeed);
    kreuzCHingeConstraint.setMotorSpeed(-1 * gondelSpeed);
    kreuzDHingeConstraint.setMotorSpeed(-1 * gondelSpeed);

    // FPS-Zähler aktualisieren
    updateFPS();

  if (gondel1 != null && switchElement.checked) syncObjects(gondel1, camera,1.5);
  
  
}


animate();



function resetVelocity() {
  gondel1Body.angularVelocity.set(0, 0, 0)
  gondel2Body.angularVelocity.set(0, 0, 0)
  gondel3Body.angularVelocity.set(0, 0, 0)
  gondel4Body.angularVelocity.set(0, 0, 0)
  gondel5Body.angularVelocity.set(0, 0, 0)
  gondel6Body.angularVelocity.set(0, 0, 0)
  gondel7Body.angularVelocity.set(0, 0, 0)
  gondel8Body.angularVelocity.set(0, 0, 0)
  gondel9Body.angularVelocity.set(0, 0, 0)
  gondel10Body.angularVelocity.set(0, 0, 0)
  gondel11Body.angularVelocity.set(0, 0, 0)
  gondel12Body.angularVelocity.set(0, 0, 0)
  gondel13Body.angularVelocity.set(0, 0, 0)
  gondel14Body.angularVelocity.set(0, 0, 0)
  gondel15Body.angularVelocity.set(0, 0, 0)
  gondel16Body.angularVelocity.set(0, 0, 0)
  console.log("Velocity reset");
}

document.getElementById('resetbutton').addEventListener('click', resetVelocity);

const slider1 = document.getElementById('slider1');
const slider2 = document.getElementById('slider2');

slider1.addEventListener('input', () => {
    const value = parseFloat(slider1.value);
    
    plateSpeed = value * 0.001 *1.39 *1.25;
});

slider2.addEventListener('input', () => {
    const value = parseFloat(slider2.value);
    
    gondelSpeed = value * 0.001 * 3.5 *1.2;  

});


function syncObjects(object1, object2, yOffset) {
    // Sync position with offset on the y-axis
    object2.position.copy(object1.position).add(new THREE.Vector3(0, yOffset, 0));

    // Sync rotation
    object2.quaternion.copy(object1.quaternion);
    object2.rotateY(-7.85);
    object2.quaternion.setFromEuler(object2.rotation);
}







loadHDRI('textures/hdri/metro_vijzelgracht_2k.hdr');

/*

function createSpotlights(scene) {
    const numSpotlights = 8;
    const radius = 12; // Adjust as needed
    const angleIncrement = (Math.PI * 2) / numSpotlights;
    const rainbowColors = [
        0xff0000, // Red
        0xff7f00, // Orange
        0xffff00, // Yellow
        0x00ff00, // Green
        0x00ffff, // Cyan
        0x0000ff, // Blue
        0x8b00ff, // Indigo
        0xff00ff, // Violet
        0xff0000, // Red (repeated to close the circle)
        0xff7f00, // Orange (repeated to close the circle)
        0xffff00, // Yellow (repeated to close the circle)
        0x00ff00  // Green (repeated to close the circle)
    ];

    for (let i = 0; i < numSpotlights; i++) {
        const angle = i * angleIncrement;
        const x = radius * Math.cos(angle);
        const z = radius * Math.sin(angle);

        const color = rainbowColors[i];

        const spotlight = new THREE.SpotLight(color);
        spotlight.position.set(x, 20, z); // Adjust the y position as needed
        spotlight.target.position.set(0, -40, 0); // Point down
        spotlight.angle = Math.PI / 12; // Set angle
        spotlight.penumbra = 0.05; // Set penumbra
        spotlight.decay = 0.5; // Set decay
        spotlight.distance = 0; // Set distance
        spotlight.intensity = 70;
        spotlight.castShadow = true;

        scene.add(spotlight);
        scene.add(spotlight.target);
    }
}

createSpotlights(scene);


const ambientLightColor = 0x00008b; // Dunkles Blau
const ambientLightIntensity = 1.2; // Gedimmte Intensität

const ambientLight = new THREE.AmbientLight(ambientLightColor, ambientLightIntensity);
scene.add(ambientLight);
*/

renderer.physicallyCorrectLights = true;
scene.traverse(function(child) {
  if (child.isMesh) {
    child.castShadow = true;    // Enable shadow casting for the object
    child.receiveShadow = true; // Enable shadow receiving for the object
  }
});




/*
let previousPosition = new THREE.Vector3();
let previousVelocity = new THREE.Vector3();
let previousTime = performance.now();
let frameCount = 0;
const framesToSkip = 5;


function logAcceleration(object) {
    frameCount++;

    // Only calculate every 'framesToSkip' frames
    if (frameCount % framesToSkip !== 0) {
        return;
    }

    // Get the current time
    const currentTime = performance.now();
    const deltaTime = (currentTime - previousTime) / 1000; // Convert ms to seconds

    // Check if deltaTime is within a reasonable range
    if (deltaTime <= 0 || deltaTime > 1) {
        return; // Skip this frame if deltaTime is unrealistic
    }

    // Get the current position of the object
    const currentPosition = object.position.clone();

    // Calculate the velocity (change in position over time)
    const currentVelocity = currentPosition.clone().sub(previousPosition).divideScalar(deltaTime);

    // Smooth the velocity to avoid sudden jumps
    const smoothedVelocity = previousVelocity.clone().lerp(currentVelocity, 0.5);

    // Calculate the acceleration (change in velocity over time)
    const acceleration = smoothedVelocity.clone().sub(previousVelocity).divideScalar(deltaTime);

    // Log the acceleration in G-forces
    const gforce = (acceleration.length() / 9.81).toFixed(2);
    document.getElementById('gforce').textContent = `G: ${parseFloat(gforce)}`;

    // Update previous values for the next frame
    previousPosition.copy(currentPosition);
    previousVelocity.copy(smoothedVelocity);
    previousTime = currentTime;
}
*/

window.addEventListener('resize', onWindowResize, false);



function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}






