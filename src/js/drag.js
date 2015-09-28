var Drag = function(opts) {
	this.opts = {
		targ: null,
		istouch: false,
		x: 0,
		y: 0,
		_x: 0,
		_y: 0,
		positionX: 0,
		positionY: 0,

		enterTart: null,
		enterClass: null,
		enterDom: null,
		enterLX: 0,
		enterLY: 0,
		enterWidth: 0,
		enterHeight: 0,
		isEnter: false,

		dbclick: null,
		firthClick: null,

	};
	for (var i in opts) {
		this.opts[i] = opts[i];
	}

	this._init();

}

Drag.prototype = {
	_init: function() {
		var self = this;

		if (self.opts.enterTart) {
			self.opts.enterDom = document.getElementById(self.opts.enterTart);
			self.opts.enterX = self.opts.enterDom.offsetLeft;
			self.opts.enterY = self.opts.enterDom.offsetTop;
			self.opts.enterWidth = self.opts.enterDom.offsetWidth;
			self.opts.enterHeight = self.opts.enterDom.offsetHeight;
		}


		self._bindEvent();

	},
	_bindEvent: function() {
		var self = this;

		if (self.opts.targ) {
			var targ = document.getElementById(self.opts.targ);

			//console.log(self);
			//默认配置拖拽效果
			targ.addEventListener('touchstart', function(e) {
				self._touchstart(e, targ);
			});
			targ.addEventListener('touchmove', function(e) {
				self._touchmove(e, targ);
			});
			targ.addEventListener('touchend', function(e) {
				self._touchend(e, targ);
			});
		}


		//双击改变尺寸
		if (self.opts.dbclick) {
			targ.addEventListener('dblclick', function(e) {
				self._dblclick(e, targ);
			});
			//console.log(self.opts.dbclick);
		}
	},

	_touchstart: function(e, targ) {
		var self = this;
		e.preventDefault();
		self.opts.istouch = true;

		//保存按下时的当前坐标
		self.opts.x = parseInt(self.getClass(targ, 'left'));
		self.opts.y = parseInt(self.getClass(targ, 'top'));


		//console.log(e);

		//记录鼠标在元素内的坐标点
		self.opts.positionX = e.targetTouches[0].clientX - targ.offsetLeft;
		self.opts.positionY = e.targetTouches[0].clientY - targ.offsetTop;

		self.opts.firthClick -= new Date();

		console.log(self.opts.firthClick.getSeconds());

		// console.log('_touchstart', e.targetTouches[0]);
	},
	_touchmove: function(e, targ) {
		var self = this;
		if (!self.opts.istouch) return;
		e.preventDefault();

		//保存移动后的坐标
		self.opts._x = e.targetTouches[0].clientX;
		self.opts._y = e.targetTouches[0].clientY;

		disX = self.opts._x - self.opts.x;
		disY = self.opts._y - self.opts.y;

		//console.log(self.opts._x);

		if (self.opts.x != self.opts._x || self.opts.y != self.opts._y) {
			targ.style.left = self.opts.x + disX - self.opts.positionX + "px";
			targ.style.top = self.opts.y + disY - self.opts.positionY + "px";


			if (self.opts.enterTart &&
				self.opts._x - self.opts.positionX > (self.opts.enterX - targ.offsetWidth) &&
				self.opts._x - self.opts.positionX < (self.opts.enterX + self.opts.enterWidth) &&
				self.opts._y - self.opts.positionY > (self.opts.enterY - targ.offsetHeight) &&
				self.opts._y - self.opts.positionY < (self.opts.enterY + self.opts.enterHeight)) {

				self.opts.isEnter = true;
				for (var i in self.opts.enterClass) {
					if (i === 'className') {
						self.addClass(self.opts.enterDom, self.opts.enterClass[i]);
						return;
					}
				}
			} else if (self.opts.enterTart) {
				self.opts.isEnter = false;
				for (var i in self.opts.enterClass) {
					if (i === 'className') {
						self.removeClass(self.opts.enterDom, self.opts.enterClass[i]);
						return;
					}
				}
			}
		}
		//console.log('_onmousemove', e.targetTouches[0]);
	},
	_touchend: function(e, targ) {
		var self = this;
		if (!self.opts.istouch) return;
		e.preventDefault();
		//console.log('_onmouseup', e);
		self.opts.istouch = false;

		self.opts.x = self.getClass(targ, "left");
		self.opts.y = self.getClass(targ, "top");

		if (self.opts.isEnter) {
			for (var i in self.opts.enterClass) {
				if (i === 'className') {
					self.removeClass(self.opts.enterDom, self.opts.enterClass[i]);
					return;
				}
			}
		}
	},
	_dblclick: function(e, targ) {
		var self = this,
			i;
		e.preventDefault();

		for (i in self.opts.dbclick) {
			if (i === 'className') {
				self.toggleClass(targ, self.opts.dbclick[i]);
				return;
			}
		}
	},
	getClass: function(o, position) {
		return o.currentStyle ? o.currentStyle[position] : document.defaultView.getComputedStyle(o, false)[position];
	},
	toggleClass: function(targ, className) {
		if (targ.className.indexOf(className) == -1) {
			//不存在className
			targ.className = targ.className + ' ' + className;
		} else {
			//存在className
			targ.className = targ.className.replace(" " + className, "");
		}
	},
	addClass: function(targ, className) {
		if (targ.className.indexOf(className) == -1) {
			targ.className = targ.className + ' ' + className;
		}
	},
	removeClass: function(targ, className) {
		if (targ.className.indexOf(className) > -1) {
			targ.className = targ.className.replace(" " + className, "");
		}
	}

}