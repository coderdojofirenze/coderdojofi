$fn=100;

module body() {
    union() {
        translate([0, 0, 16]) sphere(5);
        translate([0, 0, 8]) sphere(6);
        sphere(7);
    }
}

module eyes() {
    translate([2, -2, 17.5]) rotate([0, 90, 0]) cylinder(3, 1, 1);
    translate([2, 2, 17.5]) rotate([0, 90, 0]) cylinder(3, 1, 1);
}

module nose() {
    translate([4.5, 0, 15]) rotate([0, 90, 0]) cylinder(5, 1, 0);
}

difference() {
    union() {
        body();
        nose();
    }
    eyes();
}