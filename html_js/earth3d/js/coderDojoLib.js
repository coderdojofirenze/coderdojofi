

// A cross-browser requestAnimationFrame
// See https://hacks.mozilla.org/2011/08/animating-with-javascript-from-setinterval-to-requestanimationframe/
var requestAnimFrame = (function(){
    return window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(callback){
            window.setTimeout(callback, 1000 / 60);
        };
})();


(function() {
    var pressedKeys = {};

    function setKey(event, status) {
        var code = event.keyCode;
        var key;

//		alert( "keyCode for the key pressed: " + e.keyCode + "\n" );
        switch(code) {
        case 32:
            key = 'SPACE'; break;
        case 37:
            key = 'LEFT'; break;
        case 38:
            key = 'UP'; break;
        case 39:
            key = 'RIGHT'; break;
        case 40:
            key = 'DOWN'; break;
        default:
            // Convert ASCII codes to letters
            key = String.fromCharCode(code);
        }

        pressedKeys[key] = status;
    }

    document.addEventListener('keydown', function(e) {
        setKey(e, true);
    });

    document.addEventListener('keyup', function(e) {
        setKey(e, false);
    });

    window.addEventListener('blur', function() {
        pressedKeys = {};
    });

    window.input = {
        isDown: function(key) {
            return pressedKeys[key.toUpperCase()];
        }
    };
})();

(function() {
    var resourceCache = {};
    var loading = [];
    var readyCallbacks = [];

    // Load an image url or an array of image urls
    function load(urlOrArr) {
        if(urlOrArr instanceof Array) {
            urlOrArr.forEach(function(url) {
                _load(url);
            });
        }
        else {
            _load(urlOrArr);
        }
    }

    function _load(url) {
        if(resourceCache[url]) {
            return resourceCache[url];
        }
        else {
            var img = new Image();
            img.onload = function() {
                resourceCache[url] = img;

                if(isReady()) {
                    readyCallbacks.forEach(function(func) { func(); });
                }
            };
            resourceCache[url] = false;
            img.src = url;
        }
    }

    function get(url) {
        return resourceCache[url];
    }

    function isReady() {
        var ready = true;
        for (var k in resourceCache) {
            if (resourceCache.hasOwnProperty(k) &&
               !resourceCache[k]) {
                ready = false;
				break;
            }
        }
        return ready;
    }

    function onReady(func) {
        readyCallbacks.push(func);
    }

    window.resources = { 
        load: load,
        get: get,
        onReady: onReady,
        isReady: isReady
    };
})();

(function() {
    function Sprite(url, pos, size, speed, frames, dir, once) {
        this.pos = pos;
        this.size = size;
        this.speed = typeof speed === 'number' ? speed : 0;
        this.frames = frames;
        this._index = 0;
        this.url = url;
        this.dir = dir || 'horizontal';
        this.once = once;
    };

    Sprite.prototype = {
        update: function(dt) {
            this._index += this.speed*dt;
        },

        render: function(ctx) {
            var frame;

            if(this.speed > 0) {
                var max = this.frames.length;
                var idx = Math.floor(this._index);
                frame = this.frames[idx % max];

                if(this.once && idx >= max) {
                    this.done = true;
                    return;
                }
            }
            else {
                frame = 0;
            }


            var x = this.pos[0];
            var y = this.pos[1];

            if(this.dir == 'vertical') {
                y += frame * this.size[1];
            }
            else {
                x += frame * this.size[0];
            }

            ctx.drawImage(resources.get(this.url),
                          x, y,
                          this.size[0], this.size[1],
                          0, 0,
                          this.size[0], this.size[1]);
        }
    };

    window.Sprite = Sprite;
})();


