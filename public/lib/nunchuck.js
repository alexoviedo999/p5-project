(function(window, document) {
    'use strict';

    var _instance;
    var touchPad = {};

    var nunchuck = {
        get: function() {
            return _instance;
        },
        init: function(type, socket) {
            return _instance || new Nunchuck({
                type: type,
                socket: socket
            })
        }
    };

    /**
     * Nunchuck Constructor
     */

    function Nunchuck(options) {
        _instance = this;
        this.id = Math.floor(Math.random() * 9000) + 1000;
        this.username = "";
        this.audioPick = "";
        this.roomId = this.id;
        this.type = options.type;
        this.socket = options.socket;
        this.prevData = null;
        this.buttons = [];
        this.sliders = [];
        this.touchPad = touchPad;

        if (this.type == 'host') {
            this.socket.emit('nunchuck-create', this.id);
            console.log(this.id);
        }
    }

    Nunchuck.prototype.onJoin = function(callback) {
        nunchuck = this;
        this.socket.on('nunchuck-join', function(data) {
            var err;
            nunchuck.roomId = data.id;
            if (nunchuck.type === 'player') {
                nunchuck.send();
            }
            if (!data.success) {
                err = {
                    msg: data.msg
                }
            }
            callback(data, err);
        });
    };

    Nunchuck.prototype.join = function(username, id, audioPick) {
        if (this.type == 'player') {
            this.socket.emit('nunchuck-join', {
                id: id,
                username: username,
                audioPick: audioPick
            });
            this.username = username;

        }
    };

    Nunchuck.prototype.send = function() {

        if (window.DeviceOrientationEvent) {
            var options = {
                alphaThreshold: 5,
                betaThreshold: 5,
                gammaThreshold: 5,
                radians: false
            };

            _instance.prevData = {
                alpha: 0,
                beta: 0,
                gamma: 0
            };

            window.addEventListener('deviceorientation', function(eventData) {

                var data = {
                    alpha: options.radians ? eventData.alpha * Math.PI / 180.0 : eventData.alpha,
                    beta: options.radians ? eventData.beta * Math.PI / 180.0 : eventData.beta,
                    gamma: options.radians ? eventData.gamma * Math.PI / 180.0 : eventData.gamma
                };

                if (Math.abs(data.alpha - _instance.prevData.alpha) >= options.alphaThreshold ||
                    Math.abs(data.beta - _instance.prevData.beta) >= options.betaThreshold ||
                    Math.abs(data.gamma - _instance.prevData.gamma) >= options.gammaThreshold
                ) {

                    _instance.socket.emit('nunchuck-data', {
                        username: _instance.username,
                        roomId: _instance.roomId,
                        buttons: _instance.buttons,
                        sliders: _instance.sliders,
                        touchPad: touchPad,
                        orientation: data,
                        timestamp: Date.now()
                    });
                    _instance.prevData = data;
                }
            })
        }

        // Add button listeners
        var buttons = document.getElementsByClassName('nunchuck-button');

        for (var i = 0; i < buttons.length; i++) {
            buttons[i].addEventListener('touchstart', function(e) {
                if (_instance.buttons.indexOf(this.id) < 0) {
                    _instance.buttons.push(this.id);
                }
                _instance.socket.emit('nunchuck-data', {
                    username: _instance.username,
                    roomId: _instance.roomId,
                    buttons: _instance.buttons,
                    sliders: _instance.sliders,
                    touchPad: touchPad,
                    orientation: _instance.prevData,
                    timestamp: Date.now()
                });
            });

            buttons[i].addEventListener('touchmove', function(e) {
                e.preventDefault()
            });

            buttons[i].addEventListener('touchend', function(e) {
                if (_instance.buttons.indexOf(this.id) > -1) {
                    _instance.buttons.splice(_instance.buttons.indexOf(this.id), 1)
                }
                _instance.socket.emit('nunchuck-data', {
                    username: _instance.username,
                    roomId: _instance.roomId,
                    buttons: _instance.buttons,
                    sliders: _instance.sliders,
                    touchPad: touchPad,
                    orientation: _instance.prevData,
                    timestamp: Date.now()
                });
            });
        }


        // Add slider listeners
        var sliders = document.getElementsByClassName('nunchuck-slider');
        var slider = {};
        for (var i = 0; i < sliders.length; i++) {
            sliders[i].addEventListener('touchstart', function(e) {
                if (_instance.sliders.indexOf(this.id) < 0) {

                    slider[this.id] = this.value;
                    _instance.sliders.push(slider);
                }
                _instance.socket.emit('nunchuck-data', {
                    username: _instance.username,
                    roomId: _instance.roomId,
                    buttons: _instance.buttons,
                    sliders: _instance.sliders,
                    touchPad: touchPad,
                    orientation: _instance.prevData,
                    timestamp: Date.now()
                });
            });

            sliders[i].addEventListener('touchmove', function(e) {
                
                if (_instance.sliders.indexOf(this.id) < 0) {

                    slider[this.id] = this.value;
                    _instance.sliders.push(slider);
                }
                _instance.socket.emit('nunchuck-data', {
                    username: _instance.username,
                    roomId: _instance.roomId,
                    buttons: _instance.buttons,
                    sliders: _instance.sliders,
                    touchPad: touchPad,
                    orientation: _instance.prevData,
                    timestamp: Date.now()
                });
            });

            sliders[i].addEventListener('touchend', function(e) {

                if (_instance.sliders.indexOf(this.id) > -1) {
                    _instance.sliders.splice(_instance.sliders.indexOf(this.id), 1)
                }
                _instance.socket.emit('nunchuck-data', {
                    username: _instance.username,
                    roomId: _instance.roomId,
                    buttons: _instance.buttons,
                    sliders: _instance.sliders,
                    touchPad: touchPad,
                    orientation: _instance.prevData,
                    timestamp: Date.now()
                });
            });
        }


        var canvasTouch = document.getElementById('defaultCanvas');
        if(canvasTouch){

        canvasTouch.addEventListener('touchstart', function(e) {
            console.log('touchCanvas: ' + e);

             touchPad = {
                posX: e.view.posX,
                posXp: e.view.posXp,
                posY: e.view.posY,
                posYp: e.view.posYp,
                tWidth: tWidth,
                tHeight: tHeight
            }

            _instance.socket.emit('nunchuck-data', {
                username: _instance.username,
                roomId: _instance.roomId,
                buttons: _instance.buttons,
                sliders: _instance.sliders,
                touchPad: touchPad,
                orientation: _instance.prevData,
                timestamp: Date.now()
            });
        });

        canvasTouch.addEventListener('touchmove', function(e) {
            e.preventDefault()

            touchPad = {
                posX: e.view.posX,
                posXp: e.view.posXp,
                posY: e.view.posY,
                posYp: e.view.posYp,
                tWidth: tWidth,
                tHeight: tHeight
            }

            _instance.socket.emit('nunchuck-data', {
                username: _instance.username,
                roomId: _instance.roomId,
                buttons: _instance.buttons,
                sliders: _instance.sliders,
                touchPad: touchPad,
                orientation: _instance.prevData,
                timestamp: Date.now()
            });
        });

        canvasTouch.addEventListener('touchend', function(e) {

             touchPad = {
                posX: e.view.posX,
                posXp: e.view.posXp,
                posY: e.view.posY,
                posYp: e.view.posYp,
                tWidth: tWidth,
                tHeight: tHeight
            }

            _instance.socket.emit('nunchuck-data', {
                username: _instance.username,
                roomId: _instance.roomId,
                buttons: _instance.buttons,
                sliders: _instance.sliders,
                touchPad: touchPad,
                orientation: _instance.prevData,
                timestamp: Date.now()
            });
        });

        }

    };

    Nunchuck.prototype.receive = function(callback) {
        this.socket.on('nunchuck-data', function(data) {
            callback(data);
        })
    };


    window.nunchuck = nunchuck;

}(window, document));