// Creating the plane when the texture loads
const plane_geo = new THREE.PlaneGeometry(max + 2, max + 2, max + 2, max + 2);
const plane = new THREE.Mesh(plane_geo, ter_mat);
scene.add(plane);

// Creating water at y = 0
const dist = max;
const water_geo = new THREE.PlaneGeometry(dist, dist, dist, dist);
water_geo.translate(0, 0, 0);
water_geo.rotateX(-Math.PI / 2);
const ground = new THREE.Mesh(water_geo, water_mat);
scene.add(ground);

function init(){

    // Initializing all constants
    initializeConstants();

    // Drawing axes
    drawAxes(scene);

    // Calling divide
    divide(max);

    // Creating the texture
    texture = createTexture(max + 2, max + 2, plane_geo.vertices);
}

function createTexture(width, height, vertices){
    console.log(vertices);

}

function initializeConstants(){

    // Creating the array
    for(let i = 0; i < length; ++i){
        let row = new Array();
        for(let j = 0; j < length; ++j){
            row.push(0);
        }
        vertices.push(row);
    }

    // Setting the corner 4 vertices with some random value
    vertices[0][0] = init_min + Math.random() * (init_max - init_min);
    vertices[0][max] = init_min + Math.random() * (init_max - init_min);
    vertices[max][0] = init_min + Math.random() * (init_max - init_min);
    vertices[max][max] = init_min + Math.random() * (init_max - init_min);

    // Rotating the plane to face us
    plane.rotation.x -= Math.PI / 2;

    // Setting the plane to update vertices
    plane_geo.verticesNeedUpdate = true;
}

// Starting the square and diamond process
function divide(size){

    const half = Math.floor(size / 2); 
    if(half < 1){
        return;
    }

    // Doing the square iteration
    for(let y = half; y <= max; y += size){
        for(let x = half; x <= max; x += size){
            const scale = roughness * size;
            const offset = Math.random() * scale - (scale / 2);
            square(x, y, half, offset);
        }
    }

    // Doing the diamond iterations
    for(let y = 0; y <= max; y += half){
        let x = 0;
        if(y % size == 0){
            x = half;
        }
        for(; x <= max; x += size){
            const scale = roughness * size;
            const offset = Math.random() * scale - (scale / 2);
            diamond(x, y, half, offset);
        }   
    }

    // Updating the plane vertices
    updateVertices();

    // Recursively calling itself
    divide(size / 2);
}

// Helper function to update plane vertices with internal representation of vertices
function updateVertices(){
   
    // Setting the vertices of the plane to these vertices
    for(let y = 0; y < length; ++y){
        for(let x = 0; x < length; ++x){
            if(vertices[y][x] > 0){
                plane_geo.vertices[(y + 1) * (length + 2) + (x + 1)].z = vertices[y][x];
            }
            else{
                plane_geo.vertices[(y + 1) * (length + 2) + (x + 1)].z = -1;
            }
        }
    }

    // Forcing the plane to update the vertives dynamically
    plane_geo.verticesNeedUpdate = true;

}

// Function to check valid position
function isValid(x, y){
    return (x >= 0 && x <= max && y >= 0 && y <= max);
}

// Function to decide height for squares
function square(x, y, size, offset){
    let sum = 0;
    let count = 0;
    if(isValid(y + size, x + size)){
        sum += vertices[y + size][x + size];
        ++count;
    }
    if(isValid(y - size, x + size)){
        sum += vertices[y - size][x + size];
        ++count;
    }
    if(isValid(y + size, x - size)){
        sum += vertices[y + size][x - size];
        ++count;
    }
    if(isValid(y - size, x - size)){
        sum += vertices[y - size][x - size];
        ++count;
    }
    if(count != 0){
        // Setting the position as the average of the 4 positions plus the offset
        const new_height = (sum / count) + offset;
        vertices[y][x] = new_height; 
    }
    else{
        vertices[y][x] = offset;
    }
}

// Function to decide heights of diamond squares
function diamond(x, y, size, offset){
    let sum = 0;
    let count = 0;
    console.log(size);
    if(isValid(y, x + size)){
        sum += vertices[y][x + size];
        ++count;
    }
    if(isValid(y - size, x)){
        sum += vertices[y - size][x];
        ++count;
    }
    if(isValid(y, x - size)){
        sum += vertices[y][x - size];
        ++count;
    }
    if(isValid(y + size, x)){
        sum += vertices[y + size][x];
        ++count;
    }
    if(count != 0){
        // Setting the position as the average of the 4 positions plus the offset
        const new_height = (sum / count) + offset;
        vertices[y][x] = new_height; 
    }
    else{
        vertices[y][x] = offset;
    }
}

// Adding fog
scene.fog = new THREE.Fog(0xCC2F4F, near, far);

// Function to animate
function animate(){
    requestAnimationFrame(animate); 
    renderer.render(scene, camera);
}

// Calling the init function
init();

// Calling the animate function
animate();
