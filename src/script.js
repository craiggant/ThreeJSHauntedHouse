import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

/**
 * Base
 */

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// Fog
const fog = new THREE.Fog('#262837', 1, 15);
scene.fog = fog;

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const doorColorTexture = textureLoader.load('/textures/door/color.jpg');
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg');
const doorAmbientOcclusionTexture = textureLoader.load(
	'/textures/door/ambientOcclusion.jpg'
);
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg');
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg');
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg');
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg');

const graveColorTexture = textureLoader.load('/textures/grave/color.jpg');
const graveAmbientOcclusionTexture = textureLoader.load(
	'/textures/grave/ambientOcclusion.jpg'
);
const graveHeightTexture = textureLoader.load('/textures/grave/height.png');
const graveNormalTexture = textureLoader.load('/textures/grave/normal.jpg');
const graveRoughnessTexture = textureLoader.load(
	'/textures/grave/roughness.jpg'
);

const bricksColorTexture = textureLoader.load('/textures/bricks/color.jpg');
const bricksAmbientOcclusionTexture = textureLoader.load(
	'/textures/bricks/ambientOcclusion.jpg'
);
const bricksNormalTexture = textureLoader.load('/textures/bricks/normal.jpg');
const bricksRoughnessTexture = textureLoader.load(
	'/textures/bricks/roughness.jpg'
);

const grassColorTexture = textureLoader.load('/textures/grass/color.jpg');
const grassAmbientOcclusionTexture = textureLoader.load(
	'/textures/grass/ambientOcclusion.jpg'
);
const grassNormalTexture = textureLoader.load('/textures/grass/normal.jpg');
const grassRoughnessTexture = textureLoader.load(
	'/textures/grass/roughness.jpg'
);

grassColorTexture.repeat.set(8, 8);
grassAmbientOcclusionTexture.repeat.set(8, 8);
grassNormalTexture.repeat.set(8, 8);
grassRoughnessTexture.repeat.set(8, 8);

grassColorTexture.wrapS = THREE.RepeatWrapping;
grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping;
grassNormalTexture.wrapS = THREE.RepeatWrapping;
grassRoughnessTexture.wrapS = THREE.RepeatWrapping;

grassColorTexture.wrapT = THREE.RepeatWrapping;
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping;
grassNormalTexture.wrapT = THREE.RepeatWrapping;
grassRoughnessTexture.wrapT = THREE.RepeatWrapping;

/**
 * House
 */
const house = new THREE.Group();
scene.add(house);

// Walls
const walls = new THREE.Mesh(
	new THREE.BoxGeometry(4, 2.5, 4),
	new THREE.MeshStandardMaterial({
		map: bricksColorTexture,
		aoMap: bricksAmbientOcclusionTexture,
		normalMap: bricksNormalTexture,
		roughness: bricksRoughnessTexture,
	})
);
walls.geometry.setAttribute(
	'uv2',
	new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)
);
// TODO: change brick roughness to reduce reflection
walls.position.y = 2.5 / 2;
house.add(walls);

// Roof
const roof = new THREE.Mesh(
	new THREE.ConeGeometry(3.5, 1, 4),
	new THREE.MeshStandardMaterial({ color: '#b35f45' })
);
roof.position.y = 2.5 + 0.5;
roof.rotation.y = Math.PI * 0.25;
house.add(roof);

// Door
const door = new THREE.Mesh(
	new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
	new THREE.MeshStandardMaterial({
		map: doorColorTexture,
		transparent: true,
		alphaMap: doorAlphaTexture,
		aoMap: doorAmbientOcclusionTexture,
		displacementMap: doorHeightTexture,
		displacementScale: 0.1,
		normalMap: doorNormalTexture,
		metalnessMap: doorMetalnessTexture,
		roughnessMap: doorRoughnessTexture,
	})
);
door.geometry.setAttribute(
	'uv2',
	new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
);
door.position.y = 1;
door.position.z = 2 + 0.01;
house.add(door);

// Bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({ color: '#89c854' });

const bushes = [
	{ scale: [0.5, 0.5, 0.5], position: [0.8, 0.2, 2.2] },
	{ scale: [0.5, 0.5, 0.5], position: [0.8, 0.2, 2.2] },
	{ scale: [0.25, 0.25, 0.25], position: [1.4, 0.1, 2.1] },
	{ scale: [0.4, 0.4, 0.4], position: [-0.8, 0.1, 2.2] },
	{ scale: [0.15, 0.15, 0.15], position: [-1, 0.05, 2.6] },
];

for (let i = 0; i < bushes.length; i++) {
	const b = bushes[i];
	const newBush = new THREE.Mesh(bushGeometry, bushMaterial);
	newBush.scale.set(b.scale[0], b.scale[1], b.scale[2]);
	newBush.position.set(b.position[0], b.position[1], b.position[2]);
	newBush.castShadow = true;
	house.add(newBush);
}

// Graves
const graves = new THREE.Group();
scene.add(graves);

const graveSquareGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.1);
const graveMaterial = new THREE.MeshStandardMaterial({
	map: graveColorTexture,
	aoMap: graveAmbientOcclusionTexture,
	normalMap: graveNormalTexture,
	roughness: graveRoughnessTexture,
	transparent: true,
});

const crossGeometryMain = new THREE.BoxGeometry(0.1, 0.8, 0.09);
const crossGeometrySecondary = new THREE.BoxGeometry(0.4, 0.1, 0.09);

