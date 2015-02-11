function setup() {
 backgroundColour = color(255, 255, 255);
 nodeColour = color(40, 168, 107);
 edgeColour = color(34, 68, 204);
 nodeSize = 8;

var node0 = [-100, -100, -100];
var node1 = [-100, -100,  100];
var node2 = [-100,  100, -100];
var node3 = [-100,  100,  100];
var node4 = [ 100, -100, -100];
var node5 = [ 100, -100,  100];
var node6 = [ 100,  100, -100];
var node7 = [ 100,  100,  100];
nodes = [node0, node1, node2, node3, node4, node5, node6, node7];
for(var x = -50; x <=50; x+=100){
for(var y = -50; y <=50; y+=100){
for(var z = -50; z <=50; z+=100){
    nodes.push([x,y,z]);
}
}
}
var edge0  = [0, 1];
var edge1  = [1, 3];
var edge2  = [3, 2];
var edge3  = [2, 0];
var edge4  = [4, 5];
var edge5  = [5, 7];
var edge6  = [7, 6];
var edge7  = [6, 4];
var edge8  = [0, 4];
var edge9  = [1, 5];
var edge10 = [2, 6];
var edge11 = [3, 7];
edges = [edge0, edge1, edge2, edge3, edge4, edge5, edge6, edge7, edge8, edge9, edge10, edge11,[11,15],[15,14],[14,12],[12,13],[13,15],[10,14],[10,11],[12,8],[8,9],[9,11],[8,10],[9,13],[13,5],[14,6],[15,7],[12,4],[11,3],[10,2],[9,1],[8,0]];
}
// Rotate shape around the z-axis
var rotateZ3D = function(theta) {
    var sin_t = sin(theta);
    var cos_t = cos(theta);
    
    for (var n=0; n<nodes.length; n++) {
        var node = nodes[n];
        var x = node[0];
        var y = node[1];
        node[0] = x * cos_t - y * sin_t;
        node[1] = y * cos_t + x * sin_t;
    }
};

var rotateY3D = function(theta) {
    var sin_t = sin(theta);
    var cos_t = cos(theta);
    
    for (var n=0; n<nodes.length; n++) {
        var node = nodes[n];
        var x = node[0];
        var z = node[2];
        node[0] = x * cos_t - z * sin_t;
        node[2] = z * cos_t + x * sin_t;
    }
};

var rotateX3D = function(theta) {
    var sin_t = sin(theta);
    var cos_t = cos(theta);
    
    for (var n=0; n<nodes.length; n++) {
        var node = nodes[n];
        var y = node[1];
        var z = node[2];
        node[1] = y * cos_t - z * sin_t;
        node[2] = z * cos_t + y * sin_t;
    }
};

function draw() {
    background(backgroundColour);
    
    // Draw edges
    stroke(edgeColour);
    for (var e=0; e<edges.length; e++) {
        var n0 = edges[e][0];
        var n1 = edges[e][1];
        var node0 = nodes[n0];
        var node1 = nodes[n1];
        line(node0[0], node0[1], node1[0], node1[1]);
    }

    // Draw nodes
    fill(nodeColour);
    noStroke();
    for (var n=0; n<nodes.length; n++) {
        var node = nodes[n];
        ellipse(node[0], node[1], nodeSize, nodeSize);
    }
    translate(200, 200);
};

var mouseDragged = function() {
    rotateY3D(mouseX - pmouseX);
    rotateX3D(mouseY - pmouseY);
};


