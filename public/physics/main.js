Ammo().then((Ammo) => {
    let syncList = [];
    let TRANSFORM_AUX = new Ammo.btTransform();
    let clock = new THREE.Clock();

    // Set up graphics
    let scene = new THREE.Scene();

    // Set up physics
    let collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
    let dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration);
    let broadphase = new Ammo.btDbvtBroadphase();
    let solver = new Ammo.btSequentialImpulseConstraintSolver();
    let physicsWorld = new Ammo.btDiscreteDynamicsWorld(dispatcher, broadphase, solver, collisionConfiguration);
    physicsWorld.setGravity(new Ammo.btVector3(0, -9.81, 0));

    // Create ground
    createBox(
        0,
        new THREE.Vector3(0, 0, 0),
        {w: 100, h: 1, d: 100},
        new THREE.Quaternion(0, 0, 0, 1),
        0xffffff,
    );

    // Cubes
    for (let i = 0; i < 10; i += 1) {
        let box = createBox(
            0.1,
            new THREE.Vector3(0, 5 + i / 2, 0),
            {w: 0.7, h: 0.7, d: 0.7},
            new THREE.Quaternion(0, 0, 0, 1),
            Math.random() * 0xffffff,
        );
        box.setFriction(4.7);
    }

    // Create player
    let r = Math.random()
    let player = createBox(
        1,
        new THREE.Vector3(0, 3, 0),
        {w: 0.5, h: 0.2, d: 0.5},
        new THREE.Quaternion(-0.1 + r * -0.2, -0.2 + r * 0.4, -0.1 + r * 0.2, -1 + r * 2),
        0xff0000
    );

    // Listen for keydown
    let controls = {
        x: 0,
        z: 0
    };
    let strength = 15;
    window.addEventListener('keydown', (e) => {
        console.log(e.key);
        if (e.key == 'ArrowUp') {
            controls.z = strength;
        }
        if (e.key == 'ArrowLeft') {
            controls.x = strength;
        }
        if (e.key == 'ArrowDown') {
            controls.z = -strength;
        }
        if (e.key == 'ArrowRight') {
            controls.x = -strength;
        }
        console.log(controls);
    });
    window.addEventListener('keyup', (e) => {
        if (e.key == 'ArrowUp' || e.key == 'ArrowDown') {
            controls.z = 0;
        }
        if (e.key == 'ArrowLeft' || e.key == 'ArrowRight') {
            controls.x = 0;
        }
    });

    // Create camera
    let camera = new THREE.PerspectiveCamera(50, 1, 0.2, 2000);
    camera.position.y = 4.3;
    camera.position.z = -9.11;
    camera.lookAt(new THREE.Vector3(0, 2, 0));
    
    // Create renderer
    let renderer = new THREE.WebGLRenderer();
    renderer.setSize(960, 960);
    document.body.appendChild(renderer.domElement);
    if (window.innerWidth > window.innerHeight) {
        renderer.domElement.style.width = 'auto';
        renderer.domElement.style.height = '100vh';
    } else {
        renderer.domElement.style.width = '100%';
        renderer.domElement.style.height = 'auto';
    }
    renderer.domElement.style.margin = 'auto';
    renderer.setClearColor(0xbfd1e5);
    renderer.outputEncoding = THREE.sRGBEncoding;

    // Create Stats
    stats = new Stats();
    document.body.appendChild(stats.domElement);

    // Start rendering
    tick();
    function tick() {
        // For every frame:

        // 1. Simulate physicsd
        let dt = clock.getDelta()
        physicsWorld.stepSimulation(dt, 10);

        // Camera
        player.applyCentralForce(new Ammo.btVector3(controls.x, 0, controls.z));
        let ms = player.getMotionState();
        ms.getWorldTransform(TRANSFORM_AUX);
        let p = TRANSFORM_AUX.getOrigin();
        camera.position.x = p.x();
        // camera.position.y = p.y() + 3.3;
        camera.position.z = p.z() - 9.11;
        
        // 2. Update graphics
        // (Sync each mesh with its motionstates)
        for (let i = 0; i < syncList.length; i += 1) {
            syncList[i]();
        }
        
        // 3. Render!
        renderer.render(scene, camera);
        
        // 4. Request next frame
        requestAnimationFrame(tick);
        stats.update();
    }

    // Helper function for creating box within three.js & ammo.js
    function createBox(mass, pos, size, quat, color) {

        // three.js
        let shape = new THREE.BoxGeometry(size.w, size.h, size.d)
        let material = new THREE.MeshMatcapMaterial({ color: color})
        let mesh = new THREE.Mesh(shape, material);
        mesh.position.copy(pos);
        mesh.quaternion.copy(quat);
        scene.add(mesh);

        // ammo.js
        let transform = new Ammo.btTransform();
        transform.setIdentity();
        transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
        transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));
        let motionState = new Ammo.btDefaultMotionState(transform);

        let geometry = new Ammo.btBoxShape(new Ammo.btVector3(size.w * 0.5, size.h * 0.5, size.d * 0.5));
        let localInertia = new Ammo.btVector3(0, 0, 0);
        geometry.calculateLocalInertia(mass, localInertia);

        let rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, geometry, localInertia);
        let body = new Ammo.btRigidBody(rbInfo);
        physicsWorld.addRigidBody(body);

        // Declare function for syncing this mesh with its motionstate
        if (mass > 0) {
            function sync() {
                
                let ms = body.getMotionState();
                if (ms) {
                    ms.getWorldTransform(TRANSFORM_AUX);
                    let p = TRANSFORM_AUX.getOrigin();
                    let q = TRANSFORM_AUX.getRotation();
                    mesh.position.set(p.x(), p.y(), p.z());
                    mesh.quaternion.set(q.x(), q.y(), q.z(), q.w());
                }
            }
            syncList.push(sync);
        }

        return body;
    }
});