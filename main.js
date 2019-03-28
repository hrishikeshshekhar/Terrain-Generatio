// Creating the plane
const plane_geo = new THREE.PlaneGeometry(max + 2, max + 2, max + 2, max + 2);
let terrain;

// Creating water at y = 0
const dist = max + 2;
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
    texture = createTexture(length + 2, length + 2, vertices);

    // Updating the plane vertices
    updateVertices(plane_geo);
}

// A helper function to create the texture
function createTexture(width, height, vertices){
    // Deciding on the starting and finishing colors 
    const r1 = 50;
    const g1 = 220;
    const b1 = 100;

    const r2 = 101;
    const g2 = 67;
    const b2 = 33;

    // Finding the max height
    const max_height = FindMax(vertices);

    const map_size = width * height;
    var data = new Uint8Array(map_size * 3);

    // Colouring the normal area
    for(let i = 0; i < width; ++i){
        for(let j = 0; j < height; ++j){
            // Flipping the orientation about the x - axis
            const index = ((height - i - 1) * width + j) * 3;
            if(i == 0 || j == 0 || i == width - 1 || j == height - 1){
                data[index] = r1;
                data[index + 1] = g1;
                data[index + 2] = b1;
            }
            else{
                if(vertices[i - 1][j - 1] < 0){
                    data[index] = 255;
                    data[index + 1] = 0;
                    data[index + 2] = 0; 
                }
                else{
                    data[index] = Math.floor(r1 + (r2 - r1) * (vertices[i - 1][j - 1] / max_height));
                    data[index + 1] = Math.floor(g1 + (g2 - g1) * (vertices[i - 1][j - 1] / max_height));
                    data[index + 2] = Math.floor(b1 + (b2 - b1) * (vertices[i - 1][j - 1] / max_height)); 
                }
            }
        }
    }

    const texture = new THREE.DataTexture(data, width, height, THREE.RGBFormat);
    texture.needsUpdate = true;

    console.log(texture);
    return texture;
}

function FindMax(vertices){
    // Iterating through the vertices
    let max_size = 0;
    for(let i = 0; i < vertices.length; ++i){
        for(let j = 0; j < vertices.length; ++j){
            const vertex = vertices[i][j];
            if(vertex > max_size){
                max_size = vertex;
            }
        }
    }
    return max_size;
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

// Function to animate
function animate(){
    requestAnimationFrame(animate); 
    renderer.render(scene, camera);
}

// Function to init the plane
function initPlane(){
    // Creating the plane
    const ter_mat_props = {
        specular: 0xffffff,     
        // wireframe : true,
        // color : 0x00FF00
        map : texture
    }

    // Setting the plane to update vertices
    plane_geo.verticesNeedUpdate = true;

    // Creating the plane with the given texture
    const ter_mat = new THREE.MeshStandardMaterial(ter_mat_props);    
    let plane = new THREE.Mesh(plane_geo, ter_mat);
    
    // Rotating the plane to face us
    plane.rotation.x -= Math.PI / 2;

    scene.add(plane);
}

// Calling the init function
init();

// Init the plane
initPlane();

// Calling the animate function
animate();
