// Function to draw the axes

function drawAxes(scene){

    // X - Axis : Purple
    const line_geo1 = new THREE.Geometry();
    const line_mat1 = new THREE.LineBasicMaterial({
        color : 0xFF00FF
    });
    line_geo1.vertices.push(new THREE.Vector3(-100, 0, 0));
    line_geo1.vertices.push(new THREE.Vector3(100, 0, 0));
    const line1 = new THREE.Line(line_geo1, line_mat1);
    scene.add(line1);

    // Y - Axis : Yellow
    const line_geo2 = new THREE.Geometry();
    const line_mat2 = new THREE.LineBasicMaterial({
        color : 0xFFFF00
    });
    line_geo2.vertices.push(new THREE.Vector3(0, -100, 0));
    line_geo2.vertices.push(new THREE.Vector3(0, 100, 0));
    const line2 = new THREE.Line(line_geo2, line_mat2);
    scene.add(line2);

    // Z - Axis : Cyan
    const line_geo3 = new THREE.Geometry();
    const line_mat3 = new THREE.LineBasicMaterial({
        color : 0x00FFFF
    });
    line_geo3.vertices.push(new THREE.Vector3(0, 0, -100));
    line_geo3.vertices.push(new THREE.Vector3(0, 0, 100));
    const line3 = new THREE.Line(line_geo3, line_mat3);
    scene.add(line3);

}