for (let i = 0; i < 50; i++) {
	const angle = Math.random() * Math.PI * 2;
	const radius = 4.5 + Math.random() * 5;
	const x = Math.sin(angle) * radius;
	const z = Math.cos(angle) * radius;

	// add equal parts of both types of graves. We'll separate by if i = even or not
	if (i % 2 === 0) {
		const grave = new THREE.Mesh(graveSquareGeometry, graveMaterial);
		grave.geometry.setAttribute(
			'uv2',
			new THREE.Float32BufferAttribute(
				grave.geometry.attributes.uv.array,
				2
			)
		);
		grave.position.set(x, Math.random() * 0.4, z);
		grave.rotation.y = (Math.random() - 0.5) * 0.4;
		grave.rotation.z = (Math.random() - 0.5) * 0.4;
		grave.castShadow = true;
		graves.add(grave);
	} else {
		const cross = new THREE.Group();
		const mainPole = new THREE.Mesh(crossGeometryMain, graveMaterial);
		const sidePole = new THREE.Mesh(crossGeometrySecondary, graveMaterial);
		mainPole.geometry.setAttribute(
			'uv2',
			new THREE.Float32BufferAttribute(
				mainPole.geometry.attributes.uv.array,
				2
			)
		);
		sidePole.geometry.setAttribute(
			'uv2',
			new THREE.Float32BufferAttribute(
				sidePole.geometry.attributes.uv.array,
				2
			)
		);
		sidePole.position.set(0, 0.15, 0);
		mainPole.castShadow = true;
		sidePole.castShadow = true;
		cross.add(mainPole);
		cross.add(sidePole);

		cross.position.set(x, Math.random() * 0.4, z);
		cross.rotation.y = (Math.random() - 0.5) * 0.4;
		cross.rotation.z = (Math.random() - 0.5) * 0.4;
		graves.add(cross);
	}
}

// Floor
const floor = new THREE.Mesh(
	new THREE.PlaneGeometry(20, 20),
	new THREE.MeshStandardMaterial({
		map: grassColorTexture,
		aoMap: grassAmbientOcclusionTexture,
		roughnessMap: grassRoughnessTexture,
		displacementMap: graveHeightTexture,
		displacementScale: 0.01,
		normalMap: grassNormalTexture,
	})
);
floor.geometry.setAttribute(
	'uv2',
	new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2)
);
floor.rotation.x = -Math.PI * 0.5;
floor.position.y = 0;
scene.add(floor);

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.12);
scene.add(ambientLight);

// Directional light
const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.12);
moonLight.position.set(4, 5, -2);
scene.add(moonLight);

// Door Light
const doorLight = new THREE.PointLight('#ff7d46', 1, 7);
doorLight.position.set(0, 2.2, 2.7);
house.add(doorLight);

/**
 * Ghosts
 */
const ghost1 = new THREE.PointLight('#ff0ff0', 1.8, 3);
scene.add(ghost1);
const ghost2 = new THREE.PointLight('#00ffff', 2, 3);
scene.add(ghost2);
const ghost3 = new THREE.PointLight('#ffff00', 2, 3);
scene.add(ghost3);

/**
 * Sizes
 */
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
};

window.addEventListener('resize', () => {
	// Update sizes
	sizes.width = window.innerWidth;
	sizes.height = window.innerHeight;

	// Update camera
	camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix();

	// Update renderer
	renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
	75,
	sizes.width / sizes.height,
	0.1,
	100
);
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 5;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.maxDistance = 10;
controls.minDistance = 3.5;
controls.maxPolarAngle = Math.PI * 0.5 - 0.05;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor('#262837');
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

/**
 * Shadows
 */
moonLight.castShadow = true;

doorLight.castShadow = true;
doorLight.shadow.mapSize.width = 256;
doorLight.shadow.mapSize.height = 256;
doorLight.shadow.camera.far = 7;

ghost1.castShadow = true;
ghost1.shadow.mapSize.width = 256;
ghost1.shadow.mapSize.height = 256;
ghost1.shadow.camera.far = 7;

ghost2.castShadow = true;
ghost2.shadow.mapSize.width = 256;
ghost2.shadow.mapSize.height = 256;
ghost2.shadow.camera.far = 7;

ghost3.castShadow = true;
ghost2.shadow.mapSize.width = 256;
ghost2.shadow.mapSize.height = 256;
ghost2.shadow.camera.far = 7;

walls.castShadow = true;
// bushes created programatically above, shadow added there
// graves also created programatically, shadow added there

floor.receiveShadow = true;

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
	const elapsedTime = clock.getElapsedTime();

	//Update ghosts
	const ghost1Angle = elapsedTime * 0.5;
	ghost1.position.x = Math.cos(ghost1Angle) * 4;
	ghost1.position.z = Math.sin(ghost1Angle) * 4;
	ghost1.position.y = Math.sin(ghost1Angle * 3);

	const ghost2Angle = -elapsedTime * 0.32;
	ghost2.position.x = Math.cos(ghost2Angle) * 6;
	ghost2.position.z = Math.sin(ghost2Angle) * 6;
	ghost2.position.y = Math.sin(ghost2Angle * 4) + Math.sin(elapsedTime * 2.5);

	const ghost3Angle = -elapsedTime * 0.18;
	ghost3.position.x =
		Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32));
	ghost3.position.z =
		Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5));
	ghost3.position.y = Math.sin(ghost3Angle * 4) + Math.sin(elapsedTime * 2.5);

	// Update controls
	controls.update();

	// Render
	renderer.render(scene, camera);

	// Call tick again on the next frame
	window.requestAnimationFrame(tick);
};

tick();
