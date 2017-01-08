module.exports = {
  type: "WallTop",
  onCreate: function () {
    var plane = new p2.Body({
      position : [0, 19.2],
      angle: Math.PI,
    });

    var planeShape = new p2.Plane();

    planeShape.material = game.materials.wallMaterial;

    plane.addShape(planeShape);
    
    game.world.addBody(plane);

    this.addComponent("Body", plane);
  }
}
