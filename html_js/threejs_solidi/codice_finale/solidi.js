var clock = new THREE.Clock();

function animate () {
  requestAnimationFrame(animate);
  var t = clock.getElapsedTime();
  ball.rotation.set(t, 2*t,0);
  cube.rotation.set(t, 2*t,0);
  tube.rotation.set(t, 2*t,0);
  plane.rotation.set(t, 2*t,0);
  donut.rotation.set(t, 2*t,0);
  renderer.render(scene,camera);
}

var ballshape = new THREE.SphereGeometry(100, 20, 15);
var ballcover = new THREE.MeshNormalMaterial(flat);
var ball = new THREE.Mesh(ballshape, ballcover);
scene.add(ball);
ball.position.set(-250,250,-250);
ball.rotation.set (0.5, 0.5, 0);

var cubeshape = new THREE.CubeGeometry(300,100,200);
var cubecover = new THREE.MeshNormalMaterial(flat);
var cube = new THREE.Mesh(cubeshape, cubecover);
scene.add (cube);
cube.rotation.set (0.5,0.5,0);
cube.position.set(250,250,-250);

var tubeshape = new THREE.CylinderGeometry(1,100,100,4);
var tubecover = new THREE.MeshNormalMaterial(flat);
var tube = new THREE.Mesh(tubeshape, tubecover);
scene.add (tube);
tube.rotation.set (1,0.5,0);
tube.position.set(-250,-250,-250);

var planeshape = new THREE.PlaneGeometry(300,100);
var planecover = new THREE.MeshNormalMaterial(flat);
var plane = new THREE.Mesh(planeshape,planecover);
scene.add(plane);
plane.rotation.set(0.5,0,0);
plane.position.set(250,-250,-250);

var donutshape = new THREE.TorusGeometry(100, 35, 34, 25);
var donutcover = new THREE.MeshNormalMaterial(flat);
var donut = new THREE.Mesh(donutshape, donutcover);
scene.add(donut);
donut.rotation.set(-0.5,0,-0.5);
animate();

// Now, show what the camera sees on the screen:
renderer.render(scene, camera);