(function() {
	var camera, controls, scene, renderer;
	var SCREEN_WIDTH, SCREEN_HEIGHT;
	var deltaTheta, render;
	var teta = Math.PI / 2, camr = 40;
	var firstAnimate = true;
	var lastTime = Date.now();

	function renderAuto() {
		requestAnimationFrame(renderAuto);
		var now = Date.now();
		var dt = (now - lastTime) / 1000.0;
		lastTime = now;
		teta += deltaTheta * dt;
		teta %= 2 * Math.PI;
		camera.position.x = camr * Math.sin(teta);
		camera.position.z = camr * Math.cos(teta);
		camera.lookAt(scene.position);
		renderer.render(scene, camera);
	};

	function renderTrack() {
		renderer.render( scene, camera );
	};

	function animate() {
		if (firstAnimate)
			renderTrack();
		requestAnimationFrame( animate );
		controls.update();
	};

	// da rivedere
	function onWindowResize() {
		SCREEN_WIDTH = window.innerWidth - 4;
		SCREEN_HEIGHT = window.innerHeight - 4;

		camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
		camera.updateProjectionMatrix();

		if (typeof controls !== 'undefined')
			controls.handleResize();
		renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
		render();
	};

    function cdRender3d(options) {
		options = options || {};
		SCREEN_WIDTH = (typeof options.width === 'number' ? options.width : (window.innerWidth - 4));
		SCREEN_HEIGHT = (typeof options.height === 'number' ? options.height : (window.innerHeight - 4));

		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera( 75, SCREEN_WIDTH / SCREEN_HEIGHT, 0.1, 1000 );
		renderer = new THREE.WebGLRenderer( { antialias: true } );
		renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
		document.body.appendChild( renderer.domElement );

		camera.position.z = camr;
		camera.position.y = 5;
		deltaTheta = (typeof options.theta === 'number' ? options.theta : 0.5);

		if (options.ctrl) {
			controls = new THREE.TrackballControls( camera );
			controls.rotateSpeed = 1.0;
			controls.zoomSpeed = 1.2;
			controls.noZoom = false;
			controls.minDistance = camr * 0.7;
			controls.maxDistance = camr * 3;
			//controls.panSpeed = 0.8;
			controls.noPan = true;
			controls.staticMoving = true;
			controls.dynamicDampingFactor = 0.3;
			controls.keys = [ 65, 83, 68 ];
			controls.addEventListener( 'change', renderTrack );
			render = animate;
		} else
			render = renderAuto;
		window.addEventListener('resize', onWindowResize, false );
	};

    cdRender3d.prototype = {
		addMesh: function(geometry, material) {
			var mesh = new THREE.Mesh(geometry, material);
			mesh.overdraw = true;
			scene.add(mesh);
        },
		addPositions: function(positions, options) {
			var geometry = new THREE.Geometry();
			positions = positions || [];
			options = options || {};
			if (typeof options.color !== 'number')
				options.color = 0xd07020;
			if (typeof options.opacity !== 'number')
				options.opacity = 0.8;
			if (typeof options.linewidth !== 'number')
				options.linewidth = 2;
			for (var i = 0; i < positions.length; i ++ ) {
				var p = positions[ i ];

				var vertex1 = new THREE.Vector3();
				var lat = p[0] + 360;
				var lng = (-1 * p[1]) + 360;
				lat = (lat % 360) * Math.PI / 180;
				lng = (lng % 360) * Math.PI / 180;
				vertex1.x = Math.cos(lat) * Math.cos(lng);
				vertex1.z = Math.cos(lat) * Math.sin(lng);
				vertex1.y = Math.sin(lat);
				vertex1.normalize();
				vertex1.multiplyScalar( r );

				var vertex2 = vertex1.clone();
				vertex2.multiplyScalar( p[2] );

				geometry.vertices.push( vertex1 );
				geometry.vertices.push( vertex2 );
			}
			material = new THREE.LineBasicMaterial( options );
			var line = new THREE.Line( geometry, material, THREE.LinePieces );
			scene.add( line );
		},
		addLight: function(color) {
			var ambientLight = new THREE.AmbientLight((typeof color === 'number' ? color : 0xc2c2c2));
			scene.add(ambientLight);
		},

		addSpot: function(color, power, x, y, z) {
			var directionalLight = new THREE.DirectionalLight((typeof color === 'number' ? color : 0xaf9f8f), (typeof power === 'number' ? power : 0.3));
			x = (typeof x === 'number' ? x : 10);
			y = (typeof y === 'number' ? y : 1);
			z = (typeof z === 'number' ? z : 10);
			directionalLight.position.set(x, y, z);
			scene.add(directionalLight);
		},

		getRender: function() {
			return render;
		},

		runRender: function() {
			render();
		}

    };

    window.cdRender3d = cdRender3d;
})();

