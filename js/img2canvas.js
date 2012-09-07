/**
 * @fileOverview Определяется функция "конвертации" изображений в формате *.jpg, 
 * 				загруженных в html-коде, в изображения, реализованные на холсте. 
 * 				Для IE8 и младше загружаются те же изображения в формате *.png8.
 * 				В обоих случаях фоны для изображений одинаковы (формат *.png24), 
 * 				тогда разница между способами представления изображений составляет 105,5кб.
 * 				Основа кода благодаря Александру Бойченко (http://banzalik.ru/transparent-jpg/) 
 * 				взята из источника: http://www.css-ig.net/transparency-jpg-pictures.html
 * @author <a href="http://elkonina.ru/">Конина Елена</a>
 */ 
(function(){
	/**
	 * Функция получает элемент изображения, считывает пользовательские атрибуты,
	 * создает элемент холста, которым замещает изначальное изображение.
	 * В контексте холста маска отсечения накладывается на изображение, так чтобы 
	 * сделать лишнее невидимым (свойство контекста холста globalCompositeOperation
	 * должно быть установлено "xor").
	 * @param {Element} img - изображение, загружаемое на страницу в html-коде
	 */
	var img2Canvas = function(img) {
		/**
		 * значение пользовательского атрибута - адрес маски отсечения
		 * @type {String}
		 */
		var mask = img.getAttribute("data-alpha-src"),
		/**
		 * значение пользовательского атрибута - адрес фона изображения
		 * @type {String}
		 */
			bg = img.getAttribute("data-fon-src"),
		/**
		 * значение пользовательского атрибута - смещение по оси X
		 * @type {Number}
		 */
			dx = img.getAttribute("data-translate-x"),
		/**
		 * значение пользовательского атрибута - смещение по оси Y
		 * @type {Number}
		 */
			dy = img.getAttribute("data-translate-y");
		if (!mask)
			return;
		img.style.visiblity = "hidden";
		/**
		 * imgIn - изображение, загружаемое на холст 
		 * @type {Element} 
		 */
		var imgIn = document.createElement("img");// img inside canvas
		imgIn.src = img.src;
		imgIn.onload = function() {
			/**
			 * maskIn - маска отсечения, загружаемая на холст
			 * @type {Element}  
			 */
			var maskIn = document.createElement("img");// mask inside canvas
			maskIn.src = mask;
			maskIn.onload = function() {
				/**
				 * bgIn - фон, загружаемый на холст
				 * @type {Element}  
				 */
				var bgIn = document.createElement("img");// fon inside canvas
				bgIn.src = bg;
				bgIn.onload = function() {
				
					var canvas = document.createElement("canvas");
					canvas.width = (imgIn.width > bgIn.width) ? imgIn.width : bgIn.width;
					canvas.height = (imgIn.height > bgIn.height) ? imgIn.height : bgIn.height;				
					canvas.className = img.className + '-canvas';
					img.parentNode.replaceChild(canvas, img);
					var ctx = canvas.getContext("2d");
					//сначала контекст холста очищается (на всякий случай)
					ctx.clearRect(0, 0, canvas.width, canvas.height);	
					ctx.translate(dx,dy);						
					ctx.drawImage(imgIn, 0, 0, imgIn.width, imgIn.height);
					ctx.globalCompositeOperation = "xor";
					ctx.drawImage(maskIn, 0, 0, maskIn.width, maskIn.height);		
					ctx.translate(-dx,-dy);						
					ctx.drawImage(bgIn, 0, 0, bgIn.width, bgIn.height);
				}
			}
		}
	};
	window.onload = function () {
		/**
		 * HTMLcollection изображений документа
		 * @type {Element}
		 */
		var imgs = document.images,
			i = imgs.length;
		
		while (i--) {
			if(/decor/.test(imgs[i].className))
				img2Canvas(imgs[i])
		}
	};
	
}())