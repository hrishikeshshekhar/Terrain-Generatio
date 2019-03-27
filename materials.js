// Storing all the materials

// Material for the terrian
const ter_mat_props = {
    color : 0x00FF00,
    emissive: 0x2a0000, 
    shininess: 10,
    specular: 0xffffff,     
    wireframe : true
}
const ter_mat = new THREE.MeshStandardMaterial(ter_mat_props);

// Water material
const water_mat = new THREE.MeshBasicMaterial({
    color : 0x0000FF,
    // wiremesh : true
})

